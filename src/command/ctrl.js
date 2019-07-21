exports.read = () => ({
	test: {
		sudo: true,
		command: 'ps -ef'
	}
});

exports.runByKey = () => {};

exports.parseCmdToArgsOfSpawn = cmd => {
	if (!cmd || typeof cmd !== 'string') {
		throw new Error('Invalid cmd type');
	}

	return cmd.split(' ');
};
