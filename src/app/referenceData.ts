import { hashString } from "./utils/calculations";

export const REDE_OPTIONS = [
  "Centauro",
  "Fisia"
];

export const CANAL_OPTIONS = [
  "Loja F\u00edsica Centauro",
  "Digital Centauro",
  "NVS",
  "NDIS",
  "Digital Nike"
];

/** Modal Canal — seleção rápida “Todos Centauro” (mesmos textos que `CANAL_OPTIONS`). */
export const CANAL_GROUP_CENTAURO_IDS: readonly string[] = [
  "Loja F\u00edsica Centauro",
  "Digital Centauro",
];

/** Modal Canal — seleção rápida “Todos Nike”. */
export const CANAL_GROUP_NIKE_IDS: readonly string[] = ["NVS", "NDIS", "Digital Nike"];

/** Modal Loja (PRODUTO): grupo "CD / CDS". */
export const LOJA_GROUP_CD_IDS: readonly string[] = [
  "CD Jarinu - SP",
  "CD Extrema - MG",
  "CDS Lapa - SP",
  "CDS João Pessoa - PB",
];

export const FATURAMENTO_OPTIONS = [
  "Loja Física",
  "Digital"
];

export const ENTRADA_OPTIONS = [
  "Socialcomm",
  "CRM",
  "Facebook",
  "Instagram",
  "Marketplaceout",
  "Loja Física"
];

export const COMPRA_OPTIONS = [
  "App",
  "Site",
  "Encomenda Expressa",
  "Loja Fisica",
  "Mktplaceout"
];

export const MD_ENTREGA_OPTIONS = [
  "OMS Pickup",
  "OMS SFS",
  "Click & Retire",
  "Click & Retire 3P",
  "Loja Física Normal",
  "CD Normal",
  "MktPlace 3P",
  "Centauro envios"
];

export const REGIONAL_OPTIONS = [
  "Esquadr\u00e3o 40 graus",
  "Esquadr\u00e3o Valente",
  "Flechas do Norte",
  "Furac\u00e3o Sul I",
  "F\u00faria do Interior",
  "Gigante Paulista",
  "Guadi\u00f5es da Fronteira",
  "Guerreiros do Canga\u00e7o",
  "Legi\u00e3o Mineira",
  "Lobos SP",
  "SULcesso",
  "Tit\u00e3s SP-MG",
  "Ultra High",
  "\u00c1guias de Elite",
  "\u00c1guias do Cerrado"
];

/** Centros CD (apenas CD, sem CDS) — usado no cluster de localização */
export const LOCALIZACAO_CD_OPTIONS = [
  "CD Jarinu - SP",
  "CD Extrema - MG",
];

/** Centros CDS — usado no cluster de localização */
export const LOCALIZACAO_CDS_OPTIONS = [
  "CDS Lapa - SP",
  "CDS João Pessoa - PB",
];

export const STATUS_OPTIONS = [
  "em Loja",
  "em Trânsito",
  "Em separação",
  "Separado",
];

/** Lista plana (valores persistidos em seleção / exclusão) — sem prefixo "STATUS:" */
export const LOCALIZACAO_OPTIONS = [
  ...STATUS_OPTIONS,
  ...LOCALIZACAO_CD_OPTIONS,
  ...LOCALIZACAO_CDS_OPTIONS,
];

/** Grupos apenas visuais no dropdown de LOCALIZAÇÃO (STATUS / CD / CDS) */
export interface LocalizacaoOptionGroup {
  id: "status" | "cd" | "cds";
  label: string;
  options: readonly string[];
}

export const LOCALIZACAO_OPTION_GROUPS: LocalizacaoOptionGroup[] = [
  { id: "status", label: "STATUS", options: STATUS_OPTIONS },
  { id: "cd", label: "CD", options: LOCALIZACAO_CD_OPTIONS },
  { id: "cds", label: "CDS", options: LOCALIZACAO_CDS_OPTIONS },
];

