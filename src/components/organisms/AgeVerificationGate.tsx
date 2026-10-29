import React from 'react';
import { Wine, ShieldAlert, Check } from 'lucide-react';

interface AgeVerificationGateProps {
  isOpen: boolean;
  onConfirm: () => void;
  onReject: () => void;
}

export const AgeVerificationGate: React.FC<AgeVerificationGateProps> = ({
  isOpen,
  onConfirm,
  onReject
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Verificación de mayoría de edad legal"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-[#1E1E1E] border border-[#333333] shadow-2xl p-6 sm:p-8 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#E65100]/20 border border-[#E65100]/40 flex items-center justify-center text-[#FF9800]">
          <Wine className="w-8 h-8 stroke-[2.2]" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#FF8A80]">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Requisito Legal • México +18</span>
          </div>

          <h2 className="text-2xl font-black text-white">¿Eres mayor de edad?</h2>

          <p className="text-xs text-[#A0A0A0] leading-relaxed">
            Para acceder a <strong className="text-white">VinoNez</strong> y ordenar bebidas con graduación
            alcohólica debes tener al menos 18 años. Se requerirá mostrar tu credencial de elector (INE)
            vigente al momento de la entrega en Cd. Nezahualcóyotl.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full min-h-[48px] h-12 rounded-lg bg-[#E65100] hover:bg-[#FF6D00] text-white font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#E65100]/25 transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB74D]"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>Sí, soy mayor de 18 años</span>
          </button>

          <button
            type="button"
            onClick={onReject}
            className="w-full min-h-[44px] px-4 py-2 rounded-lg bg-[#252525] hover:bg-[#2D2D2D] border border-[#3A3A3A] text-[#9E9E9E] hover:text-white text-xs font-semibold transition-colors"
          >
            No, soy menor de edad (Salir)
          </button>
        </div>

        <div className="text-[10px] text-[#777777] border-t border-[#2D2D2D] pt-3">
          El abuso en el consumo de este producto es nocivo para la salud. LGS Art. 220.
        </div>
      </div>
    </div>
  );
};
