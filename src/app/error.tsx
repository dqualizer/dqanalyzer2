"use client";

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
export default function Error({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	return (
		<div className="flex flex-grow flex-col items-center margin-auto">
			<h2>Something went wrong!</h2>
			<p>{error.message}</p>
			<button onClick={() => reset()} className="btn">
				Try again
			</button>
		</div>
	);
}
