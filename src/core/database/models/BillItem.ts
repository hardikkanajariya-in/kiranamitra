import { Model } from '@nozbe/watermelondb';
import { field, text, immutableRelation } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

export default class BillItem extends Model {
  static table = 'bill_items';

  static associations: Associations = {
    bills: { type: 'belongs_to' as const, key: 'bill_id' },
    products: { type: 'belongs_to' as const, key: 'product_id' },
  };

  @field('bill_id') billId!: string;
  @field('product_id') productId!: string;
  @text('product_name') productName!: string;
  @field('quantity') quantity!: number;
  @field('unit_price') unitPrice!: number;
  @field('discount') discount!: number;
  @field('total') total!: number;

  @immutableRelation('bills', 'bill_id') bill: any;
  @immutableRelation('products', 'product_id') product: any;
}
