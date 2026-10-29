import React, { useState } from 'react';
import { CartItem, DeliveryZone, Order } from '../../types';
import { WineGlassLoader } from '../atoms/WineGlassLoader';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  Banknote,
  Send,
  Truck,
  RotateCcw,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  selectedZone: DeliveryZone;
  discount: number;
  couponCode?: string;
  onOrderCreated: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  selectedZone,
  discount,
  couponCode,
  onOrderCreated
}) => {
  const [customerName, setCustomerName] = useState('Rodrigo Mendoza');
  const [phone, setPhone] = useState('55 4192 8840');
  const [streetAddress, setStreetAddress] = useState('Av. Pantitlán #412 int 3');
  const [references, setReferences] = useState('Frente a la taquería el Torito, zaguán negro');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta' | 'spei'>('tarjeta');
  const [cashBillAmount, setCashBillAmount] = useState('1000');
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(true);

  // Nielsen #1 button states
  const [feedbackState, setFeedbackState] = useState<'idle' | 'loading' | 'confirmed' | 'finalized'>('idle');
  const [undoCountdown, setUndoCountdown] = useState(5);
  const [activeCreatedOrder, setActiveCreatedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.promoPrice * item.quantity, 0);
  const isFreeDelivery = subtotal >= selectedZone.freeThreshold;
  const deliveryFee = isFreeDelivery ? 0 : selectedZone.deliveryFee;
  const taxableSubtotal = Math.max(0, subtotal - discount);
  const iva = taxableSubtotal * (16 / 116);
  const total = taxableSubtotal + deliveryFee;

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(val);

  const handleStartOrder = async () => {
    if (!isAgeConfirmed) return;
    setFeedbackState('loading');

    // Simulate backend route assignment
    await new Promise((r) => setTimeout(r, 1400));

    const newOrderId = `VN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: newOrderId,
      customerName,
      phone,
      address: `${streetAddress}, Col. ${selectedZone.name}`,
      zone: selectedZone.name,
      items: [...items],
      subtotal,
      deliveryFee,
      discount,
      couponCode,
      iva,
      total,
      paymentMethod,
      status: 'confirmado',
      createdAt: 'Hace un momento',
      estimatedDeliveryTime: selectedZone.estimatedMinutes,
      courierName: 'Kevin Estrada (Moto 04)',
      courierVehicle: 'Italika 150cc VinoNez Express',
      cancellationWindowExpires: Date.now() + 5000
    };

    setActiveCreatedOrder(newOrder);
    setFeedbackState('confirmed');
    setUndoCountdown(5);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#E65100', '#FF9800', '#00C853']
      });
    } catch {
      // ignore
    }

    // 5-second undo countdown timer
    let count = 5;
    const interval = window.setInterval(() => {
      count -= 1;
      setUndoCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setFeedbackState('finalized');
        onOrderCreated(newOrder);
      }
    }, 1000);
  };

  const handleUndoOrder = () => {
    setFeedbackState('idle');
    setActiveCreatedOrder(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Finalizar Compra y Despacho Neza"
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-[#1E1E1E] border border-[#333333] shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#333333] bg-[#252525] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#E65100]/20 text-[#FF9800]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Finalizar Pedido Exprés VinoNez</h3>
              <p className="text-xs text-[#9E9E9E]">Despacho en moto desde almacén central Nezahualcóyotl</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#9E9E9E] hover:text-white hover:bg-[#333333] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB74D]"
            aria-label="Cerrar modal de compra"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {feedbackState === 'finalized' && activeCreatedOrder ? (
            /* Order Tracking State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#00C853]/20 border border-[#00C853] flex items-center justify-center text-[#00C853]">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#2A2A2A] text-[#FFB74D] border border-[#3A3A3A]">
                  FOLIO: {activeCreatedOrder.id}
                </span>
                <h3 className="text-2xl font-black text-white mt-2">¡Pedido Asignado a Repartidor!</h3>
                <p className="text-xs text-[#E0E0E0] mt-1 max-w-md mx-auto">
                  Tu repartidor <strong className="text-[#FF9800]">{activeCreatedOrder.courierName}</strong>{' '}
                  está cargando tu pedido en bodega con destino a {activeCreatedOrder.address}.
                </p>
              </div>

              {/* Delivery Status Card */}
              <div className="p-4 rounded-xl bg-[#252525] border border-[#333333] text-left space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-[#333333]">
                  <span className="text-[#9E9E9E]">Tiempo Estimado de Entrega:</span>
                  <span className="text-[#00C853] font-bold font-mono text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedZone.estimatedMinutes}
                  </span>
                </div>
                <div className="text-xs text-[#E0E0E0] space-y-1">
                  <div>
                    <strong className="text-[#9E9E9E]">Vehículo:</strong>{' '}
                    <span>{activeCreatedOrder.courierVehicle}</span>
                  </div>
                  <div>
                    <strong className="text-[#9E9E9E]">Método de cobro:</strong>{' '}
                    <span className="capitalize">{activeCreatedOrder.paymentMethod}</span>
                  </div>
                  <div>
                    <strong className="text-[#9E9E9E]">Total a pagar:</strong>{' '}
                    <span className="font-mono text-white font-bold">{formatPrice(activeCreatedOrder.total)}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full min-h-[48px] px-6 rounded-lg bg-[#E65100] text-white font-bold text-sm hover:bg-[#FF6D00] transition-colors"
              >
                Volver a la Tienda
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <>
              {/* Delivery Location Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#FF9800] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    1. Dirección en Cd. Nezahualcóyotl
                  </label>
                  <span className="text-[11px] text-[#00C853] font-semibold bg-[#00C853]/10 px-2 py-0.5 rounded border border-[#00C853]/30">
                    Zona: {selectedZone.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-[#9E9E9E] mb-1 block">Nombre receptor (+18 con INE)</span>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg bg-[#252525] border border-[#3A3A3A] text-white focus:outline-none focus:border-[#FFB74D]"
                      required
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#9E9E9E] mb-1 block">Teléfono de contacto (WhatsApp)</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg bg-[#252525] border border-[#3A3A3A] text-white focus:outline-none focus:border-[#FFB74D]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-[#9E9E9E] mb-1 block">Calle y Número (Exterior / Interior)</span>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg bg-[#252525] border border-[#3A3A3A] text-white focus:outline-none focus:border-[#FFB74D]"
                    placeholder="Ej. Av. Pantitlán #412 int 3"
                    required
                  />
                </div>

                <div>
                  <span className="text-[11px] text-[#9E9E9E] mb-1 block">Referencias de entrega (Fachada, entrecalles)</span>
                  <input
                    type="text"
                    value={references}
                    onChange={(e) => setReferences(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg bg-[#252525] border border-[#3A3A3A] text-white focus:outline-none focus:border-[#FFB74D]"
                    placeholder="Ej. Casa de portón blanco, timbre superior"
                  />
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="space-y-3 pt-3 border-t border-[#333333]">
                <label className="text-xs font-bold uppercase tracking-wider text-[#FF9800] flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  2. Método de Pago Seguro
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('tarjeta')}
                    className={`min-h-[48px] p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'tarjeta'
                        ? 'border-[#E65100] bg-[#E65100]/10 text-white'
                        : 'border-[#333333] bg-[#252525] text-[#9E9E9E] hover:border-[#4A4A4A]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <CreditCard className="w-4 h-4 text-[#FF9800]" />
                      <span className="text-[10px] text-[#00C853] font-bold">Terminal en mano</span>
                    </div>
                    <div className="text-xs font-bold text-white">Tarjeta de Débito / Crédito</div>
                    <div className="text-[10px] text-[#A0A0A0]">Visa, Mastercard, AMEX</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('efectivo')}
                    className={`min-h-[48px] p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'efectivo'
                        ? 'border-[#E65100] bg-[#E65100]/10 text-white'
                        : 'border-[#333333] bg-[#252525] text-[#9E9E9E] hover:border-[#4A4A4A]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <Banknote className="w-4 h-4 text-[#00C853]" />
                      <span className="text-[10px] text-[#9E9E9E]">Cambio exacto</span>
                    </div>
                    <div className="text-xs font-bold text-white">Efectivo contra entrega</div>
                    <div className="text-[10px] text-[#A0A0A0]">Pagas al recibir</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('spei')}
                    className={`min-h-[48px] p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'spei'
                        ? 'border-[#E65100] bg-[#E65100]/10 text-white'
                        : 'border-[#333333] bg-[#252525] text-[#9E9E9E] hover:border-[#4A4A4A]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <Send className="w-4 h-4 text-[#FFB59A]" />
                      <span className="text-[10px] text-[#00C853]">Inmediato</span>
                    </div>
                    <div className="text-xs font-bold text-white">Transferencia SPEI</div>
                    <div className="text-[10px] text-[#A0A0A0]">CLABE STP VinoNez</div>
                  </button>
                </div>

                {paymentMethod === 'efectivo' && (
                  <div className="p-3 rounded-lg bg-[#252525] border border-[#3A3A3A] flex items-center justify-between text-xs">
                    <span className="text-[#9E9E9E]">¿Con qué billete pagarás? (Para llevar cambio):</span>
                    <input
                      type="number"
                      value={cashBillAmount}
                      onChange={(e) => setCashBillAmount(e.target.value)}
                      className="w-24 p-1.5 rounded bg-[#181818] border border-[#3A3A3A] text-white text-right font-mono"
                      placeholder="$1000"
                    />
                  </div>
                )}
              </div>

              {/* Legal Age Verification Requirement */}
              <div className="p-3.5 rounded-xl bg-[#2A2A2A] border border-[#3A3A3A] flex items-start gap-3">
                <input
                  id="ageCheck"
                  type="checkbox"
                  checked={isAgeConfirmed}
                  onChange={(e) => setIsAgeConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-[#4A4A4A] text-[#E65100] focus:ring-[#FFB74D]"
                />
                <label htmlFor="ageCheck" className="text-xs text-[#E0E0E0] cursor-pointer leading-relaxed">
                  <strong className="text-white">Confirmo que soy mayor de 18 años</strong> y mostraré mi
                  identificación oficial (INE o Pasaporte vigente) al repartidor de VinoNez al momento de la entrega.
                  El repartidor no entregará el producto a menores de edad sin excepción.
                </label>
              </div>

              {/* Order Summary Total Bar */}
              <div className="p-4 rounded-xl bg-[#252525] border border-[#333333] flex items-center justify-between text-sm">
                <div>
                  <span className="text-xs text-[#9E9E9E] block">Total neto con IVA & Envío:</span>
                  <span className="text-2xl font-black text-white font-mono tabular-nums">
                    {formatPrice(total)}
                  </span>
                </div>
                <div className="text-right text-xs text-[#9E9E9E]">
                  <div>{items.reduce((s, i) => s + i.quantity, 0)} botellas</div>
                  <div className="text-[#00C853] font-semibold">{selectedZone.estimatedMinutes}</div>
                </div>
              </div>

              {/* Nielsen #1 Action Button & Undo Mechanism */}
              {feedbackState === 'confirmed' ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleUndoOrder}
                    className="w-full min-h-[48px] h-12 rounded-lg bg-[#00C853] text-[#002108] font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 relative overflow-hidden transition-all shadow-lg shadow-[#00C853]/20"
                    aria-label="Lugar Confirmado. Clic para cancelar dentro del periodo de 5 segundos."
                  >
                    {/* Undo countdown bar */}
                    <div
                      className="absolute bottom-0 left-0 h-1 bg-[#002108]/40 transition-all duration-300"
                      style={{ width: `${(undoCountdown / 5) * 100}%` }}
                    />
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>Lugar Confirmado (Clic para Cancelar)</span>
                    <span className="ml-2 px-2 py-0.5 rounded bg-[#002108]/20 font-mono text-xs">
                      {undoCountdown}s
                    </span>
                  </button>
                  <p className="text-[11px] text-center text-[#9E9E9E]">
                    Tienes 5 segundos para deshacer o modificar tu pedido antes del despacho a bodega.
                  </p>
                </div>
              ) : feedbackState === 'loading' ? (
                <button
                  type="button"
                  disabled
                  className="w-full min-h-[48px] h-12 rounded-lg bg-[#1E1E1E] border border-[#E65100]/60 text-white font-bold text-sm flex items-center justify-center gap-3 cursor-wait"
                >
                  <WineGlassLoader size={24} />
                  <span className="text-[#FF9800] animate-pulse">
                    Procesando pedido y reservando stock en bodega Neza...
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartOrder}
                  disabled={!isAgeConfirmed}
                  className="w-full min-h-[48px] h-12 rounded-lg bg-[#E65100] hover:bg-[#FF6D00] text-white font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#E65100]/25 transition-all hover:scale-[0.98] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB74D]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirmar Pedido Exprés ({formatPrice(total)})</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
