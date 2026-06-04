-- Run in Supabase SQL Editor after creating bucket "note-attachments" in Storage UI
-- (Dashboard → Storage → New bucket → name: note-attachments, private recommended)

-- Allow authenticated users to manage files under their own user_id folder
create policy "Users upload own note attachments"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'note-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users read own note attachments"
on storage.objects for select
to authenticated
using (
  bucket_id = 'note-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users delete own note attachments"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'note-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
);
