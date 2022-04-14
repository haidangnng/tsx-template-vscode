/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const fs_1 = __webpack_require__(3);
const path_1 = __webpack_require__(4);
const vscode_1 = __webpack_require__(1);
const template_1 = __webpack_require__(5);
class default_1 {
    constructor() {
        this.curPath = '';
    }
    async init() {
        const { workspaceFolders } = vscode_1.workspace;
        let selectFolder;
        if (!workspaceFolders || workspaceFolders.length <= 0) {
            vscode_1.window.showInformationMessage('Please open workspace');
        }
        else {
            selectFolder = workspaceFolders[0];
        }
        this.curPath = selectFolder.uri.fsPath;
        this.getLevel(this.curPath);
    }
    async getLevel(path) {
        this.curPath = path;
        const nested = (0, fs_1.readdirSync)(path);
        const options = nested.filter((item) => {
            const fileStat = (0, fs_1.statSync)((0, path_1.resolve)(path, item));
            const isDirectory = fileStat.isDirectory();
            return isDirectory;
        }).map((item) => ({ label: item }));
        const quickPick = vscode_1.window.createQuickPick();
        quickPick.items = [{ label: 'THIS FOLDER' }, ...options];
        quickPick.onDidChangeSelection(([{ label }]) => {
            if (label !== 'THIS FOLDER') {
                this.getLevel(`${this.curPath}/${label}`);
            }
            else {
                this.createFolder();
            }
            quickPick.hide();
        });
        quickPick.show();
    }
    async createFolder() {
        const componentName = await vscode_1.window.showInputBox({
            placeHolder: 'add component name',
        });
        if (!componentName) {
            vscode_1.window.showErrorMessage('Please add component name');
        }
        else {
            const nested = (0, fs_1.readdirSync)(this.curPath);
            const isDup = nested.some((item) => item.toLowerCase() === componentName.toLowerCase());
            if (isDup) {
                vscode_1.window.showErrorMessage('Component duplicated');
            }
            ;
            (0, fs_1.mkdirSync)(`${this.curPath}/${componentName}`);
            (0, fs_1.writeFileSync)(`${this.curPath}/${componentName}/hook.ts`, (0, template_1.renderHooks)(componentName));
            (0, fs_1.writeFileSync)(`${this.curPath}/${componentName}/index.tsx`, (0, template_1.renderComponents)(componentName));
        }
    }
}
exports["default"] = default_1;


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.renderComponents = exports.renderHooks = void 0;
const renderHooks = (componentName) => `export type ReceivedProps = Record<string, any>;

const use${componentName} = (props: ReceivedProps) => {
  return {
    ...props,
  };
};

export type Props = ReturnType<typeof use${componentName}>;

export default use${componentName};
`;
exports.renderHooks = renderHooks;
const renderComponents = (componentName) => `import React, { FC } from "react";
import use${componentName}, { Props, ReceivedProps } from "./hook";

const ${componentName}Layout: FC<Props> = (props) => {
  const {} = props;
  return <></>;
};

const ${componentName}: FC<ReceivedProps> = (props) => (
  <${componentName}Layout {...use${componentName}(props)} />
);

export default ${componentName};
`;
exports.renderComponents = renderComponents;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __webpack_require__(1);
const index_1 = __webpack_require__(2);
const fs = __webpack_require__(3);
const path = __webpack_require__(3);
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('dm-may-thang-luoi.createTemplate', async () => {
        new index_1.default().init();
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map