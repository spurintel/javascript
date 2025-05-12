/**
 * Error handling utilities for the monocle-backend package.
 * @module errors
 */

import { buildErrorFactory } from '@spur.us/shared/error';

/**
 * Error codes used throughout the monocle-backend package.
 * @readonly
 * @enum {string}
 */
const ERROR_CODES = {
  API_REQUEST_FAILED: 'api_request_failed',
  DECRYPTION_FAILED: 'decryption_failed',
  INVALID_CONFIGURATION: 'invalid_configuration',
} as const;

/**
 * Create typed error factory for this package.
 * @type {ReturnType<typeof buildErrorFactory>}
 */
const { CustomError, createError, throwError, errorCodes } = buildErrorFactory(
  PACKAGE_NAME,
  ERROR_CODES
);

/**
 * Base error class for Monocle-related errors.
 * @class
 * @extends CustomError
 */
export class MonocleError extends CustomError {
  /**
   * Create a new MonocleError.
   * @param {Object} options - Error options.
   * @param {typeof errorCodes[keyof typeof errorCodes]} options.code - Error code.
   */
  constructor(
    options: Parameters<typeof createError>[1] & {
      code: (typeof errorCodes)[keyof typeof errorCodes];
    }
  ) {
    super(options);
    this.name = 'MonocleError';
  }
}

/**
 * Error thrown when Monocle API requests fail.
 * @class
 * @extends MonocleError
 */
export class MonocleAPIError extends MonocleError {
  /**
   * Create a new MonocleAPIError.
   * @param {number} status - HTTP status code.
   * @param {string} statusText - HTTP status text.
   */
  constructor(status: number, statusText: string) {
    super({
      code: errorCodes.API_REQUEST_FAILED,
      message: `API request failed with status ${status}: ${statusText}`,
    });
    this.name = 'MonocleAPIError';
  }
}

/**
 * Error thrown when local decryption fails.
 * @class
 * @extends MonocleError
 */
export class MonocleDecryptionError extends MonocleError {
  /**
   * Create a new MonocleDecryptionError.
   * @param {unknown} cause - The underlying cause of the decryption failure.
   */
  constructor(cause: unknown) {
    const message =
      cause instanceof Error ? cause.message : 'Unknown decryption error';
    super({
      code: errorCodes.DECRYPTION_FAILED,
      message: `Local decryption failed: ${message}`,
    });
    this.name = 'MonocleDecryptionError';
  }
}

// Export utility functions
export { createError, throwError, errorCodes };
