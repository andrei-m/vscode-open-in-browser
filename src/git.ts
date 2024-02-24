import * as vscode from 'vscode';
import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';
import GitUrlParse from 'git-url-parse';
import { log } from './log';
import { getDefaultUrlPlatform }  from './config';

export class GitInfo {
    url: UrlParsed
    commitHash: string
    urlPlatform: UrlPlatform
    constructor(url: UrlParsed, commitHash: string, urlPlatform: UrlPlatform) {
        this.url = url;
        this.commitHash = commitHash;
        this.urlPlatform = urlPlatform;
    }
}

export type MaybeGitInfo = GitInfo | null;

export class UrlParsed {
    resource: string
    pathname: string
    constructor(resource: string, pathname: string) {
        this.resource = resource;
        this.pathname = pathname;
    }
}

export async function getGitInfo(): Promise<MaybeGitInfo> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders === undefined || workspaceFolders.length < 1) {
        log('No workspace folders found');
        return null;
    }
    const folderPath = workspaceFolders[0].uri.fsPath;
    const git: SimpleGit = simpleGit(folderPath).clean(CleanOptions.FORCE);

    const remotes = await git.getRemotes(true);
    if (remotes.length < 1) {
        log('No git remotes found');
        return null;
    }
    const remoteUrl = remotes[0].refs.fetch;
    const commitHash = await git.revparse(['HEAD']);
    log(`using remote ${remoteUrl} and revision ${commitHash}`)
    const url = GitUrlParse(remoteUrl);

    const extensionConfPlatform = getDefaultUrlPlatform();
    const gitConfPlatform = await getConfiguredUrlPlatform(git, remotes[0].name)
    const resolvedUrlPlatform = resolveUrlPlatform(gitConfPlatform, url, extensionConfPlatform);
    if (resolvedUrlPlatform === null) {
        return null;
    }
    log(`resolved URL platform: ${UrlPlatform[resolvedUrlPlatform]}`);

    return new GitInfo(url, commitHash, resolvedUrlPlatform);
}

export enum UrlPlatform {
    Github,
    Gitlab,
    Stash,
    AzureDevOps
}

export type MaybeUrlPlatform = UrlPlatform | null;

export function parseMaybeUrlPlatform(raw: string) {
    switch (raw.toLowerCase()) {
        case 'github':
            return UrlPlatform.Github;
        case 'gitlab':
            return UrlPlatform.Gitlab;
        case 'stash':
            return UrlPlatform.Stash;
        case 'ado':
            return UrlPlatform.AzureDevOps;
        case 'unset':
            return null;
    }
    return null;
}

async function getConfiguredUrlPlatform(git: SimpleGit, remoteName: string): Promise<MaybeUrlPlatform> {
    const urlPlatformKey = `remote.${remoteName}.url-platform`;
    const urlPlatform = await git.getConfig(urlPlatformKey);
    if (!urlPlatform.value) {
        return null;
    }
    return parseMaybeUrlPlatform(urlPlatform.value);
}

/* 
    Attempt to resolve the web platform using the following priorty order:
        1. Git remote.$remoteName.url-platform configuration
        2. Well-known domains (github.com, gitlab.com, etc.)
        3. Extension-wide default setting
*/
export function resolveUrlPlatform(gitConfPlatform: MaybeUrlPlatform, url: UrlParsed, extensionConfPlatform: MaybeUrlPlatform): MaybeUrlPlatform {
    if (gitConfPlatform) {
        return gitConfPlatform;
    }
    const host = url.resource.toLowerCase();
    if (host === 'github.com') {
        return UrlPlatform.Github;
    }
    if (host === 'gitlab.com') {
        return UrlPlatform.Gitlab;
    }
    if (host.endsWith('azure.com')) {
        return UrlPlatform.AzureDevOps;
    }
    if (extensionConfPlatform) {
        return extensionConfPlatform;
    }
    return null;
}