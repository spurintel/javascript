import { MonocleClient } from './monocleClient';
import { MonocleOptions } from './types';

/**
 * Creates a new MonocleClient instance
 * @param options - Configuration options for the client
 * @returns A new MonocleClient instance
 */
export const createMonocleClient = (options: MonocleOptions): MonocleClient => {
  return new MonocleClient(options);
};
