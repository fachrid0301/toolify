import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, ChevronDown, FileImage, FileText, Image, ImageDown, Layers, LockKeyhole, Menu, Moon, QrCode, ShieldCheck, Sparkles, Sun, Upload, X } from 'lucide-react'
import QRCode from 'qrcode'
import { jsPDF } from 'jspdf'

const tools = [
  { path: '/image-compressor', title: 'Kompres Gambar', desc: 'Perkecil ukuran gambar tanpa mengorbankan kualitas.', icon: ImageDown, tint: 'lavender', tag: 'Hemat ruang' },
  { path: '/image-converter', title: 'Image Converter', desc: 'Ubah format PNG, JPG, WebP, GIF, dan BMP dengan mudah.', icon: FileImage, tint: 'mint', tag: '8 format' },
  { path: '/qr-generator', title: 'QR Code Generator', desc: 'Buat QR code kustom untuk tautan, Wi-Fi, dan lainnya.', icon: QrCode, tint: 'mint', tag: 'Mudah dibagikan' },
  { path: '/jpg-to-pdf', title: 'JPG ke PDF', desc: 'Gabungkan gambar menjadi PDF dalam beberapa klik.', icon: FileText, tint: 'peach', tag: 'Siap diunduh' },
]

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('toolify-theme') === 'dark')
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState('')
  const location = useLocation()
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('toolify-theme', dark ? 'dark' : 'light') }, [dark])
  useEffect(() => { window.scrollTo(0, 0); setMenuOpen(false) }, [location.pathname])
  const notify = useCallback((msg) => { setToast(msg); window.clearTimeout(window.__toolifyToast); window.__toolifyToast = window.setTimeout(() => setToast(''), 3200) }, [])
  return <div className="app-shell">
    <header className="navbar"><div className="nav-inner">
      <Link to="/" className="brand"><span className="brand-mark"><Sparkles size={19} fill="currentColor" /></span><span>toolify<span className="brand-dot">.</span></span></Link>
      <button className="mobile-menu icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Buka navigasi">{menuOpen ? <X /> : <Menu />}</button>
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'}><NavLink to="/" end>Beranda</NavLink><a href="/#tools">Tools <ChevronDown size={14} /></a><NavLink to="/about">Tentang</NavLink><NavLink to="/contact">Kontak</NavLink><button className="theme-button" onClick={() => setDark(!dark)} aria-label="Ganti tema">{dark ? <Sun size={17} /> : <Moon size={17} />}</button></nav>
    </div></header>
    <main><Routes>
      <Route path="/" element={<Home />} />
      <Route path="/image-compressor" element={<Compressor notify={notify} />} />
      <Route path="/image-converter" element={<ImageConverter notify={notify} />} />
      <Route path="/qr-generator" element={<QrTool notify={notify} />} />
      <Route path="/jpg-to-pdf" element={<PdfTool notify={notify} />} />
      <Route path="/about" element={<InfoPage title="Tentang Toolify" eyebrow="ALAT YANG MEMUDAHKAN" text="Toolify menyatukan alat online sehari-hari dalam satu tempat yang sederhana. Kompres gambar, buat QR code, dan ubah gambar menjadi PDF langsung dari browser Anda." />} />
      <Route path="/contact" element={<InfoPage title="Hubungi kami" eyebrow="KAMI SIAP MEMBANTU" text="Punya pertanyaan atau saran untuk Toolify? Kirimkan email ke halo@toolify.app. Kami senang mendengar masukan Anda." />} />
      <Route path="/privacy-policy" element={<InfoPage title="Kebijakan Privasi" eyebrow="PRIVASI ANDA PENTING" text="File yang diproses oleh Toolify tetap berada di perangkat Anda. Pemrosesan gambar, QR code, dan PDF berlangsung di browser; kami tidak mengunggah atau menyimpan file tersebut di server." />} />
      <Route path="/terms-of-service" element={<InfoPage title="Ketentuan Layanan" eyebrow="PENGGUNAAN TOOLIFY" text="Toolify menyediakan alat bantu online apa adanya. Anda bertanggung jawab atas file dan konten yang diproses serta memastikan penggunaan layanan sesuai hukum yang berlaku." />} />
      <Route path="*" element={<InfoPage title="Halaman tidak ditemukan" eyebrow="404" text="Halaman yang Anda cari tidak tersedia." />} />
    </Routes></main>
    <Footer />
    {toast && <div className="toast"><Check size={18} />{toast}</div>}
  </div>
}

