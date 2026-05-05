-- Create storage buckets if they don't exist
insert into storage.buckets (id, name, public) 
values ('products', 'products', true), ('banners', 'banners', true)
on conflict (id) do nothing;

-- -------------------------------------------------------------
-- BUCKET SECURITY POLICIES: products
-- -------------------------------------------------------------

-- Public Read Access
create policy "Publicly readable products" 
on storage.objects for select 
using ( bucket_id = 'products' );

-- Admin Write Access (Insert)
create policy "Admins can upload product images" 
on storage.objects for insert 
with check ( 
  bucket_id = 'products' 
  and auth.role() = 'authenticated'
  and (storage.extension(name) = 'jpg' or storage.extension(name) = 'jpeg' or storage.extension(name) = 'png' or storage.extension(name) = 'webp')
  and length(coalesce(name, '')) < 100 -- Prevent insanely long filenames
);

-- Admin Update Access
create policy "Admins can update product images" 
on storage.objects for update 
using ( bucket_id = 'products' and auth.role() = 'authenticated' );

-- Admin Delete Access
create policy "Admins can delete product images" 
on storage.objects for delete 
using ( bucket_id = 'products' and auth.role() = 'authenticated' );


-- -------------------------------------------------------------
-- BUCKET SECURITY POLICIES: banners
-- -------------------------------------------------------------

-- Public Read Access
create policy "Publicly readable banners" 
on storage.objects for select 
using ( bucket_id = 'banners' );

-- Admin Write Access (Insert)
create policy "Admins can upload banners" 
on storage.objects for insert 
with check ( 
  bucket_id = 'banners' 
  and auth.role() = 'authenticated'
  and (storage.extension(name) = 'jpg' or storage.extension(name) = 'jpeg' or storage.extension(name) = 'png' or storage.extension(name) = 'webp')
);

-- Admin Update Access
create policy "Admins can update banners" 
on storage.objects for update 
using ( bucket_id = 'banners' and auth.role() = 'authenticated' );

-- Admin Delete Access
create policy "Admins can delete banners" 
on storage.objects for delete 
using ( bucket_id = 'banners' and auth.role() = 'authenticated' );
