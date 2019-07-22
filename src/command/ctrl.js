const childProcess = require('child_process');
const {promises: fsPromises} = require('fs');
const path = require('path');

const config = require('../config');

exports.LOG_EXT = 'log';

exports.read = () => ({
  test: 'ps -ef',
});

exports.runByKey = (key, cmds) => {
  const cmd = cmds[key];
  const argsOfSpawn = exports.parseCmdToArgsOfSpawn(cmd);
  const logFd = exports.openLogFileUsingKey(key);
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
  const logFile = exports.genLogPathUsingKey(key);
  const fd = await fsPromises.open(logFile, 'w+');
  return fd;
};

exports.genLogPathUsingKey = async key => {
  const configPath = await config.getRootPath();
  return path.join(
    configPath,
    `${key}_${new Date().getTime()}.${exports.LOG_EXT}`,
  );
};
