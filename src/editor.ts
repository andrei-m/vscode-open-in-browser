import * as vscode from 'vscode';

/*
Open in stash examples:
https://$host/projects/$project/repos/$repo/browse/$filePath?at=$commit#$firstLine
https://$host/projects/$project/repos/$repo/browse/$filePath?at=$commit#$firstLine-$lastLine
*/

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
        const start = editor.selection.start.line;
        const end = editor.selection.end.line;
        if (start === end) {
            const lineNumber = editor.selection.active.line;
            return new Selection(filePath, lineNumber, lineNumber);
        } else {
            return new Selection(filePath, start, end);
        }
    }
    return null;
}
