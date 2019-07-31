const _ = require('lodash');
const childProcess = require('child_process');

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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('switchByKey', () => {
    test('If process is not running, process started by key', async () => {
      const commands = {
        [data.key]: rawCmd,
      };

      const mockIsRunning = jest
        .spyOn(proc, 'isRunning')
        .mockReturnValue(false);
      const mockKillByKey = jest.spyOn(proc, 'killByKey').mockReturnValue();
      const mockRunByKey = jest.spyOn(proc, 'runByKey').mockResolvedValue();
      command.getByKey = jest.fn().mockReturnValue();

      await proc.switchByKey(data.key, commands);

      expect(mockIsRunning).toHaveBeenCalledTimes(1);
      expect(mockRunByKey).toHaveBeenCalledTimes(1);
      expect(mockKillByKey).not.toHaveBeenCalled();
      expect(command.getByKey).toHaveBeenCalledTimes(1);
    });

    test('If process is running, process killed by key', async () => {
      const commands = {
        [data.key]: rawCmd,
      };

      const mockIsRunning = jest.spyOn(proc, 'isRunning').mockReturnValue(true);
      const mockKillByKey = jest.spyOn(proc, 'killByKey').mockReturnValue();
      const mockRunByKey = jest.spyOn(proc, 'runByKey').mockResolvedValue();
      command.getByKey = jest.fn().mockReturnValue();

      await proc.switchByKey(data.key, commands);

      expect(mockIsRunning).toHaveBeenCalledTimes(1);
      expect(mockRunByKey).not.toHaveBeenCalled();
      expect(command.getByKey).not.toHaveBeenCalled();
      expect(mockKillByKey).toHaveBeenCalledTimes(1);
    });
  });

  describe('runByKey', () => {
    const rawCmd = `${data.cmd} ${data.args[0]}`;

    test('Run command', async () => {
      const commands = {
        [data.key]: rawCmd,
      };
      const expectedRet = {};

      command.parseCmdToArgsOfSpawn = jest
        .fn()
        .mockReturnValue(_.pick(data, ['proc', 'args']));
      log.openLogFileUsingKey = jest.fn().mockResolvedValue(`./${data.key}`);
      const mockSpawn = jest
        .spyOn(childProcess, 'spawn')
        .mockReturnValue(expectedRet);

      await proc.runByKey(data.key, commands);

      expect(command.parseCmdToArgsOfSpawn).toHaveBeenCalledTimes(1);
      expect(log.openLogFileUsingKey).toHaveBeenCalledTimes(1);
      expect(mockSpawn).toHaveBeenCalledTimes(1);
    });
  });
});
