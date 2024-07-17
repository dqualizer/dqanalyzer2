import React, { useState } from "react";
import { Panel } from "reactflow";

export default function NamePanel() {
	// TODO check if required
	const [name, setName] = useState("< Name of the Domain Story >");
	const [description, setDescription] = useState("");
	const [changeFieldOpen, setChangeFieldOpen] = useState(false);

	const onChangeName = (event) => {
		setName(event.target.value);
	};

	const onChangeDescription = (event) => {
		setDescription(event.target.value);
	};

	const onClickName = () => {
		setChangeFieldOpen((prevHidden) => !prevHidden);
	};

	return (
		<Panel position="top-right">
			<h3
				onClick={onClickName}
				onKeyDown={(e) => e.key === "Enter" && onClickName()}
			>
				{name}
			</h3>
			<p>{description}</p>
			{changeFieldOpen ? (
				<div
					style={{
						backgroundColor: "white",
						padding: "1rem",
						margin: "1rem",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<input type="text" value={name} onChange={onChangeName} />
					<textarea
						name=""
						id=""
						cols="30"
						rows="10"
						value={description}
						onChange={onChangeDescription}
					/>
				</div>
			) : null}
		</Panel>
	);
}
