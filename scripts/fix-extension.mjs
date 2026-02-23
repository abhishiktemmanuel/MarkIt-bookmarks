import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../out');
const EXT_DIST_DIR = path.join(__dirname, '../extension-dist');

async function fixExtension() {
  console.log('--- Starting Extension Build Fix ---');

  // 1. Clean and create extension-dist
  if (fs.existsSync(EXT_DIST_DIR)) {
    fs.rmSync(EXT_DIST_DIR, { recursive: true });
  }
  fs.mkdirSync(EXT_DIST_DIR);

  // 2. Copy all files from 'out' to 'extension-dist'
  copyRecursiveSync(DIST_DIR, EXT_DIST_DIR);
  console.log('Copied files to extension-dist');

  // 3. Rename '_next' folder to 'next-assets'
  const oldNextPath = path.join(EXT_DIST_DIR, '_next');
  const newNextPath = path.join(EXT_DIST_DIR, 'next-assets');
  if (fs.existsSync(oldNextPath)) {
    fs.renameSync(oldNextPath, newNextPath);
    console.log('Renamed _next to next-assets');
  }

  // 4. Recursively find all HTML, JS, and CSS files to update references
  updateReferences(EXT_DIST_DIR);
  console.log('Updated references in all files');

  console.log('--- Extension Build Fix Complete ---');
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function updateReferences(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      updateReferences(filePath);
    } else {
      const ext = path.extname(file);
      if (['.html', '.js', '.css'].includes(ext)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace /_next/ with /next-assets/
        // Using global regex for all occurrences
        let updatedContent = content.replace(/\/_next\//g, '/next-assets/');
        
        if (ext === '.html') {
          // Extract inline scripts
          const inlineScriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
          let scriptIndex = 1;
          updatedContent = updatedContent.replace(inlineScriptRegex, (match, scriptContent, offset, string) => {
             // If it has a src attribute, skip
             if (match.match(/src=["']/i)) {
                return match;
             }
             // Ignore empty scripts
             if (!scriptContent.trim()) {
                return match;
             }
             
             // Write script content to a new file
             const scriptFileName = `${path.basename(file, '.html')}-inline-${scriptIndex}.js`;
             const scriptFilePath = path.join(dir, scriptFileName);
             fs.writeFileSync(scriptFilePath, scriptContent, 'utf8');
             
             scriptIndex++;
             
             // Return replacement with external script
             // We preserve the other attributes if any, but since it's Next.js generated, we can just do:
             return `<script src="./${scriptFileName}"></script>`;
          });
        }
        
        if (content !== updatedContent) {
          fs.writeFileSync(filePath, updatedContent, 'utf8');
        }
      }
    }
  });
}

fixExtension().catch(console.error);
