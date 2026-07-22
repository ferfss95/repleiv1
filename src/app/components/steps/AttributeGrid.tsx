import React from "react";
import { Filter, Anchor, Ban } from "lucide-react";
import { cn } from "../../utils";
import {
  LOCATION_ATTRIBUTES,
  MAX_GROUPING_LEVELS,
  type Module,
  type Step,
} from "../../constants";
import { ScrollableRow } from "../ScrollableRow";
import { AttributeCard as SmartAttributeCard } from "../AttributeCard";
import type { ModuleConfig } from "../../modules/types";
import type { ModuleColors } from "../../constants/moduleColors";
import { filterAttributesVisibleInUi } from "../../data/attributeUiVisibility";
import {
  isRedeLockedAttribute,
  sanitizeRedeSelection,
} from "../../data/attributeUiConfig";

interface AttributeGridProps {
  currentStep: Step;
  currentModule: Module;
  currentModuleConfig: ModuleConfig;
  moduleColors: ModuleColors;
  selections: Record<string, string[]>;
  setSelections: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  grouping: string[];
  exclusions: Record<string, string[]>;
  setExclusions: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  getAttributeOptions: (attrId: string) => string[];
  handleAttributeClick: (attrId: string) => void;
}

export const AttributeGrid = React.memo<AttributeGridProps>(function AttributeGrid({
  currentStep,
  currentModule,
  currentModuleConfig,
  moduleColors,
  selections,
  setSelections,
  grouping,
  exclusions,
  setExclusions,
  getAttributeOptions,
  handleAttributeClick,
}: AttributeGridProps) {
  const visibleDomainAttributes = filterAttributesVisibleInUi(
    currentModule,
    currentModuleConfig.domainAttributes,
  );
  const visibleLocationAttributes = filterAttributesVisibleInUi(
    currentModule,
    LOCATION_ATTRIBUTES,
  );

  return (
    <div className="bg-white rounded-xl border border-[#D9D9D9] shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden shrink-0">
      {/* Header */}
      <div className="bg-white px-6 py-3 flex items-center gap-3 flex-none flex-wrap">
        {currentStep === "selection" && (
          <Filter size={16} className="text-[#90A1B9]" />
        )}
        {currentStep === "grouping" && (
          <Anchor size={16} className="text-[#90A1B9]" />
        )}
        {currentStep === "exclusion" && (
          <Ban size={16} className="text-[#90A1B9]" />
        )}
        <span className="text-[14px] font-bold uppercase text-[rgb(49,65,88)] tracking-[1.2px]">
          {currentStep === "selection" && "Selecionar Atributos"}
          {currentStep === "grouping" && "Agrupar Atributos"}
          {currentStep === "exclusion" && "Excluir Atributos"}
        </span>
        {currentStep === "grouping" && (
          <span
            className="text-[14px] font-semibold tabular-nums text-[#314158] ml-2"
            aria-live="polite"
          >
            {grouping.length}/{MAX_GROUPING_LEVELS}
          </span>
        )}
      </div>

      {/* Content with ScrollableRow */}
      <div className="px-6 py-4">
        <div className="space-y-6">
          {/* Domain attributes */}
          <div>
            {currentModuleConfig.domainSectionLabel && (
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-medium uppercase tracking-[1.12px] text-slate-400">
                  {currentModuleConfig.domainSectionLabel}
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
            )}
            <ScrollableRow>
              {visibleDomainAttributes.map((attr) => (
                <SmartAttributeCard
                  key={attr.id}
                  attribute={{ ...attr, options: getAttributeOptions(attr.id) }}
                  step={currentStep}
                  moduleColors={moduleColors}
                  groupingLimitReached={
                    currentStep === "grouping" &&
                    grouping.length >= MAX_GROUPING_LEVELS
                  }
                  selectionCount={selections[attr.id]?.length || 0}
                  isGrouped={grouping.includes(attr.id)}
                  groupLevel={grouping.indexOf(attr.id) + 1}
                  exclusionCount={exclusions[attr.id]?.length || 0}
                  onToggleGroup={() => handleAttributeClick(attr.id)}
                  onUpdateSelection={(vals) =>
                    setSelections((prev) => ({
                      ...prev,
                      [attr.id]: isRedeLockedAttribute(attr.id)
                        ? sanitizeRedeSelection(vals)
                        : vals,
                    }))
                  }
                  onUpdateExclusion={(vals) =>
                    setExclusions((prev) => ({ ...prev, [attr.id]: vals }))
                  }
                  currentSelection={selections[attr.id] || []}
                  currentExclusion={exclusions[attr.id] || []}
                />
              ))}
            </ScrollableRow>
          </div>

          {(currentModuleConfig.domainAttributeExtraRows ?? []).map(
            (row, rowIdx) => (
              <div key={`${row.sectionLabel}-${rowIdx}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-medium uppercase tracking-[1.12px] text-slate-400">
                    {row.sectionLabel}
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
                <ScrollableRow>
                  {filterAttributesVisibleInUi(currentModule, row.attributes).map((attr) => (
                    <SmartAttributeCard
                      key={attr.id}
                      attribute={{ ...attr, options: getAttributeOptions(attr.id) }}
                      step={currentStep}
                      moduleColors={moduleColors}
                      groupingLimitReached={
                        currentStep === "grouping" &&
                        grouping.length >= MAX_GROUPING_LEVELS
                      }
                      selectionCount={selections[attr.id]?.length || 0}
                      isGrouped={grouping.includes(attr.id)}
                      groupLevel={grouping.indexOf(attr.id) + 1}
                      exclusionCount={exclusions[attr.id]?.length || 0}
                      onToggleGroup={() => handleAttributeClick(attr.id)}
                      onUpdateSelection={(vals) =>
                        setSelections((prev) => ({
                          ...prev,
                          [attr.id]: isRedeLockedAttribute(attr.id)
                            ? sanitizeRedeSelection(vals)
                            : vals,
                        }))
                      }
                      onUpdateExclusion={(vals) =>
                        setExclusions((prev) => ({ ...prev, [attr.id]: vals }))
                      }
                      currentSelection={selections[attr.id] || []}
                      currentExclusion={exclusions[attr.id] || []}
                    />
                  ))}
                </ScrollableRow>
              </div>
            ),
          )}

          {/* Localização (only shown for modules that use separate location section) */}
          {currentModule === "PRODUTO" && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-medium uppercase tracking-[1.12px] text-slate-400">
                  Localização
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <ScrollableRow>
                {visibleLocationAttributes.map((attr) => {
                  const isLojaCdsGrouping = attr.id === "loja";
                  const displayAttr = isLojaCdsGrouping
                    ? { ...attr, label: "LOJA / CD", options: getAttributeOptions(attr.id) }
                    : { ...attr, options: getAttributeOptions(attr.id) };
                  return (
                    <SmartAttributeCard
                      key={attr.id}
                      attribute={displayAttr}
                      step={currentStep}
                      moduleColors={moduleColors}
                      groupingLimitReached={
                        currentStep === "grouping" &&
                        grouping.length >= MAX_GROUPING_LEVELS
                      }
                      selectionCount={selections[attr.id]?.length || 0}
                      isGrouped={grouping.includes(attr.id)}
                      groupLevel={grouping.indexOf(attr.id) + 1}
                      exclusionCount={exclusions[attr.id]?.length || 0}
                      onToggleGroup={() => handleAttributeClick(attr.id)}
                      onUpdateSelection={(vals) =>
                        setSelections((prev) => ({
                          ...prev,
                          [attr.id]: isRedeLockedAttribute(attr.id)
                            ? sanitizeRedeSelection(vals)
                            : vals,
                        }))
                      }
                      onUpdateExclusion={(vals) =>
                        setExclusions((prev) => ({ ...prev, [attr.id]: vals }))
                      }
                      currentSelection={selections[attr.id] || []}
                      currentExclusion={exclusions[attr.id] || []}
                      tooltip={attr.tooltip || ""}
                      useLojaCdsGrouping={isLojaCdsGrouping}
                    />
                  );
                })}
              </ScrollableRow>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
