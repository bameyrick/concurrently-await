import * as chalk from 'chalk';
import { ConcurrentCommand } from './command';
import { getName } from './get-name';
import { logError } from './log-error';
import { runCommand } from './run-command';
import { stripAnsiAndChalk } from './strip-ansi-and-chalk';
import { WaitCondition } from './wait-condition';

/**
 * Concurrently run commands with optional conditions before moving onto the next command
 */
export function concurrently(commands: ConcurrentCommand[], index = 0): void {
  const command = commands[0];

  commands.shift();

  const nextCommand = commands[0];
  const nextIndex = index + 1;

  const name = getName(command, index);

  let conditionMet = false;

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

            runCommand(command.command, index, name, command.longestName);

            if (nextCommand) {
              console.log(chalk.blueBright(`Waiting for ${delay}ms before running ${getName(nextCommand, nextIndex)}`));

              setTimeout(() => concurrently(commands, nextIndex), delay);
            }
          }
          break;
        }
        case WaitCondition.Includes: {
          runCommand(command.command, index, name, command.longestName, message => {
            if (!conditionMet && stripAnsiAndChalk(message).toLowerCase().includes(command.value!.toLowerCase())) {
              conditionMet = true;

              concurrently(commands, nextIndex);
            }
          });

          if (nextCommand) {
            console.log(
              chalk.blueBright(
                `Waiting for ${name} to log a message including "${command.value}" before running ${getName(nextCommand, nextIndex)}`
              )
            );
          }
          break;
        }
        case WaitCondition.Matches: {
          runCommand(command.command, index, name, command.longestName, message => {
            if (!conditionMet && stripAnsiAndChalk(message) === command.value) {
              conditionMet = true;

              concurrently(commands, nextIndex);
            }
          });

          if (nextCommand) {
            console.log(
              chalk.blueBright(`Waiting for [${name}] to log "${command.value}" before running ${getName(nextCommand, nextIndex)}`)
            );
          }
          break;
        }
        case WaitCondition.Quiet: {
          if (isNaN(command.value as unknown as number)) {
            logError(`ERROR: Quiet delay for command "${command.command}" is not a number`);
          } else {
            const delay = parseFloat(command.value);

            let timeout: NodeJS.Timer;

            runCommand(command.command, index, name, command.longestName, message => {
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
                chalk.blueBright(`Waiting for ${name} to stop logging for ${delay}ms before running ${getName(nextCommand, nextIndex)}`)
              );
            }
          }
          break;
        }
      }
    }
  } else {
    runCommand(command.command, index, name, command.longestName);

    if (nextCommand) {
      concurrently(commands, nextIndex);
    }
  }
}
