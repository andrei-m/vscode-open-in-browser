import * as vscode from 'vscode';
import * as editor from './editor';
import * as git from './git';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('open-in-web-scm.openInWeb', () => {
		const editorInfo = editor.getEditorInfo();
		if (editorInfo) {
			git.getGitInfo().then(simpleGitInfo => {
				vscode.window.showInformationMessage(`${simpleGitInfo?.originUri}@${simpleGitInfo?.commitHash}`);
			});
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
