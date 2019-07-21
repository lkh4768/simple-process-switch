const sps = require('./index');
const cmdCtrl = require('./command/ctrl');

describe('main', () => {
	const key = 'key_1';

	test('Run command by key', async () => {
		cmdCtrl.read = jest.fn().mockReturnValue({});
		cmdCtrl.runByKey = jest.fn().mockReturnValue(true);
		const ret = await sps.main(key);

		expect(cmdCtrl.read).toHaveBeenCalledTimes(1);
		expect(cmdCtrl.runByKey).toHaveBeenCalledTimes(1);
		expect(ret).toEqual(true);
	});
});
