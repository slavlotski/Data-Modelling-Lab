import type { Node, Edge } from "@xyflow/react";
import type { EntityData, SchemaSnapshot } from "../types/diagram";

export function schemaToDiagram(schema: SchemaSnapshot): {
  nodes: Node<EntityData>[];
  edges: Edge[];
} {
  const nodes: Node<EntityData>[] = schema.tables.map((table, i) => {
    const pkConstraint = table.constraints.find((c) => c.type === "PRIMARY KEY");
    const fkConstraints = table.constraints.filter((c) => c.type === "FOREIGN KEY");

    const fkCols = new Set(fkConstraints.flatMap((fk) => fk.columns));
    const pkCols = new Set(pkConstraint?.columns ?? []);

    return {
      id: `entity-${table.name}`,
      type: "entity",
      position: { x: (i % 4) * 280 + 50, y: Math.floor(i / 4) * 250 + 50 },
      data: {
        name: table.name,
        attributes: table.columns.map((col) => ({
          name: col.name,
          type: col.type,
          isPrimaryKey: pkCols.has(col.name),
          isForeignKey: fkCols.has(col.name),
          nullable: col.nullable,
        })),
      },
    };
  });

  const edges: Edge[] = [];
  for (const table of schema.tables) {
    const fks = table.constraints.filter((c) => c.type === "FOREIGN KEY");
    for (const fk of fks) {
      if (fk.referencedTable) {
        edges.push({
          id: `edge-${table.name}-${fk.referencedTable}-${fk.name}`,
          source: `entity-${table.name}`,
          target: `entity-${fk.referencedTable}`,
          type: "smoothstep",
          animated: true,
          label: fk.columns.join(", "),
        });
      }
    }
  }

  return { nodes, edges };
}
