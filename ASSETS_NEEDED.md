# Aahvaaan — Artwork & Media Assets Pipeline: Maharaja Royal Maroon

This document outlines all artwork and audio asset slots for the **Maharaja Royal Maroon & Gold** interactive wedding invitation (`/public/templates/royal-maroon-and-gold/media/`).

Temporary high-visibility placeholders are currently active in all slots. When you generate or commission real illustrated assets, place them in `/public/templates/royal-maroon-and-gold/media/` using the exact filenames listed below.

---

## 🎨 Global Art Direction & Aesthetic Style Guide

To guarantee a cohesive, museum-grade visual aesthetic across every section of the invitation, all prompts should adhere to the following shared style rules:

* **Colour Palette:**
  * Royal Maroon (`#761F32`)
  * Deep Burgundy (`#431421`)
  * Antique Gold & Zari Foil (`#C5A15E`)
  * Warm Cream & Ivory (`#FAF1E5`)
  * Champagne Beige (`#E6D0B5`)
* **Artistic Style:**
  * Traditional Rajasthani Rajputana royal miniature painting merged with contemporary luxury digital gouache illustration.
  * Delicate gold foil filigree, Jharokha arched windows, intricate floral jaali lattices, and subtle warm candlelight at dusk.
  * High-end royal wedding stationery aesthetic, rich textural depth, elegant brushstrokes, no photorealism or photographic human faces (keep silhouettes, architectural grandeur, and decorative royal motifs).

---

## 🖼️ Asset Slots & Text-to-Image Generation Prompts

### 1. `cover_bg.webp` — Invitation Cover Background
* **Slot Path:** `/public/templates/royal-maroon-and-gold/media/cover_bg.webp`
* **Recommended Dimensions:** `900 × 1400 px` (Aspect Ratio: `9:14` or `9:16` vertical)
* **Format:** WebP (lossless or 90% quality)
* **Placement:** Fullscreen initial envelope cover reveal with "श्री गणेशाय नमः" and "Tap to open" button.
* **Prompt (Midjourney / Imagen / DALL-E 3):**
  > *Vertical royal Indian wedding stationery background, ornate Rajputana palace courtyard at dusk, deep velvety royal maroon `#761F32` and burgundy `#431421` textured canvas, grand scalloped sandstone archway framed with antique gold filigree `#C5A15E`, delicate hanging marigold and jasmine garlands, glowing brass lanterns casting warm ambient light, soft bokeh, opulent royal heritage aesthetic, gouache and gold leaf painting, clean center area for typography, 8k resolution, elegant masterpiece --ar 9:14 --v 6.1*

---

### 2. `hero_scene.webp` — Illustrated Venue & Mandap Scene
* **Slot Path:** `/public/templates/royal-maroon-and-gold/media/hero_scene.webp`
* **Recommended Dimensions:** `1200 × 800 px` (Aspect Ratio: `3:2` landscape)
* **Format:** WebP
* **Placement:** Section 2 Hero Background behind the couple names.
* **Prompt:**
  > *Panoramic royal Rajasthani palace lakeside mandap at sunset, Lake Pichola Udaipur or Rambagh Palace Jaipur aesthetic, grand ornate carved stone pavilion draped with maroon silk and antique gold brocade, sacred havan fire pit glowing gently, floating rose petals and lit earthen diyas in calm reflective water, marble terraces, twilight pink and gold sky, elegant Indian miniature painting style with modern editorial lighting, 8k resolution --ar 3:2 --v 6.1*

---

### 3. `floral_top.webp` — Section Top Arch Ornament
* **Slot Path:** `/public/templates/royal-maroon-and-gold/media/floral_top.webp`
* **Recommended Dimensions:** `800 × 220 px` (Aspect Ratio: `4:1` horizontal banner)
* **Format:** WebP (with alpha transparency)
* **Placement:** Top decorative header garland above headings and family cards.
* **Prompt:**
  > *Horizontal ornamental Indian wedding garland arch, top border, lush crimson velvet roses, fragrant orange marigolds, golden champa blossoms, intricate antique gold zari leaves and dangling pearl tassels, symmetrical royal Rajasthani Toran motif, transparent background, isolated, luxury wedding invitation ornament --ar 4:1 --v 6.1*

---

### 4. `floral_bottom.webp` — Section Bottom Garland
* **Slot Path:** `/public/templates/royal-maroon-and-gold/media/floral_bottom.webp`
* **Recommended Dimensions:** `800 × 220 px` (Aspect Ratio: `4:1` horizontal banner)
* **Format:** WebP (with alpha transparency)
* **Placement:** Bottom flourishing footer divider under scrolls and story sections.
* **Prompt:**
  > *Horizontal Indian royal botanical border, bottom divider, lush blooming lotus blossoms, antique gold paisley curling vines, deep maroon rosebuds, delicate gold foil flecks, isolated on transparent background, symmetrical luxury stationery embellishment --ar 4:1 --v 6.1*

---

### 5. `scroll_knob.svg` — Parchment Scroll Wooden Finial Knobs
* **Slot Path:** `/public/templates/royal-maroon-and-gold/media/scroll_knob.svg`
* **Recommended Dimensions:** `48 × 120 px` (Vector SVG)
* **Format:** SVG
* **Placement:** Left and right wooden/gold scroll finials for the Groom & Bride unrolling parchment scrolls.
* **Note:** An original hand-crafted SVG finial with antique gold gradients and drop shadows is already installed and fully responsive.

