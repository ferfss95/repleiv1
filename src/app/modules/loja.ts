import {
  DollarSign,
  Target,
  TrendingUp,
  BarChart3,
  Percent,
  ShoppingCart,
  Hash,
  Users,
  Building2,
  Receipt,
  Truck,
  MapPin,
  Briefcase,
  UserCircle,
  Tag,
  Package,
} from 'lucide-react';
import { REDE_UI_OPTIONS } from '../data/attributeUiConfig';
import {
  TIPO_OPTIONS_LOJA,
  ESTADOS_LIST,
  REGIONAL_OPTIONS,
  LOJAS_LIST,
  CIDADES_BY_ESTADO,
  LOJAS_BY_CIDADE,
  orderStoresByNetwork,
  filterCitiesByKnownLinks,
  filterRegionalsByKnownLinks,
  filterStatesByKnownLinks,
  filterStoresByKnownLinks,
} from '../referenceData';
import type { ModuleConfig } from './types';
import {
  PRODUTO_DOMAIN_ATTRIBUTE_DEFS,
  isProdutoDomainAttrId,
  produtoModule,
} from './produto';

// ──────────────────────────────────────────────────────────────
// LOJA module configuration
// ──────────────────────────────────────────────────────────────

// Novos atributos específicos do módulo Loja
const SETOR_OPTIONS = ['Futebol', 'Corrida', 'Treino'];

const VENDEDOR_OPTIONS = [
  'JUSSARA RIBEIRO - 105307',
  'CARLOS MENDES - 102145',
  'PATRICIA SANTOS - 108923',
  'RICARDO OLIVEIRA - 103456',
  'FERNANDA COSTA - 107892',
  'JULIANO FERREIRA - 104567',
  'MARIANA SOUZA - 109234',
  'RODRIGO ALMEIDA - 106789',
  'CLAUDIA PEREIRA - 101234',
  'BRUNO MARTINS - 108456',
  'AMANDA LIMA - 105678',
  'RAFAEL CAMPOS - 102890',
  'LUCIANA ROCHA - 107345',
  'GABRIEL SILVA - 104123',
  'RENATA CARDOSO - 109567',
  'MARCOS VIANA - 103789',
  'JULIANA BARBOSA - 106234',
  'THIAGO MOREIRA - 108901',
  'BEATRIZ GOMES - 105432',
  'ANDERSON FREITAS - 102567',
];

