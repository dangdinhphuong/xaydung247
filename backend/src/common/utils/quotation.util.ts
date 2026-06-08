import { todayVn } from './date.util';

/**
 * F-10: isExpired = (status = 'sent') AND (validUntil < today). Dẫn xuất, không lưu DB.
 */
export function attachIsExpiredOne<
  T extends { status: string; validUntil: Date | string },
>(quotation: T, today: Date = todayVn()): T & { isExpired: boolean } {
  const isExpired =
    quotation.status === 'sent' && new Date(quotation.validUntil) < today;
  return { ...quotation, isExpired };
}

export function attachIsExpiredMany<
  T extends { status: string; validUntil: Date | string },
>(quotations: T[]): Array<T & { isExpired: boolean }> {
  const today = todayVn();
  return quotations.map((q) => attachIsExpiredOne(q, today));
}
