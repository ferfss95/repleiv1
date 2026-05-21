/**
 * AnalysisFilters Component
 * Interface de seleção, exclusão e agrupamento de atributos
 *
 * RESPONSABILIDADES:
 * - Renderizar AttributeCards para domínio e localização
 * - Conectar UI aos estados de filtro (selections, exclusions, grouping)
 * - Organizar seções com labels e dividers
 *
 * REGRA DE OURO: Este componente apenas renderiza a UI.
 * Toda lógica de estado está no hook useAttributeFilters.
 */

import React from 'react';
import { AttributeCard as SmartAttributeCard } from '../AttributeCard';
import { ScrollableRow } from '../ScrollableRow';
import {
  LOCATION_ATTRIBUTES,
  MAX_GROUPING_LEVELS,
  type Module,
  type Step,
} from '../../constants';
import { getModuleColors, type ModuleColors } from '../../constants/moduleColors';
import { filterAttributesVisibleInUi } from '../../data/attributeUiVisibility';

// ══════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════

interface AnalysisFiltersProps {
  // Module context
  currentModule: Module;
  currentModuleConfig: any;
  currentStep: Step;
  moduleColors?: ModuleColors;

  // Filter states (from useAttributeFilters hook)
  selections: Record<string, string[]>;
  setSelections: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  grouping: string[];
  setGrouping: React.Dispatch<React.SetStateAction<string[]>>;
  exclusions: Record<string, string[]>;
  setExclusions: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;

  // Functions (from useAttributeFilters hook)
  getAttributeOptions: (attrId: string) => string[];
  handleAttributeClick: (attrId: string) => void;
}

// ══════════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════════

export const AnalysisFilters: React.FC<AnalysisFiltersProps> = ({
  currentModule,
  currentModuleConfig,
  currentStep,
  moduleColors,
  selections,
  setSelections,
  grouping,
  setGrouping,
  exclusions,
  setExclusions,
  getAttributeOptions,
  handleAttributeClick,
}) => {
  const colors = moduleColors ?? getModuleColors(currentModule);
  const groupingLimitReached =
    currentStep === "grouping" && grouping.length >= MAX_GROUPING_LEVELS;
  const visibleDomainAttributes = filterAttributesVisibleInUi(
    currentModule,
    currentModuleConfig.domainAttributes,
  );
  const visibleLocationAttributes = filterAttributesVisibleInUi(
    currentModule,
    LOCATION_ATTRIBUTES,
  );

  return (
    <div className="px-6 py-6">
      <div className="space-y-8">
        {/* Domain attributes (label and list driven by active module) */}
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
            {visibleDomainAttributes.map((attr: any) => (
              <SmartAttributeCard
                key={attr.id}
                attribute={{
                  ...attr,
                  options: getAttributeOptions(attr.id),
                }}
                step={currentStep}
                moduleColors={colors}
                groupingLimitReached={groupingLimitReached}
                selectionCount={selections[attr.id]?.length || 0}
                isGrouped={grouping.includes(attr.id)}
                groupLevel={grouping.indexOf(attr.id) + 1}
                exclusionCount={exclusions[attr.id]?.length || 0}
                onToggleGroup={() => handleAttributeClick(attr.id)}
                onUpdateSelection={(vals) =>
                  setSelections((prev) => ({
                    ...prev,
                    [attr.id]: vals,
                  }))
                }
                onUpdateExclusion={(vals) =>
                  setExclusions((prev) => ({
                    ...prev,
                    [attr.id]: vals,
                  }))
                }
                currentSelection={selections[attr.id] || []}
                currentExclusion={exclusions[attr.id] || []}
              />
            ))}
          </ScrollableRow>
        </div>

        {(currentModuleConfig.domainAttributeExtraRows ?? []).map(
          (row: { sectionLabel: string; attributes: any[] }, rowIdx: number) => (
            <div key={`${row.sectionLabel}-${rowIdx}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-medium uppercase tracking-[1.12px] text-slate-400">
                  {row.sectionLabel}
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <ScrollableRow>
                {filterAttributesVisibleInUi(currentModule, row.attributes).map((attr: any) => (
                  <SmartAttributeCard
                    key={attr.id}
                    attribute={{
                      ...attr,
                      options: getAttributeOptions(attr.id),
                    }}
                    step={currentStep}
                    moduleColors={colors}
                    groupingLimitReached={groupingLimitReached}
                    selectionCount={selections[attr.id]?.length || 0}
                    isGrouped={grouping.includes(attr.id)}
                    groupLevel={grouping.indexOf(attr.id) + 1}
                    exclusionCount={exclusions[attr.id]?.length || 0}
                    onToggleGroup={() => handleAttributeClick(attr.id)}
                    onUpdateSelection={(vals) =>
                      setSelections((prev) => ({
                        ...prev,
                        [attr.id]: vals,
                      }))
                    }
                    onUpdateExclusion={(vals) =>
                      setExclusions((prev) => ({
                        ...prev,
                        [attr.id]: vals,
                      }))
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
        {currentModule === 'PRODUTO' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-medium uppercase tracking-[1.12px] text-slate-400">
                Localização
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <ScrollableRow>
              {visibleLocationAttributes.map((attr) => (
                <SmartAttributeCard
                  key={attr.id}
                  attribute={{
                    ...attr,
                    options: getAttributeOptions(attr.id),
                  }}
                  step={currentStep}
                  moduleColors={colors}
                  groupingLimitReached={groupingLimitReached}
                  selectionCount={selections[attr.id]?.length || 0}
                  isGrouped={grouping.includes(attr.id)}
                  groupLevel={grouping.indexOf(attr.id) + 1}
                  exclusionCount={exclusions[attr.id]?.length || 0}
                  onToggleGroup={() => handleAttributeClick(attr.id)}
                  onUpdateSelection={(vals) =>
                    setSelections((prev) => ({
                      ...prev,
                      [attr.id]: vals,
                    }))
                  }
                  onUpdateExclusion={(vals) =>
                    setExclusions((prev) => ({
                      ...prev,
                      [attr.id]: vals,
                    }))
                  }
                  currentSelection={selections[attr.id] || []}
                  currentExclusion={exclusions[attr.id] || []}
                  tooltip={attr.tooltip || ''}
                />
              ))}
            </ScrollableRow>
          </div>
        )}
      </div>
    </div>
  );
};
