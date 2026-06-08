/** Escape ký tự đặc biệt để dùng an toàn trong MongoDB regex */
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
