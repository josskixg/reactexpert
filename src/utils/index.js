export function postedAt(date) {
  const now = new Date();
  const posted = new Date(date);
  const diff = now - posted;

  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diff / (1000 * 60));
  const diffSeconds = Math.floor(diff / 1000);

  if (diffDays > 30) {
    return posted.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
  if (diffDays > 0) {
    return `${diffDays} hari lalu`;
  }
  if (diffHours > 0) {
    return `${diffHours} jam lalu`;
  }
  if (diffMinutes > 0) {
    return `${diffMinutes} menit lalu`;
  }
  if (diffSeconds > 0) {
    return `${diffSeconds} detik lalu`;
  }
  return 'baru saja';
}

export function truncateText(text, maxLength = 160) {
  if (!text) return '';
  // strip HTML tags for plain snippet
  const plain = text.replace(/<[^>]+>/g, '').trim();
  if (plain.length <= maxLength) return plain;
  return `${plain.substring(0, maxLength)}...`;
}
