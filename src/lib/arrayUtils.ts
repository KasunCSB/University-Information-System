/**
 * Utility functions for safe array operations to prevent runtime errors
 */

/**
 * Safely maps over an array, returning empty array if input is null/undefined
 */
export function safeMap<T, U>(
  array: T[] | null | undefined,
  callback: (item: T, index: number, array: T[]) => U
): U[] {
  return (array || []).map(callback);
}

/**
 * Safely filters an array, returning empty array if input is null/undefined
 */
export function safeFilter<T>(
  array: T[] | null | undefined,
  predicate: (item: T, index: number, array: T[]) => boolean
): T[] {
  return (array || []).filter(predicate);
}

/**
 * Safely finds an item in an array, returning undefined if array is null/undefined
 */
export function safeFind<T>(
  array: T[] | null | undefined,
  predicate: (item: T, index: number, array: T[]) => boolean
): T | undefined {
  return (array || []).find(predicate);
}

/**
 * Safely gets array length, returning 0 if array is null/undefined
 */
export function safeLength<T>(array: T[] | null | undefined): number {
  return (array || []).length;
}

/**
 * Safely accesses array index, returning undefined if out of bounds or array is null/undefined
 */
export function safeGet<T>(array: T[] | null | undefined, index: number): T | undefined {
  if (!array || index < 0 || index >= array.length) {
    return undefined;
  }
  return array[index];
}

/**
 * Safely slices an array, returning empty array if input is null/undefined
 */
export function safeSlice<T>(
  array: T[] | null | undefined,
  start?: number,
  end?: number
): T[] {
  return (array || []).slice(start, end);
}
