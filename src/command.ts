import { WaitCondition } from './wait-condition';

export interface ConcurrentCommand {
  /**
   * The cli command to run
   */
  command: string;

  /**
   * An optional condition type to match before running the next command
   */
  condition?: WaitCondition;

  /**
   * An optional value for the condition
   */
  value?: string;

  /**
   * An optional display name for the command
   */
  name?: string;
}
