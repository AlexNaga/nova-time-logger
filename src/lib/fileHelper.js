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

const capitalize = str => str && str[0].toUpperCase() + str.slice(1);

module.exports = {
  capitalize,
  getFilePath,
  getSystemType,
};
