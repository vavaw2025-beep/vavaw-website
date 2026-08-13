select
  id,
  page_path,
  block_type,
  is_active,
  sort_order,
  updated_at,
  content
from public.content_blocks
where site_key = 'main'
  and (page_path = '/cosmetic' or page_path like '/cosmetic/products/%')
  and content::text ~* '(The Premium RAW|Scientific beauty|Scientific Beauty|Premium Program|Functional Cosmetics|Signature Recovery|Recovery Collection|Clinical Insight|Featured Set|Explore the Ritual|Product Information|Active Ingredients|How to Use|Who Needs|Storage|Cautions|Quality Guarantee)'
order by page_path, sort_order;
