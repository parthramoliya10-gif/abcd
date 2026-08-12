import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

// Every destructive action in the admin routes through this — the planning
// doc's risk register calls out no-RBAC-in-v1 as a reason to require
// confirmation before anything gets deleted.
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Delete',
  loading = false,
  tone = 'danger',
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose/10 text-rose">
          <AlertTriangle size={18} />
        </div>
        <p className="text-sm text-ink-600 leading-relaxed">{description}</p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        <Button variant={tone} size="sm" loading={loading} onClick={onConfirm}
          className={tone === 'danger' ? 'bg-[#5B2430] text-white hover:bg-[#4A1D27] border-transparent' : ''}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}