import { defineConfig, Options } from 'tsup';

import { name, version } from './package.json';

export default defineConfig((overrideOptions) => {
  const common: Options = {
    entry: ['./src/**/*.{ts,tsx,js,jsx}'],
    // We want to preserve original file structure
    // so that the "use client" directives are not lost
    // and make debugging easier via node_modules easier
    bundle: false,
    clean: true,
    minify: false,
    external: ['#safe-node-apis'],
    sourcemap: true,
    legacyOutput: true,
    define: {
      PACKAGE_NAME: `"${name}"`,
      PACKAGE_VERSION: `"${version}"`,
    },
  };

  const esm: Options = {
    ...common,
    format: 'esm',
  };

  const cjs: Options = {
    ...common,
    format: 'cjs',
    outDir: './dist/cjs',
    onSuccess: 'pnpm build:declarations',
  };

  return [esm, cjs];
});
