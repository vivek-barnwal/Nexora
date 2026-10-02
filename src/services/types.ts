export type Kind = 'article' | 'model' | 'tool' | 'company' | 'research'
export interface Item { id: string; kind: Kind; title: string; summary: string; category: string; source: string; url: string; date: string; tags: string[] }
