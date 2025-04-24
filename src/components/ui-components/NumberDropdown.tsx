import React from 'react';

interface NumberDropdownProps {
    label?: string;
    min: number;
    max: number;
    value: string;
    onChange: (value: string) => void;
    selectStyle?: React.CSSProperties;
}

const NumberDropdown: React.FC<NumberDropdownProps> = ({ label, min, max, value, onChange, selectStyle }) => {
    const options = Array.from({ length: max - min + 1 }, (_, i) => (min + i).toString());

    return (
        <div className="flex-fill">
            <select
                className="form-control app-input"
                value={value}
                style={{
                    color: value ? 'var(--text-primary)' : 'var(--text-secondary)',
                    opacity: value ? 1 : 0.7,
                    ...selectStyle
                }}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">{label}</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    );
};


export default NumberDropdown;
