import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class SchemaProvider implements vscode.TreeDataProvider<Schema> {

    private _onDidChangeTreeData: vscode.EventEmitter<Schema | undefined | void> = new vscode.EventEmitter<Schema | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<Schema | undefined | void> = this._onDidChangeTreeData.event;

    constructor(private schemas: Schema[] = []) {
        this.schemas = [
            new Schema('schema1', vscode.TreeItemCollapsibleState.None),
            new Schema('schema2', vscode.TreeItemCollapsibleState.None),
            new Schema('schema3', vscode.TreeItemCollapsibleState.None),
            new Schema('schema4', vscode.TreeItemCollapsibleState.None)
        ];
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Schema): vscode.TreeItem {
        return element;
    }

    getChildren(element?: Schema): Thenable<Schema[]> {
        // if (!this.workspaceRoot) {
        //     vscode.window.showInformationMessage('No dependency in empty workspace');
        //     return Promise.resolve([]);
        // }

        // if (element) {
        //     return Promise.resolve([]);
        // } else {
        //     return Promise.resolve([]);
        //     // const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
        //     // if (this.pathExists(packageJsonPath)) {
        //     //     return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
        //     // } else {
        //     //     vscode.window.showInformationMessage('Workspace has no package.json');
        //     //     return Promise.resolve([]);
        //     // }
        // }
        return Promise.resolve(this.schemas);
    }

}

export class Schema extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        // public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
    }

    // iconPath = {
    //     light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
    //     dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
    // };
}