import { Model } from '@nozbe/watermelondb';
import { field, text, date, immutableRelation, relation } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

export default class CreditEntry extends Model {
  static table = 'credit_entries';

  static associations: Associations = {
    customers: { type: 'belongs_to' as const, key: 'customer_id' },
    bills: { type: 'belongs_to' as const, key: 'bill_id' },
  };

  @field('customer_id') customerId!: string;
  @field('bill_id') billId!: string;
  @text('entry_type') entryType!: string;
  @field('amount') amount!: number;
  @field('balance_after') balanceAfter!: number;
  @text('notes') notes!: string;
  @date('created_at') createdAt!: Date;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @immutableRelation('customers', 'customer_id') customer: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @relation('bills', 'bill_id') bill: any;

  get isCredit(): boolean {
    return this.entryType === 'credit';
  }

  get isPayment(): boolean {
    return this.entryType === 'payment';
  }

  get isAdvance(): boolean {
    return this.entryType === 'advance';
  }

  get isAdvanceUsed(): boolean {
    return this.entryType === 'advance_used';
  }
}
