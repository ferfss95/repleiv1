import type { CSSProperties } from 'react';

/** Header de 1 linha (tabela padrão): py-3 + texto + borda inferior. */
export const ANALYSIS_TABLE_STD_HEADER_HEIGHT_PX = 46;

/** Linha Total abaixo do header padrão. */
export const ANALYSIS_TABLE_STD_TOTAL_TOP_PX = ANALYSIS_TABLE_STD_HEADER_HEIGHT_PX;

export const ANALYSIS_TABLE_TOTAL_ROW_HEIGHT_PX = 46;

/** Header pivot (2 linhas): ~37px + ~38px. */
export const ANALYSIS_TABLE_PIVOT_HEADER_HEIGHT_PX = 75;
export const ANALYSIS_TABLE_PIVOT_HEADER_ROW1_HEIGHT_PX = 37;
export const ANALYSIS_TABLE_PIVOT_HEADER_ROW2_TOP_PX = 37;
export const ANALYSIS_TABLE_PIVOT_HEADER_ROW2_HEIGHT_PX = 38;

const stickyCellBase = (height: number): CSSProperties => ({
  height,
  minHeight: height,
  maxHeight: height,
  boxSizing: 'border-box',
  verticalAlign: 'middle',
});

export const stickyStdHeaderCornerStyle = (): CSSProperties => ({
  position: 'sticky',
  left: 0,
  top: 0,
  zIndex: 50,
  ...stickyCellBase(ANALYSIS_TABLE_STD_HEADER_HEIGHT_PX),
});

export const stickyStdHeaderCellStyle = (): CSSProperties => ({
  position: 'sticky',
  top: 0,
  zIndex: 40,
  ...stickyCellBase(ANALYSIS_TABLE_STD_HEADER_HEIGHT_PX),
});

export const stickyStdTotalCornerStyle = (): CSSProperties => ({
  position: 'sticky',
  left: 0,
  top: ANALYSIS_TABLE_STD_TOTAL_TOP_PX,
  zIndex: 45,
  ...stickyCellBase(ANALYSIS_TABLE_TOTAL_ROW_HEIGHT_PX),
});

export const stickyStdTotalCellStyle = (): CSSProperties => ({
  position: 'sticky',
  top: ANALYSIS_TABLE_STD_TOTAL_TOP_PX,
  zIndex: 30,
  ...stickyCellBase(ANALYSIS_TABLE_TOTAL_ROW_HEIGHT_PX),
});

export const stickyPivotHeaderCornerStyle = (): CSSProperties => ({
  position: 'sticky',
  left: 0,
  top: 0,
  zIndex: 50,
  ...stickyCellBase(ANALYSIS_TABLE_PIVOT_HEADER_HEIGHT_PX),
});

export const stickyPivotHeaderRow1Style = (): CSSProperties => ({
  position: 'sticky',
  top: 0,
  zIndex: 40,
  ...stickyCellBase(ANALYSIS_TABLE_PIVOT_HEADER_ROW1_HEIGHT_PX),
});

export const stickyPivotHeaderRow2Style = (): CSSProperties => ({
  position: 'sticky',
  top: ANALYSIS_TABLE_PIVOT_HEADER_ROW2_TOP_PX,
  zIndex: 40,
  ...stickyCellBase(ANALYSIS_TABLE_PIVOT_HEADER_ROW2_HEIGHT_PX),
});

export const stickyPivotTotalCornerStyle = (): CSSProperties => ({
  position: 'sticky',
  left: 0,
  top: ANALYSIS_TABLE_PIVOT_HEADER_HEIGHT_PX,
  zIndex: 45,
  ...stickyCellBase(ANALYSIS_TABLE_TOTAL_ROW_HEIGHT_PX),
});

export const stickyPivotTotalCellStyle = (): CSSProperties => ({
  position: 'sticky',
  top: ANALYSIS_TABLE_PIVOT_HEADER_HEIGHT_PX,
  zIndex: 30,
  ...stickyCellBase(ANALYSIS_TABLE_TOTAL_ROW_HEIGHT_PX),
});
