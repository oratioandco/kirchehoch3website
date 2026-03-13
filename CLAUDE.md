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
