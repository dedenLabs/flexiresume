import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = __dirname; // Script is in project root
const publicDir = path.join(projectRoot, 'public');
const docsDir = path.join(projectRoot, 'docs');

/**
 * Progress tracking for dynamic display
 */
let progressState = {
  totalFiles: 0,
  processedFiles: 0,
  copiedFiles: 0,
  skippedFiles: 0,
  currentFile: ''
};

/**
 * Update progress display on the same line
 */
function updateProgress() {
  const percentage = progressState.totalFiles > 0
    ? Math.round((progressState.processedFiles / progressState.totalFiles) * 100)
    : 0;

  const status = `Processing: ${progressState.processedFiles}/${progressState.totalFiles} (${percentage}%) | ` +
                `Copied: ${progressState.copiedFiles} | Skipped: ${progressState.skippedFiles} | ` +
                `Current: ${progressState.currentFile}`;

  // Clear line and write new status
  process.stdout.write('\r' + ' '.repeat(120) + '\r' + status);
}

/**
 * Count total files in directory recursively
 * @param {string} dir Directory path
 * @param {string[]} excludeDirs Directories to exclude
 * @returns {number} Total file count
 */
function countFiles(dir, excludeDirs = []) {
  if (!fs.existsSync(dir)) return 0;

  let count = 0;
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      if (!excludeDirs.includes(path.basename(itemPath))) {
        count += countFiles(itemPath, excludeDirs);
      }
    } else {
      count++;
    }
  }

  return count;
}

/**
 * Recursively copy directory, skip if target file already exists
 * @param {string} src Source directory
 * @param {string} dest Destination directory
 * @param {boolean} showProgress Whether to show progress
 */
function copyDirectoryIfNotExists(src, dest, showProgress = false) {
  if (!fs.existsSync(src)) {
    if (!showProgress) console.log(`Source directory does not exist: ${src}`);
    return { copied: 0, skipped: 0 };
  }

  // Ensure destination directory exists
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);
  let copiedCount = 0;
  let skippedCount = 0;

  // Define directories to exclude
  const excludeDirs = ['.git', 'node_modules', '.vscode', '.idea'];


  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      const dirName = path.basename(srcPath);

      // Check if current directory is in exclude list
      if (excludeDirs.includes(dirName)) {
        if (!showProgress) console.log(`Skipping directory: ${srcPath}`);
        continue;
      }
      // Recursively process subdirectories
      const result = copyDirectoryIfNotExists(srcPath, destPath, showProgress);
      if (result) {
        copiedCount += result.copied;
        skippedCount += result.skipped;
      }
    } else {
      // Process files
      const relativePath = path.relative(projectRoot, destPath);

      if (showProgress) {
        progressState.currentFile = relativePath;
        progressState.processedFiles++;
        updateProgress();
      }

      if (fs.existsSync(destPath)) {
        if (!showProgress) console.log(`Skipping existing file: ${relativePath}`);
        skippedCount++;
        if (showProgress) progressState.skippedFiles++;
      } else {
        fs.copyFileSync(srcPath, destPath);
        if (!showProgress) console.log(`Copying file: ${path.relative(projectRoot, srcPath)} -> ${relativePath}`);
        copiedCount++;
        if (showProgress) progressState.copiedFiles++;
      }
    }
  }

  return { copied: copiedCount, skipped: skippedCount };
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Starting to map public directory to docs directory...');
  console.log(`Source directory: ${publicDir}`);
  console.log(`Target directory: ${docsDir}`);
  console.log('');

  try {
    // Count total files for progress tracking
    console.log('📊 Counting files...');
    progressState.totalFiles = countFiles(publicDir, ['.git', 'node_modules', '.vscode', '.idea']);

    if (progressState.totalFiles === 0) {
      console.log('ℹ️ No files to copy');
      return;
    }

    console.log(`📁 Found ${progressState.totalFiles} files to process`);
    console.log('');

    // Start copying with progress display
    const result = copyDirectoryIfNotExists(publicDir, docsDir, true);

    // Clear progress line and show final results
    process.stdout.write('\r' + ' '.repeat(120) + '\r');
    console.log('✅ Mapping completed!');
    console.log(`📁 Files copied: ${result.copied}`);
    console.log(`⏭️ Files skipped: ${result.skipped}`);

    if (result.copied === 0 && result.skipped === 0) {
      console.log('ℹ️ No files needed to be copied');
    }
  } catch (error) {
    // Clear progress line before showing error
    process.stdout.write('\r' + ' '.repeat(120) + '\r');
    console.error('❌ Error occurred during copying:', error.message);
    process.exit(1);
  }
}

// Run main function
main();