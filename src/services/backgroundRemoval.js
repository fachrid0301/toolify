let segmenterPromise

// MODNet is distributed with an Apache-2.0 license. Transformers.js downloads
// the model from Hugging Face on first use and caches it in the browser.
export async function removeBackground(file, onProgress = () => {}) {
  const { pipeline, RawImage, env } = await import('@huggingface/transformers')
  env.allowLocalModels = false
  // Keep ONNX Runtime WebAssembly inference off the UI thread when using fallback.
  env.backends.onnx.wasm.proxy = true
  if (!segmenterPromise) {
    segmenterPromise = (async () => {
      try {
        return await pipeline('background-removal', 'Xenova/modnet', {
          device: 'webgpu',
          progress_callback: onProgress,
        })
      } catch (error) {
        if (error?.name !== 'Error' && error?.name !== 'TypeError') throw error
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
