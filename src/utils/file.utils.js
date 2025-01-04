import fs from 'fs';
import path from 'path';

export function normalizeFilePath(file) {
  return file && ('/' + file.path.replace(/\\/g, '/'));
}

export function deleteFile(file, cb = () => { }) {
  file = typeof file === 'string' ? file : file?.path;
  if (file) fs.unlink(path.resolve(file), cb);
}

// Utility to copy specific files
export function copyFileSync(source, target) {
  const targetFile = target;

  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

export function copyFilesSync(files, sourceDir, targetDir) {
  files.forEach((file) => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    if (fs.existsSync(sourcePath)) {
      const targetDirPath = path.dirname(targetPath);
      if (!fs.existsSync(targetDirPath)) {
        fs.mkdirSync(targetDirPath, { recursive: true });
      }
      copyFileSync(sourcePath, targetPath);
    }
  });
}
