import React, { useRef } from 'react';

interface DateMaskInputProps {
  id: string;
  value: string;
  onChange: (val: string) => void;
  label?: string;
}

export const DateMaskInput: React.FC<DateMaskInputProps> = ({ id, value, onChange, label }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Formata progressivamente a entrada numérica (ex: 10122026 -> 10/12/2026)
  const formatProgressive = (raw: string): string => {
    const digits = raw.replace(/\D/g, '').substring(0, 8);
    
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 4) {
      return `${digits.substring(0, 2)}/${digits.substring(2)}`;
    } else {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}/${digits.substring(4)}`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const formatted = formatProgressive(rawVal);
    onChange(formatted);
  };

  const handleBlur = () => {
    const trimmed = value.trim();
    if (trimmed === '') return;

    const regexCompleta = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regexCompleta.test(trimmed)) {
      alert("Data incompleta. Por favor, insira no formato dd/mm/aaaa.");
      onChange('');
      return;
    }

    const parts = trimmed.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    const dateObj = new Date(year, month - 1, day);
    const dataValida = (dateObj.getFullYear() === year && dateObj.getMonth() === month - 1 && dateObj.getDate() === day);
    
    if (!dataValida) {
      alert("Data inválida. O dia informado não existe para este mês/ano.");
      onChange('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {label && <label htmlFor={id} className="input-label-externa">{label}</label>}
      <input
        ref={inputRef}
        type="text"
        id={id}
        className="form-control"
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder="dd/mm/aaaa"
        inputMode="numeric"
        maxLength={10}
      />
    </div>
  );
};
