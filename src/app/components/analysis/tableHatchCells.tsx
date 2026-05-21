import React, { useLayoutEffect, useRef, useState } from 'react';
import { TABLE_HATCH_FILL_STYLE } from '../../constants/tableModuleTheme';

/**
 * Superfície de hachura: acompanha largura e altura reais da tabela.
 * - Horizontal: width max-content (igual à tabela).
 * - Vertical: max(viewport do scroll, altura do conteúdo) via ResizeObserver.
 */
export function TableHatchSurface({ children }: { children: React.ReactNode }) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [surfaceMinHeight, setSurfaceMinHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const surface = surfaceRef.current;
    const measure = measureRef.current;
    if (!surface || !measure) return;

    const syncHeight = () => {
      const scrollport = surface.parentElement;
      const viewportH = scrollport?.clientHeight ?? 0;
      const contentH = measure.offsetHeight;
      const next = Math.max(viewportH, contentH);
      setSurfaceMinHeight((prev) => (prev === next ? prev : next));
    };

    syncHeight();
    const ro = new ResizeObserver(syncHeight);
    ro.observe(measure);
    if (surface.parentElement) {
      ro.observe(surface.parentElement);
    }
    return () => ro.disconnect();
  }, [children]);

  return (
    <div
      ref={surfaceRef}
      className="shrink-0 w-max min-w-full"
      style={{
        minHeight: surfaceMinHeight ?? '100%',
        width: 'max-content',
        minWidth: '100%',
        ...TABLE_HATCH_FILL_STYLE,
      }}
    >
      <div ref={measureRef} className="relative z-[1] w-max min-w-full">
        {children}
      </div>
    </div>
  );
}
