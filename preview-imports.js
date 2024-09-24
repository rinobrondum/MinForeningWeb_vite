import { readdirSync, statSync, readFileSync } from 'fs';
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

// Updated regular expression to match imports more flexibly
const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;

// Function to determine if an import is a local file import
const isLocalImport = (importPath) => {
  // If it's already relative (starts with ./ or ../), it's fine
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    return false;
  }

  // External libraries typically start with a letter or @
  if (/^[a-zA-Z@]/.test(importPath)) {
    return false;
  }

  // If it's neither a relative path nor an external library, it's likely a local path (e.g., 'app/components')
  return true;
};

// Function to preview incorrect imports in a file
const previewImportsInFile = (filePath) => {
  const content = readFileSync(filePath, 'utf8');

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];

    // Check if it's a local import that isn't relative
    if (isLocalImport(importPath)) {
      const fixedPath = `./${importPath}`;  // What the new relative path would be
      console.log(`Preview: ${filePath} -> Change: ${importPath} -> ${fixedPath}`);
    }
  }
};

// Function to start previewing all imports
const previewAllImports = () => {
  const files = getFilesRecursively(srcDir);
  files.forEach((filePath) => {
    previewImportsInFile(filePath);
  });
  console.log('Preview complete! No files were changed.');
};

previewAllImports();
