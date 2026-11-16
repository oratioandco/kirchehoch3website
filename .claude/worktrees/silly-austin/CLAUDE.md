# kirchehoch3.berlin Website

## Project Overview

A highly performant, mobile-responsive, award-winning website for **kirchehoch3** - a Berlin-based initiative/community. The site features scroll-triggered animations and a beautiful, refined aesthetic.

**Live URL:** https://kirchehoch3.berlin

---

## Design Direction: Kinfolk Aesthetic

The visual language follows the **Kinfolk aesthetic** - characterized by:

- **Minimalism & Whitespace** - Generous negative space, breathing room
- **Elegant Typography** - Refined, readable typefaces with careful hierarchy
- **Muted, Natural Palette** - Soft earth tones, warm neutrals, subtle accents
- **Organic Feel** - Natural textures, rounded elements, flowing layouts
- **High-Quality Imagery** - Thoughtful photography, cinematic feel
- **Subtle Interactions** - Gentle animations that enhance without distracting
- **Clean Composition** - Balanced, purposeful layouts with visual breathing room

### Visual References
- Kinfolk Magazine aesthetic
- Modern editorial design
- Scandinavian minimalism
- Warm, inviting, human-centered

---

## Technical Requirements

### Performance (Critical)
- **Target:** 90+ Lighthouse score on all metrics
- **Fast First Paint** - Critical CSS inline, minimal blocking resources
- **Lazy Loading** - Images and heavy content loaded on demand
- **Optimized Assets** - Compressed images, minified code
- **No Heavy Dependencies** - Vanilla JS where possible, minimal frameworks
- **Works flawlessly on low-end devices and slow connections**

### Mobile-First Responsive
- Mobile is the primary consideration, then scale up
- Touch-friendly interactions (minimum 44px tap targets)
- Fluid typography and spacing
- Breakpoints: 375px (mobile) → 768px (tablet) → 1024px (desktop) → 1440px+ (large)

### Scroll Animations
- **GSAP (GreenSock)** for all animations - industry standard, highly performant
- **ScrollTrigger** plugin for scroll-driven animations
- Hardware-accelerated transforms for smooth 60fps
- Respect `prefers-reduced-motion` for accessibility
- Animations should feel natural and gentle - Kinfolk aesthetic, not flashy
- Batch animations efficiently, avoid layout thrashing

---

## WordPress Compatibility Strategy

### Phase 1: Static HTML (Current)
- Build semantic, accessible HTML first
- Clean, well-structured markup
- BEM or similar naming conventions for CSS classes
- Document component structure clearly

### Phase 2: Gutenberg Conversion (Future)
- Structure HTML as reusable **blocks/sections**
- Each major section = potential Gutenberg block
- Use data attributes or clear class patterns for block identification
- Consider dynamic content placeholders (titles, text, images)
- Plan for WordPress theme integration

### Block Structure Planning
```
- Hero Section → Gutenberg: Hero Block
- About Section → Gutenberg: Content Block
- Features/Services → Gutenberg: Card Grid Block
- Testimonials → Gutenberg: Testimonial Slider Block
- Contact/CTA → Gutenberg: Call-to-Action Block
- Footer → Gutenberg: Footer Block
```

---

## Code Standards

### HTML
- Semantic HTML5 elements
- Accessible (ARIA labels where needed)
- Well-commented section boundaries
- Schema.org markup for SEO

### CSS
- CSS Custom Properties (variables) for theming
- Mobile-first media queries
- No `!important` unless absolutely necessary
- Logical properties for RTL readiness
- Prefer CSS animations over JS where possible

### JavaScript
- **GSAP** for all animations (core + ScrollTrigger + plugins as needed)
- Progressive enhancement approach
- No jQuery dependencies
- Modular, reusable functions
- Tree-shake unused GSAP features in production builds

---

## File Structure

```
/
├── index.html          # Main entry point
├── css/
│   ├── styles.css      # Main stylesheet
│   └── critical.css    # Above-the-fold styles (inline in head)
├── js/
│   ├── main.js         # Main JavaScript (GSAP animations, interactions)
│   └── gsap.min.js     # GSAP core (or CDN)
├── images/
│   └── ...             # Optimized images (WebP with fallbacks)
└── CLAUDE.md           # This file
```

