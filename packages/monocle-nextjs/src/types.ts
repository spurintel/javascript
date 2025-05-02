import type { MonocleProviderProps } from '@spur.us/monocle-react';

export type NextMonocleProviderProps = Omit<
  MonocleProviderProps,
  'publishableKey'
> & {
  /**
   * Used to override the default NEXT_PUBLIC_MONOCLE_PUBLISHABLE_KEY env variable if needed.
   * This is optional for NextJS as the MonocleProvider will automatically use the
   * NEXT_PUBLIC_MONOCLE_PUBLISHABLE_KEY env variable if it exists.
   */
  publishableKey?: string;
};
