# Design System: Los Tres Macarons

This document serves as the single source of truth for the **"Artisanal Pâtisserie"** design language of the **Los Tres Macarons** website. Use these design tokens and component guidelines to maintain a highly polished, consistent, and boutique experience across all desktop and mobile views.

---

## 1. Color Palette

Our color scheme is designed around a romantic, high-end French pâtisserie mood. It balances warm soft pastels with luxurious gold accents and high-contrast dark charcoal text.

| Role | Hex Code | Visual Description / Usage |
| :--- | :--- | :--- |
| **Primary (Blush)** | `#e75480` | Main theme color, badges, primary action background/borders, hover highlights. |
| **Secondary (Pink Pastel)** | `#ffb6c1` | Background tints, secondary buttons, card highlights, decorative gradients. |
| **Accent (Patisserie Gold)** | `#d4af37` | Luxury accents, ratings (stars), gradients, specialized buttons, headers. |
| **Accent (Pastel Mint)** | `#e8f5e9` | Success indicators, leaf motifs, organic/vegan flavor category labels. |
| **Background (Cream/White)** | `#ffffff` | Primary background, card containers, dropdown background. |
| **Soft Cream (Canvas Backdrop)** | `#fff9fa` | Outer page wrappers, section breaks, and alternate bento blocks. |
| **Text Dark (Charcoal)** | `#2d3748` | Main body text, headings, dark icons, labels. High contrast and highly readable. |
| **Text Light (Slate)** | `#718096` | Subtitles, helper text, timestamps, product weights, review counts. |

---

## 2. Typography

We pair whimsical display typography with clean, premium sans-serif typefaces to balance playfulness with professional clarity.

*   **Header Titles / Display Headings:**
    *   **Font Family:** `'Fredoka'`, cursive (primary display font)
    *   **Font Weights:** `700` (Bold), `600` (Semi-Bold)
    *   **Style:** Curved letterforms reminiscent of smooth pastry edges.
    *   **Alternate/Script Accent:** `'Great Vibes'`, cursive (used for elegant signatures, boutique callouts).
    *   **Editorial Serif (Proposed/Imported):** `'Playfair Display'`, serif (for sophisticated editorial copy or body quotes).

*   **Body & Administrative UI:**
    *   **Font Family:** `'Inter'`, system-ui, -apple-system, sans-serif
    *   **Font Weights:** `400` (Regular), `500` (Medium), `600` (Semi-Bold), `700` (Bold)
    *   **Usage:** Forms, inputs, tables, checkout modal text, user dashboard data.

---

## 3. Spacing & Grid System

Maintaining a boutique feel requires generous negative space so each item feels "gourmet" and breathing room is preserved.

*   **Page Wrapper Padding:**
    *   Desktop: `padding: 3rem 2rem;` (Max width restricted to `1400px` via `.app-container`)
    *   Mobile: `padding: 2rem 1rem;`
*   **Grid Layouts (Macaron Catalog):**
    *   Desktop: `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;`
    *   Mobile (768px): `grid-template-columns: repeat(2, 1fr); gap: 1rem;`
    *   Mobile Small (480px): `grid-template-columns: 1fr;`
*   **Vertical Spacing Rhythm:**
    *   Major section headers: `margin-top: 3rem; margin-bottom: 2rem;`

---

## 4. Component Patterns

### 4.1. Gourmet Product Cards
*   **Structure:** Rounded containers featuring high-quality photography, price badges, and subtle call-to-actions.
*   **Corner Radius:** `border-radius: 15px;`
*   **Border:** `1px solid #ddd` or `1px solid rgba(0, 0, 0, 0.05)`
*   **Shadow:** `box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);`
*   **Interactivity / Hover State:**
    ```css
    transition: transform 0.3s, box-shadow 0.3s;
    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    }
    ```

### 4.2. Buttons & Interaction States
*   **Pâtisserie Action Button (Primary):**
    *   Background: `#e75480` (Primary Blush) or `#4A90E2` (Ocean Blue accent, legacy)
    *   Border-Radius: `8px` or `25px` (Pill format)
    *   Transition: `transition: all 0.25s ease;`
    *   Hover: Scale scale factor of `1.03` with a soft glow shadow (`rgba(231, 84, 128, 0.35)`).
*   **Secondary/View Reviews Button:**
    *   Background: `transparent`
    *   Border: `1px solid var(--primary-color)`
    *   Color: `var(--primary-color)`
    *   Hover: Inverts background to full primary blush, white text.

### 4.3. Navigation & Overlays
*   **Desktop Navigation:**
    *   Sticky header height: `90px`
    *   White glassmorphism: `background-color: rgba(255, 255, 255, 0.98); backdrop-filter: blur(8px);`
    *   Item transition: Hover displays a slide-in bottom border line using `::after` transitions.
*   **Mobile Navigation:**
    *   Slide-out drawer width: `280px`
    *   Overlay backdrop: Semi-transparent black (`rgba(0, 0, 0, 0.5)`) with ease-in transitions.

---

## 5. Continuity Directives

1.  **Do Not Modify Header:** The current site header is off-limits. Its structural layout, brand text, menu toggles, and navigation drawer are strictly preserved.
2.  **Rounded Shapes:** Maintain soft, organic corners across all modals, input blocks, image crops, and buttons.
3.  **Color Integrity:** Never introduce bright, oversaturated primary colors (like lime green or harsh pure blue) except for designated pastel palettes. Use gold or soft blush for premium actions.
