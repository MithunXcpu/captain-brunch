// Input validation utilities for security

export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  // Remove any HTML/script tags and trim
  return input.replace(/<[^>]*>/g, '').trim().slice(0, 500);
}

export function validatePhoneNumber(phone: unknown): string | null {
  if (!phone || typeof phone !== 'string') return null;
  // Remove all non-numeric characters except + at start
  const cleaned = phone.replace(/[^\d+]/g, '');
  // Basic validation: should be 10-15 digits
  if (cleaned.length < 10 || cleaned.length > 16) return null;
  return cleaned;
}

export function validateAmount(amount: unknown): number | null {
  const num = Number(amount);
  if (isNaN(num) || num < 0 || num > 1000000) return null;
  // Round to 2 decimal places
  return Math.round(num * 100) / 100;
}

export function validatePercentage(percentage: unknown): number | null {
  const num = Number(percentage);
  if (isNaN(num) || num < 0 || num > 100) return null;
  return num;
}

export function validateId(id: unknown): string | null {
  if (typeof id !== 'string') return null;
  // Allow alphanumeric and hyphens (CUID format)
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) return null;
  if (id.length > 50) return null;
  return id;
}

export interface ValidatedParticipant {
  name: string;
  phone?: string;
  amount?: number;
}

export function validateParticipants(
  participants: unknown
): ValidatedParticipant[] | null {
  if (!Array.isArray(participants)) return null;
  if (participants.length === 0 || participants.length > 50) return null;

  const validated: ValidatedParticipant[] = [];

  for (const p of participants) {
    if (typeof p !== 'object' || p === null) return null;

    const name = sanitizeString((p as Record<string, unknown>).name);
    if (!name || name.length < 1) return null;

    const phone = validatePhoneNumber((p as Record<string, unknown>).phone);
    const amount = validateAmount((p as Record<string, unknown>).amount);

    validated.push({
      name,
      phone: phone ?? undefined,
      amount: amount ?? undefined,
    });
  }

  return validated;
}
