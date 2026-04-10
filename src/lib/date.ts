function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function formatLocalDate(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getRelativeLocalDate(offsetDays: number, baseDate = new Date()) {
  const shifted = new Date(baseDate);
  shifted.setDate(shifted.getDate() + offsetDays);
  return formatLocalDate(shifted);
}

export function parseStoredDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  const dmy = dateStr.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    let year = Number(y);
    if (year < 100) year += 2000;

    const day = Number(d);
    const month = Number(m);
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;

    const result = new Date(Date.UTC(year, month - 1, day));
    if (result.getUTCFullYear() !== year || result.getUTCMonth() !== month - 1 || result.getUTCDate() !== day) {
      return null;
    }

    return result;
  }

  const iso = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    const [, y, m, d] = iso;
    const year = Number(y);
    const month = Number(m);
    const day = Number(d);
    const result = new Date(Date.UTC(year, month - 1, day));
    if (result.getUTCFullYear() !== year || result.getUTCMonth() !== month - 1 || result.getUTCDate() !== day) {
      return null;
    }

    return result;
  }

  return null;
}