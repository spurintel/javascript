/**
 * Represents an assessment result from Monocle, containing various network
 * and connection properties.
 */
export interface MonocleAssessment {
  /** Whether or not this connection was detected to be originating from a VPN. */
  vpn: boolean;
  /** Whether or not this connection was detected to be originating from a proxy of any type (datacenter or residential). */
  proxied: boolean;
  /** Whether or not this connection was detected to be originating from IP space known to host anonymizing infrastructure - this is a modifier to vpn and proxied and will never be true by itself. */
  anon: boolean;
  /** Whether or not this connection was detected to be originating from a remote desktop service. */
  rdp: boolean;
  /** Whether or not this connection was detected to be originating from a datacenter. */
  dch: boolean;
  /** Country code of the source IP address (ISO 3166 ALPHA-2). */
  cc: string;
  /** Source IPv4 address as seen by Monocle. */
  ip: string;
  /** Source IPv6 address as seen by Monocle. */
  ipv6: string;
  /** ISO 8601 datetime format of the Monocle Assessment generation. */
  ts: string;
  /** Whether or not the Monocle process completed fully; a false value is indicative of a higher chance of false positives/negatives */
  complete: boolean;
  /** Unique identifier for the assessment. */
  id: string;
  /** The name of the Monocle Application. */
  sid: string;
  /** If Monocle is able to identify the service in use, it will be labeled here. This value corresponds to the service tags found here. This field is only exposed to Enterprise Monocle users. */
  service: string;
}

export interface MonoclePolicyDecision {
  allowed: boolean;
  /** The reason for the decision. */
  reason: string;
}

/**
 * Configuration options for the MonocleLoader. This wrapper crafts the request
 * to the Monocle backend to load the Monocle core library.
 */
export interface MonocleLoaderConfig extends MonocleConfig {
  /**
   * Your **public** monocle site-token issued to you by Spur. This token is to be shared
   * publicly on your website or in your web application. Spur uses this value to associate
   * a client request with your registration.
   */
  token: string;
}

export interface MonocleConfig {
  /**
   * Configure a function handler to be called when a new assessment is received for monocle.
   * @param assessment
   * @returns
   */
  onAssessment?: (assessment: MonocleAssessment) => void;
  /**
   * @deprecated Use onAssessment instead
   * Configure a function handler to be called when a new bundle is received for monocle.
   * @param bundle
   * @returns
   */
  onBundle?: (bundle: string) => void;
}

/**
 * A Monocle instance in a client browser. When an instance is created it will
 * automatically start and boostrap itself with the provided configuration. This
 * singleton instance is responsible for fetching a client session assessment bundle
 * on page load. This encrypted assessment can be attached to forms by using the
 * `monocle-enriched` class on a form object. Alternatively you can use the `getBundle()`
 * interface to send or manipulate the bundle directly.
 */
export interface Monocle {
  /**
   * Retrieves the current monocle assessment if it exists. If it does
   * not exist, nothing will be returned. Calling this does not initiate any
   * new assessment. Monocle makes those determinations and updates on its own.
   */
  getAssessment: () => string | undefined;
  /**
   * @deprecated Use getAssessment instead
   * Retrieves the current monocle threat bundle if it exists. If it does
   * not exit, nothing will be returned. Calling this does not initiate any
   * new bundle fetch or assessment. Monocle makes those determinations and
   * updates on its own.
   */
  getBundle: () => string | undefined;
  /**
   * Fetches and saves a new bundle for the current monocle client. If form input
   * fields are configured, they will be updated.
   */
  refresh: () => Promise<void>;
  /**
   * Configure the Monocle instance with the provided configuration.
   * @param c
   * @returns
   */
  configure: (c: Partial<MonocleLoaderConfig>) => Promise<void>;
}
