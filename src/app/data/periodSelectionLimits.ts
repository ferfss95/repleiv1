import { getToday } from '../dateUtils';

/** Janela máxima de lookback para seleção de período (todos os módulos e granularidades). */
export const PERIOD_SELECTION_MAX_YEARS_BACK = 2;

const MONTH_NAME_TO_INDEX: Record<string, number> = {
  janeiro: 0,
  fevereiro: 1,
  março: 2,
  marco: 2,
  abril: 3,
  maio: 4,
  junho: 5,
  julho: 6,
  agosto: 7,
  setembro: 8,
  outubro: 9,
  novembro: 10,
  dezembro: 11,
};

export function getPeriodSelectionMinDate(reference = getToday()): Date {
  const ref = new Date(
    reference.getFullYear(),
    reference.getMonth(),
    reference.getDate(),
  );
  const min = new Date(ref);
  min.setFullYear(min.getFullYear() - PERIOD_SELECTION_MAX_YEARS_BACK);
  return min;
}

export function isBeforePeriodSelectionMinDate(
  date: Date,
  reference = getToday(),
): boolean {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const min = getPeriodSelectionMinDate(reference);
  return day.getTime() < min.getTime();
}

export function getPeriodSelectionMinYear(reference = getToday()): number {
  return getPeriodSelectionMinDate(reference).getFullYear();
}

export function isYearBeforePeriodSelectionMin(
  year: string,
  reference = getToday(),
): boolean {
  const y = parseInt(year, 10);
  return Number.isNaN(y) || y < getPeriodSelectionMinYear(reference);
}

export function getMonthPeriodIndex(monthLabel: string): number {
  const parts = monthLabel.trim().split(/\s+/);
  if (parts.length < 2) return -1;
  const year = parseInt(parts[parts.length - 1], 10);
  const monthName = parts.slice(0, -1).join(' ').toLowerCase();
  const monthIndex = MONTH_NAME_TO_INDEX[monthName];
  if (monthIndex === undefined || Number.isNaN(year)) return -1;
  return year * 12 + monthIndex;
}

export function isMonthBeforePeriodSelectionMin(
  monthLabel: string,
  reference = getToday(),
): boolean {
  const idx = getMonthPeriodIndex(monthLabel);
  if (idx < 0) return true;
  const min = getPeriodSelectionMinDate(reference);
  const minIdx = min.getFullYear() * 12 + min.getMonth();
  return idx < minIdx;
}

/** Anos exibíveis no seletor anual (ano corrente até o limite de lookback). */
export function buildPeriodSelectionYearsOptions(reference = getToday()): string[] {
  const current = reference.getFullYear();
  const minYear = getPeriodSelectionMinYear(reference);
  const years: string[] = [];
  for (let y = current; y >= minYear; y--) {
    years.push(String(y));
  }
  return years;
}

/** Meses exibíveis no seletor mensal (do mês corrente até o limite de lookback). */
export function buildPeriodSelectionMonthsOptions(reference = getToday()): string[] {
  const result: string[] = [];
  const cursor = new Date(reference.getFullYear(), reference.getMonth(), 1);
  const min = getPeriodSelectionMinDate(reference);
  const minIdx = min.getFullYear() * 12 + min.getMonth();

  for (let i = 0; i < 60; i++) {
    const idx = cursor.getFullYear() * 12 + cursor.getMonth();
    if (idx < minIdx) break;
    const m = cursor.toLocaleString('pt-BR', { month: 'long' });
    result.push(`${m.charAt(0).toUpperCase() + m.slice(1)} ${cursor.getFullYear()}`);
    cursor.setMonth(cursor.getMonth() - 1);
  }

  return result;
}
