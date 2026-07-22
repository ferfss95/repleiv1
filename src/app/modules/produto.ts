import {
  DollarSign,
  Activity,
  ShoppingCart,
  Package,
  Percent,
  Tag,
  Layers,
  Users,
  Component,
  Palette,
  Ruler,
  Hash,
  MapPin,
  Building2,
  Store,
  UserCircle,
  Target,
  Megaphone,
  PackageOpen,
  MousePointerClick,
  Shirt,
  Table2,
  LayoutGrid,
  Watch,
  Glasses,
  ShoppingBasket,
  Refrigerator,
  BarChart3,
  Award,
  FlaskConical,
} from 'lucide-react';
import {
  CATEGORIAS_LIST,
  MODALIDADES_BY_CATEGORIA,
  GRUPOS_LIST,
  SUBGRUPOS_BY_GRUPO,
  MARCA_OPTIONS,
  FRANQUIA_OPTIONS,
  GENERO_OPTIONS,
  FAIXA_ETARIA_OPTIONS,
  COR_OPTIONS,
  TAMANHO_OPTIONS,
  SABOR_OPTIONS,
  MODELO_OPTIONS,
  VENDEDOR_OPTIONS,
  SALA_OPTIONS,
  MESA_OPTIONS,
  filterMesasBySalasOptions,
} from '../referenceData';
import type { AttributeDef, ModuleConfig } from './types';

/** Métricas do bloco "Exposição de produtos" (sidebar + tabela); EXTRAVIOS remove estas da cópia base. */
export const EXPOSICAO_PRODUTO_METRIC_IDS = [
  'exp_calc_clicks_tenis',
  'exp_calc_clicks_chuteiras',
  'exp_vest_bracos_araras',
  'exp_vest_mesas',
  'exp_meias_bracos',
  'exp_acc_torres_relogios',
  'exp_acc_torres_oculos',
  'exp_acc_cestos_bolas',
  'exp_checkstand_modulos',
  'exp_nut_geladeiras',
] as const;

const FOOD_CATEGORY = 'Alimento';
const FOOD_GROUP = 'Alimentos';

const applyGroupCategoryCoherence = (
  attrId: string,
  options: string[],
  selections: Record<string, string[]>,
): string[] => {
  const selectedGroups = selections['grupo'] || [];
  const selectedCategories = selections['categoria'] || [];

  // grupo -> categoria
  if (attrId === 'categoria' && selectedGroups.length > 0) {
    const hasFoodGroup = selectedGroups.includes(FOOD_GROUP);
    const hasNonFoodGroup = selectedGroups.some((g) => g !== FOOD_GROUP);

    if (hasFoodGroup && !hasNonFoodGroup) {
      return options.filter((opt) => opt === FOOD_CATEGORY);
    }
    if (!hasFoodGroup && hasNonFoodGroup) {
      return options.filter((opt) => opt !== FOOD_CATEGORY);
    }
  }

  // categoria -> grupo
  if (attrId === 'grupo' && selectedCategories.length > 0) {
    const hasFoodCategory = selectedCategories.includes(FOOD_CATEGORY);
    const hasNonFoodCategory = selectedCategories.some((c) => c !== FOOD_CATEGORY);

    if (hasFoodCategory && !hasNonFoodCategory) {
      return options.filter((opt) => opt === FOOD_GROUP);
    }
    if (!hasFoodCategory && hasNonFoodCategory) {
      return options.filter((opt) => opt !== FOOD_GROUP);
    }
  }

  return options;
};

/** Mesma hierarquia do módulo PRODUTO (SALA → SABOR); reutilizada em LOJA e INDICADORES. */
export const PRODUTO_DOMAIN_ATTRIBUTE_DEFS: AttributeDef[] = [
  { id: 'sala',         label: 'SALA',         icon: Megaphone,   options: [] },
  { id: 'mesa',         label: 'MESA',         icon: LayoutGrid,  options: [] },
  { id: 'categoria',    label: 'CATEGORIA',    icon: Tag,         options: [] },
  { id: 'modalidade',   label: 'MODALIDADE',   icon: Activity,    options: [] },
  { id: 'grupo',        label: 'GRUPO',        icon: Layers,      options: [] },
  { id: 'subgrupo',     label: 'SUB-GRUPO',    icon: Layers,      options: [] },
  { id: 'marca',        label: 'MARCA',        icon: Tag,         options: [] },
  { id: 'franquia',     label: 'FRANQUIA',     icon: Award,       options: [] },
  { id: 'modelo',       label: 'MODELO',       icon: Component,   options: [] },
  { id: 'genero',       label: 'GÊNERO',       icon: Users,       options: [] },
  { id: 'faixa_etaria', label: 'FAIXA ETÁRIA', icon: Users,       options: [] },
  { id: 'cor',          label: 'COR',          icon: Palette,     options: [] },
  { id: 'tamanho',      label: 'TAMANHO',      icon: Ruler,       options: [] },
  { id: 'sabor',        label: 'SABOR',        icon: Hash,        options: [] },
];

