# open-in-web-scm

Open the current file the source control platform's web UI. This is useful for sharing perma-links with collaborators.

## Features

This extension adds 'Open in Web SCM' to the Command Palette. Running this command opens the default web browser to the currently edited file's URL in the SCM's web platform (e.g. Github). The URL represents the current position of the cursor or the current multi-line selection.

Github and Gitlab URLs are recognized automatically from the git remote URL's host. Self-hosted web platforms such as Stash can be specified via the `remote.$remoteName.url-platform` git configuration setting in the edited file's repo, for example:

```
git config --add remote.origin.url-platform stash
```

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.


## Release Notes

### 0.0.1

Initial release:

    * Github, Gitlab, and Stash support


## Development

Compile before debugging. Debug (F5) while editing `extension.ts` to spawn a VSCode debug instance.
```
$ npm run compile
```

Tests run within a VSCode execution environment.
```
$ npm run test
```
