# 🐒 FolderMonkey

FolderMonkey is a Chrome extension for developers that lets you inject JavaScript into any website — like TamperMonkey, but with proper folder structure and ES module support. Scripts live in `src/scripts/`, are built via `npm run build`, and automatically sync into the extension.

**Why FolderMonkey instead of TamperMonkey?**

- 📁 Organize scripts in folders instead of single giant files
- 📦 Use ES module `import`/`export` across multiple files
- ⚡ `npm run build` instantly syncs your code into the extension

## Installation

1. Create a new empty folder for your workspace:
   ```bash
   mkdir my-scripts-workspace
   cd my-scripts-workspace
   ```
2. Initialize FolderMonkey (this will scaffold the required files):
   ```bash
   npx @noahfuchs/folder-monkey init
   ```
3. Install the required build tools:
   ```bash
   npm install
   ```
4. Build the extension or start hot-reloading development mode:
   - For a single build:
     ```bash
     npm run build
     ```
   - For automatic hot-reloading (recommended for development):
     ```bash
     npm run watch
     ```
5. Open Chrome and go to `chrome://extensions/`
6. Enable **Developer mode** (top right corner)
7. Click **Load unpacked** and select the `dist/` folder

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
5. Run `npm run build` (or have `npm run watch` running) — done.
6. If using `watch` the extension will build and reload itself automatically. The active tab remains untouched to prevent data loss – reload the page manually (F5) to see the new script output.

### Using NPM Packages

You can use external NPM packages directly inside your script folders! FolderMonkey's bundler handles them automatically.

1. Navigate to your script folder (e.g., `cd src/scripts/my-feature/`)
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
