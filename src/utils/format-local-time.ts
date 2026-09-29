/** '20:59:14 GMT'. Always GMT, wherever the visitor is. */
export const formatLocalTime = (date: Date = new Date()): string => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZone: 'UTC',
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';

  return `${get('hour')}:${get('minute')}:${get('second')} GMT`;
};
