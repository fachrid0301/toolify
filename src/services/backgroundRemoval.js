let segmenterPromise

// MODNet is distributed with an Apache-2.0 license. Transformers.js downloads
// the model from Hugging Face on first use and caches it in the browser.
export async function removeBackground(file, onProgress = () => {}) {
  const { pipeline, RawImage, env } = await import('@huggingface/transformers')
  env.allowLocalModels = false
  const ort = env.backends.onnx
  const ortVersion = ort.versions?.web
  if (!ortVersion) throw new Error('ONNX Runtime Web version is unavailable.')
  const wasmBase = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ortVersion}/dist/`
  // The Transformers.js WebGPU entrypoint is compiled against ONNX Runtime's
  // Asyncify glue. Use its matching WASM pair for both WebGPU and WASM fallback;
  // it is hosted by jsDelivr, so the 25.6 MiB binary is not a Worker asset.
  ort.wasm.wasmPaths = {
    mjs: `${wasmBase}ort-wasm-simd-threaded.asyncify.mjs`,
    wasm: `${wasmBase}ort-wasm-simd-threaded.asyncify.wasm`,
  }
  // Keep fallback inference off the UI thread.
  ort.wasm.proxy = true
  ort.wasm.numThreads = 1
  if (!segmenterPromise) {
    segmenterPromise = (async () => {
      const adapter = globalThis.navigator?.gpu ? await globalThis.navigator.gpu.requestAdapter().catch(() => null) : null
      const device = adapter ? 'webgpu' : 'wasm'
      if (device === 'wasm') onProgress({ status: 'fallback', message: 'WebGPU unavailable; using WebAssembly' })
      try {
        return await pipeline('background-removal', 'Xenova/modnet', {
          device,
          progress_callback: onProgress,
        })
      } catch (error) {
        const webGpuUnavailable = device === 'webgpu' && /webgpu|gpu|adapter|device|not supported|not implemented|unsupported/i.test(error?.message || '')
        if (!webGpuUnavailable) throw error
        onProgress({ status: 'fallback', message: 'WebGPU unavailable; using WebAssembly' })
        return pipeline('background-removal', 'Xenova/modnet', {
          device: 'wasm',
          progress_callback: onProgress,
        })
      }
    })().catch(error => { segmenterPromise = undefined; throw error })
  }
  const model = await segmenterPromise
  onProgress({ status: 'processing' })
  const source = await RawImage.fromBlob(file)
  const output = await model(source)
  if (!(output instanceof RawImage) || output.channels !== 4) throw new Error('Model did not return a transparent image.')
  return output.toBlob('image/png')
}
