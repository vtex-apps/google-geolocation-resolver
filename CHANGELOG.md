# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2020-12-29
### Fixed
- Reduced costs when using address query.
- Handle and log Google errors when inner response status code differs from OK.

### Added
- Handle country argument on address suggestions query.

## [0.3.2] - 2020-12-21
### Fixed
- False positive warning log for languages with hyphen.

## [0.3.1] - 2020-12-15
### Fixed
- Bug that caused all requests to Google Maps API to fail.

## [0.3.0] - 2020-12-11
### Added
- Resolver for sessionToken query.
- Handle session tokens on search resolvers.

## [0.2.0] - 2020-12-04
### Added
- Resolver for providerLogo query.

## [0.1.0] - 2020-10-29
### Added
- First version.
