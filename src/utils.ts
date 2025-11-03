export function parseDateBR(input: string): Date | null {
  // Primeiro tenta o formato DD/MM/YYYY
  const match = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // JS months 0-11
    const year = parseInt(match[3], 10);
    return new Date(year, month, day);
  }

  // Depois tenta YYYY-MM-DD (como usuário também pode digitar)
  const isoMatch = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10) - 1;
    const day = parseInt(isoMatch[3], 10);
    return new Date(year, month, day);
  }

  return null; // formato inválido
}