export const VENDEDOR_OPTIONS = [
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

export const ORIGEM_OPTIONS = [
  "Nacional",
  "Importado",
];

/**
 * Opções do atributo TIPO nos modais — mesma lista para PRODUTO (via `TIPO_OPTIONS`),
 * LOJA (`TIPO_OPTIONS_LOJA`) e INDICADORES (`TIPO_OPTIONS_INDICADORES`).
 */
const TIPO_OPTIONS_SOURCE: readonly string[] = [
  "Compra em loja",
  "OMS",
  "Encomenda Expressa 1P",
  "Encomenda Expressa 3P",
  "Click e Retire",
  "Pickup",
];

export const TIPO_OPTIONS: string[] = [...TIPO_OPTIONS_SOURCE];
export const TIPO_OPTIONS_LOJA: string[] = [...TIPO_OPTIONS_SOURCE];
export const TIPO_OPTIONS_INDICADORES: string[] = [...TIPO_OPTIONS_SOURCE];

export const LOJAS_LIST = [
  "2029 - Shopping Vit\u00f3ria",
  "2030 - Litoral Plaza",
  "2032 - Catarina Fashion Outlet",
  "2033 - Outlet Premium Fortaleza",
  "2034 - Outlet Premium Rio De Janeiro",
  "2035 - Shopping Barra Salvador",
  "2036 - Shopping Aricanduva",
  "2050 - Shopping Vale Sul",
  "2050 - Vale Sul Shopping",
  "2052 - Ananindeua",
  "2054 - Shopping Da Ilha",
  "2055 - Shopping Metr\u00f4 Itaquera",
  "2056 - Passeio Das \u00c1guas",
  "2057 - City Center Outlet",
  "2058 - Ibirapuera",
  "2070 - I Fashion Outlet Santa Catarina",
  "2071 - Iguatemi Fortaleza",
  "2072 - Nike Curitiba",
  "2075 - Araguaia Shopping",
  "2076 - Boulevard Shopping Vila Velha",
  "2077 - Outlet Premium Salvador",
  "2078 - Iguatemi Porto Alegre",
  "2079 - Mangabeira",
  "2083 - Bh Outlet",
  "2084 - Place Outlet - Extra Anchieta",
  "2085 - Outlet Premium Grande S\u00e3o Paulo",
  "2086 - Shopping Nova Am\u00e9rica",
  "2087 - S\u00e3o Gon\u00e7alo Shopping",
  "2088 - Carrefour Osasco",
  "2089 - Sp Market",
  "2090 - S\u00f3 Marcas Outlet Guarulhos",
  "2091 - Outlet Premium Itupeva",
  "2092 - S\u00f3 Marcas Outlet Contagem",
  "2093 - Shopping Flamboyant",
  "2094 - Shopping Center Norte",
  "2095 - Shopping Light",
  "2097 - Nike Santo Andr\u00e9",
  "2098 - Outlet Premium Bras\u00edlia",
  "2099 - I Fashion Outlet Novo Hamburgo",
  "2100 - Shopping Barra Sul",
  "2101 - Barra Rio",
  "2102 - Shopping Uni\u00e3o Osasco",
  "2104 - Iguatemi SP",
  "2105 - Outlet Premium Imigrantes",
  "2106 - Balne\u00e1rio Shopping",
  "2107 - Continente Shopping",
  "2108 - Shopping Rio Sul",
  "2109 - Outlet Santa Maria",
  "2110 - Praia de Belas",
  "2111 - Shopping Iguatemi Campinas",
  "2112 - Park Shopping Barigui",
  "CE100 - TACARUNA",
  "CE101 - SUZANO",
  "CE102 - DIADEMA",
  "CE103 - IGUATEMI CAXIAS",
  "CE105 - PARALELA",
  "CE106 - BOULEVARD BRAS\u00cdLIA",
  "CE107 - BOURBON PORTO ALEGRE",
  "CE108 - GUARARAPES",
  "CE109 - TAGUATINGA SHOPPING",
  "CE1101 - ARARAS",
  "CE112 - BOULEVARD BEL\u00c9M",
  "CE114 - ILHA PLAZA RJ",
  "CE115 - PRUDENTE SHOPPING",
  "CE116 - BEIRAMAR FLORIAN\u00d3POLIS",
  "CE117 - AN\u00c1LIA FRANCO",
  "CE118 - OUTLET EXTREMA",
  "CE119 - MUELLER CURITIBA",
  "CE120 - BOURBON NOVO HAMBURGO",
  "CE121 - BONSUCESSO GUARULHOS",
  "CE122 - MAR\u00cdLIA",
  "CE123 - VIA SHOPPING BARREIRO",
  "CE124 - RIO MAR ARACAJ\u00da",
  "CE125 - BAURU SHOPPING",
  "CE128 - BOTAFOGO",
  "CE129 - CENTER SHOPPING UBERL\u00c2NDIA",
  "CE130 - JOINVILLE GARTEN",
  "CE131 - BOULEVARD BH",
  "CE133 - GRANJA VIANNA",
  "CE135 - RIO CLARO",
  "CE138 - RIO ANIL S\u00c3O LU\u00cdS",
  "CE139 - CAPIM DOURADO PALMAS",
  "CE141 - TABO\u00c3O DA SERRA",
  "CE142 - FRANCA",
  "CE143 - S\u00c3O GON\u00c7ALO SHOPPING",
  "CE144 - PENHA SP",
  "CE145 - CATUA\u00cd MARING\u00c1",
  "CE146 - NORTE SUL PLAZA",
  "CE147 - HIGIEN\u00d3POLIS",
  "CE149 - WEST SHOPPING RIO",
  "CE150 - SALVADOR NORTE",
  "CE151 - MINAS SHOPPING",
  "CE152 - SETE LAGOAS",
  "CE153 - S\u00c3O GON\u00c7ALO PARTAGE",
  "CE156 - ITAPETININGA",
  "CE157 - INDAIATUBA POLO",
  "CE158 - BLUMENAU NORTE SHOPPING",
  "CE159 - P\u00c1TIO RESENDE",
  "CE161 - UBERL\u00c2NDIA SHOPPING",
  "CE162 - SHOPPING DA ILHA",
  "CE164 - PARQUE BARUERI",
  "CE165 - PARK SHOPPING S\u00c3O CAETANO",
  "CE167 - GOLDEN SQUARE",
  "CE168 - PO\u00c7OS DE CALDAS",
  "CE169 - CAMPOS DOS GOYTACAZES",
  "CE170 - P\u00c1TIO LIMEIRA",
  "CE171 - IT\u00da PLAZA",
  "CE173 - ITABUNA",
  "CE174 - CAMPO GRANDE SHOPPING",
  "CE175 - FEIRA DE SANTANA",
  "CE176 - PLAZA NITER\u00d3I",
  "CE177 - MACA\u00c9",
  "CE179 - PATIO CHAPEC\u00d3",
  "CE180 - MOOCA PLAZA",
  "CE181 - MONTES CLAROS",
  "CE182 - VALPARAISO SHOPPING SUL",
  "CE183 - RIO BRANCO",
  "CE184 - PALLADIUM PONTA GROSSA",
  "CE185 - MANAUARA",
  "CE186 - JO\u00c3O PESSOA MANAIRA",
  "CE187 - INTERNACIONAL GUARULHOS",
  "CE188 - CARAGUATATUBA",
  "CE190 - PARK SHOPPING BEL\u00c9M",
  "CE192 - BELA VISTA SALVADOR",
  "CE193 - IMPERATRIZ",
  "CE194 - PARQUE DAS BANDEIRAS",
  "CE195 - JUNDIA\u00cd SHOPPING",
  "CE196 - SANTO ANDR\u00c9 GRAN PLAZA",
  "CE197 - P\u00c1TIO BATEL",
  "CE198 - RIOMAR RECIFE",
  "CE199 - JUAZEIRO DO NORTE",
  "CE20 - RIO SUL",
  "CE200 - ESTA\u00c7\u00c3O BH",
  "CE202 - CONTINENTE PARK SC",
  "CE203 - BOULEVARD LONDRINA",
  "CE205 - MARAB\u00c1",
  "CE206 - CAMPO GRANDE RIO",
  "CE207 - MOGI SHOPPING",
  "CE208 - S\u00c3O BERNARDO PLAZA",
  "CE209 - AMAZONAS SHOPPING",
  "CE217 - BETIM",
  "CE218 - CIDADE SOROCABA",
  "CE219 - PELOTAS SHOPPING",
  "CE220 - TIET\u00ca PLAZA",
  "CE221 - PARANGABA",
  "CE222 - NATAL SHOPPING",
  "CE223 - ARAPIRACA GARDEN",
  "CE224 - METROPOLITANO BARRA",
  "CE225 - PARQUE SHOPPING MACEI\u00d3",
  "CE226 - RIOMAR FORTALEZA",
  "CE227 - JO\u00c3O PESSOA MANGABEIRA",
  "CE229 - CAMPINAS SHOPPING",
  "CE23 - BRASILIA SHOPPING",
  "CE230 - ANANINDEUA",
  "CE234 - PANTANAL CUIAB\u00c1",
  "CE235 - RIOMAR KENNEDY",
  "CE236 - PARK SHOPPING CANOAS",
  "CE237 - ESTA\u00c7\u00c3O CUIAB\u00c1",
  "CE238 - IGUATEMI PORTO ALEGRE",
  "CE239 - NOVA IGUA\u00c7U",
  "CE240 - BARRA SUL",
  "CE241 - BARRA SHOPPING 241",
  "CE242 - JOCKEY PLAZA",
  "CE243 - TIJUCA",
  "CE245 - J\u00d3QUEI FORTALEZA",
  "CE246 - CARIOCA SHOPPING",
  "CE247 - AM\u00c9RICAS RIO",
  "CE248 - P\u00c1TIO BEL\u00c9M",
  "CE249 - CAMPINA GRANDE",
  "CE25 - PARK SHOPPING BRASILIA",
  "CE250 - BOSQUE GR\u00c3O-PAR\u00c1",
  "CE251 - BOSQUE DOS IP\u00caS",
  "CE252 - PARQUE MAIA GUARULHOS",
  "CE253 - PARQUE SHOPPING BAHIA",
  "CE254 - BOULEVARD BAURU",
  "CE255 - PAULISTA",
  "CE256 - VIT\u00d3RIA DA CONQUISTA",
  "CE258 - IBIRAPUERA",
  "CE259 - CRICI\u00daMA",
  "CE260 - PARTAGE RIO GRANDE",
  "CE262 - ITAGUA\u00c7U SC",
  "CE263 - CAMARAGIBE",
  "CE264 - P\u00c1TIO RORAIMA",
  "CE266 - PASSEIO DAS \u00c1GUAS GOI\u00c2NIA",
  "CE267 - TERESINA RIO POTY",
  "CE269 - IGUATEMI RIO PRETO",
  "CE270 - IGUATEMI CAMPINAS",
  "CE272 - SANTA B\u00c1RBARA D'OESTE",
  "CE273 - FLAMBOYANT SHOPPING",
  "CE274 - DEL REY",
  "CE275 - PATIO CIAN\u00ca",
  "CE276 - TRIMAIS",
  "CE277 - MARING\u00c1 PARK",
  "CE278 - CANTAREIRA",
  "CE279 - IGUATEMI PRAIA DE BELAS",
  "CE280 - IGUATEMI BRASILIA",
  "CE281 - IGUATEMI RIBEIR\u00c3O PRETO",
  "CE283 - PALLADIUM UMUARAMA",
  "CE284 - PATTEO OLINDA",
  "CE285 - POUSO ALEGRE",
  "CE286 - PASSO FUNDO",
  "CE287 - JK IGUATEMI",
  "CE288 - IGUATEMI S\u00c3O PAULO",
  "CE291 - SINOP SHOPPING",
  "CE292 - ARA\u00c7ATUBA PRA\u00c7A NOVA",
  "CE294 - PORTO VELHO",
  "CE295 - METR\u00d4 TUCURUVI",
  "CE296 - CONJUNTO NACIONAL",
  "CE297 - INTERLAGOS",
  "CE298 - VIT\u00d3RIA",
  "CE299 - ITAQUERA",
  "CE300 - CURITIBA SHOPPING",
  "CE301 - PATO BRANCO",
  "CE303 - P\u00c1TIO MACEI\u00d3",
  "CE304 - NOVA AM\u00c9RICA",
  "CE305 - MADUREIRA SHOPPING",
  "CE306 - SANTO ANDR\u00c9 ABC",
  "CE307 - IGUATEMI ALPHAVILLE",
  "CE308 - MUELLER JOINVILLE",
  "CE310 - VALE SUL",
  "CE311 - PLAZA SUL",
  "CE312 - RIO PRETO SHOPPING",
  "CE313 - CIDADE BH",
  "CE314 - MAXI JUNDIA\u00cd",
  "CE315 - CARUARU SHOPPING",
  "CE316 - CATUA\u00cd CASCAVEL",
  "CE32 - BARRA SHOPPING 32",
  "CE34 - MORUMBI",
  "CE35 - CENTER NORTE",
  "CE37 - P\u00c1TIO BRASIL BRAS\u00cdLIA",
  "CE38 - BARRA SALVADOR",
  "CE39 - DOM PEDRO",
  "CE41 - METR\u00d4 TATUAP\u00c9",
  "CE43 - BH SHOPPING",
  "CE44 - SP MARKET",
  "CE45 - RIBEIR\u00c3O SHOPPING",
  "CE46 - ELDORADO",
  "CE47 - IGUATEMI FORTALEZA",
  "CE48 - ARICANDUVA",
  "CE50 - BARIGUI",
  "CE52 - TAMBOR\u00c9",
  "CE53 - SHOPPING RECIFE",
  "CE54 - ESTA\u00c7\u00c3O CURITIBA",
  "CE55 - P\u00c1TIO SAVASSI",
  "CE56 - MIDWAY NATAL",
  "CE57 - JARDIM SUL",
  "CE59 - OSASCO SUPER SHOPPING",
  "CE60 - SHOPPING DA BAHIA",
  "CE62 - METR\u00d4 SANTA CRUZ",
  "CE63 - JARDINS ARACAJ\u00da",
  "CE64 - FLORIPA",
  "CE66 - LEBLON",
  "CE67 - SALVADOR SHOPPING",
  "CE68 - MAU\u00c1",
  "CE69 - BALNE\u00c1RIO CAMBORI\u00da",
  "CE70 - PIRACICABA",
  "CE71 - BOURBON SP",
  "CE72 - CASA FORTE",
  "CE73 - ITA\u00da POWER",
  "CE75 - SANTANA PARK",
  "CE76 - BANG\u00da",
  "CE77 - LITORAL PLAZA",
  "CE80 - CENTRAL PLAZA",
  "CE81 - NOVO SHOPPING RIBEIR\u00c3O",
  "CE82 - JUIZ DE FORA INDEPEND\u00caNCIA",
  "CE84 - PALLADIUM CURITIBA",
  "CE85 - CENTER VALE",
  "CE86 - NORTE SHOPPING RIO",
  "CE87 - BOURBON S\u00c3O LEOPOLDO",
  "CE88 - BOUGAINVILLE GOI\u00c2NIA",
  "CE89 - BLUMENAU NEUMARKT",
  "CE90 - S\u00c3O JOS\u00c9 DOS PINHAIS",
  "CE91 - CATUA\u00cd LONDRINA",
  "CE92 - AN\u00c1POLIS BRASIL PARK",
  "CE94 - APARECIDA DE GOIANIA",
  "CE95 - GRANDE RIO",
  "CE96 - NORTH SHOPPING FORTALEZA",
  "CE97 - VIA SUL FORTALEZA",
  "CE98 - UNI\u00c3O OSASCO",
  "CE99 - GOI\u00c2NIA SHOPPING"
];

const isCentauroStore = (store: string) => store.trim().toUpperCase().startsWith("CE");

/**
 * Mantém ordem de exibição por rede: Centauro primeiro, depois Fisia.
 * Dentro de cada grupo, preserva a ordem de entrada da fonte.
 */
export const orderStoresByNetwork = (stores: string[]): string[] => {
  const uniqueStores = Array.from(new Set(stores));
  const centauroStores = uniqueStores.filter(isCentauroStore);
  const fisiaStores = uniqueStores.filter((store) => !isCentauroStore(store));
  return [...centauroStores, ...fisiaStores];
};

export const ORDERED_LOJAS_LIST = orderStoresByNetwork(LOJAS_LIST);

const getStoreCode = (store: string) => store.split(" - ")[0].trim().toUpperCase();
const normalizeChannelOption = (channelOption: string) =>
  channelOption
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

/**
 * Relação Regional -> códigos de loja extraída da planilha de cadastro.
 * Usada para garantir que seleção/agrupamento respeitem o vínculo real.
 */
const REGIONAL_TO_STORE_CODES: Record<string, string[]> = {
  "Esquadrão 40 graus": ["CE20", "CE32", "CE66", "CE76", "CE128", "CE149", "CE169", "CE177", "CE206", "CE224", "CE241", "CE243", "CE247"],
  "Esquadrão Valente": ["CE38", "CE47", "CE60", "CE67", "CE96", "CE97", "CE105", "CE150", "CE173", "CE175", "CE192", "CE199", "CE221", "CE226", "CE235", "CE245", "CE253", "CE256"],
  "Flechas do Norte": ["CE112", "CE138", "CE162", "CE183", "CE185", "CE190", "CE193", "CE205", "CE209", "CE230", "CE248", "CE250", "CE264", "CE294"],
  "Furacão Sul I": ["CE50", "CE54", "CE69", "CE84", "CE89", "CE90", "CE119", "CE130", "CE158", "CE184", "CE242", "CE283", "CE300", "CE301", "CE308", "CE316"],
  "Fúria do Interior": ["CE39", "CE70", "CE135", "CE156", "CE157", "CE170", "CE171", "CE194", "CE195", "CE218", "CE229", "CE270", "CE272", "CE275", "CE314", "CE1101"],
  "Gigante Paulista": ["CE35", "CE52", "CE59", "CE71", "CE75", "CE98", "CE121", "CE133", "CE164", "CE187", "CE220", "CE252", "CE276", "CE278", "CE295", "CE307"],
  "Guadiões da Fronteira": ["CE45", "CE81", "CE91", "CE115", "CE122", "CE125", "CE142", "CE145", "CE146", "CE174", "CE203", "CE251", "CE254", "CE269", "CE277", "CE281", "CE292", "CE312"],
  "Guerreiros do Cangaço": ["CE53", "CE56", "CE63", "CE72", "CE100", "CE108", "CE124", "CE178", "CE186", "CE198", "CE222", "CE223", "CE225", "CE227", "CE249", "CE263", "CE267", "CE284", "CE303", "CE315"],
  "Legião Mineira": ["CE43", "CE55", "CE73", "CE123", "CE129", "CE131", "CE151", "CE152", "CE161", "CE181", "CE200", "CE217", "CE274", "CE313"],
  "Lobos SP": ["CE44", "CE46", "CE57", "CE62", "CE77", "CE80", "CE102", "CE141", "CE165", "CE167", "CE196", "CE208", "CE255", "CE258", "CE297", "CE306", "CE311"],
  SULcesso: ["CE64", "CE87", "CE103", "CE107", "CE116", "CE120", "CE179", "CE202", "CE219", "CE236", "CE238", "CE240", "CE259", "CE260", "CE262", "CE279", "CE286"],
  "Titãs SP-MG": ["CE41", "CE48", "CE68", "CE85", "CE101", "CE117", "CE118", "CE144", "CE168", "CE180", "CE188", "CE207", "CE285", "CE299", "CE310"],
  "Ultra High": ["CE34", "CE147", "CE197", "CE287", "CE288"],
  "Águias de Elite": ["CE82", "CE86", "CE95", "CE114", "CE143", "CE153", "CE159", "CE176", "CE239", "CE246", "CE298", "CE304", "CE305"],
  "Águias do Cerrado": ["CE23", "CE25", "CE37", "CE88", "CE92", "CE94", "CE99", "CE106", "CE109", "CE139", "CE182", "CE234", "CE237", "CE266", "CE273", "CE280", "CE291", "CE296"],
  D1: ["2086", "2087", "2088", "2032", "2033", "2034", "2070", "2071", "2102", "2101", "2107", "2104", "2108", "2106", "2050"],
  D2: ["2098", "2075", "2077", "2090", "2085", "2056", "2054", "2093", "2050", "2089", "2035", "2111"],
  D3: ["2091", "2095", "2099", "2072", "2055", "2058", "2036", "2078", "2079", "2057", "2100", "2110", "2112"],
  D4: ["2084", "2092", "2097", "2076", "2029", "2030", "2052", "2094", "2083", "2105", "2109"],
};

export const LOJAS_BY_REGIONAL: Record<string, string[]> = REGIONAL_OPTIONS.reduce(
  (acc, regional) => {
    const allowedCodes = new Set(REGIONAL_TO_STORE_CODES[regional] || []);
    acc[regional] = ORDERED_LOJAS_LIST.filter((store) =>
      allowedCodes.has(getStoreCode(store)),
    );
    return acc;
  },
  {} as Record<string, string[]>,
);

// ─── Nacional (relação extraída de `Base de Lojas Centauro 2026.xlsx`, coluna Nacional) ──
export const NAC_OPTIONS = ['NAC 1', 'NAC 2', 'NAC 3'];

/**
 * Nacional → códigos de loja, conforme planilha oficial de cadastro.
 * Cobre apenas lojas Centauro (CE*) — Fisia não consta na planilha de origem.
 */
const NACIONAL_TO_STORE_CODES: Record<string, string[]> = {
  "NAC 1": ["CE99", "CE97", "CE96", "CE95", "CE94", "CE92", "CE88", "CE87", "CE86", "CE85", "CE82", "CE80", "CE77", "CE76", "CE68", "CE64", "CE62", "CE57", "CE56", "CE48", "CE47", "CE46", "CE44", "CE41", "CE37", "CE32", "CE311", "CE310", "CE306", "CE305", "CE304", "CE299", "CE298", "CE297", "CE296", "CE294", "CE291", "CE286", "CE285", "CE280", "CE279", "CE273", "CE266", "CE264", "CE262", "CE260", "CE259", "CE258", "CE255", "CE250", "CE25", "CE248", "CE247", "CE246", "CE245", "CE243", "CE241", "CE240", "CE239", "CE238", "CE237", "CE236", "CE235", "CE234", "CE230", "CE23", "CE226", "CE224", "CE222", "CE221", "CE219", "CE209", "CE208", "CE207", "CE206", "CE205", "CE202", "CE199", "CE196", "CE193", "CE190", "CE188", "CE185", "CE183", "CE182", "CE180", "CE179", "CE177", "CE169", "CE168", "CE167", "CE165", "CE162", "CE159", "CE149", "CE144", "CE141", "CE139", "CE138", "CE120", "CE118", "CE117", "CE116", "CE114", "CE112", "CE109", "CE107", "CE106", "CE103", "CE102", "CE101"],
  "NAC 2": ["CE98", "CE91", "CE90", "CE89", "CE84", "CE81", "CE75", "CE73", "CE72", "CE71", "CE70", "CE69", "CE67", "CE66", "CE63", "CE60", "CE59", "CE55", "CE54", "CE53", "CE52", "CE50", "CE45", "CE43", "CE39", "CE38", "CE35", "CE316", "CE315", "CE314", "CE313", "CE312", "CE308", "CE307", "CE303", "CE301", "CE300", "CE295", "CE292", "CE284", "CE283", "CE281", "CE278", "CE277", "CE276", "CE275", "CE274", "CE272", "CE270", "CE269", "CE267", "CE263", "CE256", "CE254", "CE253", "CE252", "CE249", "CE242", "CE229", "CE227", "CE225", "CE223", "CE220", "CE218", "CE217", "CE203", "CE200", "CE20", "CE198", "CE195", "CE194", "CE192", "CE187", "CE186", "CE184", "CE181", "CE178", "CE176", "CE175", "CE174", "CE173", "CE171", "CE170", "CE164", "CE161", "CE158", "CE157", "CE156", "CE153", "CE152", "CE151", "CE150", "CE146", "CE145", "CE143", "CE142", "CE135", "CE133", "CE131", "CE130", "CE129", "CE128", "CE125", "CE124", "CE123", "CE122", "CE121", "CE119", "CE115", "CE1101", "CE108", "CE105", "CE100"],
  "NAC 3": ["CE34", "CE288", "CE287", "CE197", "CE147"],
};

export const LOJAS_BY_NACIONAL: Record<string, string[]> = NAC_OPTIONS.reduce(
  (acc, nac) => {
    const allowedCodes = new Set(NACIONAL_TO_STORE_CODES[nac] || []);
    acc[nac] = ORDERED_LOJAS_LIST.filter((store) =>
      allowedCodes.has(getStoreCode(store)),
    );
    return acc;
  },
  {} as Record<string, string[]>,
);

const CHANNEL_TO_STORE_CODES: Record<string, string[]> = {
  "Loja Física Centauro": ["CE20", "CE23", "CE25", "CE32", "CE34", "CE35", "CE37", "CE38", "CE39", "CE41", "CE43", "CE44", "CE45", "CE46", "CE47", "CE48", "CE50", "CE52", "CE53", "CE54", "CE55", "CE56", "CE57", "CE59", "CE60", "CE62", "CE63", "CE64", "CE66", "CE67", "CE68", "CE69", "CE70", "CE71", "CE72", "CE73", "CE75", "CE76", "CE77", "CE80", "CE81", "CE82", "CE84", "CE85", "CE86", "CE87", "CE88", "CE89", "CE90", "CE91", "CE92", "CE94", "CE95", "CE96", "CE97", "CE98", "CE99", "CE100", "CE101", "CE102", "CE103", "CE105", "CE106", "CE107", "CE108", "CE109", "CE112", "CE114", "CE115", "CE116", "CE117", "CE118", "CE119", "CE120", "CE121", "CE122", "CE123", "CE124", "CE125", "CE128", "CE129", "CE130", "CE131", "CE133", "CE135", "CE138", "CE139", "CE141", "CE142", "CE143", "CE144", "CE145", "CE146", "CE147", "CE149", "CE150", "CE151", "CE152", "CE153", "CE156", "CE157", "CE158", "CE159", "CE161", "CE162", "CE164", "CE165", "CE167", "CE168", "CE169", "CE170", "CE171", "CE173", "CE174", "CE175", "CE176", "CE177", "CE178", "CE179", "CE180", "CE181", "CE182", "CE183", "CE184", "CE185", "CE186", "CE187", "CE188", "CE190", "CE192", "CE193", "CE194", "CE195", "CE196", "CE197", "CE198", "CE199", "CE200", "CE202", "CE203", "CE205", "CE206", "CE207", "CE208", "CE209", "CE217", "CE218", "CE219", "CE220", "CE221", "CE222", "CE223", "CE224", "CE225", "CE226", "CE227", "CE229", "CE230", "CE234", "CE235", "CE236", "CE237", "CE238", "CE239", "CE240", "CE241", "CE242", "CE243", "CE245", "CE246", "CE247", "CE248", "CE249", "CE250", "CE251", "CE252", "CE253", "CE254", "CE255", "CE256", "CE258", "CE259", "CE260", "CE262", "CE263", "CE264", "CE266", "CE267", "CE269", "CE270", "CE272", "CE273", "CE274", "CE275", "CE276", "CE277", "CE278", "CE279", "CE280", "CE281", "CE283", "CE284", "CE285", "CE286", "CE287", "CE288", "CE291", "CE292", "CE294", "CE295", "CE296", "CE297", "CE298", "CE299", "CE300", "CE301", "CE303", "CE304", "CE305", "CE306", "CE307", "CE308", "CE310", "CE311", "CE312", "CE313", "CE314", "CE315", "CE316", "CE1101"],
  NVS: ["2084", "2086", "2087", "2088", "2091", "2092", "2095", "2099", "2098", "2097", "2072", "2075", "2077", "2076", "2032", "2033", "2034", "2055", "2090", "2085", "2070", "2036", "2056", "2079", "2054", "2057", "2050", "2089", "2030", "2052", "2100", "2094", "2035", "2102", "2083", "2107", "2105", "2109"],
  NDIS: ["2058", "2071", "2029", "2078", "2093", "2101", "2110", "2104", "2108", "2111", "2106", "2112"],
};

// Data for Estados/Cidades filtering
export const ESTADOS_LIST = [
  "Acre",
  "Alagoas",
  "Amazonas",
  "Bahia",
  "Cear\u00e1",
  "Distrito Federal",
  "Esp\u00edrito Santo",
  "Goi\u00e1s",
  "Maranh\u00e3o",
  "Mato Grosso",
  "Mato Grosso do Sul",
  "Minas Gerais",
  "Par\u00e1",
  "Para\u00edba",
  "Paran\u00e1",
  "Pernambuco",
  "Piau\u00ed",
  "Rio de Janeiro",
  "Rio Grande do Norte",
  "Rio Grande do Sul",
  "Rond\u00f4nia",
  "Roraima",
  "Santa Catarina",
  "Sergipe",
  "S\u00e3o Paulo",
  "Tocantins"
];

export const STATE_TO_UF: Record<string, string> = {
  "Acre": "AC", "Alagoas": "AL", "Amapá": "AP", "Amazonas": "AM", "Bahia": "BA", 
  "Ceará": "CE", "Distrito Federal": "DF", "Espírito Santo": "ES", "Goiás": "GO", 
  "Maranhão": "MA", "Mato Grosso": "MT", "Mato Grosso do Sul": "MS", "Minas Gerais": "MG", 
  "Pará": "PA", "Paraíba": "PB", "Paraná": "PR", "Pernambuco": "PE", "Piauí": "PI", 
  "Rio de Janeiro": "RJ", "Rio Grande do Norte": "RN", "Rio Grande do Sul": "RS", 
  "Rondônia": "RO", "Roraima": "RR", "Santa Catarina": "SC", "São Paulo": "SP", 
  "Sergipe": "SE", "Tocantins": "TO"
};

export const CIDADES_BY_ESTADO: Record<string, string[]> = {
  "Acre": [
    "Rio Branco"
  ],
  "Alagoas": [
    "Arapiraca",
    "Macei\u00f3"
  ],
  "Amazonas": [
    "Manaus"
  ],
  "Bahia": [
    "Feira de Santana",
    "Itabuna",
    "Lauro de Freitas",
    "Salvador",
    "Vit\u00f3ria da Conquista"
  ],
  "Cear\u00e1": [
    "Caucaia",
    "Fortaleza",
    "Juazeiro do Norte"
  ],
  "Distrito Federal": [
    "Bras\u00edlia",
    "Taguatinga"
  ],
  "Esp\u00edrito Santo": [
    "Vila Velha",
    "Vit\u00f3ria"
  ],
  "Goi\u00e1s": [
    "Alex\u00e2nia",
    "An\u00e1polis",
    "Aparecida de Goi\u00e2nia",
    "Goi\u00e2nia",
    "Valpara\u00edso de Goi\u00e1s"
  ],
  "Maranh\u00e3o": [
    "Imperatriz",
    "S\u00e3o Lu\u00eds"
  ],
  "Mato Grosso": [
    "Cuiab\u00e1",
    "Sinop"
  ],
  "Mato Grosso do Sul": [
    "Campo Grande"
  ],
  "Minas Gerais": [
    "Belo Horizonte",
    "Betim",
    "Contagem",
    "Extrema",
    "Ju\u00edz de Fora",
    "Montes Claros",
    "Pouso Alegre",
    "Po\u00e7os de Caldas",
    "Sete Lagoas",
    "Uberl\u00e2ndia"
  ],
  "Par\u00e1": [
    "Ananindeua",
    "Bel\u00e9m",
    "Marab\u00e1"
  ],
  "Para\u00edba": [
    "Campina Grande",
    "Jo\u00e3o Pessoa"
  ],
  "Paran\u00e1": [
    "Campo Largo",
    "Cascavel",
    "Curitiba",
    "Londrina",
    "Maring\u00e1",
    "Pato Branco",
    "Ponta Grossa",
    "S\u00e3o Jos\u00e9 dos Pinhais",
    "Umuarama"
  ],
  "Pernambuco": [
    "Camaragibe",
    "Caruaru",
    "Jaboat\u00e3o dos Guararapes",
    "Olinda",
    "Recife"
  ],
  "Piau\u00ed": [
    "Teresina"
  ],
  "Rio de Janeiro": [
    "Campo dos Goytacazes",
    "Duque de Caxias",
    "Maca\u00e9",
    "Niter\u00f3i",
    "Nova Igua\u00e7u",
    "Resende",
    "Rio de Janeiro",
    "S\u00e3o Gon\u00e7alo",
    "S\u00e3o Jo\u00e3o de Meriti"
  ],
  "Rio Grande do Norte": [
    "Natal"
  ],
  "Rio Grande do Sul": [
    "Canoas",
    "Caxias do Sul",
    "Novo Hamburgo",
    "Passo Fundo",
    "Pelotas",
    "Porto Alegre",
    "Rio Grande",
    "S\u00e3o Leopoldo"
  ],
  "Rond\u00f4nia": [
    "Porto Velho"
  ],
  "Roraima": [
    "Boa Vista"
  ],
  "Santa Catarina": [
    "Balne\u00e1rio Cambori\u00fa",
    "Blumenau",
    "Chapec\u00f3",
    "Crici\u00fama",
    "Florian\u00f3polis",
    "Joinville",
    "S\u00e3o Jos\u00e9",
    "Tijucas"
  ],
  "Sergipe": [
    "Aracaju"
  ],
  "S\u00e3o Paulo": [
    "Araras",
    "Ara\u00e7atuba",
    "Barueri",
    "Bauru",
    "Campinas",
    "Caraguatatuba",
    "Cotia",
    "Cravinhos",
    "Diadema",
    "Franca",
    "Guarulhos",
    "Indaiatuba",
    "Itapetininga",
    "Itupeva",
    "It\u00fa",
    "Jundia\u00ed",
    "Limeira",
    "Mar\u00edlia",
    "Mau\u00e1",
    "Mogi das Cruzes",
    "Osasco",
    "Piracicaba",
    "Praia Grande",
    "Presidente Prudente",
    "Ribeir\u00e3o Preto",
    "Rio Claro",
    "Santa B\u00e1rbara D'Oeste",
    "Santo Andr\u00e9",
    "Sorocaba",
    "Suzano",
    "S\u00e3o Bernardo do Campo",
    "S\u00e3o Caetano do Sul",
    "S\u00e3o Jos\u00e9 do Rio Preto",
    "S\u00e3o Jos\u00e9 dos Campos",
    "S\u00e3o Paulo",
    "S\u00e3o Roque",
    "Tabo\u00e3o da Serra"
  ],
  "Tocantins": [
    "Palmas"
  ]
};

// City → Store mapping (each store belongs to a city)
export const LOJAS_BY_CIDADE: Record<string, string[]> = {
  "Alex\u00e2nia": [
    "2098 - Outlet Premium Bras\u00edlia"
  ],
  "Ananindeua": [
    "2052 - Ananindeua",
    "CE230 - ANANINDEUA"
  ],
  "An\u00e1polis": [
    "CE92 - AN\u00c1POLIS BRASIL PARK"
  ],
  "Aparecida de Goi\u00e2nia": [
    "CE94 - APARECIDA DE GOIANIA"
  ],
  "Aracaju": [
    "CE124 - RIO MAR ARACAJ\u00da",
    "CE63 - JARDINS ARACAJ\u00da"
  ],
  "Arapiraca": [
    "CE223 - ARAPIRACA GARDEN"
  ],
  "Araras": [
    "CE1101 - ARARAS"
  ],
  "Ara\u00e7atuba": [
    "CE292 - ARA\u00c7ATUBA PRA\u00c7A NOVA"
  ],
  "Balne\u00e1rio Cambori\u00fa": [
    "2106 - Balne\u00e1rio Shopping",
    "CE69 - BALNE\u00c1RIO CAMBORI\u00da"
  ],
  "Barueri": [
    "CE164 - PARQUE BARUERI",
    "CE307 - IGUATEMI ALPHAVILLE",
    "CE52 - TAMBOR\u00c9"
  ],
  "Bauru": [
    "CE125 - BAURU SHOPPING",
    "CE254 - BOULEVARD BAURU"
  ],
  "Belo Horizonte": [
    "2083 - Bh Outlet",
    "CE123 - VIA SHOPPING BARREIRO",
    "CE131 - BOULEVARD BH",
    "CE151 - MINAS SHOPPING",
    "CE200 - ESTA\u00c7\u00c3O BH",
    "CE274 - DEL REY",
    "CE313 - CIDADE BH",
    "CE43 - BH SHOPPING",
    "CE55 - P\u00c1TIO SAVASSI"
  ],
  "Bel\u00e9m": [
    "CE112 - BOULEVARD BEL\u00c9M",
    "CE190 - PARK SHOPPING BEL\u00c9M",
    "CE248 - P\u00c1TIO BEL\u00c9M",
    "CE250 - BOSQUE GR\u00c3O-PAR\u00c1"
  ],
  "Betim": [
    "CE217 - BETIM"
  ],
  "Blumenau": [
    "CE158 - BLUMENAU NORTE SHOPPING",
    "CE89 - BLUMENAU NEUMARKT"
  ],
  "Boa Vista": [
    "CE264 - P\u00c1TIO RORAIMA"
  ],
  "Bras\u00edlia": [
    "CE106 - BOULEVARD BRAS\u00cdLIA",
    "CE23 - BRASILIA SHOPPING",
    "CE25 - PARK SHOPPING BRASILIA",
    "CE280 - IGUATEMI BRASILIA",
    "CE296 - CONJUNTO NACIONAL",
    "CE37 - P\u00c1TIO BRASIL BRAS\u00cdLIA"
  ],
  "Camaragibe": [
    "CE263 - CAMARAGIBE"
  ],
  "Campina Grande": [
    "CE249 - CAMPINA GRANDE"
  ],
  "Campinas": [
    "2111 - Shopping Iguatemi Campinas",
    "CE194 - PARQUE DAS BANDEIRAS",
    "CE229 - CAMPINAS SHOPPING",
    "CE270 - IGUATEMI CAMPINAS",
    "CE39 - DOM PEDRO"
  ],
  "Campo Grande": [
    "CE146 - NORTE SUL PLAZA",
    "CE174 - CAMPO GRANDE SHOPPING",
    "CE251 - BOSQUE DOS IP\u00caS"
  ],
  "Campo Largo": [
    "2057 - City Center Outlet"
  ],
  "Campo dos Goytacazes": [
    "CE169 - CAMPOS DOS GOYTACAZES"
  ],
  "Canoas": [
    "CE236 - PARK SHOPPING CANOAS"
  ],
  "Caraguatatuba": [
    "CE188 - CARAGUATATUBA"
  ],
  "Caruaru": [
    "CE315 - CARUARU SHOPPING"
  ],
  "Cascavel": [
    "CE316 - CATUA\u00cd CASCAVEL"
  ],
  "Caucaia": [
    "2033 - Outlet Premium Fortaleza"
  ],
  "Caxias do Sul": [
    "CE103 - IGUATEMI CAXIAS"
  ],
  "Chapec\u00f3": [
    "CE179 - PATIO CHAPEC\u00d3"
  ],
  "Contagem": [
    "2092 - S\u00f3 Marcas Outlet Contagem",
    "CE73 - ITA\u00da POWER"
  ],
  "Cotia": [
    "CE133 - GRANJA VIANNA"
  ],
  "Cravinhos": [
    "2109 - Outlet Santa Maria"
  ],
  "Crici\u00fama": [
    "CE259 - CRICI\u00daMA"
  ],
  "Cuiab\u00e1": [
    "CE234 - PANTANAL CUIAB\u00c1",
    "CE237 - ESTA\u00c7\u00c3O CUIAB\u00c1"
  ],
  "Curitiba": [
    "2072 - Nike Curitiba",
    "2112 - Park Shopping Barigui",
    "CE119 - MUELLER CURITIBA",
    "CE197 - P\u00c1TIO BATEL",
    "CE242 - JOCKEY PLAZA",
    "CE300 - CURITIBA SHOPPING",
    "CE50 - BARIGUI",
    "CE54 - ESTA\u00c7\u00c3O CURITIBA",
    "CE84 - PALLADIUM CURITIBA"
  ],
  "Diadema": [
    "CE102 - DIADEMA"
  ],
  "Duque de Caxias": [
    "2034 - Outlet Premium Rio De Janeiro"
  ],
  "Extrema": [
    "CE118 - OUTLET EXTREMA"
  ],
  "Feira de Santana": [
    "CE175 - FEIRA DE SANTANA"
  ],
  "Florian\u00f3polis": [
    "CE116 - BEIRAMAR FLORIAN\u00d3POLIS",
    "CE64 - FLORIPA"
  ],
  "Fortaleza": [
    "2071 - Iguatemi Fortaleza",
    "CE221 - PARANGABA",
    "CE226 - RIOMAR FORTALEZA",
    "CE235 - RIOMAR KENNEDY",
    "CE245 - J\u00d3QUEI FORTALEZA",
    "CE47 - IGUATEMI FORTALEZA",
    "CE96 - NORTH SHOPPING FORTALEZA",
    "CE97 - VIA SUL FORTALEZA"
  ],
  "Franca": [
    "CE142 - FRANCA"
  ],
  "Goi\u00e2nia": [
    "2056 - Passeio Das \u00c1guas",
    "2075 - Araguaia Shopping",
    "2093 - Shopping Flamboyant",
    "CE266 - PASSEIO DAS \u00c1GUAS GOI\u00c2NIA",
    "CE273 - FLAMBOYANT SHOPPING",
    "CE88 - BOUGAINVILLE GOI\u00c2NIA",
    "CE99 - GOI\u00c2NIA SHOPPING"
  ],
  "Guarulhos": [
    "2090 - S\u00f3 Marcas Outlet Guarulhos",
    "CE121 - BONSUCESSO GUARULHOS",
    "CE187 - INTERNACIONAL GUARULHOS",
    "CE252 - PARQUE MAIA GUARULHOS"
  ],
  "Imperatriz": [
    "CE193 - IMPERATRIZ"
  ],
  "Indaiatuba": [
    "CE157 - INDAIATUBA POLO"
  ],
  "Itabuna": [
    "CE173 - ITABUNA"
  ],
  "Itapetininga": [
    "CE156 - ITAPETININGA"
  ],
  "Itupeva": [
    "2091 - Outlet Premium Itupeva"
  ],
  "It\u00fa": [
    "CE171 - IT\u00da PLAZA"
  ],
  "Jaboat\u00e3o dos Guararapes": [
    "CE108 - GUARARAPES"
  ],
  "Joinville": [
    "CE130 - JOINVILLE GARTEN",
    "CE308 - MUELLER JOINVILLE"
  ],
  "Jo\u00e3o Pessoa": [
    "2079 - Mangabeira",
    "CE186 - JO\u00c3O PESSOA MANAIRA",
    "CE227 - JO\u00c3O PESSOA MANGABEIRA"
  ],
  "Juazeiro do Norte": [
    "CE199 - JUAZEIRO DO NORTE"
  ],
  "Jundia\u00ed": [
    "CE195 - JUNDIA\u00cd SHOPPING",
    "CE314 - MAXI JUNDIA\u00cd"
  ],
  "Ju\u00edz de Fora": [
    "CE82 - JUIZ DE FORA INDEPEND\u00caNCIA"
  ],
  "Lauro de Freitas": [
    "CE253 - PARQUE SHOPPING BAHIA"
  ],
  "Limeira": [
    "CE170 - P\u00c1TIO LIMEIRA"
  ],
  "Londrina": [
    "CE203 - BOULEVARD LONDRINA",
    "CE91 - CATUA\u00cd LONDRINA"
  ],
  "Maca\u00e9": [
    "CE177 - MACA\u00c9"
  ],
  "Macei\u00f3": [
    "CE225 - PARQUE SHOPPING MACEI\u00d3",
    "CE303 - P\u00c1TIO MACEI\u00d3"
  ],
  "Manaus": [
    "CE185 - MANAUARA",
    "CE209 - AMAZONAS SHOPPING"
  ],
  "Marab\u00e1": [
    "CE205 - MARAB\u00c1"
  ],
  "Maring\u00e1": [
    "CE145 - CATUA\u00cd MARING\u00c1",
    "CE277 - MARING\u00c1 PARK"
  ],
  "Mar\u00edlia": [
    "CE122 - MAR\u00cdLIA"
  ],
  "Mau\u00e1": [
    "CE68 - MAU\u00c1"
  ],
  "Mogi das Cruzes": [
    "CE207 - MOGI SHOPPING"
  ],
  "Montes Claros": [
    "CE181 - MONTES CLAROS"
  ],
  "Natal": [
    "CE222 - NATAL SHOPPING",
    "CE56 - MIDWAY NATAL"
  ],
  "Niter\u00f3i": [
    "CE176 - PLAZA NITER\u00d3I"
  ],
  "Nova Igua\u00e7u": [
    "CE239 - NOVA IGUA\u00c7U"
  ],
  "Novo Hamburgo": [
    "2099 - I Fashion Outlet Novo Hamburgo",
    "CE120 - BOURBON NOVO HAMBURGO"
  ],
  "Olinda": [
    "CE284 - PATTEO OLINDA"
  ],
  "Osasco": [
    "2088 - Carrefour Osasco",
    "2102 - Shopping Uni\u00e3o Osasco",
    "CE59 - OSASCO SUPER SHOPPING",
    "CE98 - UNI\u00c3O OSASCO"
  ],
  "Palmas": [
    "CE139 - CAPIM DOURADO PALMAS"
  ],
  "Passo Fundo": [
    "CE286 - PASSO FUNDO"
  ],
  "Pato Branco": [
    "CE301 - PATO BRANCO"
  ],
  "Pelotas": [
    "CE219 - PELOTAS SHOPPING"
  ],
  "Piracicaba": [
    "CE70 - PIRACICABA"
  ],
  "Ponta Grossa": [
    "CE184 - PALLADIUM PONTA GROSSA"
  ],
  "Porto Alegre": [
    "2078 - Iguatemi Porto Alegre",
    "2100 - Shopping Barra Sul",
    "2110 - Praia de Belas",
    "CE107 - BOURBON PORTO ALEGRE",
    "CE238 - IGUATEMI PORTO ALEGRE",
    "CE240 - BARRA SUL",
    "CE279 - IGUATEMI PRAIA DE BELAS"
  ],
  "Porto Velho": [
    "CE294 - PORTO VELHO"
  ],
  "Pouso Alegre": [
    "CE285 - POUSO ALEGRE"
  ],
  "Po\u00e7os de Caldas": [
    "CE168 - PO\u00c7OS DE CALDAS"
  ],
  "Praia Grande": [
    "2030 - Litoral Plaza",
    "CE77 - LITORAL PLAZA"
  ],
  "Presidente Prudente": [
    "CE115 - PRUDENTE SHOPPING"
  ],
  "Recife": [
    "CE100 - TACARUNA",
    "CE198 - RIOMAR RECIFE",
    "CE53 - SHOPPING RECIFE",
    "CE72 - CASA FORTE"
  ],
  "Resende": [
    "CE159 - P\u00c1TIO RESENDE"
  ],
  "Ribeir\u00e3o Preto": [
    "CE281 - IGUATEMI RIBEIR\u00c3O PRETO",
    "CE45 - RIBEIR\u00c3O SHOPPING",
    "CE81 - NOVO SHOPPING RIBEIR\u00c3O"
  ],
  "Rio Branco": [
    "CE183 - RIO BRANCO"
  ],
  "Rio Claro": [
    "CE135 - RIO CLARO"
  ],
  "Rio Grande": [
    "CE260 - PARTAGE RIO GRANDE"
  ],
  "Rio de Janeiro": [
    "2086 - Shopping Nova Am\u00e9rica",
    "2101 - Barra Rio",
    "2108 - Shopping Rio Sul",
    "CE114 - ILHA PLAZA RJ",
    "CE128 - BOTAFOGO",
    "CE149 - WEST SHOPPING RIO",
    "CE20 - RIO SUL",
    "CE206 - CAMPO GRANDE RIO",
    "CE224 - METROPOLITANO BARRA",
    "CE241 - BARRA SHOPPING 241",
    "CE243 - TIJUCA",
    "CE246 - CARIOCA SHOPPING",
    "CE247 - AM\u00c9RICAS RIO",
    "CE304 - NOVA AM\u00c9RICA",
    "CE305 - MADUREIRA SHOPPING",
    "CE32 - BARRA SHOPPING 32",
    "CE66 - LEBLON",
    "CE76 - BANG\u00da",
    "CE86 - NORTE SHOPPING RIO"
  ],
  "Salvador": [
    "2035 - Shopping Barra Salvador",
    "2077 - Outlet Premium Salvador",
    "CE105 - PARALELA",
    "CE150 - SALVADOR NORTE",
    "CE192 - BELA VISTA SALVADOR",
    "CE38 - BARRA SALVADOR",
    "CE60 - SHOPPING DA BAHIA",
    "CE67 - SALVADOR SHOPPING"
  ],
  "Santa B\u00e1rbara D'Oeste": [
    "CE272 - SANTA B\u00c1RBARA D'OESTE"
  ],
  "Santo Andr\u00e9": [
    "2097 - Nike Santo Andr\u00e9",
    "CE196 - SANTO ANDR\u00c9 GRAN PLAZA",
    "CE306 - SANTO ANDR\u00c9 ABC"
  ],
  "Sete Lagoas": [
    "CE152 - SETE LAGOAS"
  ],
  "Sinop": [
    "CE291 - SINOP SHOPPING"
  ],
  "Sorocaba": [
    "CE218 - CIDADE SOROCABA",
    "CE275 - PATIO CIAN\u00ca"
  ],
  "Suzano": [
    "CE101 - SUZANO"
  ],
  "S\u00e3o Bernardo do Campo": [
    "2084 - Place Outlet - Extra Anchieta",
    "2105 - Outlet Premium Imigrantes",
    "CE167 - GOLDEN SQUARE",
    "CE208 - S\u00c3O BERNARDO PLAZA"
  ],
  "S\u00e3o Caetano do Sul": [
    "CE165 - PARK SHOPPING S\u00c3O CAETANO"
  ],
  "S\u00e3o Gon\u00e7alo": [
    "2087 - S\u00e3o Gon\u00e7alo Shopping",
    "CE143 - S\u00c3O GON\u00c7ALO SHOPPING",
    "CE153 - S\u00c3O GON\u00c7ALO PARTAGE"
  ],
  "S\u00e3o Jos\u00e9": [
    "2107 - Continente Shopping",
    "CE202 - CONTINENTE PARK SC",
    "CE262 - ITAGUA\u00c7U SC"
  ],
  "S\u00e3o Jos\u00e9 do Rio Preto": [
    "CE269 - IGUATEMI RIO PRETO",
    "CE312 - RIO PRETO SHOPPING"
  ],
  "S\u00e3o Jos\u00e9 dos Campos": [
    "2050 - Shopping Vale Sul",
    "2050 - Vale Sul Shopping",
    "CE85 - CENTER VALE"
  ],
  "S\u00e3o Jos\u00e9 dos Pinhais": [
    "CE90 - S\u00c3O JOS\u00c9 DOS PINHAIS"
  ],
  "S\u00e3o Jo\u00e3o de Meriti": [
    "CE95 - GRANDE RIO"
  ],
  "S\u00e3o Leopoldo": [
    "CE87 - BOURBON S\u00c3O LEOPOLDO"
  ],
  "S\u00e3o Lu\u00eds": [
    "2054 - Shopping Da Ilha",
    "CE138 - RIO ANIL S\u00c3O LU\u00cdS",
    "CE162 - SHOPPING DA ILHA"
  ],
  "S\u00e3o Paulo": [
    "2036 - Shopping Aricanduva",
    "2055 - Shopping Metr\u00f4 Itaquera",
    "2058 - Ibirapuera",
    "2085 - Outlet Premium Grande S\u00e3o Paulo",
    "2089 - Sp Market",
    "2094 - Shopping Center Norte",
    "2095 - Shopping Light",
    "2104 - Iguatemi SP",
    "CE117 - AN\u00c1LIA FRANCO",
    "CE144 - PENHA SP",
    "CE147 - HIGIEN\u00d3POLIS",
    "CE180 - MOOCA PLAZA",
    "CE220 - TIET\u00ca PLAZA",
    "CE255 - PAULISTA",
    "CE258 - IBIRAPUERA",
    "CE276 - TRIMAIS",
    "CE278 - CANTAREIRA",
    "CE287 - JK IGUATEMI",
    "CE288 - IGUATEMI S\u00c3O PAULO",
    "CE295 - METR\u00d4 TUCURUVI",
    "CE297 - INTERLAGOS",
    "CE299 - ITAQUERA",
    "CE310 - VALE SUL",
    "CE311 - PLAZA SUL",
    "CE34 - MORUMBI",
    "CE35 - CENTER NORTE",
    "CE41 - METR\u00d4 TATUAP\u00c9",
    "CE44 - SP MARKET",
    "CE46 - ELDORADO",
    "CE48 - ARICANDUVA",
    "CE57 - JARDIM SUL",
    "CE62 - METR\u00d4 SANTA CRUZ",
    "CE71 - BOURBON SP",
    "CE75 - SANTANA PARK",
    "CE80 - CENTRAL PLAZA"
  ],
  "S\u00e3o Roque": [
    "2032 - Catarina Fashion Outlet"
  ],
  "Tabo\u00e3o da Serra": [
    "CE141 - TABO\u00c3O DA SERRA"
  ],
  "Taguatinga": [
    "CE109 - TAGUATINGA SHOPPING"
  ],
  "Teresina": [
    "CE267 - TERESINA RIO POTY"
  ],
  "Tijucas": [
    "2070 - I Fashion Outlet Santa Catarina"
  ],
  "Uberl\u00e2ndia": [
    "CE129 - CENTER SHOPPING UBERL\u00c2NDIA",
    "CE161 - UBERL\u00c2NDIA SHOPPING"
  ],
  "Umuarama": [
    "CE283 - PALLADIUM UMUARAMA"
  ],
  "Valpara\u00edso de Goi\u00e1s": [
    "CE182 - VALPARAISO SHOPPING SUL"
  ],
  "Vila Velha": [
    "2076 - Boulevard Shopping Vila Velha"
  ],
  "Vit\u00f3ria": [
    "2029 - Shopping Vit\u00f3ria",
    "CE298 - VIT\u00d3RIA"
  ],
  "Vit\u00f3ria da Conquista": [
    "CE256 - VIT\u00d3RIA DA CONQUISTA"
  ]
};

const normalizeCityOption = (cityOption: string) => cityOption.split(" - ")[0].trim();
const normalizeStateOption = (stateOption: string) => stateOption.split(" - ")[0].trim();

const LOJA_TO_CIDADE: Record<string, string> = Object.entries(LOJAS_BY_CIDADE).reduce(
  (acc, [city, stores]) => {
    stores.forEach((store) => {
      acc[store] = city;
    });
    return acc;
  },
  {} as Record<string, string>,
);

const intersectSets = (current: Set<string> | null, next: Set<string>): Set<string> => {
  if (current === null) return next;
  return new Set(Array.from(current).filter((item) => next.has(item)));
};

const getStoresFromStates = (states: string[]) => {
  const stores = states.flatMap((stateOption) =>
    (CIDADES_BY_ESTADO[normalizeStateOption(stateOption)] || []).flatMap(
      (city) => LOJAS_BY_CIDADE[city] || [],
    ),
  );
  return new Set(stores);
};

const getStoresFromCities = (cities: string[]) => {
  const stores = cities.flatMap((cityOpt) => {
    const cityName = normalizeCityOption(cityOpt);
    return LOJAS_BY_CIDADE[cityName] || [];
  });
  return new Set(stores);
};

const getStoresFromRegionals = (regionals: string[]) => {
  const stores = regionals.flatMap((regional) => LOJAS_BY_REGIONAL[regional] || []);
  return new Set(stores);
};

const getStoresFromNacionais = (nacionais: string[]) => {
  const stores = nacionais.flatMap((nac) => LOJAS_BY_NACIONAL[nac] || []);
  return new Set(stores);
};

const getStoresFromNetworks = (networks: string[]) => {
  const normalized = new Set(networks.map((value) => value.trim().toLowerCase()));
  const stores = LOJAS_LIST.filter((store) => {
    const isCentauro = isCentauroStore(store);
    if (isCentauro && normalized.has("centauro")) return true;
    if (!isCentauro && normalized.has("fisia")) return true;
    return false;
  });
  return new Set(stores);
};

const getStoresFromChannels = (channels: string[]) => {
  const normalizedSelected = new Set(channels.map((c) => normalizeChannelOption(c)));
  const stores = Object.entries(CHANNEL_TO_STORE_CODES)
    .filter(([channel]) => normalizedSelected.has(normalizeChannelOption(channel)))
    .flatMap(([, codes]) => {
      const allowedCodes = new Set(codes);
      return LOJAS_LIST.filter((store) => allowedCodes.has(getStoreCode(store)));
    });
  return new Set(stores);
};

export const filterStoresByKnownLinks = (
  stores: string[],
  selections: Record<string, string[]>,
): string[] => {
  let allowed: Set<string> | null = null;

  const selectedCities = selections["cidade"] || [];
  if (selectedCities.length > 0) {
    allowed = intersectSets(allowed, getStoresFromCities(selectedCities));
  }

  const selectedStates = selections["estado"] || [];
  if (selectedStates.length > 0) {
    allowed = intersectSets(allowed, getStoresFromStates(selectedStates));
  }

  const selectedRegionals = selections["regional"] || [];
  if (selectedRegionals.length > 0) {
    allowed = intersectSets(allowed, getStoresFromRegionals(selectedRegionals));
  }

  const selectedNacionais = selections["nacional"] || [];
  if (selectedNacionais.length > 0) {
    allowed = intersectSets(allowed, getStoresFromNacionais(selectedNacionais));
  }

  const selectedNetworks = selections["rede"] || [];
  if (selectedNetworks.length > 0) {
    allowed = intersectSets(allowed, getStoresFromNetworks(selectedNetworks));
  }

  const selectedChannels = selections["canal"] || [];
  if (selectedChannels.length > 0) {
    allowed = intersectSets(allowed, getStoresFromChannels(selectedChannels));
  }

  if (allowed === null) return orderStoresByNetwork(stores);
  return orderStoresByNetwork(stores.filter((store) => allowed!.has(store)));
};

export const filterCitiesByKnownLinks = (
  cityOptions: string[],
  selections: Record<string, string[]>,
): string[] => {
  let allowedCities: Set<string> | null = null;

  const selectedStates = selections["estado"] || [];
  if (selectedStates.length > 0) {
    const stateCities = new Set(
      selectedStates.flatMap(
        (stateOption) => CIDADES_BY_ESTADO[normalizeStateOption(stateOption)] || [],
      ),
    );
    allowedCities = intersectSets(allowedCities, stateCities);
  }

  const selectedStores = selections["loja"] || [];
  if (selectedStores.length > 0) {
    const storeCities = new Set(
      selectedStores.map((store) => LOJA_TO_CIDADE[store]).filter(Boolean),
    );
    allowedCities = intersectSets(allowedCities, storeCities);
  }

  const selectedRegionals = selections["regional"] || [];
  if (selectedRegionals.length > 0) {
    const regionalCities = new Set(
      selectedRegionals.flatMap((regional) => LOJAS_BY_REGIONAL[regional] || []).map(
        (store) => LOJA_TO_CIDADE[store],
      ).filter(Boolean),
    );
    allowedCities = intersectSets(allowedCities, regionalCities);
  }

  const selectedNacionais = selections["nacional"] || [];
  if (selectedNacionais.length > 0) {
    const nacionalCities = new Set(
      Array.from(getStoresFromNacionais(selectedNacionais))
        .map((store) => LOJA_TO_CIDADE[store])
        .filter(Boolean),
    );
    allowedCities = intersectSets(allowedCities, nacionalCities);
  }

  const selectedNetworks = selections["rede"] || [];
  if (selectedNetworks.length > 0) {
    const networkCities = new Set(
      Array.from(getStoresFromNetworks(selectedNetworks))
        .map((store) => LOJA_TO_CIDADE[store])
        .filter(Boolean),
    );
    allowedCities = intersectSets(allowedCities, networkCities);
  }

  const selectedChannels = selections["canal"] || [];
  if (selectedChannels.length > 0) {
    const channelCities = new Set(
      Array.from(getStoresFromChannels(selectedChannels))
        .map((store) => LOJA_TO_CIDADE[store])
        .filter(Boolean),
    );
    allowedCities = intersectSets(allowedCities, channelCities);
  }

  if (allowedCities === null) return cityOptions;
  return cityOptions.filter((cityOpt) => allowedCities!.has(normalizeCityOption(cityOpt)));
};

export const filterRegionalsByKnownLinks = (
  regionalOptions: string[],
  selections: Record<string, string[]>,
): string[] => {
  let allowedRegionals: Set<string> | null = null;

  const selectedStates = selections["estado"] || [];
  if (selectedStates.length > 0) {
    const regionalsByState = new Set<string>();
    selectedStates.forEach((stateOption) => {
      const stateName = normalizeStateOption(stateOption);
      const cities = CIDADES_BY_ESTADO[stateName] || [];
      cities.forEach((city) => {
        (LOJAS_BY_CIDADE[city] || []).forEach((store) => {
          const regional = LOJA_TO_REGIONAL[store];
          if (regional) regionalsByState.add(regional);
        });
      });
    });
    allowedRegionals = intersectSets(allowedRegionals, regionalsByState);
  }

  const selectedCities = selections["cidade"] || [];
  if (selectedCities.length > 0) {
    const regionalsByCity = new Set<string>();
    selectedCities.forEach((cityOption) => {
      const cityName = normalizeCityOption(cityOption);
      (LOJAS_BY_CIDADE[cityName] || []).forEach((store) => {
        const regional = LOJA_TO_REGIONAL[store];
        if (regional) regionalsByCity.add(regional);
      });
    });
    allowedRegionals = intersectSets(allowedRegionals, regionalsByCity);
  }

  const selectedStores = selections["loja"] || [];
  if (selectedStores.length > 0) {
    const regionalsByStore = new Set(
      selectedStores.map((store) => LOJA_TO_REGIONAL[store]).filter(Boolean),
    );
    allowedRegionals = intersectSets(allowedRegionals, regionalsByStore);
  }

  const selectedNacionais = selections["nacional"] || [];
  if (selectedNacionais.length > 0) {
    const regionalsByNacional = new Set(
      Array.from(getStoresFromNacionais(selectedNacionais))
        .map((store) => LOJA_TO_REGIONAL[store])
        .filter(Boolean),
    );
    allowedRegionals = intersectSets(allowedRegionals, regionalsByNacional);
  }

  const selectedNetworks = selections["rede"] || [];
  if (selectedNetworks.length > 0) {
    const regionalsByNetwork = new Set(
      Array.from(getStoresFromNetworks(selectedNetworks))
        .map((store) => LOJA_TO_REGIONAL[store])
        .filter(Boolean),
    );
    allowedRegionals = intersectSets(allowedRegionals, regionalsByNetwork);
  }

  const selectedChannels = selections["canal"] || [];
  if (selectedChannels.length > 0) {
    const regionalsByChannel = new Set(
      Array.from(getStoresFromChannels(selectedChannels))
        .map((store) => LOJA_TO_REGIONAL[store])
        .filter(Boolean),
    );
    allowedRegionals = intersectSets(allowedRegionals, regionalsByChannel);
  }

  if (allowedRegionals === null) return regionalOptions;
  return regionalOptions.filter((regional) => allowedRegionals!.has(regional));
};

export const filterStatesByKnownLinks = (
  stateOptions: string[],
  selections: Record<string, string[]>,
): string[] => {
  let allowedStates: Set<string> | null = null;

  const selectedCities = selections["cidade"] || [];
  if (selectedCities.length > 0) {
    const cityNames = new Set(selectedCities.map((city) => normalizeCityOption(city)));
    const statesByCity = new Set(
      Object.entries(CIDADES_BY_ESTADO)
        .filter(([, cities]) => cities.some((city) => cityNames.has(city)))
        .map(([state]) => state),
    );
    allowedStates = intersectSets(allowedStates, statesByCity);
  }

  const selectedStores = selections["loja"] || [];
  if (selectedStores.length > 0) {
    const statesByStore = new Set(
      selectedStores
        .map((store) => LOJA_TO_CIDADE[store])
        .filter(Boolean)
        .map((city) =>
          Object.entries(CIDADES_BY_ESTADO).find(([, cities]) => cities.includes(city))?.[0],
        )
        .filter(Boolean),
    );
    allowedStates = intersectSets(allowedStates, statesByStore);
  }

  const selectedRegionals = selections["regional"] || [];
  if (selectedRegionals.length > 0) {
    const statesByRegional = new Set(
      selectedRegionals
        .flatMap((regional) => LOJAS_BY_REGIONAL[regional] || [])
        .map((store) => LOJA_TO_CIDADE[store])
        .filter(Boolean)
        .map((city) =>
          Object.entries(CIDADES_BY_ESTADO).find(([, cities]) => cities.includes(city))?.[0],
        )
        .filter(Boolean),
    );
    allowedStates = intersectSets(allowedStates, statesByRegional);
  }

  const selectedNacionais = selections["nacional"] || [];
  if (selectedNacionais.length > 0) {
    const statesByNacional = new Set(
      Array.from(getStoresFromNacionais(selectedNacionais))
        .map((store) => LOJA_TO_CIDADE[store])
        .filter(Boolean)
        .map((city) =>
          Object.entries(CIDADES_BY_ESTADO).find(([, cities]) => cities.includes(city))?.[0],
        )
        .filter(Boolean),
    );
    allowedStates = intersectSets(allowedStates, statesByNacional);
  }

  const selectedNetworks = selections["rede"] || [];
  if (selectedNetworks.length > 0) {
    const statesByNetwork = new Set(
      Array.from(getStoresFromNetworks(selectedNetworks))
        .map((store) => LOJA_TO_CIDADE[store])
        .filter(Boolean)
        .map((city) =>
          Object.entries(CIDADES_BY_ESTADO).find(([, cities]) => cities.includes(city))?.[0],
        )
        .filter(Boolean),
    );
    allowedStates = intersectSets(allowedStates, statesByNetwork);
  }

  const selectedChannels = selections["canal"] || [];
  if (selectedChannels.length > 0) {
    const statesByChannel = new Set(
      Array.from(getStoresFromChannels(selectedChannels))
        .map((store) => LOJA_TO_CIDADE[store])
        .filter(Boolean)
        .map((city) =>
          Object.entries(CIDADES_BY_ESTADO).find(([, cities]) => cities.includes(city))?.[0],
        )
        .filter(Boolean),
    );
    allowedStates = intersectSets(allowedStates, statesByChannel);
  }

  if (allowedStates === null) return stateOptions;
  return stateOptions.filter((state) => allowedStates!.has(normalizeStateOption(state)));
};

export const filterNacionalsByKnownLinks = (
  nacionalOptions: string[],
  selections: Record<string, string[]>,
): string[] => {
  let allowedNacionais: Set<string> | null = null;

  const selectedStates = selections["estado"] || [];
  if (selectedStates.length > 0) {
    const nacionaisByState = new Set(
      Array.from(getStoresFromStates(selectedStates))
        .map((store) => LOJA_TO_NACIONAL[store])
        .filter(Boolean),
    );
    allowedNacionais = intersectSets(allowedNacionais, nacionaisByState);
  }

  const selectedCities = selections["cidade"] || [];
  if (selectedCities.length > 0) {
    const nacionaisByCity = new Set(
      Array.from(getStoresFromCities(selectedCities))
        .map((store) => LOJA_TO_NACIONAL[store])
        .filter(Boolean),
    );
    allowedNacionais = intersectSets(allowedNacionais, nacionaisByCity);
  }

  const selectedRegionals = selections["regional"] || [];
  if (selectedRegionals.length > 0) {
    const nacionaisByRegional = new Set(
      Array.from(getStoresFromRegionals(selectedRegionals))
        .map((store) => LOJA_TO_NACIONAL[store])
        .filter(Boolean),
    );
    allowedNacionais = intersectSets(allowedNacionais, nacionaisByRegional);
  }

  const selectedStores = selections["loja"] || [];
  if (selectedStores.length > 0) {
    const nacionaisByStore = new Set(
      selectedStores.map((store) => LOJA_TO_NACIONAL[store]).filter(Boolean),
    );
    allowedNacionais = intersectSets(allowedNacionais, nacionaisByStore);
  }

  const selectedNetworks = selections["rede"] || [];
  if (selectedNetworks.length > 0) {
    const nacionaisByNetwork = new Set(
      Array.from(getStoresFromNetworks(selectedNetworks))
        .map((store) => LOJA_TO_NACIONAL[store])
        .filter(Boolean),
    );
    allowedNacionais = intersectSets(allowedNacionais, nacionaisByNetwork);
  }

  const selectedChannels = selections["canal"] || [];
  if (selectedChannels.length > 0) {
    const nacionaisByChannel = new Set(
      Array.from(getStoresFromChannels(selectedChannels))
        .map((store) => LOJA_TO_NACIONAL[store])
        .filter(Boolean),
    );
    allowedNacionais = intersectSets(allowedNacionais, nacionaisByChannel);
  }

  if (allowedNacionais === null) return nacionalOptions;
  return nacionalOptions.filter((nac) => allowedNacionais!.has(nac));
};

// ── Mapas derivados para filtragem contextual por pai no buildGroupTree ───────

/** loja → regional (derivado de LOJAS_BY_REGIONAL) */
const LOJA_TO_REGIONAL: Record<string, string> = REGIONAL_OPTIONS.reduce(
  (acc, regional) => {
    (LOJAS_BY_REGIONAL[regional] || []).forEach((store) => {
      acc[store] = regional;
    });
    return acc;
  },
  {} as Record<string, string>,
);

/** loja → nacional (derivado de LOJAS_BY_NACIONAL) */
const LOJA_TO_NACIONAL: Record<string, string> = NAC_OPTIONS.reduce(
  (acc, nac) => {
    (LOJAS_BY_NACIONAL[nac] || []).forEach((store) => {
      acc[store] = nac;
    });
    return acc;
  },
  {} as Record<string, string>,
);

/** regional → cidades (derivado de LOJAS_BY_REGIONAL + LOJA_TO_CIDADE) */
const CIDADES_BY_REGIONAL: Record<string, string[]> = REGIONAL_OPTIONS.reduce(
  (acc, regional) => {
    const cities = new Set<string>();
    (LOJAS_BY_REGIONAL[regional] || []).forEach((store) => {
      const city = LOJA_TO_CIDADE[store];
      if (city) cities.add(city);
    });
    acc[regional] = Array.from(cities).sort();
    return acc;
  },
  {} as Record<string, string[]>,
);

/** nacional → cidades (derivado de LOJAS_BY_NACIONAL + LOJA_TO_CIDADE) */
const CIDADES_BY_NACIONAL: Record<string, string[]> = NAC_OPTIONS.reduce(
  (acc, nac) => {
    const cities = new Set<string>();
    (LOJAS_BY_NACIONAL[nac] || []).forEach((store) => {
      const city = LOJA_TO_CIDADE[store];
      if (city) cities.add(city);
    });
    acc[nac] = Array.from(cities).sort();
    return acc;
  },
  {} as Record<string, string[]>,
);

/**
 * Aplica restrições de contexto do nível pai na lista de opções do nível filho.
 *
 * Chamada exclusivamente pelo buildGroupTree para garantir que cada nó filho
 * exiba apenas os itens que pertencem ao pai em que está inserido.
 *
 * Regras suportadas (conforme planilha de cadastro):
 *  regional → loja   (LOJAS_BY_REGIONAL)
 *  regional → cidade (CIDADES_BY_REGIONAL)
 *  nacional → loja, cidade, regional, estado (LOJAS_BY_NACIONAL)
 *  cidade   → loja   (LOJAS_BY_CIDADE)
 *  estado   → cidade (CIDADES_BY_ESTADO)
 *  estado   → loja   (via estado → cidade → loja)
 *  rede     → loja   (prefixo CE* = Centauro, demais = Fisia)
 *  loja     → regional, cidade, estado, nacional (inversos)
 *
 * Para pares sem relação mapeada, retorna as opções sem alteração (fallback seguro).
 */
export const applyParentContextToOptions = (
  childAttrId: string,
  parentContext: Record<string, string>,
  options: string[],
): string[] => {
  const extractCityName = (opt: string) => opt.split(" - ")[0].trim();

  let result = options;

  for (const [parentAttrId, parentValue] of Object.entries(parentContext)) {
    if (!parentValue) continue;

    let allowed: Set<string> | null = null;

    // ── loja como filho ──────────────────────────────────────────────
    if (childAttrId === "loja") {
      if (parentAttrId === "regional") {
        allowed = new Set(LOJAS_BY_REGIONAL[parentValue] || []);
      } else if (parentAttrId === "nacional") {
        allowed = new Set(LOJAS_BY_NACIONAL[parentValue] || []);
      } else if (parentAttrId === "cidade") {
        allowed = new Set(LOJAS_BY_CIDADE[extractCityName(parentValue)] || []);
      } else if (parentAttrId === "estado") {
        const cities = CIDADES_BY_ESTADO[normalizeStateOption(parentValue)] || [];
        const stores = cities.flatMap((city) => LOJAS_BY_CIDADE[city] || []);
        allowed = new Set(stores);
      } else if (parentAttrId === "rede") {
        const isCentauro = parentValue.trim().toLowerCase() === "centauro";
        allowed = new Set(
          LOJAS_LIST.filter((s) =>
            isCentauro ? isCentauroStore(s) : !isCentauroStore(s),
          ),
        );
      } else if (parentAttrId === "canal") {
        allowed = getStoresFromChannels([parentValue]);
      }
    }

    // ── cidade como filho ────────────────────────────────────────────
    else if (childAttrId === "cidade") {
      if (parentAttrId === "regional") {
        allowed = new Set(CIDADES_BY_REGIONAL[parentValue] || []);
      } else if (parentAttrId === "nacional") {
        allowed = new Set(CIDADES_BY_NACIONAL[parentValue] || []);
      } else if (parentAttrId === "estado") {
        allowed = new Set(CIDADES_BY_ESTADO[normalizeStateOption(parentValue)] || []);
      } else if (parentAttrId === "rede") {
        allowed = new Set(
          Array.from(getStoresFromNetworks([parentValue]))
            .map((store) => LOJA_TO_CIDADE[store])
            .filter(Boolean),
        );
      } else if (parentAttrId === "canal") {
        allowed = new Set(
          Array.from(getStoresFromChannels([parentValue]))
            .map((store) => LOJA_TO_CIDADE[store])
            .filter(Boolean),
        );
      }
    }

    // ── regional como filho ──────────────────────────────────────────
    else if (childAttrId === "regional") {
      if (parentAttrId === "estado") {
        const cities = CIDADES_BY_ESTADO[normalizeStateOption(parentValue)] || [];
        const regionals = new Set<string>();
        cities.forEach((city) => {
          (LOJAS_BY_CIDADE[city] || []).forEach((store) => {
            const regional = LOJA_TO_REGIONAL[store];
            if (regional) regionals.add(regional);
          });
        });
        allowed = regionals;
      } else if (parentAttrId === "nacional") {
        const regionals = new Set<string>();
        (LOJAS_BY_NACIONAL[parentValue] || []).forEach((store) => {
          const regional = LOJA_TO_REGIONAL[store];
          if (regional) regionals.add(regional);
        });
        allowed = regionals;
      } else if (parentAttrId === "cidade") {
        const regionals = new Set<string>();
        (LOJAS_BY_CIDADE[extractCityName(parentValue)] || []).forEach((store) => {
          const regional = LOJA_TO_REGIONAL[store];
          if (regional) regionals.add(regional);
        });
        allowed = regionals;
      } else if (parentAttrId === "rede") {
        allowed = new Set(
          Array.from(getStoresFromNetworks([parentValue]))
            .map((store) => LOJA_TO_REGIONAL[store])
            .filter(Boolean),
        );
      } else if (parentAttrId === "canal") {
        allowed = new Set(
          Array.from(getStoresFromChannels([parentValue]))
            .map((store) => LOJA_TO_REGIONAL[store])
            .filter(Boolean),
        );
      }
    }

    // ── nacional como filho ───────────────────────────────────────────
    else if (childAttrId === "nacional") {
      if (parentAttrId === "estado") {
        const cities = CIDADES_BY_ESTADO[normalizeStateOption(parentValue)] || [];
        const stores = cities.flatMap((city) => LOJAS_BY_CIDADE[city] || []);
        allowed = new Set(stores.map((store) => LOJA_TO_NACIONAL[store]).filter(Boolean));
      } else if (parentAttrId === "regional") {
        allowed = new Set(
          (LOJAS_BY_REGIONAL[parentValue] || [])
            .map((store) => LOJA_TO_NACIONAL[store])
            .filter(Boolean),
        );
      } else if (parentAttrId === "cidade") {
        allowed = new Set(
          (LOJAS_BY_CIDADE[extractCityName(parentValue)] || [])
            .map((store) => LOJA_TO_NACIONAL[store])
            .filter(Boolean),
        );
      } else if (parentAttrId === "loja") {
        const nac = LOJA_TO_NACIONAL[parentValue];
        allowed = nac ? new Set([nac]) : new Set();
      } else if (parentAttrId === "rede") {
        allowed = new Set(
          Array.from(getStoresFromNetworks([parentValue]))
            .map((store) => LOJA_TO_NACIONAL[store])
            .filter(Boolean),
        );
      } else if (parentAttrId === "canal") {
        allowed = new Set(
          Array.from(getStoresFromChannels([parentValue]))
            .map((store) => LOJA_TO_NACIONAL[store])
            .filter(Boolean),
        );
      }
    } else if (childAttrId === "mesa") {
      if (parentAttrId === "sala") {
        const letter = extractSalaLetter(parentValue);
        if (letter) {
          allowed = new Set(
            MESA_OPTIONS.filter(
              (code) => code.charAt(0).toUpperCase() === letter,
            ),
          );
        }
      }
    } else if (childAttrId === "modalidade") {
      if (parentAttrId === "categoria") {
        allowed = new Set(MODALIDADES_BY_CATEGORIA[parentValue] || []);
      }
    } else if (childAttrId === "subgrupo") {
      if (parentAttrId === "grupo") {
        allowed = new Set(SUBGRUPOS_BY_GRUPO[parentValue] || []);
      }
    } else if (childAttrId === "estado") {
      if (parentAttrId === "rede") {
        allowed = new Set(
          Array.from(getStoresFromNetworks([parentValue]))
            .map((store) => LOJA_TO_CIDADE[store])
            .filter(Boolean)
            .map(
              (city) =>
                Object.entries(CIDADES_BY_ESTADO).find(([, cities]) =>
                  cities.includes(city),
                )?.[0],
            )
            .filter(Boolean),
        );
      } else if (parentAttrId === "canal") {
        allowed = new Set(
          Array.from(getStoresFromChannels([parentValue]))
            .map((store) => LOJA_TO_CIDADE[store])
            .filter(Boolean)
            .map(
              (city) =>
                Object.entries(CIDADES_BY_ESTADO).find(([, cities]) =>
                  cities.includes(city),
                )?.[0],
            )
            .filter(Boolean),
        );
      } else if (parentAttrId === "nacional") {
        allowed = new Set(
          (LOJAS_BY_NACIONAL[parentValue] || [])
            .map((store) => LOJA_TO_CIDADE[store])
            .filter(Boolean)
            .map(
              (city) =>
                Object.entries(CIDADES_BY_ESTADO).find(([, cities]) =>
                  cities.includes(city),
                )?.[0],
            )
            .filter(Boolean),
        );
      }
    }

    // ── Aplica a restrição apenas se produzir resultado não-vazio ────
    if (allowed !== null && allowed.size > 0) {
      if (childAttrId === "cidade") {
        // Cidades podem estar no formato "Cidade - UF" ou "Cidade"
        result = result.filter((opt) => allowed!.has(extractCityName(opt)));
      } else {
        result = result.filter((opt) => allowed!.has(opt));
      }
    }
  }

  return result;
};

export const CATEGORIAS_LIST = [
  "Alimento", "Aquáticos", "Arremesso", "Artes Marciais", "Aventura", 
  "Baseball", "Basquete", "Bike", "Caminhada", "Corrida", "Futebol", 
  "Futebol Americano", "Handball", "Infantil", "Patinacao", "Patinete", 
  "Racket", "Skate", "Slackline", "Treino", "Volei"
];

export const MODALIDADES_BY_CATEGORIA: Record<string, string[]> = {
  "Futebol": ["Campo", "Futsal", "Society", "Salão", "Lifestyle", "Multiuso", "Alta Performance", "Casual", "Torcedor", "Praticante"],
  "Corrida": ["Rua", "Trilha", "Maratona", "Caminhada", "Performance"],
  "Treino": ["Academia", "Crossfit", "Funcional", "Yoga", "Pilates"],
  "Bike": ["Mountain Bike", "Speed", "Urbano", "Infantil"],
  "Basquete": ["Quadra", "Street", "NBA", "Casual"],
  "Volei": ["Quadra", "Praia", "Indoor"],
  "Aquáticos": ["Piscina", "Mar", "Competição"],
  "Casual": ["Dia a dia", "Moda"],
  "Alimento": ["Suplementação", "Energia", "Hidratação", "Vitaminas"]
};

export const GRUPOS_LIST = [
  "Acessórios", "Alimentos", "Calçados", "Equipamentos", "Vestuários"
];

export const SUBGRUPOS_BY_GRUPO: Record<string, string[]> = {
  "Alimentos": [
    "Barrinha", "BCAA", "Bebida", "Carbo", "Creatina", "Emagrecedores", "Gel", 
    "Glutamina", "Hipercalórico", "Pré Treino", "Proteína", "Vitamínicos", "Whey Protein"
  ],
  "Vestuários": [
    "Bermuda", "Blusa", "Blusão", "Body", "Bretelle", "Calça", "Calção", 
    "Camisa", "Camiseta", "Colete", "Complemento", "Conjunto", "Fleece", 
    "Jaqueta", "Kimono", "Kit Uniforme", "Legging", "Maiô", "Manguito", 
    "Pernito", "Polo", "Poncho", "Rashguard", "Regata", "Roupão", "Saia", 
    "Shorts", "Sunga", "Top", "Vestido"
  ],
  "Calçados": [
    "Botas", "Chinelo", "Chuteira", "Sandália", "Sapatilha", "Tênis"
  ],
  "Acessórios": ["Boné", "Luva", "Meia", "Mochila", "Óculos"],
  "Equipamentos": ["Bola", "Bomba de Ar", "Caneleira", "Cronômetro", "Raquete"]
};

/** Marcas próprias / licenciadas — primeira seção do atributo MARCA. */
export const MARCA_PROPRIAS_LICENCIADAS = [
  "OXER",
  "NORD",
  "ADAMS",
  "ASICS LIC",
  "CBF",
] as const;

/** Demais marcas — segunda seção do atributo MARCA (lista plana ordenada). */
export const MARCA_DEMAIS_BRANDS = [
  "Adidas",
  "Asics",
  "Fila",
  "Mizuno",
  "New Balance",
  "Nike",
  "Olympikus",
  "Penalty",
  "Puma",
  "Umbro",
  "Under Armour",
] as const;

/** Lista plana (seleção, exclusão, agrupamento, mocks) — ordem: próprias + demais A–Z. */
export const MARCA_OPTIONS = [
  ...MARCA_PROPRIAS_LICENCIADAS,
  ...[...MARCA_DEMAIS_BRANDS].sort((a, b) => a.localeCompare(b, "pt-BR")),
];

/** Grupos visuais no dropdown de MARCA (PRODUTO). */
export interface MarcaOptionGroup {
  id: "proprias_licenciadas" | "demais";
  label: string;
  options: readonly string[];
}

export const MARCA_OPTION_GROUPS: MarcaOptionGroup[] = [
  {
    id: "proprias_licenciadas",
    label: "Marcas Próprias e Licenciadas",
    options: MARCA_PROPRIAS_LICENCIADAS,
  },
  {
    id: "demais",
    label: "Demais",
    options: [...MARCA_DEMAIS_BRANDS].sort((a, b) =>
      a.localeCompare(b, "pt-BR"),
    ),
  },
];

/** Opções fixas do atributo FRANQUIA (módulo PRODUTO). */
export const FRANQUIA_OPTIONS = [
  "Pegasus",
  "Vomero",
  "Metcon",
  "Revolution",
  "Downshifter",
  "Airmax",
  "Dunk",
  "T90",
  "Airforce",
] as const;

function collapseSpaces(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/**
 * Descrição do modelo: texto após a primeira ocorrência de uma marca conhecida
 * (MARCA_OPTIONS, da mais longa para a mais curta). Sem marca → texto completo.
 */
export function modeloDescriptionAfterBrand(
  raw: string,
  brands: readonly string[] = MARCA_OPTIONS,
): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const upper = trimmed.toUpperCase();
  const byLen = [...brands].sort((a, b) => b.length - a.length);
  for (const brand of byLen) {
    const b = brand.trim();
    if (!b) continue;
    const idx = upper.indexOf(b.toUpperCase());
    if (idx === -1) continue;
    const consumed = trimmed.slice(idx, idx + b.length);
    const after = trimmed.slice(idx + consumed.length).trim();
    if (after.length > 0) return collapseSpaces(after);
    return collapseSpaces(trimmed);
  }
  return collapseSpaces(trimmed);
}

/**
 * Rótulo de modelo para listagens: 8 dígitos (determinísticos) + "-" + descrição pós-marca.
 */
export function formatModeloListEntry(raw: string): string {
  const desc = modeloDescriptionAfterBrand(raw);
  const basis = `${raw}\0${desc}`;
  const n = hashString(basis, 904727) % 100_000_000;
  const digits = String(n).padStart(8, "0");
  return desc.length > 0 ? `${digits}-${desc}` : digits;
}

/**
 * Rótulo de modelo na listagem do modal: com código (`12345678-descrição`) ou só a parte textual
 * (sem os 8 dígitos iniciais nem o hífen). Entradas que não seguem esse formato são devolvidas intactas.
 */
export function modeloListDisplayLabel(entry: string, showCode: boolean): string {
  if (showCode) return entry;
  const noPrefix = entry.replace(/^\d{8}-/, "").trim();
  if (noPrefix !== entry) return noPrefix.length > 0 ? noPrefix : entry;
  if (/^\d{8}$/.test(entry)) return "";
  return entry;
}

export const GENERO_OPTIONS = [
  "Feminino", "Masculino", "Unissex", "Não Informado"
];

export const FAIXA_ETARIA_OPTIONS = [
  "Adulto", "Infantil"
];

export const COR_OPTIONS = [
  "Amarelo", "Azul", "Bege", "Branco", "Cinza", "Dourado", "Laranja", 
  "Marrom", "Multicolorido", "Preto", "Prata", "Rosa", "Roxo", "Verde", "Vermelho"
];

export const TAMANHO_OPTIONS = [
  "Único", 
  "PP", "P", "M", "G", "GG", "XG", "XXG",
  "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"
];

export const SABOR_OPTIONS = [
  "Baunilha", "Chocolate", "Cookies & Cream", "Coco", "Frutas Vermelhas", 
  "Laranja", "Limão", "Morango", "Natural", "Sem Sabor", "Uva"
];

export const SALA_OPTIONS = [
  "Sala C",
  "Sala V",
  "Sala F",
  "Sala O",
];

/** Letra da sala a partir do rótulo "Sala O" → "O". */
export function extractSalaLetter(salaLabel: string): string | null {
  const m = salaLabel.trim().match(/^sala\s+(.+)$/i);
  if (!m?.[1]) return null;
  const token = m[1].trim();
  return token ? token.charAt(0).toUpperCase() : null;
}

/** Mesas do PRODUTO; a primeira letra do código indica a sala (ex.: OG → Sala O). */
const MESA_CODES_ORDERED = [
  "OD", "O9", "OV", "OG", "OO", "OP", "CV", "V4", "ON", "OU", "OR", "V2", "OF", "O6", "OJ", "O7", "OC", "CS", "OX", "CH", "CB", "OI", "OM", "O1", "OE", "OB", "O3", "V7", "V5", "CF", "OW", "OA", "CR", "V3", "CM", "OH", "VA", "OS", "VD", "V1", "CC", "O2", "F6", "OK", "CK", "V6", "CA", "CT", "VG", "F1", "VN", "OL", "VL", "CO", "CQ", "VI", "VT", "OY", "F8", "F3", "F4", "FA", "F9", "F7", "FW", "FB", "FU", "F5", "FV", "FX", "F2", "FY", "FD", "F0", "FI", "FC", "FP", "FZ", "CJ", "VO", "CI", "VM", "O4", "O5", "VJ", "VB", "VH", "FE", "OT", "VQ", "CL", "CN", "FF",
] as const;

/** Salas removidas do catálogo; mesas cuja 1ª letra está aqui também não entram em MESA_OPTIONS. */
const EXCLUDED_MESA_SALA_PREFIXES = new Set<string>(["S", "X", "Z"]);

export const MESA_OPTIONS: string[] = (() => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const code of MESA_CODES_ORDERED) {
    const c = code.trim().toUpperCase();
    if (!c || seen.has(c)) continue;
    if (EXCLUDED_MESA_SALA_PREFIXES.has(c.charAt(0))) continue;
    seen.add(c);
    out.push(c);
  }
  return out;
})();

