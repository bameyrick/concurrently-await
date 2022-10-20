import { ChildProcess, SpawnOptions, spawn as _spawn } from 'child_process';
import * as util from 'util';

export function spawn(command: string, options: SpawnOptions): ChildProcess {
  let file: string;
  let args: string[];

  if (process.platform === 'win32') {
    file = 'cmd.exe';
    args = ['/s', '/c', `"${command}"`];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    options = (util as any)._extend({}, options);
    options.windowsVerbatimArguments = true;
  } else {
    file = `/bin/sh`;
    args = ['-c', command];
  }

  return _spawn(file, args, options);
}
