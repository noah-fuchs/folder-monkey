# AI Agent Prompt

Copy and paste the following prompt to your AI coding agent when creating a new script.

---

## Prompt

```
You are working inside a userscript folder (e.g. my-feature/).
Your folder must contain exactly these files:

my-feature/
├── config.json   ← Required. Defines on which websites the script runs.
├── index.js      ← Required. Entry point, executed on matched pages.
└── *.js          ← Optional. Additional files you can import in index.js.

config.json must contain a "matches" array with valid Chrome match patterns:
{
  "matches": [
    "*://*.example.com/*"
  ]
}

Common patterns:
- "*://*.example.com/*"   → all subdomains, http and https
- "https://example.com/*" → https only
- "<all_urls>"            → every website (use with caution)

index.js is the entry point. Use ES module imports to split logic:
  import { myHelper } from './helpers.js';

Assume browser globals (document, window, fetch, etc.) are available.
```
