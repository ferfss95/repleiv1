/**
 * Resumo da análise (etapas do assistente): período, filtros de inclusão,
 * agrupamento e exclusões — sempre acima do grid de atributos.
 */
import React, { useMemo } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Calendar as CalendarIcon, Filter, Anchor, Ban } from "lucide-react";
import { LOCATION_ATTRIBUTES, type Module } from "../constants";
import { isAttributeVisibleInUi } from "../data/attributeUiVisibility";
import {
  collectAllDomainAttributes,
  type ModuleConfig,
} from "../modules/types";
import type { AnalysisMode } from "../types/wizard";
import { getComparativoPeriodLabel } from "../constants/labels";
import {
  computePeriodDisplayText,
  computeComparativoPeriodSmartSummary,
  type ComparativoPeriodSummaryInput,
  type PeriodSummaryInput,
} from "../utils/analysisPeriodSummary";
import { formatDate } from "../dateUtils";
import { AnalysisSummaryChipsShell } from "./analysis/AnalysisSummaryChipsShell";
import {
  ANALYSIS_SUMMARY_TAG_BTN_CLASS,
  ANALYSIS_SUMMARY_TAG_STYLE,
} from "./analysis/analysisSummaryTagStyles";

export interface AnalysisSummarySectionProps {
  moduleConfig: ModuleConfig;
  selections: Record<string, string[]>;
  exclusions: Record<string, string[]>;
  grouping: string[];
  analysisMode: AnalysisMode;
  periodType: "Diário" | "Mensal" | "Anual";
  dateRange: { start: string; end: string };
  selectedMonths: string[];
  selectedYears: string[];
  weeklyMode: "specific" | "weekday";
  weeklyComputedDays: Date[];
  selectedSpecificDays: string[];
  compDateRange1: { start: string; end: string };
  compDateRange2: { start: string; end: string };
  compMonths1: string[];
  compMonths2: string[];
  compYears1: string[];
  compYears2: string[];
  compSpecificDays1: string[];
  compSpecificDays2: string[];
  compWeeklyComputedDays1: Date[];
  compWeeklyComputedDays2: Date[];
}

function labelForAttr(moduleConfig: ModuleConfig, id: string): string {
  const attr =
    collectAllDomainAttributes(moduleConfig).find((a) => a.id === id) ||
    LOCATION_ATTRIBUTES.find((a) => a.id === id);
  return attr?.label || id;
}

