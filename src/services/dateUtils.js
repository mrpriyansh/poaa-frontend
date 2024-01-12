import dayjs from 'dayjs'
import  customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export const reformatDate = ({date, inputFormat, outputFormat}) => {
	return dayjs(date, inputFormat).format(outputFormat)
}