import { mkdir, readFile, writeFile } from 'node:fs/promises';

const source = await readFile('index-fixed.html', 'utf8');
await mkdir('dist', { recursive: true });
await writeFile('dist/index.html', source, 'utf8');
console.log('Built corrected trader UI into dist/');
