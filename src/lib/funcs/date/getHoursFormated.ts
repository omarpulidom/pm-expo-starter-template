import { formatDate } from 'date-fns'

export function getHoursFormated(startDate: Date, endDate: Date) {
  return `${formatDate(startDate, 'hh:mm a')} - ${formatDate(endDate, 'hh:mm a')}`
}
