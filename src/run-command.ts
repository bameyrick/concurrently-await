import * as chalk from 'chalk';
import { exec } from 'child_process';
import { logger } from './logger';

/**
 * Runs a given cli command and calls the optional provided callback any time the command logs a message
 */
export function runCommand(command: string, index: number, name: string, callback?: (data: string) => void): void {
  console.log(chalk.green(`Running ${name}: "${command}"`));

  exec(command).stdout?.on('data', data => {
    if (data) {
      logger(index, data, name);
    }

    if (callback) {
      callback(data);
    }
  });
}
