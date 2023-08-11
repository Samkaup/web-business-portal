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
