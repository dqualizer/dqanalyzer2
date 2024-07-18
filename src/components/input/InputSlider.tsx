import type { ChangeEvent } from "react";

interface InputSliderProps {
	label: string;
	name: string;
	value?: number | null;
	// @ts-ignore noExplicitAny
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	onChange: (e: ChangeEvent<HTMLInputElement>, data: any) => void;
}

export function InputSlider({
	label,
	name,
	value,
	onChange,
}: InputSliderProps) {
	return (
		<div className="form-control w-full">
			<label className="label">
				<span className="label-text">{label}</span>
			</label>
			<input
				type="range"
				min={0}
				max={100}
				name={name}
				value={value || 0}
				onChange={(e) => onChange(e, +e.target.value)}
				className="range"
				step={10}
			/>
			<div className="w-full flex justify-between text-xs px-2">
				<span>0%</span>
				<span>10%</span>
				<span>20%</span>
				<span>30%</span>
				<span>40%</span>
				<span>50%</span>
				<span>60%</span>
				<span>70%</span>
				<span>80%</span>
				<span>90%</span>
				<span>100%</span>
			</div>
		</div>
	);
}
