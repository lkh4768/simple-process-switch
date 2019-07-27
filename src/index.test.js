const sps = require('./index');
const cmdCtrl = require('./command/ctrl');
const config = require('./config');

describe('main', () => {
  const key = 'key_1';

  test('Run command by key', async () => {
    config.read = jest.fn().mockResolvedValue({});
    cmdCtrl.runByKey = jest.fn().mockResolvedValue();

    const ret = await sps.main(key);

    expect(config.read).toHaveBeenCalledTimes(1);
    expect(cmdCtrl.runByKey).toHaveBeenCalledTimes(1);
    expect(ret).toBeUndefined();
  });
});
