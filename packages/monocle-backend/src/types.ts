/**
 * Configuration options for creating a MonocleClient instance
 */
export interface MonocleOptions {
  /** The secret key used for authentication with the Monocle API */
  secretKey: string;
  /** Optional base URL for the Monocle API. Defaults to the standard API URL if not provided */
  baseUrl?: string;
}
