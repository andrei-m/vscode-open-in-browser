# Change Log

All notable changes to the "open-in-browser" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.3] - 2024-12-23

### Changed

- Fixed Azure DevOps with HTTPS remotes to open on the `dev.azure.com` host. Previous `visualstudio.com` subdomains no longer work in my testing. SSH remotes need to be re-tested.

## [0.0.2] - 2024-02-24

### Added

- An extension-wide setting for the web platform. This is a convenience to avoid configuring many per-repo settings for repos that would otherwise be unrecognized.
- Notifications for common error modes such as editing files that are not managed in Git

### Changed

- Web platform resolution based on the remote URL's domain is now case-insensitive.

## [0.0.1] - 2024-02-09

### Added

- Initial Release
- Support for Github, Gitlab, Stash, and Azure DevOps
