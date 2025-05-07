import { MonocleClient } from './monocleClient.js';
import { MonocleOptions } from './types.js';

/**
 * Creates a new MonocleClient instance
 * @param options - Configuration options for the client
 * @returns A new MonocleClient instance
 */
export const createMonocleClient = (options: MonocleOptions): MonocleClient => {
  return new MonocleClient(options);
};
