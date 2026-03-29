import type { Node, Edge } from "@xyflow/react";
import type { EntityData } from "../types/diagram";

export function diagramToSql(nodes: Node<EntityData>[], edges: Edge[]): string {
  const statements: string[] = [];
  const fkStatements: string[] = [];

  for (const node of nodes) {
    const data = node.data as unknown as EntityData;
    const pkCols = data.attributes.filter((a) => a.isPrimaryKey).map((a) => a.name);

    const colDefs = data.attributes.map((attr) => {
      const parts = [`  ${attr.name} ${attr.type}`];
      if (!attr.nullable) parts.push("NOT NULL");
      return parts.join(" ");
    });

    if (pkCols.length > 0) {
      colDefs.push(`  PRIMARY KEY (${pkCols.join(", ")})`);
    }

    statements.push(`CREATE TABLE ${data.name} (\n${colDefs.join(",\n")}\n);`);
  }

  for (const edge of edges) {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);
    if (!sourceNode || !targetNode) continue;

    const sourceData = sourceNode.data as unknown as EntityData;
    const targetData = targetNode.data as unknown as EntityData;
    const targetPk = targetData.attributes.find((a) => a.isPrimaryKey);

    if (targetPk) {
      const fkCol = `${targetData.name}_${targetPk.name}`;
      fkStatements.push(
        `ALTER TABLE ${sourceData.name} ADD COLUMN ${fkCol} integer REFERENCES ${targetData.name}(${targetPk.name});`
      );
    }
  }

  return [...statements, "", ...fkStatements].join("\n\n").trim();
}
