import * as vscode from 'vscode';
import * as editor from './editor';
import * as git from './git';
import { open } from './open';
import { notify } from './log';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('open-in-browser.open', () => {
		const editorInfo = editor.getEditorInfo();
		if (editorInfo) {
			git.getGitInfo().then(simpleGitInfo => {
				if (simpleGitInfo) {
					open(simpleGitInfo, editorInfo);
				} else {
					notify("Could not find git info or recognize the remote web platform; see logs in 'Output.'")
				}
			});
		} else {
			notify('No file editor found.');
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
