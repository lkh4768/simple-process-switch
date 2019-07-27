const config = require('./index');
const utils = require('../utils');

describe('config', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getRootPath', () => {
    test('get root path of configuration', async () => {
      utils.mkdirfp = jest.fn().mockResolvedValue(true);

      const rootPath = await config.getRootPath();

      expect(utils.mkdirfp).toHaveBeenCalledTimes(1);
      expect(rootPath).toEqual(config.ROOT_PATH);
    });
  });
});
