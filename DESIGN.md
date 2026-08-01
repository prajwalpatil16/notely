# Design System & UI Styling — Notely

Notely uses a premium "warm paper" aesthetic with clean lines, soft textures, and vibrant accent highlights.

---

## 1. Color Palette

The colors are configured as dynamic CSS variables to support light and dark mode toggles seamlessly:

### Accent Colors
* **Brand Accent**: `#D97745` (warm terracotta orange) - used for primary CTAs, active highlights, and action buttons.
* **Secondary Accent**: `#5D8A63` (soft foliage green) - used for AI highlights, success banners, and helper states.

### Warm Paper Palette (Light Mode)
* **Canvas Base (`--bg-canvas`)**: `#FAF7F2` (warm cream canvas)
* **Card Base (`--bg-card`)**: `#FFFFFF` (clean white)
* **Card Alt (`--bg-card-alt`)**: `#FEFCF9` (notebook sheet cream)
* **Border Subtle (`--border-subtle`)**: `#E7DED3` (soft cardboard gray)
* **Text Primary (`--text-primary`)**: `#1F1F1F` (rich charcoal black)
* **Text Muted (`--text-muted`)**: `#7A7870` (washed-out slate)

---

## 2. Typography

* **Headings**: `Outfit`, sans-serif (Google Fonts) - heavy weight, tight tracking, premium modern editorial look.
* **Body Text**: `Inter`, sans-serif (Google Fonts) - high readability, balanced line spacing.
* **Monospace**: `JetBrains Mono` - used for audit log timestamps and version tokens.

---

## 3. Core UI Components

### Note Editor
* Styled to look like a clean notebook sheet overlay.
* Faint horizontal lines are generated dynamically via gradients:
  `linear-gradient(#6B6B6B 1px, transparent 1px)`

### Sidebar
* Layout uses a left-aligned panel styled with `#FAF7F2` cream backing, a right-aligned thin cardboard border `#E7DED3`, and high-contrast charcoal black labels.
* Renders search inputs, folders list, templates picker, and the user profile selector.

### AI Chat Panel
* Drawer floats from the right of the screen on desktop with custom entry animations:
  `animate-in slide-in-from-right-10 duration-250`
* Styled with a distinct green-tinted header highlight (`#EDF3EE` / `#4D7C5A`) indicating active AI companion state.
