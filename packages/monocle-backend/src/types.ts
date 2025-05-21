/**
 * Configuration options for creating a MonocleClient instance
 */
export interface MonocleOptions {
  /** The secret key used for authentication with the Monocle API */
  secretKey: string;
  /** Optional base domain for the Monocle API. Defaults to `mcl.spur.us` if not provided */
  baseDomain?: string;
}

export interface EvaluateAssessmentOptions {
  ip?: string;
  cpd?: string;
}
