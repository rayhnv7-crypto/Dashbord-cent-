import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';

const source = await readFile('index.html', 'utf8');
const injected = source.includes('format-cent-inputs.js')
  ? source
  : source.replace('</head>', '<link rel="stylesheet" href="theme.css"><script src="format-cent-inputs.js"></script></head>');
const withDeleteControls = injected.includes('delete-journal-controls.js')
  ? injected
  : injected.replace('</head>', '<script src="delete-journal-controls.js"></script></head>');
const withBeginnerGuide = withDeleteControls.includes('beginner-guide.js')
  ? withDeleteControls
  : withDeleteControls.replace('</head>', '<script src="beginner-guide.js"></script></head>');

await mkdir('dist', { recursive: true });
await writeFile('dist/index.html', withBeginnerGuide, 'utf8');
await copyFile('theme.css', 'dist/theme.css');
await copyFile('format-cent-inputs.js', 'dist/format-cent-inputs.js');
await copyFile('delete-journal-controls.js', 'dist/delete-journal-controls.js');
await copyFile('beginner-guide.js', 'dist/beginner-guide.js');
console.log('Built trader UI into dist/');
