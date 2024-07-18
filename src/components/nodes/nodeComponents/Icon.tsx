import { all_icons } from "@/language/icon/all_Icons";

export interface IconProps {
	className: string;
	name: keyof typeof all_icons;
}

export function Icon({ className, name }: IconProps) {
	return (
		<div
			className={className}
			dangerouslySetInnerHTML={{ __html: all_icons[name] }}
		/>
	);
}
