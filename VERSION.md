# Version Management

The Wisp Editor uses semantic versioning (semver): `MAJOR.MINOR.PATCH`

## How to Bump Versions

Use these npm scripts to automatically bump versions across all relevant files:

### Patch Version (Bug fixes)
```bash
npm run version:patch
```
**Example:** `0.1.0` → `0.1.1`
**When to use:** Bug fixes, small improvements, no new features

### Minor Version (New features) 
```bash
npm run version:minor
```
**Example:** `0.1.0` → `0.2.0`  
**When to use:** New features, enhancements, backwards-compatible changes

### Major Version (Breaking changes)
```bash
npm run version:major
```
**Example:** `0.1.0` → `1.0.0`
**When to use:** Breaking changes, major redesigns, API changes

## What Gets Updated

The version sync script automatically updates:

- `package.json` (npm does this)
- `src-tauri/tauri.conf.json` (Tauri config)  
- `src-tauri/Cargo.toml` (Rust package)
- The UI footer shows the version dynamically from `package.json`

## Current Version Scheme

We're currently in **0.x.x** (pre-1.0) development:

- **0.1.x** - Initial bootstrap, basic editor functionality
- **0.2.x** - Full compiler integration, file dialogs
- **0.3.x** - Monaco editor integration, syntax highlighting
- **0.4.x** - Canvas preview, sprite editing
- **0.5.x** - TypeScript VM integration
- **1.0.0** - First stable release

## Manual Version Updates

If you need to manually set a version:

1. Update `package.json`
2. Run: `node scripts/sync-version.js`

This ensures all files stay in sync.
