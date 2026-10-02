// Scheduled ingestion: fetch active RSS sources, normalize, dedupe by canonical URL. Service role is server-side only.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim()
const canon = (u: string) => { const x = new URL(u); x.hash = ''; ['utm_source','utm_medium','utm_campaign'].forEach(p => x.searchParams.delete(p)); return x.toString() }
Deno.serve(async () => {
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: sources } = await db.from('sources').select('*').eq('active', true).eq('type', 'rss')
  let added = 0
  for (const s of sources ?? []) {
    try {
      const xml = await (await fetch(s.feed_url, { headers: { 'User-Agent': 'NexoraBot/1.0' } })).text()
      for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
        const f = (t: string) => m[1].match(new RegExp(`<${t}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${t}>`))?.[1]?.trim()
        const title = f('title'), link = f('link'); if (!title || !link) continue
        const pd = f('pubDate')
        const { error } = await db.from('articles').upsert({ source_id: s.id, title, original_title: title, title_norm: norm(title), source_url: link, canonical_url: canon(link), published_at: pd ? new Date(pd).toISOString() : null }, { onConflict: 'canonical_url', ignoreDuplicates: true })
        if (!error) added++
      }
      await db.from('sources').update({ last_fetched_at: new Date().toISOString() }).eq('id', s.id)
    } catch (_) { /* skip failing source */ }
  }
  return new Response(JSON.stringify({ added }), { headers: { 'Content-Type': 'application/json' } })
})
