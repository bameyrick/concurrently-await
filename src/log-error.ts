import chalk from 'chalk';

/**
 * Logs a given error message and stops the process
 */
export function logError(message: string): void {
  console.log(chalk.red(message));

  process.exit();
}
