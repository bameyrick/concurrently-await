import stripAnsi from 'strip-ansi';

export function stripAnsiAndChalk(value: string): string {
  return stripAnsi(value).replace(/\u001b[^m]*?m/g, '');
}