/** Filtra códigos de mesa pelas salas selecionadas (vazio = todas). */
export function filterMesasBySalasOptions(
  allMesas: readonly string[],
  selectedSalas: string[] | undefined,
): string[] {
  const salas = selectedSalas?.filter(Boolean) ?? [];
  if (salas.length === 0) return [...allMesas];
  const letters = new Set(
    salas
      .map((s) => extractSalaLetter(s))
      .filter((x): x is string => x != null && x !== ""),
  );
  if (letters.size === 0) return [...allMesas];
  return allMesas.filter((mesa) =>
    letters.has(mesa.charAt(0).toUpperCase()),
  );
}

export const UDN_OPTIONS = [
  "AQUATICOS - MAR - CAMISETA UV - 0002/SPEEDO",
  "AQUATICOS - MAR - MASCARAS - 0005/INICIANTE",
  "AQUATICOS - MAR - POLO - 0001/DEMAIS",
  "AQUATICOS - PISCINA - MAIO - 0002/FILA/TRADICIONAL",
  "AQUATICOS - PISCINA - MAIO - 0002/SPEEDO/TRADICIONAL",
  "AQUATICOS - PISCINA - MAIO - 0004/SPEEDO/TRADICIONAL",
  "AQUATICOS - PISCINA - OCULOS - 0005/DEMAIS/INICIANTE",
  "AQUATICOS - PISCINA - OCULOS - 0005/OXER/INICIANTE",
  "AQUATICOS - PISCINA - OCULOS - 0005/SPEEDO/AVANCADO",
  "ARTES MARCIAIS - BOXE - APARADOR - 0005/SOCO",
  "ARTES MARCIAIS - BOXE - LUVA - 0005/10OZ",
  "ARTES MARCIAIS - BOXE - LUVA - 0005/12OZ",
  "ARTES MARCIAIS - JIU JITSU - KIMONO - 0001/KORAL",
  "ARTES MARCIAIS - JIU JITSU - KIMONO - 0003/DEMAIS",
  "ARTES MARCIAIS - MMA - CAMISETA - 0001/VENUM",
  "BASQUETE - BASQUETE - TENIS - 0001/ADIDAS/P3/OUTROS",
  "BASQUETE - BASQUETE - TENIS - 0001/ADIDAS/P3/SIGN",
  "BASQUETE - BASQUETE - TENIS - 0001/NIKE/P1/OUTROS",
  "BASQUETE - BASQUETE - TENIS - 0001/NIKE/P2/OUTROS",
  "BASQUETE - BASQUETE - TENIS - 0001/NIKE/P3/OUTROS",
  "CORRIDA - CAMINHADA - TENIS CAM - 0001/UNDER ARMOUR/OUTROS",
  "CORRIDA - CAMINHADA - TENIS CAM - 0002/ADIDAS/DURAMO",
  "CORRIDA - CAMINHADA - TENIS CAM - 0002/ADIDAS/LITE RACER",
  "CORRIDA - CAMINHADA - TENIS CAM - 0002/PUMA/OUTROS",
  "CORRIDA - CORRIDA - CALCA COMP MP - 0001/OXER/OUTROS",
  "CORRIDA - CORRIDA - CALCA LEGGING - 0002/DEMAIS/OUTROS",
  "CORRIDA - CORRIDA - CAMISETA - 0001/DEMAIS/OUTROS",
  "CORRIDA - CORRIDA - CAMISETA - 0001/NIKE/BASICOS",
  "CORRIDA - CORRIDA - CAMISETA MP - 0001/ASICS LIC/OUTROS",
  "CORRIDA - CORRIDA - CAMISETA MP - 0001/OXER/OUTROS",
  "CORRIDA - CORRIDA - CAMISETA MP - 0002/ASICS LIC/OUTROS",
  "FITNESS - ACADEMIA - CALCA LEGGING - 0002/ADIDAS/OUTROS",
  "FITNESS - ACADEMIA - CALCA LEGGING - 0002/DEMAIS/OUTROS",
  "FITNESS - ACADEMIA - CALCA LEGGING - 0002/FILA/OUTROS",
  "FITNESS - ACADEMIA - CALCA LEGGING - 0002/PUMA/OUTROS",
  "FITNESS - ACADEMIA - CALCA LEGGING MP - 0002/ASICS LIC/OUTROS",
  "FITNESS - ACADEMIA - CAMISETA - 0001/ADIDAS/OUTROS",
  "FITNESS - ACADEMIA - CAMISETA - 0001/MIZUNO/OUTROS",
  "FITNESS - ACADEMIA - CAMISETA - 0001/NIKE/OUTROS",
  "FITNESS - ACADEMIA - CAMISETA - 0004/OXER/OUTROS",
  "FITNESS - ACADEMIA - CAMISETA ML - 0002/VESTEM/OUTROS",
  "FITNESS - ACADEMIA - CAMISETA MP - 0001/OXER/OUTROS",
  "FITNESS - ACADEMIA - CAMISETA MP - 0002/OXER/OUTROS",
  "FITNESS - ACADEMIA - CANELEIRA - 0005/DEMAIS/OUTROS",
  "FITNESS - ACADEMIA - JAQUETA - 0001/DEMAIS/OUTROS",
  "FITNESS - SPORTSWEAR - TENIS - 0003/PUMA/BABY",
  "FITNESS - SPORTSWEAR - TENIS LS - 0001/FILA/OUTROS",
  "FITNESS - SPORTSWEAR - TENIS LS - 0001/LACOSTE/EUROPA",
  "FITNESS - SPORTSWEAR - TENIS LS - 0001/LACOSTE/OUTROS",
  "FITNESS - SPORTSWEAR - TENIS LS - 0001/NEW BALANCE/480",
  "FITNESS - SPORTSWEAR - TENIS LS - 0001/NEW BALANCE/OUTROS",
  "FITNESS - SPORTSWEAR - TENIS LS - 0001/NIKE/COURT VISION",
  "FITNESS - SPORTSWEAR - TENIS LS - 0001/NIKE/OUTROS",
  "FITNESS - SPORTSWEAR - TENIS LS - 0001/ON BRAZIL/OUTROS",
  "FITNESS - SPORTSWEAR - TENIS LS - 0001/PUMA/SMASH",
  "FITNESS - SPORTSWEAR - TENIS LS - 0002/ADIDAS/ADVANTAGE",
  "FITNESS - SPORTSWEAR - TENIS LS - 0002/ADIDAS/OUTROS",
  "FITNESS - SPORTSWEAR - TENIS LS - 0002/NIKE/GAMMAFORCE",
  "FITNESS - SPORTSWEAR - TENIS LS - 0002/NIKE/JORDAN",
  "FITNESS - SPORTSWEAR - TENIS LS - 0002/PUMA/CARINA",
  "FITNESS - SPORTSWEAR - TENIS LS - 0002/PUMA/OUTROS",
  "FITNESS - SPORTSWEAR - TOP LS MP - 0002/OXER/OUTROS",
  "FUTEBOL - CAMPO - ACESSORIOS TIME - 0005/DESCONTINUADO",
  "FUTEBOL - CAMPO - BLUSAO FEDERACAO - 0001/CBF",
  "FUTEBOL - CAMPO - BLUSAO FEDERACAO - 0001/DEMAIS FEDERACOES",
  "FUTEBOL - CAMPO - BLUSAO INT LIC - 0001/DEMAIS/DEMAIS INTERNACIONAL",
  "FUTEBOL - CAMPO - BLUSAO NAC - 0001/DEMAIS NACIONAL",
  "FUTEBOL - CAMPO - BLUSAO NAC - 0001/PALMEIRAS",
  "FUTEBOL - CAMPO - BLUSAO NAC LIC - 0001/DEMAIS/CORINTHIANS",
  "FUTEBOL - CAMPO - BLUSAO NAC LIC - 0001/DEMAIS/DEMAIS NACIONAL",
  "FUTEBOL - CAMPO - BOLA - 0005/ADIDAS/P0",
  "FUTEBOL - CAMPO - BOLA - 0005/ADIDAS/P2",
  "FUTEBOL - CAMPO - BOLA - 0005/DEMAIS/P0",
  "FUTEBOL - CAMPO - BOLA - 0005/NIKE/P1",
  "FUTEBOL - CAMPO - BOLA - 0005/PUMA/P0",
  "FUTEBOL - CAMPO - BOLA COPA DO MUNDO - 0005/P1",
  "FUTEBOL - CAMPO - BOLA FEDERACAO - 0005/DEMAIS FEDERACOES",
  "FUTEBOL - CAMPO - CALCA INT - 0001/DEMAIS INTERNACIONAL",
  "FUTEBOL - CAMPO - CALCAO FEDERACAO - 0001/DEMAIS FEDERACOES",
  "FUTEBOL - CAMPO - CALCAO FEDERACAO - 0003/DEMAIS FEDERACOES",
  "FUTEBOL - CAMPO - CALCAO INT LIC - 0001/BARCELONA/BARCELONA",
  "FUTEBOL - CAMPO - CALCAO INT LIC - 0001/DEMAIS/REAL MADRID",
  "FUTEBOL - CAMPO - CALCAO NAC - 0001/CORINTHIANS",
  "FUTEBOL - CAMPO - CALCAO NAC - 0003/PALMEIRAS",
  "FUTEBOL - CAMPO - CALCAO NAC LIC - 0003/DEMAIS/DEMAIS NACIONAL",
  "FUTEBOL - CAMPO - CAMISA FEDERACAO - 0001/ARGENTINA",
  "FUTEBOL - CAMPO - CAMISA FEDERACAO - 0001/CBF_AWAY",
  "FUTEBOL - CAMPO - CAMISA FEDERACAO - 0001/FRANCA",
  "FUTEBOL - CAMPO - CAMISA INT - 0001/BAYERN",
  "NUTRICAO - SUPLEMENTOS - HIPERCALORICO - 0005/OUTROS",
  "RACKET - TENNIS - ANTI VIBRADOR - 0005/DEMAIS",
  "RACKET - TENNIS - BLUSAO - 0001/NIKE",
  "RACKET - TENNIS - CAMISETA - 0001/ADIDAS",
  "RACKET - TENNIS - CAMISETA - 0001/FILA",
  "RACKET - TENNIS - CAMISETA - 0002/NIKE",
  "RACKET - TENNIS - CAMISETA - 0004/ASICS LIC",
  "RACKET - TENNIS - CORDA - 0005/P1",
  "RACKET - TENNIS - MUNHEQUEIRA - 0005/NIKE",
  "RACKET - TENNIS - POLO - 0001/DEMAIS",
  "RACKET - TENNIS - POLO - 0001/FILA",
  "RACKET - TENNIS - POLO - 0001/NIKE",
  "RACKET - TENNIS - POLO - 0002/DEMAIS"
];

