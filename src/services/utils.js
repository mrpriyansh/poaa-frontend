import CryptoJS from 'crypto-js';
import config from './config';

export const formatDate = date => {
  return date.split('T')[0];
};

export const formatDateTime = date => {
  const d1 = new Date(date);
  return d1.toString().split('GMT')[0];
};

export const formatDateReverse = date => {
  const splits = date.split('T')[0].split('-');
  return splits[2] + '-' + splits[1] + '-' + splits[0];
};

export const isNull = (obj, fields) => {
  let empty = false;
  fields.forEach(prop => {
    if (!obj?.[prop]?.length ) {
      empty = true;
    }
  });
  return empty;
};

export const encryptString = string =>
  CryptoJS.AES.encrypt(string, config.env.ENCRYPT_KEY).toString();

export const isKeyCodePressed = (event, allowedKeyCodes=[])=> {
    const {keyCode} = event;
    if(!keyCode) return false;
    return allowedKeyCodes.includes(keyCode)
}

export const isKeyDown = (event) => {
  const {type} =  event;
  return type==="keydown"
}
