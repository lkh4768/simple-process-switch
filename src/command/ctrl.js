const childProcess = require('child_process');

exports.read = () => ({
  test: 'ps -ef',
});

exports.runByKey = (key, cmds) => {
  const cmd = cmds[key];
  const argsOfSpawn = exports.parseCmdToArgsOfSpawn(cmd);
  return childProcess.spawn(argsOfSpawn.cmd, argsOfSpawn.args);
};

exports.parseCmdToArgsOfSpawn = cmd => {
  if (!cmd || typeof cmd !== 'string') {
    throw new Error('Invalid cmd type');
  }

  const [first, ...rest] = cmd.split(' ');

  return {cmd: first, args: [...rest]};
};
