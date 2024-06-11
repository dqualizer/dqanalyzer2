import { useEffect, type Dispatch, type SetStateAction } from "react";

interface ResizeBarProps {
	setSidebarWidth: Dispatch<SetStateAction<number>>;
	setIsResizing: Dispatch<SetStateAction<boolean>>;
	isResizing: boolean;
}

export default function ResizeBar({
	setSidebarWidth,
	setIsResizing,
	isResizing,
}: ResizeBarProps) {
	const handleMouseDown = () => {
		setIsResizing(true);
	};

	const handleMouseUp = () => {
		setIsResizing(false);
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (isResizing) {
			const newWidth = event.clientX;
			setSidebarWidth(newWidth);
		}
	};
	useEffect(() => {
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [handleMouseMove, handleMouseUp]);

	return (
		<div
			className="hover:cursor-col-resize"
			style={{
				width: "5px",
				height: "100%",
				// backgroundColor: isResizing ? 'red' : 'transparent', // Change the color of the border when resizing
				// cursor: isResizing ? 'col-resize' : 'default',
			}}
			onMouseDown={handleMouseDown}
		/>
	);
}
