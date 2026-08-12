# VAVAW Cosmetic Product Content Blueprint & CMS Guidelines

**Document Status**: Active Standard  
**Target Domain**: VAVAW Cosmetic Landing Ecosystem (`apps/main/app/cosmetic/products/*`)  
**Scope**: Strategy, Safety Protocol, Checklist, and Writing Templates for non-Luminous Cosmetic Product Landing Pages.

---

## 1. Standard Product Landing Page Structure

Every VAVAW Cosmetic product landing page is structured into 10 cohesive sections using a unified design system:

1. **Hero Section**: Eyebrow, product title, main headline, short positioning summary, primary CTA (`Nhận tư vấn routine`), secondary CTA (`Khám phá quy trình spa`), hero product media asset.
2. **Product Positioning (Anti-Gravity Solution / Core Value)**: Detailed explanation of how the product addresses specific skin concerns and restores skin barrier integrity.
3. **Target Audience (Who Needs This Product)**: Clear identification of target skin types, concerns (e.g., thin/fragile skin, post-treatment, dry/dehydrated), and benefits.
4. **Key Benefits & Science (Skin Barrier & Technology)**: Multi-column breakdown of active technology (e.g., Exosome, Peptide Complex, MG3+) and skin mechanisms.
5. **Active Ingredients Map**: Interactive/visual breakdown of key active ingredients, their biological roles, and targeted skin actions.
6. **How to Use (Usage Guide & Ritual Position)**: Step-by-step application instructions, timing (Morning/Evening/Both), and routine placement.
7. **Product Detail Form (2D Regulatory & Legal Information)**:
   - Common Legal Information Table (Product name, usage, manufacturer, distributor, MFDS approval status, CS contact).
   - Product Item Cards (Volume, functional claims, full ingredient list).
   - Usage Cautions (Safety warnings, sun exposure notes, storage advice).
   - Storage Conditions & Quality Guarantee.
8. **Offline Experience Bridge (Optional)**: Connection to VAVAW Spa & Beauty Clinic treatments.
9. **Final Call-to-Action (CTA)**: High-converting consultation banner with trust indicators.
10. **Global Footer**: Site footer with ecosystem navigation.

---

## 2. Content Safety Rules

> [!IMPORTANT]
> **STRICT COMPLIANCE REQUIRED FOR ALL CMS EDITORS & CONTENT WRITERS**:
>
> 1. **No Unverified Claims**: Never invent or publish fake legal claims, MFDS functional approvals, or cosmetic registration numbers.
> 2. **No Fake Ingredient Lists**: Do not generate dummy INCI ingredient lists or copy ingredients from other brands.
> 3. **No Luminous Set Copying**: Do not copy Luminous Revitalization Sheer Set legal data, volume, or ingredient lists into single product pages.
> 4. **Safe Placeholder Policy**: If official product documentation is pending, use standard safe placeholders:
>    - *"Thông tin sản phẩm sẽ được cập nhật chi tiết theo hồ sơ sản phẩm chính thức."*
>    - *"Đang cập nhật thông tin chi tiết"*
> 5. **Source Separation**: Each product page must be updated strictly from its own official dossier (`block_type: cosmetic-product-landing-<product-slug>`).

---

## 3. Recommended Product Writing Template

Use this structured template when preparing copy for each product dossier before entering data into CMS:

```markdown
### Product Copy Template

- **Eyebrow**: [e.g., CLINICAL RECOVERY AMPOULE / INTENSIVE MOISTURIZER]
- **Title**: [Official Registered Product Name]
- **Headline**: [1-line core value proposition]
- **Description**: [2-3 sentences covering skin benefits and texture experience]
- **Best For**: [Skin types & concerns: e.g., Da sau xâm lấn, da mỏng yếu, da mất nước]
- **Texture & Feel**: [e.g., Tinh chất mỏng nhẹ, thẩm thấu nhanh, không bết dính]
- **Main Ingredients**: [Key active components, e.g., Centella Callus Vesicles, Hyaluronic Acid]
- **Routine Position**: [e.g., Bước 2 - Sau Toner / Trước Cream]
- **Morning/Evening Usage**: [Sáng & Tối / Chỉ dùng Tối]
- **Consultation CTA**: [e.g., Nhận tư vấn từ chuyên gia VAVAW]
- **Legal Information**:
  - Hạn sử dụng sau khi mở nắp: [e.g., 12 tháng]
  - Hạn sử dụng trước khi mở nắp: [Xem trên bao bì]
  - Nhà sản xuất: [IRE Cosmetic Co., Ltd. / Official Partner]
  - Phân phối chính thức: [BRL Company Co., Ltd.]
  - Nước sản xuất: [Hàn Quốc]
  - Phê duyệt MFDS: [Có / Không - Mỹ phẩm chức năng]
- **Full Ingredient List**: [Official INCI list in Vietnamese/English]
```

---

## 4. Product Checklist & Status Matrix for 7 Cosmetic Products

### 1. CELLUREVIVE Ampoule
- **Official Name**: Tinh chất CelluRevive Intensive Sheer Ampoule
- **Route**: `/cosmetic/products/cellurevive-ampoule`
- **CMS Block Type**: `cosmetic-product-landing-cellurevive-ampoule`
- **Missing Required Content**: Full single-ampoule dossier verification, standalone packaging photos.
- **Required Media Slots**: `cosmetic-product-cellurevive-ampoule`, `cosmetic-video-renew-ampoule` (or dedicated video).
- **Legal Data Status**: Pending official single-unit registration document check.
- **Ingredient Data Status**: Preliminary Collagen Water (830,000 ppm) & Centella Vesicles (10,000 ppm) draft available; awaiting full single INCI sign-off.
- **CTA Status**: Operational (`/contact?type=cosmetic_interest&source=cellurevive_ampoule`).
- **Notes for Editing**: Ensure volume format (e.g. 7ml × 4 or single vial) matches current retail packaging.

