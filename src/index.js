const cmdCtrl = require('./command/ctrl');

const main = key => {
  const cmds = cmdCtrl.read();
  const cp = cmdCtrl.runByKey(key, cmds);
  cmdCtrl.logging(key, cp);
};

const isDev = process.env.NODE_ENV === 'development';
if (!isDev) {
  main(process.argv[2]);
}

exports.main = main;
