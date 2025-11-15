import type { DBColumns } from "../db.ts";

// biome-ignore lint/complexity/noBannedTypes: no explanation
export function extractType<T extends Object, U extends Object>(
  obj: T & U,
  columns: DBColumns<T>,
  primaryKey: keyof T,
): T | undefined {
  const result = {};

  const keys = Object.keys(obj) as Array<keyof (T & U)>;

  if (!keys.includes(primaryKey) || !obj[primaryKey]) {
    return undefined;
  }

  for (const key of keys) {
    // @ts-expect-error
    if (columns.includes(key)) {
      // @ts-expect-error
      result[key] = obj[key];
    }
  }

  return result as T;
}