export const lojaModule: ModuleConfig = {
  id: 'LOJA',
  label: 'LOJA',
  domainSectionLabel: 'LOCALIZAÇÃO',

  // ── Domain attributes (todos em uma única linha) ──────────
  domainAttributes: [
    { id: 'rede',      label: 'REDE',      icon: Building2,  options: [] },
    { id: 'tipo',      label: 'TIPO',      icon: Truck,      options: [] },
    { id: 'estado',    label: 'ESTADO',    icon: MapPin,     options: [] },
    { id: 'regional',  label: 'REGIONAL',  icon: Building2,  options: [] },
    { id: 'cidade',    label: 'CIDADE',    icon: MapPin,     options: [] },
    { id: 'loja',      label: 'LOJA',      icon: Building2,  options: [] },
    { id: 'setor',     label: 'SETOR',     icon: Briefcase,  options: [] },
    { id: 'vendedor',  label: 'VENDEDOR',  icon: UserCircle, options: [] },
  ],

  domainAttributeExtraRows: [
    {
      sectionLabel: 'Produto',
      attributes: PRODUTO_DOMAIN_ATTRIBUTE_DEFS,
    },
  ],

  // ── Dynamic options per domain attribute ──────────────────
  getDomainAttributeOptions(attrId, selections) {
    switch (attrId) {
      case 'rede':      return [...REDE_UI_OPTIONS];
      case 'tipo':      return TIPO_OPTIONS_LOJA;
      case 'estado':
        return filterStatesByKnownLinks(ESTADOS_LIST, selections);
      case 'regional':
        return filterRegionalsByKnownLinks(REGIONAL_OPTIONS, selections);
      case 'cidade': {
        // Se há estados selecionados, filtrar cidades
        const selectedEstados = selections['estado'] || [];
        if (selectedEstados.length === 0) {
          const allCidades = new Set<string>();
          Object.values(CIDADES_BY_ESTADO).flat().forEach((c: string) => allCidades.add(c));
          return filterCitiesByKnownLinks(Array.from(allCidades).sort(), selections);
        }
        const cidades = selectedEstados.flatMap(est => CIDADES_BY_ESTADO[est] || []);
        return filterCitiesByKnownLinks(Array.from(new Set(cidades)).sort(), selections);
      }
      case 'loja': {
        const selectedCidades = selections['cidade'] || [];
        const baseLojas =
          selectedCidades.length === 0
            ? orderStoresByNetwork(LOJAS_LIST)
            : orderStoresByNetwork(
                selectedCidades.flatMap((cid) => LOJAS_BY_CIDADE[cid] || []),
              );
        return filterStoresByKnownLinks(baseLojas, selections);
      }
      case 'setor':     return SETOR_OPTIONS;
      case 'vendedor':  return VENDEDOR_OPTIONS;
      default:
        if (isProdutoDomainAttrId(attrId)) {
          return produtoModule.getDomainAttributeOptions(attrId, selections);
        }
        return [];
    }
  },

  // ── Cross-attribute filter (opcional) ─────────────────────
  getFilteredGroupOptions(attrId, options, selections, exclusions) {
    let result = options;

    // estado ↔ cidade
    if (attrId === 'cidade') {
      const selectedEstados = selections['estado'] || [];
      if (selectedEstados.length > 0) {
        const allowed = new Set<string>();
        selectedEstados.forEach(est => {
          const cidades = CIDADES_BY_ESTADO[est] || [];
          cidades.forEach((c: string) => allowed.add(c));
        });
        if (allowed.size > 0) result = result.filter(opt => allowed.has(opt));
      }
    }

    // cidade ↔ loja
    if (attrId === 'loja') {
      const selectedCidades = selections['cidade'] || [];
      if (selectedCidades.length > 0) {
        const allowed = new Set<string>();
        selectedCidades.forEach(cid => {
          const lojas = LOJAS_BY_CIDADE[cid] || [];
          lojas.forEach((l: string) => allowed.add(l));
        });
        if (allowed.size > 0) result = result.filter(opt => allowed.has(opt));
      }
    }

    if (
      isProdutoDomainAttrId(attrId) &&
      produtoModule.getFilteredGroupOptions
    ) {
      result = produtoModule.getFilteredGroupOptions(
        attrId,
        result,
        selections,
        exclusions,
      );
    }

    return result;
  },

  // ── Metrics (na ordem especificada) ───────────────────────
  metrics: [
    { id: 'rob',           label: 'Venda (ROB)',        icon: DollarSign   },
    {
      id: 'qtd_itens_loja',
      label: 'Qtd Itens',
      icon: Package,
      tooltip:
        'Quantidade de itens vendidos (mock: entre 10% e 17% acima da Qtd de Vendas por posição).',
    },
    {
      id: 'qtd_vendas_loja',
      label: 'Qtd Vendas',
      icon: Hash,
      tooltip:
        'Quantidade de vendas realizadas (proxy baseado em ROB dividido pelo Ticket Médio).',
    },
    { id: 'sss', label: '% SSS', icon: BarChart3 },
    { id: 'margem_bruta',  label: '% Margem Bruta (MB)', icon: Percent      },
    { id: 'valor_meta',    label: 'Vlr Meta',            icon: Target       },
    {
      id: 'vlr_projecao_venda',
      label: 'Vlr Projeção Venda (mês vigente)',
      icon: DollarSign,
      tooltip:
        'Sempre no mês corrente (em aberto): vendas realizadas do dia 1 até hoje, mais projeção linear do restante do mês. Não usa o intervalo de datas selecionado na tela.',
    },
    {
      id: 'pct_projecao_venda',
      label: '% Projeção de Venda',
      icon: Percent,
      tooltip:
        'Quanto a loja projeta atingir da meta mensal do mês vigente (100% = bater a meta; acima de 100% = superar). Exibe "—" se a meta mensal for zerada ou inválida.',
    },
    { id: 'desvio_meta_r', label: 'Vlr Desvio Meta',    icon: TrendingUp   },
    { id: 'desvio_meta_p', label: '% Desvio Meta',      icon: TrendingUp   },
    { id: 'conversao',     label: 'Conversão',          icon: Percent      },
    {
      id: 'conversao_vendex',
      label: 'Conversão Vendex',
      icon: Percent,
      tooltip: 'Indicador simulado entre 35% e 49% (duas casas decimais na exibição).',
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
        'Valor (R$) de vendas com match de preço; mock entre 10% e 15% do ROB da posição.',
    },
  ],

  metricDisplayOrder: [
    'rob',
    'qtd_itens_loja',
    'qtd_vendas_loja',
    'sss',
    'margem_bruta',
    'valor_meta',
    'vlr_projecao_venda',
    'pct_projecao_venda',
    'desvio_meta_r',
    'desvio_meta_p',
    'conversao',
    'conversao_vendex',
    'match_preco',
    'match_preco_valor',
  ],

  /**
   * Escala da meta na folha `loja` (1 = meta cheia).
   * Para `setor` e `vendedor`, a escala é `1 / quantidade de opções no agrupamento`
   * (calculada em AnalysisView — ex.: meta do vendedor = meta da loja ÷ vendedores ativos na lista).
   */
  metaMensalScaleByAttr: {
    loja: 1,
  } as const,

  // ── Analysis titles ───────────────────────────────────────
  analysisTitles: {
    padrao:      'Análise Geral de Performance de Lojas',
    evolucao:    'Análise Evolutiva de Performance de Lojas',
    comparativo: 'Análise Comparativa de Performance de Lojas',
    horaahora:   'Análise hora a hora de Lojas',
  },
};