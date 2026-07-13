// Utilitário de gerenciamento de datas e semântica de prazos
export const getTodayString = (): string => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export const isBeforeToday = (dateStr: string): boolean => {
  if (!dateStr || dateStr === 'dd/mm/aaaa') return false;
  const [day, month, year] = dateStr.split('/').map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  const today = new Date();
  const todayObj = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  return dateObj < todayObj;
};

export interface PrazoSemantics {
  data: string;
  label: string | null;
  classe: string;
}

export const getPrazoFinalSemantics = (dateStr: string | undefined): PrazoSemantics => {
  if (!dateStr || dateStr === 'dd/mm/aaaa') {
    return { data: '—', label: null, classe: '' };
  }

  try {
    const [day, month, year] = dateStr.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    
    const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const dataFormatada = `${String(day).padStart(2, '0')} ${meses[month - 1]} ${year}`;

    const today = new Date();
    const todayObj = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const diffTime = dateObj.getTime() - todayObj.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const absDays = Math.abs(diffDays);
      return {
        data: dataFormatada,
        label: `${absDays} ${absDays === 1 ? 'dia' : 'dias'} em atraso`,
        classe: 'status-atrasado'
      };
    } else if (diffDays === 0) {
      return {
        data: dataFormatada,
        label: 'Vence hoje',
        classe: 'status-hoje'
      };
    } else if (diffDays <= 5) {
      return {
        data: dataFormatada,
        label: `Vence em ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`,
        classe: 'status-alerta'
      };
    } else {
      return {
        data: dataFormatada,
        label: `Prazo em ${diffDays} dias`,
        classe: 'status-normal'
      };
    }
  } catch {
    return { data: '—', label: null, classe: '' };
  }
};
