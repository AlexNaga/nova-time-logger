import open from 'open';
import { getSystemType } from './fileHelper';

export const openImage = async (filePath: string) => {
  const systemType = getSystemType();
  const isMacOs = systemType === 'darwin';

  if (isMacOs) {
    await open(filePath, { app: 'google chrome' });
  } else {
    await open(filePath);
  }
};
