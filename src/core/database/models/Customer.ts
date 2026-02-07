import { Model } from '@nozbe/watermelondb';
import { text, field, date, readonly, children, writer, lazy } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';
import { Q } from '@nozbe/watermelondb';

export default class Customer extends Model {
  static table = 'customers';

  static associations: Associations = {
    bills: { type: 'has_many' as const, foreignKey: 'customer_id' },
    credit_entries: { type: 'has_many' as const, foreignKey: 'customer_id' },
    payments: { type: 'has_many' as const, foreignKey: 'customer_id' },
  };

  @text('name') name!: string;
  @text('phone') phone!: string;
  @text('address') address!: string;
  @text('notes') notes!: string;
  @field('is_active') isActive!: boolean;
  @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('bills') bills: any;
  @children('credit_entries') creditEntries: any;
  @children('payments') payments: any;

  @lazy
  get outstandingCredit() {
    return this.collections
      .get('credit_entries')
      .query(Q.where('customer_id', this.id))
      .observe();
  }

  @writer async updateCustomer(data: {
    name?: string;
    phone?: string;
    address?: string;
    notes?: string;
  }) {
    await this.update((customer) => {
      if (data.name !== undefined) customer.name = data.name;
      if (data.phone !== undefined) customer.phone = data.phone;
      if (data.address !== undefined) customer.address = data.address;
      if (data.notes !== undefined) customer.notes = data.notes;
    });
  }

  @writer async markInactive() {
    await this.update((customer) => {
      customer.isActive = false;
    });
  }
}
