import { Model } from '@nozbe/watermelondb';
import { field, text, date, relation, children, writer } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

export default class Bill extends Model {
  static table = 'bills';

  static associations: Associations = {
    customers: { type: 'belongs_to' as const, key: 'customer_id' },
    bill_items: { type: 'has_many' as const, foreignKey: 'bill_id' },
    payments: { type: 'has_many' as const, foreignKey: 'bill_id' },
    credit_entries: { type: 'has_many' as const, foreignKey: 'bill_id' },
  };

  @field('customer_id') customerId!: string;
  @text('bill_number') billNumber!: string;
  @field('subtotal') subtotal!: number;
  @field('discount_total') discountTotal!: number;
  @field('tax_total') taxTotal!: number;
  @field('grand_total') grandTotal!: number;
  @text('payment_mode') paymentMode!: string;
  @text('status') status!: string;
  @text('notes') notes!: string;
  @date('created_at') createdAt!: Date;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @relation('customers', 'customer_id') customer: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @children('bill_items') items: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @children('payments') payments: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @children('credit_entries') creditEntries: any;

  get isCompleted(): boolean {
    return this.status === 'completed';
  }

  get isCancelled(): boolean {
    return this.status === 'cancelled';
  }

  @writer async cancelBill() {
    await this.update((bill: Bill) => {
      bill.status = 'cancelled';
    });
  }
}
