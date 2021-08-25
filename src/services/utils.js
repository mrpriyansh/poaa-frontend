export const formatDate = date =>
  `${date.split('-')[2][0]}${date.split('-')[2][1]}-${date.split('-')[1]}-${date.split('-')[0]}`;
export const formatDateTime = date => {
  const d1 = new Date(date);
  return d1.toString().split('GMT')[0];
};
