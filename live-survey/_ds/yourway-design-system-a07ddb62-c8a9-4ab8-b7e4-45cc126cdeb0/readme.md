# Yourway Design System

**Version:** 1.0  
**Sources:** GitHub repo `yourwai-frontend` (yourwai-frontend-main/), uploaded brand assets  
**Stack:** React 18, Chakra UI v3, `@linc-inc/yw-ui` (private package)

---

## About Yourway

Yourway (yourwaylearning.com) is an AI-powered teaching platform that helps educators create, share, and deploy generative AI tools, assistants, and student activities. It is built for teachers, school leaders, tech coordinators, and consultants.

### Core Products

| Surface | Description |
|---------|-------------|
| **Tools** | 100+ AI-powered content generators (quizzes, lesson plans, rubrics…) |
| **Assistants** | Custom AI bots trained on educator context |
| **Activities** | AI-guided student-facing learning experiences ("Spark") |
| **Chat (Beans)** | Central chat interface — "Ask Beans" — the brand's AI mascot |
| **My Drive** | Document and content version management |

### Brand Mascot — Beans

"Beans" is the brand's AI persona — warm, helpful, a bit playful. Chat UI is framed as "Chat with Beans." All empty states, loading states, and onboarding reference Beans via Lottie animations and illustrations hosted at a DigitalOcean Spaces CDN (`VITE_ASSETS_SPACE_URL`).

---

## CONTENT FUNDAMENTALS

### Tone & Voice
- **Warm and direct.** Never cold, never verbose. "Ask Beans…" not "Enter your query."
- **Action-first.** Every CTA starts with a verb: "Get Started", "Log In", "Upgrade to Pro", "Use Now".
- **Educator-centric.** Speaks *to* teachers, not about them. Uses "your students", "your classroom".
- **Friendly confidence.** Acknowledges complexity but never overwhelms.

### Casing
- **Title case** for main CTAs and nav labels: "Log In", "Get Started", "My Drive", "AI Services"
- **Sentence case** for body copy and descriptions
- **ALL CAPS** only for badge labels (PRO, NEW, BETA, DRAFT) and section group headers in sidebar

### Pronouns
- Uses **you/your** for the user (never "the user")
- The platform often speaks as **Beans** in first-person: "I'm working on your content…", "Ask Beans"
- Avoids passive voice

### Emoji
- **Not used in UI copy.** No emoji in buttons, labels, nav, or form fields.
- Occasionally appears in success/celebration microcopy: "Your content has been successfully generated. 🎉" (rare, contextual)

### Key Copy Examples
```
"What do you want to do?"
"Complete 90% of your work in 10% of the time."
"Quickly generate tailored teaching resources."
"Ask Beans…"
"Chat with Beans"
"The best way to teach"
"Sign up to the future of education"
"Tools: Create what you need—instantly"
```

### i18n
Full English + Spanish (es) localization via i18next. All UI strings live in `/public/locales/{en,es}/`.

---

## VISUAL FOUNDATIONS

### Colors
- **Primary action:** Trustworthy Blue `#4260E6` — buttons, links, active states, focus rings
- **Deep authority:** Smart Blue `#12317C` — tag backgrounds, secondary brand moments
- **App background:** `#F4F6FB` — the light periwinkle-gray that fills the whole app shell
- **Surface/Card:** `#FFFFFF` — cards sit on white, elevated from the app BG via shadow
- **Text high:** `#1E2327` — nearly-black, all body and heading copy
- **PRO/Upgrade:** Approachable Yellow `#F9D354` — the only warm CTA, reserved for upgrade prompts
- **Success:** Helpful Green `#A1D788` — not saturated; muted and friendly
- **Error:** Inspiring Red `#FA606A` — form errors, destructive actions
- Accent palette (Purple, Pink, Orange, Gleeful Green) used for category chips and empty-state illustrations

### Typography
- **Primary font:** Rubik (variable, 300–900) — all UI text; chosen for its rounded friendliness
- **Slide body:** Roboto Slab — used inside the presentation/activity builder
- **Slide title:** Overlock — display weight for slide headers
- **Monospace:** Source Code Pro — code blocks, technical labels

Type scale is set in `rem` on a 16px base. Minimum body copy: `0.875rem` (14px). Labels/captions: `0.75rem` (12px), uppercase + wide tracking.

### Spacing
4px base grid (`--space-1` = 4px). Component padding uses multiples of 4. Cards use `16px` padding (`--space-4`). Sidebar width: `220px` collapsed to `80px`.

### Backgrounds
- No full-bleed imagery in the app shell
- Auth pages use a background illustration (coffee cup / Beans character) plus a large decorative BgSmileIcon at ~50rem, rotated
- Section backgrounds: `#F2F5FE` (tinted blue-white) for chat active state

### Cards
- White background, `8px` radius (`--radius-lg`), subtle box-shadow `1px 2px 6px -2px rgba(0,0,0,0.12)`
- Hover: shadow deepens + `translateY(-1px)` lift
- No border (shadow provides separation from `#F4F6FB` BG)
- Dense: title (truncated), subtitle (author), 2–3 line body clamp

