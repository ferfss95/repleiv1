import React from "react";
import {
  TrendingUp,
  ChevronRight,
  PanelRightOpen,
  PanelRightClose,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../utils";
import type { Module, Step } from "../constants";
import type { MetricDef, ModuleConfig } from "../modules/types";
import { NEUTRAL_PALETTE, type ModuleColors } from "../constants/moduleColors";
import { Input } from "./ui/input";
import { stripAccents } from "../utils/searchNormalize";
import { getMetricSidebarLabel } from "../data/metricNaming";
import {
  MetricCheckIconTooltip,
  MetricInfoIconTooltip,
} from "./MetricOrientationTooltip";
import {
  filterMetricsVisibleInUi,
  isMetricVisibleInUi,
} from "../data/metricUiVisibility";

function metricMatchesNormalizedQuery(metric: MetricDef, normQuery: string): boolean {
  if (!normQuery) return true;
  const displayLabel = getMetricSidebarLabel(metric.id, metric.label);
  const haystack = [
    stripAccents(displayLabel.toLowerCase()),
    stripAccents(metric.label.toLowerCase()),
    metric.id.toLowerCase(),
    metric.tooltip ? stripAccents(metric.tooltip.toLowerCase()) : "",
  ].join(" ");
  return haystack.includes(normQuery);
}

type MetricSearchCluster = {
  key: string;
  title: string;
  subtitle?: string;
  metrics: MetricDef[];
};

interface MetricsSidebarProps {
  currentStep: Step;
  /** Ids ativados na preparação; na etapa Resultado a sidebar lista somente este universo. */
  resultMetricCatalog: string[];
  metricsCollapsed: boolean;
  setMetricsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  metricsGroupExpanded: Record<string, boolean>;
  toggleMetricsGroup: (groupId: string) => void;
  selectedMetrics: string[];
  toggleMetric: (metricId: string) => void;
  currentModule: Module;
  currentModuleConfig: ModuleConfig;
  moduleColors: ModuleColors;
}

export const MetricsSidebar = React.memo<MetricsSidebarProps>(function MetricsSidebar({
  currentStep,
  resultMetricCatalog,
  metricsCollapsed,
  setMetricsCollapsed,
  metricsGroupExpanded,
  toggleMetricsGroup,
  selectedMetrics,
  toggleMetric,
  currentModule,
  currentModuleConfig,
  moduleColors,
}: MetricsSidebarProps) {
  const [hoveredMetricId, setHoveredMetricId] = React.useState<string | null>(null);
  const [metricsSearchQuery, setMetricsSearchQuery] = React.useState("");
  const isResultStep = currentStep === "analysis";
  const resultCatalogSet = React.useMemo(
    () => (isResultStep ? new Set(resultMetricCatalog) : null),
    [isResultStep, resultMetricCatalog],
  );

  const filterByUiVisibility = React.useCallback(
    (metrics: MetricDef[]) => filterMetricsVisibleInUi(currentModule, metrics),
    [currentModule],
  );

  const filterByResultCatalog = React.useCallback(
    (metrics: MetricDef[]) => {
      const visible = filterByUiVisibility(metrics);
      return resultCatalogSet ? visible.filter((m) => resultCatalogSet.has(m.id)) : visible;
    },
    [resultCatalogSet, filterByUiVisibility],
  );

  const planningMetrics = currentModuleConfig.planningMetrics || [];
  const excludedFromVendaEstoque = new Set(
    currentModuleConfig.metricsSidebarExcludeFromVendaEstoque || [],
  );
  const vendaEstoqueMetrics = filterByResultCatalog(
    currentModuleConfig.metrics.filter(
      (m) => !planningMetrics.includes(m.id) && !excludedFromVendaEstoque.has(m.id),
    ),
  );
  const planejamentoMetrics = filterByResultCatalog(
    currentModuleConfig.metrics.filter((m) => planningMetrics.includes(m.id)),
  );
  const outrasAfterPlanningIds = currentModuleConfig.metricsSidebarOutrasAfterPlanning || [];
  const outrasAfterPlanningMetrics = filterByResultCatalog(
    outrasAfterPlanningIds
      .map((id) => currentModuleConfig.metrics.find((m) => m.id === id))
      .filter((m): m is MetricDef => Boolean(m)),
  );
  const hasOutrasAccordion =
    planejamentoMetrics.length > 0 || outrasAfterPlanningMetrics.length > 0;
  // Módulos que exibem métricas diretamente, sem accordion "Venda e Estoque"
  const isLojaFlatMetrics = currentModule === "LOJA" || currentModule === "INDICADORES";
  const extraSidebarSections = currentModuleConfig.metricSidebarExtraSections || [];

  /** Oculta métricas fora da planilha v.1; na etapa Resultado, só ids do catálogo de preparação. */
  const visibleExtraSidebarSections = React.useMemo(() => {
    return extraSidebarSections
      .map((section, sectionIdx) => {
        const groupId = section.sidebarGroupId ?? `metric_extra_${sectionIdx}`;
        const groups = section.groups
          .map((group) => ({
            ...group,
            metricIds: group.metricIds.filter(
              (id) =>
                isMetricVisibleInUi(currentModule, id) &&
                (!isResultStep || !resultCatalogSet || resultCatalogSet.has(id)),
            ),
          }))
          .filter((group) => group.metricIds.length > 0);
        if (groups.length === 0) return null;
        return { section, groupId, groups };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
  }, [extraSidebarSections, currentModule, isResultStep, resultCatalogSet]);

  const showVendaEstoqueAccordion =
    !isLojaFlatMetrics && (!isResultStep || vendaEstoqueMetrics.length > 0);
  const showFlatMetricsList =
    isLojaFlatMetrics && (!isResultStep || vendaEstoqueMetrics.length > 0);
  const showPlanejamentoDivider =
    hasOutrasAccordion &&
    (showVendaEstoqueAccordion ||
      showFlatMetricsList ||
      visibleExtraSidebarSections.length > 0);

  React.useEffect(() => {
    setMetricsSearchQuery("");
  }, [currentModule]);

  React.useEffect(() => {
    if (isResultStep) setMetricsSearchQuery("");
  }, [isResultStep]);

  const trimmedSearch = metricsSearchQuery.trim();
  const normSearchQuery = trimmedSearch
    ? stripAccents(trimmedSearch.toLowerCase())
    : "";
  const isSearchMode = normSearchQuery.length > 0;

  const searchClusters = React.useMemo((): MetricSearchCluster[] => {
    if (!normSearchQuery) return [];

    const planningIds = currentModuleConfig.planningMetrics || [];
    const planningSet = new Set(planningIds);
    const excludedFromVenda = new Set(
      currentModuleConfig.metricsSidebarExcludeFromVendaEstoque || [],
    );
    const vendaMetrics = filterMetricsVisibleInUi(
      currentModule,
      currentModuleConfig.metrics.filter(
        (m) => !planningSet.has(m.id) && !excludedFromVenda.has(m.id),
      ),
    );
    const planMetrics = filterMetricsVisibleInUi(
      currentModule,
      currentModuleConfig.metrics.filter((m) => planningSet.has(m.id)),
    );
    const outrasIds = currentModuleConfig.metricsSidebarOutrasAfterPlanning || [];
    const outrasMetrics = filterMetricsVisibleInUi(
      currentModule,
      outrasIds
        .map((id) => currentModuleConfig.metrics.find((m) => m.id === id))
        .filter((m): m is MetricDef => Boolean(m)),
    );
    const hasPlanAccordion = planMetrics.length > 0 || outrasMetrics.length > 0;
    const extras = currentModuleConfig.metricSidebarExtraSections || [];

    const match = (m: MetricDef) => metricMatchesNormalizedQuery(m, normSearchQuery);
    const clusters: MetricSearchCluster[] = [];

    const veHits = vendaMetrics.filter(match);
    if (veHits.length > 0) {
      clusters.push({
        key: isLojaFlatMetrics ? "metricas_flat" : "venda_estoque",
        title: isLojaFlatMetrics ? "Métricas" : "Venda e Estoque",
        metrics: veHits,
      });
    }

    extras.forEach((section, sectionIdx) => {
      const groupId = section.sidebarGroupId ?? `metric_extra_${sectionIdx}`;
      section.groups.forEach((group) => {
        const metrics = filterMetricsVisibleInUi(
          currentModule,
          group.metricIds
            .map((id) => currentModuleConfig.metrics.find((m) => m.id === id))
            .filter((m): m is MetricDef => Boolean(m)),
        ).filter(match);
        if (metrics.length > 0) {
          clusters.push({
            key: `${groupId}__${group.subtitle}`,
            title: section.title,
            subtitle: group.subtitle,
            metrics,
          });
        }
      });
    });

    if (hasPlanAccordion) {
      const planLabel =
        currentModuleConfig.metricsSidebarPlanningGroupLabel ?? "Planejamento";
      const planOrdered: MetricDef[] = [];
      for (const m of planMetrics) {
        if (match(m)) planOrdered.push(m);
      }
      for (const m of outrasMetrics) {
        if (match(m)) planOrdered.push(m);
      }
      if (planOrdered.length > 0) {
        clusters.push({ key: "planejamento", title: planLabel, metrics: planOrdered });
      }
    }

    return clusters;
  }, [normSearchQuery, currentModule, currentModuleConfig, isLojaFlatMetrics]);

  const renderMetricRow = (
    metric: Pick<MetricDef, "id" | "label" | "tooltip" | "orientation" | "formula">,
  ) => {
    const isSelected = selectedMetrics.includes(metric.id);
    const isHovered = hoveredMetricId === metric.id;
    const borderColor = isHovered
      ? NEUTRAL_PALETTE.title
      : isSelected
        ? moduleColors.primaryColor
        : "#ffffff";
    const boxShadow =
      isHovered
        ? "0 0 0 3px rgba(86, 104, 120, 0.3), 0 2px 6px rgba(0, 0, 0, 0.06)"
        : undefined;
    const textColor = isSelected ? moduleColors.iconColor : NEUTRAL_PALETTE.muted;
    return (
      <button
        type="button"
        key={metric.id}
        onClick={() => toggleMetric(metric.id)}
        onMouseEnter={() => setHoveredMetricId(metric.id)}
        onMouseLeave={() => setHoveredMetricId(null)}
        className={cn(
          "w-full text-left px-3 py-2 text-[13px] rounded-lg transition-all duration-200 flex items-center justify-between gap-2 border border-solid",
        )}
        style={{
          backgroundColor: isSelected
            ? moduleColors.backgroundColor
            : isHovered
              ? "#ffffff"
              : "transparent",
          borderColor,
          boxShadow,
          color: textColor,
        }}
      >
        <span className={cn("min-w-0 flex-1 font-medium", isSelected && "font-semibold")}>
          {getMetricSidebarLabel(metric.id, metric.label)}
        </span>
        {isSelected ? (
          <MetricCheckIconTooltip
            metricId={metric.id}
            metric={metric}
            iconColor={moduleColors.iconColor}
          />
        ) : isHovered ? (
          <MetricInfoIconTooltip metricId={metric.id} metric={metric} />
        ) : null}
      </button>
    );
  };

  const vendaEstoqueMetricRows = vendaEstoqueMetrics.map((metric) => renderMetricRow(metric));

  return (
    <aside
      className={cn(
        "bg-white border-l border-[#d5dbe3] flex flex-col overflow-hidden transition-all duration-300 fixed right-0 bottom-0",
        metricsCollapsed ? "w-12" : "w-72",
      )}
      style={{ top: 64 }}
    >
      <div
        className={cn(
          "flex-none",
          metricsCollapsed ? "px-2 pt-4 pb-3" : "px-5 pt-5 pb-4",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          {!metricsCollapsed && (
            <div className="flex min-h-[21px] min-w-0 flex-1 items-center gap-2">
              <TrendingUp size={14} className="shrink-0 text-[#90A1B9]" />
              <h3 className="min-w-0 truncate text-[14px] font-bold uppercase leading-[21px] tracking-wider text-[rgb(49,65,88)]">
                Métricas
              </h3>
            </div>
          )}
          <button
            type="button"
            onClick={() => setMetricsCollapsed((v) => !v)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#90A1B9] transition-colors hover:bg-slate-100 hover:text-[#314158] cursor-pointer"
            title={metricsCollapsed ? "Expandir métricas" : "Recolher métricas"}
          >
            {metricsCollapsed ? (
              <PanelRightOpen size={16} />
            ) : (
              <PanelRightClose size={16} />
            )}
          </button>
        </div>
        {!metricsCollapsed && isResultStep ? (
          <p className="mt-2 text-[12px] leading-[18px] text-[#62748E] pr-8">
            Para selecionar novas métricas, retorne às etapas anteriores.
          </p>
        ) : null}
      </div>

      {!metricsCollapsed && (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-5">
          {!isResultStep ? (
          <div className="shrink-0 bg-white pb-3 pt-0">
            <div className="relative">
              <Search
                size={14}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#90A1B9]"
                aria-hidden
              />
              <Input
                value={metricsSearchQuery}
                onChange={(e) => setMetricsSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setMetricsSearchQuery("");
                }}
                placeholder="Buscar métricas…"
                aria-label="Buscar métricas no menu lateral"
                className="h-9 border-[#d5dbe3] bg-white pl-8 text-[13px] shadow-none placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-slate-200"
              />
            </div>
          </div>
          ) : null}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-4">
              {isSearchMode ? (
                searchClusters.length === 0 ? (
                  <p className="px-1 py-10 text-center text-[13px] leading-relaxed text-slate-500">
                    Nenhuma métrica encontrada para &ldquo;{trimmedSearch}&rdquo;.
                  </p>
                ) : (
                  searchClusters.map((cluster) => (
                    <div key={cluster.key} className="space-y-2">
                      <div className="border-l-2 border-slate-200 pl-2.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#62748E]">
                          {cluster.title}
                        </p>
                        {cluster.subtitle ? (
                          <p
                            className="mt-0.5 text-[10px] font-semibold tracking-wide"
                            style={{ color: "rgba(86, 104, 120, 0.75)" }}
                          >
                            {cluster.subtitle}
                          </p>
                        ) : null}
                      </div>
                      <div className="space-y-1.5">
                        {cluster.metrics.map((metric) => renderMetricRow(metric))}
                      </div>
                    </div>
                  ))
                )
              ) : showFlatMetricsList ? (
                <div className="space-y-1.5">{vendaEstoqueMetricRows}</div>
              ) : !showVendaEstoqueAccordion &&
                visibleExtraSidebarSections.length === 0 &&
                !hasOutrasAccordion ? null : (
                <>
                  {showVendaEstoqueAccordion ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => toggleMetricsGroup("venda_estoque")}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#62748E] hover:text-slate-800 transition-colors group rounded-md hover:bg-slate-50/50"
                    >
                      <div className="flex items-center gap-2">
                        <ChevronRight
                          size={12}
                          className={cn(
                            "text-slate-400 transition-transform duration-200",
                            metricsGroupExpanded["venda_estoque"] && "rotate-90",
                          )}
                        />
                        <span>Venda e Estoque</span>
                      </div>
                    </button>
                    {metricsGroupExpanded["venda_estoque"] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1.5 pl-1"
                      >
                        {vendaEstoqueMetricRows}
                      </motion.div>
                    )}
                  </div>) : null}

                  {/* 2. Exposição de produtos (e demais seções extras configuradas no módulo) */}
                  {visibleExtraSidebarSections.map(({ section, groupId, groups }, sectionIdx) => {
                    const showSectionDivider =
                      sectionIdx > 0 || showVendaEstoqueAccordion;
                    return (
                      <React.Fragment key={groupId}>
                        {showSectionDivider ? (
                          <div className="py-2">
                            <div className="h-px bg-slate-200" />
                          </div>
                        ) : null}
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => toggleMetricsGroup(groupId)}
                            className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#62748E] hover:text-slate-800 transition-colors group rounded-md hover:bg-slate-50/50"
                          >
                            <div className="flex items-center gap-2">
                              <ChevronRight
                                size={12}
                                className={cn(
                                  "text-slate-400 transition-transform duration-200",
                                  metricsGroupExpanded[groupId] && "rotate-90",
                                )}
                              />
                              <span>{section.title}</span>
                            </div>
                          </button>
                          {metricsGroupExpanded[groupId] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-6 pl-1"
                            >
                              {groups.map((group) => (
                                <div key={group.subtitle} className="space-y-1.5">
                                  <p
                                    className="px-2 text-[10px] font-semibold tracking-wide"
                                    style={{ color: "rgba(86, 104, 120, 0.6)" }}
                                  >
                                    {group.subtitle}
                                  </p>
                                  <div className="space-y-1.5">
                                    {group.metricIds.map((metricId) => {
                                      if (!isMetricVisibleInUi(currentModule, metricId)) {
                                        return null;
                                      }
                                      const metric = currentModuleConfig.metrics.find(
                                        (m) => m.id === metricId,
                                      );
                                      return metric ? renderMetricRow(metric) : null;
                                    })}
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })}

                  {/* 3. Planejamento (rótulo do accordion configurável por módulo) */}
                  {hasOutrasAccordion && (
                    <>
                      {showPlanejamentoDivider ? (
                        <div className="py-2">
                          <div className="h-px bg-slate-200" />
                        </div>
                      ) : null}
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => toggleMetricsGroup("planejamento")}
                          className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#62748E] hover:text-slate-800 transition-colors group rounded-md hover:bg-slate-50/50"
                        >
                          <div className="flex items-center gap-2">
                            <ChevronRight
                              size={12}
                              className={cn(
                                "text-slate-400 transition-transform duration-200",
                                metricsGroupExpanded["planejamento"] && "rotate-90",
                              )}
                            />
                            <span>
                              {currentModuleConfig.metricsSidebarPlanningGroupLabel ??
                                "Planejamento"}
                            </span>
                          </div>
                        </button>
                        {metricsGroupExpanded["planejamento"] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                              "pl-1",
                              planejamentoMetrics.length > 0 || outrasAfterPlanningMetrics.length > 0
                                ? "space-y-2"
                                : "space-y-1.5",
                            )}
                          >
                            {currentModuleConfig.metricsSidebarPlanningSubgroupLabel &&
                              planejamentoMetrics.length > 0 && (
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600 px-2">
                                  {currentModuleConfig.metricsSidebarPlanningSubgroupLabel}
                                </p>
                              )}
                            {planejamentoMetrics.length > 0 && (
                              <div className="space-y-1.5">
                                {planejamentoMetrics.map((metric) => renderMetricRow(metric))}
                              </div>
                            )}
                            {outrasAfterPlanningMetrics.length > 0 && (
                              <div
                                className={cn(
                                  "space-y-1.5",
                                  planejamentoMetrics.length > 0 && "pt-1",
                                )}
                              >
                                {outrasAfterPlanningMetrics.map((metric) => renderMetricRow(metric))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
});
