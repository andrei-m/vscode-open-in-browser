import * as vscode from 'vscode';
import { Selection } from './editor';
import { GitInfo } from './git';
import  GitUrlParse from 'git-url-parse';

export function open(gitInfo: GitInfo, selection: Selection ) {
    const parsed = GitUrlParse(gitInfo.originUri);
    const url = gitUrlToWebUrl(parsed, gitInfo.commitHash, selection);
    vscode.env.openExternal(vscode.Uri.parse(url));
}

export class UrlParsed {
    resource: string
    pathname: string
    constructor(resource: string, pathname: string) {
        this.resource = resource;
        this.pathname = pathname;
    }
}

export function gitUrlToWebUrl(url: UrlParsed, commitHash: string, selection: Selection): string {
    const host = url.resource;
    if (host === 'github.com') {
        return githubUrlToWebUrl(url, commitHash, selection);
    }
    const fragment = getLineNumberFragment('', selection);

    const path = url.pathname;
    const pathSplit = path.split('/');
    if (pathSplit.length === 2) {
        const project = pathSplit[0];
        const repo = pathSplit[1];
        return `https://${host}/projects/${project}/repos/${repo}/browse/${selection.filePath}?at=${commitHash}${fragment}`
    }

    return `https://${host}/${path}/${selection.filePath}?at=${commitHash}${fragment}`
}

function githubUrlToWebUrl(url: UrlParsed, commitHash: string, selection: Selection): string {
    const trimmedPath = url.pathname.replace(/.git$/, '').replace(/^\//, '');
    const fragment = getLineNumberFragment('L', selection);
    return `https://github.com/${trimmedPath}/blob/${commitHash}/${selection.filePath}${fragment}`;
}

function getLineNumberFragment(prefix: string, selection: Selection): string {
    if (selection.firstLine === selection.lastLine) {
        return `#${prefix}${selection.firstLine}`;
    }
    return `#${prefix}${selection.firstLine}-${prefix}${selection.lastLine}`;
}