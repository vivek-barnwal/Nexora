import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { list } from '../services/contentService'
import { Item} from '../services/types'
import Card from '../components/Card'
export default function Listing({ home }: { home?: boolean }) {
  const { pathname } = useLocation(); const [sp] = useSearchParams()
  const q = sp.get('q') ?? undefined
  const section = pathname === '/' || pathname === '/search' ? undefined : pathname.slice(1)
  const [items, setItems] = useState<Item[] | null>(null); const [err, setErr] = useState('')
  useEffect(() => { setItems(null); setErr(''); list(section, q).then(setItems).catch(e => setErr(e.message)) }, [section, q])
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {home && <section className="py-10"><h1 className="text-4xl md:text-5xl font-bold max-w-2xl">Understand what is happening. Discover what is emerging.</h1>
        <p className="mt-4 max-w-xl text-slate-500">Explore world affairs, AI, engineering innovation, research, and emerging technology in one platform.</p></section>}
      {err ? <p role="alert">{err}. Try again shortly.</p> : !items ? <p>Loading…</p> : items.length === 0 ? <p>No results. Try a broader search.</p> :
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map(i => <Card key={i.id} item={i} />)}</div>}
    </main>)
}
