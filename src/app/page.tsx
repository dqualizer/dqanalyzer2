import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { readAllDomainStoryIds } from "./fetchDomainStories";

const dqLogo = "dqualizer_logo.png";
const WerkstattScreenshot = "werkstatt.png";

export default async function Home() {
	try {
		const data = await readAllDomainStoryIds();
		return (
			<main className="flex items-center justify-center h-screen flex-col">
				<div className="text-center">
					<Image
						src={`/${dqLogo}`}
						alt=""
						className="mx-auto mb-4 w-1/2"
						width={1458}
						height={550}
					/>
					<p className="font-bold text-2xl">Welcome to dqAnalyzer 1.0!</p>
					<p className="text-xl">
						First of all: Choose your Demo-Domain or create it first by using
						dqEdit.
					</p>
					<p className="text-xl">
						Currently there are two Demo-Domains available. Use the
						Werkstattauftrag-Domain to try the manual mode. The Leasing Ninja
						shows a more domain-centric view to specify rqas with a generative
						scenario editor.
					</p>
					<p>
						Hint: You can also use the buttons as long there&apos;s no dqEdit
					</p>
				</div>

				<Suspense fallback={<p>Trying to fetch...</p>}>
					<div className="flex gap-4 mt-5">
						{data.map((domainstoryId) => (
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
						))}
					</div>
				</Suspense>
			</main>
		);
	} catch (_) {
		return <p>Seems like there is no connection to the backend...</p>;
	}
}
