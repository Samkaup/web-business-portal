import {
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  startOfYear,
  endOfYear,
  format
} from 'date-fns';

import { is } from 'date-fns/locale';

export function getDateNow(): Date {
  return new Date(Date.now());
}

export function getDateMonthsAgo(numMonths: number): Date {
  const date: Date = getDateNow();

  date.setMonth(date.getMonth() - numMonths);
  return date;
}

export function getDateDaysAgo(numMonths: number): Date {
  const date: Date = getDateNow();

  date.setDate(date.getDate() - numMonths);
  return date;
}
export function getStartOfYear(date?: Date): Date {
  const now: Date = getDateNow();

  return startOfYear(date ? date : now);
}

export function getEndOfYear(date?: Date): Date {
  const now: Date = getDateNow();

  return endOfYear(date ? date : now);
}

export function getStartOfMonth(date?: Date): Date {
  const now: Date = getDateNow();

  return startOfMonth(date ? date : now);
}

export function getEndOfMonth(date?: Date): Date {
  const now: Date = getDateNow();

  return endOfMonth(date ? date : now);
}

export function getStartOfDay(date?: Date): Date {
  const now: Date = getDateNow();
  return startOfDay(date ? date : now);
}

export function getEndOfDay(date?: Date): Date {
  const now: Date = getDateNow();
  return endOfDay(date ? date : now);
}

export function formatDateFns(value: Date, formatString: string): string {
  return format(value, formatString, {
    locale: is
  });
}

export function formatDate(date: Date): string {
  const yyyy: number = date.getFullYear();
  const mm: number = date.getMonth() + 1; // month is zero-based
  const dd: number = date.getDate();

  let mm_string: string = mm.toString();
  let dd_string: string = dd.toString();

  if (mm < 10) mm_string = '0' + mm_string;
  if (dd < 10) dd_string = '0' + dd_string;

  return `${yyyy}-${mm_string}-${dd_string}`;
}