const MODELO_OPTIONS_RAW: string[] = [
  "0000000000000 NSW CLUB MASC",
  "BERMUDA ADIDAS 3 LISTRAS",
  "BERMUDA ADIDAS 3 STRIPES MASCULINA",
  "BERMUDA ADIDAS ESSENTIALS",
  "BERMUDA ADIDAS M LOGO MAS",
  "BERMUDA M NIKE CLUB FLOW",
  "BERMUDA NIKE DF TOTALITY KNIT 7IN UL G",
  "BERMUDA NIKE M DF FLEX 7IN SHO",
  "BERMUDA NIKE PRO 365 SHORT 5IN",
  "BOLA ADIDAS WC CLB",
  "BOLA ADIDAS WC LGE",
  "BOLA ADIDAS WC TRN",
  "BONE ADIDAS 3 LISTRAS",
  "BONE ADIDAS RUN MES CC",
  "BONE NIKE CLUB U CB FUT WSH",
  "BONE NIKE DF FLY CAP U CB",
  "CALCA LEGGING ADIDAS TREINO BASICA",
  "CALCAO NIKE DF PARK III NB K 21 JUV",
  "CAMISA ALEMANHA I 26 TORCEDOR MASC",
  "CAMISA ARGENTINA I 26 TORCEDOR MASC",
  "CAMISA ARSENAL I 26 TORCEDOR MASC",
  "CAMISA ATLETICO MINEIRO I 25 TORCEDOR MASC",
  "CAMISA ATLETICO MINEIRO I 26 JOGO MASC",
  "CAMISA ATLETICO MINEIRO II 25 TORCEDOR FEM",
  "CAMISA ATLETICO MINEIRO TREINO 26 MASC",
  "CAMISA ATLETICO PARANAENSE I 25 TORCEDOR MASC",
  "CAMISA ATLETICO PARANAENSE II 25 TORCEDOR FEM",
  "CAMISA BAHIA I 25 TORCEDOR MASC",
  "CAMISA BARCELONA I 26 TORCEDOR MASC",
  "CAMISA BARCELONA II 26 TORCEDOR FEM",
  "CAMISA BOCA JRS I 25 TORCEDOR MASC",
  "CAMISA BOTAFOGO I 25 TORCEDOR MASC",
  "CAMISA BOTAFOGO II 25 TORCEDOR FEM",
  "CAMISA CORINTHIANS I 25 TORCEDOR FEM",
  "CAMISA CORINTHIANS I 25 TORCEDOR JUV",
  "CAMISA CORINTHIANS I 25 TORCEDOR MASC",
  "CAMISA CORINTHIANS II 25 TORCEDOR JUV",
  "CAMISA CORINTHIANS II 25 TORCEDOR MASC",
  "CAMISA CORINTHIANS TREINO 26 MASC",
  "CAMISA CRUZEIRO I 25 TORCEDOR MASC",
  "CAMISA CRUZEIRO II 25 TORCEDOR FEM",
  "CAMISA FLAMENGO I 26 TORCEDOR FEM",
  "CAMISA FLAMENGO I 26 TORCEDOR INF",
  "CAMISA FLAMENGO I 26 TORCEDOR MASC",
  "CAMISA FLAMENGO II 25 TORCEDOR MASC",
  "CAMISA FLUMINENSE I 25 TORCEDOR MASC",
  "CAMISA FLUMINENSE II 25 TORCEDOR FEM",
  "CAMISA GREMIO I 25 TORCEDOR MASC",
  "CAMISA GREMIO II 25 TORCEDOR FEM",
  "CAMISA INTERNACIONAL I 25 TORCEDOR MASC",
  "CAMISA INTERNACIONAL II 25 TORCEDOR FEM",
  "CAMISA JUVENTUS I 26 TORCEDOR MASC",
  "CAMISA MANCHESTER CITY I 26 TORCEDOR MASC",
  "CAMISA MILAN I 26 TORCEDOR MASC",
  "CAMISA NIKE DRY PARK VII MASC",
  "CAMISA PALMEIRAS I 25 TORCEDOR MASC",
  "CAMISA PALMEIRAS II 25 TORCEDOR FEM",
  "CAMISA PALMEIRAS TREINO 26 MASC",
  "CAMISA PSG I 26 TORCEDOR MASC",
  "CAMISA REAL MADRID III 25 TORCEDOR MASC",
  "CAMISA SANTOS I 25 TORCEDOR MASC",
  "CAMISA SAO PAULO I 25 TORCEDOR MASC",
  "CAMISA SAO PAULO II 25 TORCEDOR FEM",
  "CAMISA VASCO I 26 TORCEDOR MASC",
  "CAMISETA ADIDAS 3 STRIPES",
  "CAMISETA ADIDAS ESSENTIALS 3 LISTRAS",
  "CAMISETA ADIDAS ESSENTIALS LOGO",
  "CAMISETA ADIDAS OWN THE RUN 3 LISTRAS",
  "CAMISETA ADIDAS SMALL LOGO",
  "CAMISETA ADIDAS TREINO BASICA",
  "CAMISETA ADIDAS WE BASE 3S",
  "CAMISETA ADIDAS WE BASE T",
  "CAMISETA MANGA CURTA NSW ESSNTL IC NIKE",
  "CAMISETA MANGA CURTA NSW TEE CLUB NIKE F",
  "CAMISETA NIKE DF M180RLGD RE MASC",
  "CAMISETA NIKE DF PARK VII JS INF",
  "CAMISETA NIKE ICON FUTURA",
  "CAMISETA NIKE M DF TEE RUN SWOOSH",
  "CAMISETA NIKE M NK DF HBR",
  "CAMISETA NIKE MANGA CURTA TEE RLGD LB",
  "CAMISETA NIKE MC K DF LGD SWO",
  "CAMISETA NIKE SB TEE LOGO",
  "CAMISETA NIKE TEE JUST DO I",
  "CAMISETA NIKE UV MILER SS MASC",
  "CHINELO ADIDAS ADILETTE AQUA",
  "CHINELO NIKE VICTORI ONE SLIDE",
  "CHUTEIRA CAMPO F50 LEAGUE",
  "CHUTEIRA CAMPO PREDATOR CLUB",
  "CHUTEIRA FUT NIKE JR SUPERFLY 10 CLUB IC",
  "CHUTEIRA FUTSAL F50 CLUB INFANTIL",
  "CHUTEIRA FUTSAL NIKE JR LEGEND 10 CLUB IC",
  "CHUTEIRA FUTSAL ZOOM VAPOR 16 ACADEMY KM",
  "CHUTEIRA NIKE BECO 2 646433",
  "CHUTEIRA NIKE JR VAPOR 16 CLUB IC",
  "CHUTEIRA NIKE JR VAPOR 16 CLUB TF",
  "CHUTEIRA NIKE VAPOR 16 CLUB TF",
  "CHUTEIRA NIKE ZOOM VAPOR 16 ACADEMY KM",
  "CHUTEIRA NIKE ZOOM VAPOR 16 ACADEMY TF",
  "CHUTEIRA RABISCO JR",
  "CHUTEIRA SOCIETY ADIDAS PREDATOR LEAGUE",
  "CHUTEIRA SOCIETY F50 CLUB",
  "CHUTEIRA SOCIETY F50 LEAGUE MID",
  "CHUTEIRA SOCIETY NIKE BECO",
  "CHUTEIRA SOCIETY PREDATOR CLUB",
  "KIT MEIA ADIDAS CANO ALTO 3 LISTRAS",
  "KIT MEIA NIKE EVERYDAY CUSH LOW 3P",
  "LEGGING NIKE W DF ONE HR TIGHT USEAM",
  "MALA ADIDAS DUFFEL LINEAR PEQUENA",
  "MALA NIKE BRSLA M DUFF 9 5 60L",
  "MALA NIKE BRSLA S DUFF 9 5 41L",
  "MEIA NIKE ELITE LIGHTWEIGHT 3P",
  "MEIA NIKE EVERYDAY CUSH ANKLE 3P",
  "MEIA NIKE EVERYDAY CUSH CREW 3P",
  "MEIA NIKE NSW EVERYDAY ESSENTIAL CREW 3",
  "MINI BOLA ADIDAS WC",
  "MOCHILA ADIDAS CLASSICA TREINO 3 LISTRAS",
  "MOCHILA ADIDAS CL TAPE BPK U",
  "MOCHILA ADIDAS LINEAR",
  "MOCHILA ADIDAS POWER VIII",
  "MOCHILA NIKE BRSLA JDI MINI BKPK",
  "MOCHILA NIKE BRSLA M BKPK 9 5 24L",
  "MOCHILA NIKE CLASSIC YA BA5928",
  "MOCHILA NIKE ELEMENTAL BKPK HBR",
  "MOCHILA NIKE HERITAGE UNI",
  "REGATA NIKE DF RLGD SL MASC",
  "SHORT ADIDAS BIG LOGO",
  "SHORT ADIDAS CHELSEA 3 STRIPES",
  "SHORT ADIDAS CHELSEA SMALL LOGO",
  "SHORT NIKE M DF CHALLENGER 7BF SHORT",
  "SHORTS NIKE DF CHALLENGER 7UL MASC",
  "SHORTS NIKE M DF CHALLENGER 5BF",
  "SHORTS NIKE TOTALITY KNIT 7IN UL MASC",
  "SHORTS NIKE TOTALITY KNIT 9 IN UL MASC",
  "SUNGA ADIDAS 3 LISTRAS",
  "SUNGA ADIDAS 3S BOXER",
  "TENIS ADIDAS ADIZERO ADIOS PRO 4 MASC",
  "TENIS ADIDAS ADIZERO DRIVE FEM",
  "TENIS ADIDAS ADIZERO DRIVE MASC",
  "TENIS ADIDAS ADIZERO EVO SL FEM",
  "TENIS ADIDAS ADIZERO EVO SL MASC",
  "TENIS ADIDAS ADVANTAGE BASE 2 0",
  "TENIS ADIDAS ADVANTAGE BASE 2 0 JUNIOR",
  "TENIS ADIDAS ADVANTAGE BASE FEM",
  "TENIS ADIDAS ADVANTAGE BASE MASC",
  "TENIS ADIDAS ASTRASTAR",
  "TENIS ADIDAS BOOST RUN FEM",
  "TENIS ADIDAS BOOST RUN MASC",
  "TENIS ADIDAS COURTBLOCK FEM",
  "TENIS ADIDAS DROPSET 4 POWER TRAINER M",
  "TENIS ADIDAS DURAMO RC 2 FEM",
  "TENIS ADIDAS DURAMO RC 2 MASC",
  "TENIS ADIDAS DURAMO SL2 FEM",
  "TENIS ADIDAS DURAMO SL2 MASC",
  "TENIS ADIDAS DURAMO SPEED 2 MASC",
  "TENIS ADIDAS GRAND COURT 2 0 FEM",
  "TENIS ADIDAS GRAND COURT 2 0 FEMININO",
  "TENIS ADIDAS GRAND COURT 2 0 M",
  "TENIS ADIDAS GRAND COURT BASE 2 0 MASC",
  "TENIS ADIDAS GRAND COURT KIDS INF",
  "TENIS ADIDAS LITE RACER 4 0",
  "TENIS ADIDAS LITE RACER 4 0 FEM",
  "TENIS ADIDAS LITE RACER 4 0 MASC",
  "TENIS ADIDAS RESPONSE RUNNER",
  "TENIS ADIDAS RUN 70S 20 MASC",
  "TENIS ADIDAS RUN FALCON",
  "TENIS ADIDAS RUN FALCON KIDS",
  "TENIS ADIDAS RUNFALCON 5 FEM",
  "TENIS ADIDAS RUNFALCON 5 MASC",
  "TENIS ADIDAS STREETALK FEM",
  "TENIS ADIDAS STREETTALK MASC",
  "TENIS ADIDAS SUPERNOVA RISE 3 MERCEDES",
  "TENIS ADIDAS TENSAUR",
  "TENIS ADIDAS TENSAUR RUN",
  "TENIS ADIDAS TENSAUR SPORT 3 0 CF K",
  "TENIS ADIDAS ULTRABOOST 5 FEM",
  "TENIS ADIDAS ULTRARUN 5 FEM",
  "TENIS ADIDAS ULTRARUN 5 MASC",
  "TENIS ADIDAS ULTIMASHOW 2 0",
  "TENIS ADIDAS VL COURT",
  "TENIS ADIDAS VL COURT BOLD FEM",
  "TENIS ADIDAS VS PACE 2 0",
  "TENIS BQT ADIDAS OWNTHEGAME",
  "TENIS BQT NIKE G T HUSTLE ACADEMY",
  "TENIS NIKE AIR MAX ALPHA TRAINER 6 MASC",
  "TENIS NIKE AIR MAX EXCEE 365 MASC",
  "TENIS NIKE AIR MAX EXCEE MASC",
  "TENIS NIKE AIR MAX FIRE",
  "TENIS NIKE AIR MAX NUAXIS MASC",
  "TENIS NIKE AIR WINFLO 11 FEM",
  "TENIS NIKE AIR WINFLO 11 MASC",
  "TENIS NIKE AIR ZOOM PEGASUS 41 FEM",
  "TENIS NIKE AIR ZOOM PEGASUS 41 MASC",
  "TENIS NIKE AIR ZOOM RIVAL FLY 4 MASC",
  "TENIS NIKE BIG LOW",
  "TENIS NIKE COSMIC RUNNER",
  "TENIS NIKE COURT BOROUGH LOW RECRAFT B",
  "TENIS NIKE COURT BOROUGH LOW RECRAFT BG",
  "TENIS NIKE COURT VISION ALTA LTR FEM",
  "TENIS NIKE COURT VISION LO",
  "TENIS NIKE COURT VISION LO MASC",
  "TENIS NIKE COURT VISION LO NN FEM",
  "TENIS NIKE COURT VISION LO TRK32",
  "TENIS NIKE COURT VISION LOW NEXT NATURE",
  "TENIS NIKE COURT VISION MID MASC",
  "TENIS NIKE DOWNSHIFTER 13 FEM",
  "TENIS NIKE DOWNSHIFTER 13 MASC",
  "TENIS NIKE FLEX RUNNER 3 PS",
  "TENIS NIKE FLEX RUNNER 4 GS",
  "TENIS NIKE FLEX RUNNER 4 PS",
  "TENIS NIKE FLEX TRAIN FEM",
  "TENIS NIKE FLEX TRAIN MASC",
  "TENIS NIKE FREE METCON 6 MASC",
  "TENIS NIKE FULL FORCE LO MASC",
  "TENIS NIKE FULL FORCE MASC",
  "TENIS NIKE G T JUMP ACADEMY",
  "TENIS NIKE GAMMA FORCE FEM",
  "TENIS NIKE JOURNEY FEM",
  "TENIS NIKE JOURNEY R MASC",
  "TENIS NIKE PEGASUS PLUS MASC",
  "TENIS NIKE PEGASUS PREMIUM MASC",
  "TENIS NIKE PEGASUS TURBO 4 MASC",
  "TENIS NIKE PRECISION VII",
  "TENIS NIKE QUEST 6 FEM",
  "TENIS NIKE QUEST 6 MASC",
  "TENIS NIKE REVOLUTION 7 GS",
  "TENIS NIKE REVOLUTION 7 PSV",
  "TENIS NIKE REVOLUTION 8 FEM",
  "TENIS NIKE REVOLUTION 8 MASC",
  "TENIS NIKE RUN DEFY FEM",
  "TENIS NIKE RUN DEFY MASC",
  "TENIS NIKE SB FORCE 58 MASC",
  "TENIS NIKE TERRA MANTA",
  "TENIS NIKE V5 RNR",
  "TENIS NIKE VOMERO 18 FEM",
  "TENIS NIKE VOMERO 18 MASC",
  "TENIS NIKE VOMERO PLUS FEM",
  "TENIS NIKE VOMERO PLUS MASC",
  "TENIS NIKE ZOOM FLY 6 MASC",
  "TOP ADIDAS ESSENTIALS SUPORTE LEVE"
];

