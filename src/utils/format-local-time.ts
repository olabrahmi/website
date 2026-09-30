/** '02:58:28 PM', in GMT, whatever the visitor's own timezone is. */
export const formatLocalTime = (date: Date = new Date()): string =>
  date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });
