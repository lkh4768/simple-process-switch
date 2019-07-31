const uuid = require('uuid/v1');
const path = require('path');
const {promises: fsPromises} = require('fs');

const utils = require('../utils');
const config = require('../config');

exports.EXT = 'log';
exports.DIR_NAME = 'log';

exports.openLogFileUsingKey = async key => {
  const logFile = await exports.genLogPathUsingKey(key);
  const fd = await fsPromises.open(logFile, 'w+');
  return fd;
};

exports.genLogPathUsingKey = async key => {
  const configPath = await config.getRootPath();
  const logDirPath = path.join(configPath, exports.DIR_NAME);
  await utils.mkdirfp(logDirPath);
  return path.join(logDirPath, `${key}_${uuid()}.${exports.EXT}`);
};
