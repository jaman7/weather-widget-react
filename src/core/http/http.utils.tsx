import { createSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

export function preparedHttpParamsValue(value: any): string {
  if (value instanceof String) return value.toString();
  if (dayjs.isDayjs(value)) return value.format('DD-MM-YYYY');
  if (value instanceof Date) return dayjs(value).format('DD-MM-YYYY');
  if (Array.isArray(value)) return value.join('&');

  return value.toString();
}

export function toHttpParams(data: any): URLSearchParams {
  if (!data) return new URLSearchParams();
  return createSearchParams(data);
}
