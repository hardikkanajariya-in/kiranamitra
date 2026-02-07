import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

export const migrations = schemaMigrations({
  migrations: [
    // Future migrations go here. Example:
    // {
    //   toVersion: 2,
    //   steps: [
    //     addColumns({
    //       table: 'products',
    //       columns: [{ name: 'image_uri', type: 'string', isOptional: true }],
    //     }),
    //   ],
    // },
  ],
});
