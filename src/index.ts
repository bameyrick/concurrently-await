#!/usr/bin/env node

import * as yargs from 'yargs';
import { ConcurrentCommand } from './command';
import { concurrently } from './concurrently';
import { WaitCondition } from './wait-condition';

const args = yargs
  .usage('$0 [options] <command ...>')
  .help('h')
  .alias('h', 'help')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  .version('v', (require('../package.json') as Record<string, unknown>).version as string)
  .alias('v', 'V')
  .alias('v', 'version')
  .options({
    ws: {
      alias: 'wait-separator',
      describe:
        "The character(s) to split a command and it's wait condition on on. Example usage:\n" +
        'concurrently-await "/npm run build-client --watch | 500/" "/npm run server"  --wait-separator "|"',
      default: 'await',
    },
    n: {
      alias: 'names',
      describe: 'List of custom names to be used in prefix template.\n' + 'Example names: "main,browser,server"',
      type: 'string',
    },
    ns: {
      alias: 'name-separator',
      describe:
        'The character to split <names> on. Example usage:\n' + 'concurrently-await -n "styles|scripts|server" --name-separator "|"',
      default: ',',
    },
  }).argv;

if (!(args instanceof Promise)) {
  const names = args.n?.split(args.ns) || [];
  const commands = args._ as string[];
  const longestName = Math.max(
    names.reduce((longest, name) => (name.length > longest ? name.length : longest), 0),
    commands.length
  );
  const waitSeperator = args.ws;

  const conditionRegex = new RegExp(`--(${Object.values(WaitCondition).join('|')})`);

  concurrently(
    commands.map((arg, index) => {
      const argParts = arg.split(waitSeperator);

      const conditionMatches = argParts[1]?.match(conditionRegex);

      const condition = conditionMatches ? (conditionMatches[0].replace('--', '').trim() as WaitCondition) : undefined;

      const value = condition ? argParts[1].split(`--${condition}`)[1].trim() : undefined;

      const command: ConcurrentCommand = {
        command: argParts[0].trim(),
        condition,
        value,
        name: names[index],
        longestName,
      };

      return command;
    })
  );
}
