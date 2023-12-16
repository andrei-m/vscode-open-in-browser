import * as vscode from 'vscode';

export class Selection {
    filePath: string
    firstLine: number
    lastLine: number
    constructor(filePath: string, firstLine: number, lastLine: number) {
        this.filePath = filePath;
        this.firstLine = firstLine;
        this.lastLine = lastLine;
    }
}

export type MaybeSelection = Selection | null;

export function getEditorInfo(): MaybeSelection {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const filePath = editor.document.uri.fsPath;
        const relativeFilePath = vscode.workspace.asRelativePath(filePath);

        const start = editor.selection.start.line + 1;
        const end = editor.selection.end.line + 1;
        if (start === end) {
            return new Selection(relativeFilePath, start, start);
        }
        return new Selection(relativeFilePath, start, end);
    }
    return null;
}
