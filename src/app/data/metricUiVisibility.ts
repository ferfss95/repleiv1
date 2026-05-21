import type { Module } from '../constants';

/**
 * Métricas com coluna VERSÕES = "v.1" na planilha [Métricas] Lista Geral.
 * Demais métricas permanecem no código (ModuleConfig, mocks, AnalysisView), mas não aparecem na UI.
 */
export const METRIC_UI_VISIBLE_BY_MODULE: Record<Module, ReadonlySet<string>> = {
  PRODUTO: new Set([
    'venda',
    'qtd_itens',
    'lucro_bruto',
    'margem',
    'qtd_estoque',
  ]),
  LOJA: new Set([
    'rob',
    'qtd_itens_loja',
    'valor_meta',
    'desvio_meta_r',
    'desvio_meta_p',
  ]),
  INDICADORES: new Set([
    'ind_tkm',
    'qtd_vendas_loja',
    'conversao',
    'ind_ipc',
    'ind_paridade',
    'ind_cupons_mistos',
  ]),
  /** Mesmo recorte de PRODUTO (módulo placeholder sem exposição). */
  EXTRAVIOS: new Set([
    'venda',
    'qtd_venda',
    'qtd_itens',
    'lucro_bruto',
    'margem',
    'qtd_estoque',
  ]),
};

export function isMetricVisibleInUi(module: Module, metricId: string): boolean {
  return METRIC_UI_VISIBLE_BY_MODULE[module].has(metricId);
}

export function filterMetricsVisibleInUi<T extends { id: string }>(
  module: Module,
  metrics: readonly T[],
): T[] {
  return metrics.filter((m) => isMetricVisibleInUi(module, m.id));
}
