const path = require('path');
const {promises: fsPromises} = require('fs');

const utils = require('../utils');

exports.ROOT_PATH = path.join(
  process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
  '.sps/',
);

exports.CONFIG_FILE_NAME = 'config.json';

exports.getRootPath = async () => {
  await utils.mkdirfp(exports.ROOT_PATH);
  return exports.ROOT_PATH;
};

exports.read = async () => {
  const ret = await fsPromises.readFile(
    path.join(exports.ROOT_PATH, exports.CONFIG_FILE_NAME),
  );
  return JSON.parse(ret.toString());
};
