import morgan from 'morgan';
import chalk from 'chalk';

const getStatusColor = (status) => {
  if (status >= 500) return chalk.red(status);
  if (status >= 400) return chalk.yellow(status);
  if (status >= 300) return chalk.cyan(status);
  return chalk.green(status);
};

export default morgan((tokens, req, res) => {
  const method = chalk.magenta(tokens.method(req, res));
  const url = chalk.blue(tokens.url(req, res));
  const status = getStatusColor(tokens.status(req, res));
  const responseTime = chalk.greenBright(`${tokens['response-time'](req, res)} ms`);
  const date = chalk.gray(new Date().toLocaleString());

  return `[${date}] ${method} ${url} ${status} - ${responseTime}`;
});
