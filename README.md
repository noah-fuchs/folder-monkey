# Script Executor Chrome Extension

This extension allows you to write modular JavaScript files that execute on specific websites. By keeping scripts organized in folders, you can import and export functions cleanly instead of writing giant, single-file scripts.

## Installation

1. Open a terminal and navigate to the extension folder: `c:\dev\html-css-js\Extensions\script-executor`.
2. Run `npm install` (first time only) to install the build tools.
3. Run `npm run build` to compile the scripts.
4. Open Google Chrome and go to `chrome://extensions/`.
5. Enable **Developer mode** (top right corner).
6. Click **Load unpacked** and select the `dist` folder located inside `script-executor`.

## How to Create a New Script

1. Create a new folder inside `src/scripts/` (e.g., `src/scripts/my-awesome-feature/`).
2. Inside this folder, create a `config.json` file. This tells Chrome *where* the script should run:
   ```json
   {
     "matches": [
       "*://*.github.com/*",
       "https://stackoverflow.com/*"
     ]
   }
   ```
3. Create an `index.js` file in the same folder. This is the main entry point:
   ```javascript
   import { doSomething } from './helpers.js';

   console.log("My Awesome Feature is running!");
   doSomething();
   ```
4. Create any other files you want to import, like `helpers.js`:
   ```javascript
   export function doSomething() {
       document.body.style.backgroundColor = 'lightblue';
   }
   ```
5. Run `npm run build` from the terminal.
6. Go to `chrome://extensions/` and click the **Reload** icon on the "Script Executor" extension.

## Folder Structure

- `src/manifest-base.json`: Base configuration for the extension.
- `src/popup/`: HTML/JS for the extension's popup icon interface.
- `src/scripts/`: Where you put your individual script folders.
- `build.js`: The Node.js script that compiles everything.
- `dist/`: The generated extension folder (do NOT edit this directly).
