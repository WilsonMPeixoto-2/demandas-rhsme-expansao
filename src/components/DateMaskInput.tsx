import React, { useRef } from 'react';

interface DateMaskInputProps {
  id: string;
  value: string;
  onChange: (val: string) => void;
  label?: string;
}

export const DateMaskInput: React.FC<DateMaskInputProps> = ({ id, value, onChange, label }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const placeholderMask = "dd/mm/aaaa";

  const handleFocus = () => {
    if ((!value || value === placeholderMask) && inputRef.current) {
      onChange(placeholderMask);
      // Posiciona o cursor no início
      setTimeout(() => {
        inputRef.current?.setSelectionRange(0, 0);
      }, 0);
    }
  };

  const handleClick = () => {
    if ((!value || value === placeholderMask) && inputRef.current) {
      inputRef.current.setSelectionRange(0, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!inputRef.current) return;
    
    const cursor = inputRef.current.selectionStart ?? 0;
    
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (cursor === 0) return;
      
      let targetIdx = cursor - 1;
      // Pula a barra `/` se estiver voltando
      if (value[targetIdx] === '/') {
        targetIdx--;
      }
      if (targetIdx < 0) return;
      
      const newValue = value.substring(0, targetIdx) + placeholderMask[targetIdx] + value.substring(targetIdx + 1);
      onChange(newValue);
      
      // Ajusta posição do cursor
      setTimeout(() => {
        inputRef.current?.setSelectionRange(targetIdx, targetIdx);
      }, 0);
    } 
    else if (e.key === 'Delete') {
      e.preventDefault();
      if (cursor >= 10) return;
      
      let targetIdx = cursor;
      if (value[targetIdx] === '/') {
        targetIdx++;
      }
      if (targetIdx >= 10) return;
      
      const newValue = value.substring(0, targetIdx) + placeholderMask[targetIdx] + value.substring(targetIdx + 1);
      onChange(newValue);
      
      setTimeout(() => {
        inputRef.current?.setSelectionRange(targetIdx, targetIdx);
      }, 0);
    } 
    else if (/\d/.test(e.key)) {
      e.preventDefault();
      if (cursor >= 10) return;
      
      let targetIdx = cursor;
      // Salta a barra se o cursor estiver sobre ela
      if (value[targetIdx] === '/') {
        targetIdx++;
      }
      if (targetIdx >= 10) return;
      
      const digit = e.key;

      // Validações básicas de calendário enquanto digita
      if (targetIdx === 0 && !['0', '1', '2', '3'].includes(digit)) return;
      if (targetIdx === 1) {
        const dayTen = value[0];
        if (dayTen === '3' && !['0', '1'].includes(digit)) return;
        if (dayTen === '0' && digit === '0') return;
      }
      if (targetIdx === 3 && !['0', '1'].includes(digit)) return;
      if (targetIdx === 4) {
        const monthTen = value[3];
        if (monthTen === '1' && !['0', '1', '2'].includes(digit)) return;
        if (monthTen === '0' && digit === '0') return;
      }

      const newValue = value.substring(0, targetIdx) + digit + value.substring(targetIdx + 1);
      onChange(newValue);
      
      // Determina próxima posição do cursor
      let nextCursor = targetIdx + 1;
      if (newValue[nextCursor] === '/') {
        nextCursor++;
      }
      
      setTimeout(() => {
        inputRef.current?.setSelectionRange(nextCursor, nextCursor);
      }, 0);
    } 
    else if (['ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
      // Permite navegação padrão
      return;
    } else {
      e.preventDefault();
    }
  };

  const handleBlur = () => {
    if (value === placeholderMask || value.replace(/[^0-9]/g, '').length === 0) {
      onChange('');
      return;
    }

    const regexCompleta = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regexCompleta.test(value)) {
      alert("Data incompleta. Por favor, insira no formato dd/mm/aaaa.");
      onChange('');
      return;
    }

    const parts = value.split('/');
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

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const cleanDigits = pastedData.replace(/\D/g, '');
    if (cleanDigits.length === 8) {
      const formatted = `${cleanDigits.substring(0, 2)}/${cleanDigits.substring(2, 4)}/${cleanDigits.substring(4, 8)}`;
      const [day, month, year] = formatted.split('/').map(Number);
      const dateObj = new Date(year, month - 1, day);
      const dataValida = (dateObj.getFullYear() === year && dateObj.getMonth() === month - 1 && dateObj.getDate() === day);
      if (dataValida) {
        onChange(formatted);
      } else {
        alert("Data colada inválida.");
      }
    } else {
      alert("Formato de data colada inválido. Use dd/mm/aaaa ou apenas os números.");
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
        onFocus={handleFocus}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onPaste={handlePaste}
        onChange={() => {}} // Controlado totalmente pelo KeyDown/Paste
        placeholder={placeholderMask}
      />
    </div>
  );
};
