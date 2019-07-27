const childProcess = require('child_process');
const {promises: fsPromises} = require('fs');
const path = require('path');
const uuid = require('uuid/v1');

const config = require('../config');
const utils = require('../utils');

exports.LOG_EXT = 'log';
exports.LOG_DIR_NAME = 'log';

exports.read = () => ({
  test: 'ps -ef',
});

exports.runByKey = async (key, cmds) => {
  const cmd = cmds[key];
  const argsOfSpawn = exports.parseCmdToArgsOfSpawn(cmd);
  const logFd = await exports.openLogFileUsingKey(key);
  return childProcess.spawn(argsOfSpawn.cmd, argsOfSpawn.args, {
    stdio: [0, logFd, logFd],
  });
};

exports.parseCmdToArgsOfSpawn = cmd => {
  if (!cmd || typeof cmd !== 'string') {
    throw new Error('Invalid cmd type');
  }

  const [first, ...rest] = cmd.split(' ');

  return {cmd: first, args: [...rest]};
};

exports.openLogFileUsingKey = async key => {
  const logFile = await exports.genLogPathUsingKey(key);
  const fd = await fsPromises.open(logFile, 'w+');
  return fd;
};

exports.genLogPathUsingKey = async key => {
  const configPath = await config.getRootPath();
  const logDirPath = path.join(configPath, exports.LOG_DIR_NAME);
  await utils.mkdirfp(logDirPath);
  return path.join(logDirPath, `${key}_${uuid()}.${exports.LOG_EXT}`);
};
