import os from 'os';
import { getDate } from './dateHelper';

const getFileName = (days = 0) => {
  const dateNow = getDate({ days });
  const filename = `${dateNow}.png`;
  return filename;
};

export const getFilePath = (dirName = 'misc', days = 0) => {
  dirName = dirName.toLowerCase();
  const fileName = getFileName(days);
  const filePath = `${__dirname}/../screenshots/${dirName}/${fileName}`;
  return filePath;
};

export const getSystemType = () => os.type().toLowerCase();

export const capitalize = (str: string) => str && str[0].toUpperCase() + str.slice(1);
