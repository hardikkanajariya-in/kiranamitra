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
  UserClock,
  History,
  Trash2,
  ShoppingCart,
  User,
  Check,
  Pencil,
  PlusMinusIcon,
  Share2,
  Bluetooth,
  CheckCircle2,
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
  'plus': Plus,
  'minus': Minus,
  'account-plus': UserPlus,
  'cash-plus': BadgeIndianRupee,
  'delete-sweep': Trash2,
  'delete': Trash2,
  'pencil': Pencil,
  'check': Check,

  // Billing
  'magnify': Search,
  'cash': Banknote,
  'cellphone': Smartphone,
  'credit-card': CreditCard,
  'account-clock': UserClock,
  'cart-outline': ShoppingCart,
  'account': User,
  'history': History,
  'plus-minus': PlusMinusIcon,
  'share-variant': Share2,

  // Printing
  'bluetooth': Bluetooth,

  // Misc
  'check-circle-outline': CheckCircle2,
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
export const AppIcon: React.FC<AppIconProps> = ({ name, size = 24, color = '#000', style }) => {
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
