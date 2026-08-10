---
"@spur.us/monocle-react": minor
---

Load the Monocle script from `js.mcl.io` instead of `mcl.spur.us`.

**Before upgrading, if your site sets a Content Security Policy, make sure `https://*.mcl.io` is in your `script-src`.** Earlier versions requested `mcl.spur.us`, so a policy that allowlists only that host will block the SDK after this upgrade. The directives Monocle needs are listed at https://docs.spur.us/monocle/security. Sites without a CSP are unaffected and need no changes.

The two hosts serve identical payloads, but only `js.mcl.io` matches the `https://*.mcl.io` wildcard that the security docs have always asked for, so a site that followed those docs was previously getting the SDK silently blocked. A CSP is evaluated against the host being requested, and `mcl.spur.us` does not match that wildcard.

Pass the `domain` prop to `MonocleProvider` to pin a different host.
