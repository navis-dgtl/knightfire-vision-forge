# KTek Admin Panel — Design

Status: approved 2026-05-20
Owner: Nick Prince
Implementation branch: `feat/admin-panel`

## Goal

Give non-technical KnightTek admins a single panel at `/admin/*` to manage:

- The home page hero carousel (slides, copy, CTAs, images, ordering)
- A site-wide announcement banner above every page (with schedule + colors + link)
- Custom pages at clean URLs (`/our-team`, `/events`, …) built from a drag-and-drop block set
- The header navigation (reorder, edit, hide, nest, point at custom pages)
- Site-wide settings (key/value)

…on top of the existing Submissions inbox, Publications CMS, and Allowlist admin already live on `main`.

## Non-goals (v1)

- Footer nav editing (schema supports it via `nav_items.location='footer'` — no UI yet, Footer stays hardcoded)
- Page version history / revisions
- Sub-page hierarchy in URLs (`/about/team`)
- Multi-language
- AI assist for pages (existing `improve-article` edge function stays post-only)
- Page templates / duplicate-from-template

## User stories

1. Admin logs in → lands on `/admin` Dashboard showing counts and recent activity.
2. Admin clicks **Hero Slides** → reorders the home-page carousel slides via drag-and-drop, edits any slide's title/subtitle/image/CTAs.
3. Admin clicks **Announcement Banners** → schedules a banner ("Holiday hours") to appear site-wide between Dec 23 and Jan 2 with a link to a holiday page.
4. Admin clicks **Pages → New Page** → builds an `/events` page by dragging blocks (heading, rich text, image, button, video, columns, contact form, embed) into the canvas, sets SEO, publishes.
5. After publishing, the editor shows "Add to header nav?" — admin clicks it and the page appears in `Navigation` immediately.
6. Admin clicks **Navigation** → drags the new "Events" item between two existing items, sets it to open in a new tab, hides another item.

## Architecture

### Routing changes (`src/App.tsx`)

All `/admin/*` routes mount inside a new `<AdminShell>` layout. The shell is wrapped by `<RequireAdmin>` once at the parent level (instead of repeating on every child).

```
<Route path="/admin" element={<RequireAdmin><AdminShell/></RequireAdmin>}>
  <Route index                       element={<Dashboard/>}/>
  <Route path="submissions"          element={<Submissions/>}/>
  <Route path="posts"                element={<PostsList/>}/>
  <Route path="posts/new"            element={<PostEditor/>}/>
  <Route path="posts/:id"            element={<PostEditor/>}/>
  <Route path="hero"                 element={<HeroSlidesList/>}/>
  <Route path="hero/new"             element={<HeroSlideEditor/>}/>
  <Route path="hero/:id"             element={<HeroSlideEditor/>}/>
  <Route path="banners"              element={<BannersList/>}/>
  <Route path="banners/new"          element={<BannerEditor/>}/>
  <Route path="banners/:id"          element={<BannerEditor/>}/>
  <Route path="pages"                element={<PagesList/>}/>
  <Route path="pages/new"            element={<PageEditor/>}/>
  <Route path="pages/:id"            element={<PageEditor/>}/>
  <Route path="navigation"           element={<NavigationEditor/>}/>
  <Route path="settings"             element={<SiteSettings/>}/>
  <Route path="allowlist"            element={<Allowlist/>}/>
</Route>
```

Plus, at the **bottom** of the top-level routes (just before `*`):
```
<Route path="/:slug" element={<CustomPage/>}/>
```
Existing fixed routes win; `/:slug` is the fallback. `CustomPage` queries `pages` by slug and falls through to `<NotFound/>` if no published row.

### Admin shell

`src/components/admin/AdminShell.tsx`
- Sticky left sidebar on `lg+` (collapsible drawer on mobile)
- Sidebar sections: **Overview** (Dashboard) · **Content** (Submissions, Publications, Pages) · **Site** (Hero Slides, Banners, Navigation, Settings) · **Access** (Allowlist)
- Top bar: KnightTek logo · breadcrumb · "View site" link · Sign out
- Main area: `<Outlet/>`

