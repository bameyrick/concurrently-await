import * as chalk from 'chalk';

let lastLogIndex: number;
let lastMessage: string;
let didClearLine = false;

/**
 * Handles logging output from a command
 */
export function logger(index: number, message: string, name: string, longestName: number): void {
  // Replace some ANSI code that would impact clearing lines
  message = message.replace(/\u2026/g, '...');

  message.split('\n').map(line => log(index, line, name, longestName));
}

function log(index: number, message: string, name: string, longestName: number): void {
  name = `${name}:`;

  const numberOfSpaces = longestName + 3;
  const spaces = chalk.bold(new Array(numberOfSpaces).fill(' ').join(''));
  const prefix = lastLogIndex === index ? spaces : chalk.bold(`${name}`.padEnd(numberOfSpaces, ' '));

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

  if (message.replace(/\s/g, '').replace(/\n/g, '').length) {
    const clearLine = shouldClearLine(index, message);

    if (!didClearLine && clearLine) {
      process.stdout.write('\n');
    }

    process.stdout.write(`${clearLine ? `\r\x1b[K` : '\n'}${prefix} ${message.replace(/\n/g, `\n${spaces}`).replace(/\r/g, '')}`);

    didClearLine = clearLine;
    lastMessage = message;
    lastLogIndex = index;
  }
}

function shouldClearLine(index: number, message: string): boolean {
  if (lastLogIndex !== index) {
    return false;
  }

  const matches = ['[webpack.Progress]'];

  return matches.some(match => message.includes(match) && lastMessage?.includes(match));
}
