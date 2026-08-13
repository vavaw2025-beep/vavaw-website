select
  id,
  block_type,
  is_active,
  sort_order,
  content,
  updated_at
from public.content_blocks
where site_key = 'main'
  and page_path = '/cosmetic'
  and content::text ~* '(The Premium RAW|Scientific beauty|Premium Program|Functional Cosmetics|Clinical skincare|Personalized skincare|Korean-developed)'
order by sort_order;
