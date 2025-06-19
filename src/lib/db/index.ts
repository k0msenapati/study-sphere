import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema';

const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite, { schema });

// Run migration
try {
  migrate(db, { migrationsFolder: 'drizzle' });
  console.log('Migrations completed');
} catch (error) {
  console.error('Migration failed:', error);
}