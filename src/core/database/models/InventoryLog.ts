import { Model } from '@nozbe/watermelondb';
import { field, text, date, immutableRelation } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

export default class InventoryLog extends Model {
  static table = 'inventory_logs';

  static associations: Associations = {
    products: { type: 'belongs_to' as const, key: 'product_id' },
  };

  @field('product_id') productId!: string;
  @field('quantity_change') quantityChange!: number;
  @text('reason') reason!: string;
  @text('notes') notes!: string;
  @date('created_at') createdAt!: Date;

  @immutableRelation('products', 'product_id') product: any;

  get isAddition(): boolean {
    return this.quantityChange > 0;
  }
}
