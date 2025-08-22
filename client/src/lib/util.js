// Show only time
export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Label for date separator
export function getDateLabel(date) {
  const d = new Date(date);
  const now = new Date();

  const isToday = d.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  return d.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
}
