import type { Module } from '../constants';
import { isProdutoDomainAttrId } from '../modules/produto';

/**
 * Atributos com coluna VERSÕES = "v.1" na planilha [Atributos] Lista Geral.
 * Demais atributos permanecem no código, mas não aparecem na UI.
 */

/** Ocultos na UI em todos os módulos (definição e handlers permanecem no código). */
const ATTRIBUTE_UI_HIDDEN_ALL_MODULES = new Set(['tipo']);

/** Bloco Produto: PRODUTO (domínio) e LOJA/EXTRAVIOS (linha extra «Produto»). */
const MODULES_WITH_PRODUTO_SECTION = new Set<Module>(['PRODUTO', 'LOJA', 'EXTRAVIOS']);

const PRODUTO_DOMAIN_UI_VISIBLE = new Set([
  'sala',
  'mesa',
  'categoria',
  'modalidade',
  'grupo',
  'subgrupo',
  'marca',
  'modelo',
  'genero',
  'faixa_etaria',
  'cor',
  'tamanho',
]);

/** Atributos extras visíveis por módulo, fora do domínio Produto compartilhado e de Localização. */
const EXTRA_UI_VISIBLE_BY_MODULE: Record<Module, ReadonlySet<string>> = {
  PRODUTO: new Set(),
  LOJA: new Set(),
  INDICADORES: new Set(),
  EXTRAVIOS: new Set(),
};

/** Localização por módulo (coluna MÓDULO da planilha). */
const LOCATION_UI_VISIBLE_BY_MODULE: Record<Module, ReadonlySet<string>> = {
  PRODUTO: new Set([
    'rede',
    'canal',
    'estado',
    'regional',
    'cidade',
    'loja',
  ]),
  LOJA: new Set(['rede', 'estado', 'regional', 'cidade', 'loja']),
  INDICADORES: new Set(['rede', 'estado', 'regional', 'cidade', 'loja']),
  EXTRAVIOS: new Set([
    'rede',
    'canal',
    'estado',
    'regional',
    'cidade',
    'loja',
  ]),
};

export function isAttributeVisibleInUi(module: Module, attrId: string): boolean {
  if (ATTRIBUTE_UI_HIDDEN_ALL_MODULES.has(attrId)) {
    return false;
  }
  if (EXTRA_UI_VISIBLE_BY_MODULE[module].has(attrId)) {
    return true;
  }
  if (isProdutoDomainAttrId(attrId)) {
    return (
      MODULES_WITH_PRODUTO_SECTION.has(module) &&
      PRODUTO_DOMAIN_UI_VISIBLE.has(attrId)
    );
  }
  return LOCATION_UI_VISIBLE_BY_MODULE[module].has(attrId);
}

export function filterAttributesVisibleInUi<T extends { id: string }>(
  module: Module,
  attrs: readonly T[],
): T[] {
  return attrs.filter((a) => isAttributeVisibleInUi(module, a.id));
}
