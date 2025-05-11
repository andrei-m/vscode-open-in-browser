# open-in-browser

Open the current file the source control platform's web UI. This is useful for sharing perma-links with collaborators. Install via the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=open-in-browser.git-open-in-browser) or see [Installation Instructions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#packaging-extensions).

![example](https://raw.githubusercontent.com/andrei-m/vscode-open-in-browser/main/docs/example.gif)

## Features

This extension adds 'Open in Browser' to the Command Palette. Running this command opens the default web browser to the currently edited file's URL in the web platform related to the Git origin (e.g. Github). The URL represents the current position of the cursor or the current multi-line selection.

Commonly used platforms such as Github and Gitlab are recognized automatically from the Git origin. Self-hosted web platforms such as Stash can be specified via the `remote.$remoteName.url-platform` git configuration setting in the edited file's repo, for example:

```
git config --add remote.origin.url-platform stash
```

The following remote.config.url-platform options are supported:

* ado
* github
* gitlab
* stash

An extension-wide setting can also be configured as a default for all repos. The priority order for remote web platform resolution is:

1. The `remote.origin.url-platform` setting described above.
2. Well-known domains guessed from the remote host (github.com, etc).
3. The extension-wide setting.

## Requirements

VSCode 1.85.0 or newer

## Release Notes

### [0.0.4] - 2025-05-11

#### Changed

- Fixed removal of untracked files when using the extension
- Upgrade simple-git to 3.27.0

See [CHANGELOG.md](https://raw.githubusercontent.com/andrei-m/vscode-open-in-browser/main/CHANGELOG.md) for release history and work-in-progress.

## Development

Compile before debugging. Debug (F5) while editing `extension.ts` to spawn a VSCode debug instance.
```
$ npm run compile
```

Tests run within a VSCode execution environment.
```
$ npm run test
```
