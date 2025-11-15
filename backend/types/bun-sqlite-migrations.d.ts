declare module "bun-sqlite-migrations" {
  import type { Database } from "bun:sqlite";

  export interface Migration {
    id: number;
    name: string;
    sql: string;
  }

  export function getMigrations(migrationsPath: string): Migration[];
  export function migrate(db: Database, migrations: Migration[]): void;
  export function rollback(db: Database, migrationsPath: string): void;
  export function createMigration(name: string, migrationsPath: string): void;
}
