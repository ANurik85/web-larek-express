import fs, { existsSync, mkdirSync } from 'fs';
import { basename, join } from 'path';

function movingFile(imagePath: string, from: string, to: string) {
  const fileName = basename(imagePath);
  const sourcePath = join(from, fileName);
  const destPath = join(to, fileName);

  if (!existsSync(sourcePath)) {
    throw new Error(`Ошибка при сохранении файла: временный файл не найден по пути ${sourcePath}`);
  }

  try {
    const destDir = join(to, '..');
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }
    fs.promises.rename(sourcePath, destPath);
  } catch (error: unknown) {
    throw new Error(`Ошибка при сохранении и перемещаем файла: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export default movingFile;