export const MODELO_OPTIONS: string[] = MODELO_OPTIONS_RAW.map(
  formatModeloListEntry,
);

// --- MOCK DATA FOR METRICS ---

export const MOCK_LUCRO_BRUTO = [
  1183011.46, 970809.83, 990638.05, 1072360.89, 960070.61, 893425.80, 854714.00, 824552.13,
  814409.13, 772033.57, 917052.54, 746562.14, 738470.01, 696103.03, 683051.54, 731695.71,
  658269.04, 658260.85, 665300.03, 654271.83, 570075.77, 632588.21, 571883.25, 665052.99,
  574445.31, 550761.77, 530612.42, 548591.05, 569889.34, 589094.09, 562975.85, 540568.14,
  546420.61, 510848.69, 473306.78, 456541.16, 473540.21, 512595.56, 467456.51, 446428.94,
  476398.97, 474502.69, 451020.21, 481348.17, 430916.73, 458235.89, 444397.65, 430426.55,
  415085.91, 417911.64, 436369.99, 484361.62, 440134.02, 362948.05, 396036.50, 384804.20,
  387199.60, 378136.64, 357368.80, 357622.37, 361104.02, 339065.73, 381153.14, 331810.60,
  347896.74, 356242.19, 336489.22, 350602.02, 351757.33, 330724.43, 335019.59, 325583.24,
  305358.56, 317789.99, 314512.04, 326082.07, 340456.60, 314194.99, 295515.26, 325750.81,
  300986.18, 292445.43, 310402.28, 278468.31, 299321.46, 300918.10, 285564.84, 289948.60,
  279082.42, 130796.61, 284309.79, 292357.72, 301300.86, 294878.61, 285801.66, 271515.77,
  297112.02, 292714.58, 289073.19, 275043.85, 269321.81, 275403.45, 287322.28, 288279.62,
  271687.66, 260267.57, 264555.21, 289136.53, 273985.95, 268511.31, 245103.75, 262114.66,
  247655.81, 257949.75, 257194.51, 270394.52, 239157.47, 242115.26, 230533.78, 262718.07,
  248394.57, 260044.31, 245295.10, 249802.02, 236276.74, 219126.41, 236647.70, 239519.93,
  252793.25, 227407.01, 235476.99, 245272.46, 224050.33, 231277.32, 228118.75, 250302.53,
  242367.53, 252994.30, 241465.79, 234297.33, 221278.32, 240318.61, 236835.47, 237727.29,
  241493.15, 204093.69, 232380.23, 208244.31, 227943.43, 231480.25, 231465.91, 219980.16,
  223960.38, 221204.50, 196846.65, 199459.09, 197479.25, 219495.89, 217893.44, 202095.72,
  216073.83, 194929.06, 190793.54, 194871.33, 201772.02, 202144.73, 200787.10, 174875.45,
  194944.25, 200329.52, 187722.93, 184706.05, 186675.61, 192006.94, 173874.31, 188823.54,
  190123.15, 186345.47, 190898.70, 185781.04, 169298.33, 170127.86, 183839.65, 188030.29,
  181224.83, 180781.64, 178826.70, 179115.96, 179846.75, 147936.88, 174667.18, 174889.72,
  169918.68, 154920.34, 145460.69, 160843.56, 161742.53, 157315.04, 159904.41, 142711.08,
  157221.78, 154233.54, 155675.93, 159910.62, 149273.56, 132088.96, 142076.45, 131242.12,
  125125.97, 142236.48, 123674.54, 131749.25, 134915.59, 133188.16, 124136.31, 127442.95,
  115215.90, 120312.58, 113864.40, 101364.12, 115284.18, 105526.64, 110447.29, 111334.45,
  98321.22, 91639.47, 84828.10, 76632.71, 54489.46, 2366.02
];

