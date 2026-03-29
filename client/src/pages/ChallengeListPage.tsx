import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchChallenges } from "../api/challenges";

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
};

export function ChallengeListPage() {
  const { data: challenges, isLoading } = useQuery({
    queryKey: ["challenges"],
    queryFn: fetchChallenges,
  });

  if (isLoading) return <div className="text-gray-400">Loading challenges...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Challenges</h1>

      <div className="space-y-2">
        {challenges?.map((c) => (
          <Link
            key={c.slug}
            to={`/challenges/${c.slug}`}
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-5 py-4 hover:shadow-md transition-shadow"
          >
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{c.title}</div>
              <div className="text-sm text-gray-500">{c.description}</div>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyColors[c.difficulty] ?? "bg-gray-100 text-gray-600"}`}>
              {c.difficulty}
            </span>
          </Link>
        ))}

        {challenges?.length === 0 && (
          <p className="text-gray-400 italic">No challenges found. Seed challenges from the content/challenges/ directory.</p>
        )}
      </div>
    </div>
  );
}
