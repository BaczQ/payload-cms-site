/**
 * Formats a date string to a readable format like "December 10, 2025"
 * @param timestamp - The date string to format
 * @returns Formatted date string
 */
export const formatCategoryDate = (timestamp: string | null | undefined): string | null => {
  if (!timestamp) return null

  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return null

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const month = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()

  return `${month} ${day}, ${year}`
}