### 2. REGENAGLOW NOURISH SHEER CREAM
- **Official Name**: Kem dưỡng REGENAGLOW Nourish Sheer Cream
- **Route**: `/cosmetic/products/regenaglow-nourish-sheer-cream`
- **CMS Block Type**: `cosmetic-product-landing-regenaglow-cream`
- **Missing Required Content**: Full jar artwork, detailed lipid-restoration science copy.
- **Required Media Slots**: `cosmetic-product-regenaglow-cream`, `cosmetic-video-regenaglow-cream`.
- **Legal Data Status**: Pending official single-cream dossier check.
- **Ingredient Data Status**: Preliminary Berry Complex & Squalane formula draft available; awaiting final INCI verification.
- **CTA Status**: Operational (`/contact?type=cosmetic_interest&source=regenaglow_cream`).
- **Notes for Editing**: Focus positioning on rich moisture sealing and skin barrier protection.

### 3. Calmiance Superior Sheer Gel
- **Official Name**: Gel phục hồi Calmiance Superior Sheer Gel
- **Route**: `/cosmetic/products/calmiance-superior-sheer-gel`
- **CMS Block Type**: `cosmetic-product-landing-calmiance-gel`
- **Missing Required Content**: Gel texture visuals, cooling benefit copy, detailed calming active breakdown.
- **Required Media Slots**: `cosmetic-product-calmiance-gel`, `cosmetic-video-calmiance-gel`.
- **Legal Data Status**: Safe default placeholders active (`"Thông tin sản phẩm sẽ được cập nhật..."`).
- **Ingredient Data Status**: Pending official INCI dossier.
- **CTA Status**: Operational (`/contact?type=cosmetic_interest&source=calmiance_gel`).
- **Notes for Editing**: Highlight soothing care for irritated, red, or post-sun/post-treatment skin.

### 4. P30 Boost Facial Hydrating Toner
- **Official Name**: Toner cân bằng P30 Boost Facial Hydrating Toner
- **Route**: `/cosmetic/products/p30-boost-facial-hydrating-toner`
- **CMS Block Type**: `cosmetic-product-landing-p30-toner`
- **Missing Required Content**: pH balancing metrics, hydration absorption visuals.
- **Required Media Slots**: `cosmetic-product-p30-toner`, `cosmetic-video-p30-toner`.
- **Legal Data Status**: Safe default placeholders active.
- **Ingredient Data Status**: Pending official INCI dossier.
- **CTA Status**: Operational (`/contact?type=cosmetic_interest&source=p30_toner`).
- **Notes for Editing**: Emphasize first step preparation and skin pH normalization.

### 5. Gentle Activation Renew Ampoule
- **Official Name**: Tinh chất Gentle Activation Renew Ampoule
- **Route**: `/cosmetic/products/gentle-activation-renew-ampoule`
- **CMS Block Type**: `cosmetic-product-landing-gentle-renew-ampoule`
- **Missing Required Content**: Daily renewal mechanism, gentle exfoliation/activation claims.
- **Required Media Slots**: `cosmetic-product-renew-ampoule`, `cosmetic-video-renew-ampoule`.
- **Legal Data Status**: Safe default placeholders active.
- **Ingredient Data Status**: Pending official INCI dossier.
- **CTA Status**: Operational (`/contact?type=cosmetic_interest&source=gentle_renew_ampoule`).
- **Notes for Editing**: Differentiate from CelluRevive Ampoule by highlighting daily mild activation.

### 6. P30 Boost Facial Moisturizer
- **Official Name**: Kem dưỡng ẩm P30 Boost Facial Moisturizer
- **Route**: `/cosmetic/products/p30-boost-facial-moisturizer`
- **CMS Block Type**: `cosmetic-product-landing-p30-moisturizer`
- **Missing Required Content**: Lightweight moisturizer texture shots, daily hydration barrier copy.
- **Required Media Slots**: `cosmetic-product-p30-moisturizer`, `cosmetic-video-p30-moisturizer`.
- **Legal Data Status**: Safe default placeholders active.
- **Ingredient Data Status**: Pending official INCI dossier.
- **CTA Status**: Operational (`/contact?type=cosmetic_interest&source=p30_moisturizer`).
- **Notes for Editing**: Position as daily essential hydration for all skin types.

### 7. LUMIGLOW ROSY SHEER SUNSCREEN
- **Official Name**: Kem chống nắng Lumiglow Rosy Sheer Sunscreen
- **Route**: `/cosmetic/products/lumiglow-rosy-sheer-sunscreen`
- **CMS Block Type**: `cosmetic-product-landing-lumiglow-sunscreen`
- **Missing Required Content**: SPF/PA rating verification, rosy tone-up effect description, UV filter details.
- **Required Media Slots**: `cosmetic-product-lumiglow-sunscreen`, `cosmetic-video-lumiglow-sunscreen`.
- **Legal Data Status**: Pending official SPF test certificate & MFDS functional registration for sun protection.
- **Ingredient Data Status**: Pending official INCI dossier.
- **CTA Status**: Operational (`/contact?type=cosmetic_interest&source=lumiglow_sunscreen`).
- **Notes for Editing**: Highlight dual protection + natural tone-up glow without white cast.

---

## 5. Summary & Next Steps

Editors should open `apps/admin` -> **Quản lý VAVAW Cosmetic** -> **Tùy chỉnh 8 trang Landing mỹ phẩm**, select the target product block type, and update fields progressively according to official registration files.
