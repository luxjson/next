import { Pool } from 'pg';

const globalForPg = globalThis;

function getDatabaseConfig() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error('DATABASE_URL is not configured');

  const url = new URL(raw);
  const sslMode = url.searchParams.get('sslmode');
  const useSsl = sslMode === 'require' || sslMode === 'verify-ca' || sslMode === 'verify-full' || sslMode === 'prefer' || process.env.DATABASE_SSL === 'true';

  return {
    host: url.hostname,
    port: Number(url.port || 5432),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.replace(/^\//, '')),
    ssl: useSsl ? { rejectUnauthorized: false } : false,
  };
}

const config = getDatabaseConfig();

export const pool = globalForPg.__luxjsonPgPool || new Pool({
  ...config,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
  maxUses: 7500,
});

if (process.env.NODE_ENV !== 'production') globalForPg.__luxjsonPgPool = pool;

pool.on('error', (err) => console.error('Unable to connect to PostgreSQL:', err));
