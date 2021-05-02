import * as fs from 'fs';

interface Command {
  party: string;
  action: string;
  params: string[];
}

export const parseInputFile = (path: string): Command[] => {
  const lines = fs.readFileSync(path).toString().replace(/\r\n/g, '\n').split('\n');

  return lines.map((line) => {
    const [party, action, params] = line.split('|').map((x) => x.trim());
    if (!party || !action || !params) {
      throw new Error('Invalid number of parameters in line');
    }

    return { party, action, params: params.split(',').map((x) => x.trim()) };
  });
};
