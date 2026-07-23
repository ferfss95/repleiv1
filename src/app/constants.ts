import {
  Building2,
  MapPin,
  Building,
  Users,
  Receipt,
  Truck,
  UserCircle,
  Flag,
} from 'lucide-react';
import {
  buildPeriodSelectionMonthsOptions,
  buildPeriodSelectionYearsOptions,
} from './data/periodSelectionLimits';

// Definição do ícone StoreIcon (importado no App.tsx original)
const StoreIcon = Building2;

// Types
export type Module = 'PRODUTO' | 'LOJA' | 'EXTRAVIOS' | 'INDICADORES';
export type Step = 'selection' | 'grouping' | 'exclusion' | 'analysis';

// Steps configuration
export const STEPS: { id: Step; label: string; number: number }[] = [
  { id: 'selection', label: 'Seleção', number: 1 },
  { id: 'grouping', label: 'Agrupamento', number: 2 },
  { id: 'exclusion', label: 'Exclusão', number: 3 },
  { id: 'analysis', label: 'Resultado', number: 4 },
];

/** Quantidade máxima de níveis no agrupamento (passo «Agrupar atributos»). */
export const MAX_GROUPING_LEVELS = 5;

// Modules list
export const MODULES: Module[] = ['PRODUTO', 'LOJA', 'EXTRAVIOS', 'INDICADORES'];

// Location attributes
export const LOCATION_ATTRIBUTES = [
  { id: 'rede', label: 'REDE', icon: Building2, options: [], tooltip: '' },
  { id: 'canal', label: 'CANAL', icon: Receipt, options: [], tooltip: 'Canal de venda' },
  { id: 'tipo', label: 'TIPO', icon: Truck, options: [], tooltip: 'Como o pedido é processado e entregue' },
  { id: 'estado', label: 'ESTADO', icon: MapPin, options: [], tooltip: '' },
  { id: 'nacional', label: 'NACIONAL', icon: Flag, options: [], tooltip: '' },
  { id: 'regional', label: 'REGIONAL', icon: StoreIcon, options: [], tooltip: '' },
  { id: 'cidade', label: 'CIDADE', icon: MapPin, options: [], tooltip: '' },
  { id: 'loja', label: 'LOJA', icon: StoreIcon, options: [], tooltip: '' },
  { id: 'localizacao', label: 'LOCALIZAÇÃO', icon: Building, options: [], tooltip: 'CD ou status físico do estoque' },
  { id: 'vendedor', label: 'VENDEDOR', icon: UserCircle, options: [], tooltip: '' },
  { id: 'origem', label: 'ORIGEM', icon: Building2, options: [], tooltip: '' },
];

// Period options
export const PERIOD_OPTIONS = ['Diário', 'Mensal', 'Anual'] as const;

// Weekly day labels
export const WEEKDAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
export const WEEKDAY_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
export const MAX_WEEKLY_DAYS = 20;

// Years options (janela dinâmica: até PERIOD_SELECTION_MAX_YEARS_BACK)
export const YEARS_OPTIONS = buildPeriodSelectionYearsOptions();

// Hora a Hora hours
export const HORA_A_HORA_HOURS = [
  "00h", "01h", "02h", "03h", "04h", "05h",
  "06h", "07h", "08h", "09h", "10h", "11h",
  "12h", "13h", "14h", "15h", "16h", "17h",
  "18h", "19h", "20h", "21h", "22h", "23h",
];

// Meses exibíveis no seletor (do mês corrente até o limite de lookback)
export const MONTHS_OPTIONS: string[] = buildPeriodSelectionMonthsOptions();

// Helper functions
export function getWeekdayDatesInRange(startStr: string, endStr: string, weekdays: number[]): Date[] {
  if (!startStr || !endStr || weekdays.length === 0) return [];
  const parts1 = startStr.split('/');
  const parts2 = endStr.split('/');
  if (parts1.length !== 3 || parts2.length !== 3) return [];
  const start = new Date(+parts1[2], +parts1[1] - 1, +parts1[0]);
  const end = new Date(+parts2[2], +parts2[1] - 1, +parts2[0]);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return [];
  const result: Date[] = [];
  const cursor = new Date(start);
  while (cursor <= end && result.length < 366) {
    if (weekdays.includes(cursor.getDay())) result.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
}

export function formatDateBRShort(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export function isYearChange(currentMonth: string, previousMonth: string | null): boolean {
  if (!previousMonth) return false;
  const currentYear = currentMonth.split(' ')[1];
  const previousYear = previousMonth.split(' ')[1];
  return currentYear !== previousYear;
}
