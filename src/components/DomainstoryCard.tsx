import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type {DomainArchitectureMapping} from "@/types/dam/dam";

const WerkstattScreenshot = "werkstatt.png";

export default function DomainstoryCard({
  dam,
}: { dam: DomainArchitectureMapping }) {
  return (
    <Link href={`/analyzer/${dam.id}` as Route}>
      <div className="w-60 h-60 border-2 border-cyan-400 relative hover:scale-110">
        <Image
          src={`/${WerkstattScreenshot}`}
          alt=""
          className="w-full h-full object-cover"
          fill={true}
          sizes="(max-width: 640px) 100vw, 40vw"
        />
        <span className="text-black text-l font-bold absolute bottom-0 left-0 right-0 text-center mb-2">
          {dam.name}
        </span>
      </div>
    </Link>
  );
}
