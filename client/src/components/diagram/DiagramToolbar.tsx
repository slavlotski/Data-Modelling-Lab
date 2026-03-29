import { useState } from "react";
import { Plus, Trash2, Download } from "lucide-react";
import { useDiagramStore } from "../../stores/diagramStore";
import { EntityDialog } from "./EntityDialog";
import { diagramToSql } from "../../utils/diagramToSql";

export function DiagramToolbar() {
  const [showDialog, setShowDialog] = useState(false);
  const { nodes, edges, clear } = useDiagramStore();

  function handleExportSql() {
    const sql = diagramToSql(nodes, edges);
    navigator.clipboard.writeText(sql);
  }

  return (
    <>
      <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-2">
        <button
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-1 rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Add Entity
        </button>
        <button
          onClick={handleExportSql}
          className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Download className="h-4 w-4" />
          Copy DDL
        </button>
        <button
          onClick={clear}
          className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </button>
      </div>

      {showDialog && <EntityDialog onClose={() => setShowDialog(false)} />}
    </>
  );
}
