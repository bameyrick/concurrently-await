import * as chalk from 'chalk';
import { ConcurrentCommand } from './command';
import { getName } from './get-name';
import { logError } from './log-error';
import { runCommand } from './run-command';
import { WaitCondition } from './wait-condition';

/**
 * Concurrently run commands with optional conditions before moving onto the next command
 */
export function concurrently(commands: ConcurrentCommand[], index: number = 0): void {
  const command = commands[0];

  commands.shift();

  const nextCommand = commands[0];
  const nextIndex = index + 1;

  const name = getName(command, index);

  let conditionMet: boolean = false;

  if (command.condition) {
    if (!command.value || command.value === '') {
      logError(`ERROR: Wait condition provided for command "${command.command}" but no value was provided`);

      process.exit();
    } else {
      switch (command.condition) {
        case WaitCondition.Delay: {
          if (isNaN(command.value as unknown as number)) {
            logError(`ERROR: Delay for command "${command.command}" is not a number`);
          } else {
            const delay = parseFloat(command.value);

            runCommand(command.command, index, name);

            if (nextCommand) {
              console.log(chalk.blue(`Waiting for ${delay}ms before running ${getName(nextCommand, nextIndex)}`));

              setTimeout(() => concurrently(commands, nextIndex), delay);
            }
          }
          break;
        }
        case WaitCondition.Includes: {
          runCommand(command.command, index, name, message => {
            if (!conditionMet && message.toLowerCase().includes(command.value!.toLowerCase())) {
              conditionMet = true;

              concurrently(commands, nextIndex);
            }
          });

          if (nextCommand) {
            console.log(
              chalk.blue(
                `Waiting for ${name} to log a message including "${command.value}" before running ${getName(nextCommand, nextIndex)}`
              )
            );
          }
          break;
        }
        case WaitCondition.Matches: {
          runCommand(command.command, index, name, message => {
            if (!conditionMet && message === command.value) {
              conditionMet = true;

              concurrently(commands, nextIndex);
            }
          });

          if (nextCommand) {
            console.log(chalk.blue(`Waiting for [${name}] to log "${command.value}" before running ${getName(nextCommand, nextIndex)}`));
          }
          break;
        }
        case WaitCondition.Quiet: {
          if (isNaN(command.value as unknown as number)) {
            logError(`ERROR: Quiet delay for command "${command.command}" is not a number`);
          } else {
            const delay = parseFloat(command.value!);

            let timeout: NodeJS.Timer;

            runCommand(command.command, index, name, message => {
              if (timeout && message) {
                clearTimeout(timeout);
              }

              if (!conditionMet) {
                timeout = setTimeout(() => {
                  conditionMet = true;

                  concurrently(commands, nextIndex);
                }, delay);
              }
            });

            if (nextCommand) {
              console.log(
                chalk.blue(`Waiting for ${name} to stop logging for ${delay}ms before running ${getName(nextCommand, nextIndex)}`)
              );
            }
          }
          break;
        }
      }
    }
  } else {
    runCommand(command.command, index, name);

    if (nextCommand) {
      concurrently(commands, nextIndex);
    }
  }
}
