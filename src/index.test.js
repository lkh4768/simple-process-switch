const sps = require('./index');
const cmdCtrl = require('./command/ctrl');

describe('main', () => {
  const key = 'key_1';

  test('Run command by key', () => {
    cmdCtrl.read = jest.fn().mockReturnValue({});
    cmdCtrl.runByKey = jest.fn().mockReturnValue(true);
    cmdCtrl.logging = jest.fn().mockReturnValue();
    const ret = sps.main(key);

    expect(cmdCtrl.read).toHaveBeenCalledTimes(1);
    expect(cmdCtrl.runByKey).toHaveBeenCalledTimes(1);
    expect(cmdCtrl.logging).toHaveBeenCalledTimes(1);
    expect(ret).toBeUndefined();
  });
});
