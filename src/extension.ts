// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { posix } from 'path';
import * as vscode from 'vscode';
import { ConfigSchema, Configer } from './Configer';
import { SchemaProvider } from './SchemaProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "binders-python" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('binders-python.hello-world', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from binders-python!');
	});
	const schemaProvider = new SchemaProvider();
	vscode.window.registerTreeDataProvider('binder-schema', schemaProvider);
	vscode.commands.registerCommand('binders-python.schemas.refreshEntry', () => schemaProvider.refresh());
	
	const config = await Configer.load();
	if (config) { const configer = new Configer(config); }


	// vscode.languages.registerHoverProvider('json', {
	// 	provideHover(document, position, token) {
	// 		return {
	// 			contents: ['Hover Content']
	// 		};
	// 	}
	// });

	context.subscriptions.push(disposable);

}

// This method is called when your extension is deactivated
export function deactivate() { }
