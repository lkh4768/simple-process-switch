const utils = require('./index');
const {promises: fsPromises} = require('fs');

describe('utils', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('mkdirp', () => {
    test('Make dir with recursive', async () => {
      const dirPath = 'dir';
      const mockFsPromisesMkdir = jest
        .spyOn(fsPromises, 'mkdir')
        .mockImplementation((path, {recursive}) => {
          expect(path).toEqual(dirPath);
          expect(recursive).toEqual(true);
        });

      await utils.mkdirp(dirPath);

      expect(mockFsPromisesMkdir).toHaveBeenCalledTimes(1);
    });
  });

  describe('existsFile', () => {
    test('If file is exists, it returns true', async () => {
      const targetFilePath = 'file';
      const mockFsPromisesAccess = jest
        .spyOn(fsPromises, 'access')
        .mockImplementation(
          filePath =>
            new Promise(resolve => {
              expect(filePath).toEqual(targetFilePath);
              resolve();
            }),
        );

      const isExists = await utils.existsFile(targetFilePath);

      expect(mockFsPromisesAccess).toHaveBeenCalledTimes(1);
      expect(isExists).toEqual(true);
    });

    test('If file is not exists, it returns false', async () => {
      const mockFsPromisesAccess = jest
        .spyOn(fsPromises, 'access')
        .mockRejectedValue(new Error('TEST'));

      const isExists = await utils.existsFile();

      expect(mockFsPromisesAccess).toHaveBeenCalledTimes(1);
      expect(isExists).toEqual(false);
    });
  });

  describe('mkdirfp', () => {
    test('If dir path is not string, throw error', () => {
      const mockExistsFile = jest.spyOn(utils, 'existsFile');
      const mockMkdirp = jest.spyOn(utils, 'mkdirp');

      expect(utils.mkdirfp()).rejects.toThrow(Error);
      expect(mockExistsFile).not.toHaveBeenCalled();
      expect(mockMkdirp).not.toHaveBeenCalled();
    });
    test('When can access dir, do not invoke mkdirp', async () => {
      const mockExistsFile = jest
        .spyOn(utils, 'existsFile')
        .mockResolvedValue(true);
      const mockMkdirp = jest.spyOn(utils, 'mkdirp');

      await utils.mkdirfp('path');

      expect(mockExistsFile).toHaveBeenCalledTimes(1);
      expect(mockMkdirp).not.toHaveBeenCalled();
    });
    test('When can not access dir, do invoke mkdirp', async () => {
      const mockExistsFile = jest
        .spyOn(utils, 'existsFile')
        .mockResolvedValue(false);
      const mockMkdirp = jest.spyOn(utils, 'mkdirp');

      await utils.mkdirfp('path');

      expect(mockExistsFile).toHaveBeenCalledTimes(1);
      expect(mockMkdirp).toHaveBeenCalledTimes(1);
    });
  });
});
