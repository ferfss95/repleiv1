/**
 * AnalysisView Component
 * Extraído de App.tsx — contém toda a lógica de visualização de análises
 */
import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  ChevronRight,
  Check,
  Filter,
  Anchor,
  Layers,
  ChevronDown,
  ChevronLeft,
  Calendar as CalendarIcon,
  TrendingUp,
  LineChart as LineChartIcon,
  BarChart3,
  Package,
  Percent,
  ArrowUp,
  ArrowDown,
  Download,
  FileSpreadsheet,
  Image as ImageIcon,
  ArrowLeftRight,
  Tag,
  Palette,
  Component,
  Hash,
  Ban,
  Clock,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  ReferenceLine,
  Legend,
} from "recharts";
import * as htmlToImage from "html-to-image";
import * as XLSX from "xlsx";
import * as Popover from "@radix-ui/react-popover";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { cn } from "../../utils";
import {
  LOCATION_ATTRIBUTES,
  MONTHS_OPTIONS,
  HORA_A_HORA_HOURS,
  WEEKDAY_FULL,
  type Module,
} from "../../constants";
import {
  getToday,
  getTodayFormatted,
  getCurrentMonthString,
  getCurrentYearString,
  formatDate,
} from "../../dateUtils";
import { computePeriodDisplayText } from "../../utils/analysisPeriodSummary";
import { IntradaySyncMetadata } from "../IntradaySyncMetadata";
import { AnalysisSummaryChipsShell } from "./AnalysisSummaryChipsShell";
import {
  ANALYSIS_SUMMARY_TAG_BTN_CLASS,
  ANALYSIS_SUMMARY_TAG_STYLE,
} from "./analysisSummaryTagStyles";
import {
  METRIC_CONFIG,
  METRIC_ABBREVIATIONS,
  formatMetricValue,
  isPercentRatioAggregatedAverage,
  filterCitiesByKnownLinks,
  filterRegionalsByKnownLinks,
  filterNacionalsByKnownLinks,
  filterStatesByKnownLinks,
  filterStoresByKnownLinks,
  applyParentContextToOptions,
} from "../../referenceData";
import { bc, shortPeriodLabel } from "../../utils/formatting";
import { isPlanningMetric, getPlanningBg, generateHourlyValue } from "../../utils/dataGenerators";
import { hashString } from "../../utils/calculations";
import {
  computePivotPeriodStockIndexSalt,
  computeStandardStockIndexSalt,
  isStockRelatedMetric,
  type StockSaltContext,
} from "../../utils/stockSnapshot";
import { computeLojaVendaProjectionMesVigente } from "../../utils/lojaProjection";
import {
  sortAnalysisRowTree,
  makeRowComparator,
  ANALYSIS_ATTRIBUTE_SORT_KEY,
} from "../../utils/sortAnalysisRowTree";
import {
  collectAllDomainAttributes,
  type ModuleConfig,
} from "../../modules/types";
import {
  NEUTRAL_PALETTE,
  type ModuleColors,
} from "../../constants/moduleColors";
import type { AnalysisMode, AveragePeriodType } from "../../types/wizard";
import {
  ANALYSIS_TABLE_CLASS,
  ANALYSIS_TABLE_STYLE,
  getTableDataRowBg,
  getTableModuleTheme,
} from "../../constants/tableModuleTheme";
import { TableHatchSurface } from "./tableHatchCells";
import {
  stickyPivotHeaderCornerStyle,
  stickyPivotHeaderRow1Style,
  stickyPivotHeaderRow2Style,
  stickyPivotTotalCellStyle,
  stickyPivotTotalCornerStyle,
  stickyStdHeaderCellStyle,
  stickyStdHeaderCornerStyle,
  stickyStdTotalCellStyle,
  stickyStdTotalCornerStyle,
} from "./analysisTableStickyLayout";
import {
  COMPARATIVO_PERIOD_LABELS,
  getComparativoPeriodLabel,
  isComparativoPeriodKey,
  isComparativoPeriodOne,
} from "../../constants/labels";
import { getMetricSidebarLabel, getMetricTableLabel } from "../../data/metricNaming";
import { SHOW_ANALYSIS_RESULT_TOOLBAR } from "../../data/analysisResultToolbarVisibility";
import { MetricColumnHeaderTooltip } from "../MetricOrientationTooltip";

// ══════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════

interface AnalysisViewProps {
  /** Elemento DOM no SecondaryHeader onde os action buttons serão portados */
  actionsContainer?: HTMLDivElement | null;
  moduleConfig: ModuleConfig;
  moduleColors: ModuleColors;
  selectedMetrics: string[];
  grouping: string[];
  getAttributeOptions: (attrId: string) => string[];
  selections: Record<string, string[]>;
  exclusions: Record<string, string[]>;
  periodType: "Diário" | "Mensal" | "Anual";
  dateRange: { start: string; end: string };
  selectedMonths: string[];
  selectedYears: string[];
  isTimeDrilldownEnabled: boolean;
  analysisMode: AnalysisMode;
  compDateRange1: { start: string; end: string };
  compDateRange2: { start: string; end: string };
  compMonths1: string[];
  compMonths2: string[];
  compYears1: string[];
  compYears2: string[];
  customTitle?: string;
  weeklyMode: "specific" | "weekday";
  weeklyComputedDays: Date[];
  selectedSpecificDays: string[];
  compWeeklyComputedDays1: Date[];
  compWeeklyComputedDays2: Date[];
  compSpecificDays1: string[];
  compSpecificDays2: string[];
  averagePeriodType: AveragePeriodType;
  setAveragePeriodType: (type: AveragePeriodType) => void;
  averageDropdownOpen: boolean;
  setAverageDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showSharePct: boolean;
  setShowSharePct: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AnalysisView = React.memo<AnalysisViewProps>(function AnalysisView({
  actionsContainer,
  moduleConfig,
  moduleColors,
  selectedMetrics,
  grouping,
  getAttributeOptions,
  selections,
  exclusions,
  periodType,
  dateRange,
  selectedMonths,
  selectedYears,
  isTimeDrilldownEnabled,
  analysisMode,
  compDateRange1,
  compDateRange2,
  compMonths1,
  compMonths2,
  compYears1,
  compYears2,
  customTitle,
  weeklyMode,
  weeklyComputedDays,
  selectedSpecificDays,
  compWeeklyComputedDays1,
  compWeeklyComputedDays2,
  compSpecificDays1,
  compSpecificDays2,
  averagePeriodType,
  setAveragePeriodType,
  averageDropdownOpen,
  setAverageDropdownOpen,
  showSharePct,
  setShowSharePct,
}: AnalysisViewProps) {
  // ── Module-level aliases ─────────────────���────────────────
  // These shadow the removed module-level constants so all internal
  // references remain unchanged when new modules are added.
  const METRICS_LIST = moduleConfig.metrics;
  const MODULE_TITLES = moduleConfig.analysisTitles as Record<
    string,
    string
  >;
  const tableTheme = getTableModuleTheme(
    moduleConfig.id === "PRODUTO" ||
      moduleConfig.id === "LOJA" ||
      moduleConfig.id === "INDICADORES" ||
      moduleConfig.id === "EXTRAVIOS"
      ? (moduleConfig.id as Module)
      : "PRODUTO",
  );
  const TABLE_HEADER_BG = tableTheme.headerBg;
  const TABLE_HEADER_TEXT = tableTheme.headerText;
  const PIVOT_DERIVED_HEADER_BG = tableTheme.subHeaderBg;
  const PIVOT_DERIVED_HEADER_TEXT = tableTheme.subHeaderText;
  const totalColumnBg =
    analysisMode === "evolucao" ||
    analysisMode === "horaahora" ||
    analysisMode === "comparativo"
      ? tableTheme.subHeaderBg
      : tableTheme.rowEvenBg;

  const resolveTableRowBg = (
    rowId: string,
    dataRowIndex: number,
    isTotalRow = false,
  ): string => {
    if (isTotalRow) return tableTheme.rowEvenBg;
    if (hoveredTableRowId === rowId) return tableTheme.rowHoverBg;
    return getTableDataRowBg(tableTheme, dataRowIndex);
  };

  // Attribute label/icon helpers — resolved via active module domain + shared location
  const getAttributeLabel = (id: string): string => {
    const attr =
      collectAllDomainAttributes(moduleConfig).find((a) => a.id === id) ||
      LOCATION_ATTRIBUTES.find((a) => a.id === id);
    return attr?.label || id;
  };
  const getAttributeIcon = (id: string) => {
    const attr =
      collectAllDomainAttributes(moduleConfig).find((a) => a.id === id) ||
      LOCATION_ATTRIBUTES.find((a) => a.id === id);
    return attr?.icon || Tag;
  };

  // Helper to check if average is active
  const showAverage = averagePeriodType !== null;

  // Colunas da tabela = ordem em que o usuário clicou nas métricas (selectedMetrics)
  const orderedMetrics = React.useMemo(() => {
    const valid = new Set(METRICS_LIST.map((m) => m.id));
    const seen = new Set<string>();
    const out: string[] = [];
    for (const id of selectedMetrics) {
      if (!valid.has(id) || seen.has(id)) continue;
      seen.add(id);
      out.push(id);
    }
    return out;
  }, [selectedMetrics, METRICS_LIST]);

  // Sort State
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Expanded State (for Drilldown)
  const [expandedRows, setExpandedRows] = useState<string[]>(
    [],
  );

  // Column Widths State - largura inicial de 350px para coluna de atributo
  const [columnWidths, setColumnWidths] = useState<
    Record<string, number>
  >({ grouping: 350 });
  const resizingRef = React.useRef<{
    id: string;
    startX: number;
    startWidth: number;
  } | null>(null);

  // Chart visibility & type state (managed locally in AnalysisView)
  const [showChartSection, setShowChartSection] =
    useState(false);
  const [chartTypeMode, setChartTypeMode] = useState<
    "bar" | "line" | "pie"
  >("bar");
  const [chartDropdownOpen, setChartDropdownOpen] =
    useState(false);

  React.useEffect(() => {
    if (!SHOW_ANALYSIS_RESULT_TOOLBAR) {
      setShowSharePct(false);
      setAveragePeriodType(null);
      setAverageDropdownOpen(false);
      setShowChartSection(false);
      setChartDropdownOpen(false);
    }
  }, [
    setShowSharePct,
    setAveragePeriodType,
    setAverageDropdownOpen,
    setShowChartSection,
    setChartDropdownOpen,
  ]);

  // Chart & Table visibility state
  const [showChart, setShowChart] = useState(true);
  const [showTable, setShowTable] = useState(true);
  const chartContainerRef = React.useRef<HTMLDivElement>(null);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const [hoveredTableRowId, setHoveredTableRowId] = React.useState<string | null>(
    null,
  );

  // Chart control states — multi-metric (up to 3)
  const [chartMetricIds, setChartMetricIds] = useState<string[]>([]);
  const [chartPageSize, setChartPageSize] =
    useState<number>(10);
  const [chartCurrentPage, setChartCurrentPage] = useState(0);

  // Temporal chart state
  const [temporalLimit, setTemporalLimit] = useState<number>(5);
  const [temporalCurrentPage, setTemporalCurrentPage] =
    useState(0);
  const [temporalHiddenItems, setTemporalHiddenItems] =
    useState<Set<string>>(new Set());
  const DEFAULT_INTRADAY_HOURS = React.useMemo(
    () =>
      HORA_A_HORA_HOURS.filter(
        (hour) => parseInt(hour.replace("h", ""), 10) >= 9,
      ),
    [],
  );
  const [selectedIntradayHours, setSelectedIntradayHours] =
    useState<string[]>(() =>
      HORA_A_HORA_HOURS.filter(
        (hour) => parseInt(hour.replace("h", ""), 10) >= 9,
      ),
    );

  // Period pagination state (controls how many periods appear on the X-axis of temporal charts)
  const [periodPageSize, setPeriodPageSize] =
    useState<number>(12);
  const [periodCurrentPage, setPeriodCurrentPage] = useState(0);

  // Metrics already expressed as % or variation (with colors) — excluded from share % feature
  const PCT_EXCLUDED_METRICS = new Set([
    "margem",
    "margem_liquida",
    "sss",
    // Apenas métricas que já são variação % (desvio meta %)
    "desvio_meta_p",
    "pct_projecao_venda",
    "ppa",
    "match_preco",
    "ind_ppa",
    "ind_match_preco",
  ]);

  // Temporal chart: color palette — sem conflito com azul (seleção), verde (resultado) ou vermelho (exclusão)
  // P1–P3 principais + Cinza solid + R1–R10 randômicas
  const TEMPORAL_COLORS = [
    "#6C63FF", // P1 Violeta
    "#F5A623", // P2 Âmbar
    "#00BCD4", // P3 Ciano
    "#314158", // Cinza solid (4ª série neutra)
    "#E91E8C", // R1 Rosa
    "#FF6B6B", // R2 Coral
    "#FF8C00", // R3 Abóbora
    "#8BC34A", // R4 Lima
    "#009688", // R5 Teal
    "#3949AB", // R6 Índigo
    "#AB47BC", // R7 Lilás
    "#D81B60", // R8 Magenta
    "#795548", // R9 Marrom
    "#9E9D24", // R10 Oliva
  ];

  // Muted color for negative bar values — same hue but very light
  const negativeBarColor = (baseColor: string): string => {
    const map: Record<string, string> = {
      "#6C63FF": "#c9c6fb", // Violeta muted
      "#F5A623": "#fad9a1", // Âmbar muted
      "#00BCD4": "#a7e9f3", // Ciano muted
      "#314158": "#a8bece", // Cinza muted
      "#94a3b8": "#cbd5e1", // Slate muted (comparativo P1)
    };
    return map[baseColor] ?? "#cbd5e1";
  };

  // Toggle a metric in chart (max 2)
  const toggleChartMetric = React.useCallback((mId: string) => {
    setChartMetricIds((prev) => {
      if (prev.includes(mId)) {
        // Don't allow removing the last one
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== mId);
      }
      if (prev.length >= 2) return prev; // max 2
      return [...prev, mId];
    });
  }, []);

  // Sync chartMetricIds when selectedMetrics change
  React.useEffect(() => {
    setChartMetricIds((prev) => {
      const valid = prev.filter((id) =>
        selectedMetrics.includes(id),
      );
      if (valid.length > 0) return valid;
      if (selectedMetrics.length === 0) return [];
      return [selectedMetrics[0]];
    });
  }, [selectedMetrics]);

  // ──────────────────────────────────────────────────────────────
  // Average (x̄) Helper Functions
  // ──────────────────────────────────────────────────────────────

  // Parse BR date (DD/MM/YYYY) to Date object
  const parseBRDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;
    return new Date(+parts[2], +parts[1] - 1, +parts[0]);
  };

  // Calculate days, months, and years in a date range
  const calculatePeriodCounts = (
    startStr: string,
    endStr: string,
  ): { days: number; months: number; years: number } => {
    const start = parseBRDate(startStr);
    const end = parseBRDate(endStr);

    if (!start || !end || start > end) {
      return { days: 0, months: 0, years: 0 };
    }

    // Calculate days
    const diffTime = end.getTime() - start.getTime();
    const days =
      Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end

    // Calculate months
    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months += end.getMonth() - start.getMonth() + 1; // +1 for inclusive count

    // Calculate years
    const years = end.getFullYear() - start.getFullYear() + 1; // +1 for inclusive count

    return { days, months, years };
  };

