import React, { useState } from 'react'

interface ICustomRangeInput {
    currentValue: number,
    min: number,
    max: number,
    setResult: (value: number) => void
}

export const CustomRangeInput: React.FC<ICustomRangeInput> = ({ currentValue, min, max, setResult }) => {
    const [value, setValue] = useState<number>(currentValue)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(+e.target.value)
    }

    function handleSetResult() {
        setResult(value)
    }

    return (
        <input
            type='range'
            min={min}
            max={max}
            value={value}
            onChange={handleChange}
            onMouseUp={handleSetResult}
        />
    )
}
