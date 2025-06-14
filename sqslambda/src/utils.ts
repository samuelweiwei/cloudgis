import { MessagePayload } from './types.js';

/**
 * Validates if a message payload has the required structure
 */
export function validateMessagePayload(payload: any): payload is MessagePayload {
  if (!payload || typeof payload !== 'object') {
    return false;
  }
  
  if (!payload.action || typeof payload.action !== 'string') {
    return false;
  }
  
  switch (payload.action) {
    case 'process_order':
      return validateOrderMessage(payload);
    case 'send_notification':
      return validateNotificationMessage(payload);
    default:
      return false;
  }
}

function validateOrderMessage(payload: any): boolean {
  return !!(
    payload.orderId &&
    payload.customerId &&
    Array.isArray(payload.items) &&
    typeof payload.totalAmount === 'number' &&
    payload.timestamp
  );
}

function validateNotificationMessage(payload: any): boolean {
  return !!(
    payload.type &&
    ['email', 'sms', 'push'].includes(payload.type) &&
    payload.recipient &&
    payload.message &&
    payload.timestamp
  );
}

/**
 * Formats log messages with timestamp
 */
export function logMessage(level: 'INFO' | 'ERROR' | 'WARN', message: string, data?: any): void {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...(data && { data })
  };
  
  console.log(JSON.stringify(logEntry));
}

/**
 * Retry utility for operations that might fail
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      logMessage('WARN', `Operation failed, retrying... (${attempt}/${maxRetries})`, {
        error: lastError.message
      });
      
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError!;
}