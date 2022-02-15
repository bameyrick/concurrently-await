import { isString } from '@qntm-code/utils';
import chalk from 'chalk';
import { exec } from 'child_process';
import { addChildProcess } from './exit-handler';
import { logger } from './logger';

/**
 * Runs a given cli command and calls the optional provided callback any time the command logs a message
 */
export function runCommand(command: string, index: number, name: string, callback?: (data: string) => void): void {
  console.log(chalk.green(`Running ${name}: "${command}"`));

  const childProcess = exec(command);

  addChildProcess(childProcess);

  childProcess.stdout?.on('data', data => handleLog(data, index, name, callback));
  childProcess.stderr?.on('data', data => handleLog(data, index, name, callback));
}

/**
 * Handles a log event
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleLog(data: any, index: number, name: string, callback?: (data: string) => void): void {
  if (isString(data)) {
    data = data.trim();

    if (data) {
      logger(index, data as string, name);
    }

    if (callback) {
      callback(data as string);
    }
  }
}
