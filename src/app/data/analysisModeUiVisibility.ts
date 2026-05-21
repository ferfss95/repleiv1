import type { AnalysisMode } from '../types/wizard';

/**
 * Modos com coluna VERSÕES / escopo v.1 de produto: apenas «Geral» (padrao) na UI.
 * Evolutiva, Comparativa e Intraday permanecem no código, mas não são selecionáveis.
 */
export const UI_VISIBLE_ANALYSIS_MODES: readonly AnalysisMode[] = ['padrao'];

const UI_VISIBLE_SET = new Set<AnalysisMode>(UI_VISIBLE_ANALYSIS_MODES);

export function isAnalysisModeVisibleInUi(mode: AnalysisMode): boolean {
  return UI_VISIBLE_SET.has(mode);
}
