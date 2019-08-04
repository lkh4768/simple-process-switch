const command = require('./index');

describe('command', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getByKey', () => {
    const key = 'key';
    test('Get cmd in cmds by key', () => {
      const cmds = {
        [key]: 'cmd',
      };

      const cmd = command.getByKey(key, cmds);

      expect(cmd).toEqual(cmds.key);
    });

    test('If cmds is falsely, throw error', () => {
      expect(() => command.getByKey(key)).toThrow(Error);
    });
  });

  describe('parseCmdToArgsOfSpawn', () => {
    test('Throwing error, when cmd is falsly', () => {
      const falslyDataList = [0, false, null, undefined, ''];

      for (const falslyData of falslyDataList) {
        expect(() => command.parseCmdToArgsOfSpawn(falslyData)).toThrow(Error);
      }
    });

    test('Throw error, when cmd is not string', () => {
      const isNotArrayList = [[], {}, 123];

      for (const isNotArray of isNotArrayList) {
        expect(() => command.parseCmdToArgsOfSpawn(isNotArray)).toThrow(Error);
      }
    });

    test('Cmd split by space', () => {
      const cmds = ['ps', '-ef'];
      const cmd = cmds.join(' ');
      const ret = command.parseCmdToArgsOfSpawn(cmd);

      expect(ret).toEqual({cmd: cmds[0], args: [cmds[1]]});
    });
  });
});
