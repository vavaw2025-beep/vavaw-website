begin;

create or replace function pg_temp.recursive_jsonb_replace(val jsonb)
returns jsonb
language plpgsql immutable
as $$
declare
  rec record;
  result jsonb;
  v_text text;
begin
  if jsonb_typeof(val) = 'object' then
    result := val;
    for rec in select key, value from jsonb_each(val) loop
      result := jsonb_set(result, array[rec.key], pg_temp.recursive_jsonb_replace(rec.value));
    end loop;
    return result;
  elsif jsonb_typeof(val) = 'array' then
    result := val;
    for i in 0 .. jsonb_array_length(val) - 1 loop
      result := jsonb_set(result, array[i::text], pg_temp.recursive_jsonb_replace(val->i));
    end loop;
    return result;
  elsif jsonb_typeof(val) = 'string' then
    v_text := val#>>'{}';
    
    if v_text = 'The Premium RAW Skincare System' then return to_jsonb('Hệ thống chăm sóc da RAW cao cấp'::text);
    elsif v_text = 'Scientific beauty, refined into a pure Korean skincare ritual.' then return to_jsonb('Vẻ đẹp khoa học, được tinh chỉnh thành nghi thức chăm sóc da Hàn Quốc thuần khiết.'::text);
    elsif v_text = 'VAVAW is a clinical Korean cosmetic system designed to restore the skin from its origin — pure, balanced, and resilient.' then return to_jsonb('VAVAW là hệ mỹ phẩm Hàn Quốc định hướng lâm sàng, được phát triển để hỗ trợ làn da phục hồi từ nền tảng — tinh khiết, cân bằng và bền vững.'::text);
    elsif v_text = 'Scientific Beauty' then return to_jsonb('Vẻ đẹp khoa học'::text);
    elsif v_text = 'Premium Program' then return to_jsonb('Chương trình chăm sóc cao cấp'::text);
    elsif v_text = 'Functional Cosmetics' then return to_jsonb('Mỹ phẩm chức năng'::text);
    elsif v_text = 'Clinical skincare system shaped by professional care standards — developed for visible, lasting results.' then return to_jsonb('Hệ chăm sóc da định hướng lâm sàng, được phát triển theo tiêu chuẩn chăm sóc chuyên nghiệp để mang lại hiệu quả rõ ràng và bền vững.'::text);
    elsif v_text = 'Personalized skincare experience for modern skin concerns — designed for spa, clinic, and home ritual.' then return to_jsonb('Trải nghiệm chăm sóc da cá nhân hóa cho các vấn đề da hiện đại — phù hợp cho spa, clinic và routine tại nhà.'::text);
    elsif v_text = 'Korean-developed formulas designed for visible skin recovery, balancing efficacy with elegance.' then return to_jsonb('Công thức phát triển theo định hướng Hàn Quốc, hỗ trợ phục hồi làn da rõ rệt và cân bằng giữa hiệu quả với sự tinh tế.'::text);
    end if;

    return val;
  else
    return val;
  end if;
end;
$$;

update public.content_blocks
set content = pg_temp.recursive_jsonb_replace(content),
    updated_at = timezone('utc'::text, now())
where site_key = 'main'
  and page_path = '/cosmetic';

commit;
