import { join } from 'path';
import { unlink, readdir, stat } from 'fs/promises';
import cron from 'node-cron';

const MAX_FILE_AGE = 24 * 60 * 60 * 1000;

const exists = async (path: string): Promise<boolean> => {
  try {
    await stat(path);
    return true;
  } catch (error) {
    return false;
  }
};

const cleanupTempFiles = async () => {
  const tempDir = join(__dirname, '../../../src/public/temp');
  if (!await exists(tempDir)) {
    return;
  }

  const files = await readdir(tempDir);

  files.forEach(async (file) => {
    const filePath = join(tempDir, file);
    const stats = await stat(filePath);

    const fileAge = Date.now() - stats.birthtimeMs;

    if (fileAge > MAX_FILE_AGE) {
      await unlink(filePath);
    }
  });
};

export const startCleanupSchedule = () => {
  cron.schedule('0 * * * *', cleanupTempFiles);
};

export default startCleanupSchedule;