### Data layer

Six new files under `src/lib/`, each following the `lib/posts.ts` shape (React Query hooks + Supabase client calls).

| File | Hooks |
|---|---|
| `lib/banners.ts` | `useActiveBanner`, `useAllBanners`, `useSaveBanner`, `useDeleteBanner` |
| `lib/hero.ts` | `useActiveHeroSlides`, `useAllHeroSlides`, `useSaveSlide`, `useDeleteSlide`, `useReorderSlides` |
| `lib/pages.ts` | `usePublishedPage(slug)`, `useAllPages`, `useSavePage`, `useDeletePage`, `validateSlug`, `RESERVED_SLUGS` |
| `lib/navigation.ts` | `usePublicNav(location)`, `useAllNavItems`, `useSaveNavItem`, `useDeleteNavItem`, `useReorderNavItems` |
| `lib/settings.ts` | `useSetting<T>(key)`, `useSaveSetting` |
| `lib/blocks.ts` | `Block` discriminated union, Zod schema, `validateBlocks`, `EMPTY_BLOCK` factories |

### Block system

```ts
export type BlockId = string;

export type Block =
  | { id: BlockId; type: 'heading';      props: { text: string; level: 1|2|3; align: 'left'|'center' } }
  | { id: BlockId; type: 'rich_text';    props: { html: string } }
  | { id: BlockId; type: 'image';        props: { url: string; alt: string; caption: string; width: 'narrow'|'wide'|'full' } }
  | { id: BlockId; type: 'button';       props: { label: string; url: string; variant: 'primary'|'secondary'; align: 'left'|'center'|'right' } }
  | { id: BlockId; type: 'video';        props: { url: string; caption: string } }
  | { id: BlockId; type: 'spacer';       props: { size: 'sm'|'md'|'lg' } }
  | { id: BlockId; type: 'columns';      props: { left: Block[]; right: Block[]; ratio: '50-50'|'33-67'|'67-33' } }
  | { id: BlockId; type: 'contact_form'; props: { heading: string; subheading: string } }
  | { id: BlockId; type: 'embed';        props: { url: string; height: number; caption: string } };
```

- Columns hold inner blocks but **do not nest** (no columns inside columns; no contact_form/embed inside columns)
- `rich_text.html` is TipTap-produced HTML, sanitized via existing `<SafeHtml>` on render
- `embed.url` is rendered into a sandboxed iframe (`sandbox="allow-scripts allow-same-origin allow-forms allow-popups"`). The editor detects Google Forms / Typeform / Calendly / Airtable URLs and shows a "✓ Recognized provider" hint
- Unknown block `type` values render an `<UnknownBlock/>` placeholder in production (no crash); the admin editor shows a "remove this block" prompt

Two render surfaces:
- `components/blocks/BlockRenderer.tsx` — public read-only, used by `CustomPage`
- `components/blocks/BlockEditor.tsx` — admin-editable, used by `PageEditor`

One component per block: `HeadingBlock`, `RichTextBlock`, `ImageBlock`, `ButtonBlock`, `VideoBlock`, `SpacerBlock`, `ColumnsBlock`, `ContactFormBlock`, `EmbedBlock`. Each exports `View` and `Edit` variants.

### Drag-and-drop

Install:
- `@dnd-kit/core`
- `@dnd-kit/sortable`
- `@dnd-kit/utilities`

One shared `components/admin/SortableList.tsx` used in four places: hero slides reorder, banners reorder, nav tree, page block editor. Nav tree adds nesting (parent_id reassignment on drop). Page block editor handles dragging into columns.

### Public site changes

`HeroCarousel.tsx`:
- Replace hardcoded `slides` const with `useActiveHeroSlides()`
- If query returns 0 active slides, fall back to current hardcoded array (zero-state safety)
- Images now come from `slide.image_url` (uploads via `uploadMedia`). Hardcoded fallback continues to use `hero-background.webp`

