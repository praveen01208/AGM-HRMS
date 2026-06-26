// Date formatting utilities

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

export function formatDateShort(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short'
  });
}

export function daysBetween(from: string, to: string): number {
  const start = new Date(from);
  const end = new Date(to);
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++; // skip weekends
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function isWeekend(date: string): boolean {
  const d = new Date(date).getDay();
  return d === 0 || d === 6;
}

export function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}
