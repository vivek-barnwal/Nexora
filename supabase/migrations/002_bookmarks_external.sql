-- Items now come from external APIs, so bookmarks store a snapshot instead of a UUID reference.
alter table bookmarks drop constraint bookmarks_user_id_entity_type_entity_id_key;
alter table bookmarks alter column entity_id type text;
alter table bookmarks add column title text, add column url text;
alter table bookmarks add constraint bookmarks_user_entity_key unique (user_id, entity_id);
