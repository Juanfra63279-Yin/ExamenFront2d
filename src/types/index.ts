export type CategoryId = 'todos' | 'tequila_mezcal' | 'vino' | 'whisky_licor' | 'cerveza' | 'promociones';

export type ProofTier = 'alta' | 'media' | 'baja';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: CategoryId;
  subcategory: string;
  origin: string;
  volume: string;
  proofPct: number;
  proofTier: ProofTier;
  regularPrice: number;
  promoPrice: number;
  discountPct: number;
  stock: number;
  wholesaleCost: number;
  marginPct: number;
  rating: number;
  ratingCount: number;
  tastingNotes: string[];
  pairing: string;
  distillery: string;
  image: string;
  barcode: string;
  seasonalBadge?: 'Fiestas Patrias' | 'Fin de Año' | 'Noche Neza' | 'Oferta Relámpago';
  isPopular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  municipality: string;
  estimatedMinutes: string;
  deliveryFee: number;
  freeThreshold: number;
}

export type OrderStatus = 'confirmado' | 'en_bodega' | 'en_ruta' | 'entregado' | 'cancelado';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  zone: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  iva: number;
  total: number;
  paymentMethod: 'efectivo' | 'tarjeta' | 'spei';
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime: string;
  courierName?: string;
  courierVehicle?: string;
  cancellationWindowExpires?: number; // epoch ms
}

export interface Employee {
  id: string;
  name: string;
  role: 'Administrador' | 'Operaciones Almacén' | 'Despacho Neza' | 'Cajero';
  active: boolean;
  shift: 'Matutino (8am - 4pm)' | 'Vespertino (4pm - 12am)' | 'Nocturno (12am - 8am)';
  ordersHandledToday: number;
  accuracyRate: number;
}
