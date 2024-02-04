import { ChangeEvent } from "react";

interface LoadtestCheckProps<T> {
	label: string;
	name: string;
	value: T;
	checked: boolean;
	onChange: (e: ChangeEvent<HTMLInputElement>, selectedOption: T) => void;
}

export function LoadtestCheck<T>({ label, name, value, checked, onChange }: LoadtestCheckProps<T>) {
	return (
		<div className="form-control w-full">
			<label className="label cursor-pointer">
				<span className="label-text">{label}</span>
				<input
					type="checkbox"
					className="checkbox"
					name={name}
					value={value as any}
					checked={checked}
					onChange={e => onChange(e, value)}
				/>
			</label>
		</div>
	);
}
