const cmdCtrl = require('./command/ctrl');
const key = process.argv[1];

const main = async (key) => {
	const cmds = await cmdCtrl.read();
	const ret = await cmdCtrl.runByKey(key, cmds);
	return ret;
};

main(key);

exports.main = main;
