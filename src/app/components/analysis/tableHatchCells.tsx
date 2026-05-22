import React, { useLayoutEffect, useRef, useState } from 'react';
import { TABLE_HATCH_FILL_STYLE } from '../../constants/tableModuleTheme';

/**
 * Superfície de hachura lateral: altura = conteúdo da tabela (fit-content).
 * A hachura preenche só o vazio à direita das colunas, nunca abaixo das linhas.
 */
export function TableHatchSurface({ children }: { children: React.ReactNode }) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [surfaceHeight, setSurfaceHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const measure = measureRef.current;
    if (!measure) return;

    const syncHeight = () => {
      const contentH = measure.offsetHeight;
      setSurfaceHeight((prev) => (prev === contentH ? prev : contentH));
    };

    syncHeight();
    const ro = new ResizeObserver(syncHeight);
    ro.observe(measure);
    return () => ro.disconnect();
  }, [children]);

  return (
    <div
      className="h-fit w-max min-w-full shrink-0"
      style={{
        height: surfaceHeight ?? undefined,
        width: 'max-content',
        minWidth: '100%',
        ...TABLE_HATCH_FILL_STYLE,
      }}
    >
      <div ref={measureRef} className="relative z-[1] h-fit w-max min-w-full">
        {children}
      </div>
    </div>
  );
}
