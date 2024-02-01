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
    if (host.endsWith('azure.com') || urlPlatform === UrlPlatform.AzureDevOps) {
        return azureDevopsUrlToWebUrl(url, commitHash, selection);
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

function azureDevopsUrlToWebUrl(url: UrlParsed, commitHash: string, selection: Selection): string {
    const adoRepo = parseAzureDevOpsRepo(url.pathname);
    // ADO's last line semantics are more like "next line" after the last line
    const lastLine = selection.lastLine + 1;
    return `https://${adoRepo.subdomain}.visualstudio.com/${adoRepo.organization}/_git/${adoRepo.repo}?path=/${selection.filePath}&version=GC${commitHash}&line=${selection.firstLine}&lineEnd=${lastLine}&lineStartColumn=1&_a=contents`;
}

function getLineNumberFragment(prefix: string, selection: Selection): string {
    if (selection.firstLine === selection.lastLine) {
        return `#${prefix}${selection.firstLine}`;
    }
    return `#${prefix}${selection.firstLine}-${prefix}${selection.lastLine}`;
}

class AzureDevOpsRepo {
    subdomain: string
    organization: string
    repo: string
    constructor(subdomain: string, organization: string, repo: string) {
        this.subdomain = subdomain;
        this.organization = organization;
        this.repo = repo;
    }
}

function parseAzureDevOpsRepo(pathname: string): AzureDevOpsRepo {
    const trimmedPath = pathname.replace(/.git$/, '').replace(/^\//, '');
    const pathSplit = trimmedPath.split("/");
    if (pathSplit.length != 4) {
        throw new Error(`expected 4 slash-separated parts in ${trimmedPath}`);
    }
    return new AzureDevOpsRepo(pathSplit[1], pathSplit[2], pathSplit[3]);
}