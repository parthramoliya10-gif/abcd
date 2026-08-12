import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Save, KeyRound, SlidersHorizontal, Camera, Link2, Briefcase, Eye, EyeOff } from 'lucide-react'
import * as settingsService from '../../services/settings.service'
import { useToast } from '../../Components/ui/Toast'
import Card from '../../Components/ui/Card'
import Button from '../../Components/ui/Button'
import { Field, Input, Textarea } from '../../Components/ui/Field'


// Same frosted-glass tokens as every other glass surface in the admin (see
// .glass / --glass-* in global.css) so this page's cards read as the same
// dark, translucent, blurred panel as the Dashboard and every other page.
const CARD_GLASS = {
  background: 'var(--glass-fill)',
  border: '1px solid var(--glass-border)',
  backdropFilter: 'blur(var(--glass-blur))',
  WebkitBackdropFilter: 'blur(var(--glass-blur))',
  boxShadow: 'var(--glass-shadow)',
}

// Glassy "lit from within" field treatment — translucent white-over-teal
// fill instead of the flat ivory box, soft brass-tinted border, deeper
// rounding. Same !important-override pattern as IconInput below (Field's
// baseInput sets its classes via plain string concat, no twMerge, so
// anything meant to win has to carry !). Kept local to this page rather
// than touched in Field.jsx/Input.jsx since those are shared by every
// other form (Brands, Collections, Exhibitions, modals, …) — changing them
// there would restyle inputs app-wide, not just this "enhance settings"
// request.
const glassInputClass =
  '!rounded-2xl !border !border-white/15 !bg-white/10 !backdrop-blur-sm !text-ivory-100 !placeholder-ivory-100/40 !shadow-inner focus:!border-brass-300/60 focus:!ring-2 focus:!ring-brass-300/30 focus:!bg-white/[0.14] !transition-all'

const glassTextareaClass = `${glassInputClass} !leading-relaxed`

// Same treatment, extra left padding preserved for the icon slot.
const glassIconInputClass = `!pl-9 ${glassInputClass}`

// Gold pill CTA — rounded-full instead of the button's default corner
// radius, to echo the reference's pill-shaped send buttons. Button already
// carries the brass gradient/text via its "primary" variant, so this only
// adds shape + a touch more presence (width, weight) rather than
// re-theming color.
const pillButtonClass = '!rounded-full !px-6'


// Small rounded icon chip used next to each card's section heading — gives
// "Site settings" / "Password" an anchor point instead of plain text, using
// the same brass tones as the rest of the dark-surface UI.
function HeaderIcon({ icon: Icon }) {
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brass-300/25 to-brass-600/15 border border-brass-300/20 text-brass-300">
      <Icon size={16} />
    </span>
  )
}


// Leading-icon variant of Input — glass-styled to match the rest of this
// page's fields, with the icon sitting inside the translucent fill.
function IconInput({ icon: Icon, className, ...props }) {
  return (
    <div className="relative">
      <Icon size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brass-300/60 z-10" />
      <Input className={`${glassIconInputClass} ${className || ''}`} {...props} />
    </div>
  )
}

// Password field with a show/hide toggle — plain type="password" gave no
// way to check what you typed before submitting. `visible` flips the
// input's type between 'password' and 'text'; extra right padding (!pr-10)
// keeps typed text from running under the toggle button.
function PasswordInput({ className, ...props }) {
  const [visible, setVisible] = useState(false)
  const VisIcon = visible ? EyeOff : Eye
  return (
    <div className="relative">
      <Input type={visible ? 'text' : 'password'} className={`!pr-10 ${glassInputClass} ${className || ''}`} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-brass-300/60 hover:text-brass-300 transition-colors"
      >
        <VisIcon size={15} />
      </button>
    </div>
  )
}


