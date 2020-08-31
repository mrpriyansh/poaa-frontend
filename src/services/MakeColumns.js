/* eslint-disable no-plusplus */
/* eslint-disable import/prefer-default-export */
import XLSX from 'xlsx';
/* generate an array of column objects */
export const make_cols = refstr => {
  const o = [];
  const C = XLSX.utils.decode_range(refstr).e.c + 1;
  for (let i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
  return o;
};
