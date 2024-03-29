import { SpawnOptions } from 'child_process';
import * as chalk from 'chalk';

export const getSpawnOptions = ({
  colorSupport = chalk.supportsColor,
  cwd,
  process = global.process,
  raw = false,
  env = {},
}: {
  /**
   * What the color support of the spawned processes should be.
   * If set to `false`, then no colors should be output.
   *
   * Defaults to whatever the terminal's stdout support is.
   */
  colorSupport?: typeof chalk.supportsColor;

  /**
   * The NodeJS process.
   */
  process?: Pick<NodeJS.Process, 'cwd' | 'platform' | 'env'>;

  /**
   * A custom working directory to spawn processes in.
   * Defaults to `process.cwd()`.
   */
  cwd?: string;

  /**
   * Whether to customize the options for spawning processes in raw mode.
   * Defaults to false.
   */
  raw?: boolean;

  /**
   * Map of custom environment variables to include in the spawn options.
   */
  env?: Record<string, unknown>;
}): SpawnOptions => {
  return {
    cwd: cwd || process.cwd(),
    ...(raw && { stdio: 'inherit' as const }),
    ...(/^win/.test(process.platform) && { detached: false }),
    env: {
      ...(colorSupport ? { FORCE_COLOR: colorSupport.level.toString() } : {}),
      ...process.env,
      ...env,
    },
  };
};
