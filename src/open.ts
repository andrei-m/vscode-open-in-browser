import * as vscode from 'vscode';
import { Selection } from './editor';
import { GitInfo, MaybeUrlPlatform, UrlParsed, UrlPlatform } from './git';

export function open(gitInfo: GitInfo, selection: Selection ) {
    const url = gitUrlToWebUrl(gitInfo.url, gitInfo.urlPlatform, gitInfo.commitHash, selection);
    if (url) {
        vscode.env.openExternal(vscode.Uri.parse(url));
    }
}

export function gitUrlToWebUrl(url: UrlParsed, urlPlatform: MaybeUrlPlatform, commitHash: string, selection: Selection): string | null {
    const host = url.resource;
    if (host === 'github.com' || urlPlatform === UrlPlatform.Github) {
        return githubUrlToWebUrl(url, commitHash, selection);
    }
    if (host === 'gitlab.com' || urlPlatform === UrlPlatform.Gitlab) {
        return gitlabUrlToWebUrl(url, commitHash, selection);
    }
    if (urlPlatform === UrlPlatform.Stash) {
        return stashUrlToWebUrl(url, commitHash, selection);
    }
    return null;
}

function githubUrlToWebUrl(url: UrlParsed, commitHash: string, selection: Selection): string {
    const trimmedPath = url.pathname.replace(/.git$/, '').replace(/^\//, '');
    const fragment = getLineNumberFragment('L', selection);
    return `https://github.com/${trimmedPath}/blob/${commitHash}/${selection.filePath}${fragment}`;
}

function gitlabUrlToWebUrl(url: UrlParsed, commitHash: string, selection: Selection): string {
    const trimmedPath = url.pathname.replace(/.git$/, '').replace(/^\//, '');
    const fragment = getLineNumberFragment('L', selection);
    return `https://gitlab.com/${trimmedPath}/-/blob/${commitHash}/${selection.filePath}${fragment}`;
}

function stashUrlToWebUrl(url: UrlParsed, commitHash: string, selection: Selection): string {
    const host = url.resource;
    const trimmedPath = url.pathname.replace(/.git$/, '').replace(/^\//, '');
    const fragment = getLineNumberFragment('', selection);

    const pathSplit = trimmedPath.split('/');
    if (pathSplit.length === 2) {
        const project = pathSplit[0];
        const repo = pathSplit[1];
        return `https://${host}/projects/${project}/repos/${repo}/browse/${selection.filePath}?at=${commitHash}${fragment}`
    }

    return `https://${host}/${trimmedPath}/${selection.filePath}?at=${commitHash}${fragment}`
}

function getLineNumberFragment(prefix: string, selection: Selection): string {
    if (selection.firstLine === selection.lastLine) {
        return `#${prefix}${selection.firstLine}`;
    }
    return `#${prefix}${selection.firstLine}-${prefix}${selection.lastLine}`;
}