import { useState } from "react";
import { Play } from "lucide-react";
import type { Challenge } from "../../types/challenge";
import { useChallenge } from "../../hooks/useChallenge";
import { SqlEditor } from "../sql-editor/SqlEditor";
import { ValidationResult } from "./ValidationResult";

interface Props {
  challenge: Challenge;
}

export function ChallengeView({ challenge }: Props) {
  const [sql, setSql] = useState(challenge.initialSql || "");
  const { result, loading, submit } = useChallenge(challenge.slug);

  return (
    <div className="flex h-full gap-4">
      <div className="flex-1 flex flex-col">
        <div className="prose max-w-none mb-4">
          <h2>{challenge.title}</h2>
          <p className="text-gray-600">{challenge.description}</p>
          <div className="rounded-md bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
            {challenge.instructions}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <SqlEditor value={sql} onChange={setSql} height="100%" />
        </div>

        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => submit(sql)}
            disabled={loading || !sql.trim()}
            className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            {loading ? "Validating..." : "Submit"}
          </button>
        </div>
      </div>

      <div className="w-80">
        <ValidationResult result={result} />
      </div>
    </div>
  );
}
