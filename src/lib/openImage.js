const { getSystemType } = require('./fileHelper');
const open = require('open');

const openImage = async (filePath) => {
  const systemType = getSystemType();
  const isMacOs = systemType === 'darwin';

  if (isMacOs) {
    await open(filePath, { app: 'google chrome' });
  } else {
    await open(filePath);
  }
};

module.exports = { openImage };