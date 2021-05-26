let lastLogIndex: number;

/**
 * Handles logging output from a command
 */
export function logger(index: number, message: string, name: string): void {
  name = `${name}: `;

  const spaces = new Array(name.length).fill(' ').join('');
  const prefix = lastLogIndex === index ? spaces : name;

  console.log(`${prefix}${message.replace(/^\n/, '').replace(/\n/g, `\n${spaces}`)}`);

  lastLogIndex = index;
}
