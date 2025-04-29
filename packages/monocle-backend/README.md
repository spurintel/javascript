<div align="center">
  <a href="https://spur.us">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="../../docs/images/logo-dark-mode.svg">
      <img alt="Spur logo" src="../../docs/images/logo-light-mode.svg" height="128">
    </picture>
  </a>
  <br />
  <h1>@spur.us/monocle-backend</h1>
</div>
<br />

Spur's JavaScript Monocle Backend SDK.

## Installation

```bash
npm install @spur.us/monocle-backend
# or
yarn add @spur.us/monocle-backend
# or
pnpm add @spur.us/monocle-backend
```

## Usage

The package needs to be configured with your Monocle application's secret key, which is available in the [Spur Dashboard](https://app.spur.us).

```javascript
import { createMonocleClient } from '@spur.us/monocle-backend';

const monocleClient = createMonocleClient({
  secretKey: process.env.MONOCLE_SECRET_KEY,
});
```

### Decrypt assessment via API

```javascript
try {
  const assessment = await monocleClient.decryptAssessment(encryptedAssessment);
} catch (error) {
  // Error handling
}
```

### Decrypt assessment locally

> [!IMPORTANT]
> This is only available to Enterprise customers

```javascript
try {
  const assessment = await monocleClient.decryptAssessment(
    encryptedAssessment,
    { privateKeyPem: process.env.MONOCLE_PRIVATE_KEY }
  );
} catch (error) {
  // Error handling
}
```

## Contributing

We welcome all contributors!

Please read our [contributing guidelines](https://github.com/spurintel/javascript/blob/main/docs/CONTRIBUTING.md) to learn how to submit issues or open pull requests.

## License

This project is licensed under the [MIT license](https://github.com/spurintel/javascript/blob/main/packages/monocle-backend/LICENSE).