export const MOCK_ROB = [
  3332424.42, 2821156.86, 2777572.44, 2739244.38, 2700280.91, 2527625.48, 2474234.97, 2330587.03,
  2201190.13, 2137020.74, 2111203.33, 2095130.28, 2038559.01, 1998734.30, 1975351.74, 376722.12,
  376251.66, 372165.18, 368939.56, 363957.39, 359847.12, 354093.16, 338163.75, 318804.08, 318062.03,
  315749.37, 314017.49, 308840.70, 306674.19, 296640.18, 294934.62, 260872.75, 248407.69, 231941.80,
  203454.76, 149620.64, 6849.46
];

export const MOCK_CMV = [
  1647668.39, 1064259.98, 1027235.27, 990890.94, 1025132.45, 941829.17, 930727.77, 830950.24,
  674534.45, 662001.71, 655706.89, 633892.84, 626952.40, 597709.49, 633828.25, 793205.01, 588748.23,
  550051.33, 576905.21, 555361.20, 568389.50, 558926.69, 524626.69, 511116.85, 494836.33, 505876.02,
  493497.95, 122266.17, 121925.07, 116500.90, 125542.79, 111498.52, 110417.05, 98242.40, 94339.76,
  85494.26, 77053.08
];

export const MOCK_MARGEM = [
  0.4185, 0.4778, 0.4916, 0.5204, 0.4840, 0.4877, 0.4794, 0.4989, 0.4943, 0.4420, 0.5442, 0.4855, 0.4857,
  0.4916, 0.4803, 0.4971, 0.4547, 0.4982, 0.4577, 0.4985, 0.5031, 0.5011, 0.4937, 0.4987, 0.4992, 0.4880,
  0.5123, 0.4813, 0.4870, 0.4047, 0.4838, 0.4156, 0.5039, 0.5007, 0.5133, 0.4922, 0.4861
];

