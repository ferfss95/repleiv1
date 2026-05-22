/**
 * useAttributeFilters Hook
 * Gerencia estados e lógica de filtros de atributos (Seleção, Exclusão, Agrupamento)
 *
 * RESPONSABILIDADES:
 * - Manter states: selections, grouping, exclusions
 * - Fornecer opções dinâmicas para cada atributo (dependentes de seleções)
 * - Gerenciar lógica de toggle de agrupamento
 * - Calcular filtros ativos consolidados
 *
 * REGRA DE OURO: Esta lógica está homologada. Não altere o comportamento.
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  LOCATION_ATTRIBUTES,
  MAX_GROUPING_LEVELS,
  type Step,
} from '../constants';
import {
  collectAllDomainAttributes,
  type ModuleConfig,
} from '../modules/types';
import { isAttributeVisibleInUi } from '../data/attributeUiVisibility';
import {
  isRedeLockedAttribute,
  REDE_LOCKED_NETWORK,
  REDE_UI_OPTIONS,
} from '../data/attributeUiConfig';
import type { Module } from '../constants';
import {
  CANAL_OPTIONS,
  TIPO_OPTIONS,
  REGIONAL_OPTIONS,
  LOCALIZACAO_OPTIONS,
  VENDEDOR_OPTIONS,
  ORIGEM_OPTIONS,
  ORDERED_LOJAS_LIST,
  STATE_TO_UF,
  CIDADES_BY_ESTADO,
  ESTADOS_LIST,
  filterCitiesByKnownLinks,
  filterRegionalsByKnownLinks,
  filterStatesByKnownLinks,
  filterStoresByKnownLinks,
} from '../referenceData';

// ══════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════

interface UseAttributeFiltersProps {
  currentModuleConfig: ModuleConfig;
  currentStep: Step;
}

interface ActiveFilter {
  key: string;
  vals: string[];
  type: 'include' | 'exclude';
}

// ══════════════════════════════════════════════════════════════════
// HOOK
// ══════════════════════════════════════════════════════════════════

export const useAttributeFilters = (props: UseAttributeFiltersProps) => {
  const { currentModuleConfig, currentStep } = props;

  // ─── STATES ───
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [grouping, setGrouping] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<Record<string, string[]>>({});

  const moduleId = currentModuleConfig.id as Module;

  // REDE v.1: Centauro sempre selecionado; sem agrupamento/exclusão.
  useEffect(() => {
    if (!isAttributeVisibleInUi(moduleId, 'rede')) return;

    setSelections((prev) => {
      const current = prev.rede;
      if (
        current?.length === 1 &&
        current[0] === REDE_LOCKED_NETWORK
      ) {
        return prev;
      }
      return { ...prev, rede: [REDE_LOCKED_NETWORK] };
    });

    setExclusions((prev) => {
      if (!prev.rede?.length) return prev;
      const { rede: _removed, ...rest } = prev;
      return rest;
    });

    setGrouping((prev) =>
      prev.includes('rede') ? prev.filter((id) => id !== 'rede') : prev,
    );
  }, [moduleId, setSelections, setExclusions, setGrouping]);

  // ─── GET ATTRIBUTE OPTIONS (Dynamic options based on selections) ───
  const getAttributeOptions = useCallback(
    (attrId: string) => {
      // First check if this attribute belongs to the current module's domain
      // (for Loja module, rede/tipo/estado/regional/cidade/loja are domain attributes)
      if (
        collectAllDomainAttributes(currentModuleConfig).some(
          (attr) => attr.id === attrId,
        )
      ) {
        return currentModuleConfig.getDomainAttributeOptions(attrId, selections);
      }

      // Otherwise handle location attributes (for PRODUTO module)
      switch (attrId) {
        case 'rede':
          return [...REDE_UI_OPTIONS];
        case 'canal':
          return CANAL_OPTIONS;
        case 'tipo':
          return TIPO_OPTIONS;
        case 'regional':
          return filterRegionalsByKnownLinks(REGIONAL_OPTIONS, selections);
        case 'localizacao':
          return LOCALIZACAO_OPTIONS;
        case 'vendedor':
          return VENDEDOR_OPTIONS;
        case 'origem':
          return ORIGEM_OPTIONS;
        case 'loja':
          return filterStoresByKnownLinks(ORDERED_LOJAS_LIST, selections);
        case 'estado': {
          const selectedCities = selections['cidade'] || [];

          const formatState = (name: string) => `${name} - ${STATE_TO_UF[name] || ''}`;

          if (selectedCities.length === 0) {
            const allStates = ESTADOS_LIST.map(formatState).sort();
            return filterStatesByKnownLinks(allStates, selections);
          }

          const states = new Set<string>();
          selectedCities.forEach((cityString) => {
            // Format is "City - UF"
            const parts = cityString.split(' - ');
            if (parts.length >= 2) {
              const uf = parts[parts.length - 1];
              const stateName = Object.keys(STATE_TO_UF).find(
                (key) => STATE_TO_UF[key] === uf,
              );
              if (stateName && ESTADOS_LIST.includes(stateName)) {
                states.add(formatState(stateName));
              }
            }
          });
          return filterStatesByKnownLinks(Array.from(states).sort(), selections);
        }
        case 'cidade': {
          const selectedStates = selections['estado'] || [];
          let formattedCities: string[] = [];

          const getRawState = (opt: string) => opt.split(' - ')[0];

          if (selectedStates.length === 0) {
            Object.entries(CIDADES_BY_ESTADO).forEach(([state, cities]) => {
              const uf = STATE_TO_UF[state];
              cities.forEach((city) => formattedCities.push(`${city} - ${uf}`));
            });
          } else {
            selectedStates.forEach((stateOpt) => {
              const rawState = getRawState(stateOpt);
              const cities = CIDADES_BY_ESTADO[rawState] || [];
              const uf = STATE_TO_UF[rawState];
              if (cities && uf) {
                cities.forEach((city) => formattedCities.push(`${city} - ${uf}`));
              }
            });
          }
          return filterCitiesByKnownLinks(
            Array.from(new Set(formattedCities)).sort(),
            selections,
          );
        }
        // Domain-specific attributes — delegated to the active module config
        default:
          return currentModuleConfig.getDomainAttributeOptions(attrId, selections);
      }
    },
    [selections, currentModuleConfig],
  );

  // ─── HANDLE ATTRIBUTE CLICK (Grouping toggle) ───
  const handleAttributeClick = useCallback(
    (attrId: string) => {
      if (isRedeLockedAttribute(attrId)) return;

      const module = currentModuleConfig.id as Module;
      if (!isAttributeVisibleInUi(module, attrId)) return;

      if (currentStep === 'grouping') {
        setGrouping((prev) => {
          if (prev.includes(attrId)) {
            // Remove this attribute from the hierarchy
            return prev.filter((id) => id !== attrId);
          } else {
            if (prev.length >= MAX_GROUPING_LEVELS) return prev;
            // Add at the end (next level)
            return [...prev, attrId];
          }
        });
      }
    },
    [currentStep, currentModuleConfig.id],
  );

  // ─── ACTIVE FILTERS (Consolidated selections + exclusions) ───
  const activeFilters: ActiveFilter[] = useMemo(
    () => [
      ...(selections
        ? Object.entries(selections)
            .filter(([, vals]) => vals && vals.length > 0)
            .map(([k, v]) => ({
              key: k,
              vals: v,
              type: 'include' as const,
            }))
        : []),
      ...(exclusions
        ? Object.entries(exclusions)
            .filter(([, vals]) => vals && vals.length > 0)
            .map(([k, v]) => ({
              key: k,
              vals: v,
              type: 'exclude' as const,
            }))
        : []),
    ],
    [selections, exclusions],
  );

  return {
    // States
    selections,
    setSelections,
    grouping,
    setGrouping,
    exclusions,
    setExclusions,

    // Functions
    getAttributeOptions,
    handleAttributeClick,

    // Computed
    activeFilters,
  };
};
