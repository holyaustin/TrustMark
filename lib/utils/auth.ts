import { cookies } from 'next/headers';
import { verifyToken } from './jwt';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('trustmark_token')?.value;
  
  if (!token) return null;
  
  const payload = verifyToken(token);
  if (!payload) return null;
  
  return payload.userId;
}