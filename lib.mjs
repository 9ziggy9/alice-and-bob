export const RED = '\x1b[31m%s\x1b[0m';
export const GREEN = '\x1b[32m%s\x1b[0m';
export const YELLOW = '\x1b[33m%s\x1b[0m';
export const BLUE = '\x1b[34m%s\x1b[0m';
export const MAGENTA = '\x1b[35m%s\x1b[0m';
export const CYAN = '\x1b[36m%s\x1b[0m';

export function parseArgs(data, validOperators) {
  const dataStr = data.toString().trim();
  const possibleArgs = dataStr.split(" ");

  // Array of operators
  const ops = possibleArgs.reduce((ops, a) => validOperators
				  .includes(a) ? [...ops, a] : [...ops], []);
  const msg = possibleArgs.reduce((words, a) => validOperators
				  .includes(a) ? [...words] : [...words, a], []);
  if (ops.length > 0) return [msg.join(" "), ops[0]];
  return [dataStr, null];
}
