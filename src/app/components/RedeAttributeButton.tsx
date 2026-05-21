import React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { cn } from '../utils';
import { REDE_HOVER_TOOLTIP } from '../data/attributeUiConfig';
import { CentauroLogo } from './CentauroLogo';

const BTN_DIM =
  'w-[140px] h-[50px] shrink-0 rounded-xl border transition-all duration-200 outline-none';

const DISABLED_BORDER = 'rgba(217, 217, 217, 0.5)';

/**
 * REDE v.1 — informativo: rede fixa (Centauro), sem seleção/agrupamento/exclusão.
 * Mesmo estado desabilitado nas etapas Seleção, Agrupamento e Exclusão.
 */
export function RedeAttributeButton() {
  const button = (
    <button
      type="button"
      disabled
      aria-disabled
      aria-label={REDE_HOVER_TOOLTIP}
      className={cn(
        BTN_DIM,
        'flex items-center justify-center cursor-not-allowed opacity-50',
      )}
      style={{
        backgroundColor: '#fff',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: DISABLED_BORDER,
      }}
    >
      <CentauroLogo />
    </button>
  );

  return (
    <RadixTooltip.Root delayDuration={300}>
      <RadixTooltip.Trigger asChild>
        <span className="inline-flex">{button}</span>
      </RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          className="z-[200] max-w-[200px] rounded-lg bg-slate-800 px-3 py-2 text-center text-xs leading-snug text-white shadow-lg"
          sideOffset={6}
        >
          {REDE_HOVER_TOOLTIP}
          <RadixTooltip.Arrow className="fill-slate-800" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
