import React, { useState, useMemo } from "react";
import { Check, Search, Filter, Trash2, Anchor, Tag, Minus } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { cn } from "../utils";
import type { ModuleColors } from "../constants/moduleColors";
import {
  LOCALIZACAO_OPTION_GROUPS,
  MARCA_OPTION_GROUPS,
  modeloListDisplayLabel,
  CANAL_GROUP_CENTAURO_IDS,
  CANAL_GROUP_NIKE_IDS,
} from "../referenceData";
import {
  isRedeLockedAttribute,
  REDE_LOCKED_NETWORK,
} from "../data/attributeUiConfig";

/** Paleta neutra — default / hover / desativado agrupamento */
const NEUTRAL_TEXT = "#808080";
const NEUTRAL_BORDER = "#D9D9D9";
const HOVER_BORDER = "#314158";
const HOVER_SHADOW =
  "0 0 0 3px rgba(86, 104, 120, 0.3), 0 1px 3px rgba(0, 0, 0, 0.08)";

interface Attribute {
  id: string;
  label: string;
  icon: React.ElementType;
  options: string[];
}

type Step = "selection" | "grouping" | "exclusion" | "analysis";

interface AttributeCardProps {
  attribute: Attribute;
  step: Step;
  moduleColors: ModuleColors;
  /** Agrupamento: quando já há 3 atributos, demais botões ficam desativados */
  groupingLimitReached?: boolean;
  selectionCount: number;
  isGrouped: boolean;
  groupLevel: number;
  exclusionCount: number;
  onToggleGroup: () => void;
  onUpdateSelection: (values: string[]) => void;
  onUpdateExclusion: (values: string[]) => void;
  currentSelection: string[];
  currentExclusion: string[];
  tooltip?: string;
}

const BTN_DIM = "w-[140px] h-[50px] shrink-0 rounded-xl border transition-all duration-200 outline-none";

