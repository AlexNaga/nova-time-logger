const os = require('os');
const { getDate } = require('./dateHelper');

const getFileName = () => {
  const dateNow = getDate();
  const filename = `${dateNow}.png`;
  return filename;
};

export const getFilePath = (dirName = 'misc') => {
  dirName = dirName.toLowerCase();
  const fileName = getFileName();
  const filePath = `${__dirname}/../screenshots/${dirName}/${fileName}`;
  return filePath;
};

export const getSystemType = () => os.type().toLowerCase();

export const capitalize = (str: string) => str && str[0].toUpperCase() + str.slice(1);
