import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const manifest = JSON.parse(await readFile(new URL('../../docs/design/login-assets.json', import.meta.url), 'utf8'));
assert.equal(manifest.original.sha256, 'e42150c4f07618a221441a9bc5fe83ac7e50beac8946c2b27d942d4e522dfb84');
for (const asset of [manifest.original, manifest.crop, ...manifest.auxiliary]) {
  const bytes = await readFile(new URL(`../../public/design/${asset.file}`, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256, `${asset.file}: SHA-256 divergente`);
  if (asset.file.endsWith('.png')) {
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    const dimensions = [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
    assert.deepEqual(dimensions, asset.dimensions ?? [1086, 992], `${asset.file}: dimensões divergentes`);
  }
  console.log(`${asset.file}: SHA-256 íntegro`);
}
