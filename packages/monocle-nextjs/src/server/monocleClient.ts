import { createMonocleClient } from '@spur.us/monocle-backend';
import { SECRET_KEY } from './constants';

const monocleClient = async () => {
  return createMonocleClient({
    secretKey: SECRET_KEY,
  });
};

export { monocleClient };
