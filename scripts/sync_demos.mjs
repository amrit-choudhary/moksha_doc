// Copies the published web builds from a moksha_samples checkout into public/demos.
// Usage: npm run sync:demos [-- <path to moksha_samples/dist>]
import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

const SLUGS = ['prism_drop', 'tower_climb', 'survivors', 'evolution', 'graphics_stress', 'ui_demo'];
const KEEP = ['.html', '.js', '.wasm', '.data'];

const source = resolve(
  process.argv[2] ??
    process.env.MOKSHA_SAMPLES_DIST ??
    join(homedir(), 'work/gamedev/cpp_projects/moksha_samples/moksha_samples/dist'),
);
const target = resolve('public/demos');

await rm(target, { recursive: true, force: true });
for (const slug of SLUGS) {
  const from = join(source, slug);
  const to = join(target, slug);
  await mkdir(to, { recursive: true });
  let bytes = 0;
  for (const name of await readdir(from)) {
    if (!KEEP.some((ext) => name.endsWith(ext))) continue;
    await cp(join(from, name), join(to, name));
    bytes += (await stat(join(from, name))).size;
  }
  console.log(`${slug}: ${(bytes / 1e6).toFixed(2)} MB`);
}
