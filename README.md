# 🐒 FolderMonkey

FolderMonkey is a Chrome extension toolkit for developers that lets you inject JavaScript into any website — like TamperMonkey, but with proper folder structure, ES module support, and npm package integration.

**Why FolderMonkey instead of TamperMonkey?**

- 📁 Organize scripts in folders instead of single giant files
- 📦 Use ES module `import`/`export` across multiple files
- 📦 Install and use any npm package in your scripts
- ⚡ `npm run build` instantly compiles your code into a ready-to-load Chrome extension
- 🔄 `npm run watch` for automatic hot-reloading during development

## Quick Start

1. Create a new empty folder for your workspace:
   ```bash
   mkdir my-scripts-workspace
   cd my-scripts-workspace
   ```
2. Initialize FolderMonkey (this scaffolds all required files):
   ```bash
   npx folder-monkey init
   ```
3. Install the build dependencies:
   ```bash
   npm install
   ```
4. Build the extension:
   ```bash
   npm run build
   ```
   Or start hot-reloading development mode (recommended):
   ```bash
   npm run watch
   ```
5. Open Chrome and go to `chrome://extensions/`
6. Enable **Developer mode** (top right corner)
7. Click **Load unpacked** and select the `dist/` folder

## Workspace Structure

After running `npx folder-monkey init`, your workspace will look like this:

```
my-scripts-workspace/
├── package.json              ← Your workspace config (auto-generated)
├── folder-monkey/            ← FolderMonkey build engine (auto-generated)
│   ├── build.js              ← ESBuild bundler logic
│   ├── watch.js              ← File watcher with hot-reload
│   ├── manifest-base.json    ← Chrome extension manifest template
│   ├── background.js         ← Extension background script
│   └── popup/                ← Extension popup UI
├── scripts/                  ← YOUR scripts go here
│   └── my-feature/
│       ├── config.json
│       ├── index.js
│       └── helpers.js
└── dist/                     ← Generated extension (do not edit)
```

- **`folder-monkey/`** — Contains the build engine and extension core. You generally don't need to edit these files.
- **`scripts/`** — This is where you create and organize your browser scripts.
- **`dist/`** — The compiled Chrome extension output. Point Chrome to this folder.

## How to Create a New Script

1. Create a new folder inside `scripts/` (e.g., `scripts/my-feature/`)
2. Add a `config.json` to define on which sites the script runs:
   ```json
   {
     "matches": ["*://*.github.com/*", "https://stackoverflow.com/*"]
   }
   ```
3. Add an `index.js` (or `index.jsx`) as the entry point:

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
5. Run `npm run build` (or have `npm run watch` running) — done!
6. If using `watch`, the extension will build and reload itself automatically. Reload the page manually (F5) to see the new script output.

### Using NPM Packages

You can use external npm packages directly inside your script folders! FolderMonkey's bundler (ESBuild) handles them automatically.

1. Navigate to your script folder (e.g., `cd scripts/my-feature/`)
2. Initialize and install your package:
   ```bash
   npm init -y
   npm install lodash
   ```
3. Import it in your code as usual:
   ```javascript
   import _ from 'lodash';
   
   console.log(_.kebabCase("Hello World"));
   ```

### Using Tailwind CSS

If your script folder contains a `styles.css` file, FolderMonkey will automatically process it through Tailwind CSS during the build.

## Using with AI Coding Agents

Want an AI agent to write your script? Copy the prompt from [`folder-monkey/AGENT_PROMPT.md`](./template/AGENT_PROMPT.md) and send it to your agent before you start. It will know exactly how to structure the files.

## License

MIT
