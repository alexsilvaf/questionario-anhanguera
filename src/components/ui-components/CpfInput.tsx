import React from 'react';

interface CpfInputProps {
  value: string;
  onChange: (value: string) => void;
}

const formatCpf = (value: string): string => {
  const numbers = value.replace(/\D/g, '').slice(0, 11);
  return numbers
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const CpfInput: React.FC<CpfInputProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(e.target.value);
    onChange(formatted);
  };

  return (
    <input
      type="text"
      className="form-control app-input"
      placeholder="CPF"
      value={value}
      onChange={handleChange}
      required
    />
  );
};

export default CpfInput;
