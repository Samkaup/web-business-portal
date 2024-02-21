export const formatCurrency = (value: number) => {
  if (!value || value === 0) {
    return '';
  }
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.';
};
