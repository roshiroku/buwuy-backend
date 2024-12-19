import fs from 'fs';
import path from 'path';

export function normalizeFilePath(file) {
  return file && ('/' + file.path.replace(/\\/g, '/'));
}

export function deleteFile(file, cb = () => { }) {
  file = typeof file === 'string' ? file : file?.path;
  if (file) fs.unlink(path.resolve(file), cb);
}
