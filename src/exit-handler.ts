import { ChildProcess } from 'child_process';

/**
 * Possible exit events
 */
const exitEvents = ['beforeExit', 'exiting', 'SIGINT', 'SIGUSR1', 'SIGUSR2'];

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
exitEvents.forEach(event =>
  process.on(event, () => {
    if (!exitted) {
      exitted = true;

      childProcesses.forEach(process => process.kill());
    }
  })
);
