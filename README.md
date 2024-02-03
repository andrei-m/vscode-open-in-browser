# open-in-browser

Open the current file the source control platform's web UI. This is useful for sharing perma-links with collaborators.

![example](https://raw.githubusercontent.com/andrei-m/vscode-open-in-browser/main/docs/example.gif)

See [Installation Instructions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#packaging-extensions).

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

## Requirements

VSCode 1.85.0 or newer

## Release Notes

### 0.0.1

Initial release:

    * Github, Gitlab, Stash, and Azure DevOps support


## Development

Compile before debugging. Debug (F5) while editing `extension.ts` to spawn a VSCode debug instance.
```
$ npm run compile
```

Tests run within a VSCode execution environment.
```
$ npm run test
```
