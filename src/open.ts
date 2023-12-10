import * as vscode from 'vscode';
import { Selection } from './editor';
import { GitInfo } from './git';
const GitUrlParse = require("git-url-parse");

export function open(gitInfo: GitInfo, selection: Selection ) {
    const url = gitUrlToWebUrl(gitInfo, selection);
    vscode.env.openExternal(vscode.Uri.parse(url));
}

function gitUrlToWebUrl(gitInfo: GitInfo, selection: Selection): string {
    const parsed = GitUrlParse(gitInfo.originUri);
    const host = parsed.resource;
    const fragment = getLineNumberFragment(selection);

    const path = parsed.pathname;
    const pathSplit = path.split('/');
    if (pathSplit.length === 2) {
        const project = pathSplit[0];
        const repo = pathSplit[1];
        return `https://${host}/projects/${project}/repos/${repo}/browse/${selection.filePath}?at=${gitInfo.commitHash}${fragment}`
    }

    //TODO: make this work beyond stash
    return `https://${host}/${path}/${selection.filePath}?at=${gitInfo.commitHash}${fragment}`
}

function getLineNumberFragment(selection: Selection): string {
    if (selection.firstLine === selection.lastLine) {
        return `#${selection.firstLine}`;
    }
    return `#${selection.firstLine}-${selection.lastLine}`;
}