import dayjs from 'dayjs'
import  customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export const reformatDate = ({ date, inputFormat, outputFormat }) => {
  // 1. Check if the date is a valid Excel serial number
  const numericDate = Number(date);
  
  if (!isNaN(numericDate) && typeof date !== 'boolean') {
    // Convert Excel serial number to Unix milliseconds
    const unixMs = (numericDate - 25569) * 24 * 60 * 60 * 1000;
    return dayjs(unixMs).format(outputFormat);
  }

  // 2. Fallback to standard string parsing if it's not a number
  return dayjs(date, inputFormat).format(outputFormat);
};