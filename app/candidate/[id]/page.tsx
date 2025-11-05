import { CandidateDetailClient } from "./CandidateDetailClient";

export default function CandidatePage({
  params,
}: {
  params: { id: string };
}) {
  // Extract candidate name from ID (convert from slug format)
  const candidateName = params.id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return <CandidateDetailClient candidateId={params.id} candidateName={candidateName} />;
}
