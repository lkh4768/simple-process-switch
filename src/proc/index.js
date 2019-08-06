const path = require('path');
const childProcess = require('child_process');
const {promises: fsPromises} = require('fs');
const _ = require('lodash');

const config = require('../config');
const command = require('../command');
const log = require('../log');

exports.FILE_NAME = 'pid.json';

exports.switchByKey = async (key, cmds) => {
  const pid = await exports.getPid(key);
  if (pid) {
    exports.killByPid(pid);
    await exports.delPid(key);
    console.log(`Stop ${key}`);
    return;
  }

  const cmd = command.getByKey(key, cmds);
  await exports.runByKey(cmd, key);
  console.log(`Start ${key}`);
};

exports.getPid = async key => {
  try {
    const pids = await exports.getPids();
    return _.toInteger(pids[key]);
  } catch (err) {
    return null;
  }
};

exports.getPids = async () => {
  const pidFilePath = await exports.getPidFilePath();
  const pidsStr = await fsPromises.readFile(pidFilePath, 'utf8');
  return JSON.parse(pidsStr);
};

exports.killByPid = pid => {
  console.log('killByPid', pid);
  childProcess.exec(`kill -9 ${pid}`);
};

exports.delPid = async key => {
  const pids = await exports.getPids();
  await exports.savePids(_.omit(pids, [key]));
};

exports.runByKey = async (cmd, key) => {
  const argsOfSpawn = command.parseCmdToArgsOfSpawn(cmd);
  const logFd = await log.openLogFileUsingKey(key);
  const subProcess = childProcess.spawn(argsOfSpawn.cmd, argsOfSpawn.args, {
    stdio: [0, logFd, logFd],
    detached: true,
    shell: true,
  });
  subProcess.unref();
  await exports.addPid(key, subProcess.pid);
};

exports.addPid = async (key, pid) => {
  if (!exports.validatePid(pid)) {
    throw new Error('The pid is not integer');
  }
  const pids = await exports.getPids();
  await exports.savePids({...pids, [key]: pid});
};

exports.validatePid = pid => _.isInteger(pid);

exports.savePids = async pids => {
  const pidFilePath = await exports.getPidFilePath();
  await fsPromises.writeFile(pidFilePath, JSON.stringify(pids));
};

exports.getPidFilePath = async () => {
  const configRootPath = await config.getRootPath();
  const pidFilePath = path.join(configRootPath, exports.FILE_NAME);
  try {
    await fsPromises.access(pidFilePath);
  } catch (err) {
    await fsPromises.writeFile(pidFilePath, '');
  }
  return pidFilePath;
};
