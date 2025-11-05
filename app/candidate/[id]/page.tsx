import { CandidateDetailClient } from "./CandidateDetailClient";

export default async function CandidatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params in Next.js 15+
  const { id } = await params;

  // Extract candidate name from ID (convert from slug format)
  const candidateName = id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return <CandidateDetailClient candidateId={id} candidateName={candidateName} />;
}
