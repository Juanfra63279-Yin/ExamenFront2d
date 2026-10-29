import React, { useState } from 'react';
import { Product, Order, Employee, OrderStatus } from '../../types';
import { ProofBadge } from '../atoms/ProofBadge';
import { StockPill } from '../atoms/StockPill';
import { WineGlassLoader } from '../atoms/WineGlassLoader';
import {
  Package,
  Truck,
  BarChart3,
  Users,
  Search,
  Plus,
  Minus,
  CheckCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Shield,
  Phone,
  MapPin,
  DollarSign
} from 'lucide-react';

interface AdminOpsViewProps {
  products: Product[];
  orders: Order[];
  employees: Employee[];
  onUpdateProductStock: (productId: string, newStock: number) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onToggleEmployeeActive: (employeeId: string) => void;
  onSwitchView: () => void;
}

export const AdminOpsView: React.FC<AdminOpsViewProps> = ({
  products,
  orders,
  employees,
  onUpdateProductStock,
  onUpdateOrderStatus,
  onToggleEmployeeActive,
  onSwitchView
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'dispatch' | 'analytics' | 'staff'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(val);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery)
  );

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 700);
  };

  // Metrics calculation
  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalWholesaleValue = products.reduce((sum, p) => sum + p.wholesaleCost * p.stock, 0);
  const totalRetailPotential = products.reduce((sum, p) => sum + p.promoPrice * p.stock, 0);
  const averageMargin = (
    products.reduce((sum, p) => sum + p.marginPct, 0) / (products.length || 1)
  ).toFixed(1);
  const totalGMV = orders.reduce((sum, o) => sum + (o.status !== 'cancelado' ? o.total : 0), 0);

  return (
    <div className="min-h-screen bg-[#121212] text-[#E0E0E0] flex flex-col md:flex-row antialiased">
      {/* Fixed 260px Navigation Drawer */}
      <aside className="w-full md:w-[260px] md:fixed md:inset-y-0 md:left-0 bg-[#1E1E1E] border-r border-[#333333] flex flex-col justify-between z-30">
        <div>
          {/* Logo & Operational Status */}
          <div className="p-4 border-b border-[#333333] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E65100] flex items-center justify-center font-black text-white text-base">
                  VN
                </div>
                <div>
                  <h1 className="text-base font-extrabold text-white tracking-tight">VinoNez Ops</h1>
                  <p className="text-[10px] text-[#9E9E9E] font-mono">BODEGA NEZA • V4.2</p>
                </div>
              </div>
            </div>

            <span className="w-2.5 h-2.5 rounded-full bg-[#00C853] animate-pulse" title="Servidor y sockets en línea" />
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1" aria-label="Navegación del panel de operaciones">
            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-3 transition-colors ${
                activeTab === 'inventory'
                  ? 'bg-[#E65100] text-white shadow-md shadow-[#E65100]/20'
                  : 'text-[#E0E0E0] hover:bg-[#252525] hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Inventario & Costos</span>
              <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30">
                {products.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dispatch')}
              className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-3 transition-colors ${
                activeTab === 'dispatch'
                  ? 'bg-[#E65100] text-white shadow-md shadow-[#E65100]/20'
                  : 'text-[#E0E0E0] hover:bg-[#252525] hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Despacho & Rutas Neza</span>
              <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30">
                {orders.filter((o) => o.status === 'en_ruta' || o.status === 'en_bodega').length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-3 transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-[#E65100] text-white shadow-md shadow-[#E65100]/20'
                  : 'text-[#E0E0E0] hover:bg-[#252525] hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Métricas & Rendimiento</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('staff')}
              className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-3 transition-colors ${
                activeTab === 'staff'
                  ? 'bg-[#E65100] text-white shadow-md shadow-[#E65100]/20'
                  : 'text-[#E0E0E0] hover:bg-[#252525] hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Personal & Roles</span>
              <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30">
                {employees.filter((e) => e.active).length} act.
              </span>
            </button>
          </nav>
        </div>

        {/* Bottom Drawer Actions: Switch back to Storefront */}
        <div className="p-3 border-t border-[#333333] bg-[#181818] space-y-2">
          <div className="text-[11px] text-[#9E9E9E] px-1 flex items-center justify-between">
            <span>Almacén Central Neza</span>
            <span className="text-[#00C853] font-bold">100% Operativo</span>
          </div>
          <button
            type="button"
            onClick={onSwitchView}
            className="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#252525] hover:bg-[#2D2D2D] border border-[#3A3A3A] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB74D]"
          >
            <span>Ir a Tienda Digital (Cliente)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Main Workspace (12-column responsive layout alongside fixed 260px drawer) */}
      <main className="flex-1 md:ml-[260px] p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        {/* Top Operational Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#333333]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF9800]">
                Control Operativo de Alto Rendimiento
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#00C853]/10 text-[#00C853] font-mono border border-[#00C853]/30">
                Latencia: 14ms
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              {activeTab === 'inventory' && 'Inventario, Costos & Margen'}
              {activeTab === 'dispatch' && 'Despacho & Rutas Express Neza'}
              {activeTab === 'analytics' && 'Métricas de Venta & SLA'}
              {activeTab === 'staff' && 'Control de Personal & Accesos'}
            </h2>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSimulateSync}
              className="min-h-[44px] px-3.5 py-2 rounded-lg bg-[#1E1E1E] hover:bg-[#252525] border border-[#333333] text-xs font-bold text-[#E0E0E0] flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB74D]"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#FF9800] ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Bodega'}</span>
            </button>

            <button
              type="button"
              onClick={onSwitchView}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-[#E65100] hover:bg-[#FF6D00] text-white text-xs font-bold transition-colors"
            >
              Vista Tienda Cliente
            </button>
          </div>
        </div>

        {/* TAB 1: INVENTARIO & COSTOS */}
        {activeTab === 'inventory' && (
          <div className="mt-6 space-y-6">
            {/* Quick KPI Stat Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A]">
                <span className="text-[11px] text-[#9E9E9E] font-medium block">Unidades en Bodega</span>
                <span className="text-xl font-bold text-white font-mono tabular-nums">{totalStockUnits} pzas</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A]">
                <span className="text-[11px] text-[#9E9E9E] font-medium block">Valor Costo Mayorista</span>
                <span className="text-xl font-bold text-[#FFB59A] font-mono tabular-nums">{formatPrice(totalWholesaleValue)}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A]">
                <span className="text-[11px] text-[#9E9E9E] font-medium block">Potencial Venta Retail</span>
                <span className="text-xl font-bold text-white font-mono tabular-nums">{formatPrice(totalRetailPotential)}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A]">
                <span className="text-[11px] text-[#9E9E9E] font-medium block">Margen Promedio Neto</span>
                <span className="text-xl font-bold text-[#00C853] font-mono tabular-nums">+{averageMargin}%</span>
              </div>
            </div>

            {/* Filter Search */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#9E9E9E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filtrar por nombre, marca o código de barras SAT..."
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg bg-[#1E1E1E] border border-[#333333] text-white focus:outline-none focus:border-[#FFB74D]"
                />
              </div>
            </div>

            {/* Admin Management & Analytics Table: Header #1E1E1E, rows alternating #181818 / #1E1E1E, border #333333 */}
            <div className="overflow-x-auto rounded-xl border border-[#333333] bg-[#1E1E1E]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1E1E1E] text-[#9E9E9E] uppercase font-bold tracking-wider text-[11px] border-b border-[#333333]">
                    <th className="py-3.5 px-4">Producto & Origen</th>
                    <th className="py-3.5 px-3">Graduación</th>
                    <th className="py-3.5 px-3">Costo Mayorista</th>
                    <th className="py-3.5 px-3">Precio Retail</th>
                    <th className="py-3.5 px-3">Margen %</th>
                    <th className="py-3.5 px-3">Stock Actual</th>
                    <th className="py-3.5 px-4 text-right">Ajuste Rápido (+/-)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {filteredProducts.map((p, idx) => (
                    <tr
                      key={p.id}
                      className={`transition-colors hover:bg-[#252525] ${
                        idx % 2 === 0 ? 'bg-[#181818]' : 'bg-[#1E1E1E]'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-9 h-9 object-cover rounded bg-[#121212] border border-[#333333] flex-shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white leading-tight">{p.name}</div>
                            <div className="text-[11px] text-[#9E9E9E] font-mono">
                              {p.volume} • {p.barcode}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <ProofBadge proofPct={p.proofPct} tier={p.proofTier} />
                      </td>

                      <td className="py-3 px-3 font-mono tabular-nums text-[#9E9E9E]">
                        {formatPrice(p.wholesaleCost)}
                      </td>

                      <td className="py-3 px-3 font-mono tabular-nums font-bold text-white">
                        {formatPrice(p.promoPrice)}
                        {p.discountPct > 0 && (
                          <span className="text-[10px] text-[#E65100] ml-1">(-{p.discountPct}%)</span>
                        )}
                      </td>

                      <td className="py-3 px-3 font-mono tabular-nums font-semibold text-[#00C853]">
                        +{p.marginPct}%
                      </td>

                      <td className="py-3 px-3">
                        <StockPill stock={p.stock} isCompact />
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 bg-[#121212] p-1 rounded-lg border border-[#333333]">
                          <button
                            type="button"
                            onClick={() => onUpdateProductStock(p.id, Math.max(0, p.stock - 1))}
                            className="w-8 h-8 flex items-center justify-center rounded bg-[#252525] hover:bg-[#2D2D2D] text-white transition-colors"
                            title="Descontar 1 pieza"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-9 text-center font-mono font-bold text-white tabular-nums">
                            {p.stock}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateProductStock(p.id, p.stock + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded bg-[#252525] hover:bg-[#2D2D2D] text-white transition-colors"
                            title="Agregar 1 pieza"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: DESPACHO & RUTAS NEZA */}
        {activeTab === 'dispatch' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Fleet summary */}
              <div className="p-4 rounded-xl bg-[#1E1E1E] border border-[#333333] space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#FF9800]">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4" />
                    Flota de Motocicletas Activas
                  </span>
                  <span className="text-[#00C853]">4 En Servicio</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#252525] border border-[#3A3A3A] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Kevin Estrada (Moto 04)</div>
                      <div className="text-[11px] text-[#9E9E9E]">Italika 150cc • Av. Pantitlán</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF9800]/20 text-[#FF9800]">
                      En Ruta
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#252525] border border-[#3A3A3A] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Arturo Morales (Moto 01)</div>
                      <div className="text-[11px] text-[#9E9E9E]">Honda Cargo 150 • Almacén Central</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00C853]/20 text-[#00C853]">
                      Disponible
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Orders Overview */}
              <div className="lg:col-span-2 p-4 rounded-xl bg-[#1E1E1E] border border-[#333333] space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Monitor de Despacho en Tiempo Real</span>
                  <span className="text-xs text-[#9E9E9E] font-mono">{orders.length} pedidos hoy</span>
                </div>

                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-3.5 rounded-xl bg-[#252525] border border-[#3A3A3A] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[#181818] text-[#FFB74D] border border-[#333333]">
                            {order.id}
                          </span>
                          <span className="text-sm font-bold text-white">{order.customerName}</span>
                          <span className="text-xs text-[#9E9E9E]">({order.phone})</span>
                        </div>
                        <div className="text-xs text-[#A0A0A0] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#FF9800]" />
                          <span>{order.address}</span>
                        </div>
                        <div className="text-[11px] text-[#7E7E7E]">
                          {order.items.map((i) => `${i.quantity}x ${i.product.name.split(' ')[0]}`).join(', ')} •{' '}
                          <strong className="text-white font-mono">{formatPrice(order.total)}</strong>
                        </div>
                      </div>

                      {/* Status Selector Switch */}
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="text-xs font-bold p-2 rounded-lg bg-[#181818] border border-[#3A3A3A] text-white focus:outline-none focus:border-[#FFB74D]"
                        >
                          <option value="confirmado">Confirmado</option>
                          <option value="en_bodega">En Bodega</option>
                          <option value="en_ruta">En Ruta Neza</option>
                          <option value="entregado">Entregado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANALYTICS & RENDIMIENTO */}
        {activeTab === 'analytics' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-[#1E1E1E] border border-[#333333]">
                <div className="flex items-center justify-between text-xs text-[#9E9E9E] mb-2">
                  <span>GMV Bruto Facturado</span>
                  <TrendingUp className="w-4 h-4 text-[#00C853]" />
                </div>
                <div className="text-3xl font-black text-white font-mono">{formatPrice(totalGMV)}</div>
                <div className="text-xs text-[#00C853] mt-2">+18.4% vs semana anterior</div>
              </div>

              <div className="p-5 rounded-xl bg-[#1E1E1E] border border-[#333333]">
                <div className="flex items-center justify-between text-xs text-[#9E9E9E] mb-2">
                  <span>Tiempo Promedio Entrega Neza</span>
                  <Clock className="w-4 h-4 text-[#FF9800]" />
                </div>
                <div className="text-3xl font-black text-white font-mono">27.4 min</div>
                <div className="text-xs text-[#00C853] mt-2">SLA 98.7% de entregas a tiempo</div>
              </div>

              <div className="p-5 rounded-xl bg-[#1E1E1E] border border-[#333333]">
                <div className="flex items-center justify-between text-xs text-[#9E9E9E] mb-2">
                  <span>Densidad de Transacción</span>
                  <BarChart3 className="w-4 h-4 text-[#FFB59A]" />
                </div>
                <div className="text-3xl font-black text-white font-mono">4.8 ord/h</div>
                <div className="text-xs text-[#9E9E9E] mt-2">Pico de demanda 7pm - 11pm</div>
              </div>
            </div>

            {/* Top spirits breakdown */}
            <div className="p-5 rounded-xl bg-[#1E1E1E] border border-[#333333]">
              <h3 className="text-sm font-bold text-white mb-4">Licores con Mayor Rotación de Stock</h3>
              <div className="space-y-3">
                {products.slice(0, 5).map((p, i) => (
                  <div key={p.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">
                        #{i + 1} {p.name}
                      </span>
                      <span className="text-[#FF9800] font-mono font-bold">{p.rating} ★ ({p.ratingCount} opiniones)</span>
                    </div>
                    <div className="w-full bg-[#121212] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#E65100] h-full rounded-full"
                        style={{ width: `${Math.min(100, (p.stock / 60) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PERSONAL & ROLES */}
        {activeTab === 'staff' && (
          <div className="mt-6 space-y-6">
            <div className="overflow-x-auto rounded-xl border border-[#333333] bg-[#1E1E1E]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1E1E1E] text-[#9E9E9E] uppercase font-bold tracking-wider text-[11px] border-b border-[#333333]">
                    <th className="py-3.5 px-4">Colaborador</th>
                    <th className="py-3.5 px-3">Rol Operativo</th>
                    <th className="py-3.5 px-3">Turno</th>
                    <th className="py-3.5 px-3">Pedidos Atendidos</th>
                    <th className="py-3.5 px-3">Precisión</th>
                    <th className="py-3.5 px-4 text-right">Estado / Turno Activo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {employees.map((emp, idx) => (
                    <tr
                      key={emp.id}
                      className={`hover:bg-[#252525] transition-colors ${
                        idx % 2 === 0 ? 'bg-[#181818]' : 'bg-[#1E1E1E]'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#353534] flex items-center justify-center font-bold text-[11px] text-[#FFB59A]">
                          {emp.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span>{emp.name}</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#252525] border border-[#3A3A3A] text-[#FF9800]">
                          {emp.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-[#A0A0A0]">{emp.shift}</td>

                      <td className="py-3.5 px-3 font-mono tabular-nums text-white">
                        {emp.ordersHandledToday}
                      </td>

                      <td className="py-3.5 px-3 font-mono tabular-nums text-[#00C853] font-bold">
                        {emp.accuracyRate}%
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onToggleEmployeeActive(emp.id)}
                          className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            emp.active
                              ? 'bg-[#00C853]/20 border border-[#00C853]/40 text-[#00C853] hover:bg-[#00C853]/30'
                              : 'bg-[#252525] border border-[#3A3A3A] text-[#7E7E7E] hover:text-white'
                          }`}
                        >
                          {emp.active ? 'En Turno (Activo)' : 'Fuera de Turno'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
