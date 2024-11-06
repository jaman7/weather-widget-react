import dayjs from 'dayjs';

export function preparedHttpParamsValue(value: any): string {
  if (value instanceof String) return value.toString();
  if (dayjs.isDayjs(value)) return value.format('DD-MM-YYYY');
  if (value instanceof Date) return dayjs(value).format('DD-MM-YYYY');
  if (Array.isArray(value)) return value.join('&');

  return value.toString();
}

export function toHttpParams<T>(data: T): URLSearchParams {
  const params = new URLSearchParams();
  if (!data) return params;

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      params.append(key, value.join(','));
      console.log(value.join(','));
    } else if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  return params;
}
