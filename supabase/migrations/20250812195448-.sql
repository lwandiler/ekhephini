-- Create public bucket for show images if it doesn't exist
insert into storage.buckets (id, name, public)
values ('show-images', 'show-images', true)
on conflict (id) do nothing;

-- Allow public read access to files in the 'show-images' bucket
create policy if not exists "Public can view show images"
on storage.objects
for select
using (bucket_id = 'show-images');

-- Allow authenticated users to upload images to 'show-images' bucket
create policy if not exists "Authenticated users can upload show images"
on storage.objects
for insert
with check (bucket_id = 'show-images' and auth.role() = 'authenticated');

-- Allow authenticated users to update images in 'show-images' bucket
create policy if not exists "Authenticated users can update show images"
on storage.objects
for update
using (bucket_id = 'show-images' and auth.role() = 'authenticated')
with check (bucket_id = 'show-images' and auth.role() = 'authenticated');

-- Allow authenticated users to delete images in 'show-images' bucket
create policy if not exists "Authenticated users can delete show images"
on storage.objects
for delete
using (bucket_id = 'show-images' and auth.role() = 'authenticated');