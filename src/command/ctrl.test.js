const childProcess = require('child_process');
const {promises: fsPromises} = require('fs');
const _ = require('lodash');
const path = require('path');
const uuid = require('uuid/v1');

const utils = require('../utils');
const cmdCtrl = require('./ctrl');
const config = require('../config');

jest.mock('uuid/v1');

describe('command/ctrl', () => {
  const data = {
    key: 'key',
    cmd: 'ps',
    args: ['-ef'],
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('read', () => {
    test('Read config', () => {
      const ret = cmdCtrl.read();

      expect(ret).toEqual({
        test: 'ps -ef',
      });
    });
  });

  describe('runByKey', () => {
    const rawCmd = `${data.cmd} ${data.args[0]}`;

    test('Run command', async () => {
      const commands = {
        [data.key]: rawCmd,
      };
      const expectedRet = {};

      const mockParseCmdToArgsOfSpawn = jest
        .spyOn(cmdCtrl, 'parseCmdToArgsOfSpawn')
        .mockReturnValue(_.pick(data, ['cmd', 'args']));
      const mockSpawn = jest
        .spyOn(childProcess, 'spawn')
        .mockReturnValue(expectedRet);
      const mockOpenLogFileUsingKey = jest
        .spyOn(cmdCtrl, 'openLogFileUsingKey')
        .mockResolvedValue(`./${data.key}`);

      const ret = await cmdCtrl.runByKey(data.key, commands);

      expect(mockParseCmdToArgsOfSpawn).toHaveBeenCalledTimes(1);
      expect(mockSpawn).toHaveBeenCalledTimes(1);
      expect(mockOpenLogFileUsingKey).toHaveBeenCalledTimes(1);
      expect(ret).toEqual(expectedRet);
    });
  });

  describe('parseCmdToArgsOfSpawn', () => {
    test('Throwing error, when cmd is falsly', () => {
      const falslyDataList = [0, false, null, undefined, ''];

      for (const falslyData of falslyDataList) {
        expect(() => cmdCtrl.parseCmdToArgsOfSpawn(falslyData)).toThrow(Error);
      }
    });

    test('Throw error, when cmd is not string', () => {
      const isNotArrayList = [[], {}, 123];

      for (const isNotArray of isNotArrayList) {
        expect(() => cmdCtrl.parseCmdToArgsOfSpawn(isNotArray)).toThrow(Error);
      }
    });

    test('Cmd split by space', () => {
      const cmds = ['ps', '-ef'];
      const cmd = cmds.join(' ');
      const ret = cmdCtrl.parseCmdToArgsOfSpawn(cmd);

      expect(ret).toEqual({cmd: cmds[0], args: [cmds[1]]});
    });
  });

  describe('openLogFileUsingKey', () => {
    test('Open log file using key', async () => {
      const logPath = `./${data.key}.log`;

      const mockGenLogFileUsingKey = jest
        .spyOn(cmdCtrl, 'genLogPathUsingKey')
        .mockResolvedValue(logPath);
      const mockFsPromisesOpen = jest
        .spyOn(fsPromises, 'open')
        .mockResolvedValue(3);

      const fd = await cmdCtrl.openLogFileUsingKey(data.key);

      expect(mockGenLogFileUsingKey).toHaveBeenCalledTimes(1);
      expect(mockFsPromisesOpen).toHaveBeenCalledTimes(1);
      expect(_.isInteger(fd)).toEqual(true);
    });
  });

  describe('genLogPathUsingKey', () => {
    test('Generate log file using key', async () => {
      const configPath = path.resolve('./');
      const uuidRet = 'uuid';

      config.getRootPath = jest.fn().mockResolvedValue(configPath);
      utils.mkdirfp = jest.fn().mockResolvedValue();
      uuid.mockReturnValue(uuidRet);

      const logPath = await cmdCtrl.genLogPathUsingKey(data.key);

      expect(config.getRootPath).toHaveBeenCalledTimes(1);
      expect(utils.mkdirfp).toHaveBeenCalledTimes(1);
      expect(logPath).toEqual(
        path.join(
          configPath,
          cmdCtrl.LOG_DIR_NAME,
          `${data.key}_${uuidRet}.${cmdCtrl.LOG_EXT}`,
        ),
      );
    });
  });
});
