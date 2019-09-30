const os = require('os');
const { getDate } = require('./dateHelper');

const getFileName = () => {
  const dateNow = getDate();
  const filename = `${dateNow}.png`;
  return filename;
};

const getFilePath = (dirName = 'misc') => {
  const fileName = getFileName();
  const filePath = `${__dirname}/../../output/${dirName}/${fileName}`;
  return filePath;
};

const getSystemType = () => os.type().toLowerCase();

module.exports = {
  getFilePath,
  getSystemType,
};
