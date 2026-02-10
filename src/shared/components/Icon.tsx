import React from 'react';
import {
  LayoutDashboard,
  Users,
  Receipt,
  PackageOpen,
  Package,
  MoreHorizontal,
  TrendingUp,
  HandCoins,
  BarChart3,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ArrowLeft,
  ArrowUpDown,
  Tag,
  Barcode,
  AlertCircle,
  Phone,
  MapPin,
  StickyNote,
  Delete,
  Settings,
  Printer,
  LockKeyhole,
  Upload,
  Download,
  X,
  Plus,
  UserPlus,
  BadgeIndianRupee,
  Minus,
  Search,
  Banknote,
  Smartphone,
  CreditCard,
  Clock,
  History,
  Trash2,
  ShoppingCart,
  User,
  Check,
  Pencil,
  Share2,
  Bluetooth,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Cloud,
  LogIn,
  LogOut,
  RefreshCw,
  Database,
  Coffee,
  Cookie,
  CupSoda,
  Wheat,
  Nut,
  Milk,
  Flame,
  Sparkles,
  Box,
  Droplets,
  UtensilsCrossed,
  FlaskConical,
  Drumstick,
  Container,
  type LucideProps,
} from 'lucide-react-native';

// Map from MaterialCommunityIcons names → Lucide components
const iconMap: Record<string, React.FC<LucideProps>> = {
  // Navigation
  'view-dashboard': LayoutDashboard,
  'account-group': Users,
  'receipt': Receipt,
  'package-variant-closed': PackageOpen,
  'package-variant': Package,
  'dots-horizontal': MoreHorizontal,

  // Dashboard / Reports
  'chart-line': TrendingUp,
  'account-cash': HandCoins,
  'chart-bar': BarChart3,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'arrow-left': ArrowLeft,
  'arrow-up-down': ArrowUpDown,
  'sort': ArrowUpDown,
  'menu-down': ChevronDown,

  // Products
  'tag': Tag,
  'barcode': Barcode,

  // Alerts
  'alert-circle': AlertCircle,

  // Customers
  'phone': Phone,
  'map-marker': MapPin,
  'note-text': StickyNote,

  // Auth
  'backspace-outline': Delete,

  // Settings
  'cog': Settings,
  'printer': Printer,
  'lock-reset': LockKeyhole,

  // Backup
  'export': Upload,
  'import': Download,

  // Actions
  'close': X,
  'x': X,
  'plus': Plus,
  'minus': Minus,
  'account-plus': UserPlus,
  'cash-plus': BadgeIndianRupee,
  'delete-sweep': Trash2,
  'delete': Trash2,
  'trash-2': Trash2,
  'pencil': Pencil,
  'check': Check,

  // Billing
  'magnify': Search,
  'search': Search,
  'cash': Banknote,
  'cellphone': Smartphone,
  'credit-card': CreditCard,
  'account-clock': Clock,
  'cart-outline': ShoppingCart,
  'account': User,
  'user': User,
  'history': History,
  'plus-minus': Plus,
  'share-variant': Share2,

  // Printing
  'bluetooth': Bluetooth,

  // Documents
  'file-text': FileText,

  // Misc
  'check-circle-outline': CheckCircle2,

  // Password visibility
  'eye': Eye,
  'eye-off': EyeOff,
  'eye-outline': Eye,
  'eye-off-outline': EyeOff,

  // Google Drive / Sync
  'cloud': Cloud,
  'log-in': LogIn,
  'log-out': LogOut,
  'refresh-cw': RefreshCw,

  // Data
  'database': Database,

  // Status
  'check-circle': CheckCircle2,

  // Product Categories (kirana store)
  'coffee': Coffee,
  'cookie': Cookie,
  'cup-water': CupSoda,
  'grain': Wheat,
  'barley': Wheat,
  'peanut': Nut,
  'cow': Milk,
  'bottle-tonic': FlaskConical,
  'food-drumstick': Drumstick,
  'face-man-shimmer': Sparkles,
  'candle': Flame,
  'food-variant': UtensilsCrossed,
  'hand-wash': Droplets,
  'shaker-outline': Container,
  'cube-outline': Box,
};

export interface AppIconProps {
  name: string;
  size?: number;
  color?: string;
  style?: object;
}

/**
 * Drop-in replacement for react-native-vector-icons Icon.
 * Uses Lucide SVG icons — no native font linking needed.
 */
export const AppIcon: React.FC<AppIconProps> = ({ name, size = 24, color, style }) => {
  const LucideComponent = iconMap[name];
  if (!LucideComponent) {
    console.warn(`[AppIcon] Unknown icon name: "${name}"`);
    return null;
  }
  return <LucideComponent size={size} color={color} style={style} />;
};

/**
 * Helper for React Native Paper's icon prop.
 * Usage: icon={paperIcon('receipt')}
 */
export const paperIcon = (name: string) => {
  return ({ size, color }: { size: number; color: string }) => (
    <AppIcon name={name} size={size} color={color} />
  );
};
