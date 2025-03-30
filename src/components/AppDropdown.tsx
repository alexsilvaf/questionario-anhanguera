import React from 'react';

interface DropdownOption {
    label: string;
    value: string;
}

interface AppDropdownProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: DropdownOption[];
    placeholder?: string;
    required?: boolean;
}

const AppDropdown: React.FC<AppDropdownProps> = ({
    label,
    value,
    onChange,
    options,
    placeholder = 'Selecione uma opção',
    required
}) => {
    return (
        <>
            {label && <label className="form-label">{label}</label>}
            <select
                className="form-control app-input"
                value={value}
                style={{ color: value ? 'var(--text-primary)' : 'var(--text-secondary)', opacity: value ? 1 : 0.7 }}
                onChange={(e) => onChange(e.target.value)}
                required={required}
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </>
    );
};


export default AppDropdown;
