export const formatDate = date => {
  return date.toISOString().split('T')[0];
};

export const formatDateTime = date => {
  const d1 = new Date(date);
  return d1.toString().split('GMT')[0];
};

export const formatDateReverse = date => {
  const splits = date
    .toISOString()
    .split('T')[0]
    .split('-');
  return splits[2] + '-' + splits[1] + '-' + splits[0];
};

export const isNull = (obj, fields) => {
  let empty = false;
  fields.forEach(prop => {
    if (obj[prop]?.length === 0) {
      empty = true;
    }
  });
  return empty;
};
