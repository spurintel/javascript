/**
 * Configuration options for creating a MonocleClient instance
 */
export interface MonocleOptions {
  /** The secret key used for authentication with the Monocle API */
  secretKey: string;
  /** Optional base domain for the Monocle API. Defaults to `mcl.spur.us` if not provided */
  baseDomain?: string;
}

/**
 * Options for evaluating an assessment
 */
export interface EvaluateAssessmentOptions {
  /** IP address of the client making the request */
  ip?: string;
  /** Client private data to be used for evaluation */
  cpd?: string;
}
