import Image from "next/image";

const dqLogo = "dqualizer_logo.png";

export default function DqualizerBanner() {
	return (
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
				Werkstattauftrag-Domain to try the manual mode. The Leasing Ninja shows
				a more domain-centric view to specify rqas with a generative scenario
				editor.
			</p>
			<p>Hint: You can also use the buttons as long there&apos;s no dqEdit</p>
		</div>
	);
}
