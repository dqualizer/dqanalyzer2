import { ChangeEvent } from "react";

interface LoadtestSelectProps<T> {
	label: string;
	name?: string;
	value: any;
	options: T[];
	optionName: keyof T;
	optionValue?: keyof T;
	onChange: (e: ChangeEvent<HTMLSelectElement>, selectedOption: T) => void;
}

export function LoadtestSelect<T>({ label, name, value, options, optionName, optionValue, onChange }: LoadtestSelectProps<T>) {
	return (
		<div className="form-control w-full">
			<label className="label">
				<span className="label-text">{label}</span>
			</label>
			<select
				value={value || ''}
				name={name}
				onChange={e => onChange(e, e.target.value as any)}
				className="select select-bordered"
			>
				<option value="" disabled>Choose a {label}</option>
				{options.map((option, i) => <option value={optionValue ? option[optionValue] : option as any} key={i}>{option[optionName] as any}</option>)}
			</select>
		</div>
	);
}
