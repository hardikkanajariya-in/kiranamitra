import { Model } from '@nozbe/watermelondb';
import {
  text,
  field,
  date,
  readonly,
  children,
  immutableRelation,
  writer,
} from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

export default class Product extends Model {
  static table = 'products';

  static associations: Associations = {
    categories: { type: 'belongs_to' as const, key: 'category_id' },
    bill_items: { type: 'has_many' as const, foreignKey: 'product_id' },
    inventory_logs: { type: 'has_many' as const, foreignKey: 'product_id' },
  };

  @text('name') name!: string;
  @field('category_id') categoryId!: string;
  @field('purchase_price') purchasePrice!: number;
  @field('selling_price') sellingPrice!: number;
  @text('unit') unit!: string;
  @text('barcode') barcode!: string;
  @field('low_stock_threshold') lowStockThreshold!: number;
  @field('current_stock') currentStock!: number;
  @field('is_active') isActive!: boolean;
  @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @immutableRelation('categories', 'category_id') category: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @children('bill_items') billItems: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @children('inventory_logs') inventoryLogs: any;

  get isLowStock(): boolean {
    return this.currentStock > 0 && this.currentStock <= this.lowStockThreshold;
  }

  get isOutOfStock(): boolean {
    return this.currentStock <= 0;
  }

  get profitMargin(): number {
    if (this.sellingPrice === 0) { return 0; }
    return ((this.sellingPrice - this.purchasePrice) / this.sellingPrice) * 100;
  }

  @writer async updateProduct(data: {
    name?: string;
    categoryId?: string;
    purchasePrice?: number;
    sellingPrice?: number;
    unit?: string;
    barcode?: string;
    lowStockThreshold?: number;
  }) {
    await this.update((product: Product) => {
      if (data.name !== undefined) { product.name = data.name; }
      if (data.categoryId !== undefined) { product.categoryId = data.categoryId; }
      if (data.purchasePrice !== undefined) { product.purchasePrice = data.purchasePrice; }
      if (data.sellingPrice !== undefined) { product.sellingPrice = data.sellingPrice; }
      if (data.unit !== undefined) { product.unit = data.unit; }
      if (data.barcode !== undefined) { product.barcode = data.barcode; }
      if (data.lowStockThreshold !== undefined) { product.lowStockThreshold = data.lowStockThreshold; }
    });
  }

  @writer async adjustStock(change: number) {
    await this.update((product: Product) => {
      product.currentStock = product.currentStock + change;
    });
  }

  @writer async deactivate() {
    await this.update((product: Product) => {
      product.isActive = false;
    });
  }
}
