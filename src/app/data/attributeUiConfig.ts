/** Rede v.1: única opção na UI, sempre selecionada e não removível. */
export const REDE_LOCKED_NETWORK = 'Centauro' as const;

export const REDE_UI_OPTIONS: readonly string[] = [REDE_LOCKED_NETWORK];

export function isRedeLockedAttribute(attrId: string): boolean {
  return attrId === 'rede';
}

/** Garante seleção fixa em Centauro (ignora limpar / desmarcar). */
export function sanitizeRedeSelection(values: string[]): string[] {
  return [REDE_LOCKED_NETWORK];
}
