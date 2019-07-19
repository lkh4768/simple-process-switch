const cmdCtrl = require('./ctrl');

describe('main', () => {
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
