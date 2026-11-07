import { LoaderCircle } from 'lucide-react'
import ProgressBar from './ProgressBar.jsx'

export default function LoadingOverlay({ title, detail, progress }) {
  return <div className="ai-processing" role="status" aria-live="polite"><LoaderCircle className="ai-spin" size={22} /><div><b>{title}</b><small>{detail}</small><ProgressBar value={progress} /></div>{progress != null && <strong>{progress}%</strong>}</div>
}
