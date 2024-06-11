import { createRqa } from "@/queries/rqa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	useState,
	type ChangeEvent,
	type Dispatch,
	type FocusEvent,
	type KeyboardEvent,
	type SetStateAction,
} from "react";

import type { DomainArchitectureMapping } from "@/types/dam/dam";
import type { CreateRqa } from "@/types/dtos/CreateRqa";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

interface RqaInputProps {
	setInputOpen: Dispatch<SetStateAction<boolean>>;
	dam: DomainArchitectureMapping;
}

export function RqaInput({ setInputOpen, dam }: RqaInputProps) {
	const [value, setValue] = useState<string>("");
	const queryClient = useQueryClient();

	const spacingVariants = {
		0: "px-0",
		1: "px-2",
		2: "px-4",
		3: "px-6",
		4: "px-8",
		5: "px-10",
		6: "px-16",
		8: "px-32",
	};

	const createRqaMutation = useMutation({
		mutationFn: createRqa,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rqas"] });
			setValue("");
			setInputOpen(false);
		},
	});

	const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
		setValue(ev.target.value);
	};

	function handleSave(
		ev: KeyboardEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>,
	) {
		// TODO hardcoded environment & context
		if (("key" in ev && ev.key === "Enter") || ev.type === "blur") {
			const rqa: CreateRqa = {
				name: value,
				domain_id: dam.id,
				environment: dam.software_system.environment,
				// TODO hardcoded context
				context: dam.id,
				rqa: {
					loadTestDefinition: [],
					resilienceDefinition: [],
					monitoringDefinition: [],
				},
			};
			createRqaMutation.mutate(rqa);
		}

		/* if (('key' in ev && ev.key == "Enter") || ev.type == "blur") {
			createRqaMutation.mutate({
				name: value,
				domain_id: match?.params.domainId,
				environment: "TEST",
				context: "Werkstatt",
			});
		} */
	}

	return (
		<div
			className={`flex items-center hover:bg-slate-500 hover:cursor-pointer w-50 ${spacingVariants[1]} py-2 `}
		>
			<KeyboardArrowRightIcon fontSize="small" />
			<input
				type="text"
				placeholder="Name of the Rqa..."
				className="input input-bordered input-sm w-full max-w-xs"
				onChange={handleChange}
				onKeyDown={handleSave}
				onBlur={handleSave}
			/>
		</div>
	);
}