const PRODUTO_DOMAIN_ATTR_ID_SET = new Set(
  PRODUTO_DOMAIN_ATTRIBUTE_DEFS.map((a) => a.id),
);

export function isProdutoDomainAttrId(attrId: string): boolean {
  return PRODUTO_DOMAIN_ATTR_ID_SET.has(attrId);
}

/** Atributo exclusivo do PRODUTO (não compartilhado com LOJA/INDICADORES). */
export const TESTE_OPTIONS = ['Teste A', 'Teste B', 'Teste C'];

const TESTE_ATTRIBUTE_DEF: AttributeDef = {
  id: 'teste',
  label: 'TESTE',
  icon: FlaskConical,
  options: [],
};

// ──────────────────────────────────────────────────────────────
// PRODUTO module configuration
// ──────────────────────────────────────────────────────────────

export const produtoModule: ModuleConfig = {
  id: 'PRODUTO',
  label: 'PRODUTO',
  domainSectionLabel: 'Produto',

  // ── Domain attributes ──────────────────────────────────────
  domainAttributes: [...PRODUTO_DOMAIN_ATTRIBUTE_DEFS, TESTE_ATTRIBUTE_DEF],

  // ── Dynamic options per domain attribute ──────────────────
  getDomainAttributeOptions(attrId, selections) {
    switch (attrId) {
      case 'sala':         return SALA_OPTIONS;
      case 'mesa':
        return filterMesasBySalasOptions(MESA_OPTIONS, selections['sala']);
      case 'categoria': {
        const selectedModalidades = selections['modalidade'] || [];
        if (selectedModalidades.length === 0) {
          return applyGroupCategoryCoherence('categoria', CATEGORIAS_LIST, selections);
        }
        const validCategories = new Set<string>();
        selectedModalidades.forEach(mod => {
          Object.entries(MODALIDADES_BY_CATEGORIA).forEach(([cat, mods]) => {
            if (mods.includes(mod)) validCategories.add(cat);
          });
        });
        return applyGroupCategoryCoherence(
          'categoria',
          Array.from(validCategories).sort(),
          selections,
        );
      }
      case 'modalidade': {
        const selectedCategories = selections['categoria'] || [];
        if (selectedCategories.length === 0) {
          const allMods = new Set<string>();
          Object.values(MODALIDADES_BY_CATEGORIA).flat().forEach(m => allMods.add(m));
          return Array.from(allMods).sort();
        }
        const mods = selectedCategories.flatMap(cat => MODALIDADES_BY_CATEGORIA[cat] || []);
        return Array.from(new Set(mods)).sort();
      }
      case 'grupo': {
        const selectedSub = selections['subgrupo'] || [];
        if (selectedSub.length === 0) {
          return applyGroupCategoryCoherence('grupo', GRUPOS_LIST, selections);
        }
        const validGroups = new Set<string>();
        selectedSub.forEach(sub => {
          Object.entries(SUBGRUPOS_BY_GRUPO).forEach(([grp, subs]) => {
            if (subs.includes(sub)) validGroups.add(grp);
          });
        });
        return applyGroupCategoryCoherence(
          'grupo',
          Array.from(validGroups).sort(),
          selections,
        );
      }
      case 'subgrupo': {
        const selectedGroups = selections['grupo'] || [];
        if (selectedGroups.length === 0) {
          const allSubs = Object.values(SUBGRUPOS_BY_GRUPO).flat();
          return Array.from(new Set(allSubs)).sort();
        }
        const subs = selectedGroups.flatMap(grp => SUBGRUPOS_BY_GRUPO[grp] || []);
        return Array.from(new Set(subs)).sort();
      }
      case 'marca':        return MARCA_OPTIONS;
      case 'franquia':     return [...FRANQUIA_OPTIONS];
      case 'modelo':       return MODELO_OPTIONS;
      case 'genero':       return GENERO_OPTIONS;
      case 'faixa_etaria': return FAIXA_ETARIA_OPTIONS;
      case 'cor':          return COR_OPTIONS;
      case 'tamanho':      return TAMANHO_OPTIONS;
      case 'sabor':        return SABOR_OPTIONS;
      case 'teste':        return TESTE_OPTIONS;
      default:             return [];
    }
  },

  // ── Cross-attribute filter for AnalysisView grouping ──────
  getFilteredGroupOptions(attrId, options, selections, _exclusions) {
    let result = options;

    // categoria ↔ modalidade
    if (attrId === 'modalidade') {
      const selectedCats = selections['categoria'] || [];
      if (selectedCats.length > 0) {
        const allowed = new Set<string>();
        selectedCats.forEach(cat => (MODALIDADES_BY_CATEGORIA[cat] || []).forEach(m => allowed.add(m)));
        if (allowed.size > 0) result = result.filter(opt => allowed.has(opt));
      }
    }

    // grupo ↔ subgrupo
    if (attrId === 'subgrupo') {
      const selectedGroups = selections['grupo'] || [];
      if (selectedGroups.length > 0) {
        const allowed = new Set<string>();
        selectedGroups.forEach(grp => (SUBGRUPOS_BY_GRUPO[grp] || []).forEach(s => allowed.add(s)));
        if (allowed.size > 0) result = result.filter(opt => allowed.has(opt));
      }
    }

    // grupo ↔ categoria (coerência de domínio)
    if (attrId === 'categoria' || attrId === 'grupo') {
      result = applyGroupCategoryCoherence(attrId, result, selections);
    }

    // mesa ↔ sala (código da mesa: 1ª letra = sala)
    if (attrId === 'mesa') {
      const selectedSalas = selections['sala'] || [];
      if (selectedSalas.length > 0) {
        const allowed = new Set(
          filterMesasBySalasOptions(MESA_OPTIONS, selectedSalas),
        );
        if (allowed.size > 0) {
          result = result.filter((opt) => allowed.has(opt));
        }
      }
    }

    return result;
  },

  // ── Metrics ───────────────────────────────────────────────
  metrics: [
    { id: 'teste',       label: 'Teste',            icon: FlaskConical },
    { id: 'venda',       label: 'Venda (ROB)',      icon: DollarSign  },
    { id: 'qtd_venda',   label: 'Qtd Vendas',       icon: ShoppingCart },
    {
      id: 'qtd_itens',
      label: 'Qtd Itens',
      icon: Package,
      tooltip:
        'Quantidade de itens vendidos (mock: entre 10% e 17% acima da Qtd de Vendas por posição).',
    },
    { id: 'sss', label: '% SSS', icon: Activity },
    { id: 'cmv',             label: 'CMV',                 icon: DollarSign  },
    { id: 'cmv_comercial',   label: 'CMV Comercial',       icon: DollarSign  },
    { id: 'lucro_bruto',     label: 'Lucro Bruto (LB)',    icon: DollarSign  },
    { id: 'margem',          label: '% Margem Bruta (MB)', icon: Percent     },
    { id: 'margem_liquida',  label: 'Margem Líquida (ML)', icon: Percent     },
    { id: 'qtd_estoque', label: 'Qtd Estoque',      icon: Package     },
    { id: 'vlr_estoque', label: 'Vlr Estoque',      icon: DollarSign  },
    { id: 'dep',         label: 'DEP',              icon: Package     },
    { id: 'def',         label: 'DEF',              icon: DollarSign  },
    {
      id: 'ppa',
      label: 'Alteração de Preço (PPA)',
      icon: BarChart3,
      tooltip:
        'Do total de alterações de preço necessárias para realizar, representa o percentual de alterações que foram feitas pela loja.',
    },
    {
      id: 'match_preco',
      label: '% Match de Preço',
      icon: Tag,
      tooltip:
        'Do total de vendas realizadas, representa o percentual de vendas feitas com desconto igualando o preço praticado no site.',
    },
    {
      id: 'match_preco_valor',
      label: 'Vlr Match de Preço',
      icon: DollarSign,
      tooltip:
        'Valor (R$) correspondente à participação de vendas com match de preço; mock entre 10% e 15% da venda (ROB) da posição.',
    },
    // Planejamento group divider
    { id: 'vlr_plano',         label: 'Vlr Plano',         icon: Target },
    { id: 'qtd_plano',         label: 'Qtd Plano',         icon: Target },
    { id: 'qtd_desvio_plano',  label: 'Qtd Desvio Plano',  icon: Target },
    { id: 'vlr_desvio_plano',  label: 'Vlr Desvio Plano',  icon: Target },
    { id: 'vlr_target',        label: 'Vlr Target',        icon: Target },
    { id: 'qtd_target',        label: 'Qtd Target',        icon: Target },
    { id: 'qtd_desvio_target', label: 'Qtd Desvio Target', icon: Target },
    { id: 'vlr_desvio_target', label: 'Vlr Desvio Target', icon: Target },
    // Exposição de produtos — nomenclatura: data/metricNaming.ts
    {
      id: 'exp_calc_clicks_tenis',
      label: 'Qtd Clicks Tênis',
      icon: MousePointerClick,
      tooltip:
        'Quantidade de clicks em posições de exposição de calçados do tipo tênis.',
    },
    {
      id: 'exp_calc_clicks_chuteiras',
      label: 'Qtd Clicks Chuteiras',
      icon: MousePointerClick,
      tooltip:
        'Quantidade de clicks em posições de exposição de calçados do tipo chuteira.',
    },
    {
      id: 'exp_vest_bracos_araras',
      label: 'Qtd Braços Exposição',
      icon: Shirt,
      tooltip:
        'Quantidade de braços de exposição para vestuário que a loja possui.',
    },
    {
      id: 'exp_vest_mesas',
      label: 'Qtd Mesas',
      icon: Table2,
      tooltip:
        'Quantidade de mesas para exposição de vestuário que a loja possui.',
    },
    {
      id: 'exp_meias_bracos',
      label: 'Qtd Braços Meias',
      icon: LayoutGrid,
      tooltip:
        'Quantidade de braços de araras para exposição de meias que a loja possui.',
    },
    {
      id: 'exp_acc_torres_relogios',
      label: 'Qtd Expositores Relógios',
      icon: Watch,
      tooltip:
        'Quantidade de expositores (mesas ou torres) de relógios que a loja possui.',
    },
    {
      id: 'exp_acc_torres_oculos',
      label: 'Qtd Expositores Óculos',
      icon: Glasses,
      tooltip:
        'Quantidade de expositores (mesas ou torres) de óculos que a loja possui.',
    },
    {
      id: 'exp_acc_cestos_bolas',
      label: 'Qtd Cestos Bolas',
      icon: ShoppingBasket,
      tooltip: 'Quantidade de cestos para expor bolas que a loja possui.',
    },
    {
      id: 'exp_checkstand_modulos',
      label: 'Qtd Módulos Checkstand',
      icon: Store,
      tooltip:
        'Quantidade de módulos de checkstand que a loja possui no ponto de venda.',
    },
    {
      id: 'exp_nut_geladeiras',
      label: 'Qtd Geladeiras',
      icon: Refrigerator,
      tooltip:
        'Quantidade de geladeiras que a loja possui para expor bebidas.',
    },
  ],

  metricDisplayOrder: [
    'teste',
    'venda', 'qtd_venda', 'qtd_itens', 'sss', 'cmv', 'cmv_comercial', 'lucro_bruto', 'margem', 'margem_liquida',
    'qtd_estoque', 'vlr_estoque', 'dep', 'def',
    'ppa', 'match_preco', 'match_preco_valor',
    'vlr_plano', 'qtd_plano', 'qtd_desvio_plano', 'vlr_desvio_plano',
    'vlr_target', 'qtd_target', 'qtd_desvio_target', 'vlr_desvio_target',
    ...EXPOSICAO_PRODUTO_METRIC_IDS,
  ],

  // ── Planning metrics group (for visual divider in UI) ────
  planningMetrics: ['vlr_plano', 'qtd_plano', 'qtd_desvio_plano', 'vlr_desvio_plano', 'vlr_target', 'qtd_target', 'qtd_desvio_target', 'vlr_desvio_target'],

  metricsSidebarPlanningGroupLabel: 'Planejamento',

  metricsSidebarExcludeFromVendaEstoque: [...EXPOSICAO_PRODUTO_METRIC_IDS],

  metricSidebarExtraSections: [
    {
      title: 'Exposição de produtos',
      sidebarGroupId: 'exposicao_produtos',
      groups: [
        {
          subtitle: 'Calçados',
          metricIds: ['exp_calc_clicks_tenis', 'exp_calc_clicks_chuteiras'],
        },
        {
          subtitle: 'Vestuário',
          metricIds: ['exp_vest_bracos_araras', 'exp_vest_mesas'],
        },
        { subtitle: 'Meias', metricIds: ['exp_meias_bracos'] },
        {
          subtitle: 'Acessórios',
          metricIds: [
            'exp_acc_torres_relogios',
            'exp_acc_torres_oculos',
            'exp_acc_cestos_bolas',
          ],
        },
        { subtitle: 'Checkstad', metricIds: ['exp_checkstand_modulos'] },
        { subtitle: 'Nutrição', metricIds: ['exp_nut_geladeiras'] },
      ],
    },
  ],

  // ── Analysis titles ───────────────────────────────────────
  analysisTitles: {
    padrao:      'Análise Geral de Venda e Estoque',
    evolucao:    'Análise Evolutiva de Venda e Estoque',
    comparativo: 'Análise Comparativa de Venda e Estoque',
    horaahora:   'Análise hora a hora de Venda e Estoque',
  },
};