insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict do nothing;
create policy "Public Access" on storage.objects for select using ( bucket_id = 'media' );
create policy "Auth Insert" on storage.objects for insert with check ( bucket_id = 'media' and auth.role() = 'authenticated' );
create policy "Auth Update" on storage.objects for update using ( bucket_id = 'media' and auth.role() = 'authenticated' );
create policy "Auth Delete" on storage.objects for delete using ( bucket_id = 'media' and auth.role() = 'authenticated' );
