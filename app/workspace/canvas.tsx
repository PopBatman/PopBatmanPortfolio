"use client";

import { Grip, Maximize, MoreHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState, type DragEvent } from "react";
import { Rnd } from "react-rnd";
import {
  boundRect,
  positionWidget,
  projectRect,
  toLayoutRect,
  type Edges,
  type Guides,
  type Rect,
} from "./geometry";
import { WidgetMenu } from "./widget-menu";
import {
  isWidgetId,
  WIDGET_DRAG_TYPE,
  widgetRegistry,
  type WidgetId,
} from "./widget-registry";
import { layoutBottom, newWidgetRect, sameRect } from "./workspace-layout";

import { useWorkspaceStore } from "./workspace-store";
import { WorkspaceDialog } from "./workspace-dialog";

type Point = Pick<Rect, "x" | "y">;
type Menu = { id: WidgetId; point: Point };
type Preview = { id: WidgetId; rect: Rect; input: Rect; guides: Guides };

export function Canvas({
  desktop,
  draggedId,
  presenting,
}: {
  desktop: boolean;
  draggedId: WidgetId | null;
  presenting: boolean;
}) {
  const layout = useWorkspaceStore((state) => state.layout);
  const dispatch = useWorkspaceStore((state) => state.dispatch);
  const canvas = useRef<HTMLDivElement>(null);
  const previous = useRef(layout.mobileOrder);
  const [width, setWidth] = useState(0);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [dropPoint, setDropPoint] = useState<Point | null>(null);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [expanded, setExpanded] = useState<WidgetId | null>(null);

  useEffect(
    () =>
      useWorkspaceStore.persist.onFinishHydration((state) => {
        previous.current = state.layout.mobileOrder;
      }),
    [],
  );

  useEffect(() => {
    const area = canvas.current;
    if (!area) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.floor(entry.contentRect.width)),
    );
    observer.observe(area);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const added = layout.mobileOrder.find(
      (id) => !previous.current.includes(id),
    );
    previous.current = layout.mobileOrder;
    if (added) {
      const button = document.getElementById(`widget-options-${added}`);
      button?.focus({ preventScroll: true });
      button?.scrollIntoView({ block: "nearest" });
    }
  }, [layout.mobileOrder]);

  const interactive = desktop && width > 0 && !presenting;
  const desktopOrder = Object.keys(layout.rects) as WidgetId[];
  const order = desktop ? desktopOrder : layout.mobileOrder;
  const rects = interactive
    ? desktopOrder.map((id) =>
        projectRect(layout.rects[id]!, width, widgetRegistry[id].minimum),
      )
    : [];
  const dropPreview =
    interactive && draggedId && dropPoint
      ? positionDrop(draggedId, dropPoint)
      : null;
  const guidePreview = preview ?? dropPreview;
  const height = interactive
    ? Math.max(
        709,
        layoutBottom(rects),
        guidePreview ? guidePreview.rect.y + guidePreview.rect.height + 24 : 0,
      )
    : undefined;

  function calculate(id: WidgetId, rect: Rect, edges?: Edges) {
    return positionWidget(
      rect,
      rects.filter((_, index) => desktopOrder[index] !== id),
      width,
      widgetRegistry[id].minimum,
      edges,
    );
  }

  function update(id: WidgetId, rect: Rect, finished: boolean, edges?: Edges) {
    const initial = rects[desktopOrder.indexOf(id)];
    if (finished) {
      setPreview(null);
      if (!initial || sameRect(initial, rect)) return;
      const result = calculate(id, rect, edges);
      dispatch({ type: "place", id, rect: toLayoutRect(result.rect, width) });
    } else {
      setPreview({ id, input: rect, ...calculate(id, rect, edges) });
    }
  }

  function positionDrop(id: WidgetId, point: Point) {
    const size = projectRect(
      newWidgetRect(id, 0),
      width,
      widgetRegistry[id].minimum,
    );
    return calculate(id, { ...size, ...point });
  }

  function drop(event: DragEvent<HTMLDivElement>) {
    setDropPoint(null);
    const id = event.dataTransfer.getData(WIDGET_DRAG_TYPE);
    if (!interactive || !isWidgetId(id) || id !== draggedId) return;
    event.preventDefault();
    const bounds = event.currentTarget.getBoundingClientRect();
    const point = pointerOnCanvas(event);
    if (
      layout.rects[id] ||
      point.x < 0 ||
      point.x >= bounds.width ||
      point.y < 0 ||
      point.y >= bounds.height
    )
      return;
    const { rect } = positionDrop(id, point);
    dispatch({ type: "add", id, rect: toLayoutRect(rect, width) });
  }

  function restoreFocus(id: WidgetId) {
    requestAnimationFrame(() => {
      const control =
        document.getElementById(`widget-options-${id}`) ??
        canvas.current?.querySelector<HTMLButtonElement>(".widget-options") ??
        canvas.current;
      control?.focus({ preventScroll: true });
    });
  }

  function closeMenu(id: WidgetId) {
    setMenu(null);
    restoreFocus(id);
  }

  const menuIndex = menu
    ? (interactive ? layout.layers : layout.mobileOrder).indexOf(menu.id)
    : -1;

  return (
    <main className="canvas" aria-label="Vue d’ensemble du portfolio">
      <div
        ref={canvas}
        className="canvas-grid"
        data-free={interactive}
        data-drop-active={!!dropPreview}
        tabIndex={-1}
        style={{ height }}
        onDragOver={(event) => {
          if (
            interactive &&
            event.dataTransfer.types.includes(WIDGET_DRAG_TYPE)
          ) {
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
            setDropPoint(pointerOnCanvas(event));
          }
        }}
        onDragLeave={(event) => {
          if (
            !(event.relatedTarget instanceof Node) ||
            !event.currentTarget.contains(event.relatedTarget)
          )
            setDropPoint(null);
        }}
        onDrop={drop}
      >
        {order.map((id, i) => {
          const { minimum } = widgetRegistry[id];
          const rect = rects[i];
          const widget = (
            <WidgetFrame
              key={id}
              id={id}
              number={i + 1}
              preview={interactive && preview?.id === id ? preview : null}
              expanded={menu?.id === id || expanded === id}
              presenting={presenting}
              onOpen={(point) => {
                if (presenting) setExpanded(id);
                else setMenu({ id, point });
              }}
            />
          );

          if (!interactive) return widget;

          function start() {
            setPreview({ id, rect, input: rect, guides: { x: null, y: null } });
          }

          function resize(
            node: HTMLElement,
            pos: Pick<Rect, "x" | "y">,
            direction: string,
            finished: boolean,
          ) {
            const edge = direction.toLowerCase();
            update(
              id,
              { ...pos, width: node.offsetWidth, height: node.offsetHeight },
              finished,
              {
                left: edge.includes("left"),
                right: edge.includes("right"),
                top: edge.includes("top"),
                bottom: edge.includes("bottom"),
              },
            );
          }

          return (
            <Rnd
              key={id}
              className="free-widget"
              position={rect}
              size={rect}
              style={{ zIndex: layout.layers.indexOf(id) + 1 }}
              dragHandleClassName="widget-header"
              cancel="button"
              minWidth={minimum.width}
              minHeight={minimum.height}
              resizeHandleClasses={{ bottomRight: "widget-resize-handle" }}
              onDragStart={start}
              onDrag={(_, data) =>
                update(id, { ...rect, x: data.x, y: data.y }, false)
              }
              onDragStop={(_, data) =>
                update(id, { ...rect, x: data.x, y: data.y }, true)
              }
              onResizeStart={start}
              onResize={(_, direction, node, __, pos) =>
                resize(node, pos, direction, false)
              }
              onResizeStop={(_, direction, node, __, pos) =>
                resize(node, pos, direction, true)
              }
            >
              {widget}
            </Rnd>
          );
        })}
        {guidePreview && interactive && (
          <div className="widget-preview" aria-hidden="true">
            <div
              className="widget-snap-outline"
              style={{
                left: guidePreview.rect.x,
                top: guidePreview.rect.y,
                width: guidePreview.rect.width,
                height: guidePreview.rect.height,
              }}
            />
            {guidePreview.guides.x !== null && (
              <div
                className="widget-guide vertical"
                style={{ left: guidePreview.guides.x }}
              />
            )}
            {guidePreview.guides.y !== null && (
              <div
                className="widget-guide horizontal"
                style={{ top: guidePreview.guides.y }}
              />
            )}
          </div>
        )}
        {order.length === 0 && (
          <p className="workspace-empty">
            Ajoutez un widget depuis la bibliothèque.
          </p>
        )}
      </div>
      {menu && menuIndex >= 0 && (
        <WidgetMenu
          key={menu.id}
          title={widgetRegistry[menu.id].title}
          point={menu.point}
          rect={interactive ? rects[desktopOrder.indexOf(menu.id)] : undefined}
          minimum={widgetRegistry[menu.id].minimum}
          canvasWidth={width}
          index={menuIndex}
          count={order.length}
          onClose={() => closeMenu(menu.id)}
          onEnlarge={() => {
            setMenu(null);
            setExpanded(menu.id);
          }}
          onLayer={(action) => dispatch({ type: "layer", id: menu.id, action })}
          onReorder={(step) => dispatch({ type: "reorder", id: menu.id, step })}
          onPlace={(rect) =>
            dispatch({
              type: "place",
              id: menu.id,
              rect: toLayoutRect(
                boundRect(rect, width, widgetRegistry[menu.id].minimum),
                width,
              ),
            })
          }
          onRemove={() => {
            dispatch({ type: "remove", id: menu.id });
            closeMenu(menu.id);
          }}
        />
      )}
      {expanded && layout.rects[expanded] && (
        <WidgetFullscreen
          id={expanded}
          onClose={() => {
            setExpanded(null);
            restoreFocus(expanded);
          }}
        />
      )}
    </main>
  );
}

