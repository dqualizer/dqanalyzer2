import React, { useState } from 'react'

export default function TextInput({ onInputChange, onEnterPress, className }) {
    const [name, setName] = useState("")

    const onChangeName = (event) => {
        setName(event.target.value);
        onInputChange(event.target.value)
    }

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            onEnterPress();
        }
    }

    return (
        <input type="text" name="" id="" className={className} value={name} onChange={onChangeName} onKeyPress={handleKeyPress} />
    )
}
