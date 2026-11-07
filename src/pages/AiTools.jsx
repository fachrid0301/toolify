import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, Image as ImageIcon, Scissors, Sparkles, WandSparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import LoadingButton from '../components/LoadingButton.jsx'
import LoadingOverlay from '../components/LoadingOverlay.jsx'
import ToastNotification from '../components/ToastNotification.jsx'

const BackgroundRemover = lazy(() => Promise.resolve({ default: BackgroundRemoverTool }))
const MAX_BYTES = 20 * 1024 * 1024
const MAX_PIXELS = 16_000_000

export default function AiToolsPage() {
  useSeo('AI Tools Gratis di Browser | Toolify', 'Jelajahi AI tools gratis untuk gambar. Proses lokal di browser dengan fokus pada privasi. AI Background Remover tersedia sekarang.')
  const cards = [
    { title: 'AI Background Remover', desc: 'Hapus latar foto otomatis dengan model MODNet yang berjalan di perangkat Anda.', icon: Scissors, path: '/ai-background-remover', ready: true },
    { title: 'AI Image Upscaler', desc: 'Perbesar gambar dengan model super-resolution yang diproses lokal.', icon: ImageIcon, path: '/ai-image-upscaler' },
    { title: 'AI Image Enhancer', desc: 'Sesuaikan pencahayaan, kontras, ketajaman, dan saturasi.', icon: WandSparkles, path: '/ai-image-enhancer' },
    { title: 'AI Photo Restoration', desc: 'Eksplorasi pemulihan foto lama dengan model AI restoration.', icon: Sparkles, path: '/ai-photo-restoration' },
  ]
  return <section className="ai-page"><Link className="back-link" to="/"><ArrowRight className="back-arrow" size={15}/> Beranda</Link><div className="ai-hero"><span className="eyebrow">TOOLIFY · PEMROSESAN LOKAL</span><h1>AI Tools untuk gambar</h1><p>Alat gambar gratis yang memproses file langsung di browser Anda. File tidak diunggah ke server Toolify.</p></div><div className="ai-grid">{cards.map(({ title, desc, icon: Icon, path, ready }) => <article className="ai-card" key={path}><div className="ai-card-top"><span className="tool-icon lavender"><Icon size={21}/></span><span className="ai-free">Free · Rp0</span></div><h2>{title}</h2><p>{desc}</p>{ready ? <Link className="card-link" to={path}>Buka tool <ArrowRight size={16}/></Link> : <span className="ai-soon">Segera hadir</span>}</article>)}</div><div className="ai-privacy"><Sparkles size={18}/><span>Model AI hanya diunduh saat tool dibuka. Pemrosesan gambar tetap di perangkat Anda.</span></div></section>
}

export function BackgroundRemoverPage() {
  useSeo('AI Background Remover Gratis | Toolify', 'Hapus background foto secara otomatis dengan AI MODNet. Gratis, berjalan lokal di browser, dan unduh PNG transparan tanpa mengunggah gambar.')
  return <BackgroundRemover />
}

