import React, { useState } from 'react';
import { ChevronDown, BarChart3, TrendingUp, ArrowLeftRight, Clock, Check } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { cn } from '../utils';
import type { AnalysisMode } from '../types/wizard';
import { isAnalysisModeVisibleInUi } from '../data/analysisModeUiVisibility';

interface AnalysisOption {
  id: AnalysisMode;
  label: string;
  Icon: React.ElementType;
  desc: string;
}

interface AnalysisSelectorProps {
  value: AnalysisMode;
  onChange: (mode: AnalysisMode) => void;
  supportsHoraAHora: boolean;
  disabled?: boolean;
}

const ALL_ANALYSIS_OPTIONS: AnalysisOption[] = [
  { id: 'padrao', label: 'Geral', Icon: BarChart3, desc: 'acompanhamento de métricas' },
  { id: 'evolucao', label: 'Evolutiva', Icon: TrendingUp, desc: 'quebrar colunas por período' },
  { id: 'comparativo', label: 'Comparativa', Icon: ArrowLeftRight, desc: 'analisar 2 grupos de período' },
  { id: 'horaahora', label: 'Intraday', Icon: Clock, desc: 'quebrar colunas por horas' },
];

export function AnalysisSelector({ value, onChange, supportsHoraAHora, disabled = false }: AnalysisSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // UI: só «Geral»; intraday extra filtrado por módulo permanece no código para reativação.
  const availableOptions = ALL_ANALYSIS_OPTIONS.filter(
    (opt) =>
      isAnalysisModeVisibleInUi(opt.id) &&
      (opt.id !== 'horaahora' || supportsHoraAHora),
  );

  const selectedOption =
    availableOptions.find((opt) => opt.id === value) || availableOptions[0];

  if (availableOptions.length === 1) {
    const only = availableOptions[0];
    return (
      <button
        type="button"
        disabled
        className={cn(
          'w-full h-[52px] px-3.5 flex items-center justify-between rounded-lg border transition-all',
          'bg-slate-50 text-[13px] font-medium text-[#314158] border-slate-200 cursor-default opacity-90',
        )}
      >
        <div className="flex flex-col items-start gap-0.5 min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-[#90A1B9]">
            Tipo de Análise
          </span>
          <div className="flex items-center gap-2">
            <only.Icon size={14} className="text-[#314158] shrink-0" strokeWidth={1.5} />
            <span className="text-[13px] font-medium text-[#314158] truncate">{only.label}</span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          disabled={disabled}
          className={cn(
            'w-full h-[52px] px-3.5 flex items-center justify-between rounded-lg border transition-all',
            'bg-white text-[13px] font-medium text-[#314158]',
            disabled
              ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60'
              : 'border-[#d5dbe3] hover:border-[#314158] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#314158]/20 focus:border-[#314158]',
            isOpen && 'border-[#314158] ring-2 ring-[#314158]/20'
          )}
        >
          <div className="flex flex-col items-start gap-0.5 min-w-0">
            <span
              className={cn(
                'text-[10px] font-semibold uppercase tracking-wide',
                isOpen ? 'text-[#314158]' : 'text-[#90A1B9]'
              )}
            >
              Tipo de Análise
            </span>
            <div className="flex items-center gap-2">
              <selectedOption.Icon size={14} className="text-[#314158] shrink-0" strokeWidth={1.5} />
              <span className="text-[13px] font-medium text-[#314158] truncate">
                {selectedOption.label}
              </span>
            </div>
          </div>
          <ChevronDown 
            size={16} 
            className={cn(
              "text-[#90A1B9] shrink-0 transition-transform duration-200",
              isOpen && "rotate-180"
            )} 
          />
        </button>
      </Popover.Trigger>
      
      <Popover.Portal>
        <Popover.Content
          className="w-[300px] bg-white rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] border border-[#e2e8f0] p-4 z-50 animate-in fade-in zoom-in-95 duration-200"
          sideOffset={6}
          align="start"
        >
          {/* Título */}
          <h3 className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#314158] mb-4">
            Alterar tipo de análise
          </h3>

          {/* Lista de opções */}
          <div className="flex flex-col gap-2">
            {availableOptions.map(({ id, label, Icon, desc }) => {
              const isSelected = value === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    onChange(id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "relative rounded-[14px] p-[15px] transition-all duration-150 text-left outline-none group",
                    isSelected 
                      ? "bg-[#f4f7fa]" 
                      : "bg-white hover:bg-slate-50"
                  )}
                >
                  {/* Border overlay */}
                  <div 
                    aria-hidden="true" 
                    className={cn(
                      "absolute inset-0 pointer-events-none rounded-[14px] border",
                      isSelected ? "border-[#566878]" : "border-[#e2e8f0]"
                    )} 
                  />
                  
                  <div className="flex items-center gap-3 relative">
                    <Icon 
                      size={15} 
                      className={cn(
                        "shrink-0 transition-colors",
                        isSelected ? "text-[#314158]" : "text-[#90A1B9] opacity-80 group-hover:text-[#62748e]"
                      )}
                      strokeWidth={1.25}
                    />
                    <div className="flex flex-col gap-[2px] flex-1 min-w-0">
                      <span 
                        className={cn(
                          "text-[12px] font-bold uppercase tracking-[0.3px] leading-[18px] transition-colors",
                          isSelected ? "text-[#314158]" : "text-[#62748e]"
                        )}
                      >
                        {label}
                      </span>
                      <span className={cn(
                        "text-[10px] leading-[12.5px] font-normal",
                        isSelected ? "text-[#314158]" : "text-[#90a1b9]"
                      )}>
                        {desc}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="bg-[#314158] rounded-full size-4 flex items-center justify-center shrink-0">
                        <Check size={9} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}