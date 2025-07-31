/**
 * Utility functions for safe localStorage operations
 * Prevents JSON parsing errors and handles edge cases
 */

export interface StorageResult<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Safely get and parse JSON data from localStorage
 */
export function safeGetFromStorage<T>(key: string): StorageResult<T> {
  try {
    if (typeof window === 'undefined') {
      return { success: false, error: 'Window not available (SSR)' }
    }

    const item = localStorage.getItem(key)
    
    if (item === null) {
      return { success: false, error: 'Item not found' }
    }

    // Check if the item is a valid JSON string
    if (!item.trim().startsWith('{') && !item.trim().startsWith('[') && !item.trim().startsWith('"')) {
      // If it's a simple string value
      return { success: true, data: item as unknown as T }
    }

    const parsedData = JSON.parse(item)
    return { success: true, data: parsedData }

  } catch (error) {
    console.error(`Error parsing localStorage item "${key}":`, error)
    // Clear corrupted data
    try {
      localStorage.removeItem(key)
    } catch (clearError) {
      console.error(`Failed to clear corrupted localStorage item "${key}":`, clearError)
    }
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown parsing error' 
    }
  }
}

/**
 * Safely set JSON data to localStorage
 */
export function safeSetToStorage<T>(key: string, data: T): StorageResult<T> {
  try {
    if (typeof window === 'undefined') {
      return { success: false, error: 'Window not available (SSR)' }
    }

    const serializedData = typeof data === 'string' ? data : JSON.stringify(data)
    localStorage.setItem(key, serializedData)
    
    return { success: true, data }

  } catch (error) {
    console.error(`Error setting localStorage item "${key}":`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown storage error' 
    }
  }
}

/**
 * Safely remove item from localStorage
 */
export function safeRemoveFromStorage(key: string): StorageResult<null> {
  try {
    if (typeof window === 'undefined') {
      return { success: false, error: 'Window not available (SSR)' }
    }

    localStorage.removeItem(key)
    return { success: true, data: null }

  } catch (error) {
    console.error(`Error removing localStorage item "${key}":`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown removal error' 
    }
  }
}

/**
 * Clear all localStorage data safely
 */
export function safeClearStorage(): StorageResult<null> {
  try {
    if (typeof window === 'undefined') {
      return { success: false, error: 'Window not available (SSR)' }
    }

    localStorage.clear()
    return { success: true, data: null }

  } catch (error) {
    console.error('Error clearing localStorage:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown clear error' 
    }
  }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') return false
    
    const test = '__storage_test__'
    localStorage.setItem(test, 'test')
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}
