/**
 * Safe date formatting utilities to prevent hydration mismatches
 * Ensures consistent date formatting between server and client
 */

/**
 * Format date in a consistent way (YYYY-MM-DD) regardless of locale
 */
export function formatDateConsistent(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date'
  }
  
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

/**
 * Format date in a user-friendly way but consistently
 */
export function formatDateFriendly(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date'
  }
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  
  const day = dateObj.getDate()
  const month = months[dateObj.getMonth()]
  const year = dateObj.getFullYear()
  
  return `${day} ${month} ${year}`
}

/**
 * Format date for display with hydration safety
 * Returns null during SSR, actual formatted date on client
 */
export function formatDateSafe(date: Date | string, mounted: boolean = true): string | null {
  if (!mounted) {
    return null // Return null during SSR to prevent hydration mismatch
  }
  
  return formatDateFriendly(date)
}

/**
 * Get relative time string (e.g., "2 days ago")
 */
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  
  return `${Math.floor(diffDays / 365)} years ago`
}

/**
 * Check if a date is valid
 */
export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime())
}

/**
 * Safe date parsing that handles various input formats
 */
export function parseDate(dateInput: string | Date | number): Date | null {
  try {
    if (dateInput instanceof Date) {
      return isValidDate(dateInput) ? dateInput : null
    }
    
    const date = new Date(dateInput)
    return isValidDate(date) ? date : null
  } catch {
    return null
  }
}
