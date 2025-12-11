import { eachDayOfInterval, getDate, getMonth } from 'date-fns'

type ValidDate = Date | string | number

export function getDaysBetween(startDate: ValidDate, endDate: ValidDate) {
  const _startDate = new Date(startDate)
  const _endDate = new Date(endDate)
  const days = eachDayOfInterval({
    start: _startDate,
    end: _endDate,
  })

  const byMonth = days.reduce(
    (acc, day) => {
      const month = getMonth(day)

      if (!acc[month]) {
        acc[month] = []
      }

      acc[month].push(day)
      return acc
    },
    {} as {
      [key: number]: Date[]
    },
  )

  return Object.entries(byMonth)
    .map(([_month, days]) => {
      const dates = days.map((day) => `${getDate(day)}`)
      const month = new Intl.DateTimeFormat('es-ES', {
        month: 'long',
      }).format(days[0])
      const formattedDates = new Intl.ListFormat('es-MX', {
        style: 'long',
        type: 'conjunction',
      }).format(dates)

      return `${formattedDates} de ${month}`
    })
    .join(' y ')
}
