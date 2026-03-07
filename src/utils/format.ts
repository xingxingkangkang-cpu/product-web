/**
 * Number and date formatting helpers.
 */

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('zh-CN').format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatHourLabel(iso: string): string {
  const date = new Date(iso);
  return `${String(date.getUTCHours()).padStart(2, '0')}:00`;
}

export function formatDateTime(iso?: string): string {
  if (!iso) {
    return '--';
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
    .format(date)
    .replace(/\//g, '-');
}

export function formatRelativeTime(iso?: string): string {
  if (!iso) {
    return '等待数据';
  }

  const timestamp = new Date(iso).getTime();
  if (Number.isNaN(timestamp)) {
    return '等待数据';
  }

  const diffSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (diffSeconds < 10) {
    return '刚刚更新';
  }

  if (diffSeconds < 60) {
    return `${diffSeconds} 秒前更新`;
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} 分钟前更新`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} 小时前更新`;
  }

  return `${Math.floor(diffHours / 24)} 天前更新`;
}
