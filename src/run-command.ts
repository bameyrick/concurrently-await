import * as chalk from 'chalk';
import { exec } from 'child_process';
import { addChildProcess } from './exit-handler';
import { logger } from './logger';

/**
 * Runs a given cli command and calls the optional provided callback any time the command logs a message
 */
export function runCommand(command: string, index: number, name: string, callback?: (data: string) => void): void {
  console.log(chalk.green(`Running ${name}: "${command}"`));

  const process = exec(command);

  addChildProcess(process);

  process.stdout?.on('data', data => {
    data = data.trim();

    if (data) {
      logger(index, data, name);
    }

    if (callback) {
      callback(data);
    }
  });
}