function Home() {
  return <>
    <section className="hero"><div className="hero-glow glow-one"/><div className="hero-glow glow-two"/><div className="hero-content"><div className="eyebrow-pill"><span className="pulse-dot"/> ALAT ONLINE, TANPA RIBET</div><h1>Your Everyday Online<br /><span>Tools, Made Simple</span></h1><p>Kompres gambar, buat QR code, dan ubah gambar menjadi PDF — semua dalam satu tempat.</p><div className="hero-actions"><a className="button primary" href="#tools">Mulai gunakan <ArrowRight size={17}/></a><Link className="button secondary" to="/about">Kenali Toolify</Link></div><div className="hero-trust"><span><ShieldCheck size={16}/> Privat di perangkat Anda</span><span><Sparkles size={16}/> Gratis digunakan</span></div></div>
    <div className="hero-art" aria-hidden="true"><div className="art-orbit orbit-a"/><div className="art-orbit orbit-b"/><div className="art-center"><span className="art-spark"><Sparkles size={38} fill="currentColor"/></span></div><div className="float-card card-image"><span className="mini-icon lavender"><ImageDown size={19}/></span><div><b>image.jpg</b><small>2.4 MB → 840 KB</small></div><span className="saved">−65%</span></div><div className="float-card card-qr"><span className="mini-icon mint"><QrCode size={20}/></span><div><b>QR Code</b><small>Siap dipindai</small></div><span className="tiny-check"><Check size={13}/></span></div><div className="float-card card-pdf"><span className="mini-icon peach"><FileText size={19}/></span><div><b>dokumen.pdf</b><small>3 halaman</small></div></div><div className="art-dot dot-a"/><div className="art-dot dot-b"/></div>
    </section>
    <section className="tool-section" id="tools"><div className="section-heading"><div><div className="eyebrow">DIRANCANG UNTUK HARIAN</div><h2>Alat praktis, hasil maksimal</h2><p>Semua yang Anda butuhkan, tanpa perlu instalasi.</p></div><div className="tools-count"><span>04</span><small>tools tersedia</small></div></div><div className="tool-grid">{tools.map((tool, i) => <ToolCard key={tool.path} tool={tool} index={i}/>)}</div><div className="ad-slot"><span className="ad-label">ADVERTISEMENT</span><div className="ad-content"><span className="ad-icon"><Sparkles size={19}/></span><div><b>Ruang untuk hal-hal baik.</b><p>Area ini mungkin menampilkan iklan di masa mendatang.</p></div><span className="ad-badge">SPONSORED SPACE</span></div></div></section>
    <section className="privacy-banner"><div className="privacy-icon"><LockKeyhole size={22}/></div><div><h3>File Anda tetap milik Anda.</h3><p>Semua proses berlangsung langsung di browser. File tidak diunggah ke server kami.</p></div><div className="privacy-seal"><ShieldCheck size={18}/> Pemrosesan privat</div></section>
  </>
}

function ToolCard({ tool, index }) {
  const Icon = tool.icon
  return <article className={`tool-card card-${index}`}><div className="tool-card-top"><span className={`tool-icon ${tool.tint}`}><Icon size={22}/></span><span className="tool-tag">{tool.tag}</span></div><h3>{tool.title}</h3><p>{tool.desc}</p><Link to={tool.path} className="card-link">Buka alat <ArrowRight size={16}/></Link><div className={`card-decoration ${tool.tint}`}><Icon size={92}/></div></article>
}

function ToolLayout({ title, desc, icon: Icon, children }) {
  return <section className="tool-page"><Link className="back-link" to="/"><ArrowLeft size={16}/> Kembali ke beranda</Link><div className="tool-page-heading"><div className="tool-page-icon"><Icon size={25}/></div><div><div className="eyebrow">TOOLIFY ONLINE TOOLS</div><h1>{title}</h1><p>{desc}</p></div></div>{children}<p className="privacy-note"><LockKeyhole size={15}/> File Anda diproses secara lokal di browser dan tidak pernah diunggah.</p></section>
}

