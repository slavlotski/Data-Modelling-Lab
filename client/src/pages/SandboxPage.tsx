import { useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { DiagramCanvas } from "../components/diagram/DiagramCanvas";
import { DiagramToolbar } from "../components/diagram/DiagramToolbar";
import { SqlEditor } from "../components/sql-editor/SqlEditor";
import { SqlOutput } from "../components/sql-editor/SqlOutput";
import { SchemaInspector } from "../components/sql-editor/SchemaInspector";
import { useSqlExecution } from "../hooks/useSqlExecution";
import { resetSandbox } from "../api/sandbox";

export function SandboxPage() {
  const [sql, setSql] = useState("");
  const [activeTab, setActiveTab] = useState<"diagram" | "sql">("diagram");
  const { result, error, loading, execute } = useSqlExecution();

  async function handleReset() {
    await resetSandbox();
    setSql("");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-xl font-bold text-gray-900">Sandbox</h1>
        <div className="ml-4 flex rounded-md border border-gray-300 overflow-hidden">
          <button
            onClick={() => setActiveTab("diagram")}
            className={`px-3 py-1 text-sm font-medium ${activeTab === "diagram" ? "bg-primary-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
          >
            ER Diagram
          </button>
          <button
            onClick={() => setActiveTab("sql")}
            className={`px-3 py-1 text-sm font-medium ${activeTab === "sql" ? "bg-primary-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
          >
            SQL Editor
          </button>
        </div>
        <button
          onClick={handleReset}
          className="ml-auto flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
        >
          <RotateCcw className="h-4 w-4" />
          Reset DB
        </button>
      </div>

      <div className="flex flex-1 gap-4 min-h-0">
        <div className="flex-1 flex flex-col min-h-0 border border-gray-200 rounded-lg overflow-hidden">
          {activeTab === "diagram" ? (
            <>
              <DiagramToolbar />
              <div className="flex-1">
                <DiagramCanvas />
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 min-h-0">
                <SqlEditor value={sql} onChange={setSql} height="100%" />
              </div>
              <div className="flex items-center gap-2 border-t border-gray-200 px-4 py-2 bg-white">
                <button
                  onClick={() => execute(sql)}
                  disabled={loading || !sql.trim()}
                  className="flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  <Play className="h-4 w-4" />
                  {loading ? "Running..." : "Run"}
                </button>
              </div>
              <div className="border-t border-gray-200 bg-white">
                <SqlOutput result={result} error={error} />
              </div>
            </>
          )}
        </div>

        <div className="w-56 border border-gray-200 rounded-lg bg-white overflow-hidden">
          <SchemaInspector />
        </div>
      </div>
    </div>
  );
}
