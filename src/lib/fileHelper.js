const { getDate } = require('./dateHelper');
const os = require('os');

const getFileName = () => {
  const dateNow = getDate();
  const filename = `${dateNow}.png`;
  return filename;
};

const getFilePath = () => {
  const fileName = getFileName();
  const filePath = `${__dirname}/../../output/${fileName}`;
  return filePath;
};

const getSystemType = () => {
  return os.type().toLowerCase();
};

module.exports = {
  getFilePath,
  getSystemType,
};