export function AttributeCard({
  attribute,
  step,
  moduleColors,
  groupingLimitReached = false,
  selectionCount,
  isGrouped,
  groupLevel,
  exclusionCount,
  onToggleGroup,
  onUpdateSelection,
  onUpdateExclusion,
  currentSelection,
  currentExclusion,
  tooltip,
}: AttributeCardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  /** Modal MODELO: exibir prefixo `12345678-` (comportamento anterior ao toggle). */
  const [showModeloCode, setShowModeloCode] = useState(true);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return attribute.options;
    return attribute.options.filter((opt) =>
      opt.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [attribute.options, searchTerm]);

  /** Grupos visuais (LOCALIZAÇÃO: STATUS/CD/CDS; MARCA: próprias / demais) — filtrados por busca */
  const clusterGroupsFiltered = useMemo(() => {
    const groups =
      attribute.id === "localizacao"
        ? LOCALIZACAO_OPTION_GROUPS
        : attribute.id === "marca"
          ? MARCA_OPTION_GROUPS
          : null;
    if (!groups) return [];
    const q = searchTerm.trim().toLowerCase();
    return groups
      .map((g) => ({
        ...g,
        options: q
          ? g.options.filter((o) => o.toLowerCase().includes(q))
          : [...g.options],
      }))
      .filter((g) => g.options.length > 0);
  }, [attribute.id, searchTerm]);

  const isRedeLocked = isRedeLockedAttribute(attribute.id);

  const handleToggleOption = (value: string, isSelection: boolean) => {
    if (isRedeLocked) {
      if (!isSelection) return;
      if (value === REDE_LOCKED_NETWORK) {
        onUpdateSelection([REDE_LOCKED_NETWORK]);
      }
      return;
    }

    const currentList = isSelection ? currentSelection : currentExclusion;
    const updateFn = isSelection ? onUpdateSelection : onUpdateExclusion;

    if (currentList.includes(value)) {
      updateFn(currentList.filter((v) => v !== value));
    } else {
      updateFn([...currentList, value]);
    }
  };

  const handleClear = (isSelection: boolean) => {
    if (isRedeLocked && isSelection) return;
    if (isSelection) onUpdateSelection([]);
    else onUpdateExclusion([]);
  };

  /** Modal CANAL: liga/desliga todos os canais do grupo (parcial → completo num clique). */
  const toggleCanalGroup = (members: readonly string[]) => {
    const updateFn = isSelectionMode ? onUpdateSelection : onUpdateExclusion;
    const n = members.filter((m) => currentValues.includes(m)).length;
    const allOn = n === members.length;
    if (allOn) {
      updateFn(currentValues.filter((v) => !members.includes(v)));
    } else {
      updateFn([...new Set([...currentValues, ...members])]);
    }
  };

  const canalGroupCounts = (members: readonly string[]) => {
    const n = members.filter((m) => currentValues.includes(m)).length;
    return { n, allOn: n === members.length, indeterminate: n > 0 && n < members.length };
  };

  const renderCanalMasterRow = (title: string, members: readonly string[]) => {
    const { allOn, indeterminate } = canalGroupCounts(members);
    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? "mixed" : allOn}
        onClick={() => toggleCanalGroup(members)}
        className={cn(
          "group flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-all",
          !allOn && !indeterminate && "text-slate-800 hover:bg-white/80",
          (allOn || indeterminate) && "bg-white/90",
        )}
        style={
          allOn
            ? {
                backgroundColor: moduleColors.backgroundColor,
                color: moduleColors.iconColor,
              }
            : indeterminate
              ? { backgroundColor: "rgba(248, 250, 252, 0.98)" }
              : undefined
        }
      >
        <div
          className={cn(
            "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-all",
            !allOn && !indeterminate && "border-slate-300 bg-white group-hover:border-slate-400",
          )}
          style={
            allOn
              ? {
                  backgroundColor: moduleColors.primaryColor,
                  borderColor: moduleColors.primaryColor,
                }
              : indeterminate
                ? {
                    backgroundColor: moduleColors.primaryColor,
                    borderColor: moduleColors.primaryColor,
                  }
                : undefined
          }
          aria-hidden
        >
          {allOn && <Check size={11} className="text-white" strokeWidth={3} />}
          {indeterminate && !allOn && (
            <Minus size={11} className="text-white" strokeWidth={3} />
          )}
        </div>
        <span
          className={cn(
            "truncate text-[13px] font-semibold tracking-tight",
            (allOn || indeterminate) && "font-bold",
          )}
          style={
            allOn
              ? { color: moduleColors.iconColor }
              : indeterminate
                ? { color: "#334155" }
                : undefined
          }
        >
          {title}
        </span>
      </button>
    );
  };

  /** Modal CANAL: hierarquia Todos Centauro / canais + Todos Nike / canais (com busca nos filhos). */
  const renderCanalGroupedPanel = () => {
    const q = searchTerm.trim().toLowerCase();
    const section = (title: string, members: readonly string[]) => {
      const visible = q
        ? members.filter((m) => m.toLowerCase().includes(q))
        : [...members];
      if (visible.length === 0) return null;
      return (
        <div
          key={title}
          className="overflow-hidden rounded-lg border border-slate-200/90 bg-slate-50/50 shadow-sm"
        >
          {renderCanalMasterRow(title, members)}
          <div className="border-t border-slate-200/80 bg-white/90 px-1 py-1">
            <div className="ml-2 border-l-2 border-slate-200 pl-2.5">
              <div className="space-y-0.5">
                {visible.map((opt) => (
                  <div key={opt} className="pl-0.5">
                    {renderOptionRow(opt)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    };
    const centauro = section("Todos Centauro", CANAL_GROUP_CENTAURO_IDS);
    const nike = section("Todos Nike", CANAL_GROUP_NIKE_IDS);
    if (!centauro && !nike) {
      return (
        <div className="py-8 text-center text-slate-400">
          <p className="text-xs">Nenhum resultado encontrado</p>
        </div>
      );
    }
    return <div className="space-y-3 px-0.5 py-1">{centauro}{nike}</div>;
  };

  const isSelected1 =
    (step === "selection" && selectionCount > 0) ||
    (step === "exclusion" && exclusionCount > 0);
  const isSelected2 = step === "grouping" && isGrouped;
  const isGroupingDisabled =
    step === "grouping" &&
    (groupingLimitReached || isRedeLocked) &&
    !isGrouped;

  const showHoverChrome =
    (isHover || isOpen) && !isGroupingDisabled;

  const tooltipContent = tooltip ? (
    <RadixTooltip.Portal>
      <RadixTooltip.Content
        className="z-[200] bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg max-w-[200px] text-center leading-snug"
        sideOffset={6}
      >
        {tooltip}
        <RadixTooltip.Arrow className="fill-slate-800" />
      </RadixTooltip.Content>
    </RadixTooltip.Portal>
  ) : null;

  // ─── 1. Agrupamento (toggle direto) ───────────────────────────────────────
  if (step === "grouping") {
    const btn = (
      <button
        type="button"
        disabled={isGroupingDisabled}
        onClick={onToggleGroup}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className={cn(
          BTN_DIM,
          "relative flex flex-col items-center justify-center group",
          isGroupingDisabled && "cursor-not-allowed",
          !isGroupingDisabled && "cursor-pointer",
        )}
        style={{
          backgroundColor: "transparent",
          borderWidth: 1,
          borderStyle: "solid",
          ...(isGroupingDisabled
            ? {
                borderColor: "rgba(217, 217, 217, 0.5)",
                color: "rgba(128, 128, 128, 0.5)",
              }
            : isSelected2
              ? {
                  backgroundColor: moduleColors.backgroundColor,
                  borderColor: moduleColors.primaryColor,
                  boxShadow: showHoverChrome ? HOVER_SHADOW : undefined,
                  ...(showHoverChrome ? { borderColor: HOVER_BORDER } : {}),
                }
              : {
                  borderColor: NEUTRAL_BORDER,
                  color: NEUTRAL_TEXT,
                  boxShadow: showHoverChrome ? HOVER_SHADOW : undefined,
                  ...(showHoverChrome ? { borderColor: HOVER_BORDER } : {}),
                }),
        }}
      >
        {isSelected2 ? (
          <span className="flex items-center justify-center gap-1.5 px-2">
            <Anchor
              size={14}
              className="shrink-0"
              style={{ color: moduleColors.iconColor }}
              strokeWidth={2.25}
            />
            <span
              className="text-[12px] font-bold uppercase tracking-wide truncate"
              style={{ color: moduleColors.iconColor }}
            >
              {attribute.label}
            </span>
          </span>
        ) : (
          <span
            className="text-[12px] font-bold uppercase tracking-wide px-2 truncate"
            style={{ color: isGroupingDisabled ? "rgba(128, 128, 128, 0.5)" : NEUTRAL_TEXT }}
          >
            {attribute.label}
          </span>
        )}

        {isSelected2 && (
          <span
            className="absolute z-10 flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{
              top: -11,
              right: -11,
              backgroundColor: moduleColors.primaryColor,
            }}
            aria-hidden
          >
            {groupLevel}
          </span>
        )}
      </button>
    );

    if (tooltip) {
      return (
        <RadixTooltip.Root delayDuration={300}>
          <RadixTooltip.Trigger asChild>
            <span className="inline-flex">{btn}</span>
          </RadixTooltip.Trigger>
          {tooltipContent}
        </RadixTooltip.Root>
      );
    }
    return btn;
  }

  // ─── 2. Seleção & exclusão (Popover) ─────────────────────────────────────
  const isSelectionMode = step === "selection";
  const count = isSelectionMode ? selectionCount : exclusionCount;
  const currentValues = isSelectionMode ? currentSelection : currentExclusion;

  const cardButton = (
    <button
      type="button"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={cn(BTN_DIM, "flex flex-col items-center justify-center group cursor-pointer")}
      style={{
        backgroundColor: "transparent",
        borderWidth: 1,
        borderStyle: "solid",
        ...(isSelected1
          ? {
              backgroundColor: moduleColors.backgroundColor,
              borderColor: moduleColors.primaryColor,
              boxShadow: showHoverChrome ? HOVER_SHADOW : undefined,
              ...(showHoverChrome ? { borderColor: HOVER_BORDER } : {}),
            }
          : {
              borderColor: NEUTRAL_BORDER,
              boxShadow: showHoverChrome ? HOVER_SHADOW : undefined,
              ...(showHoverChrome ? { borderColor: HOVER_BORDER } : {}),
            }),
      }}
    >
      <span
        className="text-[12px] font-bold uppercase tracking-wide px-2 truncate"
        style={{
          color: isSelected1 ? moduleColors.iconColor : NEUTRAL_TEXT,
        }}
      >
        {attribute.label}
      </span>
    </button>
  );

  const optionDisplayLabel = (opt: string) =>
    attribute.id === "modelo"
      ? modeloListDisplayLabel(opt, showModeloCode)
      : opt;

  const renderOptionRow = (opt: string) => {
    const isChecked = currentValues.includes(opt);
    const redeLockedChecked =
      isRedeLocked &&
      isSelectionMode &&
      opt === REDE_LOCKED_NETWORK &&
      isChecked;
    return (
      <button
        type="button"
        onClick={() => handleToggleOption(opt, isSelectionMode)}
        disabled={redeLockedChecked}
        className={cn(
          "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-all",
          !isChecked && "text-slate-600 hover:bg-slate-50",
        )}
        style={
          isChecked
            ? {
                backgroundColor: moduleColors.backgroundColor,
                color: moduleColors.iconColor,
              }
            : undefined
        }
      >
        <div
          className={cn(
            "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-all",
            !isChecked && "border-slate-300 bg-white group-hover:border-slate-400",
          )}
          style={
            isChecked
              ? {
                  backgroundColor: moduleColors.primaryColor,
                  borderColor: moduleColors.primaryColor,
                }
              : undefined
          }
        >
          {isChecked && <Check size={11} className="text-white" strokeWidth={3} />}
        </div>
        <span
          className={cn("truncate text-xs font-medium", isChecked && "font-bold")}
          style={isChecked ? { color: moduleColors.iconColor } : undefined}
        >
          {optionDisplayLabel(opt)}
        </span>
      </button>
    );
  };

  const popoverContent = (
    <Popover.Portal>
      <Popover.Content
        className={cn(
          "z-50 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl duration-200 animate-in zoom-in-95",
          attribute.id === "canal" ? "w-[308px]" : "w-[280px]",
        )}
        sideOffset={8}
        side="top"
      >
        <div
          className={cn(
            "flex items-center justify-between border-b bg-slate-50/50 px-4 py-3",
            isSelectionMode ? "border-slate-100" : "border-slate-100",
          )}
        >
          <div className="flex items-center gap-2">
            {isSelectionMode ? (
              <Filter size={14} style={{ color: moduleColors.primaryColor }} />
            ) : (
              <Trash2 size={14} style={{ color: moduleColors.primaryColor }} />
            )}
            <span className="text-[14px] font-bold uppercase tracking-wide text-slate-700">
              {isSelectionMode ? "Filtrar" : "Excluir"} {attribute.label}
            </span>
          </div>
          {count > 0 && !(isRedeLocked && isSelectionMode) && (
            <button
              type="button"
              onClick={() => handleClear(isSelectionMode)}
              className="text-[10px] font-medium text-slate-500 underline transition-colors hover:text-slate-800"
            >
              Limpar
            </button>
          )}
        </div>

        <div className="border-b border-slate-100 p-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Buscar em ${attribute.label.toLowerCase()}...`}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
              autoFocus
            />
          </div>
          {attribute.id === "modelo" && (
            <div className="flex justify-start px-1 pt-2">
              <button
                type="button"
                onClick={() => setShowModeloCode((v) => !v)}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide underline-offset-2 transition-colors hover:underline"
                style={{ color: moduleColors.primaryColor }}
              >
                {showModeloCode ? "Ocultar código" : "Exibir código"}
                <Tag size={14} className="shrink-0" strokeWidth={2.25} aria-hidden />
              </button>
            </div>
          )}
        </div>

        <div className="scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent max-h-[280px] overflow-y-auto p-1.5">
          {attribute.id === "localizacao" || attribute.id === "marca" ? (
            clusterGroupsFiltered.length > 0 ? (
              <div>
                {clusterGroupsFiltered.map((group, idx) => (
                  <div key={group.id}>
                    {idx > 0 && (
                      <div
                        className="mx-1 my-1 h-px bg-slate-200"
                        role="separator"
                        aria-hidden
                      />
                    )}
                    <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wide text-[#808080]">
                      {group.label}
                    </p>
                    <div className="space-y-0.5 pb-2">
                      {group.options.map((opt) => (
                        <React.Fragment key={opt}>{renderOptionRow(opt)}</React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400">
                <p className="text-xs">Nenhum resultado encontrado</p>
              </div>
            )
          ) : attribute.id === "canal" ? (
            renderCanalGroupedPanel()
          ) : filteredOptions.length > 0 ? (
            <div className="space-y-0.5">
              {filteredOptions.map((opt) => (
                <React.Fragment key={opt}>{renderOptionRow(opt)}</React.Fragment>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400">
              <p className="text-xs">Nenhum resultado encontrado</p>
            </div>
          )}
        </div>

        {count > 0 && (
          <div className="border-t border-slate-100 bg-slate-50 px-3 py-2">
            <div className="flex flex-wrap gap-1">
              {currentValues.slice(0, 3).map((val) => (
                <span
                  key={val}
                  className="inline-flex max-w-[80px] items-center truncate rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-600"
                >
                  {optionDisplayLabel(val)}
                </span>
              ))}
              {count > 3 && (
                <span className="inline-flex items-center rounded bg-slate-200 px-1.5 py-0.5 text-[10px] text-slate-600">
                  +{count - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </Popover.Content>
    </Popover.Portal>
  );

  if (tooltip) {
    return (
      <RadixTooltip.Root delayDuration={300} open={isOpen ? false : undefined}>
        <RadixTooltip.Trigger asChild>
          <span className="inline-flex">
            <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
              <Popover.Trigger asChild>{cardButton}</Popover.Trigger>
              {popoverContent}
            </Popover.Root>
          </span>
        </RadixTooltip.Trigger>
        {tooltipContent}
      </RadixTooltip.Root>
    );
  }

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>{cardButton}</Popover.Trigger>
      {popoverContent}
    </Popover.Root>
  );
}
