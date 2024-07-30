import DomainstoryCard from "./DomainstoryCard";

export default function DomainStoryCardList({
  domainstoryIds,
}: { domainstoryIds: string[] }) {
  return (
    <div className="flex gap-4 mt-5">
      {domainstoryIds.map((domainstoryId) => (
        <DomainstoryCard key={domainstoryId} domainstoryId={domainstoryId} />
      ))}
    </div>
  );
}