export const AnalysisSummarySection = React.memo(function AnalysisSummarySection({
  moduleConfig,
  selections,
  exclusions,
  grouping,
  analysisMode,
  periodType,
  dateRange,
  selectedMonths,
  selectedYears,
  weeklyMode,
  weeklyComputedDays,
  selectedSpecificDays,
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
}: AnalysisSummarySectionProps) {
  const moduleId = moduleConfig.id as Module;

  const periodInput: PeriodSummaryInput = useMemo(
    () => ({
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

  const compInput: ComparativoPeriodSummaryInput = useMemo(
    () => ({
      periodType,
      weeklyMode,
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
      periodType,
      weeklyMode,
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

  const periodText = useMemo(
    () => computePeriodDisplayText(periodInput),
    [periodInput],
  );

  const includeEntries = useMemo(
    () =>
      Object.entries(selections)
        .filter(
          ([key, vals]) =>
            vals &&
            vals.length > 0 &&
            isAttributeVisibleInUi(moduleId, key),
        )
        .sort(([a], [b]) =>
          labelForAttr(moduleConfig, a).localeCompare(labelForAttr(moduleConfig, b), "pt-BR"),
        ),
    [selections, moduleConfig, moduleId],
  );

  const excludeEntries = useMemo(
    () =>
      Object.entries(exclusions)
        .filter(
          ([key, vals]) =>
            vals &&
            vals.length > 0 &&
            isAttributeVisibleInUi(moduleId, key),
        )
        .sort(([a], [b]) =>
          labelForAttr(moduleConfig, a).localeCompare(labelForAttr(moduleConfig, b), "pt-BR"),
        ),
    [exclusions, moduleConfig, moduleId],
  );

  const visibleGrouping = useMemo(
    () => grouping.filter((id) => isAttributeVisibleInUi(moduleId, id)),
    [grouping, moduleId],
  );

  const periodDetailLines = useMemo((): string[] => {
    if (analysisMode === "comparativo") return [];
    if (periodType === "Diário" || analysisMode === "horaahora") {
      return [`${dateRange.start} — ${dateRange.end}`];
    }
    if (periodType === "Mensal") return [...selectedMonths];
    if (periodType === "Anual") return [...selectedYears].sort();
    if (periodType === "Semanal") {
      if (weeklyMode === "specific") return [...selectedSpecificDays];
      return (weeklyComputedDays || []).map((d) => formatDate(d));
    }
    return [];
  }, [
    analysisMode,
    periodType,
    dateRange,
    selectedMonths,
    selectedYears,
    weeklyMode,
    selectedSpecificDays,
    weeklyComputedDays,
  ]);

  const compDetailLines = (idx: 1 | 2): string[] => {
    if (periodType === "Diário") {
      const dr = idx === 1 ? compDateRange1 : compDateRange2;
      if (!dr.start || !dr.end) return [];
      return [`${dr.start} — ${dr.end}`];
    }
    if (periodType === "Mensal")
      return idx === 1 ? [...compMonths1] : [...compMonths2];
    if (periodType === "Anual")
      return idx === 1 ? [...compYears1].sort() : [...compYears2].sort();
    if (periodType === "Semanal") {
      if (weeklyMode === "specific")
        return idx === 1 ? [...compSpecificDays1] : [...compSpecificDays2];
      const computed = idx === 1 ? compWeeklyComputedDays1 : compWeeklyComputedDays2;
      return (computed || []).map((d) => formatDate(d));
    }
    return [];
  };

  return (
    <AnalysisSummaryChipsShell>
        {analysisMode === "comparativo" ? (
          <>
            {([1, 2] as const).map((idx) => (
              <Popover.Root key={`p${idx}`}>
                <Popover.Trigger asChild>
                  <button
                    type="button"
                    className={ANALYSIS_SUMMARY_TAG_BTN_CLASS}
                    style={ANALYSIS_SUMMARY_TAG_STYLE}
                  >
                    <CalendarIcon size={10} className="shrink-0 text-[#2C2C2C]" />
                    <span>{getComparativoPeriodLabel(idx)}</span>
                    <span className="font-normal ml-0.5">
                      {computeComparativoPeriodSmartSummary(idx, compInput)}
                    </span>
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    className="z-[80] bg-white p-4 rounded-lg shadow-xl border border-[#D9D9D9] w-[260px] animate-in zoom-in-95"
                    sideOffset={5}
                    align="start"
                  >
                    <h4 className="text-xs font-bold text-[#314158] mb-2 uppercase tracking-wide border-b border-[#F1F1F1] pb-2">
                      Período {idx}
                    </h4>
                    <div className="max-h-[200px] overflow-y-auto space-y-1">
                      {compDetailLines(idx).map((line, i) => (
                        <div
                          key={i}
                          className="text-xs text-[#2C2C2C] py-1 border-b border-[#F1F1F1] last:border-0"
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                    <Popover.Arrow className="fill-white" />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            ))}
          </>
        ) : (
          <Popover.Root>
            <Popover.Trigger asChild>
              <button
                type="button"
                className={ANALYSIS_SUMMARY_TAG_BTN_CLASS}
                style={ANALYSIS_SUMMARY_TAG_STYLE}
              >
                <CalendarIcon size={10} className="shrink-0 text-[#2C2C2C]" />
                <span className="uppercase">
                  {periodType === "Semanal"
                    ? "Dias da Semana"
                    : periodType === "Diário"
                      ? "Período"
                      : periodType}
                </span>
                <span className="font-normal ml-0.5">{periodText}</span>
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="z-[80] bg-white p-4 rounded-lg shadow-xl border border-[#D9D9D9] w-[280px] animate-in zoom-in-95"
                sideOffset={5}
                align="start"
              >
                <h4 className="text-xs font-bold text-[#314158] mb-2 uppercase tracking-wide border-b border-[#F1F1F1] pb-2 flex items-center gap-2">
                  <CalendarIcon size={12} className="text-[#566878]" />
                  Período
                </h4>
                <div className="max-h-[220px] overflow-y-auto space-y-1">
                  {(periodDetailLines.length ? periodDetailLines : [periodText]).map((line, i) => (
                    <div
                      key={i}
                      className="text-xs text-[#2C2C2C] py-1.5 border-b border-[#F1F1F1] last:border-0"
                    >
                      {line}
                    </div>
                  ))}
                </div>
                <Popover.Arrow className="fill-white" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        )}

        {includeEntries.map(([key, vals]) => (
          <Popover.Root key={`inc-${key}`}>
            <Popover.Trigger asChild>
              <button
                type="button"
                className={ANALYSIS_SUMMARY_TAG_BTN_CLASS}
                style={ANALYSIS_SUMMARY_TAG_STYLE}
              >
                <Filter size={10} className="shrink-0 text-[#2C2C2C]" />
                <span className="uppercase">{labelForAttr(moduleConfig, key)}:</span>
                <span className="font-normal ml-0.5">
                  {vals.length > 1 ? `${vals.length} itens` : vals[0]}
                </span>
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="z-[80] bg-white p-3 rounded-lg shadow-xl border border-[#D9D9D9] w-[250px] animate-in zoom-in-95"
                sideOffset={5}
              >
                <h4 className="text-xs font-bold text-[#314158] mb-2 uppercase tracking-wide border-b border-[#F1F1F1] pb-1">
                  {labelForAttr(moduleConfig, key)} (inclusão)
                </h4>
                <div className="max-h-[200px] overflow-y-auto space-y-1">
                  {vals.map((val, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-[#2C2C2C] py-1.5 border-b border-[#F1F1F1] last:border-0"
                    >
                      {val}
                    </div>
                  ))}
                </div>
                <Popover.Arrow className="fill-white" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        ))}

        {visibleGrouping.length > 0 && (
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
                  {visibleGrouping.length > 1
                    ? `${visibleGrouping.length} níveis`
                    : labelForAttr(moduleConfig, visibleGrouping[0])}
                </span>
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="z-[80] bg-white p-3 rounded-lg shadow-xl border border-[#D9D9D9] w-[250px] animate-in zoom-in-95"
                sideOffset={5}
              >
                <h4 className="text-xs font-bold text-[#314158] mb-2 uppercase tracking-wide border-b border-[#F1F1F1] pb-1">
                  Níveis de agrupamento
                </h4>
                <div className="space-y-1">
                  {visibleGrouping.map((gId, gIdx) => (
                    <div
                      key={gId}
                      className="text-xs text-[#2C2C2C] py-1.5 border-b border-[#F1F1F1] last:border-0 flex gap-2"
                    >
                      <span className="text-[10px] text-[#808080] w-4 shrink-0">{gIdx + 1}.</span>
                      <span className="uppercase">{labelForAttr(moduleConfig, gId)}</span>
                    </div>
                  ))}
                </div>
                <Popover.Arrow className="fill-white" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        )}

        {excludeEntries.map(([key, vals]) => (
          <Popover.Root key={`exc-${key}`}>
            <Popover.Trigger asChild>
              <button
                type="button"
                className={ANALYSIS_SUMMARY_TAG_BTN_CLASS}
                style={ANALYSIS_SUMMARY_TAG_STYLE}
              >
                <Ban size={10} className="shrink-0 text-red-600" />
                <span className="uppercase">{labelForAttr(moduleConfig, key)}:</span>
                <span className="font-normal ml-0.5">
                  {vals.length > 1 ? `${vals.length} itens` : vals[0]}
                </span>
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="z-[80] bg-white p-3 rounded-lg shadow-xl border border-[#D9D9D9] w-[250px] animate-in zoom-in-95"
                sideOffset={5}
              >
                <h4 className="text-xs font-bold text-[#314158] mb-2 uppercase tracking-wide border-b border-[#F1F1F1] pb-1 flex items-center gap-2">
                  <Ban size={12} className="text-red-600 shrink-0" />
                  {labelForAttr(moduleConfig, key)} (exclusão)
                </h4>
                <div className="max-h-[200px] overflow-y-auto space-y-1">
                  {vals.map((val, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-[#2C2C2C] py-1.5 border-b border-[#F1F1F1] last:border-0"
                    >
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
  );
});
