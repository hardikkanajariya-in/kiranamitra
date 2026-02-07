import { Model } from '@nozbe/watermelondb';
import { field, text, date, relation } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

export default class Payment extends Model {
  static table = 'payments';

  static associations: Associations = {
    bills: { type: 'belongs_to' as const, key: 'bill_id' },
    customers: { type: 'belongs_to' as const, key: 'customer_id' },
  };

  @field('bill_id') billId!: string;
  @field('customer_id') customerId!: string;
  @field('amount') amount!: number;
  @text('payment_mode') paymentMode!: string;
  @text('notes') notes!: string;
  @date('created_at') createdAt!: Date;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @relation('bills', 'bill_id') bill: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @relation('customers', 'customer_id') customer: any;
}
