#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Read the current version from package.json
const packageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));
const newVersion = packageJson.version;

console.log(`Syncing version to ${newVersion}...`);

// Update src-tauri/tauri.conf.json
const tauriConfigPath = join(projectRoot, 'src-tauri', 'tauri.conf.json');
const tauriConfig = JSON.parse(readFileSync(tauriConfigPath, 'utf8'));
tauriConfig.version = newVersion;
writeFileSync(tauriConfigPath, JSON.stringify(tauriConfig, null, 2) + '\n');
console.log('✓ Updated src-tauri/tauri.conf.json');

// Update src-tauri/Cargo.toml
const cargoTomlPath = join(projectRoot, 'src-tauri', 'Cargo.toml');
let cargoContent = readFileSync(cargoTomlPath, 'utf8');
cargoContent = cargoContent.replace(
  /^version = ".*"$/m,
  `version = "${newVersion}"`
);
writeFileSync(cargoTomlPath, cargoContent);
console.log('✓ Updated src-tauri/Cargo.toml');

console.log(`\n🎉 Version sync complete! All files now use version ${newVersion}`);
console.log('\nVersion bump types:');
console.log('  npm run version:patch  - Bug fixes (0.1.0 → 0.1.1)');
console.log('  npm run version:minor  - New features (0.1.0 → 0.2.0)');
console.log('  npm run version:major  - Breaking changes (0.1.0 → 1.0.0)');