## Dependencies

- **GSAP** (GreenSock Animation Platform) - Core animation library
  - ScrollTrigger plugin for scroll-driven animations
  - Consider using CDN or self-hosted for performance

---

## Key Success Metrics

1. **Performance:** Sub-2s load time on 3G
2. **Accessibility:** WCAG 2.1 AA compliance
3. **Lighthouse:** 90+ across all categories
4. **Mobile:** Perfect experience on devices from iPhone SE to iPad Pro
5. **Aesthetics:** Clean, refined, award-worthy visual design

---

## Notes for Future Development

- Keep animations subtle and purposeful - this is Kinfolk, not a tech startup landing page
- Every design decision should feel intentional and calm
- Test on real devices frequently, especially low-end Android phones
- Consider dark mode support (CSS custom properties make this easy)
- Plan internationalization (i18n) structure for potential multilingual support

---

## CMS Architecture (Strapi v5)

### Overview
The `cms/` subdirectory contains a Strapi v5 headless CMS project using SQLite for local development. It provides a REST API that the frontend fetches content from.

**Stack:**
- Strapi v5 (TypeScript scaffolding, JS content types)
- SQLite (development) — swap for PostgreSQL in production
- Local disk storage for media uploads (swap for S3 in production)

### Starting the CMS

```bash
cd cms && npm run develop
```

The admin panel will be available at `http://localhost:1337/admin`. On first run you will be prompted to create an admin account.

### REST API Base URL

```
http://localhost:1337/api/
```

### Key Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/homepage?populate=*` | Homepage section content |
| `GET /api/events?sort=order:asc&populate=*` | Events list sorted by order field |
| `GET /api/gallery-images?sort=order:asc&populate=*` | Gallery images sorted by order |
| `GET /api/site-settings?populate=*` | Site-wide settings (name, contact, links) |
| `GET /api/pages?filters[slug][$eq]={slug}&populate=*` | Single page by slug |

### Content Types

| Name | Kind | Description |
|---|---|---|
| `site-settings` | Single Type | Global config: site name, address, phone, email, hero slogan, marquee text |
| `homepage` | Single Type | Vision and gatherings section copy |
| `event` | Collection | Church events with schedule, location, description, sort order |
| `gallery-image` | Collection | Gallery photos with alt text, caption, sort order |
| `page` | Collection | Generic CMS pages with slug, richtext content, hero image |

### Making Endpoints Public

By default all Strapi API endpoints require an API token. To allow unauthenticated frontend access:

**Option A — Public Role Permissions (recommended for read-only content):**
1. Go to Admin UI: Settings > Users & Permissions Plugin > Roles > Public
2. For each content type, enable `find` and `findOne` actions
3. Save — the endpoints are now publicly readable without a token

**Option B — API Token (recommended for server-side or CI fetches):**
1. Go to Admin UI: Settings > API Tokens > Create new API Token
2. Set type to "Read-only", select the relevant content types
3. Pass the token as a header: `Authorization: Bearer <token>`

### Frontend Integration Example

```js
// js/cms.js — fetch homepage content from Strapi
const CMS_BASE = 'http://localhost:1337/api';

async function fetchHomepage() {
  const res = await fetch(`${CMS_BASE}/homepage?populate=*`);
  if (!res.ok) throw new Error(`CMS error: ${res.status}`);
  const { data } = await res.json();
  return data;
}

async function fetchEvents() {
  const res = await fetch(`${CMS_BASE}/events?sort=order:asc&populate=*`);
  if (!res.ok) throw new Error(`CMS error: ${res.status}`);
  const { data } = await res.json();
  return data;
}
```

### Environment Variables

Copy `cms/.env.example` to `cms/.env` and set real secret values before running. Never commit `cms/.env`. The `.gitignore` at the worktree root already excludes it.

### Production Checklist

- Switch database to PostgreSQL (update `cms/config/database.ts`)
- Switch media storage to AWS S3 or Cloudflare R2 (update `cms/config/plugins.ts`)
- Set strong, unique values for all secrets in `.env`
- Enable HTTPS and update CORS origins in `cms/config/middlewares.ts`
- Use API Tokens (read-only) instead of Public role for production frontend calls
