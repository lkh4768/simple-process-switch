const path = require('path');
const utils = require('../utils');

exports.ROOT_PATH = path.join(
  process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
  '.sps/',
);

exports.getRootPath = async () => {
  await utils.mkdirfp(exports.ROOT_PATH);
  return exports.ROOT_PATH;
};
