import * as vscode from 'vscode';
import * as editor from './editor';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('open-in-web-scm.helloWorld', () => {
		const editorInfo = editor.getEditorInfo();
		if (editorInfo) {
			vscode.window.showInformationMessage(editorInfo.filePath);
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
