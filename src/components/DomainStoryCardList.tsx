import DomainstoryCard from "./DomainstoryCard";
import type {DomainArchitectureMapping} from "@/types/dam/dam";

export default function DomainStoryCardList({
  dams,
}: { dams: DomainArchitectureMapping[] }) {
  return (
    <div className="flex gap-4 mt-5">
      {dams.map((dam) => (
        <DomainstoryCard key={dam.id} dam={dam} />
      ))}
    </div>
  );
}
