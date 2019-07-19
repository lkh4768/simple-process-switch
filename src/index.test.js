const cmdCtrl = require('./command/ctrl');
const sps = require('./index');

describe('main', () => {
	const key = 'key_1';

	test('Run command by key', async () => {
		cmdCtrl.runByKey = jest.fn().mockResolvedValue(true);
		cmdCtrl.read = jest.fn().mockResolvedValue({});
		const ret = await sps.main(key);

		expect(cmdCtrl.read).toHaveBeenCalledTimes(1);
		expect(cmdCtrl.runByKey).toHaveBeenCalledTimes(1);
		expect(ret).toEqual(true);
	});
});
