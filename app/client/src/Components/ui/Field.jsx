import { classNames } from '../../utils/helpers'

// text-ink-900 resolves to #0E2B26 — technically a palette color, but dark
// enough to read as plain black on screen. Swapped for text-emerald-600
// (#0E4238) to match the same fix already applied to page headings in
// AdminLayout.jsx, so form fields and the "All statuses" filter select
// read as on-brand teal instead of black.
const baseInput =
  'w-full rounded-md border border-ink-100 bg-ivory-100 px-3.5 py-2.5 text-sm text-emerald-600 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brass-500/40 focus:border-brass-500 transition-colors'

export function Field({ label, hint, error, required, children, className }) {
  return (
    <label className={classNames('block', className)}>
      {label && (
        <span className="mb-1.5 flex items-baseline gap-1 text-xs font-medium text-ink-600">
          {label}
          {required && <span className="text-rose">*</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-ink-400">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-rose">{error}</span>}
    </label>
  )
}

export function Input({ className, ...props }) {
  return <input className={classNames(baseInput, className)} {...props} />
}

export function Textarea({ className, rows = 4, ...props }) {
  return <textarea rows={rows} className={classNames(baseInput, 'resize-y', className)} {...props} />
}

export function Select({ className, children, ...props }) {
  return (
    <select className={classNames(baseInput, 'appearance-none bg-no-repeat', className)} {...props}>
      {children}
    </select>
  )
}