export default function SettingsPage() {
  const { notify } = useToast()
  const [settings, setSettings] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState('')


  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError, setPwError] = useState('')


  const panelRef = useRef(null)


  useEffect(() => {
    settingsService.getSettings().then(setSettings).catch((err) => {
      setLoadError(err.message || 'Failed to load settings.')
      notify(err.message || 'Failed to load settings.', { tone: 'error' })
    })
  }, [notify])


  // Depend on `!!settings` (true/false) rather than `settings` itself.
  // settings is a new object on every keystroke (each onChange calls
  // setSettings({ ...settings, field: value })), so depending on the
  // object directly replayed this fade/slide-in animation from y:8 on
  // every character typed — that's what was causing the fields to
  // "jiggle" while entering a value. Booleanizing the dependency means
  // this only re-runs the one time settings flips from null to loaded.
  useEffect(() => {
    if (settings && panelRef.current) {
      gsap.fromTo(panelRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' })
    }
  }, [!!settings])


  async function handleSaveSettings(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await settingsService.updateSettings(settings)
      setSettings(updated)
      notify('Settings saved.')
    } catch (err) {
      notify(err.message || 'Something went wrong.', { tone: 'error' })
    } finally {
      setSaving(false)
    }
  }


  async function handleChangePassword(e) {
    e.preventDefault()
    setPwError('')
    if (pw.newPassword !== pw.confirm) {
      setPwError('New password and confirmation do not match.')
      return
    }
    setPwSaving(true)
    try {
      await settingsService.changePassword(pw)
      notify('Password updated.')
      setPw({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      setPwError(err.message || 'Could not update password.')
    } finally {
      setPwSaving(false)
    }
  }


  if (!settings && loadError) {
    return (
      <div className="rounded-lg border border-rose/30 bg-rose/5 px-4 py-3 text-sm text-rose">
        Couldn't load settings: {loadError}
      </div>
    )
  }
  if (!settings) return <div className="text-sm text-ink-400">Loading…</div>


  return (
    <div className="space-y-5">
      {/* Site settings and Password used to live behind a tab switcher,
          which left this page nearly empty on wide screens since only one
          card showed at a time inside a max-w-2xl column. Both now render
          together in a two-column layout instead — no more blank space,
          and the password box no longer feels like it's on "another page". */}
      <div ref={panelRef} className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <Card glass className="p-5 sm:p-6 dark-surface" style={CARD_GLASS}>
          <div className="mb-5 flex items-center gap-2.5">
            <HeaderIcon icon={SlidersHorizontal} />
            <h2 className="font-display text-base text-ink-900">Site settings</h2>
          </div>
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <Field label="Site name" required>
              <Input className={glassInputClass} value={settings.site_name} onChange={(e) => setSettings({ ...settings, site_name: e.target.value })} required />
            </Field>
            <Field label="Contact email" required>
              <Input className={glassInputClass} type="email" value={settings.contact_email} onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })} required />
            </Field>
            <Field label="Contact phone">
              <Input className={glassInputClass} value={settings.contact_phone} onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })} />
            </Field>
            <Field label="Address">
              <Textarea className={glassTextareaClass} rows={3} value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
            </Field>


            {/* Hairline divider + eyebrow label so the social row reads as
                its own labeled group instead of blending into the form. */}
            <div className="pt-1">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-brass-300/70">
                  Social links
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Instagram">
                  {/* lucide-react dropped brand/logo icons in this version
                      — Camera used as a generic stand-in. */}
                  <IconInput
                    icon={Camera}
                    value={settings.social.instagram}
                    onChange={(e) => setSettings({ ...settings, social: { ...settings.social, instagram: e.target.value } })}
                    placeholder="https://…"
                  />
                </Field>
                <Field label="Facebook">
                  <IconInput
                    icon={Link2}
                    value={settings.social.facebook}
                    onChange={(e) => setSettings({ ...settings, social: { ...settings.social, facebook: e.target.value } })}
                    placeholder="https://…"
                  />
                </Field>
                <Field label="LinkedIn">
                  <IconInput
                    icon={Briefcase}
                    value={settings.social.linkedin}
                    onChange={(e) => setSettings({ ...settings, social: { ...settings.social, linkedin: e.target.value } })}
                    placeholder="https://…"
                  />
                </Field>
              </div>
            </div>


            <div className="pt-2">
              <Button type="submit" icon={Save} loading={saving} className={pillButtonClass}>Save settings</Button>
            </div>
          </form>
        </Card>


        <Card glass className="p-5 sm:p-6 dark-surface" style={CARD_GLASS}>
          <div className="mb-5 flex items-center gap-2.5">
            <HeaderIcon icon={KeyRound} />
            <h2 className="font-display text-base text-ink-900">Password</h2>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Field label="Current password" required>
              <PasswordInput value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required />
            </Field>
            <Field label="New password" required hint="At least 8 characters.">
              <PasswordInput value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required minLength={8} />
            </Field>
            <Field label="Confirm new password" required error={pwError}>
              <PasswordInput value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required minLength={8} />
            </Field>
            <div className="pt-2">
              <Button type="submit" icon={KeyRound} loading={pwSaving} className={pillButtonClass}>Update password</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}