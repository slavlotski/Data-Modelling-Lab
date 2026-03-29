import type { SqlExecutionResult } from "../../types/api";

interface Props {
  result: SqlExecutionResult | null;
  error: string | null;
}

export function SqlOutput({ result, error }: Props) {
  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <pre className="whitespace-pre-wrap font-mono">{error}</pre>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-4 text-sm text-gray-400 italic">
        Run a query to see results here.
      </div>
    );
  }

  if (result.command !== "SELECT" || !result.rows.length) {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-700">
        {result.command} executed successfully.
        {result.rowCount !== null && ` ${result.rowCount} row(s) affected.`}
      </div>
    );
  }

  return (
    <div className="overflow-auto max-h-64">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            {result.fields.map((f) => (
              <th key={f} className="border border-gray-200 px-3 py-1.5 text-left font-medium text-gray-700">
                {f}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {result.fields.map((f) => (
                <td key={f} className="border border-gray-200 px-3 py-1 font-mono text-xs">
                  {row[f] === null ? <span className="text-gray-300">NULL</span> : String(row[f])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
