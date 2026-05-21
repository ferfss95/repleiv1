import React from "react";
import {
  ChevronDown,
  Check,
  CalendarRange,
  CalendarCheck,
  CalendarDays,
} from "lucide-react";
import { cn } from "../../utils";
import {
  PERIOD_OPTIONS,
  MONTHS_OPTIONS,
  YEARS_OPTIONS,
  formatDateBRShort,
  MAX_WEEKLY_DAYS,
  type Module,
} from "../../constants";
import { groupMonthsByYear, getTodayFormatted } from "../../dateUtils";
import {
  getSelectableMonthsForYear,
  isMonthPeriodBlocked,
  isYearPeriodSelectable,
} from "../../utils/dateSelectionRules";
import { PeriodBlockedOptionTooltip } from "../calendar/PeriodBlockedTooltip";
import { InteractiveMandala } from "../InteractiveMandala";
import { AnalysisSelector } from "../AnalysisSelector";
import { DateRangePicker } from "../DateRangePicker";
import { Calendar } from "../ui/calendar";
import { MdsaaToggle } from "../MdsaaToggle";
import { LyToggle } from "../LyToggle";
import { LockedTooltip } from "../LockedTooltip";
import type { AnalysisMode } from "../../types/wizard";
import { NEUTRAL_PALETTE, type ModuleColors } from "../../constants/moduleColors";
import { SHOW_DIAS_DA_SEMANA_PERIOD_UI } from "../../data/periodSelectionUiVisibility";

const PERIOD_GRANULARITY_LABELS: Record<
  (typeof PERIOD_OPTIONS)[number],
  string
> = {
  Diário: "Dia",
  Mensal: "Mês",
  Anual: "Ano",
};

const PERIOD_GRANULARITY_DESCRIPTIONS: Record<
  (typeof PERIOD_OPTIONS)[number],
  string
> = {
  Diário: "Seleção livre de datas",
  Mensal: "Meses completos",
  Anual: "Anos completos",
};

interface SelectionViewProps {
  // UI state
  isPeriodEditable: boolean;
  analysisMode: AnalysisMode;
  setAnalysisMode: (mode: AnalysisMode) => void;
  // Module
  currentModule: Module;
  handleModuleChange: (module: Module) => void;
  moduleColors: ModuleColors;
  // Period type
  periodType: (typeof PERIOD_OPTIONS)[number];
  setPeriodType: React.Dispatch<React.SetStateAction<(typeof PERIOD_OPTIONS)[number]>>;
  dailySubType: "periodo" | "diasdasemana";
  setDailySubType: React.Dispatch<React.SetStateAction<"periodo" | "diasdasemana">>;
  // Date range (P1)
  dateRange: { start: string; end: string };
  setDateRange: React.Dispatch<React.SetStateAction<{ start: string; end: string }>>;
  selectedMonths: string[];
  setSelectedMonths: React.Dispatch<React.SetStateAction<string[]>>;
  selectedYears: string[];
  setSelectedYears: React.Dispatch<React.SetStateAction<string[]>>;
  expandedYears: Set<string>;
  setExpandedYears: React.Dispatch<React.SetStateAction<Set<string>>>;
  selectedSpecificDays: string[];
  setSelectedSpecificDays: React.Dispatch<React.SetStateAction<string[]>>;
  // Comparative period 1
  compDateRange1: { start: string; end: string };
  setCompDateRange1: React.Dispatch<React.SetStateAction<{ start: string; end: string }>>;
  compMonths1: string[];
  setCompMonths1: React.Dispatch<React.SetStateAction<string[]>>;
  compYears1: string[];
  setCompYears1: React.Dispatch<React.SetStateAction<string[]>>;
  compSpecificDays1: string[];
  setCompSpecificDays1: React.Dispatch<React.SetStateAction<string[]>>;
  compExpandedYears1: Set<string>;
  setCompExpandedYears1: React.Dispatch<React.SetStateAction<Set<string>>>;
  // Comparative period 2 (read-only in this view)
  compDateRange2: { start: string; end: string };
  compMonths2: string[];
  compYears2: string[];
  compSpecificDays2: string[];
  compExpandedYears2: Set<string>;
  setCompExpandedYears2: React.Dispatch<React.SetStateAction<Set<string>>>;
  // MDSAA / LY (comparativo)
  mdsaaActive: boolean;
  setMdsaaActive: (active: boolean) => void;
  lyActive: boolean;
  setLyActive: (active: boolean) => void;
  monthsP2ScrollRef: React.RefObject<HTMLDivElement | null>;
  // Manual P2 handlers
  handleManualP2DateRangeChange: (field: "start" | "end", value: string) => void;
  handleManualP2SpecificDaysChange: (days: string[]) => void;
  handleManualP2MonthsChange: (months: string[]) => void;
  handleManualP2YearsChange: (years: string[]) => void;
}

