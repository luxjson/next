import { pool } from './db.js';

export async function findAdminByUsername(username) {
  const result = await pool.query('SELECT id, username, password_hash FROM admins WHERE username = $1', [username]);
  return result.rows[0] || null;
}

export async function findAdminById(id) {
  const result = await pool.query('SELECT id, username, created_at FROM admins WHERE id = $1', [id]);
  return result.rows[0] || null;
}
