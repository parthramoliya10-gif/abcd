import { classNames } from '../../utils/helpers'

const toneClasses = {
  emerald: 'bg-emerald/10 text-emerald border-emerald/20',
  brass: 'bg-brass-100 text-brass-700 border-brass-300/60',
  rose: 'bg-rose/10 text-rose border-rose/20',
  ink: 'bg-ink-50 text-ink-600 border-ink-100',
}

// Same tones, re-tuned for the teal gradient cards — the light-mode
// versions above are too close in value to the dark teal to read well,
// so these use translucent-white chips with lighter tints instead.
const darkToneClasses = {
  emerald: 'bg-white/10 text-[#8FE0C4] border-white/15',
  brass: 'bg-brass-300/15 text-brass-300 border-brass-300/30',
  rose: 'bg-white/10 text-[#E7A6B6] border-white/15',
  ink: 'bg-white/10 text-ivory-100/70 border-white/15',
}

const labels = {
  published: 'Published', draft: 'Draft', active: 'Active', inactive: 'Inactive',
  upcoming: 'Upcoming', past: 'Past', new: 'New', in_progress: 'In progress', resolved: 'Resolved',
}

export default function Badge({ tone = 'ink', dark = false, children, className }) {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide px-2.5 py-1 rounded-full border',
        (dark ? darkToneClasses : toneClasses)[tone],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[children] || children}
    </span>
  )
}