  // Calculate period count within a specific month/year (for evolutiva)
  const calculateDaysInMonth = (monthYear: string): number => {
    // monthYear format: "Janeiro 2024"
    const parts = monthYear.split(" ");
    if (parts.length !== 2) return 30; // fallback

    const monthMap: Record<string, number> = {
      janeiro: 0,
      fevereiro: 1,
      março: 2,
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

    const month = monthMap[parts[0].toLowerCase()];
    const year = parseInt(parts[1]);

    if (isNaN(month) || isNaN(year)) return 30; // fallback

    // Get last day of month
    const lastDay = new Date(year, month + 1, 0).getDate();
    return lastDay;
  };

  const calculateDaysInYear = (year: string): number => {
    const y = parseInt(year);
    if (isNaN(y)) return 365;

    // Check if leap year
    const isLeap =
      (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    return isLeap ? 366 : 365;
  };

  // Resolve divisores (dias/meses/anos) com base no recorte temporal realmente selecionado
  // para evitar médias idênticas ao valor bruto quando o período inclui múltiplos meses/anos.
  const getAverageDivisors = (
    periodStr?: string,
  ): { days: number; months: number; years: number } => {
    const safe = (n: number) => (Number.isFinite(n) && n > 0 ? n : 1);
    const isComparativo = analysisMode === "comparativo";

    if (periodType === "Diário") {
      const range =
        isComparativo && isComparativoPeriodKey(periodStr)
          ? isComparativoPeriodOne(periodStr)
            ? compDateRange1
            : compDateRange2
          : dateRange;
      const counts = calculatePeriodCounts(range.start, range.end);
      return {
        days: safe(counts.days),
        months: safe(counts.months),
        years: safe(counts.years),
      };
    }

    if (periodType === "Mensal") {
      const months =
        isComparativo && isComparativoPeriodKey(periodStr)
          ? isComparativoPeriodOne(periodStr)
            ? compMonths1.length
            : compMonths2.length
          : selectedMonths.length;

      // Base anual para converter meses em dias na média diária
      const baseYearStr =
        isComparativo && isComparativoPeriodKey(periodStr)
          ? isComparativoPeriodOne(periodStr)
            ? compYears1[0] || selectedYears[0] || getCurrentYearString()
            : compYears2[0] || selectedYears[0] || getCurrentYearString()
          : selectedYears[0] || getCurrentYearString();

      const baseYearDays = calculateDaysInYear(baseYearStr);
      const days = Math.round((baseYearDays / 12) * safe(months));

      return {
        days: safe(days),
        months: safe(months),
        years: safe(months / 12),
      };
    }

    // periodType === "Anual"
    const years =
      isComparativo && isComparativoPeriodKey(periodStr)
        ? isComparativoPeriodOne(periodStr)
          ? compYears1.length
          : compYears2.length
        : selectedYears.length;

    const yearList =
      isComparativo && isComparativoPeriodKey(periodStr)
        ? isComparativoPeriodOne(periodStr)
          ? compYears1
          : compYears2
        : selectedYears;

    const daysFromYears =
      yearList.length > 0
        ? yearList.reduce(
            (acc, y) => acc + calculateDaysInYear(y),
            0,
          )
        : safe(years) * 365;

    return {
      days: safe(daysFromYears),
      months: safe(years) * 12,
      years: safe(years),
    };
  };

  // Get available average options based on analysis mode and period
  const getAvailableAverageOptions = (): {
    disabled: boolean;
    tooltip: string;
    options: {
      id: "Dia" | "Mês" | "Ano";
      disabled: boolean;
      tooltip: string;
    }[];
  } => {
    const isEvo = analysisMode === "evolucao";
    const shortIntervalTooltip =
      "Intervalo de tempo muito curto, cálculo de média não disponível";

    // For evolutiva mode
    if (isEvo) {
      if (periodType === "Diário") {
        return {
          disabled: true,
          tooltip:
            "Não é possível adicionar média na análise evolutiva com intervalo diário",
          options: [],
        };
      }

      if (periodType === "Mensal") {
        return {
          disabled: false,
          tooltip: "",
          options: [
            { id: "Dia", disabled: false, tooltip: "" },
            {
              id: "Mês",
              disabled: true,
              tooltip:
                "Opção não disponível para análise evolutiva com intervalo mensal",
            },
            {
              id: "Ano",
              disabled: true,
              tooltip:
                "Opção não disponível para análise evolutiva com intervalo mensal",
            },
          ],
        };
      }

      if (periodType === "Anual") {
        return {
          disabled: false,
          tooltip: "",
          options: [
            { id: "Dia", disabled: false, tooltip: "" },
            { id: "Mês", disabled: false, tooltip: "" },
            {
              id: "Ano",
              disabled: true,
              tooltip:
                "Opção não disponível para análise evolutiva com intervalo anual",
            },
          ],
        };
      }
    }

    // For geral, comparativo and intraday modes:
    // availability follows temporal volume, not just calendar boundaries.
    let hasDays = true;
    let hasMonths = false;
    let hasYears = false;

    if (periodType === "Diário") {
      const range =
        analysisMode === "comparativo"
          ? compDateRange1
          : dateRange;
      const { days } = calculatePeriodCounts(range.start, range.end);
      hasDays = days >= 1;
      // "Apenas dias": intervalos curtos não habilitam mês/ano
      hasMonths = days >= 28;
      hasYears = days >= 365;
    } else if (periodType === "Mensal") {
      const monthCount =
        analysisMode === "comparativo"
          ? compMonths1.length
          : selectedMonths.length;
      hasDays = monthCount > 0;
      hasMonths = monthCount > 0;
      // Só habilita anual quando volume mensal representa ao menos 1 ano
      hasYears = monthCount >= 12;
    } else if (periodType === "Anual") {
      const yearCount =
        analysisMode === "comparativo"
          ? compYears1.length
          : selectedYears.length;
      hasDays = yearCount > 0;
      hasMonths = yearCount > 0;
      hasYears = yearCount > 0;
    }

    const options: {
      id: "Dia" | "Mês" | "Ano";
      disabled: boolean;
      tooltip: string;
    }[] = [
      {
        id: "Dia",
        disabled: !hasDays,
        tooltip: !hasDays ? shortIntervalTooltip : "",
      },
      {
        id: "Mês",
        disabled: !hasMonths,
        tooltip: !hasMonths ? shortIntervalTooltip : "",
      },
      {
        id: "Ano",
        disabled: !hasYears,
        tooltip: !hasYears ? shortIntervalTooltip : "",
      },
    ];

    return {
      disabled: false,
      tooltip: "",
      options,
    };
  };

  // Calculate average value based on period type
  const calculateAverage = (
    value: number,
    periodStr?: string,
  ): number => {
    if (!averagePeriodType || value === 0) return 0;

    const isEvo = analysisMode === "evolucao";

    // For evolutiva mode with periodStr (month/year)
    if (isEvo && periodStr) {
      if (averagePeriodType === "Dia") {
        if (periodType === "Mensal") {
          const daysInMonth = calculateDaysInMonth(periodStr);
          return value / daysInMonth;
        }
        if (periodType === "Anual") {
          const daysInYear = calculateDaysInYear(periodStr);
          return value / daysInYear;
        }
      }
      if (
        averagePeriodType === "Mês" &&
        periodType === "Anual"
      ) {
        return value / 12;
      }
    }

    // For general, comparative, and intraday modes
    const { days, months, years } = getAverageDivisors(periodStr);

    if (averagePeriodType === "Dia") return value / days;
    if (averagePeriodType === "Mês") return value / months;
    if (averagePeriodType === "Ano") return value / years;

    return value;
  };

  // Calculate average for total row (without periodStr parameter)
  const calculateAverageForTotal = (
    value: number,
  ): number | null => {
    if (!averagePeriodType || value === 0) return null;

    const { days, months, years } = getAverageDivisors();

    if (averagePeriodType === "Dia") return value / days;
    if (averagePeriodType === "Mês") return value / months;
    if (averagePeriodType === "Ano") return value / years;

    return null;
  };

  // Format number with specified decimal places
  const formatNumber = (
    value: number,
    decimals: number = 0,
  ): string => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  // Largura da coluna de % (quando ADD % está ativo)
  const PCT_COL_WIDTH = 70;
  const PCT_COL_EXTRA = 70; // Espaço extra adicionado às colunas pivot quando ADD % está ativo

  // Largura da coluna de média (quando ADD x̄ está ativo)
  const AVG_COL_WIDTH = 85;

  // Função que retorna largura otimizada baseada no tipo de dado da métrica
  const getOptimalMetricWidth = (metricId: string): number => {
    const config = METRIC_CONFIG[metricId];
    const format = config?.format || "string";

    // Larguras otimizadas por tipo de dado
    switch (format) {
      case "currency":
        return 100; // Valores monetários (ex: 5.211, 12.345)
      case "percent":
      case "percent0":
      case "percent1":
        return 75; // Percentuais (ex: 15,7%, 100%)
      case "integer":
        return 85; // Inteiros (ex: 820, 1.234)
      case "decimal":
      case "decimal1":
        return 90; // Decimais (ex: 12,5, 123,45)
      case "variation":
        return 85; // Variações (ex: +5,2%, -3,4%)
      default:
        return 95; // Default
    }
  };

  // Width helper — usa largura customizada pelo usuário OU largura otimizada
  const getStdMetricWidth = (mId: string) =>
    columnWidths[mId] || getOptimalMetricWidth(mId);

  // Render metric value cell (SEM % inline - % agora vai em coluna separada)
  const renderMetricValue = (
    value: number,
    mId: string,
  ): React.ReactNode => {
    const config = METRIC_CONFIG[mId];
    const formatted = formatMetricValue(
      value,
      config?.format || "string",
    );

    // Apply color for variation metrics (positive/negative)
    if (config?.format === "variation") {
      const isPositive = value > 0;
      const isNegative = value < 0;
      const colorClass = isPositive
        ? "text-[#276749]"
        : isNegative
          ? "text-[#9B2C2C]"
          : "text-slate-700";
      const ArrowIcon = isPositive
        ? ArrowUp
        : isNegative
          ? ArrowDown
          : null;

      return (
        <span
          className={`flex items-center justify-end gap-1.5 ${colorClass}`}
        >
          {formatted}
          {ArrowIcon && <ArrowIcon size={14} />}
        </span>
      );
    }

    return formatted;
  };

  // Render % cell (NOVA função para coluna separada de %)
  const renderPctValue = (
    value: number,
    columnTotal: number | null | undefined,
  ): React.ReactNode => {
    if (columnTotal == null || columnTotal === 0) return "—";
    const pct = Math.abs((value / columnTotal) * 100);
    const isTotal = pct >= 99.999;
    const pctStr = isTotal
      ? "100%"
      : new Intl.NumberFormat("pt-BR", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(pct) + "%";
    return pctStr;
  };

  // Função legada mantida para compatibilidade com tabelas pivot
  const renderCellWithPct = (
    value: number,
    mId: string,
    columnTotal: number | null | undefined,
    skipPct = false,
    multipleRows = true,
  ): React.ReactNode => {
    return renderMetricValue(value, mId);
  };

  // Scroll shadow state
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [scrollShadows, setScrollShadows] = React.useState({
    left: false,
    right: false,
  });

  const updateScrollShadows = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setScrollShadows({
      left: scrollLeft > 5,
      right: scrollLeft + clientWidth < scrollWidth - 5,
    });
  }, []);

  React.useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    updateScrollShadows();
    el.addEventListener("scroll", updateScrollShadows, {
      passive: true,
    });
    const ro = new ResizeObserver(updateScrollShadows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollShadows);
      ro.disconnect();
    };
  }, [updateScrollShadows]);

  // Resize Handlers — each mousedown creates a self-contained closure so
  // event listener references are always correct (no stale-reference leak).
  const handleMouseDown = (
    e: React.MouseEvent,
    colId: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const currentWidth =
      columnWidths[colId] ||
      (colId === "grouping"
        ? 350
        : getOptimalMetricWidth(colId));
    resizingRef.current = {
      id: colId,
      startX: e.pageX,
      startWidth: currentWidth,
    };

    const onMouseMove = (ev: MouseEvent) => {
      if (!resizingRef.current) return;
      const { id, startX, startWidth } = resizingRef.current;
      const diff = ev.pageX - startX;
      setColumnWidths((prev) => ({
        ...prev,
        [id]: Math.max(120, startWidth + diff),
      }));
    };

    const onMouseUp = () => {
      resizingRef.current = null;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "col-resize";
  };

  // Cleanup: ensure cursor resets if component unmounts during a resize
  React.useEffect(() => {
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  // grouping is now string[] (ordered hierarchy)
  const groupingArr: string[] = Array.isArray(grouping)
    ? grouping
    : grouping
      ? [grouping]
      : [];

  // Helper: get filtered options for a grouping attribute, respecting selections, exclusions, and cross-attribute relationships
  const getFilteredGroupOptions = React.useCallback(
    (attrId: string): string[] => {
      let options = getAttributeOptions(attrId);

      // 1. If user selected specific items for THIS attribute, restrict to only those
      const selected = selections[attrId];
      if (selected && selected.length > 0) {
        const allOptions = getAttributeOptions(attrId);
        // Only filter if it's a partial selection (not all selected)
        if (selected.length < allOptions.length) {
          options = options.filter((opt: string) =>
            selected.includes(opt),
          );
        }
      }

      // 2. Remove excluded items for THIS attribute
      const excluded = exclusions[attrId];
      if (excluded && excluded.length > 0) {
        options = options.filter(
          (opt: string) => !excluded.includes(opt),
        );
      }

      // 3. Cross-attribute filtering: aplica vínculos conhecidos para lojas
      if (attrId === "loja") {
        options = filterStoresByKnownLinks(options, selections);
      }

      // 4. Cross-attribute filtering: aplica vínculos conhecidos para cidades
      if (attrId === "cidade") {
        options = filterCitiesByKnownLinks(options, selections);
      }

      // 4.1 Cross-attribute filtering: aplica vínculos conhecidos para regionais
      if (attrId === "regional") {
        options = filterRegionalsByKnownLinks(options, selections);
      }

      // 4.2 Cross-attribute filtering: aplica vínculos conhecidos para estados
      if (attrId === "estado") {
        options = filterStatesByKnownLinks(options, selections);
      }

      // 4.3 Cross-attribute filtering: aplica vínculos conhecidos para nacional
      if (attrId === "nacional") {
        options = filterNacionalsByKnownLinks(options, selections);
      }

      // 5. Module-specific cross-attribute filtering (e.g. categoria↔modalidade, grupo↔subgrupo)
      if (moduleConfig?.getFilteredGroupOptions) {
        options = moduleConfig.getFilteredGroupOptions(
          attrId,
          options,
          selections,
          exclusions,
        );
      }

      return options;
    },
    [getAttributeOptions, selections, exclusions, moduleConfig],
  );

  const stockSaltContext = React.useMemo(
    (): StockSaltContext => ({
      analysisMode,
      periodType,
      dateRange,
      selectedMonths,
      selectedYears,
      selectedSpecificDays,
      weeklyMode,
      weeklyComputedDays,
      compDateRange1,
      compDateRange2,
      compMonths1,
      compMonths2,
      compYears1,
      compYears2,
      compSpecificDays1,
      compSpecificDays2,
      compWeeklyComputedDays1,
      compWeeklyComputedDays2,
    }),
    [
      analysisMode,
      periodType,
      dateRange,
      selectedMonths,
      selectedYears,
      selectedSpecificDays,
      weeklyMode,
      weeklyComputedDays,
      compDateRange1,
      compDateRange2,
      compMonths1,
      compMonths2,
      compYears1,
      compYears2,
      compSpecificDays1,
      compSpecificDays2,
      compWeeklyComputedDays1,
      compWeeklyComputedDays2,
    ],
  );

  const standardStockIndexSalt = React.useMemo(
    () => computeStandardStockIndexSalt(stockSaltContext),
    [stockSaltContext],
  );

  const LOJA_MOCK_VARIACAO_MIN = 0.85;
  const LOJA_MOCK_VARIACAO_MAX = 1.2;

  const daysInCalendarMonth = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

  const lojaMockVariacaoFromSeed = (baseSeed: number) => {
    const range = LOJA_MOCK_VARIACAO_MAX - LOJA_MOCK_VARIACAO_MIN;
    return (
      LOJA_MOCK_VARIACAO_MIN +
      ((baseSeed % 100) / 100) * range
    );
  };

  /** Dias do período selecionado e base de dias do mês (mock ROB proporcional). */
  const getLojaRobMockPeriodFactors = (): {
    daysInPeriod: number;
    monthTotalDays: number;
  } => {
    if (periodType === "Diário") {
      const range =
        analysisMode === "comparativo" ? compDateRange1 : dateRange;
      const { days } = calculatePeriodCounts(range.start, range.end);
      const start = parseBRDate(range.start);
      const end = parseBRDate(range.end);
      if (!start || !end || start > end) {
        return { daysInPeriod: 1, monthTotalDays: 30 };
      }
      let monthTotalDays: number;
      if (
        start.getMonth() === end.getMonth() &&
        start.getFullYear() === end.getFullYear()
      ) {
        monthTotalDays = daysInCalendarMonth(start);
      } else {
        let sum = 0;
        let cnt = 0;
        const cur = new Date(start.getFullYear(), start.getMonth(), 1);
        const lastSlot = end.getFullYear() * 12 + end.getMonth();
        while (cur.getFullYear() * 12 + cur.getMonth() <= lastSlot) {
          sum += daysInCalendarMonth(cur);
          cnt++;
          cur.setMonth(cur.getMonth() + 1);
        }
        monthTotalDays =
          cnt > 0 ? Math.max(1, Math.round(sum / cnt)) : 30;
      }
      return {
        daysInPeriod: Math.max(1, days),
        monthTotalDays: Math.max(1, monthTotalDays),
      };
    }

    if (periodType === "Mensal") {
      const months =
        analysisMode === "comparativo" ? compMonths1 : selectedMonths;
      if (!months || months.length === 0) {
        return { daysInPeriod: 30, monthTotalDays: 30 };
      }
      let totalDays = 0;
      for (const my of months) {
        totalDays += calculateDaysInMonth(my);
      }
      const avg = totalDays / months.length;
      return {
        daysInPeriod: Math.max(1, totalDays),
        monthTotalDays: Math.max(1, Math.round(avg)),
      };
    }

    const years =
      analysisMode === "comparativo" ? compYears1 : selectedYears;
    const yc = Math.max(1, years?.length || 1);
    const dpy = 365;
    return {
      daysInPeriod: Math.max(1, yc * dpy),
      monthTotalDays: dpy,
    };
  };

  // Orçamento de nós POR sub-árvore: garante que todos os nós raiz apareçam.
  // Cada nó raiz (nível 0) reinicia o orçamento; sub-níveis o consomem.
  const _buildBudget = React.useRef<{ remaining: number }>({ remaining: 0 });
  const MAX_SUBTREE_NODES = 2000;

  // Recursive tree builder for multi-level grouping
  // parentContext acumula { attrId: value } de cada nível pai para restringir
  // as opções do filho somente aos itens que pertencem ao pai correto.
  const buildGroupTree = (
    levels: string[],
    levelIndex: number,
    parentId: string,
    parentSeed: number,
    parentContext: Record<string, string> = {},
    lastLojaSeed?: number,
  ): any[] => {
    if (levelIndex >= levels.length) return [];
    // Somente sub-níveis (> 0) consomem orçamento; raiz sempre processa.
    if (levelIndex > 0 && _buildBudget.current.remaining <= 0) return [];

    const attrId = levels[levelIndex];
    // 1. Obtém opções base respeitando seleções/exclusões globais
    let options = getFilteredGroupOptions(attrId);
    // 2. Restringe pelo contexto dos níveis pai (ex: loja só da regional acima)
    if (Object.keys(parentContext).length > 0) {
      options = applyParentContextToOptions(attrId, parentContext, options);
    }
    const isLeaf = levelIndex === levels.length - 1;

    const siblingCount = Math.max(1, options.length);

    return options.map((opt: string, idx: number) => {
      if (levelIndex === 0) {
        // Cada nó raiz inicia sub-árvore com orçamento próprio
        _buildBudget.current = { remaining: MAX_SUBTREE_NODES };
      } else {
        if (_buildBudget.current.remaining <= 0) return null;
        _buildBudget.current.remaining--;
      }

      const rowId = parentId ? `${parentId}|${opt}` : opt;
      const seed = hashString(opt, parentSeed + idx * 7);
      // Propaga contexto acumulado + valor deste nível para o próximo
      const childContext = { ...parentContext, [attrId]: opt };
      const nextLastLojaSeed = attrId === "loja" ? seed : lastLojaSeed;

      const children = isLeaf
        ? []
        : buildGroupTree(
            levels,
            levelIndex + 1,
            rowId,
            seed,
            childContext,
            nextLastLojaSeed,
          );

      const rowData: any = {
        id: rowId,
        label: opt,
        depth: levelIndex,
        attrId: attrId,
        hasChildren: children.length > 0,
        children: children,
      };

      if (children.length > 0) {
        // Aggregate metrics from children
        METRICS_LIST.forEach((m) => {
          if (m.id === "vlr_projecao_venda") {
            rowData[m.id] = children.reduce(
              (a: number, c: any) => a + (Number(c[m.id]) || 0),
              0,
            );
            return;
          }
          if (m.id === "pct_projecao_venda") {
            const sumV = children.reduce(
              (a: number, c: any) => a + (Number(c.vlr_projecao_venda) || 0),
              0,
            );
            const sumG = children.reduce(
              (a: number, c: any) => a + (Number(c.meta_mensal_loja) || 0),
              0,
            );
            rowData[m.id] = sumG > 0 ? sumV / sumG : null;
            return;
          }
          const config = METRIC_CONFIG[m.id];
          const childVals = children.map((c: any) => c[m.id]);
          if (isPercentRatioAggregatedAverage(config?.format)) {
            rowData[m.id] =
              childVals.reduce(
                (a: number, b: number) => a + b,
                0,
              ) / (childVals.length || 1);
          } else {
            rowData[m.id] = childVals.reduce(
              (a: number, b: number) => a + b,
              0,
            );
          }
        });
        if (moduleConfig.id === "LOJA" && children.length > 0) {
          rowData.meta_mensal_loja = children.reduce(
            (a: number, c: any) => a + (Number(c.meta_mensal_loja) || 0),
            0,
          );
          const sumMetaCompleta = children.reduce(
            (a: number, c: any) =>
              a + (Number(c.meta_mensal_loja_completa) || 0),
            0,
          );
          if (sumMetaCompleta > 0) {
            rowData.meta_mensal_loja_completa = sumMetaCompleta;
          }
        }
      } else {
        // Leaf node: use hash-based mock data
        METRICS_LIST.forEach((m) => {
          if (
            moduleConfig.id === "LOJA" &&
            (m.id === "vlr_projecao_venda" || m.id === "pct_projecao_venda")
          ) {
            return;
          }
          const config = METRIC_CONFIG[m.id];
          if (config) {
            const index = isStockRelatedMetric(m.id)
              ? Math.abs(
                  seed + hashString(m.id) + standardStockIndexSalt,
                ) % config.data.length
              : seed % config.data.length;
            rowData[m.id] = config.data[index];
          } else {
            rowData[m.id] = 0;
          }
        });
        if (moduleConfig.id === "LOJA") {
          const metaMensalCfg = METRIC_CONFIG["meta_mensal_loja"];
          const metaLen = Math.max(1, metaMensalCfg?.data?.length ?? 1);
          const idxMetaSource =
            (rowData.attrId === "vendedor" || rowData.attrId === "setor") &&
            lastLojaSeed !== undefined
              ? lastLojaSeed
              : seed;
          const idxMeta = idxMetaSource % metaLen;

          const metaScale =
            rowData.attrId === "vendedor" || rowData.attrId === "setor"
              ? 1 / siblingCount
              : (moduleConfig.metaMensalScaleByAttr?.[rowData.attrId] ?? 1);
          // Meta mensal cheia do mês vigente (mock) — fonte fixa, nunca proporcional ao período da UI.
          const metaLojaMesVigenteCheia =
            Number(metaMensalCfg?.data[idxMeta] ?? 0) || 0;
          rowData.meta_mensal_loja = metaLojaMesVigenteCheia * metaScale;
          if (rowData.attrId === "loja") {
            rowData.meta_mensal_loja_completa = metaLojaMesVigenteCheia;
          }

          const { daysInPeriod, monthTotalDays } =
            getLojaRobMockPeriodFactors();
          const periodRatio =
            monthTotalDays > 0 ? daysInPeriod / monthTotalDays : 1;
          // Valor Meta (coluna): proporcional ao período. Projeção continua com meta mensal cheia (goalMes).
          rowData.valor_meta = Math.max(
            0,
            Math.round(
              metaLojaMesVigenteCheia * metaScale * periodRatio,
            ),
          );
          const seedRobLoja =
            (rowData.attrId === "vendedor" ||
              rowData.attrId === "setor") &&
            lastLojaSeed !== undefined
              ? lastLojaSeed
              : seed;
          const variacaoLoja = lojaMockVariacaoFromSeed(seedRobLoja);
          const robLoja = Math.max(
            1,
            Math.round(
              metaLojaMesVigenteCheia * periodRatio * variacaoLoja,
            ),
          );
          const varRange =
            LOJA_MOCK_VARIACAO_MAX - LOJA_MOCK_VARIACAO_MIN;
          if (rowData.attrId === "vendedor") {
            const variacaoVendedor =
              LOJA_MOCK_VARIACAO_MIN +
              ((hashString(opt, seed) % 100) / 100) * varRange;
            rowData.rob = Math.max(
              1,
              Math.round(
                (robLoja / siblingCount) * variacaoVendedor,
              ),
            );
          } else if (rowData.attrId === "setor") {
            const variacaoSetor =
              LOJA_MOCK_VARIACAO_MIN +
              ((hashString(opt, seed + 31) % 100) / 100) * varRange;
            rowData.rob = Math.max(
              1,
              Math.round(
                (robLoja / siblingCount) * variacaoSetor,
              ),
            );
          } else {
            rowData.rob = robLoja;
          }

          const needsProj = METRICS_LIST.some(
            (m) =>
              m.id === "vlr_projecao_venda" || m.id === "pct_projecao_venda",
          );
          if (needsProj && metaMensalCfg) {
            // Denominador da projeção: meta mensal cheia × escala só por granularidade (ex.: ÷ N vendedores).
            const goalMes = metaLojaMesVigenteCheia * metaScale;
            const todayProj = getToday();
            // Mock: mesmo ROB da linha (período selecionado). Em produção: query separada
            // (ROB monthStart → today, mesmos filtros de atributos).
            const realizedCurrentMonth = Number(rowData.rob) || 0;

            const proj = computeLojaVendaProjectionMesVigente({
              today: todayProj,
              realizedCurrentMonth,
              monthlyGoal: goalMes,
            });
            if (METRICS_LIST.some((m) => m.id === "vlr_projecao_venda")) {
              rowData.vlr_projecao_venda = proj.vlrProjecaoVenda;
            }
            if (METRICS_LIST.some((m) => m.id === "pct_projecao_venda")) {
              rowData.pct_projecao_venda = proj.pctProjecaoRatio;
            }
          }
        }
      }

      return rowData;
    }).filter(Boolean);
  };

  // Helper: compact label for a comparativo period's selections
  const compPeriodLabel = (
    items: string[],
    type: "month" | "year",
  ): string => {
    if (items.length === 0) return "";
    if (items.length === 1) return shortPeriodLabel(items[0]);
    if (type === "month") {
      const sorted = [...items].sort((a, b) => {
        const monthsList = MONTHS_OPTIONS;
        return monthsList.indexOf(a) - monthsList.indexOf(b);
      });
      return sorted.map((m) => shortPeriodLabel(m)).join(", ");
    }
    return [...items].sort().join(", ");
  };

  // Subtitle for each comparativo period column
  const compPeriodSubtitle = (periodIdx: 1 | 2): string => {
    const items =
      periodType === "Mensal"
        ? periodIdx === 1
          ? compMonths1
          : compMonths2
        : periodType === "Anual"
          ? periodIdx === 1
            ? compYears1
            : compYears2
          : [];
    if (periodType === "Diário") {
      const dr =
        periodIdx === 1 ? compDateRange1 : compDateRange2;
      if (!dr.start || !dr.end) return "";
      const today = getTodayFormatted();
      const endLabel = dr.end === today ? "Hoje" : dr.end;
      return `${dr.start} — ${endLabel}`;
    }
    return compPeriodLabel(
      items,
      periodType === "Mensal" ? "month" : "year",
    );
  };

  // Smart summary for comparativo period tags — detects semesters, quarters, consecutive ranges
  const MONTH_NAMES_FULL = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const MONTH_NAMES_SHORT = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const compPeriodSmartSummary = (periodIdx: 1 | 2): string => {
    if (periodType === "Diário") {
      const dr =
        periodIdx === 1 ? compDateRange1 : compDateRange2;
      if (!dr.start || !dr.end) return "—";
      const today = getTodayFormatted();
      const endLabel = dr.end === today ? "Hoje" : dr.end;
      return `${dr.start} — ${endLabel}`;
    }
    if (periodType === "Semanal") {
      if (weeklyMode === "specific") {
        const days =
          periodIdx === 1
            ? compSpecificDays1
            : compSpecificDays2;
        if (!days || days.length === 0) return "—";
        return `${days.length} dia${days.length !== 1 ? "s" : ""}`;
      } else {
        const computed =
          periodIdx === 1
            ? compWeeklyComputedDays1
            : compWeeklyComputedDays2;
        if (!computed || computed.length === 0) return "—";
        return `${computed.length} dia${computed.length !== 1 ? "s" : ""}`;
      }
    }
    if (periodType === "Anual") {
      const years = periodIdx === 1 ? compYears1 : compYears2;
      if (years.length === 0) return "—";
      const sorted = [...years].sort();
      if (sorted.length <= 3) return sorted.join(", ");
      return `${sorted[0]} a ${sorted[sorted.length - 1]}`;
    }
    // Mensal — smart grouping
    const months = periodIdx === 1 ? compMonths1 : compMonths2;
    if (months.length === 0) return "—";

    const parsed = months
      .map((m) => {
        const parts = m.split(" ");
        const mIdx = MONTH_NAMES_FULL.indexOf(parts[0]);
        return {
          monthIdx: mIdx,
          year: parts[1],
          short: MONTH_NAMES_SHORT[mIdx] || parts[0],
        };
      })
      .sort((a, b) =>
        a.year === b.year
          ? a.monthIdx - b.monthIdx
          : a.year.localeCompare(b.year),
      );

    // Group by year
    const byYear: Record<string, typeof parsed> = {};
    parsed.forEach((p) => {
      if (!byYear[p.year]) byYear[p.year] = [];
      byYear[p.year].push(p);
    });

    const arrEq = (a: number[], b: number[]) =>
      a.length === b.length && a.every((v, i) => v === b[i]);
    const isConsec = (arr: number[]) =>
      arr.length > 0 &&
      arr.every((v, i) => i === 0 || v === arr[i - 1] + 1);

    const segments: string[] = [];
    for (const year of Object.keys(byYear).sort()) {
      const group = byYear[year];
      const sy = year.slice(-2);
      const idxs = group.map((g) => g.monthIdx);
      if (idxs.length === 12) {
        segments.push(year);
      } else if (arrEq(idxs, [0, 1, 2, 3, 4, 5])) {
        segments.push(`1º Sem/${sy}`);
      } else if (arrEq(idxs, [6, 7, 8, 9, 10, 11])) {
        segments.push(`2º Sem/${sy}`);
      } else if (arrEq(idxs, [0, 1, 2])) {
        segments.push(`1º Tri/${sy}`);
      } else if (arrEq(idxs, [3, 4, 5])) {
        segments.push(`2º Tri/${sy}`);
      } else if (arrEq(idxs, [6, 7, 8])) {
        segments.push(`3º Tri/${sy}`);
      } else if (arrEq(idxs, [9, 10, 11])) {
        segments.push(`4º Tri/${sy}`);
      } else if (isConsec(idxs) && idxs.length > 2) {
        segments.push(
          `${group[0].short} a ${group[group.length - 1].short}/${sy}`,
        );
      } else if (idxs.length <= 3) {
        segments.push(
          `${group.map((g) => g.short).join(", ")}/${sy}`,
        );
      } else {
        segments.push(`${idxs.length} meses/${sy}`);
      }
    }
    return segments.join(", ");
  };

  // Full detail list for comparativo period popover
  const compPeriodDetailItems = (
    periodIdx: 1 | 2,
  ): string[] => {
    if (periodType === "Diário") {
      const dr =
        periodIdx === 1 ? compDateRange1 : compDateRange2;
      if (!dr.start || !dr.end) return [];
      const today = getTodayFormatted();
      const endLabel = dr.end === today ? "Hoje" : dr.end;
      return [`${dr.start} — ${endLabel}`];
    }
    if (periodType === "Semanal") {
      if (weeklyMode === "specific") {
        const days =
          periodIdx === 1
            ? compSpecificDays1
            : compSpecificDays2;
        if (!days || days.length === 0) return [];
        return [...days].sort((a, b) => {
          const [da, ma, ya] = a.split("/");
          const [db, mb, yb] = b.split("/");
          return (
            new Date(+ya, +ma - 1, +da).getTime() -
            new Date(+yb, +mb - 1, +db).getTime()
          );
        });
      } else {
        const computed =
          periodIdx === 1
            ? compWeeklyComputedDays1
            : compWeeklyComputedDays2;
        return datesToBRStrings(computed || []);
      }
    }
    if (periodType === "Anual") {
      const years = periodIdx === 1 ? compYears1 : compYears2;
      return [...years].sort();
    }
    const months = periodIdx === 1 ? compMonths1 : compMonths2;
    return [...months].sort((a, b) => {
      const aIdx = MONTHS_OPTIONS.indexOf(a);
      const bIdx = MONTHS_OPTIONS.indexOf(b);
      return aIdx - bIdx;
    });
  };

  // Helper: format Date[] to DD/MM/YYYY strings sorted chronologically
  const datesToBRStrings = (dates: Date[]): string[] => {
    return [...dates]
      .sort((a, b) => a.getTime() - b.getTime())
      .map((d) => {
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        return `${dd}/${mm}/${d.getFullYear()}`;
      });
  };

  // ─── Periods list (shared by evolução, comparativo & hora a hora) ───
  const periods = React.useMemo(() => {
    // Hora a hora: 24h com seleção dinâmica no resultado.
    if (analysisMode === "horaahora") {
      return [...selectedIntradayHours].sort(
        (a, b) =>
          parseInt(a.replace("h", ""), 10) -
          parseInt(b.replace("h", ""), 10),
      );
    }
    if (analysisMode === "comparativo") {
      // Comparativo: exactly 2 period columns (aggregated sums)
      let has1 = false,
        has2 = false;
      if (periodType === "Mensal") {
        has1 = compMonths1.length > 0;
        has2 = compMonths2.length > 0;
      } else if (periodType === "Anual") {
        has1 = compYears1.length > 0;
        has2 = compYears2.length > 0;
      } else if (periodType === "Semanal") {
        if (weeklyMode === "specific") {
          has1 = compSpecificDays1?.length > 0;
          has2 = compSpecificDays2?.length > 0;
        } else {
          has1 = compWeeklyComputedDays1?.length > 0;
          has2 = compWeeklyComputedDays2?.length > 0;
        }
      } else {
        has1 = !!(compDateRange1.start && compDateRange1.end);
        has2 = !!(compDateRange2.start && compDateRange2.end);
      }
      const result: string[] = [];
      if (has1) result.push(COMPARATIVO_PERIOD_LABELS[1]);
      if (has2) result.push(COMPARATIVO_PERIOD_LABELS[2]);
      return result;
    }
    if (!isTimeDrilldownEnabled) return [];
    if (periodType === "Mensal") return selectedMonths;
    if (periodType === "Anual") return selectedYears;
    if (periodType === "Semanal") {
      // Semanal evolução: list individual matching days as periods
      if (weeklyMode === "specific") {
        // "Dias livres" — use selected specific days directly
        const sorted = [...(selectedSpecificDays || [])].sort(
          (a, b) => {
            const [da, ma, ya] = a.split("/");
            const [db, mb, yb] = b.split("/");
            return (
              new Date(+ya, +ma - 1, +da).getTime() -
              new Date(+yb, +mb - 1, +db).getTime()
            );
          },
        );
        return sorted.length > 0 ? sorted : ["01/03/2026"];
      } else {
        // "Período fechado" — use computed matching days
        const strs = datesToBRStrings(weeklyComputedDays || []);
        // Return empty if no weekdays selected (user must choose)
        return strs;
      }
    }
    // Diário: enumerate all days in range
    const parseBR = (s: string) => {
      const [dd, mm, yyyy] = s.split("/");
      return new Date(+yyyy, +mm - 1, +dd);
    };
    const start = parseBR(dateRange.start);
    const end = parseBR(dateRange.end);
    const days: string[] = [];
    let current = new Date(start);
    const maxDays = 366; // safety limit
    while (current <= end && days.length < maxDays) {
      const dd = String(current.getDate()).padStart(2, "0");
      const mm = String(current.getMonth() + 1).padStart(
        2,
        "0",
      );
      const yyyy = current.getFullYear();
      days.push(`${dd}/${mm}/${yyyy}`);
      current.setDate(current.getDate() + 1);
    }
    return days.length > 0 ? days : ["01/03/2026"];
  }, [
    analysisMode,
    selectedIntradayHours,
    isTimeDrilldownEnabled,
    periodType,
    selectedMonths,
    selectedYears,
    dateRange,
    compMonths1,
    compMonths2,
    compYears1,
    compYears2,
    compDateRange1,
    compDateRange2,
    weeklyMode,
    weeklyComputedDays,
    selectedSpecificDays,
    compWeeklyComputedDays1,
    compWeeklyComputedDays2,
    compSpecificDays1,
    compSpecificDays2,
  ]);

  const intradayHoursLabel = React.useMemo(() => {
    if (selectedIntradayHours.length === 0) return "—";
    const sorted = [...selectedIntradayHours].sort(
      (a, b) => parseInt(a.replace("h", ""), 10) - parseInt(b.replace("h", ""), 10),
    );
    if (sorted.length === HORA_A_HORA_HOURS.length) return "00h — 23h (24 faixas)";
    if (sorted.length === 1) return `${sorted[0]} (1 faixa)`;
    return `${sorted[0]} — ${sorted[sorted.length - 1]} (${sorted.length} faixas)`;
  }, [selectedIntradayHours]);

  const toggleIntradayHour = React.useCallback((hour: string) => {
    setSelectedIntradayHours((prev) => {
      if (prev.includes(hour)) {
        // Evita intraday sem nenhuma hora selecionada.
        if (prev.length <= 1) return prev;
        return prev.filter((h) => h !== hour);
      }
      return [...prev, hour];
    });
  }, []);

  // ─── Variation helpers ───
  const computeVariation = (
    firstVal: number,
    lastVal: number,
    format: string | undefined,
  ): number => {
    if (format === "percent" || format === "percent0") {
      return lastVal - firstVal; // absolute difference in the raw decimal form
    }
    if (firstVal === 0) {
      return lastVal > 0 ? 100 : lastVal < 0 ? -100 : 0;
    }
    return ((lastVal - firstVal) / Math.abs(firstVal)) * 100;
  };

  // Compute raw growth ratio: (P2/P1) - 1 — always a ratio (0.15 = +15%)
  const computeGrowth = (
    firstVal: number,
    lastVal: number,
  ): number => {
    if (firstVal === 0) {
      if (lastVal === 0) return 0;
      return lastVal > 0 ? Infinity : -Infinity;
    }
    return lastVal / firstVal - 1;
  };

  // Format absolute variation (P2 - P1) per metric type — colored (green/red) + arrows
  const formatVariation = (
    val: number,
    format: string | undefined,
  ): {
    text: string;
    color: string;
    arrow: "up" | "down" | "none";
  } => {
    if (isNaN(val) || !isFinite(val) || val === 0) {
      return {
        text: "—",
        color: "text-slate-500",
        arrow: "none",
      };
    }
    const sign = val > 0 ? "+" : "";
    const varColor =
      val > 0 ? "text-[#276749]" : "text-[#9B2C2C]";
    const varArrow: "up" | "down" = val > 0 ? "up" : "down";
    if (format === "percent" || format === "percent0") {
      const pp = val * 100;
      const frac = format === "percent0" ? 0 : 2;
      const formatted = new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: frac,
        maximumFractionDigits: frac,
      }).format(Math.abs(pp));
      return {
        text: `${pp < 0 ? "-" : sign}${formatted} pp`,
        color: varColor,
        arrow: varArrow,
      };
    }
    if (format === "currency") {
      const formatted = new Intl.NumberFormat("pt-BR", {
        maximumFractionDigits: 0,
      }).format(Math.abs(val));
      return {
        text: `${val < 0 ? "-" : sign}${formatted}`,
        color: varColor,
        arrow: varArrow,
      };
    }
    if (format === "days") {
      return {
        text: `${sign}${val} dias`,
        color: varColor,
        arrow: varArrow,
      };
    }
    // integer / default
    const formatted = new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: 0,
    }).format(Math.abs(val));
    return {
      text: `${val < 0 ? "-" : sign}${formatted}`,
      color: varColor,
      arrow: varArrow,
    };
  };

  // Format growth ((P2/P1)-1) — always percentage with 1 decimal, green/red + arrows
  const formatGrowth = (
    val: number,
  ): {
    text: string;
    color: string;
    arrow: "up" | "down" | "none";
  } => {
    if (isNaN(val) || !isFinite(val) || val === 0) {
      return {
        text: "—",
        color: "text-slate-400",
        arrow: "none",
      };
    }
    const pct = val * 100;
    const sign = pct > 0 ? "+" : "";
    const formatted = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(Math.abs(pct));
    return {
      text: `${pct < 0 ? "-" : sign}${formatted}%`,
      color: val > 0 ? "text-[#276749]" : "text-[#9B2C2C]",
      arrow: val > 0 ? "up" : "down",
    };
  };

  // ─── PIVOT MODE: add period-keyed metrics to tree nodes ───
  const addPivotMetrics = (
    nodes: any[],
    pds: string[],
    pivotStockSalts: Record<string, number>,
  ): any[] => {
    return nodes.map((node) => {
      const newNode = { ...node };
      if (node.children?.length > 0) {
        newNode.children = addPivotMetrics(
          node.children,
          pds,
          pivotStockSalts,
        );
        pds.forEach((period) => {
          selectedMetrics.forEach((mId: string) => {
            const key = `${period}__${mId}`;
            if (moduleConfig.id === "LOJA" && mId === "pct_projecao_venda") {
              const sumV = newNode.children.reduce(
                (a, c: any) =>
                  a + (Number(c[`${period}__vlr_projecao_venda`]) || 0),
                0,
              );
              const sumG = newNode.children.reduce(
                (a, c: any) => a + (Number(c.meta_mensal_loja) || 0),
                0,
              );
              newNode[key] = sumG > 0 ? sumV / sumG : null;
              return;
            }
            const childVals = newNode.children.map(
              (c: any) => Number(c[key]) || 0,
            );
            const config = METRIC_CONFIG[mId];
            if (isPercentRatioAggregatedAverage(config?.format)) {
              newNode[key] =
                childVals.reduce(
                  (a: number, b: number) => a + b,
                  0,
                ) / (childVals.length || 1);
            } else {
              newNode[key] = childVals.reduce(
                (a: number, b: number) => a + b,
                0,
              );
            }
          });
        });
        selectedMetrics.forEach((mId: string) => {
          const config = METRIC_CONFIG[mId];
          const allPeriodVals = pds.map(
            (p) => newNode[`${p}__${mId}`] || 0,
          );
          if (isPercentRatioAggregatedAverage(config?.format)) {
            newNode[`__total__${mId}`] =
              allPeriodVals.reduce(
                (a: number, b: number) => a + b,
                0,
              ) / (allPeriodVals.length || 1);
          } else {
            newNode[`__total__${mId}`] = allPeriodVals.reduce(
              (a: number, b: number) => a + b,
              0,
            );
          }
          if (
            moduleConfig.id === "LOJA" &&
            (mId === "vlr_projecao_venda" || mId === "pct_projecao_venda")
          ) {
            newNode[`__total__${mId}`] = newNode[mId];
          }
          // Variation & Growth: first period vs last period
          if (pds.length >= 2) {
            const firstVal = newNode[`${pds[0]}__${mId}`] || 0;
            const lastVal =
              newNode[`${pds[pds.length - 1]}__${mId}`] || 0;
            newNode[`__diff__${mId}`] = lastVal - firstVal;
            newNode[`__var__${mId}`] = computeVariation(
              firstVal,
              lastVal,
              config?.format,
            );
            newNode[`__growth__${mId}`] = computeGrowth(
              firstVal,
              lastVal,
            );
          } else {
            newNode[`__diff__${mId}`] = 0;
            newNode[`__var__${mId}`] = 0;
            newNode[`__growth__${mId}`] = 0;
          }
        });
      } else {
        pds.forEach((period, pIdx) => {
          const periodSeed = hashString(period, pIdx * 17);
          const combinedSeed = hashString(node.id, periodSeed);
          selectedMetrics.forEach((mId: string) => {
            if (
              moduleConfig.id === "LOJA" &&
              (mId === "vlr_projecao_venda" || mId === "pct_projecao_venda")
            ) {
              const baseV = newNode[mId];
              newNode[`${period}__${mId}`] =
                mId === "pct_projecao_venda"
                  ? baseV === null || baseV === undefined
                    ? null
                    : baseV
                  : Number(baseV) || 0;
              return;
            }
            const config = METRIC_CONFIG[mId];
            if (config) {
              const periodStockSalt =
                pivotStockSalts[period] ?? 0;
              // Use hourly pattern generator for hora a hora mode
              if (
                analysisMode === "horaahora" &&
                period.endsWith("h")
              ) {
                if (isStockRelatedMetric(mId)) {
                  const index =
                    Math.abs(
                      combinedSeed +
                        hashString(mId) +
                        periodStockSalt,
                    ) % config.data.length;
                  newNode[`${period}__${mId}`] =
                    config.data[index];
                } else {
                  newNode[`${period}__${mId}`] =
                    generateHourlyValue(
                      period,
                      node.label,
                      mId,
                      combinedSeed,
                      config,
                    );
                }
              } else {
                const saltExtra = isStockRelatedMetric(mId)
                  ? periodStockSalt
                  : 0;
                const index =
                  Math.abs(
                    combinedSeed + hashString(mId) + saltExtra,
                  ) % config.data.length;
                newNode[`${period}__${mId}`] =
                  config.data[index];
              }
            }
          });
        });
        selectedMetrics.forEach((mId: string) => {
          const config = METRIC_CONFIG[mId];
          const allPeriodVals = pds.map(
            (p) => newNode[`${p}__${mId}`] || 0,
          );
          if (isPercentRatioAggregatedAverage(config?.format)) {
            newNode[`__total__${mId}`] =
              allPeriodVals.reduce(
                (a: number, b: number) => a + b,
                0,
              ) / (allPeriodVals.length || 1);
          } else {
            newNode[`__total__${mId}`] = allPeriodVals.reduce(
              (a: number, b: number) => a + b,
              0,
            );
          }
          if (
            moduleConfig.id === "LOJA" &&
            (mId === "vlr_projecao_venda" || mId === "pct_projecao_venda")
          ) {
            newNode[`__total__${mId}`] = newNode[mId];
          }
          // Variation & Growth: first period vs last period
          if (pds.length >= 2) {
            const firstVal = newNode[`${pds[0]}__${mId}`] || 0;
            const lastVal =
              newNode[`${pds[pds.length - 1]}__${mId}`] || 0;
            newNode[`__diff__${mId}`] = lastVal - firstVal;
            newNode[`__var__${mId}`] = computeVariation(
              firstVal,
              lastVal,
              config?.format,
            );
            newNode[`__growth__${mId}`] = computeGrowth(
              firstVal,
              lastVal,
            );
          } else {
            newNode[`__diff__${mId}`] = 0;
            newNode[`__var__${mId}`] = 0;
            newNode[`__growth__${mId}`] = 0;
          }
        });
      }
      return newNode;
    });
  };

  /** Recalcula projeção Loja quando o dia civil muda (mês vigente). */
  const lojaMesVigenteKey = getTodayFormatted();

  // Data Generation
  const rawRows = React.useMemo(() => {
    if (groupingArr.length === 0) return [];
    // Inicializa orçamento; será sobrescrito por nó-raiz ao processar.
    _buildBudget.current = { remaining: MAX_SUBTREE_NODES };
    if (
      (isTimeDrilldownEnabled ||
        analysisMode === "comparativo" ||
        analysisMode === "horaahora") &&
      periods.length > 0
    ) {
      // PIVOT MODE (Evolução, Comparativo or Hora a Hora): rows = grouping hierarchy, columns = period × metric
      const pivotStockSalts: Record<string, number> = {};
      for (const p of periods) {
        pivotStockSalts[p] = computePivotPeriodStockIndexSalt(
          p,
          stockSaltContext,
        );
      }
      const baseTree = buildGroupTree(groupingArr, 0, "", 0, {}, undefined);
      return addPivotMetrics(baseTree, periods, pivotStockSalts);
    }
    // Standard mode
    return buildGroupTree(groupingArr, 0, "", 0, {}, undefined);
  }, [
    groupingArr,
    getFilteredGroupOptions,
    isTimeDrilldownEnabled,
    analysisMode,
    periods,
    selectedMetrics,
    moduleConfig,
    lojaMesVigenteKey,
    periodType,
    dateRange,
    selectedMonths,
    selectedYears,
    compDateRange1,
    compDateRange2,
    compMonths1,
    compMonths2,
    compYears1,
    compYears2,
    compSpecificDays1,
    compSpecificDays2,
    compWeeklyComputedDays1,
    compWeeklyComputedDays2,
    stockSaltContext,
    standardStockIndexSalt,
  ]);

  // Ordenação: mesmo critério em cada nível da árvore de agrupamento (drill)
  const sortedRows = React.useMemo(() => {
    if (!sortConfig) return rawRows;
    return sortAnalysisRowTree(rawRows, sortConfig);
  }, [rawRows, sortConfig]);

  // Flatten tree for rendering — aplica sort em cada `children` no momento
  // em que o nó é expandido (lazy, sem clone profundo).
  const flattenTree = (
    rows: any[],
    expandedSet: Set<string>,
    comparator: ((a: any, b: any) => number) | null,
  ): any[] => {
    const result: any[] = [];
    for (const row of rows) {
      result.push(row);
      if (row.children?.length > 0 && expandedSet.has(row.id)) {
        const children = comparator
          ? [...row.children].sort(comparator)
          : row.children;
        result.push(...flattenTree(children, expandedSet, comparator));
      }
    }
    return result;
  };

  const finalRows = React.useMemo(() => {
    const expandedSet = new Set(expandedRows);
    const comparator = sortConfig ? makeRowComparator(sortConfig) : null;
    return flattenTree(sortedRows, expandedSet, comparator);
  }, [sortedRows, expandedRows, sortConfig]);

  // Show share % only when there are 2+ data rows (single row is always 100% — redundant)
  const hasMultipleRows = rawRows.length >= 2;

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id],
    );
  };

  const handleSort = (sortKey: string) => {
    setSortConfig((current) => {
      if (current?.key === sortKey) {
        return {
          key: sortKey,
          direction:
            current.direction === "asc" ? "desc" : "asc",
        };
      }
      // Coluna de atributos: primeiro clique A–Z (asc); métricas: maior→menor (desc)
      const defaultDir =
        sortKey === ANALYSIS_ATTRIBUTE_SORT_KEY ? "asc" : "desc";
      return { key: sortKey, direction: defaultDir };
    });
  };

  const renderSortIndicator = (sortKey: string) => {
    if (sortConfig?.key === sortKey) {
      return sortConfig.direction === "asc" ? (
        <ArrowUp size={12} />
      ) : (
        <ArrowDown size={12} />
      );
    }

    return (
      <ArrowDown
        size={12}
        className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    );
  };

  // Totals (standard mode only — not evolução, not comparativo, not hora a hora)
  const totals = React.useMemo(() => {
    if (
      rawRows.length === 0 ||
      isTimeDrilldownEnabled ||
      analysisMode === "comparativo" ||
      analysisMode === "horaahora"
    )
      return null;
    const acc: any = {};
    METRICS_LIST.forEach((m) => {
      if (
        moduleConfig.id === "LOJA" &&
        m.id === "pct_projecao_venda"
      ) {
        const sumV = rawRows.reduce(
          (a, r: any) => a + (Number(r.vlr_projecao_venda) || 0),
          0,
        );
        const sumG = rawRows.reduce(
          (a, r: any) => a + (Number(r.meta_mensal_loja) || 0),
          0,
        );
        acc[m.id] = sumG > 0 ? sumV / sumG : null;
        return;
      }
      const vals = rawRows.map((r: any) => r[m.id]);
      const config = METRIC_CONFIG[m.id];
      if (isPercentRatioAggregatedAverage(config?.format)) {
        acc[m.id] =
          vals.reduce((a: number, b: number) => a + b, 0) /
          vals.length;
      } else {
        acc[m.id] = vals.reduce(
          (a: number, b: number) => a + b,
          0,
        );
      }
    });
    return acc;
  }, [rawRows, isTimeDrilldownEnabled, analysisMode, moduleConfig]);

  // Pivot totals (column-level totals row) — evolução, comparativo & hora a hora
  const pivotTotals = React.useMemo(() => {
    if (
      !(
        isTimeDrilldownEnabled ||
        analysisMode === "comparativo" ||
        analysisMode === "horaahora"
      ) ||
      rawRows.length === 0
    )
      return null;
    const acc: any = {};
    periods.forEach((period) => {
      selectedMetrics.forEach((mId: string) => {
        const key = `${period}__${mId}`;
        if (moduleConfig.id === "LOJA" && mId === "pct_projecao_venda") {
          const sumV = rawRows.reduce(
            (a, r: any) =>
              a + (Number(r[`${period}__vlr_projecao_venda`]) || 0),
            0,
          );
          const sumG = rawRows.reduce(
            (a, r: any) => a + (Number(r.meta_mensal_loja) || 0),
            0,
          );
          acc[key] = sumG > 0 ? sumV / sumG : null;
          return;
        }
        const vals = rawRows.map((r: any) => r[key] || 0);
        const config = METRIC_CONFIG[mId];
        if (isPercentRatioAggregatedAverage(config?.format)) {
          acc[key] =
            vals.reduce((a: number, b: number) => a + b, 0) /
            vals.length;
        } else {
          acc[key] = vals.reduce(
            (a: number, b: number) => a + b,
            0,
          );
        }
      });
    });
    selectedMetrics.forEach((mId: string) => {
      const key = `__total__${mId}`;
      const config = METRIC_CONFIG[mId];
      if (moduleConfig.id === "LOJA" && mId === "pct_projecao_venda") {
        const sumV = rawRows.reduce(
          (a, r: any) =>
            a +
            (Number(r[`__total__vlr_projecao_venda`]) ||
              Number(r.vlr_projecao_venda) ||
              0),
          0,
        );
        const sumG = rawRows.reduce(
          (a, r: any) => a + (Number(r.meta_mensal_loja) || 0),
          0,
        );
        acc[key] = sumG > 0 ? sumV / sumG : null;
      } else {
        const vals = rawRows.map((r: any) => r[key] || 0);
        if (isPercentRatioAggregatedAverage(config?.format)) {
          acc[key] =
            vals.reduce((a: number, b: number) => a + b, 0) /
            vals.length;
        } else {
          acc[key] = vals.reduce(
            (a: number, b: number) => a + b,
            0,
          );
        }
      }
      // Variation & Growth for totals row
      if (periods.length >= 2) {
        const firstKey = `${periods[0]}__${mId}`;
        const lastKey = `${periods[periods.length - 1]}__${mId}`;
        const fv = acc[firstKey] || 0;
        const lv = acc[lastKey] || 0;
        acc[`__diff__${mId}`] = lv - fv;
        acc[`__var__${mId}`] = computeVariation(
          fv,
          lv,
          config?.format,
        );
        acc[`__growth__${mId}`] = computeGrowth(fv, lv);
      } else {
        acc[`__diff__${mId}`] = 0;
        acc[`__var__${mId}`] = 0;
        acc[`__growth__${mId}`] = 0;
      }
    });
    return acc;
  }, [
    rawRows,
    isTimeDrilldownEnabled,
    analysisMode,
    periods,
    selectedMetrics,
    moduleConfig,
  ]);

  const groupingLabel =
    groupingArr.length > 0
      ? getAttributeLabel(groupingArr[0])
      : "AGRUPAMENTO";

  // ─── Chart context: drilldown-aware data + breadcrumb ───
  const chartContext = React.useMemo(() => {
    // Helper: find a node recursively by id
    const findNode = (rows: any[], id: string): any | null => {
      for (const row of rows) {
        if (row.id === id) return row;
        if (row.children?.length > 0) {
          const found = findNode(row.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    type BreadcrumbItem = {
      type: "attribute" | "value";
      text: string;
    };

    // No expanded rows → show top-level
    if (expandedRows.length === 0) {
      const items: BreadcrumbItem[] =
        groupingArr.length > 0
          ? [
              {
                type: "attribute",
                text: getAttributeLabel(groupingArr[0]),
              },
            ]
          : [];
      return { rows: sortedRows, breadcrumbItems: items };
    }

    // Find the deepest expanded row (the most recent drill-in)
    let bestRow: any = null;
    let bestDepth = -1;
    for (let i = expandedRows.length - 1; i >= 0; i--) {
      const node = findNode(sortedRows, expandedRows[i]);
      if (node && node.children?.length > 0) {
        const depth = node.depth ?? 0;
        if (depth > bestDepth) {
          bestRow = node;
          bestDepth = depth;
        }
        if (i === expandedRows.length - 1) {
          bestRow = node;
          bestDepth = depth;
          break;
        }
      }
    }

    if (!bestRow || !bestRow.children?.length) {
      const items: BreadcrumbItem[] =
        groupingArr.length > 0
          ? [
              {
                type: "attribute",
                text: getAttributeLabel(groupingArr[0]),
              },
            ]
          : [];
      return { rows: sortedRows, breadcrumbItems: items };
    }

    // Build interleaved breadcrumb: ATTR > value > ATTR > value > ATTR (children level)
    const pathParts = bestRow.id.split("|");
    const items: BreadcrumbItem[] = [];
    for (let i = 0; i < pathParts.length; i++) {
      if (i < groupingArr.length) {
        items.push({
          type: "attribute",
          text: getAttributeLabel(groupingArr[i]),
        });
      }
      items.push({ type: "value", text: pathParts[i] });
    }
    // Add the next level attribute (children's level)
    const childDepth = (bestRow.depth ?? 0) + 1;
    if (childDepth < groupingArr.length) {
      items.push({
        type: "attribute",
        text: getAttributeLabel(groupingArr[childDepth]),
      });
    }

    return { rows: bestRow.children, breadcrumbItems: items };
  }, [expandedRows, sortedRows, groupingArr]);

  // ─── Chart data: sorted by primary metric descending, paginated ───
  const chartSortedRows = React.useMemo(() => {
    const primaryMetric = chartMetricIds[0];
    if (!primaryMetric) return [];
    const rows = [...chartContext.rows];
    rows.sort((a: any, b: any) => {
      const aVal = a[primaryMetric] ?? 0;
      const bVal = b[primaryMetric] ?? 0;
      return bVal - aVal;
    });
    return rows;
  }, [chartContext.rows, chartMetricIds]);

  // Chart pagination
  const chartTotalPages = Math.max(
    1,
    Math.ceil(chartSortedRows.length / chartPageSize),
  );
  const chartSafeCurrentPage = Math.min(
    chartCurrentPage,
    chartTotalPages - 1,
  );
  const chartData = React.useMemo(() => {
    const start = chartSafeCurrentPage * chartPageSize;
    return chartSortedRows.slice(start, start + chartPageSize);
  }, [chartSortedRows, chartSafeCurrentPage, chartPageSize]);

  // ─── Comparative chart data: P1 vs P2 bars + variation line ───
  const comparativeChartData = React.useMemo(() => {
    if (analysisMode !== "comparativo" || periods.length < 2)
      return [];
    const metricId = chartMetricIds[0];
    if (!metricId) return [];
    // Sort rows by P2 value (most recent period) descending/ascending
    const rows = [...chartContext.rows];
    rows.sort((a: any, b: any) => {
      const aVal = a[`${periods[1]}__${metricId}`] ?? 0;
      const bVal = b[`${periods[1]}__${metricId}`] ?? 0;
      return bVal - aVal;
    });
    const start = chartSafeCurrentPage * chartPageSize;
    const pageRows = rows.slice(start, start + chartPageSize);
    return pageRows.map((row: any) => {
      const v1 = row[`${periods[0]}__${metricId}`] ?? 0;
      const v2 = row[`${periods[1]}__${metricId}`] ?? 0;
      return {
        label: row.label,
        // Unique dataKeys per series type so recharts never shares the same dataKey
        // between a Bar and a Line (which would generate duplicate SVG group keys internally)
        bar_p1: v1,
        bar_p2: v2,
        line_p1: v1,
        line_p2: v2,
        variation: row[`__growth__${metricId}`] ?? 0,
      };
    });
  }, [
    analysisMode,
    periods,
    chartMetricIds,
    chartContext.rows,
    chartSafeCurrentPage,
    chartPageSize,
  ]);

  // Comparative period labels (cheap — no memo needed)
  const compP1Label =
    periods.length >= 1
      ? compPeriodSubtitle(1) || getComparativoPeriodLabel(1)
      : getComparativoPeriodLabel(1);
  const compP2Label =
    periods.length >= 2
      ? compPeriodSubtitle(2) || getComparativoPeriodLabel(2)
      : getComparativoPeriodLabel(2);

  // Reset chart page when source data changes
  React.useEffect(() => {
    setChartCurrentPage(0);
  }, [chartSortedRows]);

  // Reset temporal chart state when pivot turns off
  const isPivotActive =
    (isTimeDrilldownEnabled ||
      analysisMode === "comparativo" ||
      analysisMode === "horaahora") &&
    periods.length > 0;
  React.useEffect(() => {
    if (!isPivotActive) {
      setTemporalCurrentPage(0);
      setTemporalHiddenItems(new Set());
      setPeriodCurrentPage(0);
    }
  }, [isPivotActive]);

  // Reset period page when periods list changes
  React.useEffect(() => {
    setPeriodCurrentPage(0);
  }, [periods.length]);

  // Reset hidden items when temporal page or limit changes
  React.useEffect(() => {
    setTemporalHiddenItems(new Set());
  }, [temporalCurrentPage, temporalLimit]);

  // ─── Temporal chart data: X = periods, lines = paginated items ───
  const temporalMetricId = chartMetricIds[0] ?? "";

  // All rows sorted by the temporal metric total (descending)
  const temporalSortedRows = React.useMemo(() => {
    if (!isPivotActive || periods.length === 0 || !temporalMetricId) return [];
    const rows = [...chartContext.rows];
    rows.sort((a: any, b: any) => {
      const aVal = a[`__total__${temporalMetricId}`] ?? 0;
      const bVal = b[`__total__${temporalMetricId}`] ?? 0;
      return bVal - aVal;
    });
    return rows;
  }, [
    isPivotActive,
    periods,
    chartContext.rows,
    temporalMetricId,
  ]);

  // Temporal pagination (items/lines)
  const temporalTotalPages = Math.max(
    1,
    Math.ceil(temporalSortedRows.length / temporalLimit),
  );
  const temporalSafeCurrentPage = Math.min(
    temporalCurrentPage,
    temporalTotalPages - 1,
  );

  // Period pagination (X-axis periods)
  const periodTotalPages = Math.max(
    1,
    Math.ceil(periods.length / periodPageSize),
  );
  const periodSafeCurrentPage = Math.min(
    periodCurrentPage,
    periodTotalPages - 1,
  );
  const paginatedPeriods = React.useMemo(() => {
    const start = periodSafeCurrentPage * periodPageSize;
    return periods.slice(start, start + periodPageSize);
  }, [periods, periodSafeCurrentPage, periodPageSize]);

  const temporalChartInfo = React.useMemo(() => {
    if (
      !isPivotActive ||
      paginatedPeriods.length === 0 ||
      temporalSortedRows.length === 0
    )
      return { data: [], items: [] };

    // Paginate: slice the sorted rows for the current page
    const start = temporalSafeCurrentPage * temporalLimit;
    const pageItems = temporalSortedRows.slice(
      start,
      start + temporalLimit,
    );

    // Build data: each point = { period, item_0: value, item_1: value, ... }
    const data = paginatedPeriods.map((period: string) => {
      const point: any = { period: shortPeriodLabel(period) };
      pageItems.forEach((item: any, idx: number) => {
        point[`item_${idx}`] =
          item[`${period}__${temporalMetricId}`] ?? 0;
      });
      return point;
    });

    // Items info for legend + line keys
    const items = pageItems.map((item: any, idx: number) => ({
      key: `item_${idx}_${item.label || "unknown"}`.replace(
        /\s+/g,
        "_",
      ),
      dataKey: `item_${idx}`,
      label: item.label || "—",
      color: TEMPORAL_COLORS[idx % TEMPORAL_COLORS.length],
    }));

    return { data, items };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isPivotActive,
    paginatedPeriods,
    temporalSortedRows,
    temporalMetricId,
    temporalSafeCurrentPage,
    temporalLimit,
  ]);

  // ─── Y-axis formatter for chart based on primary metric type ───
  const chartYAxisFormatter = React.useCallback(
    (value: number) => {
      const primaryMetric = chartMetricIds[0];
      if (!primaryMetric) return String(value);
      const config = METRIC_CONFIG[primaryMetric];
      if (!config) return String(value);
      switch (config.format) {
        case "currency": {
          if (Math.abs(value) >= 1_000_000)
            return `${(value / 1_000_000).toFixed(1)}M`;
          if (Math.abs(value) >= 1_000)
            return `${(value / 1_000).toFixed(0)}K`;
          return new Intl.NumberFormat("pt-BR", {
            maximumFractionDigits: 0,
          }).format(value);
        }
        case "percent0":
          return new Intl.NumberFormat("pt-BR", {
            style: "percent",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value);
        case "percent":
        case "percent1":
          return new Intl.NumberFormat("pt-BR", {
            style: "percent",
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }).format(value);
        case "days":
          return `${value}d`;
        case "integer":
        default: {
          if (Math.abs(value) >= 1_000_000)
            return `${(value / 1_000_000).toFixed(1)}M`;
          if (Math.abs(value) >= 1_000)
            return `${(value / 1_000).toFixed(0)}K`;
          return new Intl.NumberFormat("pt-BR", {
            maximumFractionDigits: 0,
          }).format(value);
        }
      }
    },
    [chartMetricIds],
  );

  // ─── Tooltip formatter for chart (per-metric) ───
  const chartTooltipFormatterMulti = React.useCallback(
    (value: number, name: string) => {
      const config = METRIC_CONFIG[name];
      const m = METRICS_LIST.find((x) => x.id === name);
      const label = m?.label || name;
      if (!config) return [String(value), label];
      return [formatMetricValue(value, config.format), label];
    },
    [],
  );

  // ─── Tooltip formatter for temporal chart ───
  const temporalTooltipFormatter = React.useCallback(
    (value: number, name: string) => {
      const config = METRIC_CONFIG[temporalMetricId];
      // name is passed from the Line/Bar component, which we set as item.label
      // But recharts uses the dataKey as name, so we need to find by dataKey
      const itemInfo = temporalChartInfo.items.find(
        (i) => i.dataKey === name,
      );
      const label = itemInfo?.label || name;
      if (!config) return [String(value), label];
      return [formatMetricValue(value, config.format), label];
    },
    [temporalMetricId, temporalChartInfo.items],
  );

  // ���── Y-axis formatter for temporal chart ───
  const temporalYAxisFormatter = React.useCallback(
    (value: number) => {
      const config = METRIC_CONFIG[temporalMetricId];
      if (!config) return String(value);
      switch (config.format) {
        case "currency": {
          if (Math.abs(value) >= 1_000_000)
            return `${(value / 1_000_000).toFixed(1)}M`;
          if (Math.abs(value) >= 1_000)
            return `${(value / 1_000).toFixed(0)}K`;
          return new Intl.NumberFormat("pt-BR", {
            maximumFractionDigits: 0,
          }).format(value);
        }
        case "percent0":
          return new Intl.NumberFormat("pt-BR", {
            style: "percent",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value);
        case "percent":
        case "percent1":
          return new Intl.NumberFormat("pt-BR", {
            style: "percent",
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }).format(value);
        case "days":
          return `${value}d`;
        case "integer":
        default: {
          if (Math.abs(value) >= 1_000_000)
            return `${(value / 1_000_000).toFixed(1)}M`;
          if (Math.abs(value) >= 1_000)
            return `${(value / 1_000).toFixed(0)}K`;
          return new Intl.NumberFormat("pt-BR", {
            maximumFractionDigits: 0,
          }).format(value);
        }
      }
    },
    [temporalMetricId],
  );

  // ─── Whether we need a secondary Y axis (different format types selected) ───
  const chartNeedsSecondaryAxis = React.useMemo(() => {
    if (chartMetricIds.length <= 1) return false;
    const primaryFormat =
      METRIC_CONFIG[chartMetricIds[0]]?.format;
    return chartMetricIds.some(
      (id) => METRIC_CONFIG[id]?.format !== primaryFormat,
    );
  }, [chartMetricIds]);

  const includeSummaryFilters = React.useMemo(
    () =>
      Object.entries(selections || {})
        .filter(([, vals]) => vals && vals.length > 0)
        .map(([k, v]) => ({ key: k, vals: v as string[], type: "include" as const }))
        .sort((a, b) =>
          getAttributeLabel(a.key).localeCompare(getAttributeLabel(b.key), "pt-BR"),
        ),
    [selections, moduleConfig],
  );

  const excludeSummaryFilters = React.useMemo(
    () =>
      Object.entries(exclusions || {})
        .filter(([, vals]) => vals && vals.length > 0)
        .map(([k, v]) => ({ key: k, vals: v as string[], type: "exclude" as const }))
        .sort((a, b) =>
          getAttributeLabel(a.key).localeCompare(getAttributeLabel(b.key), "pt-BR"),
        ),
    [exclusions, moduleConfig],
  );

  // Pivot mode flag & config
  const isPivot =
    (isTimeDrilldownEnabled ||
      analysisMode === "comparativo" ||
      analysisMode === "horaahora") &&
    periods.length > 0;
  // NEW: metric-first pivot — sub-columns per metric depend on mode
  const hasVariation =
    analysisMode === "comparativo" && periods.length >= 2;

  /** Evolutiva: cabeçalho período → métricas (métricas lado a lado em cada período). */
  const isPeriodFirstPivot =
    analysisMode === "evolucao" && isPivot;

  const getSubColsForMetricLeaf = (mId: string): number => {
    let c = 1;
    if (showAverage) c += 1;
    if (showSharePct && !PCT_EXCLUDED_METRICS.has(mId)) c += 1;
    return c;
  };

  const getSubColsForPeriodBlock = (): number =>
    orderedMetrics.reduce(
      (sum, mId) => sum + getSubColsForMetricLeaf(mId),
      0,
    );

  // Helper function: calcula quantas sub-colunas uma métrica específica terá
  const getSubColsForMetric = (metricId: string): number => {
    const canShowPct =
      showSharePct && !PCT_EXCLUDED_METRICS.has(metricId);

    if (analysisMode === "comparativo") {
      // Comparativo: P1, [x̄ P1], [%], P2, [x̄ P2], [%], [Var Vlr, Var %]
      let cols = periods.length;
      if (showAverage) cols += periods.length; // x̄ for each period
      if (canShowPct) cols += periods.length; // % for each period
      if (hasVariation) cols += 2; // Var Vlr, Var %
      return cols;
    } else {
      // Evolutivo/Intraday: P1, [x̄], [%], P2, [x̄], [%], ..., Total, [x̄], [%]
      let cols = periods.length + 1; // periods + Total
      if (showAverage) cols += periods.length + 1; // x̄ for each period + Total
      if (canShowPct) cols += periods.length + 1; // % for each period + Total
      return cols;
    }
  };

  // Largura otimizada para colunas de métricas nas pivot tables (baseada no formato)
  const getOptimalPivotMetricWidth = (mId: string): number => {
    const config = METRIC_CONFIG[mId];
    const format = config?.format || "string";

    // Larguras otimizadas por tipo de dado (compactas para pivot tables)
    switch (format) {
      case "currency":
        return 100; // Valores monetários (ex: 5.211, 12.345)
      case "percent":
      case "percent0":
      case "percent1":
        return 75; // Percentuais (ex: 15,7%, 100%)
      case "integer":
        return 85; // Inteiros (ex: 820, 1.234)
      case "decimal":
      case "decimal1":
        return 90; // Decimais (ex: 12,5, 123,45)
      case "variation":
        return 85; // Variações (ex: +5,2%, -3,4%)
      default:
        return 95; // Default
    }
  };

  // Pivot width helper — usa largura customizada OU largura otimizada
  const getPivotMetricWidth = (mId: string) =>
    columnWidths[mId] || getOptimalPivotMetricWidth(mId);

  // Evolutionary "Total" column gets extra width since it aggregates larger values
  const getPivotTotalWidth = (mId: string) => {
    const baseWidth = getPivotMetricWidth(mId);
    return baseWidth + 30;
  };

  /** Células da linha de dados (evolutiva) com ordem período → métrica. */
  const renderEvoPeriodFirstPivotDataCells = (
    row: any,
    depth: number,
    rowBg: string,
  ): React.ReactNode => (
    <>
      {periods.flatMap((period, pIdx) =>
        orderedMetrics.flatMap((mId: string, mIdx: number) => {
          const config = METRIC_CONFIG[mId];
          const key = `${period}__${mId}`;
          const colTotal = pivotTotals ? pivotTotals[key] : null;
          const canShowPct =
            showSharePct && !PCT_EXCLUDED_METRICS.has(mId);
          const isLastInPeriod = mIdx === orderedMetrics.length - 1;
          const isLastPeriod = pIdx === periods.length - 1;
          const out: React.ReactNode[] = [];
          out.push(
            <td
              key={key}
              className={cn(
                "whitespace-nowrap px-2 py-2.5 pr-3 text-right text-[14px] transition-colors",
                depth === 0
                  ? "font-medium text-slate-700"
                  : "font-normal text-slate-600",
              )}
              style={{
                backgroundColor: rowBg,
                width: getPivotMetricWidth(mId),
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: "#e2e8f0",
                ...(!canShowPct &&
                !showAverage &&
                !isLastInPeriod
                  ? {
                      borderRightWidth: 1,
                      borderRightStyle: "dotted",
                      borderRightColor: "#cbd5e1",
                    }
                  : {}),
                ...(!canShowPct &&
                !showAverage &&
                isLastInPeriod &&
                !isLastPeriod
                  ? {
                      borderRightWidth: 2,
                      borderRightStyle: "dotted",
                      borderRightColor: "#94a3b8",
                    }
                  : {}),
                ...(!canShowPct &&
                !showAverage &&
                isLastInPeriod &&
                isLastPeriod
                  ? {
                      borderRightWidth: 2,
                      borderRightStyle: "dotted",
                      borderRightColor: "#94a3b8",
                    }
                  : {}),
              }}
            >
              {renderMetricValue(row[key] || 0, mId)}
            </td>,
          );
          if (showAverage) {
            const avgValue = calculateAverage(row[key] || 0, period);
            let avgFormatted = "";
            if (config) {
              switch (config.format) {
                case "currency":
                  avgFormatted = new Intl.NumberFormat("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(avgValue);
                  break;
                case "percent":
                case "percent0":
                case "percent1": {
                  const frac =
                    config.format === "percent0" ? 0 : 2;
                  avgFormatted = new Intl.NumberFormat("pt-BR", {
                    style: "percent",
                    minimumFractionDigits: frac,
                    maximumFractionDigits: frac,
                  }).format(avgValue);
                  break;
                }
                case "integer":
                  avgFormatted = new Intl.NumberFormat("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(avgValue);
                  break;
                case "decimal":
                case "decimal1":
                  avgFormatted = new Intl.NumberFormat("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(avgValue);
                  break;
                case "days":
                  avgFormatted = `${avgValue.toFixed(2)} dias`;
                  break;
                default:
                  avgFormatted = avgValue.toFixed(2);
              }
            } else {
              avgFormatted = avgValue.toFixed(2);
            }
            out.push(
              <td
                key={`${key}__avg`}
                className={cn(
                  "whitespace-nowrap px-2 py-2.5 pr-3 text-right text-[13px] transition-colors",
                  depth === 0
                    ? "font-medium text-slate-600"
                    : "font-normal text-slate-500",
                )}
                style={{
                  backgroundColor: rowBg,
                  width: AVG_COL_WIDTH,
                  borderBottomWidth: 1,
                  borderBottomStyle: "solid",
                  borderBottomColor: "#e2e8f0",
                  ...(!canShowPct && !isLastInPeriod
                    ? {
                        borderRightWidth: 1,
                        borderRightStyle: "dotted",
                        borderRightColor: "#cbd5e1",
                      }
                    : {}),
                  ...(canShowPct
                    ? {}
                    : isLastInPeriod && !isLastPeriod
                      ? {
                          borderRightWidth: 2,
                          borderRightStyle: "dotted",
                          borderRightColor: "#94a3b8",
                        }
                      : {}),
                  ...(canShowPct
                    ? {}
                    : isLastInPeriod && isLastPeriod
                      ? {
                          borderRightWidth: 2,
                          borderRightStyle: "dotted",
                          borderRightColor: "#94a3b8",
                        }
                      : {}),
                }}
              >
                {avgFormatted}
              </td>,
            );
          }
          if (canShowPct) {
            out.push(
              <td
                key={`${key}__pct`}
                className="px-2 py-2.5 text-center text-[12px] text-slate-500 transition-colors"
                style={{
                  backgroundColor: rowBg,
                  width: PCT_COL_WIDTH,
                  borderBottomWidth: 1,
                  borderBottomStyle: "solid",
                  borderBottomColor: "#e2e8f0",
                  ...(isLastInPeriod && !isLastPeriod
                    ? {
                        borderRightWidth: 2,
                        borderRightStyle: "dotted",
                        borderRightColor: "#94a3b8",
                      }
                    : {}),
                  ...(isLastInPeriod && isLastPeriod
                    ? {
                        borderRightWidth: 2,
                        borderRightStyle: "dotted",
                        borderRightColor: "#94a3b8",
                      }
                    : {}),
                }}
              >
                {renderPctValue(row[key] || 0, colTotal)}
              </td>,
            );
          }
          return out;
        }),
      )}
      {orderedMetrics.flatMap((mId: string, mIdx: number) => {
        const totalKey = `__total__${mId}`;
        const config = METRIC_CONFIG[mId];
        const grandTotal = pivotTotals ? pivotTotals[totalKey] : null;
        const canShowPct =
          showSharePct && !PCT_EXCLUDED_METRICS.has(mId);
        const isLastMetric = mIdx === orderedMetrics.length - 1;
        const out: React.ReactNode[] = [];
        out.push(
          <td
            key={totalKey}
            className={cn(
              "px-2 pr-3 py-2.5 text-right text-[14px] transition-colors whitespace-nowrap",
              depth === 0
                ? "text-slate-700 font-medium"
                : "text-slate-600 font-normal",
            )}
            style={{
              backgroundColor: totalColumnBg,
              width: getPivotTotalWidth(mId),
              borderBottomWidth: 1,
              borderBottomStyle: "solid",
              borderBottomColor: "#e2e8f0",
              ...(!canShowPct && !showAverage && !isLastMetric
                ? {
                    borderRightWidth: 2,
                    borderRightStyle: "dotted",
                    borderRightColor: "#94a3b8",
                  }
                : !canShowPct && !showAverage && isLastMetric
                  ? {
                      borderRightWidth: 2,
                      borderRightStyle: "solid",
                      borderRightColor: "#e2e8f0",
                    }
                  : {}),
            }}
          >
            {renderMetricValue(row[totalKey] || 0, mId)}
          </td>,
        );
        if (showAverage) {
          const avgValue = calculateAverage(row[totalKey] || 0);
          let avgFormatted = "";
          if (config) {
            switch (config.format) {
              case "currency":
                avgFormatted = new Intl.NumberFormat("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(avgValue);
                break;
              case "percent":
              case "percent0":
              case "percent1": {
                const frac = config.format === "percent0" ? 0 : 2;
                avgFormatted = new Intl.NumberFormat("pt-BR", {
                  style: "percent",
                  minimumFractionDigits: frac,
                  maximumFractionDigits: frac,
                }).format(avgValue);
                break;
              }
              case "integer":
                avgFormatted = new Intl.NumberFormat("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(avgValue);
                break;
              case "decimal":
              case "decimal1":
                avgFormatted = new Intl.NumberFormat("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(avgValue);
                break;
              case "days":
                avgFormatted = `${avgValue.toFixed(2)} dias`;
                break;
              default:
                avgFormatted = avgValue.toFixed(2);
            }
          } else {
            avgFormatted = avgValue.toFixed(2);
          }
          out.push(
            <td
              key={`${totalKey}__avg`}
              className={cn(
                "px-2 pr-3 py-2.5 text-right text-[13px] transition-colors whitespace-nowrap",
                depth === 0
                  ? "text-slate-600 font-medium"
                  : "text-slate-500 font-normal",
              )}
              style={{
                backgroundColor: totalColumnBg,
                width: AVG_COL_WIDTH,
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: "#e2e8f0",
                ...(!canShowPct && !isLastMetric
                  ? {
                      borderRightWidth: 2,
                      borderRightStyle: "dotted",
                      borderRightColor: "#94a3b8",
                    }
                  : !canShowPct && isLastMetric
                    ? {
                        borderRightWidth: 2,
                        borderRightStyle: "solid",
                        borderRightColor: "#e2e8f0",
                      }
                    : {}),
              }}
            >
              {avgFormatted}
            </td>,
          );
        }
        if (canShowPct) {
          out.push(
            <td
              key={`${totalKey}__pct`}
              className="px-2 py-2.5 text-center text-[12px] text-slate-500 transition-colors"
              style={{
                backgroundColor: totalColumnBg,
                width: PCT_COL_WIDTH,
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: "#e2e8f0",
                ...(!isLastMetric
                  ? {
                      borderRightWidth: 2,
                      borderRightStyle: "dotted",
                      borderRightColor: "#94a3b8",
                    }
                  : {
                      borderRightWidth: 2,
                      borderRightStyle: "solid",
                      borderRightColor: "#e2e8f0",
                    }),
              }}
            >
              {renderPctValue(row[totalKey] || 0, grandTotal)}
            </td>,
          );
        }
        return out;
      })}
    </>
  );

  // Exportação da tabela geral para Excel (.xlsx)
  const handleExportTableExcel = React.useCallback(() => {
    if (finalRows.length === 0) return;
    const rows: string[][] = [];

    if (isPivot) {
      const isComp = analysisMode === "comparativo";
      const showVar = isComp && periods.length >= 2;

      if (isPeriodFirstPivot && !isComp) {
        const h1 = [groupingLabel];
        periods.forEach((period) => {
          orderedMetrics.forEach((_, mi) => {
            h1.push(
              mi === 0 ? shortPeriodLabel(period) : "",
            );
          });
        });
        orderedMetrics.forEach((_, mi) => {
          h1.push(mi === 0 ? "Total" : "");
        });
        rows.push(h1);

        const h2 = [""];
        periods.forEach(() => {
          orderedMetrics.forEach((mId: string) => {
            const m = METRICS_LIST.find((x) => x.id === mId);
            h2.push(m?.label || mId);
          });
        });
        orderedMetrics.forEach((mId: string) => {
          const m = METRICS_LIST.find((x) => x.id === mId);
          h2.push(`Total — ${m?.label || mId}`);
        });
        rows.push(h2);

        if (pivotTotals) {
          const tr = ["Total"];
          periods.forEach((p) => {
            orderedMetrics.forEach((mId: string) => {
              const config = METRIC_CONFIG[mId];
              tr.push(
                formatMetricValue(
                  pivotTotals[`${p}__${mId}`] || 0,
                  config?.format || "string",
                ),
              );
            });
          });
          orderedMetrics.forEach((mId: string) => {
            const config = METRIC_CONFIG[mId];
            tr.push(
              formatMetricValue(
                pivotTotals[`__total__${mId}`] || 0,
                config?.format || "string",
              ),
            );
          });
          rows.push(tr);
        }

        finalRows.forEach((row: any) => {
          const indent = "  ".repeat(row.depth || 0);
          const dr = [`${indent}${row.label}`];
          periods.forEach((p) => {
            orderedMetrics.forEach((mId: string) => {
              const config = METRIC_CONFIG[mId];
              dr.push(
                formatMetricValue(
                  row[`${p}__${mId}`] || 0,
                  config?.format || "string",
                ),
              );
            });
          });
          orderedMetrics.forEach((mId: string) => {
            const config = METRIC_CONFIG[mId];
            dr.push(
              formatMetricValue(
                row[`__total__${mId}`] || 0,
                config?.format || "string",
              ),
            );
          });
          rows.push(dr);
        });
      } else {
      // Header row 1: metric groups (metric-first pivot)
      const h1 = [groupingLabel];
      orderedMetrics.forEach((mId: string, i: number) => {
        const m = METRICS_LIST.find((x) => x.id === mId);
        const label = m?.label || mId;
        // Add sub-column placeholders
        if (isComp) {
          periods.forEach((_, pIdx) =>
            h1.push(pIdx === 0 ? label : ""),
          );
          if (showVar) {
            h1.push("");
            h1.push("");
          }
        } else {
          periods.forEach((_, pIdx) =>
            h1.push(pIdx === 0 ? label : ""),
          );
          h1.push(""); // Total
        }
      });
      rows.push(h1);

      // Header row 2: period/derived sub-headers under each metric
      const h2 = [""];
      orderedMetrics.forEach((mId: string) => {
        if (isComp) {
          periods.forEach((p, pIdx) =>
            h2.push(`Período ${pIdx + 1}`),
          );
          if (showVar) {
            h2.push("Variação Vlr");
            h2.push("Variação %");
          }
        } else {
          periods.forEach((p) => h2.push(shortPeriodLabel(p)));
          h2.push("Total");
        }
      });
      rows.push(h2);

      // Totals row
      if (pivotTotals) {
        const tr = ["Total"];
        orderedMetrics.forEach((mId: string) => {
          const config = METRIC_CONFIG[mId];
          if (isComp) {
            periods.forEach((p) =>
              tr.push(
                formatMetricValue(
                  pivotTotals[`${p}__${mId}`] || 0,
                  config?.format || "string",
                ),
              ),
            );
            if (showVar) {
              tr.push(
                formatVariation(
                  pivotTotals[`__diff__${mId}`] || 0,
                  config?.format,
                ).text,
              );
              tr.push(
                formatGrowth(
                  pivotTotals[`__growth__${mId}`] || 0,
                ).text,
              );
            }
          } else {
            periods.forEach((p) =>
              tr.push(
                formatMetricValue(
                  pivotTotals[`${p}__${mId}`] || 0,
                  config?.format || "string",
                ),
              ),
            );
            tr.push(
              formatMetricValue(
                pivotTotals[`__total__${mId}`] || 0,
                config?.format || "string",
              ),
            );
          }
        });
        rows.push(tr);
      }

      // Data rows
      finalRows.forEach((row: any) => {
        const indent = "  ".repeat(row.depth || 0);
        const dr = [`${indent}${row.label}`];
        orderedMetrics.forEach((mId: string) => {
          const config = METRIC_CONFIG[mId];
          if (isComp) {
            periods.forEach((p) =>
              dr.push(
                formatMetricValue(
                  row[`${p}__${mId}`] || 0,
                  config?.format || "string",
                ),
              ),
            );
            if (showVar) {
              dr.push(
                formatVariation(
                  row[`__diff__${mId}`] || 0,
                  config?.format,
                ).text,
              );
              dr.push(
                formatGrowth(row[`__growth__${mId}`] || 0).text,
              );
            }
          } else {
            periods.forEach((p) =>
              dr.push(
                formatMetricValue(
                  row[`${p}__${mId}`] || 0,
                  config?.format || "string",
                ),
              ),
            );
            dr.push(
              formatMetricValue(
                row[`__total__${mId}`] || 0,
                config?.format || "string",
              ),
            );
          }
        });
        rows.push(dr);
      });
      }
    } else {
      // Standard mode
      const header = [
        groupingLabel,
        ...orderedMetrics.map((mId: string) => {
          const m = METRICS_LIST.find((x) => x.id === mId);
          return m?.label || mId;
        }),
      ];
      rows.push(header);

      if (totals) {
        const tr = [
          "Total",
          ...orderedMetrics.map((mId: string) => {
            const config = METRIC_CONFIG[mId];
            return formatMetricValue(
              totals[mId],
              config?.format || "string",
            );
          }),
        ];
        rows.push(tr);
      }

      finalRows.forEach((row: any) => {
        const indent = "  ".repeat(row.depth || 0);
        const dr = [
          `${indent}${row.label}`,
          ...orderedMetrics.map((mId: string) => {
            const config = METRIC_CONFIG[mId];
            return formatMetricValue(
              row[mId],
              config?.format || "string",
            );
          }),
        ];
        rows.push(dr);
      });
    }

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tabela geral");
    const fileName = `tabela_geral_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }, [
    finalRows,
    isPivot,
    isPeriodFirstPivot,
    periods,
    selectedMetrics,
    pivotTotals,
    totals,
    orderedMetrics,
    groupingLabel,
    analysisMode,
  ]);

  // Export chart as PNG
  const handleExportChartPNG = React.useCallback(async () => {
    if (!chartContainerRef.current) return;
    try {
      const modeSuffix =
        analysisMode === "evolucao" && isPivot
          ? "evolutivo"
          : analysisMode === "comparativo"
            ? "comparativo"
            : analysisMode === "horaahora"
              ? "hora-a-hora"
              : "grafico";
      const dataUrl = await htmlToImage.toPng(
        chartContainerRef.current,
        { backgroundColor: "#ffffff", pixelRatio: 2 },
      );
      const link = document.createElement("a");
      link.download = `grafico_${modeSuffix}_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Export PNG failed", e);
    }
  }, [analysisMode, isPivot]);

  const periodDisplayText = React.useMemo(
    () =>
      computePeriodDisplayText({
    analysisMode,
    periodType,
    dateRange,
        weeklyMode,
        weeklyComputedDays,
        selectedSpecificDays,
    selectedMonths,
        selectedYears,
      }),
    [
      analysisMode,
      periodType,
      dateRange,
    weeklyMode,
    weeklyComputedDays,
    selectedSpecificDays,
      selectedMonths,
      selectedYears,
    ],
  );

  const hasCurrentTimeInfo = React.useMemo(() => {
    const today = getTodayFormatted();

    if (analysisMode === "comparativo") {
      if (periodType === "Diário") {
        return (
          compDateRange1.end === today ||
          compDateRange2.end === today
        );
      }
      if (periodType === "Semanal") {
        if (weeklyMode === "specific") {
          return (
            compSpecificDays1.includes(today) ||
            compSpecificDays2.includes(today)
          );
        }
        return (
          compWeeklyComputedDays1.some(
            (day) => day && formatDate(day) === today,
          ) ||
          compWeeklyComputedDays2.some(
            (day) => day && formatDate(day) === today,
          )
        );
      }
      if (periodType === "Mensal") {
        const currentMonth = getCurrentMonthString();
        return (
          compMonths1.includes(currentMonth) ||
          compMonths2.includes(currentMonth)
        );
      }
      if (periodType === "Anual") {
        const currentYear = getCurrentYearString();
        return (
          compYears1.includes(currentYear) ||
          compYears2.includes(currentYear)
        );
      }
      return false;
    }

    if (
      periodType === "Diário" ||
      analysisMode === "horaahora"
    ) {
      return dateRange.end === today;
    }
    if (periodType === "Semanal") {
      if (weeklyMode === "specific") {
        return selectedSpecificDays.includes(today);
      }
      return weeklyComputedDays.some(
        (day) => day && formatDate(day) === today,
      );
    }
    if (periodType === "Mensal") {
      return selectedMonths.includes(getCurrentMonthString());
    }
    if (periodType === "Anual") {
      return selectedYears.includes(getCurrentYearString());
    }
    return false;
  }, [
    analysisMode,
    periodType,
    dateRange.end,
    weeklyMode,
    selectedSpecificDays,
    weeklyComputedDays,
    compDateRange1.end,
    compDateRange2.end,
    compSpecificDays1,
    compSpecificDays2,
    compWeeklyComputedDays1,
    compWeeklyComputedDays2,
    compMonths1,
    compMonths2,
    compYears1,
    compYears2,
    selectedMonths,
    selectedYears,
  ]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 animate-in fade-in duration-500">
      {/* ═══════════════ RESUMO DA ANÁLISE (chips no fundo cinza) ═══════════════ */}
      <AnalysisSummaryChipsShell
        metaSlot={
          analysisMode === "horaahora" ? <IntradaySyncMetadata /> : undefined
        }
      >
          {/* Period tag(s) */}
          {analysisMode === "comparativo" ? (
            <React.Fragment>
              <Popover.Root>
                <Popover.Trigger asChild>
                  <button
                    className={ANALYSIS_SUMMARY_TAG_BTN_CLASS}
                    style={ANALYSIS_SUMMARY_TAG_STYLE}
                  >
                    <CalendarIcon size={10} />
                    <span>{getComparativoPeriodLabel(1)}</span>
                    <span className="font-normal ml-0.5">
                      {compPeriodSmartSummary(1)}
                    </span>
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    className="z-50 bg-white p-4 rounded-lg shadow-xl border border-slate-200 w-[260px] animate-in zoom-in-95"
                    sideOffset={5}
                    align="start"
                  >
                    <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2">
                      <CalendarIcon
                        size={12}
                        className="text-slate-400"
                      />
                      Per��odo 1
                    </h4>
                    <div className="max-h-[200px] overflow-y-auto custom-scrollbar space-y-0.5">
                      {compPeriodDetailItems(1).map(
                        (item: string, idx: number) => (
                          <div
                            key={idx}
                            className="text-xs text-slate-600 py-1.5 border-b border-slate-50 last:border-0 flex items-start gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0 bg-[#314158]" />
                            {item}
                          </div>
                        ),
                      )}
                    </div>
                    <Popover.Arrow className="fill-white" />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
              <Popover.Root>
                <Popover.Trigger asChild>
                  <button
                    className={ANALYSIS_SUMMARY_TAG_BTN_CLASS}
                    style={ANALYSIS_SUMMARY_TAG_STYLE}
                  >
                    <CalendarIcon size={10} />
                    <span>{getComparativoPeriodLabel(2)}</span>
                    <span className="font-normal ml-0.5">
                      {compPeriodSmartSummary(2)}
                    </span>
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    className="z-50 bg-white p-4 rounded-lg shadow-xl border border-slate-200 w-[260px] animate-in zoom-in-95"
                    sideOffset={5}
                    align="start"
                  >
                    <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2">
                      <CalendarIcon
                        size={12}
                        className="text-slate-400"
                      />
                      Período 2
                    </h4>
                    <div className="max-h-[200px] overflow-y-auto custom-scrollbar space-y-0.5">
                      {compPeriodDetailItems(2).map(
                        (item: string, idx: number) => (
                          <div
                            key={idx}
                            className="text-xs text-slate-600 py-1.5 border-b border-slate-50 last:border-0 flex items-start gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0 bg-[#45556c]" />
                            {item}
                          </div>
                        ),
                      )}
                    </div>
                    <Popover.Arrow className="fill-white" />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            </React.Fragment>
          ) : (
            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  className={ANALYSIS_SUMMARY_TAG_BTN_CLASS}
                  style={ANALYSIS_SUMMARY_TAG_STYLE}
                >
                  <CalendarIcon size={10} />
                  <span className="uppercase">
                    {periodType === "Semanal"
                      ? "Dias da Semana"
                      : periodType === "Diário"
                        ? "Período"
                        : periodType}
                  </span>
                  <span className="font-normal ml-0.5">
                    {periodDisplayText}
                  </span>
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="z-50 bg-white p-4 rounded-lg shadow-xl border border-slate-200 w-[280px] animate-in zoom-in-95"
                  sideOffset={5}
                  align="start"
                >
                  <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2">
                    <CalendarIcon
                      size={12}
                      className="text-slate-400"
                    />
                    Período do Relatório
                  </h4>
                  {periodType === "Diário" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          Tipo
                        </span>
                        <span className="text-slate-800 font-medium">
                          Período
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          Início
                        </span>
                        <span className="text-slate-800 font-medium">
                          {dateRange.start}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          Fim
                        </span>
                        <span className="text-slate-800 font-medium">
                          {dateRange.end}
                        </span>
                      </div>
                      {analysisMode !== "padrao" && (
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-[#314158]">
                          {analysisMode === "evolucao" ? (
                            <TrendingUp size={10} />
                          ) : (
                            <ArrowLeftRight size={10} />
                          )}
                          <span className="font-medium">
                            {analysisMode === "evolucao"
                              ? "Visualização Evolutiva ativa"
                              : "Visualização Comparativa ativa"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {periodType === "Mensal" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-slate-500">
                          Tipo
                        </span>
                        <span className="text-slate-800 font-medium">
                          Mensal — {selectedMonths.length}{" "}
                          {selectedMonths.length > 1
                            ? "meses"
                            : "mês"}
                        </span>
                      </div>
                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar space-y-0.5">
                        {selectedMonths.map(
                          (m: string, idx: number) => (
                            <div
                              key={idx}
                              className="text-xs text-slate-600 py-1.5 border-b border-slate-50 last:border-0 flex items-start gap-2"
                            >
                              <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0 bg-[#314158]" />
                              {m}
                            </div>
                          ),
                        )}
                      </div>
                      {analysisMode !== "padrao" && (
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-[#314158]">
                          {analysisMode === "evolucao" ? (
                            <TrendingUp size={10} />
                          ) : (
                            <ArrowLeftRight size={10} />
                          )}
                          <span className="font-medium">
                            {analysisMode === "evolucao"
                              ? "Visualização Evolutiva ativa"
                              : "Visualização Comparativa ativa"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {periodType === "Semanal" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-slate-500">
                          Tipo
                        </span>
                        <span className="text-slate-800 font-medium">
                          Período fechado — {periods.length}{" "}
                          {periods.length !== 1
                            ? "dias"
                            : "dia"}
                        </span>
                      </div>
                      {weeklyMode === "weekday" && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">
                            Dias
                          </span>
                          <span className="text-slate-800 font-medium">
                            {WEEKDAY_FULL.filter(
                              (_: string, i: number) =>
                                (weeklyComputedDays || []).some(
                                  (d: Date) => d.getDay() === i,
                                ),
                            ).join(", ") || "—"}
                          </span>
                        </div>
                      )}
                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar space-y-0.5">
                        {periods.map(
                          (p: string, idx: number) => (
                            <div
                              key={idx}
                              className="text-xs text-slate-600 py-1.5 border-b border-slate-50 last:border-0 flex items-start gap-2"
                            >
                              <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0 bg-[#314158]" />
                              {p}
                            </div>
                          ),
                        )}
                      </div>
                      {analysisMode !== "padrao" && (
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-[#314158]">
                          {analysisMode === "evolucao" ? (
                            <TrendingUp size={10} />
                          ) : (
                            <ArrowLeftRight size={10} />
                          )}
                          <span className="font-medium">
                            {analysisMode === "evolucao"
                              ? "Visualização Evolutiva ativa"
                              : "Visualização Comparativa ativa"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {periodType === "Anual" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-slate-500">
                          Tipo
                        </span>
                        <span className="text-slate-800 font-medium">
                          Anual — {selectedYears.length}{" "}
                          {selectedYears.length > 1
                            ? "anos"
                            : "ano"}
                        </span>
                      </div>
                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar space-y-0.5">
                        {selectedYears.map(
                          (y: string, idx: number) => (
                            <div
                              key={idx}
                              className="text-xs text-slate-600 py-1.5 border-b border-slate-50 last:border-0 flex items-start gap-2"
                            >
                              <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0 bg-[#314158]" />
                              {y}
                            </div>
                          ),
                        )}
                      </div>
                      {analysisMode !== "padrao" && (
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-[#314158]">
                          {analysisMode === "evolucao" ? (
                            <TrendingUp size={10} />
                          ) : (
                            <ArrowLeftRight size={10} />
                          )}
                          <span className="font-medium">
                            {analysisMode === "evolucao"
                              ? "Visualização Evolutiva ativa"
                              : "Visualização Comparativa ativa"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <Popover.Arrow className="fill-white" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          )}

          {/* Faixa Horária badge (only for hora a hora mode) */}
          {analysisMode === "horaahora" && (
            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  className={ANALYSIS_SUMMARY_TAG_BTN_CLASS}
                  style={ANALYSIS_SUMMARY_TAG_STYLE}
                >
                  <Clock size={10} />
                  <span className="uppercase">Faixa Horária:</span>
                  <span className="font-normal ml-0.5">
                    {intradayHoursLabel}
                  </span>
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="z-50 bg-white p-3 rounded-lg shadow-xl border border-slate-200 w-[250px] animate-in zoom-in-95"
                  sideOffset={5}
                >
                  <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide border-b border-slate-100 pb-1 flex items-center justify-between">
                    <span>Horas Selecionadas</span>
                    <span className="text-[10px] opacity-70 bg-white/50 px-1.5 py-0.5 rounded-full">
                      {selectedIntradayHours.length}
                    </span>
                  </h4>
                  <div className="max-h-[200px] overflow-y-auto custom-scrollbar space-y-0.5">
                    {[...selectedIntradayHours]
                      .sort(
                        (a, b) =>
                          parseInt(a.replace("h", ""), 10) -
                          parseInt(b.replace("h", ""), 10),
                      )
                      .map((hour, idx) => (
                        <div
                          key={`${hour}-${idx}`}
                          className="text-xs text-slate-600 py-1.5 border-b border-slate-50 last:border-0 flex items-start gap-2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0 bg-[#314158]" />
                          {hour}
                        </div>
                      ))}
                  </div>
                  <Popover.Arrow className="fill-white" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          )}

          {/* Filtros de inclusão */}
          {includeSummaryFilters.map((filter) => (
            <Popover.Root key={`hdr-inc-${filter.key}`}>
              <Popover.Trigger asChild>
                <button
                  type="button"
                  className={ANALYSIS_SUMMARY_TAG_BTN_CLASS}
                  style={ANALYSIS_SUMMARY_TAG_STYLE}
                >
                  <Filter size={10} className="shrink-0 text-[#2C2C2C]" />
                  <span className="uppercase">{getAttributeLabel(filter.key)}:</span>
                  <span className="font-normal ml-0.5">
                    {filter.vals.length > 1
                      ? `${filter.vals.length} itens`
                      : filter.vals[0]}
                  </span>
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="z-50 bg-white p-3 rounded-lg shadow-xl border border-[#D9D9D9] w-[250px] animate-in zoom-in-95"
                  sideOffset={5}
                >
                  <h4 className="text-xs font-bold mb-2 uppercase tracking-wide border-b border-[#D9D9D9] pb-1 flex items-center justify-between text-[#314158]">
                    <span>{getAttributeLabel(filter.key)} (inclusão)</span>
                    <span className="text-[10px] opacity-70 bg-[#F1F1F1] px-1.5 py-0.5 rounded-full text-[#2C2C2C]">
                      {filter.vals.length}
                    </span>
                  </h4>
                  <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                    {filter.vals.map((val: string, idx: number) => (
                      <div
                        key={idx}
                        className="text-xs text-[#2C2C2C] py-1.5 border-b border-[#F1F1F1] last:border-0 flex items-start gap-2 leading-relaxed"
                      >
                        <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0 bg-[#D9D9D9]" />
                        {val}
                      </div>
                    ))}
                  </div>
                  <Popover.Arrow className="fill-white" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          ))}

          {/* Agrupamento */}
          {groupingArr.length > 0 && (
            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  type="button"
                  className={ANALYSIS_SUMMARY_TAG_BTN_CLASS}
                  style={ANALYSIS_SUMMARY_TAG_STYLE}
                >
                  <Anchor size={10} className="shrink-0 text-[#2C2C2C]" strokeWidth={2.25} />
                  <span className="uppercase">Agrupamento:</span>
                  <span className="font-normal ml-0.5">
                    {groupingArr.length > 1
                      ? `${groupingArr.length} níveis`
                      : getAttributeLabel(groupingArr[0])}
                  </span>
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="z-50 bg-white p-3 rounded-lg shadow-xl border border-[#D9D9D9] w-[250px] animate-in zoom-in-95"
                  sideOffset={5}
                >
                  <h4 className="text-xs font-bold text-[#314158] mb-2 uppercase tracking-wide border-b border-[#D9D9D9] pb-1 flex items-center justify-between">
                    <span>Níveis de Agrupamento</span>
                    <span className="text-[10px] opacity-70 bg-[#F1F1F1] px-1.5 py-0.5 rounded-full text-[#2C2C2C]">
                      {groupingArr.length}
                    </span>
                  </h4>
                  <div className="space-y-1">
                    {groupingArr.map((gId: string, gIdx: number) => {
                      const GIcon = getAttributeIcon(gId);
                      return (
                        <div
                          key={gId}
                          className="text-xs text-[#2C2C2C] py-1.5 border-b border-[#F1F1F1] last:border-0 flex items-center gap-2"
                        >
                          <span className="text-[10px] text-[#808080] w-4 text-center shrink-0">
                            {gIdx + 1}.
                          </span>
                          <GIcon size={12} className="text-[#566878] shrink-0" />
                          <span className="uppercase">{getAttributeLabel(gId)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <Popover.Arrow className="fill-white" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          )}

          {/* Filtros de exclusão */}
          {excludeSummaryFilters.map((filter) => (
            <Popover.Root key={`hdr-exc-${filter.key}`}>
              <Popover.Trigger asChild>
                <button
                  type="button"
                  className={ANALYSIS_SUMMARY_TAG_BTN_CLASS}
                  style={ANALYSIS_SUMMARY_TAG_STYLE}
                >
                  <Ban size={10} className="shrink-0 text-red-600" />
                  <span className="uppercase">{getAttributeLabel(filter.key)}:</span>
                  <span className="font-normal ml-0.5">
                    {filter.vals.length > 1
                      ? `${filter.vals.length} itens`
                      : filter.vals[0]}
                  </span>
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="z-50 bg-white p-3 rounded-lg shadow-xl border border-[#D9D9D9] w-[250px] animate-in zoom-in-95"
                  sideOffset={5}
                >
                  <h4 className="text-xs font-bold mb-2 uppercase tracking-wide border-b border-[#D9D9D9] pb-1 flex items-center justify-between text-[#314158]">
                    <span className="flex items-center gap-2">
                      <Ban size={12} className="text-red-600 shrink-0" />
                      {getAttributeLabel(filter.key)} (exclusão)
                    </span>
                    <span className="text-[10px] opacity-70 bg-[#F1F1F1] px-1.5 py-0.5 rounded-full text-[#2C2C2C]">
                      {filter.vals.length}
                    </span>
                  </h4>
                  <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                    {filter.vals.map((val: string, idx: number) => (
                      <div
                        key={idx}
                        className="text-xs text-[#2C2C2C] py-1.5 border-b border-[#F1F1F1] last:border-0 flex items-start gap-2 leading-relaxed"
                      >
                        <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0 bg-[#D9D9D9]" />
                        {val}
                      </div>
                    ))}
                  </div>
                  <Popover.Arrow className="fill-white" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          ))}
      </AnalysisSummaryChipsShell>

      {/* ═══════════════ HEADER CARD: Title + Ações + Info tempo ═══════════════ */}
      <div
        className={cn(
          "flex-none bg-white rounded-[14px] px-5 py-4",
          actionsContainer && "hidden",
        )}
        style={{
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "#D9D9D9",
          boxShadow:
            "0px 1px 4px 0px rgba(0,0,0,0.07), 0px 1px 2px -1px rgba(0,0,0,0.05)",
        }}
      >
        {/* Row 1: Title + Actions
            — Quando actionsContainer está disponível (SecondaryHeader montado):
              • O ícone/título fica no SecondaryHeader (não renderiza aqui)
              • Os action buttons são portados para o slot do SecondaryHeader
            — Fallback (sem portal): exibe o Row 1 original inline */}
        {!actionsContainer && (
          <div className="flex items-center gap-4 min-w-0 flex-1 mb-0">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#eef1f5" }}
              >
                {analysisMode === "padrao" && <BarChart3 size={18} className="text-[#314158]" />}
                {analysisMode === "evolucao" && <TrendingUp size={18} className="text-[#314158]" />}
                {analysisMode === "comparativo" && <ArrowLeftRight size={18} className="text-[#314158]" />}
                {analysisMode === "horaahora" && <Clock size={18} className="text-[#314158]" />}
              </div>
              <h2 className="text-[24px] font-medium text-[#0f172b] tracking-[0.07px] leading-[32px] truncate">
                {customTitle || MODULE_TITLES[analysisMode] || "Análise de Venda e Estoque"}
              </h2>
            </div>
          </div>
        )}

        {/* Actions: portados para o SecondaryHeader quando disponível, inline como fallback */}
        {(() => {
          if (!SHOW_ANALYSIS_RESULT_TOOLBAR) {
            return null;
          }

          const actionsJSX = (
            <div className="flex items-center gap-2 shrink-0">
            {/* Add % share button */}
            <button
              onClick={() => setShowSharePct((prev) => !prev)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-2 text-[12px] transition-colors cursor-pointer rounded-lg border shadow-sm",
                showSharePct
                  ? "bg-[#314158] text-white border-[#314158]"
                  : "bg-white text-[#62748e] hover:text-slate-800 hover:bg-slate-100 border-slate-200",
              )}
              title={
                showSharePct
                  ? "Remover % do share"
                  : "Exibir % do share por coluna"
              }
            >
              <span className="font-medium">Add %</span>
            </button>

            {/* Add x̄ (Average) button with dropdown */}
            <div className="relative">
              {(() => {
                const avgOptions = getAvailableAverageOptions();
                const isButtonDisabled = avgOptions.disabled;

                return (
                  <RadixTooltip.Root delayDuration={0}>
                    <RadixTooltip.Trigger asChild>
                      <div>
                        <button
                          onClick={() => {
                            if (!isButtonDisabled) {
                              setAverageDropdownOpen(
                                (prev) => !prev,
                              );
                            }
                          }}
                          disabled={isButtonDisabled}
                          className={cn(
                            "flex items-center gap-1.5 px-2.5 py-2 text-[12px] transition-colors rounded-lg border shadow-sm",
                            isButtonDisabled
                              ? "bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed"
                              : showAverage
                                ? "bg-[#314158] text-white border-[#314158] cursor-pointer"
                                : "bg-white text-[#62748e] hover:text-slate-800 hover:bg-slate-100 border-slate-200 cursor-pointer",
                          )}
                          title={
                            isButtonDisabled
                              ? avgOptions.tooltip
                              : "Adicionar coluna de média"
                          }
                        >
                          <span className="font-medium">
                            Add x̄
                          </span>
                          <ChevronDown
                            size={12}
                            className={cn(
                              "transition-transform",
                              averageDropdownOpen &&
                                !isButtonDisabled &&
                                "rotate-180",
                            )}
                          />
                        </button>
                      </div>
                    </RadixTooltip.Trigger>
                    {isButtonDisabled && (
                      <RadixTooltip.Portal>
                        <RadixTooltip.Content
                          className="z-50 bg-slate-900 text-white text-xs font-medium px-3 py-2 rounded shadow-lg animate-in fade-in zoom-in-95 max-w-[280px] text-center"
                          sideOffset={5}
                        >
                          {avgOptions.tooltip}
                          <RadixTooltip.Arrow className="fill-slate-900" />
                        </RadixTooltip.Content>
                      </RadixTooltip.Portal>
                    )}
                  </RadixTooltip.Root>
                );
              })()}

              {/* Dropdown */}
              {averageDropdownOpen &&
                !getAvailableAverageOptions().disabled && (
                  <>
                    {/* Backdrop para fechar ao clicar fora */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() =>
                        setAverageDropdownOpen(false)
                      }
                    />

                    {/* Dropdown content */}
                    <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50 min-w-[280px]">
                      {/* Heading */}
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="font-bold text-[11px] tracking-[0.6px] uppercase text-[#314158]">
                          CALCULAR MÉDIA
                        </p>
                      </div>

                      {/* Average type options */}
                      <div className="py-1">
                        {getAvailableAverageOptions().options.map(
                          ({ id, disabled, tooltip }) => {
                            const isSelected =
                              averagePeriodType === id;

                            // Descrições para cada tipo
                            const descriptions: Record<
                              string,
                              string
                            > = {
                              Dia: "Divide o total pelo número de dias",
                              Mês: "Divide o total pelo número de meses",
                              Ano: "Divide o total pelo número de anos",
                            };

                            return (
                              <RadixTooltip.Root
                                key={id}
                                delayDuration={0}
                              >
                                <RadixTooltip.Trigger asChild>
                                  <div>
                                    <button
                                      onClick={() => {
                                        if (!disabled) {
                                          setAveragePeriodType(
                                            isSelected
                                              ? null
                                              : id,
                                          );
                                          setAverageDropdownOpen(
                                            false,
                                          );
                                        }
                                      }}
                                      disabled={disabled}
                                      className={cn(
                                        "w-full px-4 py-2.5 transition-all text-left flex items-start gap-2.5",
                                        disabled
                                          ? "bg-white text-slate-300 cursor-not-allowed"
                                          : isSelected
                                            ? "bg-slate-50 text-[#314158]"
                                            : "bg-white text-slate-700 hover:bg-slate-50 cursor-pointer",
                                      )}
                                    >
                                      {/* Check icon para opção selecionada */}
                                      <div className="w-4 h-4 shrink-0 mt-0.5">
                                        {isSelected &&
                                          !disabled && (
                                            <Check
                                              size={16}
                                              className="text-[#314158]"
                                              strokeWidth={2.5}
                                            />
                                          )}
                                      </div>

                                      <div className="flex flex-col gap-0.5 flex-1">
                                        <span
                                          className={cn(
                                            "text-[13px]",
                                            isSelected &&
                                              !disabled
                                              ? "font-bold"
                                              : "font-medium",
                                          )}
                                        >
                                          {id}
                                        </span>
                                        <span
                                          className={cn(
                                            "text-[11px]",
                                            disabled
                                              ? "text-slate-300"
                                              : isSelected
                                                ? "text-slate-600"
                                                : "text-slate-500",
                                          )}
                                        >
                                          {descriptions[id]}
                                        </span>
                                      </div>
                                    </button>
                                  </div>
                                </RadixTooltip.Trigger>
                                {disabled && tooltip && (
                                  <RadixTooltip.Portal>
                                    <RadixTooltip.Content
                                      className="z-50 bg-slate-900 text-white text-xs font-medium px-3 py-2 rounded shadow-lg animate-in fade-in zoom-in-95 max-w-[280px] text-center"
                                      sideOffset={5}
                                    >
                                      {tooltip}
                                      <RadixTooltip.Arrow className="fill-slate-900" />
                                    </RadixTooltip.Content>
                                  </RadixTooltip.Portal>
                                )}
                              </RadixTooltip.Root>
                            );
                          },
                        )}
                      </div>
                    </div>
                  </>
                )}
            </div>

            {analysisMode === "horaahora" && (
              <Popover.Root>
                <Popover.Trigger asChild>
                  <button
                    className="flex items-center gap-1.5 px-2.5 py-2 text-[12px] transition-colors cursor-pointer rounded-lg border shadow-sm bg-white text-[#62748e] hover:text-slate-800 hover:bg-slate-100 border-slate-200"
                  title="Selecionar horas do intraday"
                  >
                    <Clock size={14} />
                  <span className="font-medium">Horas</span>
                    <ChevronDown size={12} />
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    className="z-50 bg-white p-3 rounded-lg shadow-xl border border-slate-200 w-[280px] animate-in zoom-in-95"
                    sideOffset={5}
                  >
                    <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide border-b border-slate-100 pb-1">
                      Selecionar Horas (Intraday)
                    </h4>
                    <div className="flex items-center justify-between mb-2">
                      <button
                        type="button"
                        className="text-[10px] font-medium text-slate-600 hover:text-slate-800"
                        onClick={() => setSelectedIntradayHours(HORA_A_HORA_HOURS)}
                      >
                        Marcar 24h
                      </button>
                      <button
                        type="button"
                        className="text-[10px] font-medium text-slate-600 hover:text-slate-800"
                        onClick={() => setSelectedIntradayHours(DEFAULT_INTRADAY_HOURS)}
                      >
                        Limpar tudo
                      </button>
                      <span className="text-[10px] text-slate-500">
                        {selectedIntradayHours.length} selecionadas
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                      {HORA_A_HORA_HOURS.map((hour) => {
                        const isSelected = selectedIntradayHours.includes(hour);
                        return (
                          <button
                            key={hour}
                            type="button"
                            onClick={() => toggleIntradayHour(hour)}
                            className={cn(
                              "text-[10px] px-2 py-1 rounded border transition-colors",
                              isSelected
                                ? "bg-[#314158] text-white border-[#314158]"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50",
                            )}
                          >
                            {hour}
                          </button>
                        );
                      })}
                    </div>
                    <Popover.Arrow className="fill-white" />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            )}

            {/* Chart type selector dropdown */}
            <div className="relative">
              <button
                onClick={() =>
                  setChartDropdownOpen((prev) => !prev)
                }
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-2 text-[12px] transition-colors cursor-pointer rounded-lg border shadow-sm",
                  showChartSection
                    ? "bg-slate-100 text-slate-700 border-slate-300"
                    : "bg-white text-[#62748e] hover:text-slate-800 hover:bg-slate-100 border-slate-200",
                )}
                title="Selecionar tipo de gráfico"
              >
                <BarChart3 size={14} />
                <span className="font-medium">Gráficos</span>
                <ChevronDown
                  size={12}
                  className={cn(
                    "transition-transform",
                    chartDropdownOpen && "rotate-180",
                  )}
                />
              </button>

              {/* Dropdown */}
              {chartDropdownOpen && (
                <>
                  {/* Backdrop para fechar ao clicar fora */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setChartDropdownOpen(false)}
                  />

                  {/* Dropdown content */}
                  <div
                    className="absolute top-full left-0 mt-2 bg-white rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] border border-[#e2e8f0] p-[21px] z-50"
                    style={{ minWidth: 280 }}
                  >
                    {/* Heading */}
                    <div className="mb-4">
                      <p className="font-bold text-[12px] tracking-[0.6px] uppercase text-[#314158] leading-[16px]">
                        EXIBIR GRÁFICO
                      </p>
                    </div>

                    {/* Chart type cards */}
                    <div className="flex gap-2">
                      {[
                        {
                          id: "bar" as const,
                          Icon: BarChart3,
                          label: "Barra",
                        },
                        {
                          id: "line" as const,
                          Icon: LineChartIcon,
                          label: "Linha",
                        },
                        {
                          id: "pie" as const,
                          Icon: PieChartIcon,
                          label: "Pizza",
                        },
                      ].map(({ id, Icon, label }) => {
                        const isSelected =
                          showChartSection &&
                          chartTypeMode === id;
                        return (
                          <button
                            key={id}
                            onClick={() => {
                              if (isSelected) {
                                // Se já está selecionado, ocultar o gráfico
                                setShowChartSection(false);
                              } else {
                                // Se não está selecionado, trocar tipo e exibir
                                setChartTypeMode(id);
                                setShowChartSection(true);
                              }
                              setChartDropdownOpen(false);
                            }}
                            className={cn(
                              "flex-1 h-[80px] rounded-[10px] border-2 transition-all flex flex-col gap-2 items-center justify-center",
                              isSelected
                                ? "bg-slate-100 border-slate-400"
                                : "bg-white border-[#e2e8f0] hover:border-slate-300 hover:bg-slate-50",
                            )}
                          >
                            <Icon
                              size={20}
                              className={
                                isSelected
                                  ? "text-slate-700"
                                  : "text-[#45556C]"
                              }
                              strokeWidth={1.67}
                            />
                            <span
                              className={cn(
                                "font-medium text-[12px]",
                                isSelected
                                  ? "text-slate-700"
                                  : "text-[#45556c]",
                              )}
                            >
                              {label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Export Dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#62748e] hover:text-slate-800 transition-colors cursor-pointer rounded-lg hover:bg-slate-100 border border-slate-200 bg-white shadow-sm">
                <Download size={14} />
                <span className="font-medium">Exportar</span>
                <ChevronDown size={12} className="opacity-50" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="z-50 bg-white rounded-lg shadow-xl border border-slate-200 p-1 min-w-[200px] animate-in zoom-in-95"
                  sideOffset={8}
                  align="end"
                >
                  <DropdownMenu.Item
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 text-xs rounded-md cursor-pointer outline-none",
                      finalRows.length > 0
                        ? "text-slate-700 hover:bg-slate-50"
                        : "text-slate-300 cursor-not-allowed",
                    )}
                    disabled={finalRows.length === 0}
                    onSelect={handleExportTableExcel}
                  >
                    <FileSpreadsheet
                      size={14}
                      className={
                        finalRows.length > 0
                          ? "text-slate-400"
                          : "text-slate-300"
                      }
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        Tabela geral (Excel)
                      </span>
                      <span className="text-[10px] font-normal text-slate-400">
                        Arquivo .xlsx com os dados exibidos
                      </span>
                    </div>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-slate-100 my-1" />
                  <DropdownMenu.Item
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 text-xs rounded-md cursor-pointer outline-none",
                      showChartSection && showChart
                        ? "text-slate-700 hover:bg-slate-50"
                        : "text-slate-300 cursor-not-allowed",
                    )}
                    disabled={!showChartSection || !showChart}
                    onSelect={handleExportChartPNG}
                  >
                    <ImageIcon
                      size={14}
                      className={
                        showChartSection && showChart
                          ? "text-slate-400"
                          : "text-slate-300"
                      }
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {analysisMode === "padrao"
                          ? "Gráfico"
                          : analysisMode === "evolucao"
                            ? "Gráfico evolutivo"
                            : analysisMode === "horaahora"
                              ? "Gráfico hora a hora"
                              : "Gráfico comparativo"}
                      </span>
                      <span className="text-[10px] font-normal text-slate-400">
                        Imagem PNG do gráfico
                      </span>
                    </div>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
          );
          return actionsContainer
            ? ReactDOM.createPortal(actionsJSX, actionsContainer)
            : actionsJSX;
        })()}

        {/* Current time info - mostrar em todas análises que incluem dia atual */}
        {hasCurrentTimeInfo && (
          <div className="flex items-center gap-2 text-[11px] text-[#62748e] mt-3 px-4">
            <Clock size={11} className="text-[#90a1b9]" />
            <span>
              Horário atual:{" "}
              {new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="text-[#90a1b9]">|</span>
            <span>
              Última atualização:{" "}
              {(() => {
                const now = new Date();
                const roundedMinutes =
                  now.getMinutes() < 30 ? 0 : 30;
                const lastUpdate = new Date(now);
                lastUpdate.setMinutes(roundedMinutes, 0, 0);
                return lastUpdate.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
              })()}
            </span>
          </div>
        )}
      </div>

      {/* ═══════════════ GRÁFICO Section ═══════════════ */}
      {showChartSection && finalRows.length > 0 && (
        <div
          className="flex-none bg-white rounded-[14px] overflow-hidden"
          style={{
            borderWidth: 1,
            borderStyle: "solid",
            ...bc("#d5dbe3"),
            boxShadow:
              "0px 1px 4px 0px rgba(0,0,0,0.07), 0px 1px 2px -1px rgba(0,0,0,0.05)",
            minHeight: 400,
          }}
        >
          {/* ── Chart Card Header ── */}
          <div className="px-4 pt-3 pb-3 select-none shrink-0">
            <div className="flex items-start justify-between gap-4">
              {/* Left: Title + subtitle */}
              <div className="flex flex-col gap-[4px] min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className="font-medium text-[#45556c] text-[18px] tracking-[0.45px] leading-[16px]">
                    {analysisMode === "padrao" &&
                      "Gráfico"}
                    {analysisMode === "evolucao" &&
                      "Gráfico evolutivo"}
                    {analysisMode === "comparativo" &&
                      "Gráfico comparativo"}
                    {analysisMode === "horaahora" &&
                      "Gráfico hora a hora"}
                  </span>
                </div>
                <span className="text-[10px] font-normal text-[#90a1b9] tracking-[0.12px] leading-[15px]">
                  {(analysisMode === "evolucao" ||
                    analysisMode === "comparativo") &&
                  isPivot
                    ? "Visualização de uma métrica por vez"
                    : "Visualização de até 2 métricas"}
                </span>
              </div>
              {/* Right: Metric pills — outline style */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                {(analysisMode === "evolucao" ||
                  analysisMode === "comparativo") &&
                isPivot ? (
                  <React.Fragment>
                    {orderedMetrics.map((mId: string) => {
                      const m = METRICS_LIST.find(
                        (x) => x.id === mId,
                      );
                      const isActive = temporalMetricId === mId;
                      return (
                        <button
                          key={mId}
                          onClick={() => {
                            setChartMetricIds([mId]);
                            setChartCurrentPage(0);
                            setTemporalCurrentPage(0);
                            setTemporalHiddenItems(new Set());
                            setPeriodCurrentPage(0);
                          }}
                          className={cn(
                            "text-[12px] px-[14px] py-[7px] rounded-[8px] transition-all flex items-center gap-1.5 cursor-pointer font-medium",
                            isActive
                              ? "text-[#314158]"
                              : "bg-white text-[#45556c] hover:bg-slate-50",
                          )}
                          style={{
                            borderWidth: 1,
                            borderStyle: "solid",
                            ...bc(
                              isActive ? "#314158" : "#e2e8f0",
                            ),
                            ...(isActive
                              ? {
                                  boxShadow:
                                    "0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px 0px rgba(0,0,0,0.1)",
                                }
                              : {}),
                          }}
                        >
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-[#314158] shrink-0" />
                          )}
                          {m?.label || mId}
                        </button>
                      );
                    })}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {orderedMetrics.map((mId: string) => {
                      const m = METRICS_LIST.find(
                        (x) => x.id === mId,
                      );
                      const isActive =
                        chartMetricIds.indexOf(mId) >= 0;
                      const isMaxed =
                        !isActive && chartMetricIds.length >= 2;
                      return (
                        <button
                          key={mId}
                          onClick={() =>
                            !isMaxed && toggleChartMetric(mId)
                          }
                          className={cn(
                            "text-[12px] px-[14px] py-[7px] rounded-[8px] transition-all flex items-center gap-1.5 font-medium",
                            isActive
                              ? "text-[#314158]"
                              : isMaxed
                                ? "bg-white text-slate-300 cursor-not-allowed"
                                : "bg-white text-[#45556c] hover:bg-slate-50 cursor-pointer",
                          )}
                          style={{
                            borderWidth: 1,
                            borderStyle: "solid",
                            ...bc(
                              isActive
                                ? "#314158"
                                : isMaxed
                                  ? "#f1f5f9"
                                  : "#e2e8f0",
                            ),
                            ...(isActive
                              ? {
                                  boxShadow:
                                    "0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px 0px rgba(0,0,0,0.1)",
                                }
                              : {}),
                          }}
                          title={
                            isMaxed
                              ? "Máximo de 2 métricas"
                              : undefined
                          }
                        >
                          {isActive && (
                            <span className="w-2 h-2 rounded-full shrink-0 bg-slate-400" />
                          )}
                          {m?.label || mId}
                        </button>
                      );
                    })}
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>

          {showChart && (
            <div
              className="px-4 pb-4"
              style={{ minHeight: 350 }}
            >
              <div
                ref={chartContainerRef}
                className="space-y-4"
              >
                {/* ── Breadcrumb ── */}
                {chartContext.breadcrumbItems.length > 0 && (
                  <div className="flex items-center gap-0 flex-wrap text-[11px] text-[#45556c] leading-relaxed pt-1">
                    {chartContext.breadcrumbItems.map(
                      (item, idx) => (
                        <span key={idx} className="contents">
                          {idx > 0 && (
                            <span className="mx-1 text-slate-300 select-none">
                              &gt;
                            </span>
                          )}
                          <span
                            className={
                              item.type === "attribute"
                                ? "font-bold uppercase"
                                : "font-normal"
                            }
                          >
                            {item.text}
                          </span>
                        </span>
                      ),
                    )}
                  </div>
                )}

                {/* ── Legend (temporal/evolução) — centered above chart ── */}
                {analysisMode === "evolucao" &&
                  isPivot &&
                  temporalChartInfo.items.length > 0 && (
                    <div className="flex items-center gap-4 flex-wrap justify-center py-1">
                      {temporalChartInfo.items.map(
                        (item, legendIndex) => {
                          const isHidden =
                            temporalHiddenItems.has(item.key);
                          return (
                            <button
                              key={`legend-${item.key}-${legendIndex}`}
                              onClick={() => {
                                setTemporalHiddenItems(
                                  (prev) => {
                                    const next = new Set(prev);
                                    if (next.has(item.key)) {
                                      next.delete(item.key);
                                    } else {
                                      const visibleCount =
                                        temporalChartInfo.items.filter(
                                          (i) =>
                                            !prev.has(i.key),
                                        ).length;
                                      if (visibleCount > 1)
                                        next.add(item.key);
                                    }
                                    return next;
                                  },
                                );
                              }}
                              className={cn(
                                "flex items-center gap-[6px] px-1 py-0.5 rounded-md transition-all cursor-pointer",
                                isHidden
                                  ? "opacity-40 hover:opacity-60"
                                  : "hover:bg-slate-50",
                              )}
                            >
                              <span
                                className="w-3 h-3 rounded-[6px] shrink-0 transition-opacity"
                                style={{
                                  backgroundColor: item.color,
                                  opacity: isHidden ? 0.3 : 1,
                                }}
                              />
                              <span
                                className={cn(
                                  "text-[11px] truncate max-w-[120px] transition-colors",
                                  isHidden
                                    ? "text-slate-400 line-through"
                                    : "text-[#45556c]",
                                )}
                                title={item.label}
                              >
                                {item.label}
                              </span>
                            </button>
                          );
                        },
                      )}
                    </div>
                  )}

                {/* ── Legend (comparative) — centered above chart ── */}
                {analysisMode === "comparativo" && isPivot && (
                  <div className="flex items-center gap-4 flex-wrap justify-center py-1">
                    <div className="flex items-center gap-[6px]">
                      <span
                        className="w-3 h-3 rounded-[6px] shrink-0"
                        style={{ backgroundColor: "#94a3b8" }}
                      />
                      <span className="text-[11px] text-[#45556c]">
                        {compP1Label}
                      </span>
                    </div>
                    <div className="flex items-center gap-[6px]">
                      <span
                        className="w-3 h-3 rounded-[6px] shrink-0"
                        style={{ backgroundColor: "#6C63FF" }}
                      />
                      <span className="text-[11px] text-[#45556c]">
                        {compP2Label}
                      </span>
                    </div>
                    <div className="flex items-center gap-[6px]">
                      <span
                        className="w-6 shrink-0"
                        style={{
                          borderTopWidth: 2,
                          borderTopStyle: "solid",
                          borderTopColor: "#F5A623",
                          display: "block",
                          height: 0,
                        }}
                      />
                      <span className="text-[11px] text-[#45556c]">
                        Variação %
                      </span>
                    </div>
                  </div>
                )}

                {/* ── Legend (padrão) — centered above chart ── */}
                {analysisMode === "padrao" &&
                  chartMetricIds.length > 0 &&
                  null}

                {/* ── Chart Area ── */}
                {chartTypeMode === "pie" ? (
                  /* PIE CHARTS: Legenda à esquerda, 1 ou 2 gráficos baseado em métricas selecionadas */
                  <div
                    className="flex gap-6"
                    style={{ height: 320 }}
                  >
                    {/* Legenda à esquerda (sem título, apenas itens) */}
                    <div
                      className="flex flex-col shrink-0"
                      style={{ width: 180 }}
                    >
                      <div className="overflow-y-auto custom-scrollbar space-y-2.5 pr-2 pt-1">
                        {chartData
                          .slice(0, 10)
                          .map((entry, index) => {
                            const COLORS = [
                              "#6C63FF",
                              "#F5A623",
                              "#10B981",
                              "#EF4444",
                              "#8B5CF6",
                              "#06B6D4",
                              "#EC4899",
                              "#F59E0B",
                              "#3B82F6",
                              "#14B8A6",
                            ];
                            return (
                              <div
                                key={`pie-legend-${index}`}
                                className="flex items-center gap-2"
                              >
                                <span
                                  className="w-3 h-3 rounded-full shrink-0"
                                  style={{
                                    backgroundColor:
                                      COLORS[
                                        index % COLORS.length
                                      ],
                                  }}
                                />
                                <span className="text-[11px] text-[#45556c] leading-tight">
                                  {entry.label}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* Área dos gráficos: 1 gráfico (1 métrica) ou 2 gráficos lado a lado (2 métricas) */}
                    <div className="flex-1 flex gap-6">
                      {chartMetricIds
                        .slice(0, 2)
                        .map((metricId, metricIndex) => {
                          const metricObj = METRICS_LIST.find(
                            (m) => m.id === metricId,
                          );
                          const metricLabel =
                            metricObj?.label || metricId;
                          const COLORS = [
                            "#6C63FF",
                            "#F5A623",
                            "#10B981",
                            "#EF4444",
                            "#8B5CF6",
                            "#06B6D4",
                            "#EC4899",
                            "#F59E0B",
                            "#3B82F6",
                            "#14B8A6",
                          ];

                          return (
                            <div
                              key={`pie-chart-${metricId}-${metricIndex}`}
                              className="flex-1 flex flex-col min-w-0"
                            >
                              {/* Título da métrica acima do gráfico */}
                              <div className="text-center mb-4">
                                <h3 className="text-[13px] font-semibold text-[#314158] uppercase tracking-wide">
                                  {metricLabel}
                                </h3>
                              </div>

                              {/* Gráfico de pizza */}
                              <div className="flex-1 min-h-0">
                                <ResponsiveContainer
                                  width="100%"
                                  height="100%"
                                >
                                  <RechartsPieChart>
                                    <Pie
                                      data={chartData.slice(
                                        0,
                                        10,
                                      )}
                                      dataKey={metricId}
                                      nameKey="label"
                                      cx="50%"
                                      cy="50%"
                                      outerRadius={
                                        chartMetricIds.length ===
                                        2
                                          ? 75
                                          : 95
                                      }
                                      label={(entry) => {
                                        const total =
                                          chartData.reduce(
                                            (sum, item) =>
                                              sum +
                                              (item[metricId] ||
                                                0),
                                            0,
                                          );
                                        const pct = (
                                          (entry[metricId] /
                                            total) *
                                          100
                                        ).toFixed(1);
                                        return `${pct}%`;
                                      }}
                                      labelLine={true}
                                    >
                                      {chartData
                                        .slice(0, 10)
                                        .map((entry, index) => (
                                          <Cell
                                            key={`pie-cell-${metricId}-${metricIndex}-${index}`}
                                            fill={
                                              COLORS[
                                                index %
                                                  COLORS.length
                                              ]
                                            }
                                          />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                      contentStyle={{
                                        borderRadius: "8px",
                                        border: "none",
                                        boxShadow:
                                          "0 4px 6px -1px rgba(0,0,0,0.1)",
                                        fontSize: 12,
                                      }}
                                      formatter={(
                                        value: any,
                                      ) => {
                                        const config =
                                          METRIC_CONFIG[
                                            metricId
                                          ];
                                        return formatMetricValue(
                                          value,
                                          config?.format ||
                                            "string",
                                        );
                                      }}
                                    />
                                  </RechartsPieChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ) : (
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      {analysisMode === "evolucao" &&
                      isPivot ? (
                        /* ═══ TEMPORAL CHART: X = periods, items as bar or line ═══ */
                        chartTypeMode === "line" ? (
                          <LineChart
                            data={temporalChartInfo.data}
                            margin={{
                              top: 5,
                              right: 20,
                              left: 10,
                              bottom:
                                paginatedPeriods.length > 7
                                  ? 40
                                  : 25,
                            }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="#f1f5f9"
                            />
                            <XAxis
                              dataKey="period"
                              axisLine={false}
                              tickLine={false}
                              tick={
                                paginatedPeriods.length > 7
                                  ? (props: any) => {
                                      const { x, y, payload } =
                                        props;
                                      const label =
                                        payload.value || "";
                                      return (
                                        <g
                                          transform={`translate(${x},${y})`}
                                        >
                                          <text
                                            x={0}
                                            y={0}
                                            dy={8}
                                            textAnchor="end"
                                            fill="#64748b"
                                            fontSize={10}
                                            transform="rotate(-45)"
                                          >
                                            {label}
                                          </text>
                                        </g>
                                      );
                                    }
                                  : {
                                      fill: "#64748b",
                                      fontSize: 10,
                                    }
                              }
                              interval={0}
                              height={
                                paginatedPeriods.length > 7
                                  ? 50
                                  : 30
                              }
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{
                                fill: "#64748b",
                                fontSize: 10,
                              }}
                              tickFormatter={
                                temporalYAxisFormatter
                              }
                              width={60}
                              domain={["auto", "auto"]}
                            />
                            <ReferenceLine
                              y={0}
                              stroke="#cbd5e1"
                              strokeWidth={1.5}
                            />
                            <Tooltip
                              cursor={{
                                stroke: "#e2e8f0",
                                strokeWidth: 1,
                              }}
                              contentStyle={{
                                borderRadius: "8px",
                                border: "none",
                                boxShadow:
                                  "0 4px 6px -1px rgba(0,0,0,0.1)",
                                fontSize: 12,
                              }}
                              formatter={
                                temporalTooltipFormatter
                              }
                            />
                            {temporalChartInfo.items
                              .filter(
                                (item) =>
                                  !temporalHiddenItems.has(
                                    item.key,
                                  ),
                              )
                              .map((item, itemIndex) => (
                                <Line
                                  key={`line-${item.key}-${itemIndex}`}
                                  type="monotone"
                                  dataKey={item.dataKey}
                                  stroke={item.color}
                                  strokeWidth={2.5}
                                  dot={{
                                    r: 3,
                                    fill: "white",
                                    strokeWidth: 2,
                                    stroke: item.color,
                                  }}
                                  activeDot={{
                                    r: 5,
                                    strokeWidth: 0,
                                    fill: item.color,
                                  }}
                                  name={item.label}
                                />
                              ))}
                          </LineChart>
                        ) : (
                          <BarChart
                            data={temporalChartInfo.data}
                            margin={{
                              top: 5,
                              right: 20,
                              left: 10,
                              bottom:
                                paginatedPeriods.length > 7
                                  ? 40
                                  : 25,
                            }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="#f1f5f9"
                            />
                            <XAxis
                              dataKey="period"
                              axisLine={false}
                              tickLine={false}
                              tick={
                                paginatedPeriods.length > 7
                                  ? (props: any) => {
                                      const { x, y, payload } =
                                        props;
                                      const label =
                                        payload.value || "";
                                      return (
                                        <g
                                          transform={`translate(${x},${y})`}
                                        >
                                          <text
                                            x={0}
                                            y={0}
                                            dy={8}
                                            textAnchor="end"
                                            fill="#64748b"
                                            fontSize={10}
                                            transform="rotate(-45)"
                                          >
                                            {label}
                                          </text>
                                        </g>
                                      );
                                    }
                                  : {
                                      fill: "#64748b",
                                      fontSize: 10,
                                    }
                              }
                              interval={0}
                              height={
                                paginatedPeriods.length > 7
                                  ? 50
                                  : 30
                              }
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{
                                fill: "#64748b",
                                fontSize: 10,
                              }}
                              tickFormatter={
                                temporalYAxisFormatter
                              }
                              width={60}
                              domain={["auto", "auto"]}
                            />
                            <ReferenceLine
                              y={0}
                              stroke="#cbd5e1"
                              strokeWidth={1.5}
                            />
                            <Tooltip
                              cursor={{ fill: "#f8fafc" }}
                              contentStyle={{
                                borderRadius: "8px",
                                border: "none",
                                boxShadow:
                                  "0 4px 6px -1px rgba(0,0,0,0.1)",
                                fontSize: 12,
                              }}
                              formatter={
                                temporalTooltipFormatter
                              }
                            />
                            {temporalChartInfo.items
                              .filter(
                                (item) =>
                                  !temporalHiddenItems.has(
                                    item.key,
                                  ),
                              )
                              .map((item, itemIndex) => (
                                <Bar
                                  key={`bar-${item.key}-${itemIndex}`}
                                  dataKey={item.dataKey}
                                  name={item.label}
                                  shape={(props: any) => {
                                    const {
                                      x,
                                      y,
                                      width,
                                      height,
                                      value,
                                    } = props;
                                    if (!width || !height)
                                      return <g />;
                                    const isNeg =
                                      (value ?? 0) < 0;
                                    const fill = isNeg
                                      ? negativeBarColor(
                                          item.color,
                                        )
                                      : item.color;
                                    const r = Math.min(
                                      4,
                                      width / 2,
                                    );
                                    return (
                                      <g>
                                        <rect
                                          x={x}
                                          y={y}
                                          width={width}
                                          height={Math.abs(
                                            height,
                                          )}
                                          fill={fill}
                                          fillOpacity={
                                            isNeg ? 0.85 : 1
                                          }
                                          rx={r}
                                          ry={r}
                                        />
                                        {isNeg && (
                                          <rect
                                            x={x}
                                            y={y}
                                            width={width}
                                            height={Math.abs(
                                              height,
                                            )}
                                            fill="none"
                                            stroke={item.color}
                                            strokeWidth={1.5}
                                            strokeDasharray="4 2"
                                            rx={r}
                                            ry={r}
                                          />
                                        )}
                                      </g>
                                    );
                                  }}
                                />
                              ))}
                          </BarChart>
                        )
                      ) : analysisMode === "comparativo" &&
                        isPivot ? (
                        /* ═══ COMPARATIVE CHART: P1 vs P2 (bar or line) + dashed variation % line ═══ */
                        <ComposedChart
                          data={comparativeChartData}
                          margin={{
                            top: 5,
                            right: 60,
                            left: 10,
                            bottom: 25,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f1f5f9"
                          />
                          <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={(props: any) => {
                              const { x, y, payload } = props;
                              const label = payload.value || "";
                              const truncated =
                                label.length > 12
                                  ? label.slice(0, 12) +
                                    "\u2026"
                                  : label;
                              return (
                                <g
                                  transform={`translate(${x},${y})`}
                                >
                                  <text
                                    x={0}
                                    y={0}
                                    dy={8}
                                    textAnchor="end"
                                    fill="#64748b"
                                    fontSize={10}
                                    transform="rotate(-45)"
                                  >
                                    {truncated}
                                  </text>
                                </g>
                              );
                            }}
                            interval={0}
                            height={50}
                          />
                          <YAxis
                            yAxisId="left"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                              fill: "#64748b",
                              fontSize: 10,
                            }}
                            tickFormatter={chartYAxisFormatter}
                            width={60}
                            domain={["auto", "auto"]}
                          />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                              fill: "#94a3b8",
                              fontSize: 10,
                            }}
                            tickFormatter={(value: number) => {
                              const pct = value * 100;
                              return `${pct > 0 ? "+" : ""}${pct.toFixed(0)}%`;
                            }}
                            width={50}
                            domain={["auto", "auto"]}
                          />
                          <ReferenceLine
                            yAxisId="left"
                            y={0}
                            stroke="#cbd5e1"
                            strokeWidth={1.5}
                          />
                          <ReferenceLine
                            yAxisId="right"
                            y={0}
                            stroke="#cbd5e1"
                            strokeDasharray="3 3"
                          />
                          <Tooltip
                            cursor={{ fill: "#f8fafc" }}
                            contentStyle={{
                              borderRadius: "8px",
                              border: "none",
                              boxShadow:
                                "0 4px 6px -1px rgba(0,0,0,0.1)",
                              fontSize: 12,
                            }}
                            formatter={(
                              value: number,
                              name: string,
                            ) => {
                              const metricId = chartMetricIds[0];
                              const config = metricId
                                ? METRIC_CONFIG[metricId]
                                : undefined;
                              if (name === "variation") {
                                const pct = value * 100;
                                const sign = pct > 0 ? "+" : "";
                                const fmtd =
                                  new Intl.NumberFormat(
                                    "pt-BR",
                                    {
                                      minimumFractionDigits: 1,
                                      maximumFractionDigits: 1,
                                    },
                                  ).format(Math.abs(pct));
                                return [
                                  `${pct < 0 ? "-" : sign}${fmtd}%`,
                                  "Variação %",
                                ];
                              }
                              const isP1 =
                                name === "p1" ||
                                name === "comp-bar-p1" ||
                                name === "comp-line-p1";
                              const label = isP1
                                ? compP1Label
                                : compP2Label;
                              if (!config)
                                return [String(value), label];
                              return [
                                formatMetricValue(
                                  value,
                                  config.format,
                                ),
                                label,
                              ];
                            }}
                          />
                          <Bar
                            key="comp-bar-p1"
                            yAxisId="left"
                            dataKey="bar_p1"
                            name="comp-bar-p1"
                            barSize={18}
                            hide={chartTypeMode !== "bar"}
                            shape={(props: any) => {
                              const {
                                x,
                                y,
                                width,
                                height,
                                value,
                              } = props;
                              if (!width || !height)
                                return <g />;
                              const isNeg = (value ?? 0) < 0;
                              const fill = isNeg
                                ? negativeBarColor("#94a3b8")
                                : "#94a3b8";
                              const r = Math.min(4, width / 2);
                              return (
                                <g>
                                  <rect
                                    x={x}
                                    y={y}
                                    width={width}
                                    height={Math.abs(height)}
                                    fill={fill}
                                    fillOpacity={
                                      isNeg ? 0.85 : 1
                                    }
                                    rx={r}
                                    ry={r}
                                  />
                                  {isNeg && (
                                    <rect
                                      x={x}
                                      y={y}
                                      width={width}
                                      height={Math.abs(height)}
                                      fill="none"
                                      stroke="#94a3b8"
                                      strokeWidth={1.5}
                                      strokeDasharray="4 2"
                                      rx={r}
                                      ry={r}
                                    />
                                  )}
                                </g>
                              );
                            }}
                          />
                          <Bar
                            key="comp-bar-p2"
                            yAxisId="left"
                            dataKey="bar_p2"
                            name="comp-bar-p2"
                            barSize={18}
                            hide={chartTypeMode !== "bar"}
                            shape={(props: any) => {
                              const {
                                x,
                                y,
                                width,
                                height,
                                value,
                              } = props;
                              if (!width || !height)
                                return <g />;
                              const isNeg = (value ?? 0) < 0;
                              const fill = isNeg
                                ? negativeBarColor("#6C63FF")
                                : "#6C63FF";
                              const r = Math.min(4, width / 2);
                              return (
                                <g>
                                  <rect
                                    x={x}
                                    y={y}
                                    width={width}
                                    height={Math.abs(height)}
                                    fill={fill}
                                    fillOpacity={
                                      isNeg ? 0.85 : 1
                                    }
                                    rx={r}
                                    ry={r}
                                  />
                                  {isNeg && (
                                    <rect
                                      x={x}
                                      y={y}
                                      width={width}
                                      height={Math.abs(height)}
                                      fill="none"
                                      stroke="#6C63FF"
                                      strokeWidth={1.5}
                                      strokeDasharray="4 2"
                                      rx={r}
                                      ry={r}
                                    />
                                  )}
                                </g>
                              );
                            }}
                          />
                          <Line
                            key="comp-line-p1"
                            yAxisId="left"
                            type="monotone"
                            dataKey="line_p1"
                            stroke="#94a3b8"
                            strokeWidth={2.5}
                            dot={{
                              r: 3,
                              fill: "white",
                              strokeWidth: 2,
                              stroke: "#94a3b8",
                            }}
                            activeDot={{
                              r: 5,
                              strokeWidth: 0,
                              fill: "#94a3b8",
                            }}
                            name="comp-line-p1"
                            hide={chartTypeMode !== "line"}
                          />
                          <Line
                            key="comp-line-p2"
                            yAxisId="left"
                            type="monotone"
                            dataKey="line_p2"
                            stroke="#6C63FF"
                            strokeWidth={2.5}
                            dot={{
                              r: 3,
                              fill: "white",
                              strokeWidth: 2,
                              stroke: "#6C63FF",
                            }}
                            activeDot={{
                              r: 5,
                              strokeWidth: 0,
                              fill: "#6C63FF",
                            }}
                            name="comp-line-p2"
                            hide={chartTypeMode !== "line"}
                          />
                          <Line
                            key="comp-line-variation"
                            yAxisId="right"
                            type="monotone"
                            dataKey="variation"
                            stroke="#F5A623"
                            strokeWidth={2}
                            strokeDasharray="6 3"
                            dot={{
                              r: 3,
                              fill: "#F5A623",
                              strokeWidth: 0,
                            }}
                            activeDot={{
                              r: 5,
                              strokeWidth: 0,
                              fill: "#F5A623",
                            }}
                            name="variation"
                          />
                        </ComposedChart>
                      ) : chartTypeMode === "line" ? (
                        <LineChart
                          data={chartData}
                          margin={{
                            top: 5,
                            right: 20,
                            left: 10,
                            bottom: 25,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f1f5f9"
                          />
                          <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={(props: any) => {
                              const { x, y, payload } = props;
                              const label = payload.value || "";
                              const truncated =
                                label.length > 12
                                  ? label.slice(0, 12) +
                                    "\u2026"
                                  : label;
                              return (
                                <g
                                  transform={`translate(${x},${y})`}
                                >
                                  <text
                                    x={0}
                                    y={0}
                                    dy={8}
                                    textAnchor="end"
                                    fill="#64748b"
                                    fontSize={10}
                                    transform="rotate(-45)"
                                  >
                                    {truncated}
                                  </text>
                                </g>
                              );
                            }}
                            interval={0}
                            height={50}
                          />
                          <YAxis
                            yAxisId="left"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                              fill: "#64748b",
                              fontSize: 10,
                            }}
                            tickFormatter={chartYAxisFormatter}
                            width={60}
                            domain={["auto", "auto"]}
                          />
                          {chartNeedsSecondaryAxis &&
                            chartMetricIds.length > 1 && (
                              <YAxis
                                yAxisId="right"
                                orientation="right"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                  fill: "#94a3b8",
                                  fontSize: 10,
                                }}
                                tickFormatter={(
                                  value: number,
                                ) => {
                                  const secondMetric =
                                    chartMetricIds.find(
                                      (id, i) =>
                                        i > 0 &&
                                        METRIC_CONFIG[id]
                                          ?.format !==
                                          METRIC_CONFIG[
                                            chartMetricIds[0]
                                          ]?.format,
                                    ) || chartMetricIds[1];
                                  const config =
                                    METRIC_CONFIG[secondMetric];
                                  if (!config)
                                    return String(value);
                                  if (
                                    config.format === "percent" ||
                                    config.format === "percent1" ||
                                    config.format === "percent0"
                                  ) {
                                    const f =
                                      config.format === "percent0"
                                        ? 0
                                        : 1;
                                    return new Intl.NumberFormat(
                                      "pt-BR",
                                      {
                                        style: "percent",
                                        minimumFractionDigits: f,
                                        maximumFractionDigits: f,
                                      },
                                    ).format(value);
                                  }
                                  if (config.format === "days")
                                    return `${value}d`;
                                  if (
                                    Math.abs(value) >= 1_000_000
                                  )
                                    return `${(value / 1_000_000).toFixed(1)}M`;
                                  if (Math.abs(value) >= 1_000)
                                    return `${(value / 1_000).toFixed(0)}K`;
                                  return new Intl.NumberFormat(
                                    "pt-BR",
                                    {
                                      maximumFractionDigits: 0,
                                    },
                                  ).format(value);
                                }}
                                width={60}
                                domain={["auto", "auto"]}
                              />
                            )}
                          <ReferenceLine
                            yAxisId="left"
                            y={0}
                            stroke="#cbd5e1"
                            strokeWidth={1.5}
                          />
                          <Tooltip
                            cursor={{
                              stroke: "#e2e8f0",
                              strokeWidth: 1,
                            }}
                            contentStyle={{
                              borderRadius: "8px",
                              border: "none",
                              boxShadow:
                                "0 4px 6px -1px rgba(0,0,0,0.1)",
                              fontSize: 12,
                            }}
                            formatter={
                              chartTooltipFormatterMulti
                            }
                          />
                          {[...new Set(chartMetricIds)].map(
                            (mId, idx) => {
                              const chartColors = [
                                "#6C63FF",
                                "#F5A623",
                              ];
                              const color =
                                chartColors[idx] ||
                                chartColors[0];
                              const useRight =
                                chartNeedsSecondaryAxis &&
                                idx > 0 &&
                                METRIC_CONFIG[mId]?.format !==
                                  METRIC_CONFIG[
                                    chartMetricIds[0]
                                  ]?.format;
                              return (
                                <Line
                                  key={`std-line-${mId}-${idx}`}
                                  type="monotone"
                                  dataKey={mId}
                                  yAxisId={
                                    useRight ? "right" : "left"
                                  }
                                  stroke={color}
                                  strokeWidth={2.5}
                                  dot={{
                                    r: 3,
                                    fill: "white",
                                    strokeWidth: 2,
                                    stroke: color,
                                  }}
                                  activeDot={{
                                    r: 5,
                                    strokeWidth: 0,
                                    fill: color,
                                  }}
                                  name={mId}
                                />
                              );
                            },
                          )}
                        </LineChart>
                      ) : (
                        <BarChart
                          data={chartData}
                          margin={{
                            top: 5,
                            right: 20,
                            left: 10,
                            bottom: 25,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f1f5f9"
                          />
                          <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={(props: any) => {
                              const { x, y, payload } = props;
                              const label = payload.value || "";
                              const truncated =
                                label.length > 12
                                  ? label.slice(0, 12) +
                                    "\u2026"
                                  : label;
                              return (
                                <g
                                  transform={`translate(${x},${y})`}
                                >
                                  <text
                                    x={0}
                                    y={0}
                                    dy={8}
                                    textAnchor="end"
                                    fill="#64748b"
                                    fontSize={10}
                                    transform="rotate(-45)"
                                  >
                                    {truncated}
                                  </text>
                                </g>
                              );
                            }}
                            interval={0}
                            height={50}
                          />
                          <YAxis
                            yAxisId="left"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                              fill: "#64748b",
                              fontSize: 10,
                            }}
                            tickFormatter={chartYAxisFormatter}
                            width={60}
                            domain={["auto", "auto"]}
                          />
                          {chartNeedsSecondaryAxis &&
                            chartMetricIds.length > 1 && (
                              <YAxis
                                yAxisId="right"
                                orientation="right"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                  fill: "#94a3b8",
                                  fontSize: 10,
                                }}
                                tickFormatter={(
                                  value: number,
                                ) => {
                                  const secondMetric =
                                    chartMetricIds.find(
                                      (id, i) =>
                                        i > 0 &&
                                        METRIC_CONFIG[id]
                                          ?.format !==
                                          METRIC_CONFIG[
                                            chartMetricIds[0]
                                          ]?.format,
                                    ) || chartMetricIds[1];
                                  const config =
                                    METRIC_CONFIG[secondMetric];
                                  if (!config)
                                    return String(value);
                                  if (
                                    config.format === "percent" ||
                                    config.format === "percent1" ||
                                    config.format === "percent0"
                                  ) {
                                    const f =
                                      config.format === "percent0"
                                        ? 0
                                        : 1;
                                    return new Intl.NumberFormat(
                                      "pt-BR",
                                      {
                                        style: "percent",
                                        minimumFractionDigits: f,
                                        maximumFractionDigits: f,
                                      },
                                    ).format(value);
                                  }
                                  if (config.format === "days")
                                    return `${value}d`;
                                  if (
                                    Math.abs(value) >= 1_000_000
                                  )
                                    return `${(value / 1_000_000).toFixed(1)}M`;
                                  if (Math.abs(value) >= 1_000)
                                    return `${(value / 1_000).toFixed(0)}K`;
                                  return new Intl.NumberFormat(
                                    "pt-BR",
                                    {
                                      maximumFractionDigits: 0,
                                    },
                                  ).format(value);
                                }}
                                width={60}
                                domain={["auto", "auto"]}
                              />
                            )}
                          <ReferenceLine
                            yAxisId="left"
                            y={0}
                            stroke="#cbd5e1"
                            strokeWidth={1.5}
                          />
                          <Tooltip
                            cursor={{ fill: "#f8fafc" }}
                            contentStyle={{
                              borderRadius: "8px",
                              border: "none",
                              boxShadow:
                                "0 4px 6px -1px rgba(0,0,0,0.1)",
                              fontSize: 12,
                            }}
                            formatter={
                              chartTooltipFormatterMulti
                            }
                          />
                          {[...new Set(chartMetricIds)].map(
                            (mId, idx) => {
                              const chartColors = [
                                "#6C63FF",
                                "#F5A623",
                              ];
                              const color =
                                chartColors[idx] ||
                                chartColors[0];
                              const mutedColor =
                                negativeBarColor(color);
                              const useRight =
                                chartNeedsSecondaryAxis &&
                                idx > 0 &&
                                METRIC_CONFIG[mId]?.format !==
                                  METRIC_CONFIG[
                                    chartMetricIds[0]
                                  ]?.format;
                              return (
                                <Bar
                                  key={`std-bar-${mId}-${idx}`}
                                  dataKey={mId}
                                  yAxisId={
                                    useRight ? "right" : "left"
                                  }
                                  name={mId}
                                  shape={(props: any) => {
                                    const {
                                      x,
                                      y,
                                      width,
                                      height,
                                      value,
                                    } = props;
                                    if (!width || !height)
                                      return <g />;
                                    const isNeg =
                                      (value ?? 0) < 0;
                                    const fill = isNeg
                                      ? mutedColor
                                      : color;
                                    const r = Math.min(
                                      4,
                                      width / 2,
                                    );
                                    return (
                                      <g>
                                        <rect
                                          x={x}
                                          y={y}
                                          width={width}
                                          height={Math.abs(
                                            height,
                                          )}
                                          fill={fill}
                                          fillOpacity={
                                            isNeg ? 0.85 : 1
                                          }
                                          rx={r}
                                          ry={r}
                                        />
                                        {isNeg && (
                                          <rect
                                            x={x}
                                            y={y}
                                            width={width}
                                            height={Math.abs(
                                              height,
                                            )}
                                            fill="none"
                                            stroke={color}
                                            strokeWidth={1.5}
                                            strokeDasharray="4 2"
                                            rx={r}
                                            ry={r}
                                          />
                                        )}
                                      </g>
                                    );
                                  }}
                                />
                              );
                            },
                          )}
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
              {/* end chartContainerRef */}

              {/* ── Chart Footer (unified) ── */}
              {(() => {
                const isTemporal =
                  analysisMode === "evolucao" && isPivot;
                // Temporal pagination vars
                const tStart =
                  temporalSafeCurrentPage * temporalLimit;
                const tEnd = Math.min(
                  tStart + temporalLimit,
                  temporalSortedRows.length,
                );
                const tTotal = temporalSortedRows.length;
                // Period pagination vars
                const pStart =
                  periodSafeCurrentPage * periodPageSize;
                const pEnd = Math.min(
                  pStart + periodPageSize,
                  periods.length,
                );
                const pTotal = periods.length;

                /* ─── Reusable pagination section builder ─── */
                const PaginationSection = ({
                  icon,
                  title,
                  rangeStart,
                  rangeEnd,
                  total,
                  pageSizeOptions,
                  currentPageSize,
                  onPageSizeChange,
                  currentPage,
                  totalPages,
                  onPageChange,
                }: {
                  icon: React.ReactNode;
                  title: string;
                  rangeStart: number;
                  rangeEnd: number;
                  total: number;
                  pageSizeOptions: number[];
                  currentPageSize: number;
                  onPageSizeChange: (n: number) => void;
                  currentPage: number;
                  totalPages: number;
                  onPageChange: (p: number) => void;
                }) => (
                  <div className="flex items-center justify-between gap-3 min-w-0">
                    {/* Left: icon + title + range */}
                    <div className="flex items-center gap-2 min-w-0 shrink-0">
                      <span className="flex items-center gap-1.5 text-[#90a1b9]">
                        {icon}
                        <span className="whitespace-nowrap text-[12px] font-bold text-[#45556c]">
                          {title}
                        </span>
                      </span>
                      <span className="tabular-nums text-[#90a1b9] whitespace-nowrap">
                        {rangeStart}–{rangeEnd} de {total}
                      </span>
                    </div>
                    {/* Right: page size + navigation */}
                    <div className="flex items-center gap-2 shrink-0">
                      {pageSizeOptions.map((n) => (
                        <button
                          key={n}
                          onClick={() => onPageSizeChange(n)}
                          className={cn(
                            "min-w-[28px] h-[26px] rounded-md px-1.5 text-[12px] transition-colors cursor-pointer tabular-nums",
                            currentPageSize === n
                              ? "bg-[#314158] text-white font-bold"
                              : "text-[#90a1b9] hover:bg-slate-100",
                          )}
                        >
                          {n}
                        </button>
                      ))}
                      <div className="w-px h-4 bg-slate-200 mx-0.5" />
                      <button
                        onClick={() =>
                          onPageChange(
                            Math.max(0, currentPage - 1),
                          )
                        }
                        disabled={currentPage === 0}
                        className={cn(
                          "p-0.5 rounded transition-colors cursor-pointer",
                          currentPage === 0
                            ? "text-slate-300 cursor-not-allowed"
                            : "text-[#90a1b9] hover:bg-slate-100",
                        )}
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <span className="text-[#90a1b9] tabular-nums text-[11px] px-0.5 whitespace-nowrap">
                        {currentPage + 1} / {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          onPageChange(
                            Math.min(
                              totalPages - 1,
                              currentPage + 1,
                            ),
                          )
                        }
                        disabled={currentPage >= totalPages - 1}
                        className={cn(
                          "p-0.5 rounded transition-colors cursor-pointer",
                          currentPage >= totalPages - 1
                            ? "text-slate-300 cursor-not-allowed"
                            : "text-[#90a1b9] hover:bg-slate-100",
                        )}
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                );

                return (
                  <div
                    className="flex-none bg-white text-[11px] select-none -mx-4 -mb-4 rounded-b-[14px]"
                    style={{
                      ...bc("#e2e8f0"),
                      borderTopWidth: 1,
                      borderTopStyle: "solid",
                    }}
                  >
                    {isTemporal ? (
                      /* ═══ TEMPORAL FOOTER: two sections side-by-side ═══ */
                      <div className="flex items-stretch">
                        {/* Left: Paginação de Períodos */}
                        <div className="flex-1 px-4 py-2.5 min-w-0">
                          <PaginationSection
                            icon={<CalendarIcon size={12} />}
                            title="Períodos"
                            rangeStart={pStart + 1}
                            rangeEnd={pEnd}
                            total={pTotal}
                            pageSizeOptions={[7, 12, 15, 31]}
                            currentPageSize={periodPageSize}
                            onPageSizeChange={(n) => {
                              setPeriodPageSize(n);
                              setPeriodCurrentPage(0);
                            }}
                            currentPage={periodSafeCurrentPage}
                            totalPages={periodTotalPages}
                            onPageChange={setPeriodCurrentPage}
                          />
                        </div>
                        {/* Vertical divider */}
                        <div className="w-px bg-[#e2e8f0] my-2" />
                        {/* Right: Paginação de Atributos */}
                        <div className="flex-1 px-4 py-2.5 min-w-0">
                          <PaginationSection
                            icon={<Layers size={12} />}
                            title="Atributos"
                            rangeStart={tStart + 1}
                            rangeEnd={tEnd}
                            total={tTotal}
                            pageSizeOptions={[5, 10, 15]}
                            currentPageSize={temporalLimit}
                            onPageSizeChange={(n) => {
                              setTemporalLimit(n);
                              setTemporalCurrentPage(0);
                              setTemporalHiddenItems(new Set());
                            }}
                            currentPage={
                              temporalSafeCurrentPage
                            }
                            totalPages={temporalTotalPages}
                            onPageChange={(p) => {
                              setTemporalCurrentPage(p);
                              setTemporalHiddenItems(new Set());
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      /* ═══ NON-TEMPORAL FOOTER: pagination ═══ */
                      <div className="px-4 py-2.5">
                        <PaginationSection
                          icon={<Layers size={12} />}
                          title="Atributos"
                          rangeStart={
                            chartSafeCurrentPage *
                              chartPageSize +
                            1
                          }
                          rangeEnd={Math.min(
                            (chartSafeCurrentPage + 1) *
                              chartPageSize,
                            chartSortedRows.length,
                          )}
                          total={chartSortedRows.length}
                          pageSizeOptions={[5, 10, 15]}
                          currentPageSize={chartPageSize}
                          onPageSizeChange={(n) => {
                            setChartPageSize(n);
                            setChartCurrentPage(0);
                          }}
                          currentPage={chartSafeCurrentPage}
                          totalPages={chartTotalPages}
                          onPageChange={setChartCurrentPage}
                        />
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════ TABELA Section ═══════════════ */}
      <div
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[14px]"
        style={{
          borderWidth: 1,
          borderStyle: "solid",
          borderBottomWidth: 0,
          ...bc("#d5dbe3"),
          boxShadow:
            "0px 1px 4px 0px rgba(0,0,0,0.07), 0px 1px 2px -1px rgba(0,0,0,0.05)",
        }}
      >
        {showTable && (
          <div className="flex min-h-0 flex-1 flex-col" ref={tableContainerRef}>
            <div
              className="relative flex min-h-0 flex-1 flex-col"
            >
              {/* Scroll shadow indicators */}
              {scrollShadows.right && (
                <div
                  className="absolute right-0 top-0 bottom-0 w-6 pointer-events-none z-[20]"
                  style={{
                    background:
                      "linear-gradient(to left, rgba(0,0,0,0.06), transparent)",
                  }}
                />
              )}
              <div
                ref={scrollContainerRef}
                className="relative flex min-h-0 flex-1 flex-col items-start overflow-x-auto overflow-y-auto"
                style={{ backgroundColor: NEUTRAL_PALETTE.background }}
              >
                <TableHatchSurface>
                {/* ─── PIVOT TABLE ─── */}
                {isPivot ? (
                  <table
                    className={ANALYSIS_TABLE_CLASS}
                    style={ANALYSIS_TABLE_STYLE}
                  >
                    <colgroup>
                      <col
                        style={{
                          width:
                            columnWidths["grouping"] || 350,
                        }}
                      />
                      {analysisMode === "comparativo"
                        ? orderedMetrics.map((mId: string) => {
                            const cols: React.ReactNode[] = [];
                            const canShowPct =
                              showSharePct &&
                              !PCT_EXCLUDED_METRICS.has(mId);

                            periods.forEach((p, pIdx) => {
                              cols.push(
                                <col
                                  key={`${mId}__p${pIdx}`}
                                  style={{
                                    width:
                                      getPivotMetricWidth(mId),
                                  }}
                                />,
                              );
                              if (showAverage) {
                                cols.push(
                                  <col
                                    key={`${mId}__p${pIdx}__avg`}
                                    style={{
                                      width: AVG_COL_WIDTH,
                                    }}
                                  />,
                                );
                              }
                              if (canShowPct) {
                                cols.push(
                                  <col
                                    key={`${mId}__p${pIdx}__pct`}
                                    style={{
                                      width: PCT_COL_WIDTH,
                                    }}
                                  />,
                                );
                              }
                            });
                            if (hasVariation) {
                              cols.push(
                                <col
                                  key={`${mId}__var`}
                                  style={{
                                    width:
                                      getPivotMetricWidth(mId),
                                  }}
                                />,
                              );
                              cols.push(
                                <col
                                  key={`${mId}__growth`}
                                  style={{
                                    width:
                                      getPivotMetricWidth(mId),
                                  }}
                                />,
                              );
                            }
                            return cols;
                          })
                        : isPeriodFirstPivot
                          ? [
                              ...periods.flatMap((p) =>
                                orderedMetrics.flatMap((mId) => {
                                  const canShowPctE =
                                    showSharePct &&
                                    !PCT_EXCLUDED_METRICS.has(mId);
                                  const out: React.ReactNode[] = [];
                                  out.push(
                                    <col
                                      key={`evpf__${p}__${mId}`}
                                      style={{
                                        width:
                                          getPivotMetricWidth(mId),
                                      }}
                                    />,
                                  );
                                  if (showAverage) {
                                    out.push(
                                      <col
                                        key={`evpf__${p}__${mId}__avg`}
                                        style={{
                                          width: AVG_COL_WIDTH,
                                        }}
                                      />,
                                    );
                                  }
                                  if (canShowPctE) {
                                    out.push(
                                      <col
                                        key={`evpf__${p}__${mId}__pct`}
                                        style={{
                                          width: PCT_COL_WIDTH,
                                        }}
                                      />,
                                    );
                                  }
                                  return out;
                                }),
                              ),
                              ...orderedMetrics.flatMap((mId) => {
                                const canShowPctE =
                                  showSharePct &&
                                  !PCT_EXCLUDED_METRICS.has(mId);
                                const out: React.ReactNode[] = [];
                                out.push(
                                  <col
                                    key={`evpf__tot__${mId}`}
                                    style={{
                                      width: getPivotTotalWidth(mId),
                                    }}
                                  />,
                                );
                                if (showAverage) {
                                  out.push(
                                    <col
                                      key={`evpf__tot__${mId}__avg`}
                                      style={{ width: AVG_COL_WIDTH }}
                                    />,
                                  );
                                }
                                if (canShowPctE) {
                                  out.push(
                                    <col
                                      key={`evpf__tot__${mId}__pct`}
                                      style={{ width: PCT_COL_WIDTH }}
                                    />,
                                  );
                                }
                                return out;
                              }),
                            ]
                          : orderedMetrics.map((mId: string) => {
                              const cols: React.ReactNode[] = [];
                              const canShowPct =
                                showSharePct &&
                                !PCT_EXCLUDED_METRICS.has(mId);

                              periods.forEach((p) => {
                                cols.push(
                                  <col
                                    key={`${mId}__${p}`}
                                    style={{
                                      width:
                                        getPivotMetricWidth(mId),
                                    }}
                                  />,
                                );
                                if (showAverage) {
                                  cols.push(
                                    <col
                                      key={`${mId}__${p}__avg`}
                                      style={{
                                        width: AVG_COL_WIDTH,
                                      }}
                                    />,
                                  );
                                }
                                if (canShowPct) {
                                  cols.push(
                                    <col
                                      key={`${mId}__${p}__pct`}
                                      style={{
                                        width: PCT_COL_WIDTH,
                                      }}
                                    />,
                                  );
                                }
                              });
                              cols.push(
                                <col
                                  key={`${mId}__total`}
                                  style={{
                                    width: getPivotTotalWidth(mId),
                                  }}
                                />,
                              );
                              if (showAverage) {
                                cols.push(
                                  <col
                                    key={`${mId}__total__avg`}
                                    style={{ width: AVG_COL_WIDTH }}
                                  />,
                                );
                              }
                              if (canShowPct) {
                                cols.push(
                                  <col
                                    key={`${mId}__total__pct`}
                                    style={{ width: PCT_COL_WIDTH }}
                                  />,
                                );
                              }
                              return cols;
                            })}
                    </colgroup>

                    <thead className="z-[40]">
                      {/* HEADER ROW 1: Metric groups (metric-first pivot) */}
                      <tr>
                        <th
                          rowSpan={2}
                          style={{
                            width:
                              columnWidths["grouping"] || 350,
                            ...bc("#e2e8f0"),
                            borderTopWidth: 0,
                            borderLeftWidth: 0,
                            backgroundColor: TABLE_HEADER_BG,
                            color: TABLE_HEADER_TEXT,
                            borderBottomWidth: 2,
                            borderBottomStyle: "solid",
                            borderBottomColor: "rgba(241, 241, 241, 0.25)",
                            borderRightWidth: 1,
                            borderRightStyle: "solid",
                            boxShadow:
                              "1px 0 0 0 rgba(148,163,184,0.18), 6px 0 16px -4px rgba(0,0,0,0.08), 2px 0 6px -2px rgba(0,0,0,0.05)",
                            ...stickyPivotHeaderCornerStyle(),
                          }}
                          className="relative px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider select-none"
                        >
                          <div
                            className="group flex cursor-pointer items-center gap-2 overflow-hidden pr-1 transition-colors hover:opacity-90"
                            onClick={() =>
                              handleSort(ANALYSIS_ATTRIBUTE_SORT_KEY)
                            }
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleSort(ANALYSIS_ATTRIBUTE_SORT_KEY);
                              }
                            }}
                          >
                            <span className="min-w-0 flex-1 truncate text-[14px]">
                              {groupingLabel}
                            </span>
                            <span className="shrink-0">
                              {renderSortIndicator(
                                ANALYSIS_ATTRIBUTE_SORT_KEY,
                              )}
                            </span>
                          </div>
                          <div
                            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-[#314158]/40 active:bg-[#314158] transition-colors z-[60]"
                            onMouseDown={(e) =>
                              handleMouseDown(e, "grouping")
                            }
                          />
                        </th>
                        {!isPeriodFirstPivot ? (
                          orderedMetrics.map(
                            (mId: string, mIdx: number) => {
                              const metric = METRICS_LIST.find(
                                (m) => m.id === mId,
                              );
                              const abbrev =
                                METRIC_ABBREVIATIONS[mId] ||
                                getMetricTableLabel(mId, metric?.label) ||
                                mId;
                              const isLastMetric =
                                mIdx ===
                                orderedMetrics.length - 1;
                              return (
                                <MetricColumnHeaderTooltip
                                  key={`metric_group__${mId}`}
                                  metricId={mId}
                                  metric={metric}
                                  colSpan={getSubColsForMetric(mId)}
                                      className="px-3 py-2.5 text-center text-[13px] font-bold uppercase tracking-wide select-none"
                                      style={{
                                        backgroundColor:
                                          TABLE_HEADER_BG,
                                        color: TABLE_HEADER_TEXT,
                                        borderBottomWidth: 1,
                                        borderBottomStyle:
                                          "solid",
                                        borderBottomColor:
                                          "rgba(241, 241, 241, 0.25)",
                                        ...stickyPivotHeaderRow1Style(),
                                        ...(!isLastMetric
                                          ? {
                                              borderRightWidth: 2,
                                              borderRightStyle:
                                                "dotted",
                                              borderRightColor:
                                                "#94a3b8",
                                            }
                                          : {}),
                                      }}
                                    >
                                  <div className="flex items-center justify-center gap-1.5 text-[13px]">
                                    {abbrev}
                                  </div>
                                </MetricColumnHeaderTooltip>
                              );
                            },
                          )
                        ) : (
                          <>
                            {periods.map((period, pIdx) => {
                              const isLastPeriod =
                                pIdx === periods.length - 1;
                              return (
                                <th
                                  key={`evo_pf_r1_p_${pIdx}`}
                                  colSpan={getSubColsForPeriodBlock()}
                                  className="px-3 py-2.5 text-center text-[13px] font-bold uppercase tracking-wide select-none"
                                  style={{
                                    backgroundColor: TABLE_HEADER_BG,
                                    color: TABLE_HEADER_TEXT,
                                    borderBottomWidth: 1,
                                    borderBottomStyle: "solid",
                                    borderBottomColor:
                                      "rgba(241, 241, 241, 0.25)",
                                    ...stickyPivotHeaderRow1Style(),
                                    ...(!isLastPeriod
                                      ? {
                                          borderRightWidth: 2,
                                          borderRightStyle: "dotted",
                                          borderRightColor: "#94a3b8",
                                        }
                                      : {}),
                                  }}
                                >
                                  {shortPeriodLabel(period)}
                                </th>
                              );
                            })}
                            <th
                              key="evo_pf_r1_total"
                              colSpan={getSubColsForPeriodBlock()}
                              className="px-3 py-2.5 text-center text-[13px] font-bold uppercase tracking-wide select-none"
                              style={{
                                backgroundColor: TABLE_HEADER_BG,
                                color: TABLE_HEADER_TEXT,
                                borderBottomWidth: 1,
                                borderBottomStyle: "solid",
                                borderBottomColor:
                                  "rgba(241, 241, 241, 0.25)",
                                ...stickyPivotHeaderRow1Style(),
                              }}
                            >
                              Total
                            </th>
                          </>
                        )}
                      </tr>

                      {/* HEADER ROW 2: Period/derived sub-headers under each metric */}
                      <tr>
                        {!isPeriodFirstPivot ? (
                          orderedMetrics.map(
                            (mId: string, mIdx: number) => {
                            const isLastMetric =
                              mIdx ===
                              orderedMetrics.length - 1;
                            const subHeaders: React.ReactNode[] =
                              [];
                            const isComp =
                              analysisMode === "comparativo";

                            if (isComp) {
                              // Comparative: Period 1, Period 2, Var Vlr, Var %
                              const canShowPct =
                                showSharePct &&
                                !PCT_EXCLUDED_METRICS.has(mId);
                              periods.forEach(
                                (period, pIdx) => {
                                  const isLastPeriod =
                                    pIdx === periods.length - 1;
                                  const periodSortKey = `${period}__${mId}`;

                                  // Coluna do valor do período
                                  subHeaders.push(
                                    <th
                                      key={`${mId}__p${pIdx}`}
                                      className="px-2 py-2 text-right font-bold uppercase tracking-wider select-none whitespace-nowrap text-[12px] cursor-pointer group hover:brightness-95 transition-colors"
                                      onClick={() => handleSort(periodSortKey)}
                                      style={{
                                        ...stickyPivotHeaderRow2Style(),
                                        backgroundColor:
                                          PIVOT_DERIVED_HEADER_BG,
                                        color:
                                          PIVOT_DERIVED_HEADER_TEXT,
                                        width:
                                          getPivotMetricWidth(
                                            mId,
                                          ),
                                        borderBottomWidth: 2,
                                        borderBottomStyle:
                                          "solid",
                                        borderBottomColor:
                                          "#e2e8f0",
                                        // Borda leve: só se NÃO tiver Add% E (não for último período OU tiver variação)
                                        ...(!canShowPct &&
                                        (!isLastPeriod ||
                                          hasVariation)
                                          ? {
                                              borderRightWidth: 1,
                                              borderRightStyle:
                                                "dotted",
                                              borderRightColor:
                                                "#cbd5e1",
                                            }
                                          : {}),
                                      }}
                                    >
                                      <div className="flex items-center justify-end gap-2">
                                        <Popover.Root>
                                          <Popover.Trigger
                                            asChild
                                          >
                                            <div
                                              className="flex items-center gap-1 cursor-pointer hover:text-slate-700 transition-colors justify-end"
                                              onClick={(event) => event.stopPropagation()}
                                            >
                                              <CalendarIcon
                                                size={10}
                                                className="shrink-0 opacity-50"
                                              />
                                              <span>
                                                {period}
                                              </span>
                                            </div>
                                          </Popover.Trigger>
                                        <Popover.Portal>
                                          <Popover.Content
                                            className="z-50 bg-white p-4 rounded-lg shadow-xl border border-slate-200 w-[260px] animate-in zoom-in-95"
                                            sideOffset={5}
                                            align="start"
                                          >
                                            <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2">
                                              <CalendarIcon
                                                size={12}
                                                className="text-slate-400"
                                              />
                                              Período {pIdx + 1}
                                            </h4>
                                            <div className="max-h-[200px] overflow-y-auto custom-scrollbar space-y-0.5">
                                              {compPeriodDetailItems(
                                                (pIdx + 1) as
                                                  | 1
                                                  | 2,
                                              ).map(
                                                (
                                                  item: string,
                                                  idx: number,
                                                ) => (
                                                  <div
                                                    key={idx}
                                                    className="text-xs text-slate-600 py-1.5 border-b border-slate-50 last:border-0 flex items-start gap-2"
                                                  >
                                                    <div
                                                      className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${pIdx === 0 ? "bg-[#314158]" : "bg-[#45556c]"}`}
                                                    />
                                                    {item}
                                                  </div>
                                                ),
                                              )}
                                            </div>
                                            <Popover.Arrow className="fill-white" />
                                          </Popover.Content>
                                          </Popover.Portal>
                                        </Popover.Root>
                                        <span className="shrink-0 text-slate-900">
                                          {renderSortIndicator(periodSortKey)}
                                        </span>
                                      </div>
                                    </th>,
                                  );

                                  // Coluna de média (se Add x̄ estiver ativo)
                                  if (showAverage) {
                                    subHeaders.push(
                                      <th
                                        key={`${mId}__p${pIdx}__avg`}
                                        className="px-2 py-2 text-right font-bold uppercase tracking-wider select-none whitespace-nowrap text-[11px]"
                                        style={{
                                          ...stickyPivotHeaderRow2Style(),
                                          backgroundColor:
                                            PIVOT_DERIVED_HEADER_BG,
                                          color:
                                            PIVOT_DERIVED_HEADER_TEXT,
                                          width: AVG_COL_WIDTH,
                                          borderBottomWidth: 2,
                                          borderBottomStyle:
                                            "solid",
                                          borderBottomColor:
                                            "#e2e8f0",
                                          // Borda leve após média
                                          ...(!canShowPct &&
                                          (!isLastPeriod ||
                                            hasVariation)
                                            ? {
                                                borderRightWidth: 1,
                                                borderRightStyle:
                                                  "dotted",
                                                borderRightColor:
                                                  "#cbd5e1",
                                              }
                                            : {}),
                                        }}
                                      >
                                        {`x̄ ${averagePeriodType}`}
                                      </th>,
                                    );
                                  }

                                  // Coluna % (se Add% estiver ativo)
                                  if (canShowPct) {
                                    subHeaders.push(
                                      <th
                                        key={`${mId}__p${pIdx}__pct`}
                                        className="px-2 py-2 text-center font-bold uppercase tracking-wider select-none whitespace-nowrap text-[12px]"
                                        style={{
                                          ...stickyPivotHeaderRow2Style(),
                                          backgroundColor:
                                            PIVOT_DERIVED_HEADER_BG,
                                          color:
                                            PIVOT_DERIVED_HEADER_TEXT,
                                          width: PCT_COL_WIDTH,
                                          borderBottomWidth: 2,
                                          borderBottomStyle:
                                            "solid",
                                          borderBottomColor:
                                            "#e2e8f0",
                                          // Borda leve após o % (separa dados diferentes)
                                          ...(!isLastPeriod ||
                                          (isLastPeriod &&
                                            hasVariation)
                                            ? {
                                                borderRightWidth: 1,
                                                borderRightStyle:
                                                  "dotted",
                                                borderRightColor:
                                                  "#cbd5e1",
                                              }
                                            : {}),
                                          // Borda forte após o último % se não tiver variação E não for a última métrica
                                          ...(isLastPeriod &&
                                          !hasVariation &&
                                          !isLastMetric
                                            ? {
                                                borderRightWidth: 2,
                                                borderRightStyle:
                                                  "dotted",
                                                borderRightColor:
                                                  "#94a3b8",
                                              }
                                            : {}),
                                        }}
                                      >
                                        %
                                      </th>,
                                    );
                                  }
                                },
                              );
                              if (hasVariation) {
                                const variationValueSortKey = `__diff__${mId}`;
                                const variationPctSortKey = `__growth__${mId}`;
                                subHeaders.push(
                                  <th
                                    key={`${mId}__var`}
                                    className="px-2 py-2 text-right font-bold uppercase tracking-wider select-none whitespace-nowrap text-[12px] cursor-pointer group hover:brightness-95 transition-colors"
                                    onClick={() => handleSort(variationValueSortKey)}
                                    style={{
                                      ...stickyPivotHeaderRow2Style(),
                                      backgroundColor:
                                        PIVOT_DERIVED_HEADER_BG,
                                      color:
                                        PIVOT_DERIVED_HEADER_TEXT,
                                      width:
                                        getPivotMetricWidth(
                                          mId,
                                        ),
                                      borderBottomWidth: 2,
                                      borderBottomStyle:
                                        "solid",
                                      borderBottomColor:
                                        "#e2e8f0",
                                      // Borda leve: sempre presente entre VAR VLR e VAR %
                                      borderRightWidth: 1,
                                      borderRightStyle:
                                        "dotted",
                                      borderRightColor:
                                        "#cbd5e1",
                                    }}
                                  >
                                    <div className="flex items-center justify-end gap-2">
                                      <span>Var Vlr</span>
                                      <span className="shrink-0 text-slate-900">
                                        {renderSortIndicator(variationValueSortKey)}
                                      </span>
                                    </div>
                                  </th>,
                                );
                                subHeaders.push(
                                  <th
                                    key={`${mId}__growth`}
                                    className={cn(
                                      "px-2 py-2 text-right font-bold uppercase tracking-wider select-none whitespace-nowrap text-[12px] cursor-pointer group hover:brightness-95 transition-colors",
                                    )}
                                    onClick={() => handleSort(variationPctSortKey)}
                                    style={{
                                      ...stickyPivotHeaderRow2Style(),
                                      backgroundColor:
                                        PIVOT_DERIVED_HEADER_BG,
                                      color:
                                        PIVOT_DERIVED_HEADER_TEXT,
                                      width:
                                        getPivotMetricWidth(
                                          mId,
                                        ),
                                      borderBottomWidth: 2,
                                      borderBottomStyle:
                                        "solid",
                                      borderBottomColor:
                                        "#e2e8f0",
                                      ...(!isLastMetric
                                        ? {
                                            borderRightWidth: 2,
                                            borderRightStyle:
                                              "dotted",
                                            borderRightColor:
                                              "#94a3b8",
                                          }
                                        : {}),
                                    }}
                                  >
                                    <div className="flex items-center justify-end gap-2">
                                      <span>Var %</span>
                                      <span className="shrink-0 text-slate-900">
                                        {renderSortIndicator(variationPctSortKey)}
                                      </span>
                                    </div>
                                  </th>,
                                );
                              }
                            } else {
                              // Evolutionary & Intraday: each period + Total
                              const canShowPct =
                                showSharePct &&
                                !PCT_EXCLUDED_METRICS.has(mId);

                              periods.forEach(
                                (period, pIdx) => {
                                  const isLastPeriod =
                                    pIdx === periods.length - 1;
                                  const periodSortKey = `${period}__${mId}`;

                                  // Coluna do valor do período
                                  subHeaders.push(
                                    <th
                                      key={`${mId}__${period}`}
                                      className="px-2 pr-3 py-2 text-right font-bold uppercase tracking-wider select-none whitespace-nowrap text-[12px] cursor-pointer group hover:brightness-95 transition-colors"
                                      onClick={() => handleSort(periodSortKey)}
                                      style={{
                                        ...stickyPivotHeaderRow2Style(),
                                        backgroundColor:
                                          PIVOT_DERIVED_HEADER_BG,
                                        color:
                                          PIVOT_DERIVED_HEADER_TEXT,
                                        width:
                                          getPivotMetricWidth(
                                            mId,
                                          ),
                                        borderBottomWidth: 2,
                                        borderBottomStyle:
                                          "solid",
                                        borderBottomColor:
                                          "#e2e8f0",
                                        // Borda leve entre períodos da mesma métrica (exceto se tiver Add%)
                                        ...(!isLastPeriod &&
                                        !canShowPct
                                          ? {
                                              borderRightWidth: 1,
                                              borderRightStyle:
                                                "dotted",
                                              borderRightColor:
                                                "#cbd5e1",
                                            }
                                          : {}),
                                      }}
                                    >
                                      <div className="flex items-center justify-end gap-2">
                                        <span>{shortPeriodLabel(period)}</span>
                                        <span className="shrink-0 text-slate-900">
                                          {renderSortIndicator(periodSortKey)}
                                        </span>
                                      </div>
                                    </th>,
                                  );

                                  // Coluna de média (se Add x̄ estiver ativo)
                                  if (showAverage) {
                                    subHeaders.push(
                                      <th
                                        key={`${mId}__${period}__avg`}
                                        className="px-2 py-2 text-right font-bold uppercase tracking-wider select-none whitespace-nowrap text-[11px]"
                                        style={{
                                          ...stickyPivotHeaderRow2Style(),
                                          backgroundColor:
                                            PIVOT_DERIVED_HEADER_BG,
                                          color:
                                            PIVOT_DERIVED_HEADER_TEXT,
                                          width: AVG_COL_WIDTH,
                                          borderBottomWidth: 2,
                                          borderBottomStyle:
                                            "solid",
                                          borderBottomColor:
                                            "#e2e8f0",
                                          // Borda leve após média
                                          ...(!canShowPct &&
                                          !isLastPeriod
                                            ? {
                                                borderRightWidth: 1,
                                                borderRightStyle:
                                                  "dotted",
                                                borderRightColor:
                                                  "#cbd5e1",
                                              }
                                            : {}),
                                        }}
                                      >
                                        {`x̄ ${averagePeriodType}`}
                                      </th>,
                                    );
                                  }

                                  // Coluna % (se Add% estiver ativo)
                                  if (canShowPct) {
                                    subHeaders.push(
                                      <th
                                        key={`${mId}__${period}__pct`}
                                        className="px-2 py-2 text-center font-bold uppercase tracking-wider select-none whitespace-nowrap text-[12px]"
                                        style={{
                                          ...stickyPivotHeaderRow2Style(),
                                          backgroundColor:
                                            PIVOT_DERIVED_HEADER_BG,
                                          color:
                                            PIVOT_DERIVED_HEADER_TEXT,
                                          width: PCT_COL_WIDTH,
                                          borderBottomWidth: 2,
                                          borderBottomStyle:
                                            "solid",
                                          borderBottomColor:
                                            "#e2e8f0",
                                          // Borda leve após o % se não for o último período
                                          ...(!isLastPeriod
                                            ? {
                                                borderRightWidth: 1,
                                                borderRightStyle:
                                                  "dotted",
                                                borderRightColor:
                                                  "#cbd5e1",
                                              }
                                            : {}),
                                        }}
                                      >
                                        %
                                      </th>,
                                    );
                                  }
                                },
                              );

                              // Coluna Total
                              subHeaders.push(
                                <th
                                  key={`${mId}__total`}
                                  className="px-2 pr-3 py-2 text-right font-bold text-slate-700 uppercase tracking-wider select-none whitespace-nowrap text-[12px] cursor-pointer group hover:brightness-95 transition-colors"
                                  onClick={() => handleSort(`__total__${mId}`)}
                                  style={{
                                    backgroundColor:
                                      totalColumnBg,
                                    width:
                                      getPivotTotalWidth(mId),
                                    borderBottomWidth: 2,
                                    borderBottomStyle: "solid",
                                    borderBottomColor:
                                      "#e2e8f0",
                                    ...(!canShowPct &&
                                    !isLastMetric
                                      ? {
                                          borderRightWidth: 2,
                                          borderRightStyle:
                                            "dotted",
                                          borderRightColor:
                                            "#94a3b8",
                                        }
                                      : {}),
                                  }}
                                >
                                  <div className="flex items-center justify-end gap-2">
                                    <span>Total</span>
                                    <span className="shrink-0 text-slate-900">
                                      {renderSortIndicator(`__total__${mId}`)}
                                    </span>
                                  </div>
                                </th>,
                              );

                              // Coluna de média Total (se Add x̄ estiver ativo)
                              if (showAverage) {
                                subHeaders.push(
                                  <th
                                    key={`${mId}__total__avg`}
                                    className="px-2 py-2 text-right font-bold text-slate-700 uppercase tracking-wider select-none whitespace-nowrap text-[11px]"
                                    style={{
                                      backgroundColor:
                                        totalColumnBg,
                                      width: AVG_COL_WIDTH,
                                      borderBottomWidth: 2,
                                      borderBottomStyle:
                                        "solid",
                                      borderBottomColor:
                                        "#e2e8f0",
                                      ...(!canShowPct &&
                                      !isLastMetric
                                        ? {
                                            borderRightWidth: 2,
                                            borderRightStyle:
                                              "dotted",
                                            borderRightColor:
                                              "#94a3b8",
                                          }
                                        : {}),
                                    }}
                                  >
                                    {`x̄ ${averagePeriodType}`}
                                  </th>,
                                );
                              }

                              // Coluna % Total (se Add% estiver ativo)
                              if (canShowPct) {
                                subHeaders.push(
                                  <th
                                    key={`${mId}__total__pct`}
                                    className="px-2 py-2 text-center font-bold text-slate-700 uppercase tracking-wider select-none whitespace-nowrap text-[12px]"
                                    style={{
                                      backgroundColor:
                                        totalColumnBg,
                                      width: PCT_COL_WIDTH,
                                      borderBottomWidth: 2,
                                      borderBottomStyle:
                                        "solid",
                                      borderBottomColor:
                                        "#e2e8f0",
                                      ...(!isLastMetric
                                        ? {
                                            borderRightWidth: 2,
                                            borderRightStyle:
                                              "dotted",
                                            borderRightColor:
                                              "#94a3b8",
                                          }
                                        : {}),
                                    }}
                                  >
                                    %
                                  </th>,
                                );
                              }
                            }
                            return subHeaders;
                          })
                        ) : (
                          <>
                            {periods.flatMap((period, pIdx) =>
                              orderedMetrics.flatMap(
                                (mId: string, mIdx: number) => {
                                  const metric = METRICS_LIST.find(
                                    (m) => m.id === mId,
                                  );
                                  const abbrev =
                                    METRIC_ABBREVIATIONS[mId] ||
                                    getMetricTableLabel(mId, metric?.label) ||
                                    mId;
                                  const isLastInPeriod =
                                    mIdx ===
                                    orderedMetrics.length - 1;
                                  const isLastPeriod =
                                    pIdx === periods.length - 1;
                                  const periodSortKey = `${period}__${mId}`;
                                  const canShowPct =
                                    showSharePct &&
                                    !PCT_EXCLUDED_METRICS.has(
                                      mId,
                                    );
                                  const periodGroupEnd =
                                    isLastInPeriod && !isLastPeriod
                                      ? {
                                          borderRightWidth: 2,
                                          borderRightStyle:
                                            "dotted" as const,
                                          borderRightColor: "#94a3b8",
                                        }
                                      : isLastInPeriod &&
                                          isLastPeriod
                                        ? {
                                            borderRightWidth: 2,
                                            borderRightStyle:
                                              "dotted" as const,
                                            borderRightColor: "#94a3b8",
                                          }
                                        : {};
                                  const out: React.ReactNode[] = [];
                                  out.push(
                                    <th
                                      key={`pf2v_${period}_${mId}`}
                                      className="px-2 pr-3 py-2 text-right font-bold uppercase tracking-wider select-none whitespace-nowrap text-[12px] cursor-pointer group hover:brightness-95 transition-colors"
                                      onClick={() =>
                                        handleSort(periodSortKey)
                                      }
                                      style={{
                                        ...stickyPivotHeaderRow2Style(),
                                        backgroundColor:
                                          PIVOT_DERIVED_HEADER_BG,
                                        color:
                                          PIVOT_DERIVED_HEADER_TEXT,
                                        width:
                                          getPivotMetricWidth(mId),
                                        borderBottomWidth: 2,
                                        borderBottomStyle: "solid",
                                        borderBottomColor: "#e2e8f0",
                                        ...(!canShowPct &&
                                        !showAverage &&
                                        !isLastInPeriod
                                          ? {
                                              borderRightWidth: 1,
                                              borderRightStyle: "dotted",
                                              borderRightColor: "#cbd5e1",
                                            }
                                          : {}),
                                        ...(canShowPct ||
                                        showAverage
                                          ? {}
                                          : periodGroupEnd),
                                      }}
                                    >
                                      <div className="flex items-center justify-end gap-2">
                                        <span>{abbrev}</span>
                                        <span className="shrink-0 text-slate-900">
                                          {renderSortIndicator(
                                            periodSortKey,
                                          )}
                                        </span>
                                      </div>
                                    </th>,
                                  );
                                  if (showAverage) {
                                    out.push(
                                      <th
                                        key={`pf2a_${period}_${mId}`}
                                        className="px-2 py-2 text-right font-bold uppercase tracking-wider select-none whitespace-nowrap text-[11px]"
                                        style={{
                                          ...stickyPivotHeaderRow2Style(),
                                          backgroundColor:
                                            PIVOT_DERIVED_HEADER_BG,
                                          color:
                                            PIVOT_DERIVED_HEADER_TEXT,
                                          width: AVG_COL_WIDTH,
                                          borderBottomWidth: 2,
                                          borderBottomStyle: "solid",
                                          borderBottomColor: "#e2e8f0",
                                          ...(!canShowPct &&
                                          !isLastInPeriod
                                            ? {
                                                borderRightWidth: 1,
                                                borderRightStyle: "dotted",
                                                borderRightColor: "#cbd5e1",
                                              }
                                            : {}),
                                          ...(canShowPct
                                            ? {}
                                            : periodGroupEnd),
                                        }}
                                      >
                                        {`x̄ ${averagePeriodType}`}
                                      </th>,
                                    );
                                  }
                                  if (canShowPct) {
                                    out.push(
                                      <th
                                        key={`pf2p_${period}_${mId}`}
                                        className="px-2 py-2 text-center font-bold uppercase tracking-wider select-none whitespace-nowrap text-[12px]"
                                        style={{
                                          ...stickyPivotHeaderRow2Style(),
                                          backgroundColor:
                                            PIVOT_DERIVED_HEADER_BG,
                                          color:
                                            PIVOT_DERIVED_HEADER_TEXT,
                                          width: PCT_COL_WIDTH,
                                          borderBottomWidth: 2,
                                          borderBottomStyle: "solid",
                                          borderBottomColor: "#e2e8f0",
                                          ...periodGroupEnd,
                                        }}
                                      >
                                        %
                                      </th>,
                                    );
                                  }
                                  return out;
                                },
                              ),
                            )}
                            {orderedMetrics.flatMap(
                              (mId: string, mIdx: number) => {
                                const isLastMetric =
                                  mIdx ===
                                  orderedMetrics.length - 1;
                                const canShowPct =
                                  showSharePct &&
                                  !PCT_EXCLUDED_METRICS.has(mId);
                                const metric = METRICS_LIST.find(
                                  (m) => m.id === mId,
                                );
                                const abbrev =
                                  METRIC_ABBREVIATIONS[mId] ||
                                  getMetricTableLabel(mId, metric?.label) ||
                                  mId;
                                const totalSortKey = `__total__${mId}`;
                                const out: React.ReactNode[] = [];
                                out.push(
                                  <th
                                    key={`pf2t_${mId}`}
                                    className="px-2 pr-3 py-2 text-right font-bold text-slate-700 uppercase tracking-wider select-none whitespace-nowrap text-[12px] cursor-pointer group hover:brightness-95 transition-colors"
                                    onClick={() =>
                                      handleSort(totalSortKey)
                                    }
                                    style={{
                                      backgroundColor: totalColumnBg,
                                      width:
                                        getPivotTotalWidth(mId),
                                      borderBottomWidth: 2,
                                      borderBottomStyle: "solid",
                                      borderBottomColor: "#e2e8f0",
                                      ...(!canShowPct &&
                                      !showAverage &&
                                      !isLastMetric
                                        ? {
                                            borderRightWidth: 2,
                                            borderRightStyle: "dotted",
                                            borderRightColor: "#94a3b8",
                                          }
                                        : {}),
                                    }}
                                  >
                                    <div className="flex items-center justify-end gap-2">
                                      <span>{abbrev}</span>
                                      <span className="shrink-0 text-slate-900">
                                        {renderSortIndicator(
                                          totalSortKey,
                                        )}
                                      </span>
                                    </div>
                                  </th>,
                                );
                                if (showAverage) {
                                  out.push(
                                    <th
                                      key={`pf2ta_${mId}`}
                                      className="px-2 py-2 text-right font-bold text-slate-700 uppercase tracking-wider select-none whitespace-nowrap text-[11px]"
                                      style={{
                                        backgroundColor: totalColumnBg,
                                        width: AVG_COL_WIDTH,
                                        borderBottomWidth: 2,
                                        borderBottomStyle: "solid",
                                        borderBottomColor: "#e2e8f0",
                                        ...(!canShowPct &&
                                        !isLastMetric
                                          ? {
                                              borderRightWidth: 2,
                                              borderRightStyle: "dotted",
                                              borderRightColor: "#94a3b8",
                                            }
                                          : {}),
                                      }}
                                    >
                                      {`x̄ ${averagePeriodType}`}
                                    </th>,
                                  );
                                }
                                if (canShowPct) {
                                  out.push(
                                    <th
                                      key={`pf2tp_${mId}`}
                                      className="px-2 py-2 text-center font-bold text-slate-700 uppercase tracking-wider select-none whitespace-nowrap text-[12px]"
                                      style={{
                                        backgroundColor: totalColumnBg,
                                        width: PCT_COL_WIDTH,
                                        borderBottomWidth: 2,
                                        borderBottomStyle: "solid",
                                        borderBottomColor: "#e2e8f0",
                                        ...(!isLastMetric
                                          ? {
                                              borderRightWidth: 2,
                                              borderRightStyle: "dotted",
                                              borderRightColor: "#94a3b8",
                                            }
                                          : {}),
                                      }}
                                    >
                                      %
                                    </th>,
                                  );
                                }
                                return out;
                              },
                            )}
                          </>
                        )}
                      </tr>
                    </thead>

                    {/* PIVOT TOTALS ROW — sticky below 2-row header (~75px) */}
                    {pivotTotals && (
                      <tbody
                        className="relative z-[30]"
                        style={{
                          boxShadow:
                            "0 2px 6px -1px rgba(0,0,0,0.07)",
                        }}
                      >
                        <tr className="font-bold text-slate-800">
                          <td
                            style={{
                              width:
                                columnWidths["grouping"] || 350,
                              ...stickyPivotTotalCornerStyle(),
                              ...bc("#e2e8f0"),
                              backgroundColor: "#f8fafc",
                              borderBottomWidth: 2,
                              borderBottomStyle: "solid",
                              borderBottomColor: "#e2e8f0",
                              borderRightWidth: 1,
                              borderRightStyle: "solid",
                              boxShadow:
                                "1px 0 0 0 rgba(148,163,184,0.18), 6px 0 16px -4px rgba(0,0,0,0.08), 2px 0 6px -2px rgba(0,0,0,0.05)",
                            }}
                            className="px-4 py-2.5 z-[45] overflow-hidden text-ellipsis whitespace-nowrap text-[13px] uppercase tracking-wide"
                          >
                            Total
                          </td>
                          {!isPeriodFirstPivot ? (
                          orderedMetrics.map(
                            (mId: string, mIdx: number) => {
                              const config = METRIC_CONFIG[mId];
                              const isLastMetric =
                                mIdx ===
                                orderedMetrics.length - 1;
                              const isComp =
                                analysisMode === "comparativo";
                              const canShowPct =
                                showSharePct &&
                                !PCT_EXCLUDED_METRICS.has(mId);
                              const cells: React.ReactNode[] =
                                [];

                              // Period value cells
                              periods.forEach(
                                (period, pIdx) => {
                                  const key = `${period}__${mId}`;
                                  const isLastPeriod =
                                    pIdx === periods.length - 1;

                                  // Coluna do valor
                                  cells.push(
                                    <td
                                      key={key}
                                      className="px-2 pr-3 py-2.5 text-right z-[30] text-[13px] bg-slate-50 whitespace-nowrap"
                                      style={{
                                        ...stickyPivotTotalCellStyle(),
                                        width:
                                          getPivotMetricWidth(
                                            mId,
                                          ),
                                        borderBottomWidth: 2,
                                        borderBottomStyle:
                                          "solid",
                                        borderBottomColor:
                                          "#e2e8f0",
                                        // Borda leve: só se NÃO tiver Add% E (não for último período OU tiver variação)
                                        ...(!canShowPct &&
                                        (!isLastPeriod ||
                                          hasVariation)
                                          ? {
                                              borderRightWidth: 1,
                                              borderRightStyle:
                                                "dotted",
                                              borderRightColor:
                                                "#cbd5e1",
                                            }
                                          : {}),
                                      }}
                                    >
                                      {renderMetricValue(
                                        pivotTotals[key] || 0,
                                        mId,
                                      )}
                                    </td>,
                                  );

                                  // Coluna de média (se Add x̄ estiver ativo)
                                  if (showAverage) {
                                    const avgValue =
                                      calculateAverage(
                                        pivotTotals[key] || 0,
                                        period,
                                      );

                                    // Format average with 2 decimal places
                                    let avgFormatted = "";
                                    if (config) {
                                      switch (config.format) {
                                        case "currency":
                                          avgFormatted =
                                            new Intl.NumberFormat(
                                              "pt-BR",
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              },
                                            ).format(avgValue);
                                          break;
                                        case "percent":
                                        case "percent0":
                                        case "percent1": {
                                          const frac =
                                            config.format === "percent0"
                                              ? 0
                                              : 2;
                                          avgFormatted =
                                            new Intl.NumberFormat(
                                              "pt-BR",
                                              {
                                                style:
                                                  "percent",
                                                minimumFractionDigits: frac,
                                                maximumFractionDigits: frac,
                                              },
                                            ).format(avgValue);
                                          break;
                                        }
                                        case "integer":
                                          avgFormatted =
                                            new Intl.NumberFormat(
                                              "pt-BR",
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              },
                                            ).format(avgValue);
                                          break;
                                        case "decimal":
                                        case "decimal1":
                                          avgFormatted =
                                            new Intl.NumberFormat(
                                              "pt-BR",
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              },
                                            ).format(avgValue);
                                          break;
                                        case "days":
                                          avgFormatted = `${avgValue.toFixed(2)} dias`;
                                          break;
                                        default:
                                          avgFormatted =
                                            avgValue.toFixed(2);
                                      }
                                    } else {
                                      avgFormatted =
                                        avgValue.toFixed(2);
                                    }

                                    cells.push(
                                      <td
                                        key={`${key}__avg`}
                                        className="h-[46px] px-2 pr-3 py-2.5 text-right z-[30] text-[12px] text-slate-600 bg-slate-50 whitespace-nowrap"
                                        style={{
                                          ...stickyPivotTotalCellStyle(),
                                          width: AVG_COL_WIDTH,
                                          borderBottomWidth: 2,
                                          borderBottomStyle:
                                            "solid",
                                          borderBottomColor:
                                            "#e2e8f0",
                                          // Borda leve após média
                                          ...(!canShowPct &&
                                          (!isLastPeriod ||
                                            hasVariation)
                                            ? {
                                                borderRightWidth: 1,
                                                borderRightStyle:
                                                  "dotted",
                                                borderRightColor:
                                                  "#cbd5e1",
                                              }
                                            : {}),
                                        }}
                                      >
                                        {avgFormatted}
                                      </td>,
                                    );
                                  }

                                  // Coluna do % (se Add% estiver ativo)
                                  if (canShowPct) {
                                    cells.push(
                                      <td
                                        key={`${key}__pct`}
                                        className="h-[46px] px-2 py-2.5 text-center z-[30] text-[12px] text-slate-500 bg-slate-50"
                                        style={{
                                          ...stickyPivotTotalCellStyle(),
                                          width: PCT_COL_WIDTH,
                                          borderBottomWidth: 2,
                                          borderBottomStyle:
                                            "solid",
                                          borderBottomColor:
                                            "#e2e8f0",
                                          // Borda leve após o % (separa dados diferentes)
                                          ...(!isLastPeriod ||
                                          (isLastPeriod &&
                                            hasVariation)
                                            ? {
                                                borderRightWidth: 1,
                                                borderRightStyle:
                                                  "dotted",
                                                borderRightColor:
                                                  "#cbd5e1",
                                              }
                                            : {}),
                                          // NUNCA borda forte aqui - a borda forte vai no Total
                                        }}
                                      >
                                        100%
                                      </td>,
                                    );
                                  }
                                },
                              );

                              if (isComp && hasVariation) {
                                // Variation Vlr
                                const diffVal =
                                  pivotTotals[
                                    `__diff__${mId}`
                                  ] || 0;
                                const fv = formatVariation(
                                  diffVal,
                                  config?.format,
                                );
                                cells.push(
                                  <td
                                    key={`__diff__${mId}`}
                                    className={cn(
                                      "h-[46px] px-2 pr-3 py-2.5 whitespace-nowrap text-right text-[13px] z-[30] bg-slate-50",
                                      fv.color,
                                    )}
                                    style={{
                                      ...stickyPivotTotalCellStyle(),
                                      width:
                                        getPivotMetricWidth(
                                          mId,
                                        ),
                                      borderBottomWidth: 2,
                                      borderBottomStyle:
                                        "solid",
                                      borderBottomColor:
                                        "#e2e8f0",
                                      // Borda leve: sempre presente entre VAR VLR e VAR %
                                      borderRightWidth: 1,
                                      borderRightStyle:
                                        "dotted",
                                      borderRightColor:
                                        "#cbd5e1",
                                    }}
                                  >
                                    <div className="flex items-center justify-end gap-[3px]">
                                      <span className="w-[12px] shrink-0 flex items-center justify-end">
                                        {fv.arrow === "up" && (
                                          <ArrowUp size={12} />
                                        )}
                                        {fv.arrow ===
                                          "down" && (
                                          <ArrowDown
                                            size={12}
                                          />
                                        )}
                                      </span>
                                      <span>{fv.text}</span>
                                    </div>
                                  </td>,
                                );
                                // Variation %
                                const growthVal =
                                  pivotTotals[
                                    `__growth__${mId}`
                                  ] || 0;
                                const fg =
                                  formatGrowth(growthVal);
                                cells.push(
                                  <td
                                    key={`__growth__${mId}`}
                                    className={cn(
                                      "h-[46px] px-2 pr-3 py-2.5 whitespace-nowrap text-right text-[13px] z-[30] bg-slate-50",
                                      fg.color,
                                    )}
                                    style={{
                                      ...stickyPivotTotalCellStyle(),
                                      width:
                                        getPivotMetricWidth(
                                          mId,
                                        ),
                                      borderBottomWidth: 2,
                                      borderBottomStyle:
                                        "solid",
                                      borderBottomColor:
                                        "#e2e8f0",
                                      ...(!isLastMetric
                                        ? {
                                            borderRightWidth: 2,
                                            borderRightStyle:
                                              "dotted",
                                            borderRightColor:
                                              "#94a3b8",
                                          }
                                        : {
                                            borderRightWidth: 2,
                                            borderRightStyle:
                                              "solid",
                                            borderRightColor:
                                              "#e2e8f0",
                                          }),
                                    }}
                                  >
                                    <div className="flex items-center justify-end gap-[3px]">
                                      <span className="w-[12px] shrink-0 flex items-center justify-center">
                                        {fg.arrow === "up" && (
                                          <ArrowUp size={12} />
                                        )}
                                        {fg.arrow ===
                                          "down" && (
                                          <ArrowDown
                                            size={12}
                                          />
                                        )}
                                      </span>
                                      <span>{fg.text}</span>
                                    </div>
                                  </td>,
                                );
                              } else if (!isComp) {
                                // Evolutionary: Total column
                                const totalKey = `__total__${mId}`;
                                const canShowPct =
                                  showSharePct &&
                                  !PCT_EXCLUDED_METRICS.has(
                                    mId,
                                  );

                                // Coluna do valor Total
                                cells.push(
                                  <td
                                    key={totalKey}
                                    className="h-[46px] px-2 pr-3 py-2.5 text-right z-[30] text-[13px] whitespace-nowrap"
                                    style={{
                                      ...stickyPivotTotalCellStyle(),
                                      backgroundColor:
                                        totalColumnBg,
                                      width:
                                        getPivotTotalWidth(mId),
                                      borderBottomWidth: 2,
                                      borderBottomStyle:
                                        "solid",
                                      borderBottomColor:
                                        "#e2e8f0",
                                      ...(!canShowPct &&
                                      !isLastMetric
                                        ? {
                                            borderRightWidth: 2,
                                            borderRightStyle:
                                              "dotted",
                                            borderRightColor:
                                              "#94a3b8",
                                          }
                                        : {}),
                                    }}
                                  >
                                    {renderMetricValue(
                                      pivotTotals[totalKey] ||
                                        0,
                                      mId,
                                    )}
                                  </td>,
                                );

                                // Coluna de média Total (se Add x̄ estiver ativo)
                                if (showAverage) {
                                  const avgValue =
                                    calculateAverage(
                                      pivotTotals[totalKey] ||
                                        0,
                                    );

                                  // Format average with 2 decimal places
                                  let avgFormatted = "";
                                  if (config) {
                                    switch (config.format) {
                                      case "currency":
                                        avgFormatted =
                                          new Intl.NumberFormat(
                                            "pt-BR",
                                            {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            },
                                          ).format(avgValue);
                                        break;
                                      case "percent":
                                      case "percent0":
                                      case "percent1": {
                                        const frac =
                                          config.format === "percent0"
                                            ? 0
                                            : 2;
                                        avgFormatted =
                                          new Intl.NumberFormat(
                                            "pt-BR",
                                            {
                                              style: "percent",
                                              minimumFractionDigits: frac,
                                              maximumFractionDigits: frac,
                                            },
                                          ).format(avgValue);
                                        break;
                                      }
                                      case "integer":
                                        avgFormatted =
                                          new Intl.NumberFormat(
                                            "pt-BR",
                                            {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            },
                                          ).format(avgValue);
                                        break;
                                      case "decimal":
                                      case "decimal1":
                                        avgFormatted =
                                          new Intl.NumberFormat(
                                            "pt-BR",
                                            {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            },
                                          ).format(avgValue);
                                        break;
                                      case "days":
                                        avgFormatted = `${avgValue.toFixed(2)} dias`;
                                        break;
                                      default:
                                        avgFormatted =
                                          avgValue.toFixed(2);
                                    }
                                  } else {
                                    avgFormatted =
                                      avgValue.toFixed(2);
                                  }

                                  cells.push(
                                    <td
                                      key={`${totalKey}__avg`}
                                      className="h-[46px] px-2 pr-3 py-2.5 text-right z-[30] text-[12px] text-slate-600 whitespace-nowrap"
                                      style={{
                                        ...stickyPivotTotalCellStyle(),
                                        backgroundColor:
                                          totalColumnBg,
                                        width: AVG_COL_WIDTH,
                                        borderBottomWidth: 2,
                                        borderBottomStyle:
                                          "solid",
                                        borderBottomColor:
                                          "#e2e8f0",
                                        ...(!canShowPct &&
                                        !isLastMetric
                                          ? {
                                              borderRightWidth: 2,
                                              borderRightStyle:
                                                "dotted",
                                              borderRightColor:
                                                "#94a3b8",
                                            }
                                          : {}),
                                      }}
                                    >
                                      {avgFormatted}
                                    </td>,
                                  );
                                }

                                // Coluna do % Total (se Add% estiver ativo)
                                if (canShowPct) {
                                  cells.push(
                                    <td
                                      key={`${totalKey}__pct`}
                                      className="h-[46px] px-2 py-2.5 text-center z-[30] text-[12px] text-slate-500"
                                      style={{
                                        ...stickyPivotTotalCellStyle(),
                                        backgroundColor:
                                          totalColumnBg,
                                        width: PCT_COL_WIDTH,
                                        borderBottomWidth: 2,
                                        borderBottomStyle:
                                          "solid",
                                        borderBottomColor:
                                          "#e2e8f0",
                                        ...(!isLastMetric
                                          ? {
                                              borderRightWidth: 2,
                                              borderRightStyle:
                                                "dotted",
                                              borderRightColor:
                                                "#94a3b8",
                                            }
                                          : {}),
                                      }}
                                    >
                                      100%
                                    </td>,
                                  );
                                }
                              }
                              return cells;
                            })
                          ) : (
                            <>
                              {periods.flatMap((period, pIdx) =>
                                orderedMetrics.flatMap(
                                  (mId: string, mIdx: number) => {
                                    const config = METRIC_CONFIG[mId];
                                    const key = `${period}__${mId}`;
                                    const canShowPct =
                                      showSharePct &&
                                      !PCT_EXCLUDED_METRICS.has(mId);
                                    const isLastInPeriod =
                                      mIdx ===
                                      orderedMetrics.length - 1;
                                    const isLastPeriod =
                                      pIdx === periods.length - 1;
                                    const out: React.ReactNode[] = [];
                                    out.push(
                                      <td
                                        key={key}
                                        className="h-[46px] px-2 pr-3 py-2.5 text-right z-[30] text-[13px] bg-slate-50 whitespace-nowrap"
                                        style={{
                                          ...stickyPivotTotalCellStyle(),
                                          width:
                                            getPivotMetricWidth(mId),
                                          borderBottomWidth: 2,
                                          borderBottomStyle: "solid",
                                          borderBottomColor: "#e2e8f0",
                                          ...(!canShowPct &&
                                          !showAverage &&
                                          !isLastInPeriod
                                            ? {
                                                borderRightWidth: 1,
                                                borderRightStyle: "dotted",
                                                borderRightColor: "#cbd5e1",
                                              }
                                            : {}),
                                          ...(!canShowPct &&
                                          !showAverage &&
                                          isLastInPeriod &&
                                          !isLastPeriod
                                            ? {
                                                borderRightWidth: 2,
                                                borderRightStyle: "dotted",
                                                borderRightColor: "#94a3b8",
                                              }
                                            : {}),
                                          ...(!canShowPct &&
                                          !showAverage &&
                                          isLastInPeriod &&
                                          isLastPeriod
                                            ? {
                                                borderRightWidth: 2,
                                                borderRightStyle: "dotted",
                                                borderRightColor: "#94a3b8",
                                              }
                                            : {}),
                                        }}
                                      >
                                        {renderMetricValue(
                                          pivotTotals[key] || 0,
                                          mId,
                                        )}
                                      </td>,
                                    );
                                    if (showAverage) {
                                      const avgValue =
                                        calculateAverage(
                                          pivotTotals[key] || 0,
                                          period,
                                        );
                                      let avgFormatted = "";
                                      if (config) {
                                        switch (config.format) {
                                          case "currency":
                                            avgFormatted =
                                              new Intl.NumberFormat(
                                                "pt-BR",
                                                {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                                },
                                              ).format(avgValue);
                                            break;
                                          case "percent":
                                          case "percent0":
                                          case "percent1": {
                                            const frac =
                                              config.format === "percent0"
                                                ? 0
                                                : 2;
                                            avgFormatted =
                                              new Intl.NumberFormat(
                                                "pt-BR",
                                                {
                                                  style: "percent",
                                                  minimumFractionDigits: frac,
                                                  maximumFractionDigits: frac,
                                                },
                                              ).format(avgValue);
                                            break;
                                          }
                                          case "integer":
                                            avgFormatted =
                                              new Intl.NumberFormat(
                                                "pt-BR",
                                                {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                                },
                                              ).format(avgValue);
                                            break;
                                          case "decimal":
                                          case "decimal1":
                                            avgFormatted =
                                              new Intl.NumberFormat(
                                                "pt-BR",
                                                {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                                },
                                              ).format(avgValue);
                                            break;
                                          case "days":
                                            avgFormatted = `${avgValue.toFixed(2)} dias`;
                                            break;
                                          default:
                                            avgFormatted =
                                              avgValue.toFixed(2);
                                        }
                                      } else {
                                        avgFormatted =
                                          avgValue.toFixed(2);
                                      }
                                      out.push(
                                        <td
                                          key={`${key}__avg`}
                                          className="h-[46px] px-2 pr-3 py-2.5 text-right z-[30] text-[12px] text-slate-600 bg-slate-50 whitespace-nowrap"
                                          style={{
                                            ...stickyPivotTotalCellStyle(),
                                            width: AVG_COL_WIDTH,
                                            borderBottomWidth: 2,
                                            borderBottomStyle: "solid",
                                            borderBottomColor: "#e2e8f0",
                                            ...(!canShowPct &&
                                            !isLastInPeriod
                                              ? {
                                                  borderRightWidth: 1,
                                                  borderRightStyle: "dotted",
                                                  borderRightColor: "#cbd5e1",
                                                }
                                              : {}),
                                            ...(canShowPct
                                              ? {}
                                              : isLastInPeriod &&
                                                  !isLastPeriod
                                                ? {
                                                    borderRightWidth: 2,
                                                    borderRightStyle: "dotted",
                                                    borderRightColor: "#94a3b8",
                                                  }
                                                : {}),
                                            ...(canShowPct
                                              ? {}
                                              : isLastInPeriod &&
                                                  isLastPeriod
                                                ? {
                                                    borderRightWidth: 2,
                                                    borderRightStyle: "dotted",
                                                    borderRightColor: "#94a3b8",
                                                  }
                                                : {}),
                                          }}
                                        >
                                          {avgFormatted}
                                        </td>,
                                      );
                                    }
                                    if (canShowPct) {
                                      out.push(
                                        <td
                                          key={`${key}__pct`}
                                          className="h-[46px] px-2 py-2.5 text-center z-[30] text-[12px] text-slate-500 bg-slate-50"
                                          style={{
                                            ...stickyPivotTotalCellStyle(),
                                            width: PCT_COL_WIDTH,
                                            borderBottomWidth: 2,
                                            borderBottomStyle: "solid",
                                            borderBottomColor: "#e2e8f0",
                                            ...(isLastInPeriod &&
                                            !isLastPeriod
                                              ? {
                                                  borderRightWidth: 2,
                                                  borderRightStyle: "dotted",
                                                  borderRightColor: "#94a3b8",
                                                }
                                              : {}),
                                            ...(isLastInPeriod &&
                                            isLastPeriod
                                              ? {
                                                  borderRightWidth: 2,
                                                  borderRightStyle: "dotted",
                                                  borderRightColor: "#94a3b8",
                                                }
                                              : {}),
                                          }}
                                        >
                                          100%
                                        </td>,
                                      );
                                    }
                                    return out;
                                  },
                                ),
                              )}
                              {orderedMetrics.flatMap(
                                (mId: string, mIdx: number) => {
                                  const totalKey = `__total__${mId}`;
                                  const config = METRIC_CONFIG[mId];
                                  const isLastMetric =
                                    mIdx ===
                                    orderedMetrics.length - 1;
                                  const canShowPct =
                                    showSharePct &&
                                    !PCT_EXCLUDED_METRICS.has(mId);
                                  const out: React.ReactNode[] = [];
                                  out.push(
                                    <td
                                      key={totalKey}
                                      className="h-[46px] px-2 pr-3 py-2.5 text-right z-[30] text-[13px] whitespace-nowrap"
                                      style={{
                                        ...stickyPivotTotalCellStyle(),
                                        backgroundColor: totalColumnBg,
                                        width:
                                          getPivotTotalWidth(mId),
                                        borderBottomWidth: 2,
                                        borderBottomStyle: "solid",
                                        borderBottomColor: "#e2e8f0",
                                        ...(!canShowPct &&
                                        !showAverage &&
                                        !isLastMetric
                                          ? {
                                              borderRightWidth: 2,
                                              borderRightStyle: "dotted",
                                              borderRightColor: "#94a3b8",
                                            }
                                          : {}),
                                      }}
                                    >
                                      {renderMetricValue(
                                        pivotTotals[totalKey] || 0,
                                        mId,
                                      )}
                                    </td>,
                                  );
                                  if (showAverage) {
                                    const avgValue =
                                      calculateAverage(
                                        pivotTotals[totalKey] || 0,
                                      );
                                    let avgFormatted = "";
                                    if (config) {
                                      switch (config.format) {
                                        case "currency":
                                          avgFormatted =
                                            new Intl.NumberFormat(
                                              "pt-BR",
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              },
                                            ).format(avgValue);
                                          break;
                                        case "percent":
                                        case "percent0":
                                        case "percent1": {
                                          const frac =
                                            config.format === "percent0"
                                              ? 0
                                              : 2;
                                          avgFormatted =
                                            new Intl.NumberFormat(
                                              "pt-BR",
                                              {
                                                style: "percent",
                                                minimumFractionDigits: frac,
                                                maximumFractionDigits: frac,
                                              },
                                            ).format(avgValue);
                                          break;
                                        }
                                        case "integer":
                                          avgFormatted =
                                            new Intl.NumberFormat(
                                              "pt-BR",
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              },
                                            ).format(avgValue);
                                          break;
                                        case "decimal":
                                        case "decimal1":
                                          avgFormatted =
                                            new Intl.NumberFormat(
                                              "pt-BR",
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              },
                                            ).format(avgValue);
                                          break;
                                        case "days":
                                          avgFormatted = `${avgValue.toFixed(2)} dias`;
                                          break;
                                        default:
                                          avgFormatted =
                                            avgValue.toFixed(2);
                                      }
                                    } else {
                                      avgFormatted =
                                        avgValue.toFixed(2);
                                    }
                                    out.push(
                                      <td
                                        key={`${totalKey}__avg`}
                                        className="h-[46px] px-2 pr-3 py-2.5 text-right z-[30] text-[12px] text-slate-600 whitespace-nowrap"
                                        style={{
                                          ...stickyPivotTotalCellStyle(),
                                          backgroundColor: totalColumnBg,
                                          width: AVG_COL_WIDTH,
                                          borderBottomWidth: 2,
                                          borderBottomStyle: "solid",
                                          borderBottomColor: "#e2e8f0",
                                          ...(!canShowPct &&
                                          !isLastMetric
                                            ? {
                                                borderRightWidth: 2,
                                                borderRightStyle: "dotted",
                                                borderRightColor: "#94a3b8",
                                              }
                                            : {}),
                                        }}
                                      >
                                        {avgFormatted}
                                      </td>,
                                    );
                                  }
                                  if (canShowPct) {
                                    out.push(
                                      <td
                                        key={`${totalKey}__pct`}
                                        className="h-[46px] px-2 py-2.5 text-center z-[30] text-[12px] text-slate-500"
                                        style={{
                                          ...stickyPivotTotalCellStyle(),
                                          backgroundColor: totalColumnBg,
                                          width: PCT_COL_WIDTH,
                                          borderBottomWidth: 2,
                                          borderBottomStyle: "solid",
                                          borderBottomColor: "#e2e8f0",
                                          ...(!isLastMetric
                                            ? {
                                                borderRightWidth: 2,
                                                borderRightStyle: "dotted",
                                                borderRightColor: "#94a3b8",
                                              }
                                            : {}),
                                        }}
                                      >
                                        100%
                                      </td>,
                                    );
                                  }
                                  return out;
                                },
                              )}
                            </>
                          )}
                        </tr>
                      </tbody>
                    )}

                    {/* PIVOT DATA ROWS */}
                    <tbody>
                      {finalRows.map((row: any, dataRowIndex: number) => {
                        const depth = row.depth ?? 0;
                        const isExpanded =
                          expandedRows.includes(row.id);
                        const hasChildren =
                          row.hasChildren ||
                          row.children?.length > 0;
                        const indentPx = 16 + depth * 32;
                        const rowBg = resolveTableRowBg(
                          row.id,
                          dataRowIndex,
                        );
                        return (
                          <tr
                            key={row.id}
                            className="transition-colors"
                            onMouseEnter={() =>
                              setHoveredTableRowId(row.id)
                            }
                            onMouseLeave={() =>
                              setHoveredTableRowId(null)
                            }
                          >
                            <td
                              style={{
                                width:
                                  columnWidths["grouping"] ||
                                  350,
                                backgroundColor: rowBg,
                                ...bc("#e2e8f0"),
                                borderRightWidth: 1,
                                borderRightStyle: "solid",
                                borderBottomWidth: 1,
                                borderBottomStyle: "solid",
                                boxShadow:
                                  "1px 0 0 0 rgba(148,163,184,0.18), 6px 0 16px -4px rgba(0,0,0,0.08), 2px 0 6px -2px rgba(0,0,0,0.05)",
                              }}
                              className={cn(
                                "sticky left-0 z-[35] overflow-hidden py-2 text-sm whitespace-nowrap",
                                depth === 0
                                  ? "font-semibold text-slate-800"
                                  : "font-medium text-slate-700",
                              )}
                            >
                              <div className="flex items-center">
                                <div
                                  className="flex items-center gap-3 w-full overflow-hidden"
                                  style={{
                                    paddingLeft: `${indentPx}px`,
                                  }}
                                >
                                  {hasChildren ? (
                                    <button
                                      onClick={() =>
                                        toggleRow(row.id)
                                      }
                                      className="p-1 hover:bg-slate-200 rounded transition-colors shrink-0"
                                    >
                                      {isExpanded ? (
                                        <ChevronDown
                                          size={14}
                                        />
                                      ) : (
                                        <ChevronRight
                                          size={14}
                                        />
                                      )}
                                    </button>
                                  ) : (
                                    <div className="w-[22px] shrink-0" />
                                  )}
                                  <span className="truncate text-[15px]">
                                    {row.label}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {!isPeriodFirstPivot ? (
                              orderedMetrics.map(
                              (mId: string, mIdx: number) => {
                                const config =
                                  METRIC_CONFIG[mId];
                                const isLastMetric =
                                  mIdx ===
                                  orderedMetrics.length - 1;
                                const isComp =
                                  analysisMode ===
                                  "comparativo";
                                const canShowPct =
                                  showSharePct &&
                                  !PCT_EXCLUDED_METRICS.has(
                                    mId,
                                  );
                                const cells: React.ReactNode[] =
                                  [];
                                const planningBg =
                                  getPlanningBg(
                                    mId,
                                    moduleConfig,
                                    "#e2e8f0",
                                  );

                                // Period value cells
                                periods.forEach(
                                  (period, pIdx) => {
                                    const key = `${period}__${mId}`;
                                    const isLastPeriod =
                                      pIdx ===
                                      periods.length - 1;
                                    // For comparativo: only P1 and P2 show %; for evolutiva: all period cols show %
                                    const colTotal = pivotTotals
                                      ? pivotTotals[key]
                                      : null;

                                    // Coluna do valor
                                    cells.push(
                                      <td
                                        key={key}
                                        className={cn(
                                          "px-2 pr-3 py-2.5 text-right text-[14px] transition-colors  whitespace-nowrap",
                                          depth === 0
                                            ? "text-slate-700 font-medium"
                                            : "text-slate-600 font-normal",
                                        )}
                                        style={{
                                          backgroundColor: rowBg,
                                          width:
                                            getPivotMetricWidth(
                                              mId,
                                            ),
                                          borderBottomWidth: 1,
                                          borderBottomStyle:
                                            "solid",
                                          borderBottomColor:
                                            "#e2e8f0",
                                          // Borda leve: só se NÃO tiver Add% E (não for último período OU tiver variação)
                                          ...(!canShowPct &&
                                          (!isLastPeriod ||
                                            hasVariation)
                                            ? {
                                                borderRightWidth: 1,
                                                borderRightStyle:
                                                  "dotted",
                                                borderRightColor:
                                                  "#cbd5e1",
                                              }
                                            : {}),
                                        }}
                                      >
                                        {renderMetricValue(
                                          row[key] || 0,
                                          mId,
                                        )}
                                      </td>,
                                    );

                                    // Coluna de média (se Add x̄ estiver ativo)
                                    if (showAverage) {
                                      const avgValue =
                                        calculateAverage(
                                          row[key] || 0,
                                          period,
                                        );

                                      // Format average with 2 decimal places, respecting metric type
                                      let avgFormatted = "";
                                      if (config) {
                                        switch (config.format) {
                                          case "currency":
                                            avgFormatted =
                                              new Intl.NumberFormat(
                                                "pt-BR",
                                                {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                                },
                                              ).format(
                                                avgValue,
                                              );
                                            break;
                                          case "percent":
                                          case "percent0":
                                          case "percent1": {
                                            const frac =
                                              config.format === "percent0"
                                                ? 0
                                                : 2;
                                            avgFormatted =
                                              new Intl.NumberFormat(
                                                "pt-BR",
                                                {
                                                  style:
                                                    "percent",
                                                  minimumFractionDigits: frac,
                                                  maximumFractionDigits: frac,
                                                },
                                              ).format(
                                                avgValue,
                                              );
                                            break;
                                          }
                                          case "integer":
                                            avgFormatted =
                                              new Intl.NumberFormat(
                                                "pt-BR",
                                                {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                                },
                                              ).format(
                                                avgValue,
                                              );
                                            break;
                                          case "decimal":
                                          case "decimal1":
                                            avgFormatted =
                                              new Intl.NumberFormat(
                                                "pt-BR",
                                                {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                                },
                                              ).format(
                                                avgValue,
                                              );
                                            break;
                                          case "days":
                                            avgFormatted = `${avgValue.toFixed(2)} dias`;
                                            break;
                                          default:
                                            avgFormatted =
                                              avgValue.toFixed(
                                                2,
                                              );
                                        }
                                      } else {
                                        avgFormatted =
                                          avgValue.toFixed(2);
                                      }

                                      cells.push(
                                        <td
                                          key={`${key}__avg`}
                                          className={cn(
                                            "px-2 pr-3 py-2.5 text-right text-[13px] transition-colors  whitespace-nowrap",
                                            depth === 0
                                              ? "text-slate-600 font-medium"
                                              : "text-slate-500 font-normal",
                                          )}
                                          style={{
                                            backgroundColor: rowBg,
                                            width:
                                              AVG_COL_WIDTH,
                                            borderBottomWidth: 1,
                                            borderBottomStyle:
                                              "solid",
                                            borderBottomColor:
                                              "#e2e8f0",
                                            // Borda leve após a média
                                            ...(!canShowPct &&
                                            (!isLastPeriod ||
                                              hasVariation)
                                              ? {
                                                  borderRightWidth: 1,
                                                  borderRightStyle:
                                                    "dotted",
                                                  borderRightColor:
                                                    "#cbd5e1",
                                                }
                                              : {}),
                                          }}
                                        >
                                          {avgFormatted}
                                        </td>,
                                      );
                                    }

                                    // Coluna do % (se Add% estiver ativo)
                                    if (canShowPct) {
                                      cells.push(
                                        <td
                                          key={`${key}__pct`}
                                          className="px-2 py-2.5 text-center text-[12px] text-slate-500 transition-colors "
                                          style={{
                                            backgroundColor: rowBg,
                                            width:
                                              PCT_COL_WIDTH,
                                            borderBottomWidth: 1,
                                            borderBottomStyle:
                                              "solid",
                                            borderBottomColor:
                                              "#e2e8f0",
                                            // Borda leve após o % (separa dados diferentes)
                                            ...(!isLastPeriod ||
                                            (isLastPeriod &&
                                              hasVariation)
                                              ? {
                                                  borderRightWidth: 1,
                                                  borderRightStyle:
                                                    "dotted",
                                                  borderRightColor:
                                                    "#cbd5e1",
                                                }
                                              : {}),
                                            // NUNCA borda forte aqui - a borda forte vai no Total
                                          }}
                                        >
                                          {renderPctValue(
                                            row[key] || 0,
                                            colTotal,
                                          )}
                                        </td>,
                                      );
                                    }
                                  },
                                );

                                if (isComp && hasVariation) {
                                  // Variation Vlr
                                  const diffVal =
                                    row[`__diff__${mId}`] || 0;
                                  const fv = formatVariation(
                                    diffVal,
                                    config?.format,
                                  );
                                  cells.push(
                                    <td
                                      key={`__diff__${mId}`}
                                      className={cn(
                                        "px-2 pr-3 py-2.5 whitespace-nowrap text-right text-[13px] transition-colors ",
                                        fv.color,
                                        depth === 0
                                          ? "font-medium"
                                          : "font-normal",
                                      )}
                                      style={{
                                        backgroundColor: rowBg,
                                        width:
                                          getPivotMetricWidth(
                                            mId,
                                          ),
                                        borderBottomWidth: 1,
                                        borderBottomStyle:
                                          "solid",
                                        borderBottomColor:
                                          "#e2e8f0",
                                        // Borda leve: sempre presente entre VAR VLR e VAR %
                                        borderRightWidth: 1,
                                        borderRightStyle:
                                          "dotted",
                                        borderRightColor:
                                          "#cbd5e1",
                                      }}
                                    >
                                      <div className="flex items-center justify-end gap-[3px]">
                                        <span className="w-[11px] shrink-0 flex items-center justify-end">
                                          {fv.arrow ===
                                            "up" && (
                                            <ArrowUp
                                              size={11}
                                            />
                                          )}
                                          {fv.arrow ===
                                            "down" && (
                                            <ArrowDown
                                              size={11}
                                            />
                                          )}
                                        </span>
                                        <span>{fv.text}</span>
                                      </div>
                                    </td>,
                                  );
                                  // Variation %
                                  const growthVal =
                                    row[`__growth__${mId}`] ||
                                    0;
                                  const fg =
                                    formatGrowth(growthVal);
                                  cells.push(
                                    <td
                                      key={`__growth__${mId}`}
                                      className={cn(
                                        "px-2 pr-3 py-2.5 whitespace-nowrap text-right text-[13px] transition-colors ",
                                        fg.color,
                                        depth === 0
                                          ? "font-medium"
                                          : "font-normal",
                                      )}
                                      style={{
                                        backgroundColor: rowBg,
                                        width:
                                          getPivotMetricWidth(
                                            mId,
                                          ),
                                        borderBottomWidth: 1,
                                        borderBottomStyle:
                                          "solid",
                                        borderBottomColor:
                                          "#e2e8f0",
                                        ...(!isLastMetric
                                          ? {
                                              borderRightWidth: 2,
                                              borderRightStyle:
                                                "dotted",
                                              borderRightColor:
                                                "#94a3b8",
                                            }
                                          : {
                                              borderRightWidth: 2,
                                              borderRightStyle:
                                                "solid",
                                              borderRightColor:
                                                "#e2e8f0",
                                            }),
                                      }}
                                    >
                                      <div className="flex items-center justify-end gap-[3px]">
                                        <span className="w-[11px] shrink-0 flex items-center justify-center">
                                          {fg.arrow ===
                                            "up" && (
                                            <ArrowUp
                                              size={11}
                                            />
                                          )}
                                          {fg.arrow ===
                                            "down" && (
                                            <ArrowDown
                                              size={11}
                                            />
                                          )}
                                        </span>
                                        <span>{fg.text}</span>
                                      </div>
                                    </td>,
                                  );
                                } else if (!isComp) {
                                  // Evolutionary: Total column — share % against pivotTotals total
                                  const totalKey = `__total__${mId}`;
                                  const grandTotal = pivotTotals
                                    ? pivotTotals[totalKey]
                                    : null;
                                  const canShowPct =
                                    showSharePct &&
                                    !PCT_EXCLUDED_METRICS.has(
                                      mId,
                                    );

                                  // Coluna do valor Total
                                  cells.push(
                                    <td
                                      key={totalKey}
                                      className={cn(
                                        "px-2 pr-3 py-2.5 text-right text-[14px] transition-colors whitespace-nowrap",
                                        depth === 0
                                          ? "text-slate-700 font-medium"
                                          : "text-slate-600 font-normal",
                                      )}
                                      style={{
                                        backgroundColor:
                                          totalColumnBg,
                                        width:
                                          getPivotTotalWidth(
                                            mId,
                                          ),
                                        borderBottomWidth: 1,
                                        borderBottomStyle:
                                          "solid",
                                        borderBottomColor:
                                          "#e2e8f0",
                                        ...(!canShowPct &&
                                        !isLastMetric
                                          ? {
                                              borderRightWidth: 2,
                                              borderRightStyle:
                                                "dotted",
                                              borderRightColor:
                                                "#94a3b8",
                                            }
                                          : !canShowPct &&
                                              isLastMetric
                                            ? {
                                                borderRightWidth: 2,
                                                borderRightStyle:
                                                  "solid",
                                                borderRightColor:
                                                  "#e2e8f0",
                                              }
                                            : {}),
                                      }}
                                    >
                                      {renderMetricValue(
                                        row[totalKey] || 0,
                                        mId,
                                      )}
                                    </td>,
                                  );

                                  // Coluna de média Total (se Add x̄ estiver ativo)
                                  if (showAverage) {
                                    const avgValue =
                                      calculateAverage(
                                        row[totalKey] || 0,
                                      );

                                    // Format average with 2 decimal places
                                    let avgFormatted = "";
                                    if (config) {
                                      switch (config.format) {
                                        case "currency":
                                          avgFormatted =
                                            new Intl.NumberFormat(
                                              "pt-BR",
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              },
                                            ).format(avgValue);
                                          break;
                                        case "percent":
                                        case "percent0":
                                        case "percent1": {
                                          const frac =
                                            config.format === "percent0"
                                              ? 0
                                              : 2;
                                          avgFormatted =
                                            new Intl.NumberFormat(
                                              "pt-BR",
                                              {
                                                style:
                                                  "percent",
                                                minimumFractionDigits: frac,
                                                maximumFractionDigits: frac,
                                              },
                                            ).format(avgValue);
                                          break;
                                        }
                                        case "integer":
                                          avgFormatted =
                                            new Intl.NumberFormat(
                                              "pt-BR",
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              },
                                            ).format(avgValue);
                                          break;
                                        case "decimal":
                                        case "decimal1":
                                          avgFormatted =
                                            new Intl.NumberFormat(
                                              "pt-BR",
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              },
                                            ).format(avgValue);
                                          break;
                                        case "days":
                                          avgFormatted = `${avgValue.toFixed(2)} dias`;
                                          break;
                                        default:
                                          avgFormatted =
                                            avgValue.toFixed(2);
                                      }
                                    } else {
                                      avgFormatted =
                                        avgValue.toFixed(2);
                                    }

                                    cells.push(
                                      <td
                                        key={`${totalKey}__avg`}
                                        className={cn(
                                          "px-2 pr-3 py-2.5 text-right text-[13px] transition-colors whitespace-nowrap",
                                          depth === 0
                                            ? "text-slate-600 font-medium"
                                            : "text-slate-500 font-normal",
                                        )}
                                        style={{
                                          backgroundColor:
                                            totalColumnBg,
                                          width: AVG_COL_WIDTH,
                                          borderBottomWidth: 1,
                                          borderBottomStyle:
                                            "solid",
                                          borderBottomColor:
                                            "#e2e8f0",
                                          ...(!canShowPct &&
                                          !isLastMetric
                                            ? {
                                                borderRightWidth: 2,
                                                borderRightStyle:
                                                  "dotted",
                                                borderRightColor:
                                                  "#94a3b8",
                                              }
                                            : !canShowPct &&
                                                isLastMetric
                                              ? {
                                                  borderRightWidth: 2,
                                                  borderRightStyle:
                                                    "solid",
                                                  borderRightColor:
                                                    "#e2e8f0",
                                                }
                                              : {}),
                                        }}
                                      >
                                        {avgFormatted}
                                      </td>,
                                    );
                                  }

                                  // Coluna do % Total (se Add% estiver ativo)
                                  if (canShowPct) {
                                    cells.push(
                                      <td
                                        key={`${totalKey}__pct`}
                                      className="px-2 py-2.5 text-center text-[12px] text-slate-500 transition-colors"
                                        style={{
                                        backgroundColor:
                                          totalColumnBg,
                                          width: PCT_COL_WIDTH,
                                          borderBottomWidth: 1,
                                          borderBottomStyle:
                                            "solid",
                                          borderBottomColor:
                                            "#e2e8f0",
                                          ...(!isLastMetric
                                            ? {
                                                borderRightWidth: 2,
                                                borderRightStyle:
                                                  "dotted",
                                                borderRightColor:
                                                  "#94a3b8",
                                              }
                                            : {
                                                borderRightWidth: 2,
                                                borderRightStyle:
                                                  "solid",
                                                borderRightColor:
                                                  "#e2e8f0",
                                              }),
                                        }}
                                      >
                                        {renderPctValue(
                                          row[totalKey] || 0,
                                          grandTotal,
                                        )}
                                      </td>,
                                    );
                                  }
                                }
                                return cells;
                              })
                            ) : (
                              renderEvoPeriodFirstPivotDataCells(
                                row,
                                depth,
                                rowBg,
                              )
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  /* ─── STANDARD TABLE (non-pivot) ─── */
                  <table
                    className={ANALYSIS_TABLE_CLASS}
                    style={ANALYSIS_TABLE_STYLE}
                  >
                    <thead className="z-[40]">
                      <tr>
                        <th
                          style={{
                            width:
                              columnWidths["grouping"] || 350,
                            ...bc("#e2e8f0"),
                            backgroundColor: TABLE_HEADER_BG,
                            color: TABLE_HEADER_TEXT,
                            borderBottomWidth: 2,
                            borderBottomStyle: "solid",
                            borderBottomColor: "rgba(241, 241, 241, 0.25)",
                            borderRightWidth: 1,
                            borderRightStyle: "solid",
                            boxShadow:
                              "1px 0 0 0 rgba(148,163,184,0.18), 6px 0 16px -4px rgba(0,0,0,0.08), 2px 0 6px -2px rgba(0,0,0,0.05)",
                            ...stickyStdHeaderCornerStyle(),
                          }}
                          className="relative px-4 py-3 text-left text-xs font-bold uppercase tracking-wider group select-none"
                        >
                          <div
                            className="group flex cursor-pointer items-center gap-2 overflow-hidden pr-1 transition-colors hover:opacity-90"
                            onClick={() =>
                              handleSort(ANALYSIS_ATTRIBUTE_SORT_KEY)
                            }
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleSort(ANALYSIS_ATTRIBUTE_SORT_KEY);
                              }
                            }}
                          >
                            <span className="min-w-0 flex-1 truncate text-[14px]">
                              {groupingLabel}
                            </span>
                            <span className="shrink-0">
                              {renderSortIndicator(
                                ANALYSIS_ATTRIBUTE_SORT_KEY,
                              )}
                            </span>
                          </div>
                          <div
                            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-[#314158]/40 active:bg-[#314158] transition-colors z-[60]"
                            onMouseDown={(e) =>
                              handleMouseDown(e, "grouping")
                            }
                          />
                        </th>

                        {orderedMetrics.map(
                          (metricId: string) => {
                            const metric = METRICS_LIST.find(
                              (m) => m.id === metricId,
                            );
                            if (!metric) return null;
                            const abbrev =
                              METRIC_ABBREVIATIONS[metricId] ||
                              getMetricTableLabel(metricId, metric.label);
                            const canShowPct =
                              showSharePct &&
                              !PCT_EXCLUDED_METRICS.has(
                                metricId,
                              );
                            const isLastMetric =
                              metricId ===
                              orderedMetrics[
                                orderedMetrics.length - 1
                              ];

                            return (
                              <React.Fragment key={metric.id}>
                                {/* Coluna da métrica */}
                                <RadixTooltip.Root
                                  delayDuration={300}
                                >
                                  <RadixTooltip.Trigger asChild>
                                    <th
                                      style={{
                                        width:
                                          getStdMetricWidth(
                                            metricId,
                                          ),
                                        ...bc("#e2e8f0"),
                                        backgroundColor:
                                          TABLE_HEADER_BG,
                                        color: TABLE_HEADER_TEXT,
                                        borderBottomWidth: 2,
                                        borderBottomStyle:
                                          "solid",
                                        borderBottomColor:
                                          "rgba(241, 241, 241, 0.25)",
                                        ...stickyStdHeaderCellStyle(),
                                        ...(canShowPct
                                          ? {}
                                          : {
                                              borderRightWidth:
                                                isLastMetric
                                                  ? 2
                                                  : 1,
                                              borderRightStyle:
                                                "solid",
                                              borderRightColor:
                                                "#e2e8f0",
                                            }),
                                      }}
                                      className="relative cursor-pointer px-3 py-3 text-left text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-90"
                                      onClick={() =>
                                        handleSort(metric.id)
                                      }
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="flex-1 select-none truncate text-right text-[13px]">
                                          {abbrev}
                                        </span>
                                        <div className="shrink-0">
                                          {sortConfig?.key ===
                                          metric.id ? (
                                            sortConfig.direction ===
                                            "asc" ? (
                                              <ArrowUp
                                                size={13}
                                              />
                                            ) : (
                                              <ArrowDown
                                                size={13}
                                              />
                                            )
                                          ) : (
                                            <ArrowDown
                                              size={13}
                                              className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                            />
                                          )}
                                        </div>
                                      </div>
                                      <div
                                        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-[#314158]/40 active:bg-[#314158] transition-colors z-40"
                                        onMouseDown={(e) =>
                                          handleMouseDown(
                                            e,
                                            metric.id,
                                          )
                                        }
                                        onClick={(e) =>
                                          e.stopPropagation()
                                        }
                                      />
                                    </th>
                                  </RadixTooltip.Trigger>
                                  <RadixTooltip.Portal>
                                    <RadixTooltip.Content
                                      className="z-50 bg-slate-900 text-white text-xs font-medium px-3 py-2 rounded shadow-lg animate-in fade-in zoom-in-95 max-w-[250px]"
                                      sideOffset={5}
                                    >
                                      {getMetricSidebarLabel(metric.id, metric.label)}
                                      <RadixTooltip.Arrow className="fill-slate-900" />
                                    </RadixTooltip.Content>
                                  </RadixTooltip.Portal>
                                </RadixTooltip.Root>

                                {/* Coluna de x̄ (se ADD x̄ estiver ativo) */}
                                {showAverage && (
                                  <th
                                    style={{
                                      width: AVG_COL_WIDTH,
                                      ...bc("#e2e8f0"),
                                      backgroundColor:
                                        TABLE_HEADER_BG,
                                      color: TABLE_HEADER_TEXT,
                                      borderBottomWidth: 2,
                                      borderBottomStyle:
                                        "solid",
                                      borderBottomColor:
                                        "rgba(241, 241, 241, 0.25)",
                                      ...stickyStdHeaderCellStyle(),
                                      ...(!canShowPct &&
                                      isLastMetric
                                        ? {
                                            borderRightWidth: 2,
                                            borderRightStyle:
                                              "solid",
                                            borderRightColor:
                                              "#e2e8f0",
                                          }
                                        : {}),
                                    }}
                                    className="px-2 py-3 text-xs font-bold uppercase tracking-wider"
                                  >
                                    <div className="text-center text-[11px]">
                                      x̄ {averagePeriodType}
                                    </div>
                                  </th>
                                )}

                                {/* Coluna de % (se ADD % estiver ativo) */}
                                {canShowPct && (
                                  <th
                                    style={{
                                      width: PCT_COL_WIDTH,
                                      ...bc("#e2e8f0"),
                                      backgroundColor:
                                        TABLE_HEADER_BG,
                                      color: TABLE_HEADER_TEXT,
                                      borderBottomWidth: 2,
                                      borderBottomStyle:
                                        "solid",
                                      borderBottomColor:
                                        "rgba(241, 241, 241, 0.25)",
                                      ...stickyStdHeaderCellStyle(),
                                      borderRightWidth:
                                        isLastMetric ? 2 : 1,
                                      borderRightStyle: "solid",
                                      borderRightColor:
                                        "#e2e8f0",
                                    }}
                                    className="px-2 py-3 text-xs font-bold uppercase tracking-wider"
                                  >
                                    <div className="text-center text-[11px]">
                                      %
                                    </div>
                                  </th>
                                )}
                              </React.Fragment>
                            );
                          },
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {totals && (
                        <tr
                          className="font-bold text-slate-800"
                          style={{
                            boxShadow:
                              "0 2px 6px -1px rgba(0,0,0,0.07)",
                          }}
                        >
                          <td
                            style={{
                              width:
                                columnWidths["grouping"] || 350,
                              ...stickyStdTotalCornerStyle(),
                              backgroundColor: tableTheme.rowEvenBg,
                              ...bc("#e2e8f0"),
                              borderBottomWidth: 2,
                              borderBottomStyle: "solid",
                              borderBottomColor: "#e2e8f0",
                              borderRightWidth: 1,
                              borderRightStyle: "solid",
                              boxShadow:
                                "1px 0 0 0 rgba(148,163,184,0.18), 6px 0 16px -4px rgba(0,0,0,0.08), 2px 0 6px -2px rgba(0,0,0,0.05)",
                            }}
                            className="px-4 py-2.5 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] uppercase tracking-wide"
                          >
                            Total
                          </td>
                          {orderedMetrics.map(
                            (metricId: string) => {
                              const canShowPct =
                                showSharePct &&
                                hasMultipleRows &&
                                !PCT_EXCLUDED_METRICS.has(
                                  metricId,
                                );
                              const isLastMetric =
                                metricId ===
                                orderedMetrics[
                                  orderedMetrics.length - 1
                                ];
                              return (
                                <React.Fragment key={metricId}>
                                  {/* Coluna do valor */}
                                  <td
                                    style={{
                                      width:
                                        getStdMetricWidth(
                                          metricId,
                                        ),
                                      ...stickyStdTotalCellStyle(),
                                      backgroundColor:
                                        tableTheme.rowEvenBg,
                                      ...bc("#e2e8f0"),
                                      borderBottomWidth: 2,
                                      borderBottomStyle:
                                        "solid",
                                      borderBottomColor:
                                        "#e2e8f0",
                                      ...(!showAverage &&
                                      !canShowPct &&
                                      isLastMetric
                                        ? {
                                            borderRightWidth: 2,
                                            borderRightStyle:
                                              "solid",
                                            borderRightColor:
                                              "#e2e8f0",
                                          }
                                        : {}),
                                    }}
                                    className="h-[46px] px-3 py-2.5 text-right text-[13px] whitespace-nowrap overflow-hidden text-ellipsis"
                                  >
                                    {renderMetricValue(
                                      totals[metricId],
                                      metricId,
                                    )}
                                  </td>
                                  {/* Coluna do x̄ */}
                                  {showAverage && (
                                    <td
                                      style={{
                                        width: AVG_COL_WIDTH,
                                        ...stickyStdTotalCellStyle(),
                                        backgroundColor:
                                          tableTheme.rowEvenBg,
                                        ...bc("#e2e8f0"),
                                        borderBottomWidth: 2,
                                        borderBottomStyle:
                                          "solid",
                                        borderBottomColor:
                                          "#e2e8f0",
                                        ...(!canShowPct &&
                                        isLastMetric
                                          ? {
                                              borderRightWidth: 2,
                                              borderRightStyle:
                                                "solid",
                                              borderRightColor:
                                                "#e2e8f0",
                                            }
                                          : {}),
                                      }}
                                      className="h-[46px] px-2 py-2.5 text-center text-[12px] text-slate-600"
                                    >
                                      {(() => {
                                        const avgValue =
                                          calculateAverageForTotal(
                                            totals[metricId],
                                          );
                                        return avgValue !== null
                                          ? formatNumber(
                                              avgValue,
                                              2,
                                            )
                                          : "—";
                                      })()}
                                    </td>
                                  )}
                                  {/* Coluna do % */}
                                  {canShowPct && (
                                    <td
                                      style={{
                                        width: PCT_COL_WIDTH,
                                        ...stickyStdTotalCellStyle(),
                                        backgroundColor:
                                          tableTheme.rowEvenBg,
                                        ...bc("#e2e8f0"),
                                        borderBottomWidth: 2,
                                        borderBottomStyle:
                                          "solid",
                                        borderBottomColor:
                                          "#e2e8f0",
                                        borderRightWidth:
                                          isLastMetric ? 2 : 1,
                                        borderRightStyle:
                                          "solid",
                                        borderRightColor:
                                          "#e2e8f0",
                                      }}
                                      className="h-[46px] px-2 py-2.5 text-center text-[12px] text-slate-500"
                                    >
                                      100%
                                    </td>
                                  )}
                                </React.Fragment>
                              );
                            },
                          )}
                        </tr>
                      )}
                      {finalRows.map((row: any, dataRowIndex: number) => {
                        const depth = row.depth ?? 0;
                        const isExpanded =
                          expandedRows.includes(row.id);
                        const hasChildren =
                          row.hasChildren ||
                          row.children?.length > 0;

                        const indentPx = 16 + depth * 32;
                        const rowBg = resolveTableRowBg(
                          row.id,
                          dataRowIndex,
                        );

                        return (
                          <tr
                            key={row.id}
                            className="transition-colors"
                            onMouseEnter={() =>
                              setHoveredTableRowId(row.id)
                            }
                            onMouseLeave={() =>
                              setHoveredTableRowId(null)
                            }
                          >
                            <td
                              style={{
                                width:
                                  columnWidths["grouping"] ||
                                  350,
                                backgroundColor: rowBg,
                                ...bc("#e2e8f0"),
                                borderRightWidth: 1,
                                borderRightStyle: "solid",
                                borderBottomWidth: 1,
                                borderBottomStyle: "solid",
                                borderBottomColor: "#e2e8f0",
                                boxShadow:
                                  "1px 0 0 0 rgba(148,163,184,0.18), 6px 0 16px -4px rgba(0,0,0,0.08), 2px 0 6px -2px rgba(0,0,0,0.05)",
                              }}
                              className={cn(
                                "sticky left-0 z-[35] overflow-hidden py-2 text-sm whitespace-nowrap",
                                depth === 0
                                  ? "font-semibold text-slate-800"
                                  : "font-medium text-slate-700",
                              )}
                            >
                              <div className="flex items-center">
                                <div
                                  className="flex items-center gap-3 w-full overflow-hidden"
                                  style={{
                                    paddingLeft: `${indentPx}px`,
                                  }}
                                >
                                  {hasChildren ? (
                                    <button
                                      onClick={() =>
                                        toggleRow(row.id)
                                      }
                                      className="p-1 hover:bg-slate-200 rounded transition-colors shrink-0"
                                    >
                                      {isExpanded ? (
                                        <ChevronDown
                                          size={14}
                                        />
                                      ) : (
                                        <ChevronRight
                                          size={14}
                                        />
                                      )}
                                    </button>
                                  ) : (
                                    <div className="w-[22px] shrink-0" />
                                  )}
                                  <span className="truncate text-[14px]">
                                    {row.label}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {orderedMetrics.map(
                              (metricId: string) => {
                                const canShowPct =
                                  showSharePct &&
                                  !PCT_EXCLUDED_METRICS.has(
                                    metricId,
                                  );
                                const isLastMetric =
                                  metricId ===
                                  orderedMetrics[
                                    orderedMetrics.length - 1
                                  ];
                                return (
                                  <React.Fragment
                                    key={metricId}
                                  >
                                    {/* Coluna do valor */}
                                    <td
                                      style={{
                                        backgroundColor: rowBg,
                                        width:
                                          getStdMetricWidth(
                                            metricId,
                                          ),
                                        ...bc("#e2e8f0"),
                                        borderBottomWidth: 1,
                                        borderBottomStyle:
                                          "solid",
                                        borderBottomColor:
                                          "#e2e8f0",
                                        ...(canShowPct
                                          ? {}
                                          : {
                                              borderRightWidth:
                                                isLastMetric
                                                  ? 2
                                                  : 1,
                                              borderRightStyle:
                                                "solid",
                                              borderRightColor:
                                                "#e2e8f0",
                                            }),
                                      }}
                                      className={cn(
                                        "overflow-hidden text-ellipsis whitespace-nowrap px-3 py-3 text-right text-[13px] transition-colors",
                                        depth === 0
                                          ? "text-slate-700 font-medium"
                                          : "text-slate-600 font-normal",
                                      )}
                                    >
                                      {renderMetricValue(
                                        row[metricId] ?? 0,
                                        metricId,
                                      )}
                                    </td>
                                    {/* Coluna do x̄ */}
                                    {showAverage && (
                                      <td
                                        style={{
                                          backgroundColor: rowBg,
                                          width: AVG_COL_WIDTH,
                                          ...bc("#e2e8f0"),
                                          borderBottomWidth: 1,
                                          borderBottomStyle: "solid",
                                          borderBottomColor: "#e2e8f0",
                                        }}
                                        className="px-2 py-3 text-center text-[12px] text-slate-600 transition-colors"
                                      >
                                        {(() => {
                                          const avgValue = calculateAverageForTotal(
                                            row[metricId] ?? 0,
                                          );
                                          return avgValue !== null
                                            ? formatNumber(avgValue, 2)
                                            : "—";
                                        })()}
                                      </td>
                                    )}
                                    {/* Coluna do % */}
                                    {canShowPct && (
                                      <td
                                        style={{
                                          backgroundColor: rowBg,
                                          width: PCT_COL_WIDTH,
                                          ...bc("#e2e8f0"),
                                          borderBottomWidth: 1,
                                          borderBottomStyle:
                                            "solid",
                                          borderBottomColor:
                                            "#e2e8f0",
                                          borderRightWidth:
                                            isLastMetric
                                              ? 2
                                              : 1,
                                          borderRightStyle:
                                            "solid",
                                          borderRightColor:
                                            "#e2e8f0",
                                        }}
                                        className="px-2 py-3 text-center text-[12px] text-slate-500 transition-colors"
                                      >
                                        {renderPctValue(
                                          row[metricId] ?? 0,
                                          totals?.[metricId],
                                        )}
                                      </td>
                                    )}
                                  </React.Fragment>
                                );
                              },
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                {finalRows.length === 0 && (
                  <div className="absolute inset-0 top-[85px] z-0 flex h-64 flex-col items-center justify-center text-slate-400">
                    <Package
                      size={32}
                      className="mb-2 text-slate-300"
                    />
                    <p className="text-sm">
                      Nenhum dado encontrado para os filtros
                      selecionados.
                    </p>
                  </div>
                )}
                </TableHatchSurface>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
