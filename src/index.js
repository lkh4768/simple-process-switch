const cmdCtrl = require('./command/ctrl');
const config = require('./config');

const main = async key => {
  const cmds = await config.read();
  await cmdCtrl.runByKey(key, cmds);
};

const isDev = process.env.NODE_ENV === 'development';
if (!isDev) {
  main(process.argv[2]);
}

exports.main = main;
