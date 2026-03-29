import { Handle, Position, type NodeProps } from "@xyflow/react";
import { KeyRound, Link } from "lucide-react";
import type { EntityData } from "../../types/diagram";

export function EntityNode({ data }: NodeProps) {
  const entityData = data as unknown as EntityData;

  return (
    <div className="min-w-[200px] rounded-lg border-2 border-gray-300 bg-white shadow-md">
      <Handle type="target" position={Position.Left} className="!bg-primary-500" />

      <div className="rounded-t-md bg-primary-600 px-3 py-2 text-sm font-bold text-white">
        {entityData.name}
      </div>

      <div className="divide-y divide-gray-100">
        {entityData.attributes.map((attr) => (
          <div
            key={attr.name}
            className="flex items-center gap-2 px-3 py-1.5 text-xs"
          >
            <span className="flex items-center gap-1">
              {attr.isPrimaryKey && <KeyRound className="h-3 w-3 text-amber-500" />}
              {attr.isForeignKey && <Link className="h-3 w-3 text-blue-500" />}
            </span>
            <span className={`font-medium ${attr.isPrimaryKey ? "text-amber-700" : "text-gray-800"}`}>
              {attr.name}
            </span>
            <span className="ml-auto text-gray-400">{attr.type}</span>
            {attr.nullable && <span className="text-gray-300 text-[10px]">NULL</span>}
          </div>
        ))}
        {entityData.attributes.length === 0 && (
          <div className="px-3 py-2 text-xs italic text-gray-400">No attributes</div>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="!bg-primary-500" />
    </div>
  );
}
