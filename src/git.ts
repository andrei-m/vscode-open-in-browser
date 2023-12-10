import * as vscode from 'vscode';
import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';

export class GitInfo {
    originUri: string
    commitHash: string
    constructor(originUri: string, commitHash: string) {
        this.originUri = originUri;
        this.commitHash = commitHash;
    }
}

export type MaybeGitInfo = GitInfo | null;

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

    return new GitInfo(remoteUrl, commitHash);
}