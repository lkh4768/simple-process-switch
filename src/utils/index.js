const {promises: fsPromises} = require('fs');

exports.mkdirfp = async dirPath => {
  if (typeof dirPath !== 'string') {
    throw new Error('Invalid dir path');
  }
  const isExistsRoot = await exports.existsFile(dirPath);
  if (!isExistsRoot) {
    await exports.mkdirp(dirPath);
  }
};

exports.mkdirp = async dirPath => {
  await fsPromises.mkdir(dirPath, {recursive: true});
};

exports.existsFile = async filePath => {
  try {
    await fsPromises.access(filePath);
  } catch (err) {
    return false;
  }
  return true;
};
