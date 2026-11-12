const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export function formatNumber(value) {
  const n = Number(value) || 0;
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatMoney(value) {
  const n = Number(value) || 0;
  const [integer, decimals] = n.toFixed(2).split('.');
  return `$${integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimals} mxn`;
}

export function formatShortDate(date = new Date()) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatClock(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function formatMovementDate(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((startToday - startDate) / 86400000);

  if (diffDays === 0) return `Hoy, ${formatClock(date)}`;
  if (diffDays === 1) return `Ayer, ${formatClock(date)}`;
  return `${date.getDate()} ${MONTHS[date.getMonth()]}, ${formatClock(date)}`;
}

export function formatResponsibleDate(isoDate) {
  return `${formatMovementDate(isoDate)} · Ana García`;
}

export function getStockStatus(product) {
  if (!product) {
    return { key: 'out', label: 'Sin Stock', tone: 'out' };
  }
  if (product.stock <= 0) {
    return { key: 'out', label: 'Sin Stock', tone: 'out' };
  }
  if (product.stock <= product.minStock) {
    return { key: 'low', label: 'Bajo Stock', tone: 'low' };
  }
  return { key: 'ok', label: 'En Stock', tone: 'ok' };
}

export function getStockRatio(product) {
  if (!product) return 0;
  const reference = Math.max(product.minStock * 2, 1);
  return Math.max(0, Math.min(1, product.stock / reference));
}

export function deficit(product) {
  return Math.max(0, (product?.minStock || 0) - (product?.stock || 0));
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function makeId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}
