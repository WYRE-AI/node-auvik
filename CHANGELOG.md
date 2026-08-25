## [1.3.1](https://github.com/WYRE-AI/node-auvik/compare/v1.3.0...v1.3.1) (2026-08-11)


### Bug Fixes

* **resources:** throw descriptive error when JSON:API data is empty or absent ([#33](https://github.com/WYRE-AI/node-auvik/issues/33)) ([62cf835](https://github.com/WYRE-AI/node-auvik/commit/62cf83589ec3074a1304dd428fbc04877bc57438)), closes [WYRE-AI/halopsa-mcp#76](https://github.com/WYRE-AI/halopsa-mcp/issues/76) [WYRE-AI/node-halopsa#59](https://github.com/WYRE-AI/node-halopsa/issues/59)

# [1.3.0](https://github.com/WYRE-AI/node-auvik/compare/v1.2.4...v1.3.0) (2026-06-18)


### Features

* add public AuvikClient.request() raw passthrough ([69549e6](https://github.com/WYRE-AI/node-auvik/commit/69549e6265b1d078ee9ed17de1d85a6a84c76b92))

## [1.2.4](https://github.com/WYRE-AI/node-auvik/compare/v1.2.3...v1.2.4) (2026-06-16)


### Bug Fixes

* correct billing usage endpoints and default statistics thruTime ([#17](https://github.com/WYRE-AI/node-auvik/issues/17)) ([1e31aa6](https://github.com/WYRE-AI/node-auvik/commit/1e31aa6d2eeb09e05d34604d5429dfd5ed8b9939))

## [1.2.3](https://github.com/WYRE-AI/node-auvik/compare/v1.2.2...v1.2.3) (2026-06-16)


### Bug Fixes

* correct single-get + statistics endpoint paths ([#16](https://github.com/WYRE-AI/node-auvik/issues/16)) ([0b66488](https://github.com/WYRE-AI/node-auvik/commit/0b664880c86116bdde9337965f3a72dd2f8e8492))

## [1.2.2](https://github.com/WYRE-AI/node-auvik/compare/v1.2.1...v1.2.2) (2026-06-16)


### Bug Fixes

* correct Auvik alert endpoint paths ([#15](https://github.com/WYRE-AI/node-auvik/issues/15)) ([b6a93c7](https://github.com/WYRE-AI/node-auvik/commit/b6a93c760bbd457f9b6034fe2193034d2b52b2fe))

## [1.2.1](https://github.com/WYRE-AI/node-auvik/compare/v1.2.0...v1.2.1) (2026-06-15)


### Bug Fixes

* parse JSON:API responses (application/vnd.api+json) ([#14](https://github.com/WYRE-AI/node-auvik/issues/14)) ([ccf438b](https://github.com/WYRE-AI/node-auvik/commit/ccf438b8856332b9629404d4f393a82289d1d13d))

# [1.2.0](https://github.com/WYRE-AI/node-auvik/compare/v1.1.0...v1.2.0) (2026-06-15)


### Features

* add us6 and lnx Auvik API regions ([#13](https://github.com/WYRE-AI/node-auvik/issues/13)) ([c612c08](https://github.com/WYRE-AI/node-auvik/commit/c612c08a0c145dd1a0614e3c974cdca222dc7b73))

# [1.1.0](https://github.com/WYRE-AI/node-auvik/compare/v1.0.0...v1.1.0) (2026-06-15)


### Features

* add support for us5 Auvik API region ([#12](https://github.com/WYRE-AI/node-auvik/issues/12)) ([ed52b6c](https://github.com/WYRE-AI/node-auvik/commit/ed52b6c3d7f07d3cc221fe22b3f07baedc69d5ec))

# 1.0.0 (2026-05-21)


### Features

* initial release of @wyre-ai/node-auvik ([74d83f8](https://github.com/WYRE-AI/node-auvik/commit/74d83f877b36197da791f158fd9e93fbe33aef1b))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- **Single-resource get/detail/statistics endpoints used wrong paths (404 / 400).** Corrected: single tenant read is `/tenants/detail/{id}` (was `/tenants/{id}`); device details are singular `/inventory/device/detail[/ {id}]` and `/inventory/device/detail/extended` (was plural `/details`, `/info/extended-details`); statistics are `/stat/{type}/{statId}` with `filter[fromTime]`/`filter[interval]`/`filter[thruTime]` params and SNMP-poller stats at `/stat/oid/{statId}` (was bare `/stat/device` etc. with unwrapped params and no statId). `StatisticsOptions` now takes `statId` + `interval`. Added path-assertion tests for tenants/device/statistics.

### Fixed
- **Alert endpoints used the wrong paths (404 "resource not found").** `listHistory`/`getHistory`/`dismiss` hit `/alert/history`, `/alert/history/{id}`, and `/alert/history/{id}/dismiss`, but the real Auvik Alerts API is `/alert/history/info`, `/alert/history/info/{id}`, and `/alert/dismiss/{id}`. Corrected all three and added request-path assertions to the alerts tests.
- **JSON:API responses were silently dropped, breaking every list/get call.** The HTTP client only parsed the body when `content-type` contained `application/json`, but the Auvik API is JSON:API and responds with `application/vnd.api+json`. As a result every successful response returned `{}`, and resource mappers then threw `Cannot read properties of undefined (reading 'id')`. The check now matches any JSON content-type (`includes('json')`), covering `application/vnd.api+json` and `; charset=utf-8` suffixes. Added a regression test.

### Added
- Support for the `us6` and `lnx` Auvik API regions (`auvikapi.us6.my.auvik.com`, `auvikapi.lnx.my.auvik.com`). Added to the `AuvikRegion` type and the auto-resolution probe list so credentials on those US East (Ohio) clusters resolve correctly.
- Support for the `us5` Auvik API region (`auvikapi.us5.my.auvik.com`). Added to the `AuvikRegion` type and the auto-resolution probe list so credentials on the US5 cluster resolve correctly.

## [0.1.0] - 2026-05-21

### Added
- Initial release of @wyre-ai/node-auvik
- Support for all major Auvik API endpoints:
  - Tenant management
  - Device inventory (info, details, warranty, lifecycle)
  - Network inventory (info, details)
  - Interface inventory
  - Configuration management
  - Entity notes and audits
  - Component information
  - Alert history and dismissal
  - Statistics (device, interface, service, component, SNMP poller)
  - Billing usage reports
- Automatic region detection with caching
- Built-in retry logic with exponential backoff
- Rate limiting protection
- TypeScript support with strict typing
- JSON:API response handling
- Pagination support with async iterators
- Comprehensive test coverage
- ESM and CommonJS module support
