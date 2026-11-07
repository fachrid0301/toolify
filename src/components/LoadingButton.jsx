import { LoaderCircle } from 'lucide-react'

export default function LoadingButton({ loading, children, onClick, disabled, className = 'button primary small' }) {
  return <button type="button" className={className} onClick={onClick} disabled={disabled || loading}>
    {loading ? <><LoaderCircle className="ai-spin" size={15} /> Downloading...</> : children}
  </button>
}