### Buttons
- `border-radius: 6px` (md)
- Solid primary: `#4260E6` fill, white text
- Outline: `1.5px` border, blue text
- Ghost: no border, medium-gray text
- PRO/Upgrade: Yellow `#F9D354` fill, dark text — only appears in sidebar upgrade slot
- No pill-shaped buttons (reserved for filter chips / tags)

### Tags & Pills
- Filter pills: `border-radius: 9999px` (full pill), `1.5px` border
- Category badges: `border-radius: 4px` (sm), colored bg matching category

### Hover & Press States
- Hover: background tint `rgba(66, 96, 230, 0.08)`, color shifts to blue
- Active/Press: no scale transform; color deepens
- Disabled: `opacity: 0.45`
- Transitions: `150ms ease` (fast interactions), `200ms ease` (page-level)

### Borders
- Default: `1px solid #D7DCE0`
- Input focus: `1.5px solid #4260E6` + `box-shadow: 0 0 0 3px rgba(66,96,230,0.25)`
- Sidebar/header dividers: `1px solid #E9E9E9`

### Corner Radii
- `xs 2px` — rare
- `sm 4px` — sidebar items, badge chips ★ most common
- `md 6px` — buttons, inputs
- `lg 8px` — cards ★
- `xl 12px` — chat bubbles, chat container
- `full` — avatars, pills, filter chips

### Shadows
- Cards: `1px 2px 6px -2px rgba(0,0,0,0.12)` (sm)
- Hover cards: `0 4px 12px rgba(0,0,0,0.08)` (md)
- Modals/dropdowns: `0 8px 24px rgba(0,0,0,0.12)` (lg)
- Focus ring: `0 0 0 3px rgba(66,96,230,0.25)`

### Animation
- Lottie animations for mascot/character states (login, loading, empty states, celebrations)
- CSS transitions: `150ms`/`200ms` ease — no spring physics, no bounce
- Card hover: subtle `translateY(-1px)` + shadow deepening
- No decorative idle animations in the app shell

### Dark Mode
Fully supported via Chakra's `useColorModeValue`. Key swaps:
- App BG: `#F4F6FB` → `#1E2327`
- Surface: `#FFFFFF` → `#111315` (gray 800)
- Text: `#1E2327` → `#F1F2F4`

### Layout
- Fixed sidebar (220px) + full-height content area
- Header: fixed 64px tall, white, bottom-border
- Chat panel: fixed 340px right column on home screen
- Content area scrolls independently; sidebar/header are sticky
- Mobile: sidebar becomes a drawer; header shows hamburger + logo

### Imagery
- Illustrations: "Beans" character (anthropomorphized coffee bean), hosted on CDN
- Coffee cup illustrations for auth/onboarding pages
- No photography in core app UI
- No gradients in the app shell (plain flat colors)

### Iconography
See **ICONOGRAPHY** section below.

---

## ICONOGRAPHY

Icons come from the private `@linc-inc/yw-ui/icons` package — a custom React icon set re-exported from `src/icons/index.ts`. These are **not** a public CDN icon set.

### Usage in production code
```tsx
import { MenuIcon, YourwayLogoIcon, MessageAddIcon, CrownIcon, ArrowRightForwardIcon } from '@icons';
<Icon as={MenuIcon} boxSize="1.75rem" color="text-medium-emphasis" />
```

### In design system / prototypes
Because `@linc-inc/yw-ui` is a private package unavailable outside the repo, **use inline SVG or Lucide Icons** as a substitute in design artifacts.

