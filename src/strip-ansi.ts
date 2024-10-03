export function stripAnsi(value: string): string {
  return value.replace(/\u001b[^m]*?m/g, '');
}
