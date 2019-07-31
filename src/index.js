const proc = require('./proc');
const config = require('./config');

const main = async key => {
  const cmds = await config.read();
  await proc.switchByKey(key, cmds);
};

const isDev = process.env.NODE_ENV === 'development';
const isPrd = process.env.NODE_ENV === 'production';
if (isDev) {
  main(process.argv[2]);
} else if (isPrd) {
  main(process.argv[1]);
}

exports.main = main;
