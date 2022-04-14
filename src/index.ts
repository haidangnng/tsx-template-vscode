import { mkdirSync, readdirSync, readFileSync, Stats, statSync, writeFileSync } from "fs";
import { resolve } from "path";
import path = require("path");
import { window, workspace, WorkspaceFolder } from "vscode";
import { renderComponents, renderHooks } from "./template";

export default class {
  private curPath: string;

  constructor() {
    this.curPath = '';
  }

  async init(): Promise<void> {
    const { workspaceFolders } = workspace;
    let selectFolder!: WorkspaceFolder;
    if (!workspaceFolders || workspaceFolders.length <= 0) {
      window.showInformationMessage('Please open workspace');
    } else {
      selectFolder = workspaceFolders[0];
    }
    this.curPath = selectFolder.uri.fsPath;

    this.getLevel(this.curPath);
  }

  async getLevel(path: string): Promise<void> {
    this.curPath = path;
    const nested: string[] = readdirSync(path);
    
    const options = nested.filter((item: string) => {
      const fileStat: Stats = statSync(resolve(path, item));
      const isDirectory: boolean = fileStat.isDirectory();
      return isDirectory;
    }).map((item: string) => ({label: item}));
    
    const quickPick = window.createQuickPick();
    quickPick.items = [{label: 'THIS FOLDER'}, ...options];
    quickPick.onDidChangeSelection(([{label}]) => {
      if (label !== 'THIS FOLDER') {
        this.getLevel(`${this.curPath}/${label}`);
      } else {
        this.createFolder();
      }
      quickPick.hide();
    });
    quickPick.show();
  }

  async createFolder(): Promise<void> {
    const componentName = await window.showInputBox({
      placeHolder: 'add component name',
    });
    if (!componentName) {
      window.showErrorMessage('Please add component name');
    } else {
      const nested: string[] = readdirSync(this.curPath);
      
      const isDup = nested.some((item: string) => item.toLowerCase() === componentName.toLowerCase());
      if (isDup) {
        window.showErrorMessage('Component duplicated');
      };
      
      mkdirSync(`${this.curPath}/${componentName}`);
      writeFileSync(`${this.curPath}/${componentName}/hook.ts`, renderHooks(componentName));
      writeFileSync(`${this.curPath}/${componentName}/index.tsx`, renderComponents(componentName));
    }
  }
}
