import * as vscode from 'vscode';
import { MaybeUrlPlatform, parseMaybeUrlPlatform } from './git';

export function getDefaultUrlPlatform(): MaybeUrlPlatform {
    const defaultUrlPlatform = vscode.workspace.getConfiguration('git-open-in-browser').get('default-url-platform');
    if (typeof defaultUrlPlatform === "string") {
        return parseMaybeUrlPlatform(defaultUrlPlatform);
    }
    return null;
}