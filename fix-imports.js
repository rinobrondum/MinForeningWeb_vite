import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Convert __dirname using ES module equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Directory where your source files are located (usually 'src' folder)
const srcDir = join(__dirname, 'src');

// Function to scan files recursively
const getFilesRecursively = (dir) => {
  let results = [];
  const list = readdirSync(dir);
  list.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    if (stat && stat.isDirectory()) {
      // Recursively search in subdirectories
      results = results.concat(getFilesRecursively(filePath));
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      // Only push JavaScript files
      results.push(filePath);
    }
  });
  return results;
};

// Regular expression to match import paths
const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;

// Function to determine if an import is local and not an external library
const isLocalImport = (importPath) => {
  // If it starts with ./ or ../, it's already a relative path
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    return false;
  }

  // If it starts with a letter or @, it's probably an external library
  if (/^[a-zA-Z@]/.test(importPath)) {
    return false;
  }

  // If none of the above, it's likely a local file import that needs fixing
  return true;
};

// Function to fix incorrect imports in a file and write changes back
const fixImportsInFile = (filePath) => {
  let content = readFileSync(filePath, 'utf8');
  let changed = false;

  const fixedContent = content.replace(importRegex, (match, importPath) => {
    // Only process local imports that are not already relative
    if (isLocalImport(importPath)) {
      const fixedPath = `./${importPath}`;  // Convert to relative path
      console.log(`Fixing import in ${filePath}: ${importPath} -> ${fixedPath}`);
      changed = true;
      return match.replace(importPath, fixedPath);
    }
    return match;
  });

  // Write the updated content back to the file if changes were made
  if (changed) {
    writeFileSync(filePath, fixedContent, 'utf8');
    console.log(`Updated file: ${filePath}`);
  }
};

// Function to start fixing all imports
const fixAllImports = () => {
  const files = getFilesRecursively(srcDir);
  files.forEach((filePath) => {
    fixImportsInFile(filePath);
  });
  console.log('Import paths have been fixed!');
};

fixAllImports();
