import { Monocle } from '@spur.us/types';

declare global {
  interface Window {
    /** Monocle client instance */
    MCL?: Monocle;
  }
}
