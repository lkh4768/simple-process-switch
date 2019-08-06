const path = require('path');
const childProcess = require('child_process');
const {promises: fsPromises} = require('fs');
const _ = require('lodash');

const config = require('../config');
const proc = require('./index');
const command = require('../command');
const log = require('../log');

describe('proc', () => {
  const data = {
    key: 'key',
    cmd: 'ps',
    args: ['-ef'],
  };
  const rawCmd = `${data.cmd} ${data.args[0]}`;
  const commands = {
    [data.key]: rawCmd,
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('switchByKey', () => {
    test('If process is not running, process started by key', async () => {
      const mockGetPid = jest.spyOn(proc, 'getPid').mockResolvedValue(false);
      const mockKillByPid = jest.spyOn(proc, 'killByPid').mockReturnValue();
      const mockDelPid = jest.spyOn(proc, 'delPid').mockReturnValue();
      const mockRunByKey = jest.spyOn(proc, 'runByKey').mockResolvedValue();
      command.getByKey = jest.fn().mockReturnValue();

      await proc.switchByKey(data.key, commands);

      expect(mockGetPid).toHaveBeenCalledTimes(1);
      expect(mockRunByKey).toHaveBeenCalledTimes(1);
      expect(mockKillByPid).not.toHaveBeenCalled();
      expect(mockDelPid).not.toHaveBeenCalled();
      expect(command.getByKey).toHaveBeenCalledTimes(1);
    });

    test('If process is running, process killed by key', async () => {
      const mockGetPid = jest.spyOn(proc, 'getPid').mockResolvedValue(true);
      const mockKillByPid = jest.spyOn(proc, 'killByPid').mockReturnValue();
      const mockDelPid = jest.spyOn(proc, 'delPid').mockReturnValue();
      const mockRunByKey = jest.spyOn(proc, 'runByKey').mockResolvedValue();
      command.getByKey = jest.fn().mockReturnValue();

      await proc.switchByKey(data.key, commands);

      expect(mockGetPid).toHaveBeenCalledTimes(1);
      expect(mockRunByKey).not.toHaveBeenCalled();
      expect(command.getByKey).not.toHaveBeenCalled();
      expect(mockKillByPid).toHaveBeenCalledTimes(1);
      expect(mockDelPid).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPid', () => {
    test('If written pid in pid file, return pid', async () => {
      const pids = {
        [data.key]: 1,
      };

      const mockGetPids = jest.spyOn(proc, 'getPids').mockResolvedValue(pids);

      const getPid = await proc.getPid(data.key);

      expect(getPid).toEqual(1);
      expect(mockGetPids).toHaveBeenCalledTimes(1);
    });

    test('When any function in the getPid is throwing error, return null', async () => {
      const pids = {
        [data.key]: 1,
      };

      const mockGetPids = jest.spyOn(proc, 'getPids').mockRejectedValue(pids);

      const getPid = await proc.getPid(data.key);

      expect(getPid).toEqual(null);
      expect(mockGetPids).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPids', () => {
    test('get pid list', async () => {
      const expectPids = {
        [data.key]: 1,
      };

      const mockGetPidFilePath = jest
        .spyOn(proc, 'getPidFilePath')
        .mockResolvedValue('path');
      const mockReadFile = jest
        .spyOn(fsPromises, 'readFile')
        .mockResolvedValue(JSON.stringify(expectPids));
      const mockAppendFile = jest
        .spyOn(fsPromises, 'writeFile')
        .mockResolvedValue();

      const pids = await proc.getPids();

      expect(pids).toEqual(expectPids);
    });
  });

  describe('killByPid', () => {
    test('Kill process by pid', () => {
      const mockExec = jest.spyOn(childProcess, 'exec');

      proc.killByPid();

      expect(mockExec).toHaveBeenCalledTimes(1);
    });
  });

  describe('delPid', () => {
    test('del pid by key in pid file', async () => {
      const mockGetPids = jest.spyOn(proc, 'getPids').mockResolvedValue({});
      const mockSavePids = jest.spyOn(proc, 'savePids').mockResolvedValue();

      await proc.delPid(data.key, 1);

      expect(mockGetPids).toHaveBeenCalledTimes(1);
      expect(mockSavePids).toHaveBeenCalledTimes(1);
    });
  });

  describe('runByKey', () => {
    const rawCmd = `${data.cmd} ${data.args[0]}`;

    test('Run command', async () => {
      const expectedRet = {unref: () => {}};

      command.parseCmdToArgsOfSpawn = jest
        .fn()
        .mockReturnValue({cmd: '', args: ''});
      log.openLogFileUsingKey = jest.fn().mockResolvedValue(`./${data.key}`);
      const mockSpawn = jest
        .spyOn(childProcess, 'spawn')
        .mockReturnValue(expectedRet);
      const mockAddPid = jest.spyOn(proc, 'addPid').mockResolvedValue();

      await proc.runByKey(data.key, commands);

      expect(command.parseCmdToArgsOfSpawn).toHaveBeenCalledTimes(1);
      expect(log.openLogFileUsingKey).toHaveBeenCalledTimes(1);
      expect(mockSpawn).toHaveBeenCalledTimes(1);
      expect(mockAddPid).toHaveBeenCalledTimes(1);
    });
  });

  describe('addPid', () => {
    test('If pid is not valid, throw error', () => {
      const mockGetPids = jest
        .spyOn(proc, 'validatePid')
        .mockReturnValue(false);
      expect(proc.addPid()).rejects.toThrow(Error);
    });

    test('add pid', async () => {
      const mockGetPids = jest.spyOn(proc, 'getPids').mockResolvedValue({});
      const mockSavePids = jest.spyOn(proc, 'savePids').mockResolvedValue();

      await proc.addPid(data.key, 1);

      expect(mockGetPids).toHaveBeenCalledTimes(1);
      expect(mockSavePids).toHaveBeenCalledTimes(1);
    });
  });

  describe('savePids', () => {
    test('Write pids in pid file', async () => {
      const pids = {[data.key]: 1};
      const filePath = 'path';

      const mockGetPidFilePath = jest
        .spyOn(proc, 'getPidFilePath')
        .mockResolvedValue(filePath);
      const mockWriteFile = jest
        .spyOn(fsPromises, 'writeFile')
        .mockImplementation((f, str) => {
          expect(f).toEqual(filePath);
          expect(str).toEqual(JSON.stringify(pids));
          return Promise.resolve();
        });

      await proc.savePids(pids);

      expect(mockGetPidFilePath).toHaveBeenCalledTimes(1);
      expect(mockWriteFile).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPidFilePath', () => {
    const configPath = path.resolve('./');
    const pidFilePath = path.join(configPath, proc.FILE_NAME);
    const makeMockWriteFile = () =>
      jest.spyOn(fsPromises, 'writeFile').mockImplementation(filepath => {
        expect(filepath).toEqual(pidFilePath);
        return Promise.resolve();
      });
    const makeMockGetRootPath = () => jest.fn().mockResolvedValue(configPath);
    const makeMockAccess = ret =>
      jest.spyOn(fsPromises, 'access').mockImplementation(filepath => {
        expect(filepath).toEqual(pidFilePath);
        return ret;
      });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('Get a file path of pid list', async () => {
      config.getRootPath = makeMockGetRootPath();
      const mockAccess = makeMockAccess(Promise.resolve(true));
      const mockWriteFile = makeMockWriteFile();

      const ret = await proc.getPidFilePath();

      expect(ret).toEqual(pidFilePath);
      expect(config.getRootPath).toHaveBeenCalledTimes(1);
      expect(mockWriteFile).not.toHaveBeenCalled();
      expect(mockAccess).toHaveBeenCalledTimes(1);
    });

    test('If not found pid file, make pid file and get a file path of pid list', async () => {
      config.getRootPath = makeMockGetRootPath();
      const mockAccess = makeMockAccess(Promise.reject(new Error()));
      const mockWriteFile = makeMockWriteFile();

      const ret = await proc.getPidFilePath();

      expect(ret).toEqual(pidFilePath);
      expect(config.getRootPath).toHaveBeenCalledTimes(1);
      expect(mockWriteFile).toHaveBeenCalledTimes(1);
      expect(mockAccess).toHaveBeenCalledTimes(1);
    });
  });
});
