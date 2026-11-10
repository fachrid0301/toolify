import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

const onnxPackage = JSON.parse(readFileSync(new URL('./node_modules/onnxruntime-web/package.json', import.meta.url), 'utf8'))
const onnxCdn = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${onnxPackage.version}/dist/`

// ONNX Runtime references its WASM binaries with `new URL(..., import.meta.url)`.
// Vite would otherwise copy the default 25+ MiB Asyncify binary into dist even
// though Transformers.js configures wasmPaths at runtime. Point those dormant
// defaults to the same versioned CDN used by the runtime instead.
const externalizeOnnxWasm = {
  name: 'externalize-onnx-wasm-assets',
  enforce: 'pre',
  transform(code, id) {
    if (!id.includes('/onnxruntime-web/dist/')) return null
    const transformed = code.replace(
      /new URL\((["'])(ort-wasm-[^"']+\.wasm)\1,\s*import\.meta\.url\)/g,
      (_match, quote, file) => `new URL(${quote}${file}${quote}, ${quote}${onnxCdn}${quote})`,
    )
    return transformed === code ? null : { code: transformed, map: null }
  },
}

export default defineConfig({
  plugins: [externalizeOnnxWasm, react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'qr-code': ['qrcode'],
          'pdf-tools': ['jspdf'],
          icons: ['lucide-react'],
        },
      },
    },
  },
})
