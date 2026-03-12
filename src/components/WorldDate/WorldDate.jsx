import { ThyatianDays, ThyatianMonths } from './thyatianCalendar'

function suffix(day) {
  if ([1, 21].includes(day)) return 'st'
  if ([2, 22].includes(day)) return 'nd'
  if ([3, 23].includes(day)) return 'rd'
  return 'th'
}

function WorldDate({ shortDate }) {
  const [day, month, year] = shortDate.split('/').map(Number)
  const dayOfWeek = day % 7 === 0 ? 7 : day % 7

  const formatted = `${ThyatianDays[dayOfWeek]} ${day}${suffix(day)}, ${ThyatianMonths[month]}, ${year} AC`

  return <span>{formatted}</span>
}

export default WorldDate
