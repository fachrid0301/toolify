export default function ProgressBar({ value }) {
  return <div className="ai-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax={100} aria-valuenow={value ?? undefined}>
    {value == null ? <span className="ai-progress-indeterminate" /> : <span style={{ width: `${value}%` }} />}
  </div>
}
