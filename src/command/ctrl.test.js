const cmdCtrl = require('./ctrl');
const childProcess = require('child_process');

describe('command/ctrl', () => {
	describe('read', () => {
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


	describe('runByKey', () => {
		const data = {
			key: 'key',
			cmd: 'ps',
			args: ['-ef']
		};
		const rawCmd = `${data.cmd} ${data.args[0]}`;

		test('Ensure that command seperated by cmd and args', () => {
			const commands = {
				[data.key]: { sudo: true, command: rawCmd }
			};

			childProcess.spawn = jest.fn().mockReturnValue({});

			cmdCtrl.runByKey(data.key, commands);
		});
	});

	describe('parseCmdToArgsOfSpawn', () => {
		test('Throw error, when cmd is falsly', () => {
			const falslyDataList = [ 0, false, null, undefined, '' ];

			for(const falslyData of falslyDataList) {
				expect(() => cmdCtrl.parseCmdToArgsOfSpawn(falslyData)).toThrow(Error);
			}
		});

		test('Throw error, when cmd is not string', () => {
			const isNotArrayList = [ [], {}, 123 ];

			for(const isNotArray of isNotArrayList) {
				expect(() => cmdCtrl.parseCmdToArgsOfSpawn(isNotArray)).toThrow(Error);
			}
		});

		test('cmd split by space', () => {
			const cmds = ['ps', '-ef'];
			const cmd = cmds.join(' ');
			const ret = cmdCtrl.parseCmdToArgsOfSpawn(cmd);

			expect(ret).toEqual(cmds);
		});
	});
});
