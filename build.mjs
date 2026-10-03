import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';

const source = await readFile('index.html', 'utf8');
let injected = source;
if (!injected.includes('format-cent-inputs.js')) {
  injected = injected.replace('</head>', '<link rel="stylesheet" href="theme.css"><script src="format-cent-inputs.js"></script></head>');
}
if (!injected.includes('delete-journal-controls.js')) {
  injected = injected.replace('</head>', '<script src="delete-journal-controls.js"></script></head>');
}
if (!injected.includes('delete-target-draft.js')) {
  injected = injected.replace('</head>', '<script src="delete-target-draft.js"></script></head>');
}
if (!injected.includes('formula-display.js')) {
  injected = injected.replace('</head>', '<script src="formula-display.js"></script></head>');
}

await mkdir('dist', { recursive: true });
await writeFile('dist/index.html', injected, 'utf8');
await copyFile('theme.css', 'dist/theme.css');
await copyFile('format-cent-inputs.js', 'dist/format-cent-inputs.js');
await copyFile('delete-journal-controls.js', 'dist/delete-journal-controls.js');
await copyFile('delete-target-draft.js', 'dist/delete-target-draft.js');
await copyFile('formula-display.js', 'dist/formula-display.js');
console.log('Built trader UI into dist/');
