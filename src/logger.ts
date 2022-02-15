import chalk from 'chalk';

let lastLogIndex: number;

/**
 * Handles logging output from a command
 */
export function logger(index: number, message: string, name: string): void {
  name = `${name}:`;

  const spaces = new Array(name.length).fill(' ').join('');
  const prefix = lastLogIndex === index ? spaces : chalk.bold(name);

  message = message.replace(/^\n/, '');

  if (/^(npm warn |warn |warning )/.test(message.toLowerCase())) {
    message = chalk.yellow(message);
  }

  message = message.replace(/✔/g, chalk.green('✔'));

  const urls = message.match(
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w-]*))?)(:([0-9]*)(\/)?)?/g
  );

  urls?.forEach(url => {
    message = message.replace(url, chalk.cyanBright(url));
  });

  console.log(`${prefix} ${message.replace(/\n/g, `\n${spaces} `)}`);

  lastLogIndex = index;
}
