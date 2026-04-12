# Zen POS — Mega Upgrade Plan

This is a very large request touching nearly every part of the application. To deliver reliably, I will break it into **single  phases**, each buildable in sequence. Given the scope, I recommend approving and building **one phase at a time** to avoid quality issues.

---

## Phase 1: Branding + Landing Page Upgrade

**Scope:** Rebrand "Ezo" → "Zen POS" everywhere. Upgrade landing page with GSAP, anime.js, scroll animations, tween effects, horizontal scroll section, dynamic pricing plans from DB, and cinematic hero.

- Replace all "Ezo" / "Ezo POS" references with "Zen POS" across codebase (AdminLayout, InvoicePreview, SMTP defaults, etc.)
- Install `gsap` and `animejs` packages
- Add GSAP ScrollTrigger animations: fade-in, slide-left/right, parallax, counter animations
- Add horizontal scroll section showcasing features
- Add GSAP tween-controlled elastic animations on hero elements
- Make pricing section dynamic — pull from `subscription_plans` table
- Add anime.js micro-interactions on buttons and cards
- Add grid background pattern and aurora glow effects

## and AutoService Theme Full Upgrade

**Scope:** Transform AutoService theme into a premium, feature-rich storefront.

- Add grid background image + configurable background color
- Before/After comparison slider with wipe/drag animation (custom component)
- "Happy Customers" / vehicles served section (team component from 21st.dev pattern) — dynamic via Store Manager
- Store owner info card with Google Maps embed (dynamic from business settings)
- Counter animations (500+ Cars Washed, etc.)
- Water splash and hover micro-animations
- GSAP scroll-triggered section reveals
- Services section with vehicle-type filtering (Car/Bike/Truck/Bus)
- Pricing plans section, booking CTA, WhatsApp integration
- Membership/offers section
- About Us section
- Full cinematic hero with slow-zoom video/gradient background
- Location + Contact section with embedded Google Map

## and  Store Themes — Review Fix, Customer Auth, Theme Enhancements

**Scope:** Fix review system across all themes, add customer signup/login for stores, upgrade theme UIs.

- **Review system fix**: Debug and fix review submission + display across all store themes (currently broken)
- **Customer auth for stores**: Add signup/login flow on store pages so customers can create accounts and track orders (dynamic toggle from Store Manager)
- Create `store_customers` table for store-specific customer accounts
- Add Before/After slider component to Car Wash theme and other relevant themes
- Upgrade theme UIs with better typography, spacing, glassmorphism, and animations
- Make themes free/paid toggleable by admin (already have `store_theme_settings` table — wire it up properly)

## and  Bill Customization + Billing UI Upgrade

**Scope:** Add bill print customization settings page, fix bill themes, upgrade billing/cart UI.

- Add new "Bill Customization" page in Settings with:
  - Logo upload for bills
  - Layout selection (A4 / 58mm / 80mm)
  - Custom header/footer text
  - Font and style options
  - Bill template previews
- Fix bill print themes — ensure dynamic templates actually render correctly
- Add item card component (21st.dev pattern) to billing product grid and cart
- Auto-close cart when products reach zero
- Add product schema additions to DB if needed (e.g., `unit`, `hsn_code`)

## and  Store Manager + Admin Upgrades

**Scope:** Enhance Store Manager with more features, fix and upgrade Admin dashboard.

- **Store Manager upgrades:**
  - Live preview editor (iframe preview of store while editing)
  - Section drag-and-drop ordering (using a sortable library)
  - Custom CSS support field
  - "Happy Customers" / team management section (search customers, upload images, add to showcase)
- **Admin dashboard fixes:**
  - Fix backup page not showing in sidebar (add route to AdminLayout NAV_ITEMS)
  - Add backup data export/import section
  - Upgrade gallery — bulk product add
  - Upgrade subscription plans management (dynamic create/edit/delete with 21st.dev pricing card pattern)
  - Make theme management fully dynamic (toggle free/paid per theme)
- **APK/Android settings in Admin:**
  - APK upload and management section
  - Push notification settings (stored in DB)
  - App download link in MotionFooter

## and  Dashboard Theme Upgrade + Polish

**Scope:** Upgrade dashboard UI, add Lottie animations, final polish.

- Upgrade Dashboard page with better charts, stats, and animations
- Add Lottie animations for loading states, empty states, success feedback
- Add smooth page transitions throughout the app
- Final branding pass — ensure "Zen POS" appears consistently
- Responsive QA across all pages

---

## Technical Details

**New packages:** `gsap`, `animejs` (or `@anime-inc/animejs`), a before/after slider lib (or custom), `@dnd-kit/core` for drag-and-drop

**Database changes:**

- New table: `store_customers` (id, store_slug, email, password_hash, name, phone, created_at) — for customer-facing auth on stores
- New table: `happy_customers` (id, business_id, customer_name, image_url, vehicle_info, title, sort_order) — for the showcase section
- New table: `admin_apk_settings` (id, apk_url, version, push_notification_key, updated_at)
- Add columns to `printer_settings`: `logo_url`, `layout_type`, `custom_header`, `custom_footer`, `font_size`
- Add columns to `businesses`: `tagline`, `owner_card_visible`, `customer_auth_enabled`
- Migration to add `backup` route to admin nav (code-only, no DB)

**Key files modified:** ~25+ files across themes, pages, components, and settings.

---

## Recommendation

This is equivalent to **weeks of development work**. I strongly recommend approving **Phase 1 first**, then proceeding phase by phase. Each phase is self-contained and testable. Shall I proceed with Phase 1?