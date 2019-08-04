exports.getByKey = (key, cmds) => {
  if (!cmds) {
    throw new Error('Invalid cmds type');
  }
  return cmds[key];
};

exports.parseCmdToArgsOfSpawn = cmd => {
  if (!cmd || typeof cmd !== 'string') {
    throw new Error('Invalid cmd type');
  }

  const [first, ...rest] = cmd.split(' ');

  return {cmd: first, args: [...rest]};
};
