#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const templateDir = path.resolve(__dirname, '..');
const targetDir = process.cwd();

// Copy all files from templateDir to targetDir
const copyRecursiveSync = (src, dest) => {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

// Start copying files
copyRecursiveSync(templateDir, targetDir);

// Install dependencies
console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

console.log('Starter kit setup complete!');
