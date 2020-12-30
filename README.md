# HotLoop coverage action

This action publishes coverage information to HotLoop analytics

## Inputs

### `report-path`

**Required** The path to the coverage report fle

### `token`

**Required** Your HotLoop API token

## Example usage

uses: hotloop/coverage-action@master
with:
  report-path: .nyc_report/lcov.info
  token: your-hotloop-token