/** Fator entre 0,80 e 0,90 (10–20% a menos), determinístico por índice. */
function mockFactor10to20PctLess(i: number, salt: number): number {
  const n = Math.abs((i * 7919 + salt) % 11);
  return 0.8 + n / 100;
}

/** CMV Comercial (PRODUTO): base MOCK_CMV com redução de 10–20% por posição. */
export const MOCK_CMV_COMERCIAL = MOCK_CMV.map((v, i) => {
  const f = mockFactor10to20PctLess(i, Math.floor(v) % 9973);
  return Math.round(v * f * 100) / 100;
});

/** Margem Líquida (PRODUTO): base MOCK_MARGEM (MB), 10–20% a menos por posição. */
export const MOCK_MARGEM_LIQUIDA = MOCK_MARGEM.map((m, i) => {
  const f = mockFactor10to20PctLess(i, Math.floor(m * 10000) % 9973);
  const out = m * f;
  return Math.min(0.999, Math.max(0.01, Math.round(out * 10000) / 10000));
});

export const MOCK_QTD_VENDA = [
  18354, 16881, 17326, 15436, 13342, 15840, 15502, 14551, 12098, 13826, 13401, 12219, 11057,
  12393, 12713, 10779, 11677, 11164, 10774, 11307, 12020, 10369, 10726, 11157, 11102, 9551,
  2436, 2620, 2504, 2645, 2667, 2410, 2505, 2748, 2575, 2557, 2478
];

/** Qtd de itens vendidos (PRODUTO): proxy = Qtd Venda × (100% + 10% … 17%, por posição). */
export const MOCK_QTD_ITENS = MOCK_QTD_VENDA.map((q, i) => {
  const extraPct = 0.1 + ((i * 5) % 8) * 0.01;
  return Math.max(0, Math.round(q * (1 + extraPct)));
});

// ── Exposição de produtos (PRODUTO) — inteiros, grandeza alinhada aos exemplos do spec

/**
 * Totais de clicks em calçados (série legada única). Derivamos tênis vs chuteiras:
 * ~15% chuteiras (arredondado), o restante tênis; a soma por loja/posição coincide com o total.
 */
const MOCK_EXP_CALC_CLICKS_TOTALS = [
  420, 721, 545, 668, 545, 512, 598, 634, 702, 481, 390, 655, 720, 540, 660, 430, 745, 525, 675,
  530, 610, 688, 455, 700, 515, 580, 640, 695, 500, 600, 715, 535, 665, 440, 710, 470, 625, 690,
] as const;

const MOCK_EXP_CALC_CLICKS_CHUTEIRAS_RAW = MOCK_EXP_CALC_CLICKS_TOTALS.map((T) =>
  Math.round(0.15 * T),
);

/** Qtd de clicks — chuteiras (~15% do total histórico por posição). */
export const MOCK_EXP_CALC_CLICKS_CHUTEIRAS = [...MOCK_EXP_CALC_CLICKS_CHUTEIRAS_RAW];

/** Qtd de clicks — tênis (complemento do total histórico). */
export const MOCK_EXP_CALC_CLICKS_TENIS = MOCK_EXP_CALC_CLICKS_TOTALS.map(
  (T, i) => T - MOCK_EXP_CALC_CLICKS_CHUTEIRAS_RAW[i]!,
);

/** Qtd módulos checkstand por loja — valores entre 3 e 13 (mock). */
export const MOCK_EXP_CHECKSTAND_MODULOS = MOCK_EXP_CALC_CLICKS_TOTALS.map((_, i) =>
  3 + ((i * 17 + 11) % 11),
);

/** Qtd braços de exposição — ex.: 320, 465, 650… */
export const MOCK_EXP_VEST_BRACOS_ARARAS = [
  320, 465, 650, 487, 710, 340, 450, 620, 500, 690, 380, 470, 640, 495, 705, 315, 480, 655, 475,
  725, 360, 440, 625, 510, 680, 330, 460, 645, 490, 700, 350, 475, 635, 505, 715, 375, 455, 660,
];

/** Qtd mesas — ex.: 2, 4, 3, 1, 3 */
export const MOCK_EXP_VEST_MESAS = [
  2, 4, 3, 1, 3, 2, 2, 4, 1, 3, 2, 4, 3, 1, 4, 2, 3, 3, 1, 2, 4, 2, 3, 1, 5, 3, 2, 4, 1, 2, 3, 1,
];

/** Qtd braços de meias — ex.: 8, 10, 7, 6, 5 */
export const MOCK_EXP_MEIAS_BRACOS = [
  8, 10, 7, 6, 5, 6, 7, 8, 9, 10, 11, 5, 8, 7, 6, 10, 9, 7, 6, 5, 8, 10, 7, 6, 9, 7, 8, 6, 5, 10,
];

/** Qtd expositores de relógios — ex.: 1, 0, 0, 1, 2 */
export const MOCK_EXP_ACC_RELOGIOS = [
  1, 0, 0, 1, 2, 0, 1, 2, 0, 1, 1, 0, 0, 2, 1, 0, 1, 1, 0, 2, 0, 0, 1, 2, 1, 1, 0, 1, 0, 2, 0, 1,
];

/** Qtd expositores de óculos — ex.: 1, 0, 1, 0, 1 */
export const MOCK_EXP_ACC_OCULOS = [
  1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1,
];

/** Qtd cestos de bolas — ex.: 3, 2, 0, 1, 2 */
export const MOCK_EXP_CESTOS_BOLAS = [
  3, 2, 0, 1, 2, 0, 1, 2, 3, 4, 2, 3, 1, 0, 2, 3, 2, 1, 0, 1, 2, 3, 0, 2, 1, 2, 0, 3, 1, 2, 1, 0,
];

/** Qtd geladeiras — ex.: 1, 0, 0, 1, 0 */
export const MOCK_EXP_NUT_GELADEIRAS = [
  1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0,
];

export const MOCK_QTD_ESTOQUE = [
  10357, 11030, 10569, 11924, 4196, 7767, 7265, 10821, 9754, 13471, 13999, 10468, 6168, 10234,
  6847, 6581, 5398, 6001, 4679, 2025, 1497, 637, 1576, 2136, 880, 1352, 330, 1653, 524, 1802,
  4654, 1023, 1949, 2751, 872, 7862, 3895
];

export const MOCK_VLR_ESTOQUE = [
  1243680, 1325610, 1268280, 1430880, 503520, 932040, 871800, 1298520, 1170480, 1616520, 1679880,
  1256160, 740160, 1228080, 821640, 789720, 647760, 720120, 561480, 243000, 179640, 76440, 189120,
  256320, 105600, 162240, 39600, 198360, 62880, 216240, 558480, 122760, 233880, 330120, 104640,
  943440, 467400
];

export const MOCK_DEP = [
  69, 72, 59, 72, 70, 67, 70, 66, 77, 92, 123, 93, 74, 68, 69, 76, 69, 74, 67, 70, 79, 57,
  72, 86, 103, 96, 72, 84, 106, 78, 74, 62, 90, 77, 94, 104, 89
];

export const MOCK_TESTE = [
  10, 25, 18, 32, 14, 47, 21, 38, 29, 16, 42, 11, 35, 27, 19, 44, 23, 31, 15, 39, 26, 12,
  48, 20, 33, 17, 41, 24, 36, 13, 45, 22, 30, 28, 43, 37, 34
];

export const MOCK_DEF = [
  76.22, 83.77, 75.48, 80.72, 84.10, 81.49, 82.35, 89.88, 87.60, 101.79, 81.74, 91.19, 96.04,
  79.04, 99.31, 110.27, 118.02, 141.39, 93.77, 100.27, 141.03, 97.15, 85.78, 85.83, 108.22,
  92.94, 114.91, 136.92, 136.62, 139.10, 113.04, 173.81, 104.78, 133.52, 102.62, 119.48, 120.43
];

export const MOCK_LAST_ENTRY = [
  2, 5, 1, 0, 12, 4, 3, 15, 22, 8, 7, 30, 45, 60, 1, 0, 2, 9, 14, 21, 5, 3, 11, 18, 25, 6,
  4, 2, 1, 0, 8, 12, 20, 3, 5, 7, 10
];

export const MOCK_SSS = [
  0.1245, 0.0832, -0.0412, 0.1567, 0.0921, 0.1145, 0.0789, 0.0543, 0.1321, 0.1054,
  0.0876, 0.0432, 0.0211, -0.0123, 0.0567, 0.0890, 0.1234, 0.0678, 0.0456, 0.0321,
  0.0987, 0.1122, 0.0845, 0.0732, 0.0611, 0.0544, 0.0433, 0.0322, 0.0211, 0.0155,
  0.0877, 0.0933, 0.1044, 0.1155, 0.1266, 0.1377, 0.1488
];

// Giro de Estoque (Total de Vendas / Estoque Médio) - formato XX,X
export const MOCK_GIRO_ESTOQUE = [
  4.2, 3.8, 5.1, 4.7, 3.5, 4.0, 4.5, 4.3, 3.9, 4.6,
  5.2, 5.5, 5.8, 5.0, 4.4, 4.7, 5.3, 5.1, 4.2, 4.5,
  3.7, 4.1, 4.9, 4.6, 4.4, 4.0, 3.6, 3.8, 4.1, 4.4,
  4.7, 5.0, 5.3, 5.6, 5.9, 5.0, 4.5
];

// ──────────────────────────────────────────────────────────────
// Mock data for LOJA module metrics
// ──────────────────────────────────────────────────────────────

export const MOCK_VALOR_META = [
  285000, 275000, 290000, 280000, 265000, 270000, 285000, 275000, 260000, 280000,
  290000, 295000, 300000, 285000, 275000, 280000, 290000, 285000, 270000, 275000,
  265000, 270000, 285000, 280000, 275000, 270000, 260000, 265000, 270000, 275000,
  280000, 285000, 290000, 295000, 300000, 285000, 275000
];

/** Meta de venda mensal da loja (mock). Usada exclusivamente no % projeção de venda (mês vigente). */
export const MOCK_LOJA_META_MENSAL = [...MOCK_VALOR_META];

export const MOCK_DESVIO_META_R = [
  12500, -8200, 15300, -12400, 18700, 9300, -7800, 14200, -5600, 11800,
  -9100, 13400, -6700, 10200, 15800, -11300, 8900, 12100, -9400, 7600,
  -13200, 9800, 11400, -8700, 13900, 10500, -7200, 8300, 12600, -9900,
  11200, 14300, -8100, 9700, 13100, -10400, 12800
];

export const MOCK_DESVIO_META_P = [
  0.0439, -0.0298, 0.0528, -0.0443, 0.0706, 0.0344, -0.0274, 0.0516, -0.0215, 0.0421,
  -0.0314, 0.0454, -0.0223, 0.0358, 0.0575, -0.0404, 0.0307, 0.0425, -0.0348, 0.0276,
  -0.0498, 0.0363, 0.0400, -0.0311, 0.0505, 0.0389, -0.0277, 0.0313, 0.0467, -0.0360,
  0.0400, 0.0502, -0.0279, 0.0329, 0.0437, -0.0365, 0.0465
];

/** Conversão (LOJA): 9%–14% (razão 0,09–0,14); exibição com duas casas decimais (`format: 'percent'`). */
export const MOCK_CONVERSAO = Array.from({ length: 37 }, (_, i) => {
  const u = ((i * 73 + 19) % 1001) / 1000;
  return Math.round((0.09 + u * 0.05) * 10000) / 10000;
});

/** Conversão Vendex (LOJA): 35%–49% com variação; exibição com duas casas decimais (`format: 'percent'`). */
export const MOCK_CONVERSAO_VENDEX = Array.from({ length: 37 }, (_, i) => {
  const u = ((i * 97 + 31) % 1401) / 1400;
  return Math.round((0.35 + u * 0.14) * 10000) / 10000;
});

export const MOCK_TKM = [
  156.32, 149.87, 162.45, 158.23, 147.56, 153.89, 160.12, 155.67, 149.34, 157.89,
  163.45, 166.78, 170.23, 162.56, 156.89, 159.34, 165.12, 162.45, 154.23, 157.67,
  151.34, 154.89, 162.78, 159.45, 157.12, 154.56, 148.89, 151.67, 154.34, 157.23,
  159.89, 162.56, 165.34, 168.12, 171.45, 162.89, 157.34
];

// Qtd de Vendas (LOJA) — proxy coerente: ROB / Ticket Médio (inteiro)
export const MOCK_QTD_VENDAS_LOJA = MOCK_ROB.map((rob, idx) =>
  Math.max(0, Math.round(rob / Math.max(MOCK_TKM[idx % MOCK_TKM.length], 1))),
);

/** Qtd de itens vendidos (LOJA): proxy = Qtd de Vendas × (100% + 10% … 17%, por posição). */
export const MOCK_QTD_ITENS_LOJA = MOCK_QTD_VENDAS_LOJA.map((q, i) => {
  const extraPct = 0.1 + ((i * 5) % 8) * 0.01;
  return Math.max(0, Math.round(q * (1 + extraPct)));
});

export const MOCK_QTD_TICKETS = [
  1523, 1467, 1598, 1545, 1423, 1489, 1567, 1534, 1456, 1512,
  1589, 1634, 1678, 1612, 1556, 1587, 1645, 1598, 1501, 1545,
  1434, 1478, 1601, 1567, 1534, 1467, 1398, 1445, 1489, 1534,
  1578, 1623, 1667, 1712, 1756, 1623, 1567
];

export const MOCK_IPC = [
  3.24, 3.18, 3.31, 3.27, 3.15, 3.21, 3.29, 3.24, 3.17, 3.26,
  3.32, 3.35, 3.38, 3.31, 3.24, 3.27, 3.33, 3.31, 3.22, 3.25,
  3.18, 3.21, 3.29, 3.27, 3.25, 3.21, 3.16, 3.19, 3.22, 3.25,
  3.28, 3.31, 3.34, 3.37, 3.40, 3.31, 3.25
];

export const MOCK_CUPONS_MISTOS = [
  0.1823, 0.1756, 0.1892, 0.1834, 0.1701, 0.1778, 0.1845, 0.1789, 0.1723, 0.1812,
  0.1867, 0.1901, 0.1934, 0.1878, 0.1823, 0.1856, 0.1889, 0.1867, 0.1789, 0.1823,
  0.1745, 0.1778, 0.1845, 0.1823, 0.1801, 0.1767, 0.1712, 0.1745, 0.1778, 0.1812,
  0.1845, 0.1878, 0.1901, 0.1923, 0.1945, 0.1878, 0.1834
];

export const MOCK_NPS_VENDEDOR = [
  0.782, 0.756, 0.812, 0.789, 0.734, 0.767, 0.801, 0.778, 0.745, 0.790,
  0.823, 0.845, 0.867, 0.834, 0.801, 0.823, 0.856, 0.834, 0.778, 0.801,
  0.756, 0.778, 0.812, 0.789, 0.767, 0.745, 0.723, 0.745, 0.767, 0.790,
  0.812, 0.834, 0.856, 0.878, 0.890, 0.834, 0.789
];

export const MOCK_ENC_EXPRESSA = [
  0.6734, 0.6589, 0.6845, 0.6712, 0.6478, 0.6623, 0.6789, 0.6656, 0.6534, 0.6701,
  0.6867, 0.6923, 0.6978, 0.6890, 0.6801, 0.6845, 0.6912, 0.6867, 0.6734, 0.6789,
  0.6623, 0.6678, 0.6812, 0.6756, 0.6701, 0.6645, 0.6567, 0.6612, 0.6667, 0.6723,
  0.6778, 0.6834, 0.6889, 0.6934, 0.6978, 0.6890, 0.6756
];

export const MOCK_VLR_PLANO = [
  245000, 238000, 252000, 248000, 235000, 241000, 249000, 246000, 239000, 244000,
  250000, 256000, 262000, 258000, 254000, 250000, 257000, 253000, 247000, 251000,
  243000, 245000, 252000, 249000, 246000, 242000, 238000, 240000, 244000, 248000,
  252000, 256000, 260000, 264000, 268000, 255000, 247000
];

export const MOCK_QTD_PLANO = [
  1850, 1790, 1920, 1870, 1760, 1820, 1880, 1850, 1800, 1840,
  1890, 1940, 1990, 1960, 1930, 1890, 1950, 1920, 1870, 1900,
  1830, 1850, 1910, 1880, 1860, 1820, 1790, 1810, 1840, 1870,
  1900, 1930, 1960, 1990, 2020, 1930, 1870
];

export const MOCK_VLR_TARGET = [
  285000, 278000, 292000, 288000, 275000, 281000, 289000, 286000, 279000, 284000,
  290000, 296000, 302000, 298000, 294000, 290000, 297000, 293000, 287000, 291000,
  283000, 285000, 292000, 289000, 286000, 282000, 278000, 280000, 284000, 288000,
  292000, 296000, 300000, 304000, 308000, 295000, 287000
];

export const MOCK_QTD_TARGET = [
  2150, 2090, 2220, 2170, 2060, 2120, 2180, 2150, 2100, 2140,
  2190, 2240, 2290, 2260, 2230, 2190, 2250, 2220, 2170, 2200,
  2130, 2150, 2210, 2180, 2160, 2120, 2090, 2110, 2140, 2170,
  2200, 2230, 2260, 2290, 2320, 2230, 2170
];

