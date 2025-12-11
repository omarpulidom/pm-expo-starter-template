import { formatDate } from 'date-fns'

export function dateToLocalTimeString(date: Date, preferFormat = false) {
  if (preferFormat) {
    return formatDate(date, 'hh:mm a')
  }

  return date.toLocaleTimeString?.() ?? formatDate(date, 'hh:mm a')
}

export function dateToLocalDateString(date: Date) {
  return date.toLocaleDateString?.() ?? formatDate(date, 'dd.MM.yyyy')
}
