---
"@spur.us/monocle-react": minor
---

Load the Monocle script from `js.mcl.io` instead of `mcl.spur.us`.

The two hosts serve identical payloads, but only `js.mcl.io` matches the Content Security Policy documented at https://docs.spur.us/monocle/security, which asks for `https://*.mcl.io` in `script-src`. Sites with a CSP that followed those docs were getting the SDK silently blocked, because the policy is checked against the host being requested and `mcl.spur.us` does not match the `*.mcl.io` wildcard.

Pass the `domain` prop to `MonocleProvider` to override the default.
