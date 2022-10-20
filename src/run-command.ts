import * as chalk from 'chalk';
import { ChildProcess } from 'child_process';

import { addChildProcess } from './exit-handler';
import { logger } from './logger';
import { getSpawnOptions } from './get-spawn-options';
import { spawn } from './spawn';

/**
 * Runs a given cli command and calls the optional provided callback any time the command logs a message
 */
export function runCommand(command: string, index: number, name: string, longestName: number, callback?: (data: string) => void): void {
  console.log(chalk.green(`Running ${name}: "${command}"`));

  const options = getSpawnOptions({});

  const childProcess: ChildProcess = spawn(command, options);

  childProcess.stdout?.on('data', (data: Buffer) => handleLog(data.toString(), index, name, longestName, callback));
  childProcess.stderr?.on('data', (data: Buffer) => handleLog(data.toString(), index, name, longestName, callback));

  addChildProcess(childProcess);
}

/**
 * Handles a log event
 */
function handleLog(data: string, index: number, name: string, longestName: number, callback?: (data: string) => void): void {
  data = data.trim();

  if (data) {
    logger(index, data, name, longestName);
  }

  if (callback) {
    callback(data);
  }
}
