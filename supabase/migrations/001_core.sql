create extension if not exists pgcrypto;
create table profiles(id uuid primary key references auth.users on delete cascade, name text, avatar_url text, role text not null default 'user' check (role in ('user','admin')), interests text[] default '{}', created_at timestamptz default now(), updated_at timestamptz default now());
create table sources(id uuid primary key default gen_random_uuid(), name text not null, url text not null unique, type text not null check (type in ('rss','api','manual')), country text, reliability text, feed_url text, active boolean default true, last_fetched_at timestamptz, created_at timestamptz default now(), updated_at timestamptz default now());
create table events(id uuid primary key default gen_random_uuid(), title text not null, category text, created_at timestamptz default now(), updated_at timestamptz default now());
create table articles(id uuid primary key default gen_random_uuid(), source_id uuid references sources, event_id uuid references events, title text not null, original_title text, summary text, category text, source_url text not null, canonical_url text not null unique, title_norm text, entities text[] default '{}', tags text[] default '{}', published_at timestamptz, retrieved_at timestamptz default now(), created_at timestamptz default now(), updated_at timestamptz default now(),
  search tsvector generated always as (to_tsvector('english', coalesce(title,'')||' '||coalesce(summary,''))) stored);
create index on articles using gin(search); create index on articles(published_at desc); create index on articles(title_norm); create index on articles(event_id);
create table ai_models(id uuid primary key default gen_random_uuid(), name text not null unique, developer text, release_date date, summary text, spec jsonb default '{}', docs_url text, created_at timestamptz default now(), updated_at timestamptz default now(), search tsvector generated always as (to_tsvector('english', coalesce(name,'')||' '||coalesce(summary,''))) stored);
create table ai_tools(id uuid primary key default gen_random_uuid(), name text not null unique, company text, category text, description text, pricing text, api_available boolean, website text, created_at timestamptz default now(), updated_at timestamptz default now(), search tsvector generated always as (to_tsvector('english', coalesce(name,'')||' '||coalesce(description,''))) stored);
create table ai_companies(id uuid primary key default gen_random_uuid(), name text not null unique, description text, country text, founded int, website text, created_at timestamptz default now(), updated_at timestamptz default now(), search tsvector generated always as (to_tsvector('english', coalesce(name,'')||' '||coalesce(description,''))) stored);
create table research_papers(id uuid primary key default gen_random_uuid(), title text not null, authors text[], abstract text, summary text, paper_url text unique, code_url text, published_at date, created_at timestamptz default now(), updated_at timestamptz default now(), search tsvector generated always as (to_tsvector('english', coalesce(title,'')||' '||coalesce(abstract,''))) stored);
create table engineering_domains(id uuid primary key default gen_random_uuid(), name text unique not null);
create table tool_engineering_domains(tool_id uuid references ai_tools on delete cascade, domain_id uuid references engineering_domains on delete cascade, primary key(tool_id, domain_id));
create table model_engineering_domains(model_id uuid references ai_models on delete cascade, domain_id uuid references engineering_domains on delete cascade, primary key(model_id, domain_id));
create table bookmarks(id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade, entity_type text not null, entity_id uuid not null, created_at timestamptz default now(), unique(user_id, entity_type, entity_id));
create or replace function is_admin() returns boolean language sql stable security definer as $$ select exists(select 1 from profiles where id = auth.uid() and role='admin') $$;
alter table profiles enable row level security; alter table bookmarks enable row level security;
create policy "own profile read" on profiles for select using (id = auth.uid() or is_admin());
create policy "own profile insert" on profiles for insert with check (id = auth.uid() and role = 'user');
create policy "own profile update" on profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = (select role from profiles where id = auth.uid()));
create policy "own bookmarks" on bookmarks for all using (user_id = auth.uid()) with check (user_id = auth.uid());
do $$ declare t text; begin foreach t in array array['sources','events','articles','ai_models','ai_tools','ai_companies','research_papers','engineering_domains'] loop
  execute format('alter table %I enable row level security', t);
  execute format('create policy "public read" on %I for select using (true)', t);
  execute format('create policy "admin write" on %I for all using (is_admin()) with check (is_admin())', t);
end loop; end $$;
