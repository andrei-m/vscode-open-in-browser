import * as assert from 'assert';
import { UrlParsed, UrlPlatform, resolveUrlPlatform }  from '../git';

suite('resolveUrlPlatform', () => {
    test('git-configured setting is highest priority', () => {
        const gitConfigured = UrlPlatform.AzureDevOps;
        const url = new UrlParsed('github.com', '');
        const extConfigured = UrlPlatform.Gitlab;

        const result = resolveUrlPlatform(gitConfigured, url, extConfigured);
        assert.strictEqual(result, UrlPlatform.AzureDevOps);
    });

    test('well-known domain: Github', () => {
        const gitConfigured = null;
        const url = new UrlParsed('github.com', '');
        const extConfigured = UrlPlatform.Gitlab;

        const result = resolveUrlPlatform(gitConfigured, url, extConfigured);
        assert.strictEqual(result, UrlPlatform.Github);
    });

    test('well-known domain: Gitlab', () => {
        const gitConfigured = null;
        const url = new UrlParsed('gitlab.com', '');
        const extConfigured = UrlPlatform.Stash;

        const result = resolveUrlPlatform(gitConfigured, url, extConfigured);
        assert.strictEqual(result, UrlPlatform.Gitlab);
    });

    test('well-known domain: Azure for Azure DevOps', () => {
        const gitConfigured = null;
        const url = new UrlParsed('azure.com', '');
        const extConfigured = UrlPlatform.Stash;

        const result = resolveUrlPlatform(gitConfigured, url, extConfigured);
        assert.strictEqual(result, UrlPlatform.AzureDevOps);
    });

    test('domains are case-insentive', () => {
        const gitConfigured = null;
        const url = new UrlParsed('AzuRE.com', '');
        const extConfigured = UrlPlatform.Stash;

        const result = resolveUrlPlatform(gitConfigured, url, extConfigured);
        assert.strictEqual(result, UrlPlatform.AzureDevOps);
    });

    test('fall back to the extension-configured default', () => {
        const gitConfigured = null;
        const url = new UrlParsed('example.org', '');
        const extConfigured = UrlPlatform.Stash;

        const result = resolveUrlPlatform(gitConfigured, url, extConfigured);
        assert.strictEqual(result, UrlPlatform.Stash);
    });
});
