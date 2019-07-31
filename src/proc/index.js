const childProcess = require('child_process');
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
};
