/** Rede fixa na v.1: exibe logo Centauro, sem interação na UI. */
export const REDE_LOCKED_NETWORK = 'Centauro' as const;

/** Tooltip ao passar o mouse no botão informativo de REDE. */
export const REDE_HOVER_TOOLTIP = 'Rede';

export function isRedeStaticDisplayAttribute(attrId: string): boolean {
  return attrId === 'rede';
}
