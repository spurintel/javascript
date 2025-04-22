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
