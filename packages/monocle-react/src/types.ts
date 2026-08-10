import React from 'react';

/**
 * Props for the MonocleProvider component.
 * @interface MonocleProviderProps
 */
export interface MonocleProviderProps {
  /**
   * The child components to be wrapped by the MonocleProvider.
   */
  children: React.ReactNode;
  /**
   * The publishable key used for authentication with Monocle.
   */
  publishableKey: string;
  /**
   * Optional base domain for the Monocle API. Defaults to `js.mcl.io` if not provided
   */
  domain?: string;
  /**
   * Optional cpd parameter to add an arbitrary, session-based tag to the Monocle Assessment.
   * This can be used for session verification, tracking, and analysis on your backend.
   */
  cpd?: string;
}
