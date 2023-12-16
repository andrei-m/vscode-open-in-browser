import * as assert from 'assert';
import { gitUrlToWebUrl, UrlParsed } from '../open';
import { Selection } from '../editor';

suite('gitUrlToWebUrl', () => {
	test('Github single line', () => {
        const url = new UrlParsed('github.com', '/andrei-m/vscode-open-in-web-scm.git');
        const selection = new Selection('src/open.ts', 1, 1);
        const webUrl = gitUrlToWebUrl(url, 'deadbeef', selection);
		assert.strictEqual('https://github.com/andrei-m/vscode-open-in-web-scm/blob/deadbeef/src/open.ts#L1', webUrl);
	});
    
	test('Github multi line', () => {
        const url = new UrlParsed('github.com', '/andrei-m/vscode-open-in-web-scm.git');
        const selection = new Selection('src/open.ts', 3, 5);
        const webUrl = gitUrlToWebUrl(url, 'deadbeef', selection);
		assert.strictEqual('https://github.com/andrei-m/vscode-open-in-web-scm/blob/deadbeef/src/open.ts#L3-L5', webUrl);
	});
});