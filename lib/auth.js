import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { findAdminById, findAdminByUsername } from './admin.js';

export function generateToken(admin) {
  return jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export function getBearerToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
}

export function requireAuth(request) {
  const token = getBearerToken(request);
  if (!token) return { error: { status: 401, message: 'Token not found' } };
  try {
    return { admin: jwt.verify(token, process.env.JWT_SECRET) };
  } catch {
    return { error: { status: 401, message: 'Invalid or expired token' } };
  }
}

export async function loginAdmin(username, password) {
  if (!username || !password) return { error: { status: 400, message: 'Usuário e senha são obrigatórios' } };
  const admin = await findAdminByUsername(username);
  if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
    return { error: { status: 401, message: 'Credenciais inválidas' } };
  }
  const token = generateToken(admin);
  return { token, admin: { id: admin.id, username: admin.username, created_at: admin.created_at } };
}

export async function getCurrentAdmin(id) {
  return findAdminById(id);
}
