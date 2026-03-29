import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchChallenge } from "../api/challenges";
import { ChallengeView } from "../components/challenges/ChallengeView";

export function ChallengePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: challenge, isLoading } = useQuery({
    queryKey: ["challenge", slug],
    queryFn: () => fetchChallenge(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <div className="text-gray-400">Loading challenge...</div>;
  if (!challenge) return <div className="text-red-500">Challenge not found.</div>;

  return (
    <div className="h-full">
      <ChallengeView challenge={challenge} />
    </div>
  );
}
