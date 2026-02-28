# 🐒 FolderMonkey

FolderMonkey is a Chrome extension for developers that lets you inject JavaScript into any website — like TamperMonkey, but with proper folder structure and ES module support. Scripts live in `src/scripts/`, are built via `npm run build`, and automatically sync into the extension.

**Why FolderMonkey instead of TamperMonkey?**

- 📁 Organize scripts in folders instead of single giant files
- 📦 Use ES module `import`/`export` across multiple files
- ⚡ `npm run build` instantly syncs your code into the extension

## Installation

1. Clone the repo and navigate into the folder:
   ```bash
   git clone https://github.com/noah-fuchs/folder-monkey.git
   cd folder-monkey
   ```
2. Install build tools (first time only):
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Open Chrome and go to `chrome://extensions/`
5. Enable **Developer mode** (top right corner)
6. Click **Load unpacked** and select the `dist/` folder

## How to Create a New Script

1. Create a new folder inside `src/scripts/` (e.g., `src/scripts/my-feature/`)
2. Add a `config.json` to define on which sites the script runs:
   ```json
   {
     "matches": ["*://*.github.com/*", "https://stackoverflow.com/*"]
   }
   ```
3. Add an `index.js` as the entry point:

   ```javascript
   import { doSomething } from "./helpers.js";

   console.log("My feature is running!");
   doSomething();
   ```

4. Add any helper files you want to import, e.g. `helpers.js`:
   ```javascript
   export function doSomething() {
     document.body.style.backgroundColor = "lightblue";
   }
   ```
5. Run `npm run build` — done.
6. Hit the **Reload** icon on the extension in `chrome://extensions/`

## Using with AI Coding Agents

Want an AI agent to write your script? Copy the prompt from [`AGENT_PROMPT.md`](./AGENT_PROMPT.md) and send it to your agent before you start. It will know exactly how to structure the files.

## Folder Structure

```
src/
├── scripts/          ← Your script folders go here
│   └── my-feature/
│       ├── config.json
│       ├── index.js
│       └── helpers.js
├── manifest-base.json
└── popup/            ← Extension popup UI
build.js              ← Build script
dist/                 ← Generated extension (do not edit)
```

## License

MIT
