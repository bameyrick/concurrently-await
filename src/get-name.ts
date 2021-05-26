import { ConcurrentCommand } from './command';

/**
 * Generates a name for a given command
 */
export function getName(command: ConcurrentCommand, index: number): string {
  return `[${command.name || index}]`;
}
