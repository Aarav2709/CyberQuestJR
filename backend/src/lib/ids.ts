import { ulid } from 'ulid';

/**
 * Generate a ULID (Universally Unique Lexicographically Sortable Identifier)
 * Used for certificates and other entities where sortable IDs are beneficial
 */
export function generateUlid(): string {
  return ulid();
}

/**
 * Generate a short verification code for certificates
 * Format: XXXX-XXXX-XXXX (alphanumeric, uppercase)
 */
export function generateVerificationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous characters (0, O, 1, I)
  const segments = 3;
  const segmentLength = 4;

  const parts: string[] = [];
  for (let i = 0; i < segments; i++) {
    let segment = '';
    for (let j = 0; j < segmentLength; j++) {
      segment += chars[Math.floor(Math.random() * chars.length)];
    }
    parts.push(segment);
  }

  return parts.join('-');
}

/**
 * Generate a secure random token for sessions
 */
export function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