Substitute CDN: [Lucide React](https://lucide.dev) — closest stroke weight/style match.

### Style
- Stroke-based, 2px weight, rounded linecaps/joins
- Size: `boxSize` prop (Chakra), typically `1rem`–`1.75rem`
- Color: inherits from parent (`currentColor`) via `color` prop
- No filled icons except `CrownIcon` (PRO badge) and `StarIcon` (favorites)

### Key icons used
| Icon | Usage |
|------|-------|
| `YourwayLogoIcon` | Sidebar logo mark (the "yw" interlocked paths) |
| `MenuIcon` | Mobile drawer trigger |
| `CrownIcon` | PRO badge |
| `MessageAddIcon` | New Chat button |
| `ArrowRightForwardIcon` | Form submit buttons |
| `UserIcon` | Account nav item |
| `BgSmileIcon` | Auth layout decorative background |

---

## FILE INDEX

```
styles.css                  ← Global entry point (@imports only)

tokens/
  colors.css                ← All color custom properties
  typography.css            ← Font-face + type scale tokens
  spacing.css               ← 4px grid spacing scale
  effects.css               ← Radii, shadows, transitions, z-index

assets/
  app-icon-blue-bg.svg      ← App icon on blue background
  app-icon-white-bg.svg     ← App icon on white background
  app-icon-monochrome-white.svg
  app-icon-monochrome-black.svg
  logo-circle-blue.svg      ← Circular mark, blue fill
  logo-circle-white.svg     ← Circular mark, white fill

components/core/
  Button.jsx / .d.ts        ← Primary button, all variants + sizes
  Badge.jsx / .d.ts         ← Status badges (PRO, NEW, BETA…)
  Input.jsx / .d.ts         ← Text input with label/hint/error
  Card.jsx / .d.ts          ← Resource card (tool/assistant/activity)
  Avatar.jsx / .d.ts        ← User avatar with initials fallback
  buttons.card.html         ← DS tab: Button + Badge specimens
  inputs.card.html          ← DS tab: Input specimens
  cards.card.html           ← DS tab: Card specimens
  avatars.card.html         ← DS tab: Avatar specimens

guidelines/
  colors-primary.card.html  ← Trustworthy Blue + Smart Blue swatches
  colors-neutrals.card.html ← Relatable Gray + backgrounds
  colors-accents.card.html  ← Full accent palette
  colors-semantic.card.html ← Success/Alert/Error/Info + text colors
  type-scale.card.html      ← Full Rubik type scale
  type-families.card.html   ← All four font families
  spacing-scale.card.html   ← 4px grid spacing bars
  effects-radii-shadows.card.html ← Radii + shadow tokens
  brand-logos.card.html     ← All logo/icon variants
  brand-personality.card.html ← Named color personalities

ui_kits/app/
  index.html                ← Interactive app shell: sidebar + header + chat + tool cards
```

---

## COMPONENTS

All components live in `components/core/`. Load via:
```html
<script src="path/to/_ds_bundle.js"></script>
<script type="text/babel">
  const { Button, Badge, Input, Card, Avatar, Tabs, TabList, Tab, TabPanel,
          Textarea, Progress, RadioGroup, Radio, Tooltip, Separator,
          Accordion, AccordionItem, Menu, MenuItem, MenuDivider } = window.YourwayDesignSystem_a07ddb;
</script>
```

### Primitives

| Component | Key Props | Notes |
|-----------|-----------|-------|
| `Button` | `variant` (solid/outline/ghost/danger/pro), `size` (xs/sm/md/lg), `disabled` | Primary action element |
| `Badge` | `variant` (default/pro/beta/success/error/new/draft/neutral), `size` | PRO gating, status, categories |
| `Input` | `label`, `placeholder`, `type`, `error`, `hint`, `disabled` | Text field with all states |
| `Textarea` | `label`, `placeholder`, `rows`, `error`, `hint`, `disabled` | Multi-line text input |
| `Card` | `title`, `subtitle`, `body`, `topBarActions`, `onClick`, `isPro` | Resource card (tools, assistants) |
| `Avatar` | `name`, `size` (xs/sm/md/lg/xl), `src` | Initials fallback |

### Navigation

| Component | Key Props | Notes |
|-----------|-----------|-------|
| `Tabs` | `defaultTab`, `onChange` | Wrap with `TabList` + `TabPanel` children |
| `TabList` | — | Container for `Tab` items |
| `Tab` | `value` | Single tab trigger |
| `TabPanel` | `value` | Content shown when tab is active |
| `Accordion` | `allowMultiple` | Wrap `AccordionItem` children |
| `AccordionItem` | `value`, `title` | Single collapsible section |
| `Menu` | `trigger`, `placement` (bottom-start/bottom-end/top-start) | Dropdown; wraps `MenuItem` + `MenuDivider` |
| `MenuItem` | `onClick`, `danger`, `disabled`, `icon` | Menu action row |
| `MenuDivider` | — | Horizontal separator inside menu |

### Feedback & Layout

| Component | Key Props | Notes |
|-----------|-----------|-------|
| `Progress` | `value`, `max`, `size` (xs/sm/md/lg), `color`, `label`, `showValue` | Completion bar |
| `Tooltip` | `label`, `placement` (top/bottom/left/right) | Hover reveal |
| `Separator` | `orientation` (horizontal/vertical) | Thin divider line |
| `RadioGroup` | `value`, `onChange`, `direction` (vertical/horizontal) | Wraps `Radio` children |
| `Radio` | `value`, `disabled` | Single radio option |

### Loading components in design artifacts
```html
<script src="path/to/_ds_bundle.js"></script>
<script type="text/babel">
  const { Button, Badge, Input, Card, Avatar } = window.YourwayDesignSystem_a07ddb;
</script>
```

---

## CAVEATS

- **`@linc-inc/yw-ui` is private** — production components live there (Button, IconButton, theme, hooks). This DS recreates the visual layer only; behavioral logic lives in the private package.
- **Illustrations not included** — Beans character illustrations are hosted on a private CDN (`VITE_ASSETS_SPACE_URL`). URLs are documented in `src/constants/images-urls.ts`.
- **Icon font not included** — Custom icons from `@linc-inc/yw-ui/icons` are not extracted. Use Lucide as a substitute in prototypes.
- **Dark mode not wired** — Token definitions cover both modes; component implementations in this DS are light-mode only.
- **Fonts via CDN** — Rubik, Roboto Slab, Overlock, Source Code Pro are loaded from Google Fonts. No local font files bundled.
