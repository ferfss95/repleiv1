import type { AnalysisMode } from '../types/wizard';
import { ALLOW_CURRENT_YEAR_ANNUAL_SELECTION } from '../data/periodSelectionUiVisibility';
import {
  getPeriodSelectionMinDate,
  isBeforePeriodSelectionMinDate,
  isMonthBeforePeriodSelectionMin,
  isYearBeforePeriodSelectionMin,
} from '../data/periodSelectionLimits';
import {
  formatDate,
  getCurrentMonthString,
  getCurrentYearString,
  getToday,
  getTodayFormatted,
  getYesterdayFormatted,
} from '../dateUtils';

export const INTRADAY_TODAY_TOOLTIP =
  'Para análises do dia de hoje, selecione o tipo de análise Intraday.';

export function isIntradayAnalysisMode(analysisMode: AnalysisMode): boolean {
  return analysisMode === 'horaahora';
}

export function isSameCalendarDay(date: Date, reference = getToday()): boolean {
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
}

export function isFutureCalendarDay(date: Date, reference = getToday()): boolean {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const ref = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  return day.getTime() > ref.getTime();
}

/** Bloqueia datas futuras, antes do limite de lookback e hoje (D0) exceto em Intraday. */
export function isCalendarDayBlocked(
  date: Date,
  analysisMode?: AnalysisMode,
): boolean {
  if (isBeforePeriodSelectionMinDate(date)) return true;
  if (isFutureCalendarDay(date)) return true;
  if (!analysisMode || isIntradayAnalysisMode(analysisMode)) return false;
  return isSameCalendarDay(date);
}

export function isTodayBlockedForAnalysis(analysisMode: AnalysisMode): boolean {
  return !isIntradayAnalysisMode(analysisMode);
}

export function isMonthPeriodBlocked(month: string, analysisMode: AnalysisMode): boolean {
  if (isIntradayAnalysisMode(analysisMode)) return false;
  return month === getCurrentMonthString();
}

export function isYearPeriodBlocked(year: string, analysisMode: AnalysisMode): boolean {
  if (isIntradayAnalysisMode(analysisMode)) return false;
  if (ALLOW_CURRENT_YEAR_ANNUAL_SELECTION) return false;
  return year === getCurrentYearString();
}

export function isDateStringToday(dateStr: string): boolean {
  return dateStr === getTodayFormatted();
}

function shiftDateStringFromToday(dateStr: string): string {
  if (!dateStr || !isDateStringToday(dateStr)) return dateStr;
  return getYesterdayFormatted();
}

function clampDateStringToPeriodSelectionMin(dateStr: string): string {
  const parsed = parseDateBRToDay(dateStr);
  if (!parsed || !isBeforePeriodSelectionMinDate(parsed)) return dateStr;
  return formatDateBRFromDay(getPeriodSelectionMinDate());
}

function clampDateRangeToPeriodSelectionMin(range: {
  start: string;
  end: string;
}): { start: string; end: string } {
  let { start, end } = range;
  if (start) start = clampDateStringToPeriodSelectionMin(start);
  if (end) end = clampDateStringToPeriodSelectionMin(end);

  if (start && end) {
    const startDate = parseDateBRToDay(start);
    const endDate = parseDateBRToDay(end);
    if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
      end = start;
    }
  }

  return { start, end };
}

export function sanitizeDateRangeForAnalysisMode(
  range: { start: string; end: string },
  analysisMode: AnalysisMode,
): { start: string; end: string } {
  let { start, end } = range;

  if (!isIntradayAnalysisMode(analysisMode)) {
    if (isDateStringToday(start)) start = getYesterdayFormatted();
    if (isDateStringToday(end)) end = getYesterdayFormatted();
  }

  if (start && end) {
    const startDate = parseDateBRToDay(start);
    const endDate = parseDateBRToDay(end);
    if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
      end = start;
    }
  }

  return clampDateRangeToPeriodSelectionMin({ start, end });
}

export function sanitizeSpecificDaysForAnalysisMode(
  days: string[],
  analysisMode: AnalysisMode,
): string[] {
  return days.filter((day) => {
    const parsed = parseDateBRToDay(day);
    if (!parsed) return false;
    if (isBeforePeriodSelectionMinDate(parsed)) return false;
    if (isIntradayAnalysisMode(analysisMode)) return true;
    return !isDateStringToday(day);
  });
}

export function sanitizeMonthsForAnalysisMode(
  months: string[],
  analysisMode: AnalysisMode,
): string[] {
  return months.filter((month) => {
    if (isMonthBeforePeriodSelectionMin(month)) return false;
    if (isIntradayAnalysisMode(analysisMode)) return true;
    return month !== getCurrentMonthString();
  });
}

export function sanitizeYearsForAnalysisMode(
  years: string[],
  analysisMode: AnalysisMode,
): string[] {
  return years.filter((year) => {
    if (isYearBeforePeriodSelectionMin(year)) return false;
    if (isIntradayAnalysisMode(analysisMode)) return true;
    if (ALLOW_CURRENT_YEAR_ANNUAL_SELECTION) return true;
    return year !== getCurrentYearString();
  });
}

/** Meses selecionáveis de um ano (ex.: accordion Mensal). */
export function getSelectableMonthsForYear(
  yearMonths: string[],
  analysisMode: AnalysisMode,
): string[] {
  return yearMonths.filter(
    (month) =>
      !isMonthBeforePeriodSelectionMin(month) &&
      !isMonthPeriodBlocked(month, analysisMode),
  );
}

export function isYearPeriodSelectable(
  year: string,
  analysisMode: AnalysisMode,
): boolean {
  return (
    !isYearBeforePeriodSelectionMin(year) &&
    !isYearPeriodBlocked(year, analysisMode)
  );
}

export function parseDateBRToDay(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return undefined;
  const d = new Date(+parts[2], +parts[1] - 1, +parts[0]);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export function formatDateBRFromDay(date: Date): string {
  return formatDate(date);
}
