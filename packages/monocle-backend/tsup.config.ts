import { defineConfig } from 'tsup';

import { name, version } from './package.json';

export default defineConfig((overrideOptions) => {
  const shouldPublish = !!overrideOptions.env?.publish;

  return {
    entry: {
      index: 'src/index.ts',
    },
    dts: true,
    onSuccess: shouldPublish ? 'pnpm publish:local' : undefined,
    format: ['cjs', 'esm'],
    bundle: true,
    clean: true,
    minify: false,
    sourcemap: true,
  };
});
