import { useState } from "react";
import {
  Controls,
  MarkerType,
  Position,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import type { ArchitectureDiagram } from "../content/botty-content";

export function InteractiveArchitecture({
  diagram,
}: {
  diagram: ArchitectureDiagram;
}) {
  const [selectedId, setSelectedId] = useState(diagram.nodes[0]?.id);
  const selected = diagram.nodes.find(({ id }) => id === selectedId);
  const labels = new Map(diagram.nodes.map(({ id, label }) => [id, label]));
  const nodes: Node[] = diagram.nodes.map(({ id, label }, index) => ({
    id,
    data: { label },
    position: { x: 0, y: index * 77 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    selected: id === selectedId,
  }));
  const edges: Edge[] = diagram.connections.map(
    ({ from, to, bidirectional, description }) => ({
      id: `${from}-${to}`,
      source: from,
      target: to,
      markerEnd: { type: MarkerType.ArrowClosed },
      markerStart: bidirectional ? { type: MarkerType.ArrowClosed } : undefined,
      ariaLabel: description,
    }),
  );

  return (
    <section
      className="professional-section"
      aria-label="Architecture interactive"
    >
      <div
        className="architecture-flow nodrag nowheel"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={(_, node) => setSelectedId(node.id)}
          fitView
          maxZoom={1.5}
          fitViewOptions={{ padding: 0.1, maxZoom: 1 }}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          elementsSelectable={false}
          zoomOnScroll={false}
          panOnScroll={false}
          preventScrolling={false}
          proOptions={{ hideAttribution: true }}
        >
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      <section
        className="professional-section"
        aria-label="Description textuelle du schéma"
      >
        <h3>Composants du schéma</h3>
        <ul className="stack">
          {diagram.nodes.map(({ id, label }) => (
            <li key={id}>
              <button
                type="button"
                className="detail-link"
                aria-pressed={selectedId === id}
                onClick={() => setSelectedId(id)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
        {selected && (
          <div className="professional-section" aria-live="polite">
            <h4>{selected.label}</h4>
            <p>{selected.role}</p>
            <ul>
              {diagram.connections
                .filter(
                  ({ from, to }) => from === selected.id || to === selected.id,
                )
                .map(({ from, to, description }) => (
                  <li key={`${from}-${to}`}>{description}</li>
                ))}
            </ul>
          </div>
        )}
        <h3 className="professional-section">Flux de données</h3>
        <ul>
          {diagram.connections.map(
            ({ from, to, bidirectional, description }) => (
              <li key={`${from}-${to}`}>
                <strong>
                  {labels.get(from)} {bidirectional ? "↔" : "→"}{" "}
                  {labels.get(to)}
                </strong>
                <span> — {description}</span>
              </li>
            ),
          )}
        </ul>
      </section>
    </section>
  );
}
