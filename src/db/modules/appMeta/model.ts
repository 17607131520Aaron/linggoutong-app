import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class AppMeta extends Model {
  static table = 'app_meta' as const;

  @field('key') key!: string;
  @field('value') value?: string;
}
