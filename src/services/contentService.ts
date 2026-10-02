import { supabase } from '../lib/supabase'
import { Item } from './types'
import { gdelt, githubRepos, hackerNews, hfModels, papers } from './providers'
const jobs: Record<string, (q?: string) => Promise<Item[]>> = {
  world: q => gdelt(q || 'world affairs'),
  ai: q => hackerNews(q || 'artificial intelligence'),
  models: q => hfModels(q),
  tools: q => githubRepos(q ? `${q} in:name,description` : 'topic:ai-agent', 'AI tool'),
  engineering: q => githubRepos(q ? `${q} engineering in:name,description` : 'topic:robotics', 'Engineering'),
  research: q => papers(q || 'artificial intelligence'),
  companies: async () => [],
}
export async function list(section?: string, q?: string): Promise<Item[]> {
  const key = `nx:${section}:${q}`
  try { const c = JSON.parse(sessionStorage.getItem(key) ?? 'null'); if (c && Date.now() - c.t < 600000) return c.v } catch { /* no cache */ }
  const names = section ? (jobs[section] ? [section] : []) : ['world', 'ai', 'models', 'tools', 'research']
  const res = await Promise.allSettled(names.map(n => jobs[n](q)))
  if (res.length && res.every(r => r.status === 'rejected')) throw new Error('Could not reach the data sources')
  const v = res.flatMap(r => (r.status === 'fulfilled' ? r.value : []))
  try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), v })) } catch { /* ignore */ }
  return v
}
export async function saveBookmark(item: Item) {
  if (!supabase) throw new Error('Saving requires Supabase configuration')
  const { data: u } = await supabase.auth.getUser()
  if (!u.user) throw new Error('Sign in to save items')
  const { error } = await supabase.from('bookmarks').insert({ user_id: u.user.id, entity_type: item.kind, entity_id: item.id, title: item.title, url: item.url })
  if (error) throw new Error('Could not save item')
}
