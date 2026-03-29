import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { introspectSchema } from "../../api/sandbox";

export function SchemaInspector() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["schema"],
    queryFn: introspectSchema,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
        <h3 className="text-sm font-semibold text-gray-700">Schema</h3>
        <button
          onClick={() => refetch()}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 text-xs">
        {isLoading && <p className="text-gray-400 italic">Loading...</p>}

        {data && data.tables.length === 0 && (
          <p className="text-gray-400 italic">No tables in sandbox.</p>
        )}

        {data?.tables.map((table) => (
          <div key={table.name} className="mb-3">
            <div className="font-semibold text-gray-800 mb-1">{table.name}</div>
            {table.columns.map((col) => (
              <div key={col.name} className="flex items-center gap-2 pl-3 py-0.5 text-gray-600">
                <span>{col.name}</span>
                <span className="text-gray-400">{col.type}</span>
                {!col.nullable && <span className="text-red-400 text-[10px]">NOT NULL</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
