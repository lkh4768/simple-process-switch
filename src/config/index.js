const path = require('path');
const {promises: fsPromises} = require('fs');

exports.ROOT_PATH = path.join(
  process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
  '.sps/',
);

exports.getRootPath = async () => {
  const isExistsRoot = await exports.existsRoot();
  if (!isExistsRoot) {
    await exports.makeRoot();
  }
  return exports.ROOT_PATH;
};

exports.existsRoot = async () => {
  try {
    await fsPromises.access(exports.ROOT_PATH);
  } catch (err) {
    return false;
  }
  return true;
};

exports.makeRoot = async () => {
  await fsPromises.mkdir(exports.ROOT_PATH, {recursive: true});
};
