import morgan from 'morgan';
import chalk from 'chalk'; // or you can use the require('chalk') syntax too

const morganMiddleware = morgan(function (tokens, req, res) {
  const method = tokens.method(req, res);
  let methodColor = '#ffffff';
  if (method === 'GET') {
    methodColor = '#00ff00';
  } else if (method === 'POST') {
    methodColor = '#ffff00';
  } else if (method === 'PUT') {
    methodColor = '#0000ff';
  } else if (method === 'DELETE') {
    methodColor = '#ff0000';
  }

  return [
    '\n',
    chalk.bold('-->'),
    chalk.hex(methodColor).bold(tokens.method(req, res)),
    chalk.hex('#ffb142').bold(tokens.status(req, res)),
    chalk.hex('#ffffff')(tokens.url(req, res)),
    chalk.hex('#2ed573').bold(tokens['response-time'](req, res) + ' ms'),
    // chalk.hex('#fffa65').bold('from ' + tokens.referrer(req, res)),
    // chalk.hex('#f78fb3').bold('@ ' + tokens.date(req, res)),
  ].join(' ');
});

export default morganMiddleware;
