/**
 * Options for creating custom error instances.
 */
export type ErrorOptions = {
  message?: string;
  code?: string;
};

/**
 * Base error class for all Spur errors.
 * Includes package metadata and error code support.
 */
export class SpurError extends Error {
  public readonly code: string;
  public readonly packageName: string;

  /**
   * Creates a new Spur error.
   * @param packageName - The name of the package where the error occurred.
   * @param options - Error configuration options.
   */
  constructor(packageName: string, options: ErrorOptions) {
    const message = options.message || 'An unknown error occurred';
    const formattedMessage = `[${packageName}] ${message}`;

    super(formattedMessage);

    this.name = this.constructor.name;
    this.code = options.code || 'UNKNOWN_ERROR';
    this.packageName = packageName;

    // Maintain proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Creates a factory for package-specific error handling.
 * @param packageName - The name of the package using this error factory.
 * @param errorCodes - Record of error codes specific to the package.
 * @returns Object with error creation utilities.
 */
export function buildErrorFactory<T extends Record<string, string>>(
  packageName: string,
  errorCodes: T
) {
  type ErrorCode = T[keyof T];

  /**
   * Package-specific error class.
   */
  class CustomError extends SpurError {
    /**
     * Creates a new custom error with a required error code.
     * @param options - Error options with required code property.
     */
    constructor(options: Omit<ErrorOptions, 'code'> & { code: ErrorCode }) {
      super(packageName, options);
    }
  }

  /**
   * Creates a new error instance with the specified code.
   * @param code - Error code from the package's error codes.
   * @param options - Additional error options.
   * @returns New error instance.
   */
  const createError = (
    code: ErrorCode,
    options?: Omit<ErrorOptions, 'code'>
  ) => {
    return new CustomError({ code, ...options });
  };

  /**
   * Creates and throws an error with the specified code.
   * @param code - Error code from the package's error codes.
   * @param options - Additional error options.
   * @throws CustomError
   */
  const throwError = (
    code: ErrorCode,
    options?: Omit<ErrorOptions, 'code'>
  ): never => {
    throw createError(code, options);
  };

  return {
    CustomError,
    createError,
    throwError,
    errorCodes,
  };
}
