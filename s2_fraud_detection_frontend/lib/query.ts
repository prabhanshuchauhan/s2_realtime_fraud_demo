import mysql from 'mysql2/promise';

/**
 * Connection pool — uses env vars to stay compatible with Cloud / local.
 *
 * Required vars (put in `.env.local`):
 *   DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
 * Optional:
 *   SINGLESTORE_CERT   – server CA bundle (escaped \n OK)
 *   DB_PORT            – defaults to 3306
 */
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.SINGLESTORE_CERT
    ? { ca: process.env.SINGLESTORE_CERT.replace(/\\n/g, '\n') }
    : undefined,
  waitForConnections: true,
  connectionLimit: 10,
});

/**
 * Simple typed query helper.
 *
 * ```ts
 * const rows = await query<User>("SELECT * FROM users WHERE user_id = ?", [42]);
 * ```
 */
export async function query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}
