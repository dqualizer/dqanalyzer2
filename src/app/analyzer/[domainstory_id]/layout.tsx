"use client";

import { ReactFlowProvider } from "reactflow";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="root">
			<ReactFlowProvider>{children}</ReactFlowProvider>
		</div>
	);
}
