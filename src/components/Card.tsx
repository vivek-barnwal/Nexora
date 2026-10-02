import { Bookmark } from 'lucide-react'
import { Item } from '../services/types'
import { saveBookmark } from '../services/contentService'
export default function Card({ item }: { item: Item }) {
  return (
    <article className="rounded-lg border border-slate-200 dark:border-line bg-white dark:bg-panel p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{item.category}</span>
      </div>
      <h3 className="font-bold leading-snug"><a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-signal">{item.title}</a></h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">{item.summary}</p>
      <div className="mt-auto flex items-center justify-between pt-2 text-xs text-slate-500">
        <span>{item.source} · {item.date.slice(0, 10)}</span>
        <button aria-label={`Bookmark ${item.title}`} className="p-1 hover:text-signal focus-visible:outline outline-signal"
          onClick={() => saveBookmark(item).catch(e => alert(e.message))}><Bookmark size={16} /></button>
      </div>
    </article>)
}
