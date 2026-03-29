import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { ValidationResult as ValidationResultType } from "../../types/challenge";

interface Props {
  result: ValidationResultType | null;
}

export function ValidationResult({ result }: Props) {
  if (!result) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
        Submit your SQL to see validation results.
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center gap-2 text-red-700 mb-2">
          <AlertCircle className="h-5 w-5" />
          <span className="font-semibold">Error</span>
        </div>
        <pre className="text-sm text-red-600 whitespace-pre-wrap font-mono">{result.error}</pre>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border p-4 ${result.passed ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}`}>
      <div className={`flex items-center gap-2 mb-3 ${result.passed ? "text-green-700" : "text-yellow-700"}`}>
        {result.passed ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
        <span className="font-semibold">{result.passed ? "All checks passed!" : "Some checks failed"}</span>
      </div>

      <ul className="space-y-2">
        {result.checks.map((check, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            {check.passed ? (
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <div className="font-medium text-gray-800">{check.name}</div>
              <div className="text-gray-500">{check.message}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