function Dropzone({ accept, multiple = false, onFiles, label = 'Pilih file', hint, disabled = false }) {
  const input = useRef(null), [drag, setDrag] = useState(false)
  const send = (files) => { if (files?.length) onFiles(Array.from(files)) }
  return <div className={`dropzone ${drag ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`} onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); if (!disabled) send(e.dataTransfer.files) }}>
    <input ref={input} type="file" accept={accept} multiple={multiple} hidden onChange={(e) => { send(e.target.files); e.target.value = '' }}/><div className="upload-icon"><Upload size={22}/></div><b>Seret dan lepas file di sini</b><span>atau klik untuk memilih dari perangkat</span><button type="button" className="button primary small" onClick={() => input.current?.click()} disabled={disabled}>{label}</button>{hint && <small>{hint}</small>}
  </div>
}

const formatBytes = (n) => n < 1024 ? `${n} B` : n < 1024 ** 2 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1024 ** 2).toFixed(2)} MB`
const readData = (file) => new Promise((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(r.result); r.onerror = reject; r.readAsDataURL(file) })
const imageFromUrl = (src) => new Promise((resolve, reject) => { const image = new window.Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src })

function Compressor({ notify }) {
  const [file, setFile] = useState(null), [quality, setQuality] = useState(0.78), [busy, setBusy] = useState(false), [result, setResult] = useState(null), [error, setError] = useState('')
  const process = async (f, q = quality) => {
    setBusy(true); setError(''); setResult(null)
    try { const src = await readData(f), img = await imageFromUrl(src), canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; canvas.getContext('2d').drawImage(img, 0, 0); const mime = 'image/webp'; const blob = await new Promise((resolve) => canvas.toBlob(resolve, mime, q)); if (!blob) throw new Error('Gambar tidak dapat diproses.'); const url = URL.createObjectURL(blob); setResult({ blob, url, size: blob.size, src, mime: blob.type || mime }); }
    catch { setError('Gagal memproses gambar. Pastikan file gambar tidak rusak.'); } finally { setBusy(false) }
  }
  const select = ([f]) => { if (!f) return; if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { setError('Format tidak didukung. Gunakan JPG, PNG, atau WebP.'); return } if (f.size > 20 * 1024 ** 2) { setError('Ukuran file maksimal 20 MB.'); return } setFile(f); process(f) }
  useEffect(() => { if (file) { const t = setTimeout(() => process(file, quality), 200); return () => clearTimeout(t) } }, [quality])
  useEffect(() => () => { if (result?.url) URL.revokeObjectURL(result.url) }, [result?.url])
  const saved = result && file ? Math.max(0, Math.round((1 - result.size / file.size) * 100)) : 0
  return <ToolLayout title="Kompres Gambar" desc="Perkecil ukuran gambar sambil menjaga kualitas visual." icon={ImageDown}><div className="work-card"><div className="work-card-header"><h2>Unggah gambar</h2><span className="file-support">JPG · PNG · WebP</span></div>{!file ? <Dropzone accept="image/jpeg,image/png,image/webp" onFiles={select} hint="Ukuran maksimum 20 MB"/> : <><div className="quality-control"><div><b>Kualitas kompresi</b><span>{Math.round(quality * 100)}%</span></div><input aria-label="Kualitas kompresi" type="range" min="0.2" max="0.95" step="0.01" value={quality} onChange={(e) => setQuality(Number(e.target.value))}/><div className="range-labels"><span>Ukuran lebih kecil</span><span>Kualitas lebih tinggi</span></div></div><div className="comparison-grid"><PreviewCard title="Asli" src={result?.src} name={file.name} size={file.size}/><PreviewCard title="Hasil kompresi" src={result?.url} name={file.name.replace(/\.[^.]+$/, '.webp')} size={result?.size} loading={busy}/></div>{result && <div className="result-banner"><span className="result-check"><Check size={17}/></span><div><b>{saved ? `${saved}% lebih kecil` : 'Tidak ada penghematan ukuran'}</b><small>{formatBytes(file.size)} → {formatBytes(result.size)}</small></div><button className="button primary small" onClick={() => download(result.url, file.name.replace(/\.[^.]+$/, result.mime === 'image/png' ? '.png' : '.webp'))}><ArrowDown size={16}/> Unduh</button></div>}<button className="text-button" onClick={() => { setFile(null); setResult(null); setError('') }}><X size={15}/> Hapus gambar</button></>}{error && <p className="error-message">{error}</p>}</div></ToolLayout>
}

function PreviewCard({ title, src, name, size, loading }) { return <div className="preview-card"><div className="preview-title"><b>{title}</b>{size != null && <span>{formatBytes(size)}</span>}</div><div className="preview-image">{loading ? <span className="spinner"/> : src ? <img src={src} alt={title}/> : <Image size={30}/>}</div><small>{name || 'Pratinjau gambar'}</small></div> }
const download = (url, name) => { const a = document.createElement('a'); a.href = url; a.download = name; a.click() }

function ImageConverter({ notify }) {
  const [items, setItems] = useState([]), [format, setFormat] = useState('image/png'), [quality, setQuality] = useState(90), [background, setBackground] = useState('#ffffff'), [error, setError] = useState(''), [busy, setBusy] = useState(false)
  const input = useRef(null)
  const itemsRef = useRef(items); itemsRef.current = items
  useEffect(() => () => itemsRef.current.forEach(item => { URL.revokeObjectURL(item.src); if (item.resultUrl) URL.revokeObjectURL(item.resultUrl) }), [])
  const addFiles = (files) => {
    setError('')
    const accepted = []
    for (const file of files) {
      const ext = file.name.split('.').pop().toLowerCase()
      if (!['png','jpg','jpeg','webp','bmp','gif'].includes(ext) || (file.type && !file.type.startsWith('image/'))) { setError(`${file.name}: format tidak didukung. Pilih PNG, JPG, WebP, BMP, atau GIF.`); continue }
      if (file.size > 30 * 1024 ** 2) { setError(`${file.name}: ukuran file maksimal 30 MB.`); continue }
      accepted.push({ id: `${Date.now()}-${Math.random()}`, file, src: URL.createObjectURL(file), source: ext.toUpperCase(), resultUrl: '', resultSize: 0, error: '' })
    }
    if (accepted.length) setItems(prev => [...prev, ...accepted])
  }
  const convertAll = async () => {
    setBusy(true); setError('')
    const snapshot = items
    const converted = await Promise.all(snapshot.map(async item => {
      const target = format === 'image/jpeg' ? 'JPEG' : format.split('/')[1].toUpperCase()
      if (item.source === target || (target === 'JPEG' && ['JPG','JPEG'].includes(item.source))) return { ...item, resultUrl: '', resultSize: 0, error: 'Format sumber dan tujuan sama.' }
      if (format === 'image/svg+xml' && !['PNG','JPG','JPEG'].includes(item.source)) return { ...item, resultUrl: '', resultSize: 0, error: 'SVG tersedia untuk file PNG atau JPG.' }
      try {
        const img = await imageFromUrl(item.src)
        let url, size
        if (format === 'image/svg+xml') {
          const data = await readData(item.file)
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${img.naturalWidth}" height="${img.naturalHeight}" viewBox="0 0 ${img.naturalWidth} ${img.naturalHeight}"><image width="100%" height="100%" href="${data}"/></svg>`
          const blob = new Blob([svg], { type: format }); size = blob.size; url = URL.createObjectURL(blob)
        } else {
          const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight
          const ctx = canvas.getContext('2d'); if (format === 'image/jpeg') { ctx.fillStyle = background; ctx.fillRect(0, 0, canvas.width, canvas.height) } ctx.drawImage(img, 0, 0)
          const blob = await new Promise((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('Browser tidak mendukung format hasil ini.')), format, quality / 100))
          if (blob.type !== format) throw new Error('Format hasil tidak didukung browser ini.')
          size = blob.size; url = URL.createObjectURL(blob)
        }
        return { ...item, resultUrl: url, resultSize: size, error: '' }
      } catch (e) { return { ...item, resultUrl: '', resultSize: 0, error: e.message || 'Konversi gagal. File mungkin rusak atau format tidak didukung.' } }
    }))
    converted.forEach(item => { const old = snapshot.find(x => x.id === item.id); if (old?.resultUrl) URL.revokeObjectURL(old.resultUrl) })
    setItems(converted); setBusy(false)
    if (converted.some(x => x.resultUrl)) notify('Konversi gambar berhasil.')
  }
  const extOut = format === 'image/jpeg' ? 'jpg' : format === 'image/svg+xml' ? 'svg' : format.split('/')[1]
  const downloadAll = async () => { for (const item of items.filter(x => x.resultUrl)) { download(item.resultUrl, item.file.name.replace(/\.[^.]+$/, `.${extOut}`)); await new Promise(r => setTimeout(r, 250)) } }
  return <ToolLayout title="Image Converter" desc="Konversi gambar langsung di browser Anda, tanpa mengunggah file." icon={FileImage}>
    <div className="work-card converter-card"><div className="work-card-header"><h2>Pilih gambar</h2><span className="file-support">PNG · JPG · WEBP · BMP · GIF</span></div>
      <Dropzone accept="image/png,image/jpeg,image/webp,image/bmp,image/gif" multiple onFiles={addFiles} label="Pilih gambar" hint="Maks. 30 MB per gambar · Banyak file sekaligus" />
      {error && <p className="error-message" role="alert">{error}</p>}
      {items.length > 0 && <><div className="converter-controls">
        <div className="form-field"><label htmlFor="converter-format">Format tujuan</label><div className="select-wrap"><select id="converter-format" value={format} onChange={e => setFormat(e.target.value)}><option value="image/png">PNG</option><option value="image/jpeg">JPG / JPEG</option><option value="image/webp">WebP</option><option value="image/svg+xml">SVG (gambar tertanam)</option></select><ChevronDown size={16}/></div></div>
        {format === 'image/jpeg' && <><div className="form-field"><label htmlFor="converter-quality">Kualitas JPG <strong className="value-tag">{quality}%</strong></label><input id="converter-quality" className="range-input" type="range" min="1" max="100" value={quality} onChange={e => setQuality(Number(e.target.value))}/></div><div className="form-field"><label htmlFor="converter-bg">Warna latar JPG</label><ColorPicker value={background} onChange={setBackground}/><small>Transparansi akan diisi dengan warna ini.</small></div></>}
        <div className="converter-actions"><button className="button primary" onClick={convertAll} disabled={busy}>{busy ? <><span className="spinner light"/> Mengonversi…</> : <><Layers size={16}/> Konversi {items.length} gambar</>}</button><button className="button secondary" onClick={downloadAll} disabled={!items.some(x => x.resultUrl) || busy}><ArrowDown size={16}/> Unduh semua</button><button className="text-button" onClick={() => { items.forEach(x => { URL.revokeObjectURL(x.src); if (x.resultUrl) URL.revokeObjectURL(x.resultUrl) }); setItems([]); setError('') }}><X size={15}/> Reset</button></div>
      </div><div className="converter-list">{items.map(item => { const out = item.resultUrl ? item.resultSize : 0; const change = out ? Math.round((item.file.size - out) / item.file.size * 100) : 0; return <article className="converter-item" key={item.id}><img src={item.src} alt={`Pratinjau ${item.file.name}`} /><div className="converter-info"><b title={item.file.name}>{item.file.name}</b><small>{formatBytes(item.file.size)} · {item.source} → {format.split('/')[1].toUpperCase()}</small>{item.error ? <small className="error-inline" role="alert">{item.error}</small> : out > 0 && <small className="success-inline">{formatBytes(out)} · {change >= 0 ? `${change}% lebih kecil` : `${Math.abs(change)}% lebih besar`}</small>}</div>{item.resultUrl && <button className="button secondary small" onClick={() => download(item.resultUrl, item.file.name.replace(/\.[^.]+$/, `.${extOut}`))} aria-label={`Unduh ${item.file.name}`}><ArrowDown size={15}/> Unduh</button>}</article> })}</div></>}
    </div>
  </ToolLayout>
}

