export const formatSsn = (ssn: string) =>
  `${ssn.slice(0, 6)}-${ssn.slice(6, 10)} kt.`;
