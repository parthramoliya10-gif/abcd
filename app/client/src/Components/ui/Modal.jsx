import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { X } from 'lucide-react'
import { classNames } from '../../utils/helpers'

// Same frosted-glass tokens as every other glass surface in the admin (see
// .glass-strong / --glass-* in global.css) so modals/dialogs read as the
// same dark, translucent, blurred panel as the rest of the app instead of
// a flat solid gradient.
const CARD_GLASS = {
  background: 'var(--glass-fill-strong)',
  border: '1px solid var(--glass-border)',
  backdropFilter: 'blur(var(--glass-blur))',
  WebkitBackdropFilter: 'blur(var(--glass-blur))',
}

export default function Modal({ open, onClose, title, subtitle, icon: Icon, children, footer, size = 'md' }) {
  const overlayRef = useRef(null)
  const panelRef = useRef(null)

  // Keep the latest onClose in a ref so the animation effect below doesn't
  // need it in its dependency array. Without this, every re-render of the
  // parent (e.g. typing into a form field inside the modal) creates a new
  // onClose function reference, which re-triggers the entrance animation
  // on every keystroke — the "jiggling" effect.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!open) return
    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' })
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 18, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: 'power3.out' }
      )
    })
    const onKey = (e) => e.key === 'Escape' && onCloseRef.current?.()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      ctx.revert()
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open]) // ← only 'open' now, not 'onClose'

  if (!open) return null

  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/50 backdrop-blur-[2px] p-4"
      onClick={(e) => e.target === overlayRef.current && onCloseRef.current?.()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={classNames(
          'w-full rounded-card dark-surface max-h-[90vh] flex flex-col',
          sizes[size]
        )}
        style={{
          ...CARD_GLASS,
          // Layered shadow instead of a flat shadow-xl: a large soft dark
          // shadow for lift/depth, a tighter contact shadow close to the
          // panel, and a faint brass ring so the edge reads as glowing
          // rather than just dark — together these read as "floating"
          // above the backdrop instead of sitting flush against it.
          boxShadow:
            '0 32px 70px -12px rgba(5,61,64,0.55), 0 10px 28px -8px rgba(0,0,0,0.45), 0 0 0 1px rgba(216,194,135,0.18)',
        }}
      >
        {/* Header: py-5 → py-3.5 and the icon/title gap-3 → gap-2.5. The
            header was taking up a disproportionate amount of the modal's
            vertical space relative to its content (one line of title +
            one line of subtitle), so this trims the empty air above/below
            the text without touching icon/close-button hit targets. */}
        <div className="flex items-start justify-between gap-4 px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            {/* Optional circular icon badge, same treatment as
                SettingsPage's header icon — pass an `icon` prop (a
                lucide-react component) from the page that opens this
                modal to get it; omitted entirely when no icon is given
                so existing modals without one are unaffected. */}
            {Icon && (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brass-300/40 bg-white/5 text-brass-300">
                <Icon size={16} strokeWidth={2} />
              </span>
            )}
            <div>
              <h2 id="modal-title" className="font-display text-lg font-medium text-ivory-100">
                {title}
              </h2>
              {subtitle && <p className="mt-0.5 text-sm text-ivory-100/50">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-xl p-1.5 text-ivory-100/50 hover:text-ivory-100 hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {/* Glass field treatment (same look as SettingsPage's inputs),
            applied here instead of per-page: every page's modal form uses
            the shared Field.jsx Input/Select/Textarea, which default to a
            flat ivory box (baseInput in Field.jsx). Rather than passing a
            glass className into every <Input> on every page individually,
            these [&_input]/[&_textarea]/[&_select] descendant selectors
            style any of those elements rendered inside this modal's body —
            one change here cascades to Brands, Collections, Exhibitions,
            Inquiries' view modal, etc. all at once. ! (important) is
            required to beat Field.jsx's baseInput classes, same reasoning
            as IconInput/PasswordInput's overrides on SettingsPage.

            The [&_.text-ink-*] rules below do the same for Field.jsx's
            label/hint text: labels render with a hardcoded text-ink-600
            class and hints/errors with text-ink-400 (see Field.jsx) — class
            selectors here catch those wherever they land in the tree,
            without needing Field.jsx itself to change (it's also used by
            every non-modal form, like Brands' table filters).

            Body padding trimmed py-5 → py-4 to match the tighter header;
            the [&>form]:space-y-* override below also tightens the gap
            *between* fields for any page whose form uses the common
            `space-y-4`/`space-y-5` wrapper class, without needing to edit
            every page individually — pages using a different wrapper are
            unaffected. */}
        <div
          className={classNames(
            'px-6 py-4 overflow-y-auto',
            '[&>form.space-y-4]:!space-y-3 [&>form.space-y-5]:!space-y-3',
            '[&_input]:!rounded-2xl [&_input]:!border [&_input]:!border-white/15 [&_input]:!bg-white/10 [&_input]:!backdrop-blur-sm [&_input]:!text-ivory-100 [&_input]:!placeholder-ivory-100/40 [&_input]:!shadow-inner [&_input]:!transition-all',
            '[&_input:focus]:!border-brass-300/60 [&_input:focus]:!ring-2 [&_input:focus]:!ring-brass-300/30 [&_input:focus]:!bg-white/[0.14]',
            '[&_textarea]:!rounded-2xl [&_textarea]:!border [&_textarea]:!border-white/15 [&_textarea]:!bg-white/10 [&_textarea]:!backdrop-blur-sm [&_textarea]:!text-ivory-100 [&_textarea]:!placeholder-ivory-100/40 [&_textarea]:!shadow-inner [&_textarea]:!transition-all',
            '[&_textarea:focus]:!border-brass-300/60 [&_textarea:focus]:!ring-2 [&_textarea:focus]:!ring-brass-300/30 [&_textarea:focus]:!bg-white/[0.14]',
            '[&_select]:!rounded-2xl [&_select]:!border [&_select]:!border-white/15 [&_select]:!bg-white/10 [&_select]:!backdrop-blur-sm [&_select]:!text-ivory-100 [&_select]:!transition-all',
            '[&_select:focus]:!border-brass-300/60 [&_select:focus]:!ring-2 [&_select:focus]:!ring-brass-300/30',
            '[&_.text-ink-600]:!text-brass-300/80 [&_.text-ink-400]:!text-ivory-100/50 [&_.text-ink-900]:!text-ivory-100',
            // Custom scrollbar for this panel — replaces the browser's
            // default white track / gray thumb with a transparent track
            // and a translucent brass thumb so it matches the modal's
            // glass theme instead of standing out as a plain OS widget.
            '[&::-webkit-scrollbar]:w-1',
            '[&::-webkit-scrollbar-track]:bg-transparent',
            '[&::-webkit-scrollbar-thumb]:bg-brass-300/40',
            '[&::-webkit-scrollbar-thumb]:rounded-full',
            '[&::-webkit-scrollbar-thumb:hover]:bg-brass-300/60'
          )}
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#D8C28766 transparent' }}
        >
          {children}
        </div>
        {footer && <div className="px-6 py-3.5 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}