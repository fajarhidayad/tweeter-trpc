export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) throw new Error('Invalid date string');

  const dayFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric' });
  const monthFormatter = new Intl.DateTimeFormat('en-GB', { month: 'long' });
  const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const day = dayFormatter.format(date);
  const month = monthFormatter.format(date);
  const time = timeFormatter.format(date);

  return `${day} ${month} at ${time}`;
}
