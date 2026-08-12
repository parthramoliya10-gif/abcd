import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { gsap } from 'gsap'
import {
  LayoutDashboard, Gem, Building2, CalendarDays, MessagesSquare, Search, Settings, X, LogOut,
} from 'lucide-react'
import { classNames, initials } from '../../utils/helpers'
import { useAuth } from '../../hooks/useAuth'

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/collections', label: 'Collections', icon: Gem },
  { to: '/admin/brands', label: 'Brands', icon: Building2 },
  { to: '/admin/exhibitions', label: 'Exhibitions', icon: CalendarDays },
  { to: '/admin/inquiries', label: 'Inquiries', icon: MessagesSquare },
  { to: '/admin/seo', label: 'SEO', icon: Search },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

// Glass treatment — same shared tokens as every other glass surface in the
// admin (see .glass / --glass-* in global.css) so the sidebar floats as
// frosted glass over the dark gradient background on every admin route.
const SIDEBAR_GLASS = {
  background: 'var(--glass-fill-strong)',
  backdropFilter: 'blur(var(--glass-blur))',
  WebkitBackdropFilter: 'blur(var(--glass-blur))',
  border: '1px solid var(--glass-border)',
}

function NavItems({ onNavigate, collapsed }) {
  return (
    <nav className="flex-1 px-2.5 py-2 space-y-1.5 overflow-y-auto overflow-x-hidden">
      {NAV.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          title={collapsed ? label : undefined}
          className={({ isActive }) =>
            classNames(
              'group relative flex h-10 items-center rounded-full text-sm transition-all duration-500',
              collapsed
                ? 'w-9 justify-center mx-auto px-0 gap-0'
                : 'w-full justify-start px-3.5 gap-3',
              isActive
                ? 'bg-brass-500/20 text-brass-300 font-medium'
                : 'text-ivory-100/70 hover:bg-white/10 hover:text-ivory-100'
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={17} strokeWidth={1.75} className="shrink-0" />
              <span
                className={classNames(
                  'whitespace-nowrap overflow-hidden transition-all duration-300',
                  collapsed ? 'max-w-0 opacity-0' : 'max-w-[160px] opacity-100 delay-150'
                )}
              >
                {label}
              </span>
              {isActive && !collapsed && (
                <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-brass-300" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

// Desktop rail: floating rounded panel (1.75rem radius, teal gradient —
// matches the reference build), collapsed to icon-only by default,
// expands to 200px on hover. Overlays content (fixed position).
//
// onExpandChange: lets AdminLayout know when the rail is hovered/expanded
// so the main content area can shift its left padding to match — see
// AdminLayout.jsx. NOTE: if you change the collapsed/expanded widths
// below, update AdminLayout's lg:pl-[84px] / lg:pl-[236px] to match
// (left-3 offset + this width + the same ~12px/24px breathing room).
export function SidebarDesktop({ onExpandChange }) {
  const [hovered, setHovered] = useState(false)
  const asideRef = useRef(null)
  const collapsed = !hovered

  useEffect(() => {
    if (!asideRef.current) return
    gsap.to(asideRef.current, {
      width: hovered ? 200 : 60,
      // Half of the collapsed width, so it's still a perfect pill/circle
      // -ended capsule at rest — but close enough to the expanded 28px
      // that the radius glides smoothly alongside the width during the
      // tween instead of the browser clamping it to a half-circle for
      // most of the animation.
      borderRadius: hovered ? '28px' : '30px',
      duration: 0.6,
      ease: 'power2.inOut',
    })
  }, [hovered])

  useEffect(() => {
    onExpandChange?.(hovered)
  }, [hovered, onExpandChange])

  return (
    <aside
      ref={asideRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 60,
        borderRadius: '30px',
        ...SIDEBAR_GLASS,
      }}
      className="hidden lg:flex fixed inset-y-3 left-3 flex-col text-ivory-100 z-40 overflow-hidden shadow-2xl"
    >
      <Brand collapsed={collapsed} />
      <NavItems collapsed={collapsed} />
      <Footer collapsed={collapsed} />
    </aside>
  )
}

export function SidebarMobile({ open, onClose }) {
  return (
    <>
      <div
        className={classNames(
          'fixed inset-0 z-50 bg-ink-900/50 transition-opacity lg:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      <aside
        style={SIDEBAR_GLASS}
        className={classNames(
          'fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col text-ivory-100 transition-transform duration-300 lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-5 pt-5">
          <BrandMark />
          <button onClick={onClose} className="text-ivory-100/70 hover:text-ivory-100" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <div className="h-3" />
        <NavItems onNavigate={onClose} collapsed={false} />
        <Footer collapsed={false} />
      </aside>
    </>
  )
}

function BrandMark({ collapsed }) {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src="/images/PROMISE_LOGO_skin_icon_only.webp"
        alt="Promise Jewel"
        className="h-8 w-8 shrink-0 object-contain"
      />
      {!collapsed && (
        <div className="leading-tight whitespace-nowrap">
          <p className="font-display text-base text-ivory-100">Promise Jewel</p>
          <p className="text-[10px] uppercase tracking-wider text-ivory-100/50">Admin</p>
        </div>
      )}
    </div>
  )
}

function Brand({ collapsed }) {
  return (
    <div className="px-3 pt-5 pb-4">
      <BrandMark collapsed={collapsed} />
    </div>
  )
}

// Admin profile block, pinned to the bottom of the rail.
// Collapsed: just the avatar circle (name shows on hover via title tooltip).
// Expanded: avatar + name + email + a sign-out action.
function Footer({ collapsed }) {
  const { user, logout } = useAuth()
  const name = user?.name || 'Admin'
  const email = user?.email || ''

  if (collapsed) {
    return (
      <div className="px-0 py-3 flex justify-center">
        <div
          title={name}
          className="h-8 w-8 shrink-0 rounded-full bg-brass-500/20 text-brass-200 flex items-center justify-center text-xs font-medium"
        >
          {initials(name) || 'A'}
        </div>
      </div>
    )
  }

  return (
    <div className="px-3 py-4">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 shrink-0 rounded-full bg-brass-500/20 text-brass-200 flex items-center justify-center text-xs font-medium">
          {initials(name) || 'A'}
        </div>
        <div className="min-w-0 leading-tight flex-1">
          <p className="truncate text-sm text-ivory-100 font-medium">{name}</p>
          {email && <p className="truncate text-[11px] text-ivory-100/50">{email}</p>}
        </div>
        <button
          onClick={logout}
          title="Sign out"
          className="shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-ivory-100/50 hover:text-ivory-100 hover:bg-white/10 transition-colors"
        >
          <LogOut size={14} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  )
}