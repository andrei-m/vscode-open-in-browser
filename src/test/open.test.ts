import * as assert from 'assert';
import { gitUrlToWebUrl } from '../open';
import { UrlParsed, UrlPlatform }  from '../git';
import { Selection } from '../editor';
import GitUrlParse from 'git-url-parse';

suite('gitUrlToWebUrl', () => {
	test('Github single line', () => {
        const url = new UrlParsed('github.com', '/andrei-m/vscode-open-in-browser.git');
        const selection = new Selection('src/open.ts', 1, 1);
        const webUrl = gitUrlToWebUrl(url, UrlPlatform.Github, 'deadbeef', selection);
		assert.strictEqual(webUrl, 'https://github.com/andrei-m/vscode-open-in-browser/blob/deadbeef/src/open.ts#L1');
	});

	test('Github multi line', () => {
        const url = new UrlParsed('github.com', '/andrei-m/vscode-open-in-browser.git');
        const selection = new Selection('src/open.ts', 3, 5);
        const webUrl = gitUrlToWebUrl(url, UrlPlatform.Github, 'deadbeef', selection);
		assert.strictEqual(webUrl, 'https://github.com/andrei-m/vscode-open-in-browser/blob/deadbeef/src/open.ts#L3-L5');
	});

    test('Gitlab single line', () => {
        const url = new UrlParsed('gitlab.com', '/andrei-m/vscode-open-in-browser.git');
        const selection = new Selection('src/open.ts', 1, 1);
        const webUrl = gitUrlToWebUrl(url, UrlPlatform.Gitlab, 'deadbeef', selection);
		assert.strictEqual(webUrl, 'https://gitlab.com/andrei-m/vscode-open-in-browser/-/blob/deadbeef/src/open.ts#L1');
	});

	test('Gitlab multi line', () => {
        const url = new UrlParsed('gitlab.com', '/andrei-m/vscode-open-in-browser.git');
        const selection = new Selection('src/open.ts', 3, 5);
        const webUrl = gitUrlToWebUrl(url, UrlPlatform.Gitlab, 'deadbeef', selection);
		assert.strictEqual(webUrl, 'https://gitlab.com/andrei-m/vscode-open-in-browser/-/blob/deadbeef/src/open.ts#L3-L5');
	});

    test('Stash single line', () => {
        const url = new UrlParsed('stash.example.org', '/project/repo.git');
        const selection = new Selection('src/open.ts', 1, 1);
        const webUrl = gitUrlToWebUrl(url, UrlPlatform.Stash, 'deadbeef', selection);
		assert.strictEqual(webUrl, 'https://stash.example.org/projects/project/repos/repo/browse/src/open.ts?at=deadbeef#1');
	});

    test('Stash multi line', () => {
        const url = new UrlParsed('stash.example.org', '/project/repo.git');
        const selection = new Selection('src/open.ts', 3, 5);
        const webUrl = gitUrlToWebUrl(url, UrlPlatform.Stash, 'deadbeef', selection);
		assert.strictEqual(webUrl, 'https://stash.example.org/projects/project/repos/repo/browse/src/open.ts?at=deadbeef#3-5');
	});

    test('Azure DevOps SSH single line', () => {
        const url = new UrlParsed('ssh.dev.azure.com', '/v3/sub/org/repo.git');
        const selection = new Selection('src/open.ts', 1, 1);
        const webUrl = gitUrlToWebUrl(url, UrlPlatform.AzureDevOps, 'deadbeef', selection);
		assert.strictEqual(webUrl, 'https://sub.visualstudio.com/org/_git/repo?path=/src/open.ts&version=GCdeadbeef&line=1&lineEnd=2&lineStartColumn=1&_a=contents');
	});

    test('Azure DevOps HTTPS single line', () => {
        const url = GitUrlParse('https://user@dev.azure.com/some/org_name/_git/repo');
        const selection = new Selection('src/open.ts', 1, 1);
        const webUrl = gitUrlToWebUrl(url, UrlPlatform.AzureDevOps, 'deadbeef', selection);
		assert.strictEqual(webUrl, 'https://dev.azure.com/some/org_name/_git/repo?path=/src/open.ts&version=GCdeadbeef&line=1&lineEnd=2&lineStartColumn=1&_a=contents');
	});

    test('Azure DevOps path structure has fewer than 4 elements', () => {
        const url = new UrlParsed('ssh.dev.azure.com', '/v3/');
        const selection = new Selection('src/open.ts', 1, 1);
        assert.throws(() => {
            gitUrlToWebUrl(url, UrlPlatform.AzureDevOps, 'deadbeef', selection);
        }, Error);
	});
});
