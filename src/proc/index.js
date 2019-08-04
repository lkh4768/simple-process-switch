const childProcess = require('child_process');
const {promises: fsPromises} = require('fs');
const _ = require('lodash');

const command = require('../command');
const log = require('../log');

exports.switchByKey = async (key, cmds) => {
  if (exports.isRunning(key)) {
    exports.killByKey(key);
    return;
  }

  const cmd = command.getByKey(key, cmds);
  await exports.runByKey(cmd, key);
};

exports.isRunning = () => {};
exports.killByKey = () => {};

exports.runByKey = async (cmd, key) => {
  const argsOfSpawn = command.parseCmdToArgsOfSpawn(cmd);
  const logFd = await log.openLogFileUsingKey(key);
  const subProcess = childProcess.spawn(argsOfSpawn.cmd, argsOfSpawn.args, {
    stdio: [0, logFd, logFd],
    detached: true,
  });
  await exports.savePid(subProcess.pid);
};

exports.savePid = async pid => {
  if (!_.isInteger(pid)) {
    throw new Error('The pid is not integer');
  }

  // get pid file path
  const pidFilePath = exports.getPidFilePath();

  // append pid in pid file
  await fsPromises.appendFile(pidFilePath, pid);
};

exports.getPidFilePath = () => {};
