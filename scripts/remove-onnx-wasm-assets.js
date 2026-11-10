import { readdir, unlink } from 'node:fs/promises'
import { join } from 'node:path'

const assetsDirectory = join(process.cwd(), 'dist', 'assets')
const files = await readdir(assetsDirectory)
const wasmFiles = files.filter(name => /^ort-wasm-.*\.wasm$/i.test(name))

for (const file of wasmFiles) {
  await unlink(join(assetsDirectory, file))
  console.log(`Externalized ONNX Runtime WASM asset: ${file}`)
}

if (wasmFiles.length === 0) {
  console.log('No ONNX Runtime WASM assets were emitted into dist.')
}
