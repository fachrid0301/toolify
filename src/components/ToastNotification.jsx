import { Check, CircleAlert } from 'lucide-react'

export default function ToastNotification({ message, type = 'success' }) {
  if (!message) return null
  const Icon = type === 'error' ? CircleAlert : Check
  return <div className={`toast ${type === 'error' ? 'toast-error' : ''}`} role="status"><Icon size={18} />{message}</div>
}