`Navigation.tsx`:
- Replace `navLinks` const with `usePublicNav('header')` data
- Build the tree client-side from flat `nav_items` rows using `parent_id`
- Fall back to current hardcoded list if query returns 0
- Mobile drawer behavior unchanged

`AnnouncementBanner.tsx` (new, `src/components/AnnouncementBanner.tsx`):
- Fetches `useActiveBanner()`
- Renders a thin colored strip above `<Navigation>` when an active banner exists
- Honors `starts_at` / `ends_at` via Postgres RLS (the policy already filters), plus client-side check as belt-and-suspenders for cached results
- Mounted by adding `<AnnouncementBanner/>` directly before `<Navigation/>` in every page (we add it inside Navigation.tsx to avoid touching every page)

`CustomPage.tsx` (new):
- Reads `:slug` from route
- `usePublishedPage(slug)` query → renders `<BlockRenderer blocks={page.blocks}/>` wrapped by `<Navigation/>` + `<Footer/>` + `<Seo/>`
- 404 if no published row

### Seed migration

One new SQL file: `supabase/migrations/20260520_seed_nav_items.sql`

Inserts:
- 7 top-level header items: Home `/`, Products `/products`, Industries `/industries`, Distributors `/distributors`, Media `/publications`, About `/about`, Contact `/contact`
- 7 child items under Products: All Products, Thermal Stop™, Thermal Shield™, Suppressit™, Fire Quit™, Elixir 5™, Product Comparison

Idempotent (skips insert if `nav_items` already has any rows for `location='header'`).

### Reserved slugs

Defined in `lib/pages.ts`:
```ts
export const RESERVED_SLUGS = new Set([
  'admin','auth','signup',
  'products','publications','industries','about',
  'distributors','contact','rsvp-mesquite',
]);
```
Enforced at:
- Save time: `validateSlug(slug)` blocks reserved + invalid chars + duplicates
- Render time: `CustomPage` checks against `RESERVED_SLUGS` and refuses to render even if a row somehow exists (defense-in-depth)

### "Add to nav" flow

After `PageEditor` saves a published page, show a `<Card>` prompt:
> ✓ Page is live at /our-team
> [ Add to header nav ] [ Skip ]

Clicking the button creates a `nav_items` row pointing at the new page, appended at the end of `location='header'`.

## File map (new + touched)

**New:**
```
docs/admin-panel-design.md                    [this file]
supabase/migrations/20260520_seed_nav_items.sql
src/lib/banners.ts
src/lib/hero.ts
src/lib/pages.ts                              [NB: name shadowed by existing usage, see note below]
src/lib/navigation.ts
src/lib/settings.ts
src/lib/blocks.ts
src/components/admin/AdminShell.tsx
src/components/admin/AdminSidebar.tsx
src/components/admin/SortableList.tsx
src/components/AnnouncementBanner.tsx
src/components/blocks/BlockRenderer.tsx
src/components/blocks/BlockEditor.tsx
src/components/blocks/HeadingBlock.tsx
src/components/blocks/RichTextBlock.tsx
src/components/blocks/ImageBlock.tsx
src/components/blocks/ButtonBlock.tsx
src/components/blocks/VideoBlock.tsx
src/components/blocks/SpacerBlock.tsx
src/components/blocks/ColumnsBlock.tsx
src/components/blocks/ContactFormBlock.tsx
src/components/blocks/EmbedBlock.tsx
src/pages/CustomPage.tsx
src/pages/admin/Dashboard.tsx
src/pages/admin/Submissions.tsx               [extracted from current Admin.tsx]
src/pages/admin/HeroSlidesList.tsx
src/pages/admin/HeroSlideEditor.tsx
src/pages/admin/BannersList.tsx
src/pages/admin/BannerEditor.tsx
src/pages/admin/PagesList.tsx
src/pages/admin/PageEditor.tsx
src/pages/admin/NavigationEditor.tsx
src/pages/admin/SiteSettings.tsx
```

