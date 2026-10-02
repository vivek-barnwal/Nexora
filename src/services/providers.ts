// Live, keyless public APIs. Every field shown comes from the API response; nothing is generated.
import { Item } from './types'
const j = async (u: string) => { const r = await fetch(u); if (!r.ok) throw new Error(String(r.status)); return r.json() }
const e = encodeURIComponent
/* eslint-disable @typescript-eslint/no-explicit-any */
export const hackerNews = async (q: string): Promise<Item[]> => {
  const d = await j(`https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage=24&query=${e(q)}`)
  return d.hits.filter((h: any) => h.title).map((h: any): Item => ({ id: 'hn' + h.objectID, kind: 'article', title: h.title, category: 'AI',
    summary: `${h.points ?? 0} points, ${h.num_comments ?? 0} comments on Hacker News.`, source: 'Hacker News',
    url: h.url ?? `https://news.ycombinator.com/item?id=${h.objectID}`, date: h.created_at, tags: [] }))
}
export const gdelt = async (q: string): Promise<Item[]> => {
  const d = await j(`https://api.gdeltproject.org/api/v2/doc/doc?mode=artlist&format=json&sort=datedesc&maxrecords=24&query=${e(q + ' sourcelang:english')}`)
  return (d.articles ?? []).map((a: any): Item => { const s: string = a.seendate
    return { id: 'gd' + a.url, kind: 'article', title: a.title, category: 'World', summary: `Reported by ${a.domain}${a.sourcecountry ? ` (${a.sourcecountry})` : ''}. Open the source for details.`,
      source: a.domain, url: a.url, date: `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T${s.slice(9, 11)}:${s.slice(11, 13)}:${s.slice(13, 15)}Z`, tags: [] } })
}
export const hfModels = async (q?: string): Promise<Item[]> => {
  const d = await j(`https://huggingface.co/api/models?sort=trendingScore&limit=24${q ? `&search=${e(q)}` : ''}`)
  return d.map((m: any): Item => ({ id: 'hf' + m.id, kind: 'model', title: m.id, category: m.pipeline_tag ?? 'Model',
    summary: `${m.downloads?.toLocaleString() ?? 'n/a'} downloads, ${m.likes ?? 0} likes on Hugging Face.`, source: 'Hugging Face',
    url: `https://huggingface.co/${m.id}`, date: m.createdAt ?? '', tags: (m.tags ?? []).slice(0, 4) }))
}
export const githubRepos = async (q: string, category: string): Promise<Item[]> => {
  const d = await j(`https://api.github.com/search/repositories?sort=stars&per_page=24&q=${e(q)}`)
  return d.items.map((r: any): Item => ({ id: 'gh' + r.id, kind: 'tool', title: r.full_name, category, summary: r.description ?? 'No description provided.',
    source: `GitHub · ${r.stargazers_count.toLocaleString()} stars`, url: r.html_url, date: r.pushed_at, tags: (r.topics ?? []).slice(0, 4) }))
}
export const papers = async (q: string): Promise<Item[]> => {
  const d = await j(`https://api.semanticscholar.org/graph/v1/paper/search?limit=24&fields=title,abstract,url,publicationDate,authors&query=${e(q)}`)
  return (d.data ?? []).map((p: any): Item => ({ id: 'ss' + p.paperId, kind: 'research', title: p.title, category: 'Research',
    summary: (p.abstract ?? 'No abstract available.').slice(0, 280), source: `Semantic Scholar · ${(p.authors ?? []).slice(0, 2).map((a: any) => a.name).join(', ')}`,
    url: p.url, date: p.publicationDate ?? '', tags: [] }))
}