---

### 6. `divider.webp` — Royal Jaali Filigree Divider
* **Slot Path:** `/public/templates/royal-maroon-and-gold/media/divider.webp`
* **Recommended Dimensions:** `800 × 90 px` (Aspect Ratio: `9:1` wide strip)
* **Format:** WebP (with alpha transparency)
* **Placement:** Subtle separator between sections throughout the scroll experience.
* **Prompt:**
  > *Horizontal intricate royal Indian jaali divider, antique gold foil filigree `#C5A15E`, delicate floral arabesque and elephant motifs, symmetrical ornamental border, clean transparent background, vector-like crisp luxury detailing --ar 9:1 --v 6.1*

---

### 7. Ceremony Cards Illustrations (Arched 600 × 750 px, Aspect Ratio 4:5)

Each ceremony card has its own dedicated illustration highlighting the unique auspicious ritual:

#### A. `ring_ceremony.webp` — Ring Ceremony & Engagement
* **Slot:** `/public/templates/royal-maroon-and-gold/media/ring_ceremony.webp`
* **Prompt:**
  > *Arched royal Indian engagement illustration, antique gold and velvet ring cushion with diamond solitaire rings, sparkling fairy lights, delicate champagne flutes, velvet maroon drapes, royal palace terrace background, elegant warm golden lighting, Indian miniature gouache painting style --ar 4:5 --v 6.1*

#### B. `mehendi.webp` — Mehendi & Ghoomar
* **Slot:** `/public/templates/royal-maroon-and-gold/media/mehendi.webp`
* **Prompt:**
  > *Arched Indian Mehendi ceremony painting, brass thali with fresh henna cones and marigold flowers, colorful silk cushions, swirling Ghoomar dancer silhouettes in the palace courtyard, vibrant yet royal maroon and gold tones, festive auspicious celebration --ar 4:5 --v 6.1*

#### C. `haldi.webp` — Haldi & Tel Baan
* **Slot:** `/public/templates/royal-maroon-and-gold/media/haldi.webp`
* **Prompt:**
  > *Arched traditional Haldi ritual painting, carved brass urli filled with vibrant turmeric paste and floating yellow marigold petals, silver sprinkler, raw silk drapery in ochre and maroon, warm auspicious sunlight streaming into palace courtyard --ar 4:5 --v 6.1*

#### D. `sangeet.webp` — Grand Sangeet & Jashn
* **Slot:** `/public/templates/royal-maroon-and-gold/media/sangeet.webp`
* **Prompt:**
  > *Arched grand Indian Sangeet celebration, ornate wooden dhol with gold embellishments, classical sitar and tabla resting on an imperial Persian rug, glowing crystal chandeliers, subtle fireworks lighting up a palace night sky --ar 4:5 --v 6.1*

#### E. `vivaah.webp` — Rajputana Baraat & Vivah
* **Slot:** `/public/templates/royal-maroon-and-gold/media/vivaah.webp`
* **Prompt:**
  > *Arched royal Hindu wedding ritual, holy fire Agni kund glowing on carved marble altar, gold vermillion thali, garlands of red roses and pearls, groom's ceremonial turban with kalgi plume, majestic palace mandap setting --ar 4:5 --v 6.1*

#### F. `reception.webp` — Shahi Dawat Reception
* **Slot:** `/public/templates/royal-maroon-and-gold/media/reception.webp`
* **Prompt:**
  > *Arched royal wedding reception banquet, majestic ballroom illuminated by grand chandeliers, imperial dining table with silver cloches, crystal glassware, wine-red roses and antique candelabras, opulent celebration feast --ar 4:5 --v 6.1*

---

### 8. `date_ornament.png` — Auspicious Date Seal & Kalash
* **Slot Path:** `/public/templates/royal-maroon-and-gold/media/date_ornament.png`
* **Recommended Dimensions:** `480 × 220 px`
* **Format:** PNG (with transparent background)
* **Placement:** Header ornament above the Date Reveal flippable boxes.
* **Prompt:**
  > *Traditional Indian auspicious gold kalash with coconut, mango leaves, and sacred swastika motif, flanked by twin royal peacocks, antique gold foil texture `#C5A15E`, isolated on pure transparent background, luxury wedding invitation stamp --ar 2:1 --v 6.1*

---

### 9. `music.mp3` — Ambient Wedding Shehnai & Sitar Theme
* **Slot Path:** `/public/templates/royal-maroon-and-gold/media/music.mp3`
* **Format:** MP3 (128 kbps, 44.1 kHz, normalized, ~1-2 MB)
* **Duration:** 30–90 seconds seamless loop with gentle fade envelope.
* **Audio Direction:**
  * Gentle, soul-stirring Indian classical melody (Raag Bhupali or Raag Yaman).
  * Melodious Shehnai lead accompanied by gentle Tanpura drone, Santoor arpeggios, and soft sitar strums.
  * No harsh percussions or modern electronic beats; peaceful, auspicious, and royal.
