---
"@spur.us/monocle-nextjs": minor
---

Accept Next.js 16 as a peer dependency.

The declared range stopped at `^15.2.3`, so installing into a Next 16 project failed peer resolution and needed `--legacy-peer-deps`. The SDK already worked on Next 16 once installed; only the range was out of date.
