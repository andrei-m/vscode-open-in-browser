import * as vscode from 'vscode';

const out = vscode.window.createOutputChannel("Git Open in Browser");

export function log(msg: string) {
    out.appendLine(msg);
}

export function notify(msg: string) {
    vscode.window.showInformationMessage(msg);
}