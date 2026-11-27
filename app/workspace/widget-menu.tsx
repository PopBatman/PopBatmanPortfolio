import { useEffect, useRef, type FormEvent } from "react";
import type { Rect, Size } from "./geometry";
import type { LayerAction } from "./workspace-layout";

const layerButtons = [
  ["front", "Premier plan"],
  ["forward", "Avancer d’un plan"],
  ["backward", "Reculer d’un plan"],
  ["back", "Arrière-plan"],
] as const;

export function WidgetMenu({
  title,
  point,
  rect,
  minimum,
  canvasWidth,
  index,
  count,
  onClose,
  onLayer,
  onReorder,
  onPlace,
  onRemove,
}: {
  title: string;
  point: { x: number; y: number };
  rect?: Rect;
  minimum: Size;
  canvasWidth: number;
  index: number;
  count: number;
  onClose: () => void;
  onLayer: (action: LayerAction) => void;
  onReorder: (step: -1 | 1) => void;
  onPlace: (rect: Rect) => void;
  onRemove: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    dialog.style.left =
      Math.max(8, Math.min(point.x, innerWidth - dialog.offsetWidth - 8)) +
      "px";
    dialog.style.top =
      Math.max(8, Math.min(point.y, innerHeight - dialog.offsetHeight - 8)) +
      "px";
    return () => dialog.close();
  }, [point]);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    onPlace({
      x: Number(fields.get("x")),
      y: Number(fields.get("y")),
      width: Number(fields.get("width")),
      height: Number(fields.get("height")),
    });
    dialogRef.current?.close();
  }

  return (
    <dialog
      ref={dialogRef}
      className="widget-menu"
      aria-labelledby="widget-menu-label"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
    >
      <div className="widget-menu-body">
        <header>
          <h2 id="widget-menu-label">{title}</h2>
          <button
            className="icon-button"
            type="button"
            aria-label="Fermer les options"
            onClick={() => dialogRef.current?.close()}
          >
            ×
          </button>
        </header>
        <div className="widget-menu-actions">
          {rect ? (
            layerButtons.map(([action, label]) => (
              <button
                key={action}
                type="button"
                disabled={
                  action === "front" || action === "forward"
                    ? index === count - 1
                    : index === 0
                }
                onClick={() => onLayer(action)}
              >
                {label}
              </button>
            ))
          ) : (
            <>
              <button
                type="button"
                disabled={index === 0}
                onClick={() => onReorder(-1)}
              >
                Monter
              </button>
              <button
                type="button"
                disabled={index === count - 1}
                onClick={() => onReorder(1)}
              >
                Descendre
              </button>
            </>
          )}
        </div>
        {rect && (
          <form onSubmit={save}>
            <fieldset>
              <legend>Position et dimensions (px)</legend>
              <label>
                Horizontal
                <input
                  name="x"
                  type="number"
                  min="0"
                  max={canvasWidth - minimum.width}
                  defaultValue={Math.round(rect.x)}
                  required
                />
              </label>
              <label>
                Vertical
                <input
                  name="y"
                  type="number"
                  min="0"
                  defaultValue={Math.round(rect.y)}
                  required
                />
              </label>
              <label>
                Largeur
                <input
                  name="width"
                  type="number"
                  min={minimum.width}
                  max={canvasWidth}
                  defaultValue={Math.round(rect.width)}
                  required
                />
              </label>
              <label>
                Hauteur
                <input
                  name="height"
                  type="number"
                  min={minimum.height}
                  defaultValue={Math.round(rect.height)}
                  required
                />
              </label>
            </fieldset>
            <button className="widget-apply" type="submit">
              Appliquer
            </button>
          </form>
        )}
        <button type="button" className="widget-remove" onClick={onRemove}>
          Supprimer le widget
        </button>
      </div>
    </dialog>
  );
}
