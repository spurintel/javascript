import { defineConfig, Options } from 'tsup';

export default defineConfig(() => {
  const common: Options = {
    entry: {
      index: './src/index.ts',
      error: './src/error.ts',
    },
    bundle: true,
    clean: true,
    minify: false,
    sourcemap: true,
    dts: true,
    define: {
      PACKAGE_NAME: `"@spur.us/shared"`,
      PACKAGE_VERSION: `"0.0.0"`, // Since it's private, we're using a fixed version
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
  };

  return [esm, cjs];
});