**Touched:**
```
package.json                                  [+ @dnd-kit/{core,sortable,utilities}]
src/App.tsx                                   [nested admin routes + /:slug catch-all]
src/pages/Admin.tsx                           [redirects to /admin/submissions OR shows Dashboard]
src/components/HeroCarousel.tsx               [DB-driven with hardcoded fallback]
src/components/Navigation.tsx                 [DB-driven nav + mount AnnouncementBanner]
src/pages/admin/Allowlist.tsx                 [reskin to fit inside AdminShell — remove duplicate Navigation/Footer]
src/pages/admin/PostsList.tsx                 [same — fit inside shell]
src/pages/admin/PostEditor.tsx                [same — fit inside shell]
```

Note on `lib/pages.ts`: doesn't conflict with any existing file. Confirmed by `glob src/lib/*.ts` — current files are `ai.ts`, `formspree.ts`, `posts.ts`, `storage.ts`, `utils.ts`.

## Out-of-scope / explicit decisions

- **No form embed of arbitrary external forms via raw HTML.** The Embed block accepts a URL only and renders a sandboxed iframe. Pasting `<iframe>` HTML is rejected with a "paste just the URL" message.
- **Buttons can link anywhere.** Internal paths use `<Link>`, external URLs use `<a target="_blank" rel="noopener">`. No allow-list.
- **Columns are 2-column only.** No 3- or 4-column layouts in v1.
- **Hero carousel images.** Continue using the existing `hero-background.webp` as the overlay. Per-slide `image_url` lets admins swap that background for any slide. The blue overlay stays globally.
- **Banner colors.** Default to KnightTek navy / accent. Admin can override per banner via two color inputs.

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Admin deletes a nav item that powers a critical link | DB-driven nav has hardcoded fallback in `Navigation.tsx` — only triggers on 0 rows, so partial deletion still uses DB. But: add a "Reset to defaults" button on `/admin/navigation` that re-seeds. |
| Block schema drift breaks old pages | `validateBlocks` runs on save; `<UnknownBlock/>` renderer handles old/new mismatches without crashing public site. |
| Reserved slug bypassed via direct DB edit | `CustomPage` re-checks against `RESERVED_SLUGS` before rendering. |
| iframe XSS via embed block | Sandbox attribute + URL-only input + admin role gate. |
| Large hero/banner image uploads | Reuse existing `uploadMedia()` which uses Supabase storage. Add client-side check: warn if > 1MB. |
| Lazy-loaded admin routes cause flash | Existing `<Suspense fallback={null}>` in App.tsx covers this. Admin shell uses skeleton loaders for each section's data. |

## Acceptance criteria

- [ ] `/admin` shows Dashboard with sidebar; all old admin routes still accessible inside shell
- [ ] Submissions still readable at `/admin/submissions` with full parity to current `/admin`
- [ ] Hero slides on home page render from DB; reorder + edit + add + remove all work
- [ ] Announcement banner appears site-wide when active, hidden otherwise, respects schedule
- [ ] A custom page created at `/our-team` renders with the chosen blocks and is reachable
- [ ] Nav editor: reorder, hide, edit, add submenu items all persist + reflect on public site
- [ ] `npm run lint` + `npm run build` pass clean
- [ ] No regression in mobile responsive nav

## Implementation order (single PR on `feat/admin-panel`)

1. Migration: seed nav_items
2. Data layer: banners.ts, hero.ts, pages.ts, navigation.ts, settings.ts, blocks.ts
3. AdminShell + AdminSidebar + nested routing
4. Extract Submissions out of current Admin.tsx; make Dashboard
5. Hero slides admin + DB-drive HeroCarousel
6. Banners admin + AnnouncementBanner component + mount in Navigation
7. Site settings admin (basic key/value editor)
8. Navigation editor (drag-tree) + DB-drive Navigation.tsx
9. Block components (View + Edit variants) one at a time
10. Page editor + PagesList + CustomPage public renderer
11. Add-to-nav handoff after page publish
12. Restyle existing admin pages (Allowlist, PostsList, PostEditor) to live inside shell
13. Lint + build + manual QA pass
