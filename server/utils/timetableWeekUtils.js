function parseDateValue(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [year, month, day] = trimmed.split("-").map(Number);
      return new Date(year, month - 1, day);
    }

    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function formatDateValue(value) {
  const date = parseDateValue(value);
  if (!date) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftDateByDays(value, days) {
  const date = parseDateValue(value);
  if (!date) return null;

  const shifted = new Date(date);
  shifted.setDate(shifted.getDate() + days);
  return shifted;
}

function getWeekDateRange(referenceDate = new Date()) {
  const baseDate = parseDateValue(referenceDate) || new Date();
  const start = new Date(baseDate);
  const day = start.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + mondayOffset);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

module.exports = {
  parseDateValue,
  formatDateValue,
  shiftDateByDays,
  getWeekDateRange,
};