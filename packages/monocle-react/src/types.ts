/**
 * Props for the MonocleProvider component.
 * @interface MonocleProviderProps
 */
export interface MonocleProviderProps {
  /** The child components to be wrapped by the MonocleProvider. */
  children: React.ReactNode;
  /** The publishable key used for authentication with Monocle. */
  publishableKey: string;
}