function QrTool({ notify }) {
  const [text, setText] = useState('https://toolify.app'), [type, setType] = useState('URL'), [fg, setFg] = useState('#25214f'), [bg, setBg] = useState('#ffffff'), [size, setSize] = useState(320), [logo, setLogo] = useState(''), [data, setData] = useState(''), [error, setError] = useState('')
  const output = useMemo(() => { if (type === 'Wi-Fi') return `WIFI:T:WPA;S:${text.split('|')[0] || ''};P:${text.split('|')[1] || ''};;`; if (type === 'Email') return `mailto:${text}`; if (type === 'Telepon') return `tel:${text}`; return text }, [type, text])
  useEffect(() => { let live = true; const make = async () => { try { if (!output.trim()) { setData(''); return } const raw = await QRCode.toDataURL(output, { width: Number(size), margin: 2, errorCorrectionLevel: logo ? 'H' : 'M', color: { dark: `${fg}ff`, light: `${bg}ff` } }); if (!live) return; if (!logo) setData(raw); else { const image = await imageFromUrl(raw), canvas = document.createElement('canvas'); canvas.width = Number(size); canvas.height = Number(size); const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0); const mark = await imageFromUrl(logo); const side = Number(size) * .2; ctx.fillStyle = bg; ctx.fillRect((Number(size) - side) / 2 - 6, (Number(size) - side) / 2 - 6, side + 12, side + 12); ctx.drawImage(mark, (Number(size) - side) / 2, (Number(size) - side) / 2, side, side); if (live) setData(canvas.toDataURL('image/png')) } setError('') } catch { setError('Konten terlalu panjang atau tidak dapat dibuat menjadi QR code.'); setData('') } }; make(); return () => { live = false } }, [output, fg, bg, size, logo])
  const setLogoFile = async ([f]) => { if (!f) return; if (!f.type.startsWith('image/')) return setError('Logo harus berupa gambar.'); if (f.size > 4 * 1024 ** 2) return setError('Ukuran logo maksimal 4 MB.'); setLogo(await readData(f)) }
  const copy = async () => { try { await navigator.clipboard.writeText(output); notify('Konten QR berhasil disalin.') } catch { setError('Clipboard tidak tersedia di browser ini.') } }
  const downloadSvg = async () => { try { let svg = await QRCode.toString(output, { type: 'svg', width: Number(size), margin: 2, color: { dark: fg, light: bg }, errorCorrectionLevel: logo ? 'H' : 'M' }); if (logo) { const viewBox = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/), width = Number(viewBox?.[1] || 29), height = Number(viewBox?.[2] || 29), side = Math.min(width, height) * .2, x = (width - side) / 2, y = (height - side) / 2; svg = svg.replace('</svg>', `<rect x="${x - 0.55}" y="${y - 0.55}" width="${side + 1.1}" height="${side + 1.1}" rx="1" fill="${bg}"/><image href="${logo}" x="${x}" y="${y}" width="${side}" height="${side}" preserveAspectRatio="xMidYMid meet"/></svg>`) } const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' })); download(url, 'toolify-qr-code.svg'); setTimeout(() => URL.revokeObjectURL(url), 1000) } catch { setError('SVG tidak dapat dibuat.') } }
  return <ToolLayout title="QR Code Generator" desc="Buat QR code kustom dengan warna dan logo pilihan Anda." icon={QrCode}><div className="qr-layout"><div className="work-card qr-form"><div className="work-card-header"><h2>Konten QR code</h2><span className="file-support">LANGKAH 01</span></div><div className="form-field"><label>Jenis konten</label><div className="select-wrap"><select value={type} onChange={(e) => setType(e.target.value)}><option>URL</option><option>Teks</option><option>Email</option><option>Telepon</option><option>Wi-Fi</option></select><ChevronDown size={16}/></div></div><div className="form-field"><label>{type === 'Wi-Fi' ? 'Nama jaringan | kata sandi' : 'Konten'}</label>{type === 'Teks' ? <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Masukkan teks"/> : <input value={text} onChange={(e) => setText(e.target.value)} placeholder={type === 'Wi-Fi' ? 'Nama Wi-Fi|kata sandi' : 'Masukkan konten'}/>}<small>{type === 'Wi-Fi' ? 'Format: nama jaringan|kata sandi' : 'Konten ini akan disematkan ke QR code.'}</small></div><div className="form-row"><div className="form-field"><label>Warna QR</label><ColorPicker value={fg} onChange={setFg}/></div><div className="form-field"><label>Warna latar</label><ColorPicker value={bg} onChange={setBg}/></div></div><div className="form-field"><label>Ukuran QR code <strong className="value-tag">{size}px</strong></label><div className="select-wrap"><select value={size} onChange={(e) => setSize(Number(e.target.value))}><option value="192">192 × 192</option><option value="256">256 × 256</option><option value="320">320 × 320</option><option value="512">512 × 512</option><option value="1024">1024 × 1024</option></select><ChevronDown size={16}/></div></div><div className="form-field"><label>Logo di tengah <span className="optional">OPSIONAL</span></label><label className="logo-upload"><input type="file" accept="image/*" hidden onChange={(e) => setLogoFile(Array.from(e.target.files || []))}/>{logo ? <><img src={logo} alt="Logo"/> <span>Ganti logo</span><button type="button" className="remove-logo" onClick={(e) => { e.preventDefault(); setLogo('') }}><X size={14}/></button></> : <><Upload size={16}/> Tambahkan logo <small>PNG atau JPG, maks. 4 MB</small></>}</label></div><button className="text-button" onClick={() => { setType('URL'); setText('https://toolify.app'); setFg('#25214f'); setBg('#ffffff'); setSize(320); setLogo(''); setError('') }}><X size={15}/> Reset pengaturan</button></div>
    <div className="work-card qr-preview-card"><div className="work-card-header"><div><span className="file-support">LANGKAH 02</span><h2>Pratinjau langsung</h2></div><span className="live-pill"><i/> LIVE</span></div><div className="qr-preview"><div className="qr-frame" style={{background:bg}}>{data ? <img src={data} alt="QR code"/> : <QrCode size={70}/>}</div><small>Scan untuk mencoba</small></div><div className="qr-output"><span>KONTEN TERTANAM</span><p>{output || 'Masukkan konten untuk melihat QR code'}</p></div><div className="qr-actions"><button className="button primary" disabled={!data} onClick={() => download(data, 'toolify-qr-code.png')}><ArrowDown size={16}/> Unduh PNG</button><button className="button secondary" disabled={!output} onClick={downloadSvg}><FileImage size={16}/> Unduh SVG</button></div><button className="copy-button" onClick={copy}><Layers size={15}/> Salin konten QR</button>{error && <p className="error-message">{error}</p>}</div></div></ToolLayout>
}
function ColorPicker({ value, onChange }) { return <label className="color-picker"><input type="color" value={value} onChange={(e) => onChange(e.target.value)}/><span className="color-chip" style={{background:value}}/><span>{value.toUpperCase()}</span><ChevronDown size={14}/></label> }

function PdfTool({ notify }) {
  const [files, setFiles] = useState([]), [paper, setPaper] = useState('a4'), [orientation, setOrientation] = useState('portrait'), [margin, setMargin] = useState(10), [busy, setBusy] = useState(false), [error, setError] = useState('')
  const addFiles = async (incoming) => { setError(''); const valid = incoming.filter(f => /image\/(jpeg|png)$/.test(f.type)); if (valid.length !== incoming.length) setError('Beberapa file dilewati. Hanya JPG dan PNG yang didukung.'); const oversized = valid.filter(f => f.size > 25 * 1024 ** 2); if (oversized.length) setError('File maksimal 25 MB per gambar. File berukuran besar dilewati.'); const accepted = valid.filter(f => f.size <= 25 * 1024 ** 2); if (files.length + accepted.length > 30) { setError('Maksimal 30 gambar dapat digabungkan.'); return } const added = await Promise.all(accepted.map(async (file) => ({ id: `${Date.now()}-${Math.random()}`, file, url: URL.createObjectURL(file), data: await readData(file) }))); setFiles(old => [...old, ...added]) }
  const move = (idx, dir) => setFiles(old => { const next = [...old], to = idx + dir; if (to < 0 || to >= next.length) return old; [next[idx], next[to]] = [next[to], next[idx]]; return next })
  const remove = (id) => setFiles(old => { const f = old.find(x => x.id === id); if (f) URL.revokeObjectURL(f.url); return old.filter(x => x.id !== id) })
  const makePdf = async () => { if (!files.length) return; setBusy(true); setError(''); try { const images = await Promise.all(files.map(file => imageFromUrl(file.data))); const imagePageSize = (image) => { let width = image.naturalWidth * 0.264583, height = image.naturalHeight * 0.264583; if ((orientation === 'landscape' && height > width) || (orientation === 'portrait' && width > height)) [width, height] = [height, width]; return [width, height] }; const doc = new jsPDF({ orientation, unit: 'mm', format: paper === 'a4' ? 'a4' : imagePageSize(images[0]) }); for (let i = 0; i < files.length; i++) { const image = images[i]; let width, height; if (paper === 'image') { [width, height] = imagePageSize(image); if (i > 0) doc.addPage([width, height], orientation) } else { if (i > 0) doc.addPage('a4', orientation); const pageW = doc.internal.pageSize.getWidth(), pageH = doc.internal.pageSize.getHeight(), maxW = pageW - margin * 2, maxH = pageH - margin * 2, ratio = Math.min(maxW / image.naturalWidth, maxH / image.naturalHeight); width = image.naturalWidth * ratio; height = image.naturalHeight * ratio } const x = (doc.internal.pageSize.getWidth() - width) / 2, y = (doc.internal.pageSize.getHeight() - height) / 2; doc.addImage(files[i].data, files[i].file.type === 'image/png' ? 'PNG' : 'JPEG', x, y, width, height) } doc.save('toolify-gambar.pdf'); notify(`PDF berhasil dibuat dari ${files.length} gambar.`) } catch { setError('PDF gagal dibuat. Coba gunakan gambar yang lebih kecil.'); } finally { setBusy(false) } }
  return <ToolLayout title="JPG ke PDF" desc="Gabungkan gambar menjadi satu dokumen PDF dengan mudah." icon={FileText}><div className="work-card pdf-work"><div className="work-card-header"><h2>Gambar Anda <span className="count-tag">{files.length}</span></h2><span className="file-support">JPG · PNG · MAKS. 30 FILE</span></div>{!files.length && <Dropzone accept="image/jpeg,image/png" multiple onFiles={addFiles} hint="Maks. 25 MB per gambar · Hingga 30 gambar"/>}{!!files.length && <><div className="image-list">{files.map((item, i) => <div className="image-row" key={item.id}><span className="order-number">{String(i + 1).padStart(2, '0')}</span><img src={item.url} alt={item.file.name}/><div className="image-info"><b>{item.file.name}</b><small>{formatBytes(item.file.size)}</small></div><div className="order-actions"><button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Pindah ke atas"><ArrowUp size={15}/></button><button onClick={() => move(i, 1)} disabled={i === files.length - 1} aria-label="Pindah ke bawah"><ArrowDown size={15}/></button><button onClick={() => remove(item.id)} aria-label="Hapus gambar"><X size={15}/></button></div></div>)}</div><Dropzone accept="image/jpeg,image/png" multiple onFiles={addFiles} label="Tambah gambar" hint="Maks. 25 MB per gambar"/></>}
    {files.length > 0 && <><div className="settings-title"><span className="settings-icon"><Layers size={16}/></span><h3>Pengaturan halaman</h3></div><div className="pdf-settings"><div className="form-field"><label>Ukuran kertas</label><div className="select-wrap"><select value={paper} onChange={e => setPaper(e.target.value)}><option value="a4">A4</option><option value="image">Sesuai gambar</option></select><ChevronDown size={16}/></div></div><div className="form-field"><label>Orientasi</label><div className="select-wrap"><select value={orientation} onChange={e => setOrientation(e.target.value)}><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select><ChevronDown size={16}/></div></div>{paper === 'a4' && <div className="form-field"><label>Margin halaman <strong className="value-tag">{margin} mm</strong></label><input className="range-input" type="range" min="0" max="30" step="1" value={margin} onChange={e => setMargin(Number(e.target.value))}/></div>}</div><button className="button primary pdf-download" disabled={busy} onClick={makePdf}>{busy ? <><span className="spinner light"/> Membuat PDF…</> : <><FileText size={17}/> Gabungkan & unduh PDF <ArrowRight size={17}/></>}</button></>}{error && <p className="error-message">{error}</p>}</div></ToolLayout>
}

function InfoPage({ title, eyebrow, text }) { return <section className="info-page"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{text}</p><Link to="/" className="button primary">Kembali ke beranda <ArrowRight size={16}/></Link></section> }
function Footer() { return <footer><div className="footer-inner"><Link to="/" className="brand"><span className="brand-mark"><Sparkles size={18} fill="currentColor"/></span><span>toolify<span className="brand-dot">.</span></span></Link><span className="copyright">© {new Date().getFullYear()} Toolify. Dibuat untuk memudahkan.</span><div className="footer-links"><Link to="/about">Tentang</Link><Link to="/contact">Kontak</Link><Link to="/privacy-policy">Privasi</Link><Link to="/terms-of-service">Ketentuan</Link></div></div></footer> }

export default App
