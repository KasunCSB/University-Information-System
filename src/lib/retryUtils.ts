// Retry utility for API calls
interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxAttempts = 3, delay = 1000, backoff = true } = options;
  
  let lastError: Error = new Error('No attempts made');
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Don't retry on the last attempt
      if (attempt === maxAttempts) {
        break;
      }
      
      // Don't retry on certain error types
      if (isNonRetryableError(error)) {
        break;
      }
      
      // Calculate delay with optional backoff
      const currentDelay = backoff ? delay * Math.pow(2, attempt - 1) : delay;
      
      console.warn(`Attempt ${attempt} failed, retrying in ${currentDelay}ms...`, error);
      
      await new Promise(resolve => setTimeout(resolve, currentDelay));
    }
  }
  
  throw lastError;
}

function isNonRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  
  // Don't retry on authentication errors, validation errors, etc.
  const nonRetryableMessages = [
    'invalid credentials',
    'validation failed',
    'unauthorized',
    'forbidden',
    'not found'
  ];
  
  return nonRetryableMessages.some(msg => 
    error.message.toLowerCase().includes(msg)
  );
}

// Hook for retry functionality in React components
import { useState, useCallback } from 'react';

export function useRetry() {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const retry = useCallback(async <T>(
    fn: () => Promise<T>,
    options?: RetryOptions
  ): Promise<T> => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      const result = await withRetry(fn, options);
      setIsRetrying(false);
      return result;
    } catch (error) {
      setIsRetrying(false);
      throw error;
    }
  }, []);
  
  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);
  
  return { retry, isRetrying, retryCount, reset };
}
