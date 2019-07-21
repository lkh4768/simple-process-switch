const cmdCtrl = require('./command/ctrl');

const main = key => {
	const cmds = cmdCtrl.read();
	const ret = cmdCtrl.runByKey(key, cmds);
	return ret;
};

const isDev = process.env.NODE_ENV === 'development';
if (!isDev) {
	main(process.argv[2]);
}

exports.main = main;
