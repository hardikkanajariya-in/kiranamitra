import { Model } from '@nozbe/watermelondb';
import { text, date, children } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

export default class Category extends Model {
  static table = 'categories';

  static associations: Associations = {
    products: { type: 'has_many' as const, foreignKey: 'category_id' },
  };

  @text('name') name!: string;
  @text('icon') icon!: string;
  @date('created_at') createdAt!: Date;

  @children('products') products: any;
}
