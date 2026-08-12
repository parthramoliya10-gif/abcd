import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { SidebarDesktop, SidebarMobile } from './Sidebar'
import Topbar from './Topbar'
import { classNames } from '../../utils/helpers'

const TITLES = {
  '/admin/dashboard': ['Dashboard', 'Overview of collections, brands, exhibitions & inquiries'],
  '/admin/collections': ['Collections', 'Manage jewellery collections across all brands'],
  '/admin/brands': ['Brands', 'Manage the brand portfolio'],
  '/admin/exhibitions': ['Exhibitions', 'Manage exhibition listings and galleries'],
  '/admin/inquiries': ['Inquiries', 'Review and action business inquiries'],
  '/admin/seo': ['SEO', 'Per-page meta title, description & OG image'],
  '/admin/settings': ['Settings', 'Site settings, contact details & password'],
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  // Mirrors the desktop sidebar's hover-expand state so the content column
  // can shift over to match — see onExpandChange passed to SidebarDesktop.
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const location = useLocation()
  const mainRef = useRef(null)

  const [title, subtitle] = TITLES[location.pathname] || ['Admin', '']

  useEffect(() => {
    setMobileOpen(false)
    if (mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      )
    }
  }, [location.pathname])

  return (
    <div className="admin-theme min-h-screen dashboard-bg">
      <SidebarDesktop onExpandChange={setSidebarExpanded} />
      <SidebarMobile open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div
        className={classNames(
          'transition-[padding-left] duration-500 ease-in-out',
          // Matches Sidebar.jsx's collapsed (60px) / expanded (200px) rail
          // width plus its left-3 offset and a little breathing room —
          // keep these two files in sync if the rail width ever changes.
          sidebarExpanded ? 'lg:pl-[236px]' : 'lg:pl-[84px]'
        )}
      >
        {/* title/subtitle no longer passed to Topbar — they render below,
            at the top of the page content instead, so each page shows its
            own heading in-page rather than in the header bar. */}
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        {/* Was `max-w-[1400px]` with no `mx-auto` — on any screen wider
            than 1400px the content stayed pinned to the left and left a
            dead gap on the right (that's the bug from the screenshot).
            `w-full` lets it fill the available width; keeping a generous
            `max-w` only kicks in on ultra-wide monitors, and `mx-auto`
            centers it if it ever does cap out, instead of leaving the
            gap on one side only. */}
        <main ref={mainRef} className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 py-6">
          {/* dark-surface remaps text-ink-* to light brass/ivory tones (see
              global.css) so this heading reads correctly against the dark
              glass background used across every admin route. */}
          <div className="mb-6 dark-surface">
            <h1 className="font-display font-semibold text-2xl text-ink-900">{title}</h1>
            {subtitle && <p className="text-sm text-ink-400 mt-1">{subtitle}</p>}
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}