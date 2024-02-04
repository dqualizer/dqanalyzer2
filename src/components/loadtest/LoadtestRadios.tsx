import { ChangeEvent } from "react";

interface LoadtestRadiosProps<T> {
	label: string;
	name: string;
	value: any;
	options: T[];
	optionName: keyof T;
	optionValue?: keyof T;
	onChange: (e: ChangeEvent<HTMLInputElement>, selectedOption: T) => void;
}

export function LoadtestRadios<T>({ label, name, value, options, onChange, optionName, optionValue }: LoadtestRadiosProps<T>) {
	return (
		<div className="form-control w-full">
			<label className="label">
				<span className="label-text">{label}</span>
			</label>
			<div className="join">
				{options.map((option, i) => {
					return (
						<input
							key={i}
							className="join-item btn"
							type="radio"
							name={name}
							aria-label={option[optionName] as any}
							value={optionValue ? option[optionValue] : option as any}
							onChange={e => onChange(e, optionValue ? option[optionValue] : option as any)}
						/>
					);
				})}
			</div>
		</div>
	);
}
