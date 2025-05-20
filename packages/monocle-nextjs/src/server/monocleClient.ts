import { createMonocleClient } from '@spur.us/monocle-backend';
import { DOMAIN, SECRET_KEY } from './constants';

const monocleClient = async () => {
  return createMonocleClient({
    secretKey: SECRET_KEY,
    baseDomain: DOMAIN,
  });
};

export { monocleClient };
