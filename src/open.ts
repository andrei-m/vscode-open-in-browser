import * as vscode from 'vscode';
import { Selection } from './editor';
import { GitInfo } from './git';
import  GitUrlParse from 'git-url-parse';

export function open(gitInfo: GitInfo, selection: Selection ) {
    const parsed = GitUrlParse(gitInfo.originUri);
    const url = gitUrlToWebUrl(parsed, gitInfo.commitHash, selection);
    vscode.env.openExternal(vscode.Uri.parse(url));
}

class UrlParsed {
    resource: string
    pathname: string
    constructor(resource: string, pathname: string) {
        this.resource = resource;
        this.pathname = pathname;
    }
}

function gitUrlToWebUrl(url: UrlParsed, commitHash: string, selection: Selection): string {
    const host = url.resource;
    const fragment = getLineNumberFragment(selection);

    const path = url.pathname;
    const pathSplit = path.split('/');
    if (pathSplit.length === 2) {
        const project = pathSplit[0];
        const repo = pathSplit[1];
        return `https://${host}/projects/${project}/repos/${repo}/browse/${selection.filePath}?at=${commitHash}${fragment}`
    }

    //TODO: make this work beyond stash
    return `https://${host}/${path}/${selection.filePath}?at=${commitHash}${fragment}`
}

function getLineNumberFragment(selection: Selection): string {
    if (selection.firstLine === selection.lastLine) {
        return `#${selection.firstLine}`;
    }
    return `#${selection.firstLine}-${selection.lastLine}`;
}