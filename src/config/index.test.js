const config = require('./index');
const {promises: fsPromises} = require('fs');

describe('config', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getRootPath', () => {
    test('get root path of configuration', async () => {
      const mockExistsRoot = jest
        .spyOn(config, 'existsRoot')
        .mockResolvedValue(true);
      const mockMakeRoot = jest.spyOn(config, 'makeRoot').mockResolvedValue();

      const rootPath = await config.getRootPath();

      expect(mockMakeRoot).not.toHaveBeenCalled();
      expect(mockExistsRoot).toHaveBeenCalledTimes(1);
      expect(rootPath).toEqual(config.ROOT_PATH);
    });

    test('If root is not exists, it invokes function to make root.', async () => {
      const mockExistsRoot = jest
        .spyOn(config, 'existsRoot')
        .mockResolvedValue(false);
      const mockMakeRoot = jest.spyOn(config, 'makeRoot').mockResolvedValue();

      const rootPath = await config.getRootPath();

      expect(mockExistsRoot).toHaveBeenCalledTimes(1);
      expect(mockMakeRoot).toHaveBeenCalledTimes(1);
      expect(rootPath).toEqual(config.ROOT_PATH);
    });
  });

  describe('existsRoot', () => {
    test('If root is exists, it returns true', async () => {
      const mockFsPromisesAccess = jest
        .spyOn(fsPromises, 'access')
        .mockResolvedValue();

      const isExists = await config.existsRoot();

      expect(mockFsPromisesAccess).toHaveBeenCalledTimes(1);
      expect(isExists).toEqual(true);
    });

    test('If root is not exists, it returns false', async () => {
      const mockFsPromisesAccess = jest
        .spyOn(fsPromises, 'access')
        .mockRejectedValue(new Error('TEST'));

      const isExists = await config.existsRoot();

      expect(mockFsPromisesAccess).toHaveBeenCalledTimes(1);
      expect(isExists).toEqual(false);
    });
  });

  describe('makeRoot', () => {
    test('Make root', async () => {
      const mockFsPromisesMkdir = jest
        .spyOn(fsPromises, 'mkdir')
        .mockImplementation((path, {recursive}) => {
          expect(path).toEqual(config.ROOT_PATH);
          expect(recursive).toEqual(true);
        });

      await config.makeRoot();

      expect(mockFsPromisesMkdir).toHaveBeenCalledTimes(1);
    });
  });
});
