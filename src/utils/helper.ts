export const limitText = (sentence?: string | null, limit?: number) =>
  limit
    ? sentence && sentence.length > limit
      ? sentence.slice(0, limit) + '...'
      : sentence
    : sentence;

export const dateLocale = (date: Date | string) => {
  const conv = new Date(date);
  return conv.toLocaleDateString('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

export const timeLocale = (date: Date | string) => {
  const conv = new Date(date);
  return conv.toLocaleTimeString('en', {
    hour: 'numeric',
    minute: '2-digit',
    // year: 'numeric',
  });
};

export const dateTimeLocale = (date: Date | string) => {
  const conv = new Date(date);
  return conv.toLocaleString('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const firstUpperCase = (word?: string) => {
  if (!word) return '';
  return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
};

export const getDurationFromDates = (start: Date, end: Date) => {
  return Math.round(
    (end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000)
  );
};

export const formatDate = (date: string | Date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [day, month, year].join('/');
};

export const timeFromDate = (date: Date | undefined) =>
  date &&
  date.toLocaleTimeString('en', {
    hour: 'numeric',
    minute: '2-digit',
  });

export const weeksBtwDates = (d1: Date, d2: Date) => {
  return Math.round((d2.getTime() - d1.getTime()) / (7 * 24 * 60 * 60 * 1000));
};

export const timeToDate = (dStr: string | undefined) => {
  let now = new Date();
  const hour = Number(dStr?.split(':')[0]);
  const minute = Number(dStr?.split(':')[1].split(' ')[0]);
  now.setHours(hour || 0);
  now.setMinutes(minute || 0);
  now.setSeconds(0);
  return now;
};

export const removeUndefined = (object: any) => {
  Object.keys(object).forEach((key) =>
    object[key] === undefined ? delete object[key] : {}
  );
  return object;
};
