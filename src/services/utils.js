export const formatDate = date => {
  return date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
};

export const formatDateTime = date => {
  const d1 = new Date(date);
  return d1.toString().split('GMT')[0];
};
