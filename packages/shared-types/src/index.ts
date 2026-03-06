// ============================================================
// cloudkitchen-os shared TypeScript types
// ============================================================

// --- Enums ---

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PREPARING = "PREPARING",
  READY = "READY",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  KITCHEN_STAFF = "KITCHEN_STAFF",
  ADMIN = "ADMIN",
  DELIVERY_DRIVER = "DELIVERY_DRIVER",
}

export enum NotificationChannel {
  PUSH = "PUSH",
  SMS = "SMS",
  EMAIL = "EMAIL",
}

// --- User types ---

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

// --- Menu types ---

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
  preparationTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
  items: MenuItem[];
}

// --- Order types ---

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer: User;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  deliveryAddress?: Address;
  specialInstructions?: string;
  estimatedDeliveryMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: Array<{
    menuItemId: string;
    quantity: number;
    notes?: string;
  }>;
  deliveryAddress?: Address;
  specialInstructions?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  estimatedDeliveryMinutes?: number;
}

// --- Notification types ---

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  channel: NotificationChannel;
  read: boolean;
  data?: Record<string, string>;
  createdAt: string;
}

export interface SendNotificationRequest {
  userId: string;
  title: string;
  body: string;
  channel: NotificationChannel;
  data?: Record<string, string>;
}

// --- API Response types ---

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// --- WebSocket event types ---

export interface WsEvent<T = unknown> {
  type: string;
  payload: T;
  timestamp: string;
}

export interface OrderUpdateEvent {
  orderId: string;
  status: OrderStatus;
  estimatedDeliveryMinutes?: number;
}
