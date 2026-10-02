import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Moon, Search } from 'lucide-react'
import { useState } from 'react'
export const SECTIONS = [['World','article'],['AI','article'],['Models','model'],['Tools','tool'],['Engineering','tool'],['Research','research'],['Companies','company']] as const
export default function Navbar() {
  const nav = useNavigate(); const [q, setQ] = useState('')
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 dark:border-line bg-white/90 dark:bg-ink/90 backdrop-blur">
      <div className="mx-auto max-w-6xl flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link to="/" className="font-display text-xl font-bold tracking-tight">NEXORA<span className="text-signal">.</span></Link>
        <nav aria-label="Primary" className="order-3 md:order-none flex gap-4 overflow-x-auto text-sm w-full md:w-auto">
          {SECTIONS.map(([s]) => <NavLink key={s} to={`/${s.toLowerCase()}`} className={({ isActive }) => isActive ? 'text-signal' : 'text-slate-500 hover:text-signal'}>{s}</NavLink>)}
        </nav>
        <form role="search" className="ml-auto flex items-center gap-2 rounded border border-line px-2" onSubmit={e => { e.preventDefault(); nav(`/search?q=${encodeURIComponent(q)}`) }}>
          <Search size={14} /><input aria-label="Search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search" className="bg-transparent py-1 text-sm outline-none w-28 sm:w-48" />
        </form>
        <button aria-label="Toggle theme" onClick={() => document.documentElement.classList.toggle('dark')}><Moon size={16} /></button>
      </div>
    </header>)
}
