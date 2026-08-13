begin;

create or replace function pg_temp.recursive_jsonb_translate(val jsonb)
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
    -- Do not translate protected keys
    for rec in select key, value from jsonb_each(val) loop
      if rec.key not in ('href', 'url', 'src', 'image', 'imageUrl', 'mediaSlot', 'videoSlot', 'slug', 'path', 'page_path', 'block_type', 'canonical', 'canonicalUrl', 'productSlug', 'route', 'id', 'key', 'icon') then
        result := jsonb_set(result, array[rec.key], pg_temp.recursive_jsonb_translate(rec.value));
      end if;
    end loop;
    return result;
  elsif jsonb_typeof(val) = 'array' then
    result := val;
    for i in 0 .. jsonb_array_length(val) - 1 loop
      result := jsonb_set(result, array[i::text], pg_temp.recursive_jsonb_translate(val->i));
    end loop;
    return result;
  elsif jsonb_typeof(val) = 'string' then
    v_text := val#>>'{}';
    
    -- Exact Matches (Trimmed logic requires careful string manipulation in SQL, but exact match is safer)
    if v_text = 'The Premium RAW Skincare System' then return to_jsonb('Hệ thống chăm sóc da RAW cao cấp'::text);
    elsif v_text = 'Scientific beauty, refined into a pure Korean skincare ritual.' then return to_jsonb('Vẻ đẹp khoa học, được tinh chỉnh thành nghi thức chăm sóc da Hàn Quốc thuần khiết.'::text);
    elsif v_text = 'Scientific Beauty' then return to_jsonb('Vẻ đẹp khoa học'::text);
    elsif v_text = 'Premium Program' then return to_jsonb('Chương trình chăm sóc cao cấp'::text);
    elsif v_text = 'Functional Cosmetics' then return to_jsonb('Mỹ phẩm chức năng'::text);
    elsif v_text = 'SIGNATURE RECOVERY COLLECTION' then return to_jsonb('BỘ SẢN PHẨM PHỤC HỒI ĐẶC TRƯNG'::text);
    elsif v_text = 'Signature Recovery Collection' then return to_jsonb('Bộ sản phẩm phục hồi đặc trưng'::text);
    elsif v_text = 'A complete Korean clinical skincare ritual for recovery, hydration, radiance, and skin barrier support.' then return to_jsonb('Nghi thức chăm sóc da Hàn Quốc định hướng lâm sàng, hỗ trợ phục hồi, cấp ẩm, cải thiện vẻ rạng rỡ và củng cố hàng rào bảo vệ da.'::text);
    elsif v_text = 'EXPLORE THE RITUAL' then return to_jsonb('KHÁM PHÁ NGHI THỨC'::text);
    elsif v_text = 'CLINICAL INSIGHT' then return to_jsonb('GÓC NHÌN LÂM SÀNG'::text);
    elsif v_text = 'FEATURED SET' then return to_jsonb('BỘ SẢN PHẨM NỔI BẬT'::text);
    elsif v_text = 'RECOVERY RITUAL · 6 STEPS' then return to_jsonb('NGHI THỨC PHỤC HỒI · 6 BƯỚC'::text);
    elsif v_text = 'PEPTIDE COMPLEX' then return to_jsonb('PHỨC HỢP PEPTIDE'::text);
    elsif v_text = 'VAVAW is a clinical Korean cosmetic system designed to restore the skin from its origin — pure, balanced, and resilient.' then return to_jsonb('VAVAW là hệ mỹ phẩm Hàn Quốc định hướng lâm sàng, được phát triển để hỗ trợ làn da phục hồi từ nền tảng — tinh khiết, cân bằng và bền vững.'::text);
    elsif v_text = 'Clinical skincare system shaped by professional care standards — developed for visible, lasting results.' then return to_jsonb('Hệ chăm sóc da định hướng lâm sàng, được phát triển theo tiêu chuẩn chăm sóc chuyên nghiệp để mang lại hiệu quả rõ ràng và bền vững.'::text);
    elsif v_text = 'Personalized skincare experience for modern skin concerns — designed for spa, clinic, and home ritual.' then return to_jsonb('Trải nghiệm chăm sóc da cá nhân hóa cho các vấn đề da hiện đại — phù hợp cho spa, clinic và routine tại nhà.'::text);
    elsif v_text = 'Korean-developed formulas designed for visible skin recovery, balancing efficacy with elegance.' then return to_jsonb('Công thức phát triển theo định hướng Hàn Quốc, hỗ trợ phục hồi làn da rõ rệt và cân bằng giữa hiệu quả với sự tinh tế.'::text);
    elsif v_text = 'The complete skin\nrecovery ritual.' then return to_jsonb('Nghi thức phục hồi da\ntoàn diện.'::text);
    elsif v_text = 'A complete Korean clinical skincare ritual designed to cleanse, prepare, treat, seal, and protect the skin.' then return to_jsonb('Nghi thức chăm sóc da lâm sàng Hàn Quốc toàn diện được thiết kế để làm sạch, chuẩn bị, đặc trị, khóa ẩm và bảo vệ da.'::text);
    elsif v_text = 'SIGNATURE RECOVERY SYSTEM' then return to_jsonb('HỆ THỐNG PHỤC HỒI ĐẶC TRƯNG'::text);
    elsif v_text = 'Daily Clinical Skincare Routine' then return to_jsonb('Nghi thức chăm sóc da lâm sàng hàng ngày'::text);
    elsif v_text = 'Answer a few quick questions to discover a Korean clinical skincare ritual designed for your skin stage and concern.' then return to_jsonb('Trả lời vài câu hỏi để khám phá nghi thức chăm sóc da lâm sàng Hàn Quốc được thiết kế cho tình trạng và vấn đề da của bạn.'::text);
    end if;

    return val;
  else
    return val;
  end if;
end;
$$;

update public.content_blocks
set content = pg_temp.recursive_jsonb_translate(content),
    updated_at = timezone('utc'::text, now())
where site_key = 'main'
  and (page_path = '/cosmetic' or page_path like '/cosmetic/products/%');

commit;
