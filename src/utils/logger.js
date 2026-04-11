/**
 * Logger utility - respects production vs development environments
 * In production, errors are sent to logging service (optional)
 * In development, full logging to console
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  /**
   * Log debug information (only in development)
   */
  debug: (message, data) => {
    if (isDevelopment) {
      console.log(`[DEBUG] ${message}`, data || "");
    }
  },

  /**
   * Log informational messages
   */
  info: (message, data) => {
    if (isDevelopment) {
      console.info(`[INFO] ${message}`, data || "");
    }
  },

  /**
   * Log warnings - shown in both dev and production
   */
  warn: (message, error) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, error || "");
    } else {
      // In production, could send to external logging service
      console.warn(`[WARN] ${message}`);
    }
  },

  /**
   * Log errors - always logged, can be sent to error tracking service
   */
  error: (message, error) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, error || "");
    } else {
      // In production, send to error tracking service (e.g., Sentry, LogRocket)
      console.error(`[ERROR] ${message}`);
      // TODO: Send to error tracking service
      // sendToErrorTrackingService(message, error);
    }
  },

  /**
   * Log API calls in development only
   */
  api: (method, url, data) => {
    if (isDevelopment) {
      console.log(`[API] ${method.toUpperCase()} ${url}`, data || "");
    }
  },
};

export default logger;
