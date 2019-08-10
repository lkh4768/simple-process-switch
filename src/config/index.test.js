const {promises: fsPromises} = require('fs');
const path = require('path');

const config = require('./index');
const utils = require('../utils');

describe('config', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getRootPath', () => {
    test('Get root path of configuration', async () => {
      utils.mkdirfp = jest.fn().mockResolvedValue(true);

      const rootPath = await config.getRootPath();

      expect(utils.mkdirfp).toHaveBeenCalledTimes(1);
      expect(rootPath).toEqual(config.ROOT_PATH);
    });
  });

  describe('read', () => {
    test('Read config file', async () => {
      const tmpConfig = {a: 'b'};
      const mockFsPromisesReadFile = jest
        .spyOn(fsPromises, 'readFile')
        .mockImplementation(filePath => {
          expect(filePath).toEqual(
            path.join(config.ROOT_PATH, config.CONFIG_FILE_NAME),
          );
          return new Promise(resolve => {
            resolve(Buffer.from(JSON.stringify(tmpConfig)));
          });
        });
      const mockJsonParse = jest.spyOn(JSON, 'parse');

      await config.read();

      expect(mockFsPromisesReadFile).toHaveBeenCalledTimes(1);
      expect(mockJsonParse).toHaveBeenCalledTimes(1);
    });
  });
});
