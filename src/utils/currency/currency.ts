export const formatCurrency = (value: number) => {
  if (!value) {
    return '';
  }
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.';
};