function BackgroundRemoverTool() {
  const [source, setSource] = useState(null), [sourceUrl, setSourceUrl] = useState(''), [resultUrl, setResultUrl] = useState('')
  const [error, setError] = useState(''), [busy, setBusy] = useState(false), [phase, setPhase] = useState(''), [progress, setProgress] = useState(null), [toast, setToast] = useState(''), [compare, setCompare] = useState(50), [downloading, setDownloading] = useState(false)
  const input = useRef(null), timer = useRef()
  useEffect(() => () => { if (sourceUrl) URL.revokeObjectURL(sourceUrl); if (resultUrl) URL.revokeObjectURL(resultUrl); clearTimeout(timer.current) }, [sourceUrl, resultUrl])
  const select = async file => {
    setError(''); setResultUrl('')
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setError('Gunakan gambar JPG, JPEG, PNG, atau WebP.'); return }
    if (file.size > MAX_BYTES) { setError('Ukuran gambar maksimum 20 MB.'); return }
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      if (img.naturalWidth * img.naturalHeight > MAX_PIXELS) { URL.revokeObjectURL(url); setError('Gambar terlalu besar untuk pemrosesan yang aman di browser ini (maksimum 16 megapiksel).'); return }
      setSource(file); setSourceUrl(url)
    }
    img.onerror = () => { URL.revokeObjectURL(url); setError('File gambar tidak dapat dibaca.') }
    img.src = url
  }
  const process = async () => {
    if (!source || busy) return
    setBusy(true); setError(''); setResultUrl(''); setProgress(null); setPhase('Preparing image...')
    try {
      const { removeBackground } = await import('../services/backgroundRemoval.js')
      setPhase('Loading AI Model...')
      const output = await removeBackground(source, info => {
        if (info.status === 'progress' && Number.isFinite(info.progress)) setProgress(Math.round(info.progress))
        if (info.status === 'fallback') setPhase('WebGPU unavailable; using WebAssembly...')
        if (info.status === 'done') { setProgress(100); setPhase('Processing image...') }
        if (info.status === 'processing') setPhase('Processing image...')
        if (info.status === 'progress' && info.file) setPhase(`Downloading model: ${info.file}`)
      })
      setPhase('Almost finished...')
      setResultUrl(URL.createObjectURL(output)); setCompare(50); setToast('Background berhasil dihapus.')
      timer.current = setTimeout(() => setToast(''), 2800)
    } catch (e) {
      console.error('Background removal failed', e)
      setError(e.message?.includes('WebGPU') ? 'Perangkat ini tidak mendukung WebGPU dan WebAssembly tidak dapat memuat model. Coba browser terbaru atau gambar yang lebih kecil.' : 'Model AI gagal dimuat atau gambar tidak dapat diproses. Periksa koneksi saat model pertama kali diunduh, lalu coba lagi.')
    } finally { setBusy(false); setPhase(''); setProgress(null) }
  }
  const download = async () => {
    if (!resultUrl || downloading) return
    setDownloading(true); setToast('Preparing download...')
    try {
      await new Promise(resolve => setTimeout(resolve, 160))
      const a = document.createElement('a'); a.href = resultUrl; a.download = `${source.name.replace(/\.[^.]+$/, '')}-no-background.png`; a.click()
      setToast('Download completed.'); timer.current = setTimeout(() => setToast(''), 2800)
    } catch { setToast('Download gagal. Coba lagi.'); timer.current = setTimeout(() => setToast(''), 2800) }
    finally { setDownloading(false) }
  }
  return <section className="tool-page ai-tool-page"><Link className="back-link" to="/ai-tools"><ArrowRight className="back-arrow" size={15}/> Semua AI Tools</Link><div className="tool-page-heading"><div className="tool-page-icon"><Scissors size={24}/></div><div><div className="eyebrow">AI TOOLS · GRATIS</div><h1>AI Background Remover</h1><p>Hapus background gambar langsung di browser. File Anda tidak diunggah.</p></div></div><div className="work-card"><div className="work-card-header"><h2>Unggah gambar</h2><span className="file-support">JPG · PNG · WebP · MAKS. 20 MB</span></div>{!source ? <div className="dropzone" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); select(e.dataTransfer.files?.[0]) }} onClick={() => input.current?.click()} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && input.current?.click()}><input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={e => select(e.target.files?.[0])}/><div className="upload-icon"><ArrowDown size={22}/></div><b>Seret dan lepas gambar di sini</b><span>atau klik untuk memilih dari perangkat</span><button className="button primary small" type="button">Pilih gambar</button><small>JPG, JPEG, PNG, WebP · Maks. 20 MB · Maks. 16 MP</small></div> : <><div className="ai-source-row"><span>{source.name} · {(source.size / 1024 / 1024).toFixed(2)} MB</span><button className="text-button" disabled={busy} onClick={() => { setSource(null); setSourceUrl(''); setResultUrl(''); setError('') }}>Ganti gambar</button></div><div className="ai-comparison"><div className="ai-before"><img src={sourceUrl} alt="Foto asli"/><span>Asli</span></div>{resultUrl && <div className="ai-after" style={{ clipPath: `inset(0 0 0 ${compare}%)` }}><img src={resultUrl} alt="Foto tanpa latar belakang"/><span>Tanpa latar</span></div>}{resultUrl && <input aria-label="Bandingkan hasil sebelum dan sesudah" className="ai-compare-range" type="range" min="0" max="100" value={compare} onChange={e => setCompare(Number(e.target.value))}/>}</div><div className="ai-actions"><button className="button primary" disabled={busy} onClick={process}><Sparkles size={16}/>{busy ? 'Memproses...' : resultUrl ? 'Proses ulang' : 'Hapus background'}</button>{resultUrl && <LoadingButton loading={downloading} onClick={download}><ArrowDown size={15}/> Unduh PNG</LoadingButton>}</div>{busy && <LoadingOverlay title={phase || 'Processing image...'} detail="Model berjalan lokal di browser. Unduhan model pertama kali mungkin memerlukan waktu." progress={progress}/>}</>}{error && <p className="error-message" role="alert">{error}</p>}</div><p className="privacy-note">Model MODNet (Apache-2.0) · Model diunduh dari Hugging Face saat pertama digunakan dan disimpan oleh cache browser.</p><section className="ai-seo-copy"><h2>Cara menghapus background gambar</h2><p>Unggah foto JPG, PNG, atau WebP. Toolify menjalankan model segmentasi MODNet secara lokal untuk menghasilkan PNG transparan. Gambar Anda tidak dikirim ke server Toolify.</p><h2>Pertanyaan umum</h2><details><summary>Apakah AI Background Remover gratis?</summary><p>Ya. Tool ini gratis dan tidak menggunakan API berbayar.</p></details><details><summary>Apakah gambar saya diunggah?</summary><p>Tidak. Hanya file model yang diunduh dari Hugging Face; gambar diproses di perangkat Anda.</p></details><details><summary>Kenapa pemrosesan pertama lebih lama?</summary><p>Browser perlu mengunduh dan menyimpan model AI sebelum pemakaian pertama. Waktu unduhan bergantung pada koneksi dan perangkat.</p></details></section><ToastNotification message={toast}/></section>
}

function useSeo(title, description) {
  useEffect(() => {
    document.title = title
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.append(meta) }
    meta.content = description
    let og = document.querySelector('meta[property="og:title"]')
    if (!og) { og = document.createElement('meta'); og.setAttribute('property', 'og:title'); document.head.append(og) }
    og.content = title
    let ogDescription = document.querySelector('meta[property="og:description"]')
    if (!ogDescription) { ogDescription = document.createElement('meta'); ogDescription.setAttribute('property', 'og:description'); document.head.append(ogDescription) }
    ogDescription.content = description
    return () => { document.title = 'Toolify — Alat online sehari-hari' }
  }, [title, description])
}
