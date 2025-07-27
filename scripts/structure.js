// scripts/structure.js
const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

// More comprehensive ignore list for a cleaner output
const ignoredFolders = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  '.venv',
  'venv', // UPDATED: Added 'venv' to the ignore list
  '.vscode',
  'build',
  'out',
  '.pnpm-store',
]);

const ignoredFiles = new Set([
  'package-lock.json',
  'pnpm-lock.yaml',
  '.env',
  '.env.local',
  '.DS_Store',
  'npm-debug.log',
  'yarn-debug.log',
  'yarn-error.log',
]);

// Ignore files by their extension
const ignoredExtensions = new Set([
  '.log',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.webp',
]);

function generateTree(directory, prefix = '') {
  let files;
  try {
    files = fs.readdirSync(directory);
  } catch (error) {
    return; // Ignore directories we can't read
  }

  const filteredItems = files.filter(file => {
    // This logic now correctly checks the folder name against the ignored list
    if (fs.statSync(path.join(directory, file)).isDirectory()) {
      return !ignoredFolders.has(file);
    }
    // This logic checks file names and extensions
    return !ignoredFiles.has(file) && !ignoredExtensions.has(path.extname(file));
  });

  filteredItems.forEach((file, index) => {
    const fullPath = path.join(directory, file);
    try {
      const stats = fs.statSync(fullPath);
      const isLast = index === filteredItems.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      console.log(prefix + connector + file);

      if (stats.isDirectory()) {
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        generateTree(fullPath, newPrefix);
      }
    } catch (error) {
      // Silently ignore
    }
  });
}

console.log(`\nProject Structure for: ${path.basename(rootDir)}\n`);
generateTree(rootDir);
console.log('\n');