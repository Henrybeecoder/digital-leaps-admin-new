export const limitText = (sentence?: string | null, limit?: number) =>
  limit
    ? sentence && sentence.length > limit
      ? sentence.slice(0, limit) + '...'
      : sentence
    : sentence;

export const formatCurrency = (value?: number) =>
  value ? '₦' + value.toLocaleString('en', { currency: 'NGN' }).toString() : 0;

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

export const formatDate = (date: string | Date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [day, month, year].join('/');
};
