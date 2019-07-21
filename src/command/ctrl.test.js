const cmdCtrl = require('./ctrl');

describe('command/ctrl', () => {
	test('Read config', () => {
		const ret = cmdCtrl.read();

		expect(ret).toEqual({
			test: {
				sudo: true,
				command: 'ps -ef'
			}
		});
	});
});