export const SelectionView = React.memo<SelectionViewProps>(function SelectionView({
  isPeriodEditable,
  analysisMode,
  setAnalysisMode,
  currentModule,
  handleModuleChange,
  moduleColors,
  periodType,
  setPeriodType,
  dailySubType,
  setDailySubType,
  dateRange,
  setDateRange,
  selectedMonths,
  setSelectedMonths,
  selectedYears,
  setSelectedYears,
  expandedYears,
  setExpandedYears,
  selectedSpecificDays,
  setSelectedSpecificDays,
  compDateRange1,
  setCompDateRange1,
  compMonths1,
  setCompMonths1,
  compYears1,
  setCompYears1,
  compSpecificDays1,
  setCompSpecificDays1,
  compExpandedYears1,
  setCompExpandedYears1,
  compDateRange2,
  compMonths2,
  compYears2,
  compSpecificDays2,
  compExpandedYears2,
  setCompExpandedYears2,
  mdsaaActive,
  setMdsaaActive,
  lyActive,
  setLyActive,
  monthsP2ScrollRef,
  handleManualP2DateRangeChange,
  handleManualP2SpecificDaysChange,
  handleManualP2MonthsChange,
  handleManualP2YearsChange,
}: SelectionViewProps) {
  const weeklyOverLimit = selectedSpecificDays.length > MAX_WEEKLY_DAYS;
  const [hoveredPeriodOption, setHoveredPeriodOption] = React.useState<
    (typeof PERIOD_OPTIONS)[number] | null
  >(null);

  return (
                      <div className="mb-5 flex gap-5 items-stretch">
                        {/* ── Módulo + Análise card ── */}
                        <div
                          className={cn(
                            "bg-white rounded-[14px] border border-[#D9D9D9] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-[21px] flex flex-col shrink-0 gap-[20px] items-center justify-between",
                            !isPeriodEditable &&
                              "opacity-60 pointer-events-none",
                          )}
                          style={{ width: 288 }}
                        >
                          {/* Mandala */}
                          <div className="flex-1 flex items-center justify-center w-full min-h-[220px]">
                            <div className="w-[220px] h-[220px] shrink-0">
                              <InteractiveMandala
                                selectedModule={currentModule}
                                onModuleSelect={(module) =>
                                  isPeriodEditable &&
                                  handleModuleChange(module)
                                }
                              />
                            </div>
                          </div>
    
                          {/* Dropdown de Análise */}
                          <div className="shrink-0 w-full">
                            <AnalysisSelector
                              value={analysisMode}
                              onChange={(mode) =>
                                isPeriodEditable &&
                                setAnalysisMode(mode)
                              }
                              supportsHoraAHora={
                                currentModule === "LOJA" ||
                                currentModule === "INDICADORES" ||
                                currentModule === "PRODUTO"
                              }
                              disabled={!isPeriodEditable}
                            />
                          </div>
                        </div>
    
                        {/* Período */}
                        <LockedTooltip
                          isLocked={!isPeriodEditable}
                          content="A ediç��o só é possível no modo de seleção."
                        >
                          <div
                            className="bg-white rounded-[14px] border border-[#D9D9D9] shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex flex-col flex-1 min-w-0 px-[21px] pt-[16px] pb-[21px]"
                            style={{ height: 334 }}
                          >
                            <div className="flex items-start mb-3 shrink-0">
                              {/* Título alinhado com sidebar */}
                              <div
                                className="shrink-0"
                                style={{ width: 240 }}
                              >
                                <h3 className="text-[14px] font-bold uppercase tracking-[0.6px] text-[#314158]">
                                  DEFINIR PERÍODO
                                </h3>
                              </div>
    
                              {/* Tabs container - apenas para Diário */}
                              {periodType === "Diário" &&
                                (SHOW_DIAS_DA_SEMANA_PERIOD_UI ? (
                                  <div className="flex items-center gap-6 border-b border-[#e2e8f0] shrink-0">
                                    <button
                                      onClick={() =>
                                        isPeriodEditable &&
                                        setDailySubType("periodo")
                                      }
                                      disabled={!isPeriodEditable}
                                      className={cn(
                                        "pb-2 text-[13px] font-medium transition-all duration-200 flex items-center gap-2 border-b-2",
                                        dailySubType === "periodo"
                                          ? "text-[#314158] border-[#314158]"
                                          : "text-[#90A1B9] hover:text-[#314158] border-transparent",
                                        !isPeriodEditable &&
                                          "cursor-not-allowed opacity-50",
                                      )}
                                    >
                                      <CalendarRange size={14} />
                                      Dias Corridos
                                    </button>
                                    <button
                                      onClick={() =>
                                        isPeriodEditable &&
                                        setDailySubType("diasdasemana")
                                      }
                                      disabled={!isPeriodEditable}
                                      className={cn(
                                        "pb-2 text-[13px] font-medium transition-all duration-200 flex items-center gap-2 border-b-2",
                                        dailySubType === "diasdasemana"
                                          ? "text-[#314158] border-[#314158]"
                                          : "text-[#90A1B9] hover:text-[#314158] border-transparent",
                                        !isPeriodEditable &&
                                          "cursor-not-allowed opacity-50",
                                      )}
                                    >
                                      <CalendarCheck size={14} />
                                      Dias da Semana
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 pb-2 border-b-2 border-[#314158] shrink-0">
                                    <CalendarRange
                                      size={14}
                                      className="text-[#314158]"
                                    />
                                    <span className="text-[13px] font-medium text-[#314158]">
                                      Dias Corridos
                                    </span>
                                  </div>
                                ))}
    
                              {/* Tabs para Mensal */}
                              {periodType === "Mensal" && (
                                <div className="flex items-center gap-6 border-b border-[#e2e8f0] shrink-0">
                                  <div className="flex items-center gap-2 pb-2 border-b-2 border-[#314158]">
                                    <CalendarDays
                                      size={14}
                                      className="text-[#314158]"
                                    />
                                    <span className="text-[13px] font-medium text-[#314158]">
                                      Selecionar mês
                                    </span>
                                  </div>
                                </div>
                              )}
    
                              {/* Tabs para Anual */}
                              {periodType === "Anual" && (
                                <div className="flex items-center gap-6 border-b border-[#e2e8f0] shrink-0">
                                  <div className="flex items-center gap-2 pb-2 border-b-2 border-[#314158]">
                                    <CalendarRange
                                      size={14}
                                      className="text-[#314158]"
                                    />
                                    <span className="text-[13px] font-medium text-[#314158]">
                                      Selecionar ano
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
    
                            <div className="flex gap-5 flex-1 min-h-0">
                              {/* Sidebar Selection */}
                              <div
                                className="flex flex-col gap-3 pr-5 shrink-0"
                                style={{ width: 220 }}
                              >
                                <p className="text-[11px] text-[#62748e] leading-[16.5px]">
                                  Selecionar por:
                                </p>
                                <div className="flex flex-col gap-2">
                                  {PERIOD_OPTIONS.map((opt) => {
                                    const isSelected = periodType === opt;
                                    const isHovered =
                                      isPeriodEditable &&
                                      hoveredPeriodOption === opt;
                                    const borderColor = !isPeriodEditable
                                      ? isSelected
                                        ? moduleColors.primaryColor
                                        : NEUTRAL_PALETTE.border
                                      : isHovered
                                        ? NEUTRAL_PALETTE.title
                                        : isSelected
                                          ? moduleColors.primaryColor
                                          : NEUTRAL_PALETTE.border;
                                    const boxShadow =
                                      isPeriodEditable && isHovered
                                        ? "0 0 0 3px rgba(86, 104, 120, 0.3), 0 2px 6px rgba(0, 0, 0, 0.06)"
                                        : undefined;
                                    const textColor = isSelected
                                      ? moduleColors.iconColor
                                      : NEUTRAL_PALETTE.muted;
                                    return (
                                      <label
                                        key={opt}
                                        onMouseEnter={() =>
                                          isPeriodEditable &&
                                          setHoveredPeriodOption(opt)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredPeriodOption(null)
                                        }
                                        className={cn(
                                          "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer select-none transition-all duration-200 border border-solid",
                                          !isPeriodEditable &&
                                            "cursor-not-allowed opacity-50",
                                        )}
                                        style={{
                                          backgroundColor: isSelected
                                            ? moduleColors.backgroundColor
                                            : "transparent",
                                          borderColor,
                                          boxShadow,
                                        }}
                                      >
                                        <input
                                          type="radio"
                                          name="period-type"
                                          checked={
                                            periodType === opt
                                          }
                                          onChange={() =>
                                            isPeriodEditable &&
                                            setPeriodType(opt)
                                          }
                                          disabled={
                                            !isPeriodEditable
                                          }
                                          className="sr-only"
                                        />
                                        <div
                                          className="w-4 h-4 rounded-full border-2 border-solid flex items-center justify-center transition-all shrink-0 bg-white"
                                          style={{
                                            borderColor: isSelected
                                              ? moduleColors.iconColor
                                              : "rgba(217, 217, 217, 0.5)",
                                          }}
                                        >
                                          {isSelected && (
                                            <div
                                              className="w-2 h-2 rounded-full shrink-0"
                                              style={{
                                                backgroundColor:
                                                  moduleColors.iconColor,
                                              }}
                                            />
                                          )}
                                        </div>
                                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                          <span
                                            className="text-[13px] font-bold"
                                            style={{ color: textColor }}
                                          >
                                            {
                                              PERIOD_GRANULARITY_LABELS[
                                                opt
                                              ]
                                            }
                                          </span>
                                          <span
                                            className="text-[10px] font-normal leading-tight"
                                            style={{ color: textColor }}
                                          >
                                            {
                                              PERIOD_GRANULARITY_DESCRIPTIONS[
                                                opt
                                              ]
                                            }
                                          </span>
                                        </div>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
    
                              {/* Main Content Area */}
                              <div className="flex-1 min-w-0 flex flex-col gap-3 pt-2">
                                {/* ═══ PADRÃO & EVOLUÇÃO MODE ═══ */}
                                {analysisMode !== "comparativo" && (
                                  <>
                                    {periodType === "Diário" &&
                                      (SHOW_DIAS_DA_SEMANA_PERIOD_UI
                                        ? dailySubType === "periodo"
                                        : true) && (
                                        <div className="flex flex-col gap-3 h-full w-[320px] shrink-0 mt-[14px]">
                                          <DateRangePicker
                                            analysisMode={analysisMode}
                                            startDate={
                                              dateRange.start
                                            }
                                            endDate={dateRange.end}
                                            onStartChange={(v) =>
                                              isPeriodEditable &&
                                              setDateRange(
                                                (prev) => ({
                                                  ...prev,
                                                  start: v,
                                                }),
                                              )
                                            }
                                            onEndChange={(v) =>
                                              isPeriodEditable &&
                                              setDateRange(
                                                (prev) => ({
                                                  ...prev,
                                                  end: v,
                                                }),
                                              )
                                            }
                                            disabled={
                                              !isPeriodEditable
                                            }
                                          />
                                          <div className="flex-1" />
                                        </div>
                                      )}
    
                                    {SHOW_DIAS_DA_SEMANA_PERIOD_UI &&
                                      periodType === "Diário" &&
                                      dailySubType === "diasdasemana" && (
                                        <div className="flex flex-col gap-2 h-full min-h-0 w-[212px] shrink-0">
                                          {weeklyOverLimit && (
                                            <div className="text-[10px] text-[#9B2C2C] bg-[#FED7D7] px-2 py-1 rounded-md shrink-0">
                                              Máximo de{" "}
                                              {MAX_WEEKLY_DAYS}{" "}
                                              dias. Reduza a
                                              seleção.
                                            </div>
                                          )}
    
                                          {/* Inline calendar multi-select */}
                                          <div className="shrink-0 w-fit">
                                            <Calendar
                                              analysisMode={analysisMode}
                                              className="p-2 !w-[245px]"
                                              mode="multiple"
                                              selected={selectedSpecificDays.map(
                                                (s) => {
                                                  const p =
                                                    s.split("/");
                                                  return new Date(
                                                    +p[2],
                                                    +p[1] - 1,
                                                    +p[0],
                                                  );
                                                },
                                              )}
                                              onSelect={(days) => {
                                                if (!days) {
                                                  setSelectedSpecificDays(
                                                    [],
                                                  );
                                                  return;
                                                }
                                                const formatted =
                                                  days.map((d) =>
                                                    formatDateBRShort(
                                                      d,
                                                    ),
                                                  );
                                                if (
                                                  formatted.length <=
                                                  MAX_WEEKLY_DAYS
                                                )
                                                  setSelectedSpecificDays(
                                                    formatted,
                                                  );
                                              }}
                                              classNames={{
                                                months:
                                                  "flex flex-col",
                                                month:
                                                  "flex flex-col gap-1",
                                                caption:
                                                  "flex justify-center pt-1 pb-1.5 relative items-center",
                                                caption_label:
                                                  "text-[12px] font-semibold text-[#314158]",
                                                nav: "flex items-center gap-1",
                                                nav_button:
                                                  "inline-flex items-center justify-center rounded-md size-6 bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors",
                                                nav_button_previous:
                                                  "absolute left-0",
                                                nav_button_next:
                                                  "absolute right-0",
                                                table:
                                                  "border-collapse",
                                                head_row: "flex",
                                                head_cell:
                                                  "text-[10px] font-medium text-slate-400 w-[32px] text-center",
                                                row: "flex mt-0.5",
                                                cell: "relative p-0 text-center text-[12px] focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#e2e8f0] [&:has([aria-selected])]:rounded-md",
                                                day: "inline-flex items-center justify-center rounded-md size-[32px] p-0 font-normal text-[12px] text-slate-700 hover:bg-slate-100 transition-colors aria-selected:opacity-100 cursor-pointer",
                                                day_selected:
                                                  "bg-[#314158] text-white hover:bg-[#314158] hover:text-white focus:bg-[#314158] focus:text-white",
                                                day_today:
                                                  "font-semibold",
                                                day_outside:
                                                  "text-slate-300",
                                                day_disabled:
                                                  "text-[#A8BECE] opacity-35 hover:bg-transparent cursor-not-allowed",
                                                day_hidden:
                                                  "invisible",
                                              }}
                                              formatters={{
                                                formatCaption: (
                                                  date: Date,
                                                ) => {
                                                  const months = [
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
                                                  return `${months[date.getMonth()]} ${date.getFullYear()}`;
                                                },
                                                formatWeekdayName: (
                                                  date: Date,
                                                ) => {
                                                  return [
                                                    "Dom",
                                                    "Seg",
                                                    "Ter",
                                                    "Qua",
                                                    "Qui",
                                                    "Sex",
                                                    "Sáb",
                                                  ][date.getDay()];
                                                },
                                              }}
                                            />
                                          </div>
                                        </div>
                                      )}
    
                                    {periodType === "Semanal" && (
                                      <div className="flex flex-col gap-2 h-full min-h-0 w-[212px] shrink-0">
                                        {/* Section label */}
                                        <div
                                          className="flex items-center shrink-0 gap-2"
                                          style={{ height: 24 }}
                                        >
                                          <span className="text-[12px] font-semibold text-[#314158] tracking-[0.7px]">
                                            Selecionar dia
                                          </span>
                                          <span className="text-[#314158] bg-slate-100 px-2 py-0.5 rounded-full text-[10px]">
                                            <span className="font-bold">
                                              {
                                                selectedSpecificDays.length
                                              }
                                            </span>
                                            /{MAX_WEEKLY_DAYS}
                                          </span>
                                          {selectedSpecificDays.length >
                                            0 && (
                                            <button
                                              onClick={() =>
                                                setSelectedSpecificDays(
                                                  [],
                                                )
                                              }
                                              className="text-[9px] text-slate-400 hover:text-slate-600 underline"
                                            >
                                              Limpar
                                            </button>
                                          )}
                                        </div>
    
                                        {weeklyOverLimit && (
                                          <div className="text-[10px] text-[#9B2C2C] bg-[#FED7D7] px-2 py-1 rounded-md shrink-0">
                                            Máximo de{" "}
                                            {MAX_WEEKLY_DAYS} dias.
                                            Reduza a seleção.
                                          </div>
                                        )}
    
                                        {/* Inline calendar multi-select */}
                                        <div className="shrink-0 w-fit">
                                          <Calendar
                                              analysisMode={analysisMode}
                                              className="p-2 !w-[245px]"
                                            mode="multiple"
                                            selected={selectedSpecificDays.map(
                                              (s) => {
                                                const p =
                                                  s.split("/");
                                                return new Date(
                                                  +p[2],
                                                  +p[1] - 1,
                                                  +p[0],
                                                );
                                              },
                                            )}
                                            onSelect={(days) => {
                                              if (!days) {
                                                setSelectedSpecificDays(
                                                  [],
                                                );
                                                return;
                                              }
                                              const formatted =
                                                days.map((d) =>
                                                  formatDateBRShort(
                                                    d,
                                                  ),
                                                );
                                              if (
                                                formatted.length <=
                                                MAX_WEEKLY_DAYS
                                              )
                                                setSelectedSpecificDays(
                                                  formatted,
                                                );
                                            }}
                                            classNames={{
                                              months:
                                                "flex flex-col",
                                              month:
                                                "flex flex-col gap-1",
                                              caption:
                                                "flex justify-center pt-1 pb-1.5 relative items-center",
                                              caption_label:
                                                "text-[12px] font-semibold text-[#314158]",
                                              nav: "flex items-center gap-1",
                                              nav_button:
                                                "inline-flex items-center justify-center rounded-md size-6 bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors",
                                              nav_button_previous:
                                                "absolute left-0",
                                              nav_button_next:
                                                "absolute right-0",
                                              table:
                                                "border-collapse",
                                              head_row: "flex",
                                              head_cell:
                                                "text-[10px] font-medium text-slate-400 w-[32px] text-center",
                                              row: "flex mt-0.5",
                                              cell: "relative p-0 text-center text-[12px] focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#e2e8f0] [&:has([aria-selected])]:rounded-md",
                                              day: "inline-flex items-center justify-center rounded-md size-[32px] p-0 font-normal text-[12px] text-slate-700 hover:bg-slate-100 transition-colors aria-selected:opacity-100 cursor-pointer",
                                              day_selected:
                                                "bg-[#314158] text-white hover:bg-[#314158] hover:text-white focus:bg-[#314158] focus:text-white",
                                              day_today:
                                                "font-semibold",
                                              day_outside:
                                                "text-slate-300",
                                              day_disabled:
                                                "text-[#A8BECE] opacity-35 hover:bg-transparent cursor-not-allowed",
                                              day_hidden:
                                                "invisible",
                                            }}
                                            formatters={{
                                              formatCaption: (
                                                date: Date,
                                              ) => {
                                                const months = [
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
                                                return `${months[date.getMonth()]} ${date.getFullYear()}`;
                                              },
                                              formatWeekdayName: (
                                                date: Date,
                                              ) => {
                                                return [
                                                  "Dom",
                                                  "Seg",
                                                  "Ter",
                                                  "Qua",
                                                  "Qui",
                                                  "Sex",
                                                  "Sáb",
                                                ][date.getDay()];
                                              },
                                            }}
                                          />
                                        </div>
                                      </div>
                                    )}
    
                                    {periodType === "Mensal" && (
                                      <div className="flex flex-col h-full min-h-0">
                                        {/* Lista de anos com accordion */}
                                        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar w-[247px] shrink-0 border border-[#e2e8f0] rounded-lg p-2">
                                          {(() => {
                                            const monthsByYear =
                                              groupMonthsByYear(
                                                MONTHS_OPTIONS,
                                              );
                                            // Ordenar anos em ordem decrescente (2026, 2025, 2024...)
                                            const sortedYears =
                                              Object.keys(
                                                monthsByYear,
                                              ).sort(
                                                (a, b) =>
                                                  parseInt(b) -
                                                  parseInt(a),
                                              );
                                            return sortedYears.map(
                                              (year) => {
                                                const months =
                                                  monthsByYear[
                                                    year
                                                  ];
                                                const isExpanded =
                                                  expandedYears.has(
                                                    year,
                                                  );
                                                const yearMonths =
                                                  months;
                                                const selectableYearMonths =
                                                  getSelectableMonthsForYear(
                                                    yearMonths,
                                                    analysisMode,
                                                  );
                                                const selectedCount =
                                                  selectableYearMonths.filter(
                                                    (m) =>
                                                      selectedMonths.includes(
                                                        m,
                                                      ),
                                                  ).length;
                                                const allSelected =
                                                  selectableYearMonths.length >
                                                    0 &&
                                                  selectedCount ===
                                                    selectableYearMonths.length;
                                                const someSelected =
                                                  selectedCount >
                                                    0 &&
                                                  selectedCount <
                                                    selectableYearMonths.length;
    
                                                return (
                                                  <div
                                                    key={year}
                                                    className="mb-1"
                                                  >
                                                    {/* Cabeçalho do ano com checkbox */}
                                                    <div className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors">
                                                      <div
                                                        className={cn(
                                                          "w-4 h-4 border rounded flex items-center justify-center transition-all shrink-0 cursor-pointer",
                                                          allSelected
                                                            ? "bg-[#314158] border-[#314158]"
                                                            : "bg-white border-[#cad5e2]",
                                                        )}
                                                        onClick={() => {
                                                          if (
                                                            allSelected
                                                          ) {
                                                            // Desmarcar todos os meses do ano
                                                            setSelectedMonths(
                                                              selectedMonths.filter(
                                                                (
                                                                  m,
                                                                ) =>
                                                                  !yearMonths.includes(
                                                                    m,
                                                                  ),
                                                              ),
                                                            );
                                                          } else {
                                                            // Marcar todos os meses do ano
                                                            const newSelection =
                                                              [
                                                                ...selectedMonths,
                                                              ];
                                                            getSelectableMonthsForYear(
                                                              yearMonths,
                                                              analysisMode,
                                                            ).forEach(
                                                              (m) => {
                                                                if (
                                                                  !newSelection.includes(
                                                                    m,
                                                                  )
                                                                )
                                                                  newSelection.push(
                                                                    m,
                                                                  );
                                                              },
                                                            );
                                                            setSelectedMonths(
                                                              newSelection,
                                                            );
                                                          }
                                                        }}
                                                      >
                                                        {allSelected && (
                                                          <Check
                                                            size={
                                                              11
                                                            }
                                                            className="text-white"
                                                            strokeWidth={
                                                              3
                                                            }
                                                          />
                                                        )}
                                                        {someSelected &&
                                                          !allSelected && (
                                                            <div className="w-2 h-0.5 bg-[#314158] rounded" />
                                                          )}
                                                      </div>
                                                      <button
                                                        onClick={() => {
                                                          const newExpanded =
                                                            new Set(
                                                              expandedYears,
                                                            );
                                                          if (
                                                            isExpanded
                                                          )
                                                            newExpanded.delete(
                                                              year,
                                                            );
                                                          else
                                                            newExpanded.add(
                                                              year,
                                                            );
                                                          setExpandedYears(
                                                            newExpanded,
                                                          );
                                                        }}
                                                        className="flex-1 flex flex-col gap-0.5 text-left"
                                                      >
                                                        <span
                                                          className={cn(
                                                            "text-[12px] transition-colors",
                                                            allSelected
                                                              ? "text-[#314158] font-medium"
                                                              : "text-[#45556c]",
                                                          )}
                                                        >
                                                          Todos de{" "}
                                                          {year}
                                                        </span>
                                                        {selectedCount >
                                                          0 && (
                                                          <span className="text-[9px] text-[#90A1B9]">
                                                            {
                                                              selectedCount
                                                            }{" "}
                                                            de{" "}
                                                            {
                                                              yearMonths.length
                                                            }{" "}
                                                            selecionados
                                                          </span>
                                                        )}
                                                      </button>
                                                      <ChevronDown
                                                        size={14}
                                                        className={cn(
                                                          "text-[#90A1B9] transition-transform cursor-pointer",
                                                          isExpanded
                                                            ? "rotate-180"
                                                            : "",
                                                        )}
                                                        onClick={() => {
                                                          const newExpanded =
                                                            new Set(
                                                              expandedYears,
                                                            );
                                                          if (
                                                            isExpanded
                                                          )
                                                            newExpanded.delete(
                                                              year,
                                                            );
                                                          else
                                                            newExpanded.add(
                                                              year,
                                                            );
                                                          setExpandedYears(
                                                            newExpanded,
                                                          );
                                                        }}
                                                      />
                                                    </div>
    
                                                    {/* Lista de meses (expandida) */}
                                                    {isExpanded && (
                                                      <div className="ml-6 mt-1 space-y-0.5">
                                                        {yearMonths.map(
                                                          (
                                                            month,
                                                          ) => {
                                                            const isChecked =
                                                              selectedMonths.includes(
                                                                month,
                                                              );
                                                            return (
                                                              <label
                                                                key={
                                                                  month
                                                                }
                                                                className="flex items-center gap-3 px-3 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer group transition-colors"
                                                              >
                                                                <div
                                                                  className={cn(
                                                                    "w-4 h-4 border rounded flex items-center justify-center transition-all shrink-0",
                                                                    isChecked
                                                                      ? "bg-[#314158] border-[#314158]"
                                                                      : "bg-white border-[#cad5e2]",
                                                                  )}
                                                                  onClick={(
                                                                    e,
                                                                  ) => {
                                                                    e.preventDefault();
                                                                    if (
                                                                      isMonthPeriodBlocked(
                                                                        month,
                                                                        analysisMode,
                                                                      )
                                                                    )
                                                                      return;
                                                                    if (
                                                                      isChecked
                                                                    )
                                                                      setSelectedMonths(
                                                                        selectedMonths.filter(
                                                                          (
                                                                            m,
                                                                          ) =>
                                                                            m !==
                                                                            month,
                                                                        ),
                                                                      );
                                                                    else
                                                                      setSelectedMonths(
                                                                        [
                                                                          ...selectedMonths,
                                                                          month,
                                                                        ],
                                                                      );
                                                                  }}
                                                                >
                                                                  {isChecked && (
                                                                    <Check
                                                                      size={
                                                                        11
                                                                      }
                                                                      className="text-white"
                                                                      strokeWidth={
                                                                        3
                                                                      }
                                                                    />
                                                                  )}
                                                                </div>
                                                                <span
                                                                  className={cn(
                                                                    "text-[12px] transition-colors",
                                                                    isChecked
                                                                      ? "text-[#314158] font-medium"
                                                                      : "text-[#45556c]",
                                                                  )}
                                                                >
                                                                  {month.replace(
                                                                    " ",
                                                                    " / ",
                                                                  )}
                                                                </span>
                                                              </label>
                                                            );
                                                          },
                                                        )}
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              },
                                            );
                                          })()}
                                        </div>
                                      </div>
                                    )}
    
                                    {periodType === "Anual" && (
                                      <div className="flex flex-col h-full min-h-0">
                                        {/* Lista de checkboxes */}
                                        <div className="flex-1 min-h-0 overflow-y-auto space-y-0.5 custom-scrollbar pt-2 w-[247px] shrink-0 border border-[#e2e8f0] rounded-lg p-2">
                                          {YEARS_OPTIONS.map(
                                            (year) => {
                                              const isChecked =
                                                selectedYears.includes(
                                                  year,
                                                );
                                              const yearBlocked =
                                                !isYearPeriodSelectable(
                                                  year,
                                                  analysisMode,
                                                );
                                              const yearRow = (
                                                <label
                                                  key={year}
                                                  className={cn(
                                                    "flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg group transition-colors",
                                                    yearBlocked
                                                      ? "opacity-50 cursor-not-allowed"
                                                      : "cursor-pointer",
                                                  )}
                                                >
                                                  <div
                                                    className={cn(
                                                      "w-4 h-4 border rounded flex items-center justify-center transition-all shrink-0",
                                                      isChecked
                                                        ? "bg-[#314158] border-[#314158]"
                                                        : "bg-white border-[#cad5e2]",
                                                    )}
                                                    onClick={(
                                                      e,
                                                    ) => {
                                                      e.preventDefault();
                                                      if (yearBlocked) return;
                                                      if (isChecked)
                                                        setSelectedYears(
                                                          selectedYears.filter(
                                                            (y) =>
                                                              y !==
                                                              year,
                                                          ),
                                                        );
                                                      else
                                                        setSelectedYears(
                                                          [
                                                            ...selectedYears,
                                                            year,
                                                          ],
                                                        );
                                                    }}
                                                  >
                                                    {isChecked && (
                                                      <Check
                                                        size={11}
                                                        className="text-white"
                                                        strokeWidth={
                                                          3
                                                        }
                                                      />
                                                    )}
                                                  </div>
                                                  <span
                                                    className={cn(
                                                      "text-[12px] transition-colors",
                                                      isChecked
                                                        ? "text-[#314158] font-medium"
                                                        : "text-[#45556c]",
                                                    )}
                                                  >
                                                    {year}
                                                  </span>
                                                </label>
                                              );
                                              return (
                                                <PeriodBlockedOptionTooltip
                                                  key={year}
                                                  blocked={yearBlocked}
                                                >
                                                  {yearRow}
                                                </PeriodBlockedOptionTooltip>
                                              );
                                            },
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}
    
                                {/* ═══ COMPARATIVO MODE ═══ */}
                                {analysisMode === "comparativo" && (
                                  <div className="flex flex-col h-full gap-3">
                                    {periodType === "Diário" &&
                                      (SHOW_DIAS_DA_SEMANA_PERIOD_UI
                                        ? dailySubType === "periodo"
                                        : true) && (
                                        <div className="flex flex-col gap-10 h-full w-[320px] shrink-0">
                                          {/* Period 1 */}
                                          <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 shrink-0">
                                              <span className="text-[11px] font-bold text-[#62748e] tracking-[0.55px] uppercase">
                                                Período 1
                                              </span>
                                            </div>
                                            <DateRangePicker
                                              analysisMode={analysisMode}
                                              startDate={
                                                compDateRange1.start
                                              }
                                              endDate={
                                                compDateRange1.end
                                              }
                                              onStartChange={(v) =>
                                                isPeriodEditable &&
                                                setCompDateRange1(
                                                  (prev) => ({
                                                    ...prev,
                                                    start: v,
                                                  }),
                                                )
                                              }
                                              onEndChange={(v) =>
                                                isPeriodEditable &&
                                                setCompDateRange1(
                                                  (prev) => ({
                                                    ...prev,
                                                    end: v,
                                                  }),
                                                )
                                              }
                                              disabled={
                                                !isPeriodEditable
                                              }
                                            />
                                          </div>
    
                                          {/* Period 2 */}
                                          <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 shrink-0">
                                              <span className="text-[11px] font-bold text-[#62748e] tracking-[0.55px] uppercase">
                                                Período 2
                                              </span>
                                              <div className="flex flex-wrap items-center gap-1">
                                                <MdsaaToggle
                                                  mdsaaActive={mdsaaActive}
                                                  setMdsaaActive={setMdsaaActive}
                                                />
                                                <LyToggle
                                                  lyActive={lyActive}
                                                  setLyActive={setLyActive}
                                                />
                                              </div>
                                            </div>
                                            <DateRangePicker
                                              analysisMode={analysisMode}
                                              startDate={
                                                compDateRange2.start
                                              }
                                              endDate={
                                                compDateRange2.end
                                              }
                                              onStartChange={(v) =>
                                                isPeriodEditable &&
                                                handleManualP2DateRangeChange(
                                                  "start",
                                                  v,
                                                )
                                              }
                                              onEndChange={(v) =>
                                                isPeriodEditable &&
                                                handleManualP2DateRangeChange(
                                                  "end",
                                                  v,
                                                )
                                              }
                                              disabled={
                                                !isPeriodEditable
                                              }
                                            />
                                          </div>
                                          <div className="flex-1" />
                                        </div>
                                      )}
    
                                    {SHOW_DIAS_DA_SEMANA_PERIOD_UI &&
                                      periodType === "Diário" &&
                                      dailySubType === "diasdasemana" && (
                                        <div className="flex flex-col gap-2 h-full min-h-0">
                                          <div className="flex gap-10 flex-1 min-h-0">
                                            {/* P1 calendar */}
                                            <div className="flex flex-col gap-2 min-h-0">
                                              <div className="flex items-center shrink-0">
                                                <span className="text-[11px] font-bold text-[#62748e] tracking-[0.55px] uppercase">
                                                  Período 1
                                                </span>
                                              </div>
                                              <div className="shrink-0 w-fit">
                                                <Calendar
                                              analysisMode={analysisMode}
                                              className="p-2 w-[245px]"
                                                  mode="multiple"
                                                  selected={compSpecificDays1.map(
                                                    (s) => {
                                                      const p =
                                                        s.split(
                                                          "/",
                                                        );
                                                      return new Date(
                                                        +p[2],
                                                        +p[1] - 1,
                                                        +p[0],
                                                      );
                                                    },
                                                  )}
                                                  onSelect={(
                                                    days,
                                                  ) => {
                                                    if (!days) {
                                                      setCompSpecificDays1(
                                                        [],
                                                      );
                                                      return;
                                                    }
                                                    const f =
                                                      days.map(
                                                        (d) =>
                                                          formatDateBRShort(
                                                            d,
                                                          ),
                                                      );
                                                    if (
                                                      f.length <=
                                                      MAX_WEEKLY_DAYS
                                                    )
                                                      setCompSpecificDays1(
                                                        f,
                                                      );
                                                  }}
                                                  classNames={{
                                                    months:
                                                      "flex flex-col",
                                                    month:
                                                      "flex flex-col gap-1",
                                                    caption:
                                                      "flex justify-center pt-1 pb-1.5 relative items-center",
                                                    caption_label:
                                                      "text-[12px] font-semibold text-[#314158]",
                                                    nav: "flex items-center gap-1",
                                                    nav_button:
                                                      "inline-flex items-center justify-center rounded-md size-6 bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors",
                                                    nav_button_previous:
                                                      "absolute left-0",
                                                    nav_button_next:
                                                      "absolute right-0",
                                                    table:
                                                      "border-collapse",
                                                    head_row:
                                                      "flex",
                                                    head_cell:
                                                      "text-[10px] font-medium text-slate-400 w-[32px] text-center",
                                                    row: "flex mt-0.5",
                                                    cell: "relative p-0 text-center text-[12px] focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#e2e8f0] [&:has([aria-selected])]:rounded-md",
                                                    day: "inline-flex items-center justify-center rounded-md size-[32px] p-0 font-normal text-[12px] text-slate-700 hover:bg-slate-100 transition-colors aria-selected:opacity-100 cursor-pointer",
                                                    day_selected:
                                                      "bg-[#314158] text-white hover:bg-[#314158]",
                                                    day_today:
                                                      "font-semibold",
                                                    day_outside:
                                                      "text-slate-300",
                                                    day_disabled:
                                                      "text-[#A8BECE] opacity-35 hover:bg-transparent cursor-not-allowed",
                                                    day_hidden:
                                                      "invisible",
                                                  }}
                                                  formatters={{
                                                    formatCaption: (
                                                      date: Date,
                                                    ) => {
                                                      const m = [
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
                                                      return `${m[date.getMonth()]} ${date.getFullYear()}`;
                                                    },
                                                    formatWeekdayName:
                                                      (
                                                        date: Date,
                                                      ) =>
                                                        [
                                                          "Dom",
                                                          "Seg",
                                                          "Ter",
                                                          "Qua",
                                                          "Qui",
                                                          "Sex",
                                                          "Sáb",
                                                        ][
                                                          date.getDay()
                                                        ],
                                                  }}
                                                />
                                              </div>
                                            </div>
    
                                            {/* P2 calendar */}
                                            <div className="flex flex-col gap-2 min-h-0">
                                              <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-[11px] font-bold text-[#62748e] tracking-[0.55px] uppercase">
                                                  Período 2
                                                </span>
                                                <div className="flex flex-wrap items-center gap-1">
                                                  <MdsaaToggle
                                                    mdsaaActive={mdsaaActive}
                                                    setMdsaaActive={setMdsaaActive}
                                                  />
                                                  <LyToggle
                                                    lyActive={lyActive}
                                                    setLyActive={setLyActive}
                                                  />
                                                </div>
                                              </div>
                                              <div className="shrink-0 w-fit">
                                                <Calendar
                                              analysisMode={analysisMode}
                                              className="p-2 w-[245px]"
                                                  mode="multiple"
                                                  selected={compSpecificDays2.map(
                                                    (s) => {
                                                      const p =
                                                        s.split(
                                                          "/",
                                                        );
                                                      return new Date(
                                                        +p[2],
                                                        +p[1] - 1,
                                                        +p[0],
                                                      );
                                                    },
                                                  )}
                                                  onSelect={(
                                                    days,
                                                  ) => {
                                                    if (!days) {
                                                      handleManualP2SpecificDaysChange(
                                                        [],
                                                      );
                                                      return;
                                                    }
                                                    const f =
                                                      days.map(
                                                        (d) =>
                                                          formatDateBRShort(
                                                            d,
                                                          ),
                                                      );
                                                    if (
                                                      f.length <=
                                                      MAX_WEEKLY_DAYS
                                                    )
                                                      handleManualP2SpecificDaysChange(
                                                        f,
                                                      );
                                                  }}
                                                  classNames={{
                                                    months:
                                                      "flex flex-col",
                                                    month:
                                                      "flex flex-col gap-1",
                                                    caption:
                                                      "flex justify-center pt-1 pb-1.5 relative items-center",
                                                    caption_label:
                                                      "text-[12px] font-semibold text-[#314158]",
                                                    nav: "flex items-center gap-1",
                                                    nav_button:
                                                      "inline-flex items-center justify-center rounded-md size-6 bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors",
                                                    nav_button_previous:
                                                      "absolute left-0",
                                                    nav_button_next:
                                                      "absolute right-0",
                                                    table:
                                                      "border-collapse",
                                                    head_row:
                                                      "flex",
                                                    head_cell:
                                                      "text-[10px] font-medium text-slate-400 w-[32px] text-center",
                                                    row: "flex mt-0.5",
                                                    cell: "relative p-0 text-center text-[12px] focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#e2e8f0] [&:has([aria-selected])]:rounded-md",
                                                    day: "inline-flex items-center justify-center rounded-md size-[32px] p-0 font-normal text-[12px] text-slate-700 hover:bg-slate-100 transition-colors aria-selected:opacity-100 cursor-pointer",
                                                    day_selected:
                                                      "bg-[#314158] text-white hover:bg-[#314158]",
                                                    day_today:
                                                      "font-semibold",
                                                    day_outside:
                                                      "text-slate-300",
                                                    day_disabled:
                                                      "text-[#A8BECE] opacity-35 hover:bg-transparent cursor-not-allowed",
                                                    day_hidden:
                                                      "invisible",
                                                  }}
                                                  formatters={{
                                                    formatCaption: (
                                                      date: Date,
                                                    ) => {
                                                      const m = [
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
                                                      return `${m[date.getMonth()]} ${date.getFullYear()}`;
                                                    },
                                                    formatWeekdayName:
                                                      (
                                                        date: Date,
                                                      ) =>
                                                        [
                                                          "Dom",
                                                          "Seg",
                                                          "Ter",
                                                          "Qua",
                                                          "Qui",
                                                          "Sex",
                                                          "Sáb",
                                                        ][
                                                          date.getDay()
                                                        ],
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
    
                                    {periodType === "Semanal" && (
                                      <div className="flex flex-col gap-2 h-full min-h-0">
                                        <div className="flex gap-6 flex-1 min-h-0">
                                          {/* P1 calendar */}
                                          <div className="flex flex-col gap-2 min-h-0">
                                            <div className="flex items-center shrink-0">
                                              <span className="text-[11px] font-bold text-[#62748e] tracking-[0.55px] uppercase">
                                                Período 1
                                              </span>
                                            </div>
                                            <div className="shrink-0 w-fit">
                                              <Calendar
                                              analysisMode={analysisMode}
                                              className="p-2 w-[245px]"
                                                mode="multiple"
                                                selected={compSpecificDays1.map(
                                                  (s) => {
                                                    const p =
                                                      s.split("/");
                                                    return new Date(
                                                      +p[2],
                                                      +p[1] - 1,
                                                      +p[0],
                                                    );
                                                  },
                                                )}
                                                onSelect={(
                                                  days,
                                                ) => {
                                                  if (!days) {
                                                    setCompSpecificDays1(
                                                      [],
                                                    );
                                                    return;
                                                  }
                                                  const f =
                                                    days.map((d) =>
                                                      formatDateBRShort(
                                                        d,
                                                      ),
                                                    );
                                                  if (
                                                    f.length <=
                                                    MAX_WEEKLY_DAYS
                                                  )
                                                    setCompSpecificDays1(
                                                      f,
                                                    );
                                                }}
                                                classNames={{
                                                  months:
                                                    "flex flex-col",
                                                  month:
                                                    "flex flex-col gap-1",
                                                  caption:
                                                    "flex justify-center pt-1 pb-1.5 relative items-center",
                                                  caption_label:
                                                    "text-[12px] font-semibold text-[#314158]",
                                                  nav: "flex items-center gap-1",
                                                  nav_button:
                                                    "inline-flex items-center justify-center rounded-md size-6 bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors",
                                                  nav_button_previous:
                                                    "absolute left-0",
                                                  nav_button_next:
                                                    "absolute right-0",
                                                  table:
                                                    "border-collapse",
                                                  head_row: "flex",
                                                  head_cell:
                                                    "text-[10px] font-medium text-slate-400 w-[32px] text-center",
                                                  row: "flex mt-0.5",
                                                  cell: "relative p-0 text-center text-[12px] focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#e2e8f0] [&:has([aria-selected])]:rounded-md",
                                                  day: "inline-flex items-center justify-center rounded-md size-[32px] p-0 font-normal text-[12px] text-slate-700 hover:bg-slate-100 transition-colors aria-selected:opacity-100 cursor-pointer",
                                                  day_selected:
                                                    "bg-[#314158] text-white hover:bg-[#314158]",
                                                  day_today:
                                                    "font-semibold",
                                                  day_outside:
                                                    "text-slate-300",
                                                  day_disabled:
                                                    "text-[#A8BECE] opacity-35 hover:bg-transparent cursor-not-allowed",
                                                  day_hidden:
                                                    "invisible",
                                                }}
                                                formatters={{
                                                  formatCaption: (
                                                    date: Date,
                                                  ) => {
                                                    const m = [
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
                                                    return `${m[date.getMonth()]} ${date.getFullYear()}`;
                                                  },
                                                  formatWeekdayName:
                                                    (date: Date) =>
                                                      [
                                                        "Dom",
                                                        "Seg",
                                                        "Ter",
                                                        "Qua",
                                                        "Qui",
                                                        "Sex",
                                                        "Sáb",
                                                      ][
                                                        date.getDay()
                                                      ],
                                                }}
                                              />
                                            </div>
                                          </div>
    
                                          {/* P2 calendar */}
                                          <div className="flex flex-col gap-2 min-h-0">
                                            <div className="flex items-center gap-2 shrink-0">
                                              <span className="text-[11px] font-bold text-[#62748e] tracking-[0.55px] uppercase">
                                                Período 2
                                              </span>
                                              <div className="flex flex-wrap items-center gap-1">
                                                <MdsaaToggle
                                                  mdsaaActive={mdsaaActive}
                                                  setMdsaaActive={setMdsaaActive}
                                                />
                                                <LyToggle
                                                  lyActive={lyActive}
                                                  setLyActive={setLyActive}
                                                />
                                              </div>
                                            </div>
                                            <div className="shrink-0 w-fit">
                                              <Calendar
                                                analysisMode={analysisMode}
                                                key={
                                                  compSpecificDays2.length >
                                                  0
                                                    ? compSpecificDays2[0]
                                                    : "empty"
                                                }
                                                className="p-2 w-[245px]"
                                                mode="multiple"
                                                selected={compSpecificDays2.map(
                                                  (s) => {
                                                    const p =
                                                      s.split("/");
                                                    return new Date(
                                                      +p[2],
                                                      +p[1] - 1,
                                                      +p[0],
                                                    );
                                                  },
                                                )}
                                                onSelect={(
                                                  days,
                                                ) => {
                                                  if (!days) {
                                                    handleManualP2SpecificDaysChange(
                                                      [],
                                                    );
                                                    return;
                                                  }
                                                  const f =
                                                    days.map((d) =>
                                                      formatDateBRShort(
                                                        d,
                                                      ),
                                                    );
                                                  if (
                                                    f.length <=
                                                    MAX_WEEKLY_DAYS
                                                  )
                                                    handleManualP2SpecificDaysChange(
                                                      f,
                                                    );
                                                }}
                                                defaultMonth={
                                                  compSpecificDays2.length >
                                                  0
                                                    ? (() => {
                                                        const p =
                                                          compSpecificDays2[0].split(
                                                            "/",
                                                          );
                                                        return new Date(
                                                          +p[2],
                                                          +p[1] - 1,
                                                          +p[0],
                                                        );
                                                      })()
                                                    : undefined
                                                }
                                                classNames={{
                                                  months:
                                                    "flex flex-col",
                                                  month:
                                                    "flex flex-col gap-1",
                                                  caption:
                                                    "flex justify-center pt-1 pb-1.5 relative items-center",
                                                  caption_label:
                                                    "text-[12px] font-semibold text-[#314158]",
                                                  nav: "flex items-center gap-1",
                                                  nav_button:
                                                    "inline-flex items-center justify-center rounded-md size-6 bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors",
                                                  nav_button_previous:
                                                    "absolute left-0",
                                                  nav_button_next:
                                                    "absolute right-0",
                                                  table:
                                                    "border-collapse",
                                                  head_row: "flex",
                                                  head_cell:
                                                    "text-[10px] font-medium text-slate-400 w-[32px] text-center",
                                                  row: "flex mt-0.5",
                                                  cell: "relative p-0 text-center text-[12px] focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#e2e8f0] [&:has([aria-selected])]:rounded-md",
                                                  day: "inline-flex items-center justify-center rounded-md size-[32px] p-0 font-normal text-[12px] text-slate-700 hover:bg-slate-100 transition-colors aria-selected:opacity-100 cursor-pointer",
                                                  day_selected:
                                                    "bg-[#314158] text-white hover:bg-[#314158]",
                                                  day_today:
                                                    "font-semibold",
                                                  day_outside:
                                                    "text-slate-300",
                                                  day_disabled:
                                                    "text-[#A8BECE] opacity-35 hover:bg-transparent cursor-not-allowed",
                                                  day_hidden:
                                                    "invisible",
                                                }}
                                                formatters={{
                                                  formatCaption: (
                                                    date: Date,
                                                  ) => {
                                                    const m = [
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
                                                    return `${m[date.getMonth()]} ${date.getFullYear()}`;
                                                  },
                                                  formatWeekdayName:
                                                    (date: Date) =>
                                                      [
                                                        "Dom",
                                                        "Seg",
                                                        "Ter",
                                                        "Qua",
                                                        "Qui",
                                                        "Sex",
                                                        "Sáb",
                                                      ][
                                                        date.getDay()
                                                      ],
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
    
                                    {periodType === "Mensal" && (
                                      <div className="flex flex-col gap-3 h-full min-h-0">
                                        <div
                                          className="flex gap-6 flex-1 min-h-0"
                                          style={{
                                            maxWidth:
                                              "calc(100% - 100px)",
                                          }}
                                        >
                                          {/* Period 1 - Monthly multi-select */}
                                          <div className="flex-1 flex flex-col gap-2 min-h-0">
                                            <div className="flex items-center shrink-0">
                                              <span className="text-[11px] font-bold text-[#62748e] tracking-[0.55px] uppercase">
                                                Período 1
                                              </span>
                                            </div>
                                            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar w-[247px] shrink-0 border border-[#e2e8f0] rounded-lg p-2">
                                              {(() => {
                                                const monthsByYear =
                                                  groupMonthsByYear(
                                                    MONTHS_OPTIONS,
                                                  );
                                                const sortedYears =
                                                  Object.keys(
                                                    monthsByYear,
                                                  ).sort(
                                                    (a, b) =>
                                                      parseInt(b) -
                                                      parseInt(a),
                                                  );
                                                return sortedYears.map(
                                                  (year) => {
                                                    const months =
                                                      monthsByYear[
                                                        year
                                                      ];
                                                    const isExpanded =
                                                      compExpandedYears1.has(
                                                        year,
                                                      );
                                                    const yearMonths =
                                                      months;
                                                    const selectableYearMonths =
                                                      getSelectableMonthsForYear(
                                                        yearMonths,
                                                        analysisMode,
                                                      );
                                                    const selectedCount =
                                                      selectableYearMonths.filter(
                                                        (m) =>
                                                          compMonths1.includes(
                                                            m,
                                                          ),
                                                      ).length;
                                                    const allSelected =
                                                      selectableYearMonths.length >
                                                        0 &&
                                                      selectedCount ===
                                                        selectableYearMonths.length;
                                                    const someSelected =
                                                      selectedCount >
                                                        0 &&
                                                      selectedCount <
                                                        selectableYearMonths.length;
    
                                                    return (
                                                      <div
                                                        key={year}
                                                        className="mb-1"
                                                      >
                                                        <div className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors">
                                                          <div
                                                            className={cn(
                                                              "w-4 h-4 border rounded flex items-center justify-center transition-all shrink-0 cursor-pointer",
                                                              allSelected
                                                                ? "bg-[#314158] border-[#314158]"
                                                                : "bg-white border-[#cad5e2]",
                                                            )}
                                                            onClick={() => {
                                                              if (
                                                                allSelected
                                                              ) {
                                                                setCompMonths1(
                                                                  compMonths1.filter(
                                                                    (
                                                                      m,
                                                                    ) =>
                                                                      !yearMonths.includes(
                                                                        m,
                                                                      ),
                                                                  ),
                                                                );
                                                              } else {
                                                                const newSelection =
                                                                  [
                                                                    ...compMonths1,
                                                                  ];
                                                                getSelectableMonthsForYear(
                                                                  yearMonths,
                                                                  analysisMode,
                                                                ).forEach(
                                                                  (m) => {
                                                                    if (
                                                                      !newSelection.includes(
                                                                        m,
                                                                      )
                                                                    )
                                                                      newSelection.push(
                                                                        m,
                                                                      );
                                                                  },
                                                                );
                                                                setCompMonths1(
                                                                  newSelection,
                                                                );
                                                              }
                                                            }}
                                                          >
                                                            {allSelected && (
                                                              <Check
                                                                size={
                                                                  11
                                                                }
                                                                className="text-white"
                                                                strokeWidth={
                                                                  3
                                                                }
                                                              />
                                                            )}
                                                            {someSelected &&
                                                              !allSelected && (
                                                                <div className="w-2 h-0.5 bg-[#314158] rounded" />
                                                              )}
                                                          </div>
                                                          <button
                                                            onClick={() => {
                                                              const newExpanded =
                                                                new Set(
                                                                  compExpandedYears1,
                                                                );
                                                              if (
                                                                isExpanded
                                                              )
                                                                newExpanded.delete(
                                                                  year,
                                                                );
                                                              else
                                                                newExpanded.add(
                                                                  year,
                                                                );
                                                              setCompExpandedYears1(
                                                                newExpanded,
                                                              );
                                                            }}
                                                            className="flex-1 flex flex-col gap-0.5 text-left"
                                                          >
                                                            <span
                                                              className={cn(
                                                                "text-[12px] transition-colors",
                                                                allSelected
                                                                  ? "text-[#314158] font-medium"
                                                                  : "text-[#45556c]",
                                                              )}
                                                            >
                                                              Todos
                                                              de{" "}
                                                              {year}
                                                            </span>
                                                            {selectedCount >
                                                              0 && (
                                                              <span className="text-[9px] text-[#90A1B9]">
                                                                {
                                                                  selectedCount
                                                                }{" "}
                                                                de{" "}
                                                                {
                                                                  yearMonths.length
                                                                }{" "}
                                                                selecionados
                                                              </span>
                                                            )}
                                                          </button>
                                                          <ChevronDown
                                                            size={
                                                              14
                                                            }
                                                            className={cn(
                                                              "text-[#90A1B9] transition-transform cursor-pointer",
                                                              isExpanded
                                                                ? "rotate-180"
                                                                : "",
                                                            )}
                                                            onClick={() => {
                                                              const newExpanded =
                                                                new Set(
                                                                  compExpandedYears1,
                                                                );
                                                              if (
                                                                isExpanded
                                                              )
                                                                newExpanded.delete(
                                                                  year,
                                                                );
                                                              else
                                                                newExpanded.add(
                                                                  year,
                                                                );
                                                              setCompExpandedYears1(
                                                                newExpanded,
                                                              );
                                                            }}
                                                          />
                                                        </div>
    
                                                        {isExpanded && (
                                                          <div className="ml-6 mt-1 space-y-0.5">
                                                            {yearMonths.map(
                                                              (
                                                                month,
                                                              ) => {
                                                                const isChecked =
                                                                  compMonths1.includes(
                                                                    month,
                                                                  );
                                                                return (
                                                                  <label
                                                                    key={
                                                                      month
                                                                    }
                                                                    className="flex items-center gap-3 px-3 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer group transition-colors"
                                                                  >
                                                                    <div
                                                                      className={cn(
                                                                        "w-4 h-4 border rounded flex items-center justify-center transition-all shrink-0",
                                                                        isChecked
                                                                          ? "bg-[#314158] border-[#314158]"
                                                                          : "bg-white border-[#cad5e2]",
                                                                      )}
                                                                      onClick={(
                                                                        e,
                                                                      ) => {
                                                                        e.preventDefault();
                                                                        if (
                                                                          isMonthPeriodBlocked(
                                                                            month,
                                                                            analysisMode,
                                                                          )
                                                                        )
                                                                          return;
                                                                        if (
                                                                          isChecked
                                                                        )
                                                                          setCompMonths1(
                                                                            compMonths1.filter(
                                                                              (
                                                                                m,
                                                                              ) =>
                                                                                m !==
                                                                                month,
                                                                            ),
                                                                          );
                                                                        else
                                                                          setCompMonths1(
                                                                            [
                                                                              ...compMonths1,
                                                                              month,
                                                                            ],
                                                                          );
                                                                      }}
                                                                    >
                                                                      {isChecked && (
                                                                        <Check
                                                                          size={
                                                                            11
                                                                          }
                                                                          className="text-white"
                                                                          strokeWidth={
                                                                            3
                                                                          }
                                                                        />
                                                                      )}
                                                                    </div>
                                                                    <span
                                                                      className={cn(
                                                                        "text-[12px] transition-colors",
                                                                        isChecked
                                                                          ? "text-[#314158] font-medium"
                                                                          : "text-[#45556c]",
                                                                      )}
                                                                    >
                                                                      {month.replace(
                                                                        " ",
                                                                        " / ",
                                                                      )}
                                                                    </span>
                                                                  </label>
                                                                );
                                                              },
                                                            )}
                                                          </div>
                                                        )}
                                                      </div>
                                                    );
                                                  },
                                                );
                                              })()}
                                            </div>
                                          </div>
    
                                          {/* Period 2 - Monthly multi-select */}
                                          <div className="flex-1 flex flex-col gap-2 min-h-0">
                                            <div className="flex items-center gap-2 shrink-0">
                                              <span className="text-[11px] font-bold text-[#62748e] tracking-[0.55px] uppercase">
                                                Período 2
                                              </span>
                                              <div className="flex flex-wrap items-center gap-1">
                                                <MdsaaToggle
                                                  mdsaaActive={mdsaaActive}
                                                  setMdsaaActive={setMdsaaActive}
                                                />
                                                <LyToggle
                                                  lyActive={lyActive}
                                                  setLyActive={setLyActive}
                                                />
                                              </div>
                                            </div>
                                            <div
                                              ref={
                                                monthsP2ScrollRef
                                              }
                                              className="flex-1 min-h-0 overflow-y-auto custom-scrollbar w-[247px] shrink-0 border border-[#e2e8f0] rounded-lg p-2"
                                            >
                                              {(() => {
                                                const monthsByYear =
                                                  groupMonthsByYear(
                                                    MONTHS_OPTIONS,
                                                  );
                                                const sortedYears =
                                                  Object.keys(
                                                    monthsByYear,
                                                  ).sort(
                                                    (a, b) =>
                                                      parseInt(b) -
                                                      parseInt(a),
                                                  );
                                                return sortedYears.map(
                                                  (year) => {
                                                    const months =
                                                      monthsByYear[
                                                        year
                                                      ];
                                                    const isExpanded =
                                                      compExpandedYears2.has(
                                                        year,
                                                      );
                                                    const yearMonths =
                                                      months;
                                                    const selectableYearMonths =
                                                      getSelectableMonthsForYear(
                                                        yearMonths,
                                                        analysisMode,
                                                      );
                                                    const selectedCount =
                                                      selectableYearMonths.filter(
                                                        (m) =>
                                                          compMonths2.includes(
                                                            m,
                                                          ),
                                                      ).length;
                                                    const allSelected =
                                                      selectableYearMonths.length >
                                                        0 &&
                                                      selectedCount ===
                                                        selectableYearMonths.length;
                                                    const someSelected =
                                                      selectedCount >
                                                        0 &&
                                                      selectedCount <
                                                        selectableYearMonths.length;
    
                                                    return (
                                                      <div
                                                        key={year}
                                                        className="mb-1"
                                                      >
                                                        <div className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors">
                                                          <div
                                                            className={cn(
                                                              "w-4 h-4 border rounded flex items-center justify-center transition-all shrink-0 cursor-pointer",
                                                              allSelected
                                                                ? "bg-[#314158] border-[#314158]"
                                                                : "bg-white border-[#cad5e2]",
                                                            )}
                                                            onClick={() => {
                                                              if (
                                                                allSelected
                                                              ) {
                                                                handleManualP2MonthsChange(
                                                                  compMonths2.filter(
                                                                    (
                                                                      m,
                                                                    ) =>
                                                                      !yearMonths.includes(
                                                                        m,
                                                                      ),
                                                                  ),
                                                                );
                                                              } else {
                                                                const newSelection =
                                                                  [
                                                                    ...compMonths2,
                                                                  ];
                                                                getSelectableMonthsForYear(
                                                                  yearMonths,
                                                                  analysisMode,
                                                                ).forEach(
                                                                  (m) => {
                                                                    if (
                                                                      !newSelection.includes(
                                                                        m,
                                                                      )
                                                                    )
                                                                      newSelection.push(
                                                                        m,
                                                                      );
                                                                  },
                                                                );
                                                                handleManualP2MonthsChange(
                                                                  newSelection,
                                                                );
                                                              }
                                                            }}
                                                          >
                                                            {allSelected && (
                                                              <Check
                                                                size={
                                                                  11
                                                                }
                                                                className="text-white"
                                                                strokeWidth={
                                                                  3
                                                                }
                                                              />
                                                            )}
                                                            {someSelected &&
                                                              !allSelected && (
                                                                <div className="w-2 h-0.5 bg-[#314158] rounded" />
                                                              )}
                                                          </div>
                                                          <button
                                                            onClick={() => {
                                                              const newExpanded =
                                                                new Set(
                                                                  compExpandedYears2,
                                                                );
                                                              if (
                                                                isExpanded
                                                              )
                                                                newExpanded.delete(
                                                                  year,
                                                                );
                                                              else
                                                                newExpanded.add(
                                                                  year,
                                                                );
                                                              setCompExpandedYears2(
                                                                newExpanded,
                                                              );
                                                            }}
                                                            className="flex-1 flex flex-col gap-0.5 text-left"
                                                          >
                                                            <span
                                                              className={cn(
                                                                "text-[12px] transition-colors",
                                                                allSelected
                                                                  ? "text-[#314158] font-medium"
                                                                  : "text-[#45556c]",
                                                              )}
                                                            >
                                                              Todos
                                                              de{" "}
                                                              {year}
                                                            </span>
                                                            {selectedCount >
                                                              0 && (
                                                              <span className="text-[9px] text-[#90A1B9]">
                                                                {
                                                                  selectedCount
                                                                }{" "}
                                                                de{" "}
                                                                {
                                                                  yearMonths.length
                                                                }{" "}
                                                                selecionados
                                                              </span>
                                                            )}
                                                          </button>
                                                          <ChevronDown
                                                            size={
                                                              14
                                                            }
                                                            className={cn(
                                                              "text-[#90A1B9] transition-transform cursor-pointer",
                                                              isExpanded
                                                                ? "rotate-180"
                                                                : "",
                                                            )}
                                                            onClick={() => {
                                                              const newExpanded =
                                                                new Set(
                                                                  compExpandedYears2,
                                                                );
                                                              if (
                                                                isExpanded
                                                              )
                                                                newExpanded.delete(
                                                                  year,
                                                                );
                                                              else
                                                                newExpanded.add(
                                                                  year,
                                                                );
                                                              setCompExpandedYears2(
                                                                newExpanded,
                                                              );
                                                            }}
                                                          />
                                                        </div>
    
                                                        {isExpanded && (
                                                          <div className="ml-6 mt-1 space-y-0.5">
                                                            {yearMonths.map(
                                                              (
                                                                month,
                                                              ) => {
                                                                const isChecked =
                                                                  compMonths2.includes(
                                                                    month,
                                                                  );
                                                                return (
                                                                  <label
                                                                    key={
                                                                      month
                                                                    }
                                                                    className="flex items-center gap-3 px-3 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer group transition-colors"
                                                                  >
                                                                    <div
                                                                      className={cn(
                                                                        "w-4 h-4 border rounded flex items-center justify-center transition-all shrink-0",
                                                                        isChecked
                                                                          ? "bg-[#314158] border-[#314158]"
                                                                          : "bg-white border-[#cad5e2]",
                                                                      )}
                                                                      onClick={(
                                                                        e,
                                                                      ) => {
                                                                        e.preventDefault();
                                                                        if (
                                                                          isMonthPeriodBlocked(
                                                                            month,
                                                                            analysisMode,
                                                                          )
                                                                        )
                                                                          return;
                                                                        if (
                                                                          isChecked
                                                                        )
                                                                          handleManualP2MonthsChange(
                                                                            compMonths2.filter(
                                                                              (
                                                                                m,
                                                                              ) =>
                                                                                m !==
                                                                                month,
                                                                            ),
                                                                          );
                                                                        else
                                                                          handleManualP2MonthsChange(
                                                                            [
                                                                              ...compMonths2,
                                                                              month,
                                                                            ],
                                                                          );
                                                                      }}
                                                                    >
                                                                      {isChecked && (
                                                                        <Check
                                                                          size={
                                                                            11
                                                                          }
                                                                          className="text-white"
                                                                          strokeWidth={
                                                                            3
                                                                          }
                                                                        />
                                                                      )}
                                                                    </div>
                                                                    <span
                                                                      className={cn(
                                                                        "text-[12px] transition-colors",
                                                                        isChecked
                                                                          ? "text-[#314158] font-medium"
                                                                          : "text-[#45556c]",
                                                                      )}
                                                                    >
                                                                      {month.replace(
                                                                        " ",
                                                                        " / ",
                                                                      )}
                                                                    </span>
                                                                  </label>
                                                                );
                                                              },
                                                            )}
                                                          </div>
                                                        )}
                                                      </div>
                                                    );
                                                  },
                                                );
                                              })()}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
    
                                    {periodType === "Anual" && (
                                      <div className="flex flex-col gap-3 h-full min-h-0">
                                        <div
                                          className="flex gap-6 flex-1 min-h-0"
                                          style={{
                                            maxWidth:
                                              "calc(100% - 100px)",
                                          }}
                                        >
                                          {/* Period 1 - Yearly multi-select */}
                                          <div className="flex-1 flex flex-col gap-2 min-h-0">
                                            <div className="flex items-center shrink-0">
                                              <span className="text-[11px] font-bold text-[#62748e] tracking-[0.55px] uppercase">
                                                Período 1
                                              </span>
                                            </div>
                                            <div className="flex-1 min-h-0 overflow-y-auto space-y-0.5 custom-scrollbar pt-2 w-[247px] shrink-0 border border-[#e2e8f0] rounded-lg p-2">
                                              {YEARS_OPTIONS.map(
                                                (year) => {
                                                  const isChecked =
                                                    compYears1.includes(
                                                      year,
                                                    );
                                                  const yearBlocked =
                                                    !isYearPeriodSelectable(
                                                      year,
                                                      analysisMode,
                                                    );
                                                  const yearRow = (
                                                    <label
                                                      key={year}
                                                      className={cn(
                                                        "flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg group transition-colors",
                                                        yearBlocked
                                                          ? "opacity-50 cursor-not-allowed"
                                                          : "cursor-pointer",
                                                      )}
                                                    >
                                                      <div
                                                        className={cn(
                                                          "w-4 h-4 border rounded flex items-center justify-center transition-all shrink-0",
                                                          isChecked
                                                            ? "bg-[#314158] border-[#314158]"
                                                            : "bg-white border-[#cad5e2]",
                                                        )}
                                                        onClick={(
                                                          e,
                                                        ) => {
                                                          e.preventDefault();
                                                          if (yearBlocked) return;
                                                          if (
                                                            isChecked
                                                          )
                                                            setCompYears1(
                                                              compYears1.filter(
                                                                (
                                                                  y,
                                                                ) =>
                                                                  y !==
                                                                  year,
                                                              ),
                                                            );
                                                          else
                                                            setCompYears1(
                                                              [
                                                                ...compYears1,
                                                                year,
                                                              ],
                                                            );
                                                        }}
                                                      >
                                                        {isChecked && (
                                                          <Check
                                                            size={
                                                              11
                                                            }
                                                            className="text-white"
                                                            strokeWidth={
                                                              3
                                                            }
                                                          />
                                                        )}
                                                      </div>
                                                      <span
                                                        className={cn(
                                                          "text-[12px] transition-colors",
                                                          isChecked
                                                            ? "text-[#314158] font-medium"
                                                            : "text-[#45556c]",
                                                        )}
                                                      >
                                                        {year}
                                                      </span>
                                                    </label>
                                                  );
                                                  return (
                                                    <PeriodBlockedOptionTooltip
                                                      key={year}
                                                      blocked={yearBlocked}
                                                    >
                                                      {yearRow}
                                                    </PeriodBlockedOptionTooltip>
                                                  );
                                                },
                                              )}
                                            </div>
                                          </div>
    
                                          {/* Period 2 - Yearly multi-select */}
                                          <div className="flex-1 flex flex-col gap-2 min-h-0">
                                            <div className="flex items-center gap-2 shrink-0">
                                              <span className="text-[11px] font-bold text-[#62748e] tracking-[0.55px] uppercase">
                                                Período 2
                                              </span>
                                              <div className="flex flex-wrap items-center gap-1">
                                                <MdsaaToggle
                                                  mdsaaActive={mdsaaActive}
                                                  setMdsaaActive={setMdsaaActive}
                                                />
                                                <LyToggle
                                                  lyActive={lyActive}
                                                  setLyActive={setLyActive}
                                                />
                                              </div>
                                            </div>
                                            <div className="flex-1 min-h-0 overflow-y-auto space-y-0.5 custom-scrollbar pt-2 w-[247px] shrink-0 border border-[#e2e8f0] rounded-lg p-2">
                                              {YEARS_OPTIONS.map(
                                                (year) => {
                                                  const isChecked =
                                                    compYears2.includes(
                                                      year,
                                                    );
                                                  const yearBlocked =
                                                    !isYearPeriodSelectable(
                                                      year,
                                                      analysisMode,
                                                    );
                                                  const yearRow = (
                                                    <label
                                                      className={cn(
                                                        "flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg group transition-colors",
                                                        yearBlocked
                                                          ? "opacity-50 cursor-not-allowed"
                                                          : "cursor-pointer",
                                                      )}
                                                    >
                                                      <div
                                                        className={cn(
                                                          "w-4 h-4 border rounded flex items-center justify-center transition-all shrink-0",
                                                          isChecked
                                                            ? "bg-[#314158] border-[#314158]"
                                                            : "bg-white border-[#cad5e2]",
                                                        )}
                                                        onClick={(
                                                          e,
                                                        ) => {
                                                          e.preventDefault();
                                                          if (yearBlocked) return;
                                                          if (isChecked)
                                                            handleManualP2YearsChange(
                                                              compYears2.filter(
                                                                (
                                                                  y,
                                                                ) =>
                                                                  y !==
                                                                  year,
                                                              ),
                                                            );
                                                          else
                                                            handleManualP2YearsChange(
                                                              [
                                                                ...compYears2,
                                                                year,
                                                              ],
                                                            );
                                                        }}
                                                      >
                                                        {isChecked && (
                                                          <Check
                                                            size={
                                                              11
                                                            }
                                                            className="text-white"
                                                            strokeWidth={
                                                              3
                                                            }
                                                          />
                                                        )}
                                                      </div>
                                                      <span
                                                        className={cn(
                                                          "text-[12px] transition-colors",
                                                          isChecked
                                                            ? "text-[#314158] font-medium"
                                                            : "text-[#45556c]",
                                                        )}
                                                      >
                                                        {year}
                                                      </span>
                                                    </label>
                                                  );
                                                  return (
                                                    <PeriodBlockedOptionTooltip
                                                      key={year}
                                                      blocked={yearBlocked}
                                                    >
                                                      {yearRow}
                                                    </PeriodBlockedOptionTooltip>
                                                  );
                                                },
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
    
                            {/* Footer com frases informativas */}
                            {(() => {
                              // Verificar se o período inclui hoje
                              // REGRA: Mensal e Anual NUNCA mostram o aviso, mesmo que mês/ano atual esteja selecionado
                              const today = getTodayFormatted();
                              let includesToday = false;
    
                              if (analysisMode === "comparativo") {
                                if (periodType === "Diário") {
                                  if (dailySubType === "periodo") {
                                    includesToday =
                                      compDateRange1.end ===
                                        today ||
                                      compDateRange2.end === today;
                                  } else {
                                    includesToday =
                                      compSpecificDays1.includes(
                                        today,
                                      ) ||
                                      compSpecificDays2.includes(
                                        today,
                                      );
                                  }
                                }
                                // Mensal e Anual: NUNCA mostram o aviso
                              } else {
                                if (
                                  periodType === "Diário" ||
                                  analysisMode === "horaahora"
                                ) {
                                  if (
                                    analysisMode === "horaahora" ||
                                    dailySubType === "periodo"
                                  ) {
                                    includesToday =
                                      dateRange.end === today;
                                  } else {
                                    includesToday =
                                      selectedSpecificDays.includes(
                                        today,
                                      );
                                  }
                                }
                                // Mensal e Anual: NUNCA mostram o aviso
                              }
    
                              // Hora a Hora: sempre mostra seu texto específico
                              if (analysisMode === "horaahora") {
                                return (
                                  <div className="flex items-center gap-2 mt-3 shrink-0">
                                    <div className="w-1 h-1 rounded-full bg-[#90a1b9]" />
                                    <p className="text-[11px] font-normal text-[#62748e]">
                                      24h disponíveis: seleção das faixas de
                                      horas na Tela de Resultado | Atualização
                                      a cada 30min.
                                    </p>
                                  </div>
                                );
                              }
    
                              return null;
                            })()}
                          </div>
                        </LockedTooltip>
                      </div>
  );
});
