import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';

const source = await readFile('index.html', 'utf8');
const injected = source.includes('theme.css')
  ? source
  : source.replace('</head>', '<link rel="stylesheet" href="theme.css"></head>');

await mkdir('dist', { recursive: true });
await writeFile('dist/index.html', injected, 'utf8');
await copyFile('theme.css', 'dist/theme.css');
console.log('Built trader UI into dist/');
