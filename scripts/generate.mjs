import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

function generate(generator, name) {
  execSync(`cp -R .generators/${generator}/ packages/${name}/`, {
    stdio: 'inherit',
  });
  const packageJson = readFileSync(`.generators/${generator}/package.json`)
    .toString()
    .replace('{name}', name);
  writeFileSync(`packages/${name}/package.json`, packageJson);
  execSync(`(cd packages/${name} && npm i && npm test)`, { stdio: 'inherit' });
}

if (!process.argv[2]) {
  console.error('Please provide a generator.');
}

if (!process.argv[3]) {
  console.error('Please provide a package name.');
}

generate(process.argv[2], process.argv[3]);