// Desvio Plano (diferença entre realizado e plano)
export const MOCK_QTD_DESVIO_PLANO = [
  -120, -95, 80, 45, -110, -85, 95, 70, -105, -90,
  110, 125, 135, 120, 105, 90, 130, 115, -95, -80,
  -105, -90, 105, 95, 85, -95, -110, -100, -85, -70,
  90, 105, 120, 135, 150, 105, -95
];

export const MOCK_VLR_DESVIO_PLANO = [
  -15000, -12000, 10000, 6000, -14000, -11000, 12000, 9000, -13000, -11500,
  14000, 16000, 17000, 15000, 13000, 11000, 16500, 14500, -12000, -10000,
  -13000, -11000, 13000, 12000, 11000, -12000, -14000, -12500, -10500, -8500,
  11000, 13000, 15000, 17000, 19000, 13000, -12000
];

// Desvio Target (diferença entre realizado e target)
export const MOCK_QTD_DESVIO_TARGET = [
  -320, -295, -120, -155, -310, -285, -105, -80, -305, -290,
  -90, -75, -65, -80, -95, -110, -70, -85, -295, -280,
  -305, -290, -95, -105, -115, -295, -310, -300, -285, -270,
  -110, -95, -80, -65, -50, -95, -295
];

export const MOCK_VLR_DESVIO_TARGET = [
  -55000, -52000, -22000, -28000, -54000, -51000, -18000, -14000, -53000, -51500,
  -16000, -14000, -13000, -14500, -16000, -21000, -13500, -15500, -52000, -50000,
  -53000, -51000, -17000, -19000, -21000, -52000, -54000, -52500, -50500, -48500,
  -21000, -19000, -17000, -15000, -13000, -19000, -52000
];

// ══════════════════════════════════════════════════════════════
// Mock data — Módulo INDICADORES
// Prefixo MOCK_IND_ em todos os arrays para isolamento total.
// Valores calibrados nos ranges reais de operação de lojas.
//
// Para alterar dados de uma métrica: edite apenas o array abaixo.
// Para adicionar métrica: crie novo array seguindo o padrão.
// Mantenha 37 valores por array (mesma quantidade dos outros módulos).
// ══════════════════════════════════════════════════════════════

// TKM — Ticket Médio | integer | range: R$ 275–325
export const MOCK_IND_TKM = [
  295, 311, 299, 284, 287, 302, 318, 294, 276, 308,
  321, 315, 289, 297, 305, 312, 288, 301, 319, 295,
  283, 291, 307, 298, 286, 309, 316, 293, 279, 303,
  311, 299, 287, 315, 302, 294, 308,
];

// PMI — Preço Médio de Item | integer | range: R$ 130–160
export const MOCK_IND_PMI = [
  137, 145, 139, 148, 152, 141, 149, 136, 153, 144,
  138, 147, 151, 143, 150, 146, 140, 154, 137, 142,
  148, 153, 139, 145, 141, 149, 136, 152, 144, 138,
  147, 151, 143, 150, 146, 140, 154,
];

// IPC — Itens por Cliente | decimal 2 casas | range: 1,90–2,20
export const MOCK_IND_IPC = [
  1.96, 1.98, 2.01, 2.09, 2.13, 2.05, 1.94, 2.11, 2.08, 2.03,
  1.97, 2.07, 2.15, 2.02, 1.99, 2.06, 2.12, 1.95, 2.04, 2.10,
  2.08, 2.01, 1.97, 2.09, 2.14, 2.03, 1.96, 2.07, 2.11, 2.05,
  1.98, 2.06, 2.13, 2.02, 2.09, 1.95, 2.04,
];

// Paridade — Meias/Calçados | decimal 2 casas | range: 0,35–0,55
export const MOCK_IND_PARIDADE = [
  0.38, 0.42, 0.47, 0.51, 0.52, 0.44, 0.39, 0.49, 0.53, 0.41,
  0.46, 0.50, 0.55, 0.43, 0.48, 0.52, 0.40, 0.45, 0.54, 0.42,
  0.37, 0.46, 0.51, 0.47, 0.53, 0.44, 0.39, 0.48, 0.52, 0.41,
  0.45, 0.50, 0.55, 0.43, 0.49, 0.38, 0.47,
];

// Cupons Mistos — Calçado + Autosserviço | percent 2 casas | range: 21%–30%
export const MOCK_IND_CUPONS_MISTOS = [
  0.2110, 0.2246, 0.2954, 0.2876, 0.2645, 0.2312, 0.2178, 0.2834, 0.2567, 0.2423,
  0.2789, 0.2634, 0.2901, 0.2456, 0.2712, 0.2345, 0.2589, 0.2867, 0.2234, 0.2678,
  0.2512, 0.2789, 0.2134, 0.2956, 0.2401, 0.2678, 0.2923, 0.2345, 0.2812, 0.2567,
  0.2234, 0.2789, 0.2456, 0.2901, 0.2678, 0.2123, 0.2834,
];

// Fluxo — Pessoas entrantes | integer | range: 900–2.200
export const MOCK_IND_FLUXO = [
  1278, 1576,  987, 2126, 1865, 1423, 1089, 1734, 1956, 1312,
  1678, 2034, 1456, 1823, 1145, 1967, 2145, 1234, 1789, 1534,
  1089, 1867, 2213, 1345, 1678, 1934, 1123, 1789, 2056, 1412,
  1867, 2134, 1345, 1689, 1923, 1234, 1756,
];

// PMR — Prazo Médio de Recebimento | integer (dias) | range: 45–65
export const MOCK_IND_PMR = [
  49, 53, 54, 57, 61, 52, 48, 59, 63, 51,
  56, 60, 64, 50, 55, 58, 47, 53, 62, 49,
  54, 59, 65, 52, 48, 57, 61, 53, 50, 56,
  60, 63, 51, 55, 58, 47, 54,
];

// NPS — Satisfação do cliente | percent 1 casa | range: 85%–95%
export const MOCK_IND_NPS = [
  0.881, 0.897, 0.884, 0.937, 0.941, 0.912, 0.868, 0.925, 0.948, 0.893,
  0.876, 0.919, 0.932, 0.887, 0.904, 0.928, 0.861, 0.896, 0.943, 0.879,
  0.888, 0.921, 0.935, 0.906, 0.874, 0.917, 0.940, 0.892, 0.865, 0.910,
  0.924, 0.938, 0.884, 0.901, 0.929, 0.857, 0.913,
];

// Ruptura — Itens sem exposição | percent 2 casas | range: 1,5%–3,5%
export const MOCK_IND_RUPTURA = [
  0.0291, 0.0189, 0.0240, 0.0187, 0.0210, 0.0256, 0.0312, 0.0198, 0.0167, 0.0234,
  0.0278, 0.0205, 0.0163, 0.0249, 0.0221, 0.0195, 0.0318, 0.0243, 0.0174, 0.0267,
  0.0302, 0.0218, 0.0156, 0.0289, 0.0234, 0.0201, 0.0178, 0.0256, 0.0289, 0.0212,
  0.0234, 0.0198, 0.0267, 0.0145, 0.0289, 0.0323, 0.0201,
];

// EE — Encomenda Expressa | percent 1 casa | range: 2%–6%
export const MOCK_IND_EE = [
  0.0220, 0.0370, 0.0460, 0.0520, 0.0430, 0.0345, 0.0289, 0.0478, 0.0534, 0.0312,
  0.0267, 0.0412, 0.0489, 0.0356, 0.0423, 0.0501, 0.0278, 0.0389, 0.0512, 0.0334,
  0.0256, 0.0434, 0.0523, 0.0378, 0.0445, 0.0489, 0.0312, 0.0401, 0.0534, 0.0289,
  0.0367, 0.0456, 0.0523, 0.0345, 0.0412, 0.0278, 0.0489,
];

// PPA — Alteração de Preço | percent 1 casa | valores alinhados ao spec (71,2% … 82,9%)
export const MOCK_IND_PPA = [
  0.712, 0.695, 0.874, 0.958, 0.829,
  0.723, 0.688, 0.861, 0.942, 0.815, 0.701, 0.905, 0.967, 0.888, 0.734,
  0.756, 0.682, 0.891, 0.951, 0.803, 0.719, 0.866, 0.934, 0.812, 0.745,
  0.778, 0.691, 0.884, 0.919, 0.841, 0.706, 0.897, 0.963, 0.825, 0.738,
  0.764, 0.673, 0.852, 0.946, 0.818, 0.692, 0.871, 0.928, 0.836, 0.751,
];

// CKO Móvel — PDV móvel | percent 1 casa | range: 25%–32%
export const MOCK_IND_CKO_MOVEL = [
  0.2510, 0.2780, 0.3120, 0.2650, 0.2960, 0.2834, 0.2567, 0.3045, 0.2712, 0.2878,
  0.3156, 0.2623, 0.2945, 0.2789, 0.3078, 0.2534, 0.2867, 0.3134, 0.2678, 0.2912,
  0.3045, 0.2756, 0.2589, 0.3001, 0.2834, 0.2612, 0.2945, 0.3112, 0.2701, 0.2878,
  0.3034, 0.2767, 0.2601, 0.2923, 0.3089, 0.2645, 0.2956,
];

// Match de Preço % | percent 1 casa | valores alinhados ao spec (11,3% … 8,9%)
export const MOCK_IND_MATCH_PRECO = [
  0.113, 0.097, 0.132, 0.104, 0.089,
  0.121, 0.091, 0.128, 0.099, 0.086, 0.118, 0.094, 0.131, 0.102, 0.088,
  0.124, 0.096, 0.129, 0.107, 0.087, 0.116, 0.093, 0.134, 0.101, 0.09,
  0.122, 0.098, 0.127, 0.105, 0.085, 0.119, 0.092, 0.133, 0.103, 0.091,
  0.115, 0.095, 0.126, 0.106, 0.084, 0.117, 0.1, 0.13, 0.108, 0.083,
];

/**
 * Match de Preço valor (R$): mock = venda (ROB) da posição × fator entre 10% e 15% (determinístico).
 * PRODUTO (`match_preco_valor`), LOJA e INDICADORES (`ind_match_preco_valor`).
 */
export const MOCK_MATCH_PRECO_VALOR = MOCK_ROB.map((rob, i) => {
  const u = ((i * 73 + 41) % 501) / 500;
  const factor = 0.1 + u * 0.05;
  return Math.round(rob * factor * 100) / 100;
});

// Personalizações — qtd/mês por loja (referência 15–47); valor = qtd × R$ 17
const MOCK_IND_QTD_PERSONALIZACOES_RAW = [
  28, 19, 35, 42, 16, 31, 24, 38, 21, 45,
  18, 33, 27, 41, 22, 36, 29, 44, 17, 39,
  26, 32, 20, 46, 23, 34, 30, 40, 15, 37,
  25, 43, 28, 31, 24, 19, 35,
];
const CUSTO_PERSONALIZACAO_REF = 17;
export const MOCK_IND_QTD_PERSONALIZACOES = MOCK_IND_QTD_PERSONALIZACOES_RAW;
export const MOCK_IND_VLR_PERSONALIZACOES = MOCK_IND_QTD_PERSONALIZACOES_RAW.map(
  (q) => q * CUSTO_PERSONALIZACAO_REF,
);

// Conversão Click & Retire | percent 2 casas | range: 6%–10%
export const MOCK_IND_CONV_CLICK = [
  0.0672, 0.0789, 0.0935, 0.0851, 0.0880, 0.0712, 0.0645, 0.0878, 0.0934, 0.0756,
  0.0823, 0.0967, 0.0712, 0.0845, 0.0912, 0.0634, 0.0789, 0.0956, 0.0701, 0.0867,
  0.0923, 0.0678, 0.0812, 0.0945, 0.0756, 0.0889, 0.0623, 0.0801, 0.0934, 0.0712,
  0.0845, 0.0978, 0.0667, 0.0834, 0.0912, 0.0645, 0.0823,
];

export const METRIC_CONFIG: Record<string, { data: number[], format: 'currency' | 'percent' | 'percent0' | 'integer' | 'days' | 'decimal' | 'decimal1' | 'percent1' | 'variation' }> = {
  // Produto metrics
  'teste': { data: MOCK_TESTE, format: 'integer' },
  'venda': { data: MOCK_ROB, format: 'currency' },
  'sss': { data: MOCK_SSS, format: 'percent' },
  'cmv': { data: MOCK_CMV, format: 'currency' },
  'cmv_comercial': { data: MOCK_CMV_COMERCIAL, format: 'currency' },
  'margem': { data: MOCK_MARGEM, format: 'percent' },
  'margem_liquida': { data: MOCK_MARGEM_LIQUIDA, format: 'percent' },
  'lucro_bruto': { data: MOCK_LUCRO_BRUTO, format: 'currency' },
  'qtd_venda': { data: MOCK_QTD_VENDA, format: 'integer' },
  'qtd_itens': { data: MOCK_QTD_ITENS, format: 'integer' },
  'qtd_estoque': { data: MOCK_QTD_ESTOQUE, format: 'integer' },
  'vlr_estoque': { data: MOCK_VLR_ESTOQUE, format: 'currency' },
  'giro_estoque': { data: MOCK_GIRO_ESTOQUE, format: 'decimal1' },
  'dep': { data: MOCK_DEP, format: 'integer' },
  'def': { data: MOCK_DEF, format: 'currency' },
  'ultimo': { data: MOCK_LAST_ENTRY, format: 'days' },
  'vlr_plano': { data: MOCK_VLR_PLANO, format: 'currency' },
  'qtd_plano': { data: MOCK_QTD_PLANO, format: 'integer' },
  'qtd_desvio_plano': { data: MOCK_QTD_DESVIO_PLANO, format: 'variation' },
  'vlr_desvio_plano': { data: MOCK_VLR_DESVIO_PLANO, format: 'variation' },
  'vlr_target': { data: MOCK_VLR_TARGET, format: 'currency' },
  'qtd_target': { data: MOCK_QTD_TARGET, format: 'integer' },
  'qtd_desvio_target': { data: MOCK_QTD_DESVIO_TARGET, format: 'variation' },
  'vlr_desvio_target': { data: MOCK_VLR_DESVIO_TARGET, format: 'variation' },
  // PPA / Match (PRODUTO, LOJA — mesmos mocks que ind_*)
  'ppa': { data: MOCK_IND_PPA, format: 'percent1' },
  'match_preco': { data: MOCK_IND_MATCH_PRECO, format: 'percent1' },
  'match_preco_valor': { data: MOCK_MATCH_PRECO_VALOR, format: 'currency' },
  // Exposição de produtos (PRODUTO) — format integer (0 casas decimais)
  'exp_calc_clicks_tenis': { data: MOCK_EXP_CALC_CLICKS_TENIS, format: 'integer' },
  'exp_calc_clicks_chuteiras': { data: MOCK_EXP_CALC_CLICKS_CHUTEIRAS, format: 'integer' },
  'exp_vest_bracos_araras': { data: MOCK_EXP_VEST_BRACOS_ARARAS, format: 'integer' },
  'exp_vest_mesas': { data: MOCK_EXP_VEST_MESAS, format: 'integer' },
  'exp_meias_bracos': { data: MOCK_EXP_MEIAS_BRACOS, format: 'integer' },
  'exp_acc_torres_relogios': { data: MOCK_EXP_ACC_RELOGIOS, format: 'integer' },
  'exp_acc_torres_oculos': { data: MOCK_EXP_ACC_OCULOS, format: 'integer' },
  'exp_acc_cestos_bolas': { data: MOCK_EXP_CESTOS_BOLAS, format: 'integer' },
  'exp_checkstand_modulos': { data: MOCK_EXP_CHECKSTAND_MODULOS, format: 'integer' },
  'exp_nut_geladeiras': { data: MOCK_EXP_NUT_GELADEIRAS, format: 'integer' },
  // Loja metrics
  'rob': { data: MOCK_ROB, format: 'currency' },
  'qtd_vendas_loja': { data: MOCK_QTD_VENDAS_LOJA, format: 'integer' },
  'qtd_itens_loja': { data: MOCK_QTD_ITENS_LOJA, format: 'integer' },
  'valor_meta': { data: MOCK_VALOR_META, format: 'currency' },
  /** Meta mensal por loja (mock); não é métrica de UI — só denominador do % projeção mês vigente. */
  'meta_mensal_loja': { data: MOCK_LOJA_META_MENSAL, format: 'currency' },
  /** Valores calculados em AnalysisView (mock data length só para tipagem). */
  'vlr_projecao_venda': { data: [0], format: 'currency' },
  'pct_projecao_venda': { data: [0], format: 'percent1' },
  'desvio_meta_r': { data: MOCK_DESVIO_META_R, format: 'variation' },
  'desvio_meta_p': { data: MOCK_DESVIO_META_P, format: 'variation' },
  'conversao': { data: MOCK_CONVERSAO, format: 'percent' },
  'conversao_vendex': { data: MOCK_CONVERSAO_VENDEX, format: 'percent' },
  'tkm': { data: MOCK_TKM, format: 'currency' },
  'qtd_tickets': { data: MOCK_QTD_TICKETS, format: 'integer' },
  'ipc': { data: MOCK_IPC, format: 'decimal' },
  'cupons_mistos': { data: MOCK_CUPONS_MISTOS, format: 'percent' },
  'nps': { data: MOCK_NPS_VENDEDOR, format: 'percent1' },
  'enc_expressa': { data: MOCK_ENC_EXPRESSA, format: 'percent' },
  'margem_bruta': { data: MOCK_MARGEM, format: 'percent' },
  // ── Indicadores metrics ──────────────────────────────────
  // Prefixo ind_ — sem colisão com PRODUTO ou LOJA.
  // Formatos: `percent0` em formatMetricValue (percentagem sem decimais), se usado por alguma métrica.
  'ind_tkm':           { data: MOCK_IND_TKM,          format: 'integer'  },
  'ind_pmi':           { data: MOCK_IND_PMI,           format: 'integer'  },
  'ind_ipc':           { data: MOCK_IND_IPC,           format: 'decimal'  },
  'ind_paridade':      { data: MOCK_IND_PARIDADE,      format: 'decimal'  },
  'ind_cupons_mistos': { data: MOCK_IND_CUPONS_MISTOS, format: 'percent'  },
  'ind_fluxo':         { data: MOCK_IND_FLUXO,         format: 'integer'  },
  'ind_pmr':           { data: MOCK_IND_PMR,           format: 'integer'  },
  'ind_nps':           { data: MOCK_IND_NPS,           format: 'percent1' },
  'ind_ruptura':       { data: MOCK_IND_RUPTURA,       format: 'percent'  },
  'ind_ee':            { data: MOCK_IND_EE,            format: 'percent1' },
  'ind_ppa':           { data: MOCK_IND_PPA,           format: 'percent1' },
  'ind_cko_movel':     { data: MOCK_IND_CKO_MOVEL,     format: 'percent1' },
  'ind_match_preco':   { data: MOCK_IND_MATCH_PRECO,   format: 'percent1' },
  'ind_match_preco_valor': { data: MOCK_MATCH_PRECO_VALOR, format: 'currency' },
  'ind_qtd_personalizacoes': { data: MOCK_IND_QTD_PERSONALIZACOES, format: 'integer' },
  'ind_vlr_personalizacoes': { data: MOCK_IND_VLR_PERSONALIZACOES, format: 'currency' },
  'ind_conv_click':    { data: MOCK_IND_CONV_CLICK,    format: 'percent'  },
};

// Abreviações oficiais para cabeçalhos da tabela (fonte: data/metricNaming.ts)
export { METRIC_ABBREVIATIONS } from './data/metricNaming';

export const formatMetricValue = (
  value: number | null | undefined,
  format: string,
): string => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(value);
    case 'percent':
      return new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    case 'percent0':
      return new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    case 'percent1':
      return new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);
    case 'integer':
      return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(value);
    case 'decimal':
      return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    case 'decimal1':
      return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);
    case 'variation':
      // Para valores de variação (com cor positiva/negativa) - adiciona sinal
      const sign = value > 0 ? '+' : '';
      // Check if it's a percentage variation (small decimal) or currency variation (large number)
      if (Math.abs(value) < 1) {
        return sign + new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
      }
      return sign + new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(value);
    case 'days':
      return `${value} dias`;
    default:
      return value.toString();
  }
};

/** Razão em [0,1]: agregação por média (filhos / períodos), igual a `percent`. */
export function isPercentRatioAggregatedAverage(
  format: string | undefined,
): boolean {
  return format === 'percent' || format === 'percent0';
}
