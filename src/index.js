const cmdCtrl = require('./command/ctrl');
const key = process.argv[1];

const main = async (key) => {
	await cmdCtrl.read();
	const ret = await cmdCtrl.runByKey(key);
	return ret;
};

main(key);

exports.main = main;
