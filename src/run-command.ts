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
function handleLog(data: string, index: number, name: string, callback?: (data: string) => void): void {
  data = data.trim();

  if (data) {
    logger(index, data, name);
  }

  if (callback) {
    callback(data);
  }
}
