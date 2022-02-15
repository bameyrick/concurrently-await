import chalk from 'chalk';
import { ChildProcess } from 'child_process';

/**
 * Possible exit events
 */
enum ExitEvents {
  BeforeExit = 'beforeExit',
  Exiting = 'exiting',
  SIGINT = 'SIGINT',
  SIGUSR1 = 'SIGUSR1',
  SIGUSR2 = 'SIGUSR2',
  UncaughtException = 'uncaughtException',
}

/**
 * Whether we have exitted yet
 */
let exitted: boolean;

/**
 * Reference to the running child processes
 */
const childProcesses: ChildProcess[] = [];

/**
 * Adds a child process to be killed on exit
 */
export function addChildProcess(childProcess: ChildProcess): void {
  childProcesses.push(childProcess);
}

/**
 * Handles the exit events and kills the child processes
 */
Object.values(ExitEvents).forEach(event =>
  process.on(event, data => {
    if (!exitted) {
      exitted = true;

      childProcesses.forEach(process => {
        process.kill();
      });

      if (event === ExitEvents.UncaughtException) {
        console.log(chalk.red('Uncaught exception:'));

        console.log(data);

        process.exit(1);
      } else {
        process.exit(0);
      }
    }
  })
);
