const sps = require('./index');
const proc = require('./proc');
const config = require('./config');

describe('main', () => {
  const key = 'key_1';

  test('Run proccess by key', async () => {
    config.read = jest.fn().mockResolvedValue({});
    proc.switchByKey = jest.fn().mockResolvedValue();

    const ret = await sps.main(key);

    expect(config.read).toHaveBeenCalledTimes(1);
    expect(proc.switchByKey).toHaveBeenCalledTimes(1);
    expect(ret).toBeUndefined();
  });
});
