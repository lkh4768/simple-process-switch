const uuid = require('uuid/v1');
const path = require('path');
const _ = require('lodash');
const {promises: fsPromises} = require('fs');

const config = require('../config');
const utils = require('../utils');
const log = require('./index');

jest.mock('uuid/v1');

describe('log', () => {
  const data = {
    key: 'key',
    cmd: 'ps',
    args: ['-ef'],
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('openLogFileUsingKey', () => {
    test('Open log file using key', async () => {
      const logPath = `./${data.key}.log`;

      const mockGenLogFileUsingKey = jest
        .spyOn(log, 'genLogPathUsingKey')
        .mockResolvedValue(logPath);
      const mockFsPromisesOpen = jest
        .spyOn(fsPromises, 'open')
        .mockResolvedValue(3);

      const fd = await log.openLogFileUsingKey(data.key);

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

      const logPath = await log.genLogPathUsingKey(data.key);

      expect(config.getRootPath).toHaveBeenCalledTimes(1);
      expect(utils.mkdirfp).toHaveBeenCalledTimes(1);
      expect(logPath).toEqual(
        path.join(
          configPath,
          log.DIR_NAME,
          `${data.key}_${uuidRet}.${log.EXT}`,
        ),
      );
    });
  });
});