function WidgetFrame({
  id,
  number,
  preview,
  expanded,
  presenting,
  onOpen,
}: {
  id: WidgetId;
  number: number;
  preview: Preview | null;
  expanded: boolean;
  presenting: boolean;
  onOpen: (point: Point) => void;
}) {
  const { title, Content } = widgetRegistry[id];
  const options = useRef<HTMLButtonElement>(null);

  function openAtButton() {
    const anchor = options.current?.getBoundingClientRect();
    if (anchor) onOpen({ x: anchor.left, y: anchor.bottom + 4 });
  }

  return (
    <section
      className="widget"
      style={
        preview
          ? {
              width: preview.rect.width,
              height: preview.rect.height,
              transform: `translate(${preview.rect.x - preview.input.x}px, ${preview.rect.y - preview.input.y}px)`,
            }
          : undefined
      }
      data-widget={id}
      aria-labelledby={`widget-title-${id}`}
      onContextMenu={(event) => {
        if (presenting) return;
        event.preventDefault();
        if (event.clientX || event.clientY) {
          onOpen({ x: event.clientX, y: event.clientY });
        } else {
          openAtButton();
        }
      }}
    >
      <header className="widget-header">
        <Grip size={15} aria-hidden="true" className="widget-grip" />
        <span className="widget-number" aria-hidden="true">
          {String(number).padStart(2, "0")} /
        </span>
        <h2 id={`widget-title-${id}`}>{title}</h2>
        <button
          ref={options}
          className="icon-button widget-options"
          id={`widget-options-${id}`}
          type="button"
          aria-label={`${presenting ? "Agrandir" : "Options"} : ${title}`}
          aria-haspopup="dialog"
          aria-expanded={expanded}
          onClick={openAtButton}
        >
          {presenting ? <Maximize size={16} /> : <MoreHorizontal size={17} />}
        </button>
      </header>
      <div className="widget-content">
        <Content />
      </div>
    </section>
  );
}

function WidgetFullscreen({
  id,
  onClose,
}: {
  id: WidgetId;
  onClose: () => void;
}) {
  const { title, Content } = widgetRegistry[id];
  return (
    <WorkspaceDialog
      className="widget-fullscreen"
      titleId="widget-fullscreen-title"
      onClose={onClose}
    >
      <header>
        <h2 id="widget-fullscreen-title">{title}</h2>
        <form method="dialog">
          <button
            className="icon-button"
            type="submit"
            aria-label="Quitter le plein écran du widget"
          >
            <X size={21} />
          </button>
        </form>
      </header>
      <div className="widget-content widget-fullscreen-content">
        <Content />
      </div>
    </WorkspaceDialog>
  );
}

function pointerOnCanvas(event: DragEvent<HTMLDivElement>): Point {
  const bounds = event.currentTarget.getBoundingClientRect();
  return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
}
