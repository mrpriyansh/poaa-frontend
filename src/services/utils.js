export const formatDate = date => {
  return date.toISOString().split('T')[0];
};

export const formatDateTime = date => {
  const d1 = new Date(date);
  return d1.toString().split('GMT')[0];
};

export const formatDateReverse = date => {
  return date.toISOString().split('T')[0];
};
