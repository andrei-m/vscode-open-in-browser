import * as vscode from 'vscode';
import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';
import GitUrlParse from 'git-url-parse';

export class GitInfo {
    url: UrlParsed
    commitHash: string
    urlPlatform: MaybeUrlPlatform
    constructor(url: UrlParsed, commitHash: string, urlPlatform: MaybeUrlPlatform) {
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
        return null;
    }
    const folderPath = workspaceFolders[0].uri.fsPath;
    const git: SimpleGit = simpleGit(folderPath).clean(CleanOptions.FORCE);

    const remotes = await git.getRemotes(true);
    if (remotes.length < 1) {
        return null;
    }
    const remoteUrl = remotes[0].refs.fetch;
    const commitHash = await git.revparse(['HEAD']);
    const urlPlatform = await getUrlPlatform(git, remotes[0].name)
    const parsed = GitUrlParse(remoteUrl);

    return new GitInfo(parsed, commitHash, urlPlatform);
}

export enum UrlPlatform {
    Github,
    Gitlab,
    Stash
}

export type MaybeUrlPlatform = UrlPlatform | null;

async function getUrlPlatform(git: SimpleGit, remoteName: string): Promise<MaybeUrlPlatform> {
    const urlPlatformKey = `remote.${remoteName}.url-platform`;
    const urlPlatform = await git.getConfig(urlPlatformKey);
    if (!urlPlatform.value) {
        return null;
    }

    switch (urlPlatform.value.toLowerCase()) {
        case 'github':
            return UrlPlatform.Github;
        case 'gitlab':
            return UrlPlatform.Gitlab;
        case 'stash':
            return UrlPlatform.Stash;
    }

    return null;
}