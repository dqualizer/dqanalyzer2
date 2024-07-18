import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";

const WerkstattScreenshot = "werkstatt.png";

export default function DomainstoryCard({
	domainstoryId,
}: { domainstoryId: string }) {
	return (
		<Link href={`/analyzer/${domainstoryId}` as Route}>
			<div className="w-60 h-60 border-2 border-cyan-400 relative hover:scale-110">
				<Image
					src={`/${WerkstattScreenshot}`}
					alt=""
					className="w-full h-full object-cover"
					fill={true}
					sizes="(max-width: 640px) 100vw, 40vw"
				/>
				<span className="text-black text-l font-bold absolute bottom-0 left-0 right-0 text-center mb-2">
					{domainstoryId}
				</span>
			</div>
		</Link>
	);
}
