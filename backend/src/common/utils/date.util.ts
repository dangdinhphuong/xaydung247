/**
 * Diễn giải ngày nghiệp vụ theo múi giờ Asia/Ho_Chi_Minh (+07:00).
 * Chuỗi 'YYYY-MM-DD' được coi là 00:00 giờ VN.
 */
export function parseVnDate(input: string | Date): Date {
  if (input instanceof Date) return input;
  if (/T/.test(input)) return new Date(input);
  return new Date(`${input}T00:00:00+07:00`);
}

/** "Hôm nay" theo giờ VN, chuẩn hoá về 00:00. */
export function todayVn(): Date {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const ymd = fmt.format(now);
  return new Date(`${ymd}T00:00:00+07:00`);
}
