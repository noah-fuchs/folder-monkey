# AI Agent Prompt

Copy and paste the following prompt to your AI coding agent when creating a new script or feature.

## Prompt

I need you to implement a new feature. Before you start, please read the following instructions regarding the project structure and execution environment carefully.

**Environment & Context:**
- This project uses **folder-monkey**, a userscript manager implemented as a **Chrome Extension**.
- Your code will be executed inside the browser on specific websites via this Chrome Extension.
- *Key Advantage:* Unlike traditional browser userscripts, **folder-monkey fully supports modern web development tooling**. Every script is located in its own directory inside the `scripts/` folder and can have its own `package.json`.
- This means you are completely free to use **NPM packages**, **React**, **TailwindCSS**, **shadcn/ui**, or any other modern libraries and frameworks you need. The project includes a bundler that will compile your script into a final bundle for the extension.

**Project Structure:**
Create a new folder for the feature inside the `scripts/` directory.

Your new script folder must contain at least the following files:

```text
scripts/my-feature/
├── config.json   ← Required. Defines on which websites the script runs.
├── package.json  ← Optional but recommended. Add your dependencies here.
└── index.js      ← Required. The entry point executed on the matched pages.
```

`config.json` must contain a `"matches"` array with valid Chrome match patterns. For example:
```json
{
  "matches": [
    "*://*.example.com/*"
  ]
}
```

Common match patterns:
- `*://*.example.com/*`   → All subdomains, both HTTP and HTTPS.
- `https://example.com/*` → HTTPS only.
- `<all_urls>`            → Every website (use with caution).

`index.js` acts as the main entry point for your code.

Now, please implement the following feature:

