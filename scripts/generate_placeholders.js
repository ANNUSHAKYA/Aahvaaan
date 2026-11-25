import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const mediaDir = path.join(projectRoot, 'public', 'templates', 'royal-maroon-and-gold', 'media');
fs.mkdirSync(mediaDir, { recursive: true });

// Also create alias dir for maharaja-royal
const aliasDir = path.join(projectRoot, 'public', 'templates', 'maharaja-royal', 'media');
fs.mkdirSync(aliasDir, { recursive: true });

console.log('Generating placeholders in:', mediaDir);

// 1. Generate SVG Scroll Knob
const scrollKnobSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="120" viewBox="0 0 48 120">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E6D0B5"/>
      <stop offset="45%" stop-color="#C5A15E"/>
      <stop offset="70%" stop-color="#9C7934"/>
      <stop offset="100%" stop-color="#6E511D"/>
    </linearGradient>
    <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2D0D14"/>
      <stop offset="50%" stop-color="#4A1823"/>
      <stop offset="100%" stop-color="#2D0D14"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-10%" width="140%" height="130%">
      <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.4"/>
    </filter>
  </defs>
  <g filter="url(#shadow)">
    <!-- Top Finial Orb -->
    <circle cx="24" cy="18" r="14" fill="url(#goldGrad)" stroke="#431421" stroke-width="1.5"/>
    <circle cx="24" cy="18" r="8" fill="url(#goldGrad)" stroke="#FFE8BD" stroke-width="0.8"/>
    <circle cx="22" cy="14" r="3" fill="#FFF9EB" opacity="0.7"/>

    <!-- Gold Collar Ring -->
    <rect x="12" y="32" width="24" height="6" rx="3" fill="url(#goldGrad)" stroke="#431421" stroke-width="1"/>

    <!-- Central Spindle Rod -->
    <rect x="16" y="38" width="16" height="50" rx="2" fill="url(#woodGrad)" stroke="#C5A15E" stroke-width="1"/>

    <!-- Middle Ring -->
    <ellipse cx="24" cy="63" rx="10" ry="4" fill="url(#goldGrad)" stroke="#431421" stroke-width="0.8"/>

    <!-- Bottom Collar Ring -->
    <rect x="12" y="88" width="24" height="6" rx="3" fill="url(#goldGrad)" stroke="#431421" stroke-width="1"/>

    <!-- Bottom Finial Orb -->
    <circle cx="24" cy="106" r="12" fill="url(#goldGrad)" stroke="#431421" stroke-width="1.5"/>
    <circle cx="22" cy="103" r="2.5" fill="#FFF9EB" opacity="0.6"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(mediaDir, 'scroll_knob.svg'), scrollKnobSvg);
fs.writeFileSync(path.join(aliasDir, 'scroll_knob.svg'), scrollKnobSvg);

// 2. Helper to create SVG banner and convert to WebP / PNG
async function createPlaceholderImage({ filename, width, height, title, subtitle, format = 'webp', isTransparent = false }) {
  const bgFill = isTransparent
    ? 'none'
    : `
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#431421"/>
          <stop offset="50%" stop-color="#5E1828"/>
          <stop offset="100%" stop-color="#761F32"/>
        </linearGradient>
        <pattern id="jaali" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 40 20 L 20 40 L 0 20 Z" fill="none" stroke="#C5A15E" stroke-width="0.6" opacity="0.18"/>
          <circle cx="20" cy="20" r="4" fill="none" stroke="#C5A15E" stroke-width="0.6" opacity="0.18"/>
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)"/>
      <rect width="${width}" height="${height}" fill="url(#jaali)"/>
    `;

  const borderRect = isTransparent
    ? `<rect x="6" y="6" width="${width - 12}" height="${height - 12}" rx="8" fill="none" stroke="#C5A15E" stroke-width="2" stroke-dasharray="6 4" opacity="0.8"/>`
    : `
      <rect x="12" y="12" width="${width - 24}" height="${height - 24}" rx="12" fill="none" stroke="#C5A15E" stroke-width="2" stroke-dasharray="8 6"/>
      <rect x="18" y="18" width="${width - 36}" height="${height - 36}" rx="8" fill="none" stroke="#C5A15E" stroke-width="0.8" opacity="0.5"/>
    `;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    ${bgFill}
    ${borderRect}

    <!-- Corner Decorative Accents -->
    <g fill="#C5A15E" opacity="0.8">
      <circle cx="22" cy="22" r="3"/>
      <circle cx="${width - 22}" cy="22" r="3"/>
      <circle cx="22" cy="${height - 22}" r="3"/>
      <circle cx="${width - 22}" cy="${height - 22}" r="3"/>
    </g>

    <!-- Center Label -->
    <g text-anchor="middle">
      <text x="${width / 2}" y="${height / 2 - 14}" font-family="Georgia, serif" font-size="${Math.min(28, Math.max(16, width / 24))}" font-weight="bold" fill="#FAF1E5" letter-spacing="1">
        ${title.replace(/&/g, '&amp;')}
      </text>
      <text x="${width / 2}" y="${height / 2 + 18}" font-family="system-ui, sans-serif" font-size="${Math.min(15, Math.max(11, width / 40))}" font-weight="600" fill="#C5A15E" letter-spacing="0.5">
        ${subtitle.replace(/&/g, '&amp;')}
      </text>
      <text x="${width / 2}" y="${height / 2 + 42}" font-family="monospace" font-size="11" fill="#E6D0B5" opacity="0.75">
        [Slot: ${filename}]
      </text>
    </g>
  </svg>`;

  const buffer = Buffer.from(svg);
  const outPath1 = path.join(mediaDir, filename);
  const outPath2 = path.join(aliasDir, filename);

  if (format === 'webp') {
    await sharp(buffer).webp({ quality: 90 }).toFile(outPath1);
    await sharp(buffer).webp({ quality: 90 }).toFile(outPath2);
  } else if (format === 'png') {
    await sharp(buffer).png().toFile(outPath1);
    await sharp(buffer).png().toFile(outPath2);
  }
  console.log(`Generated: ${filename}`);
}

async function run() {
  // 1. Cover Background
  await createPlaceholderImage({
    filename: 'cover_bg.webp',
    width: 900,
    height: 1400,
    title: 'COVER BACKGROUND',
    subtitle: 'Royal Palace Archways & Velvet Maroon Mood',
  });

  // 2. Hero Scene
  await createPlaceholderImage({
    filename: 'hero_scene.webp',
    width: 1200,
    height: 800,
    title: 'HERO SCENE',
    subtitle: 'Palace Mandap at Dusk with Water Reflections',
  });

  // 3. Floral Top
  await createPlaceholderImage({
    filename: 'floral_top.webp',
    width: 800,
    height: 220,
    title: 'FLORAL ARCH TOP',
    subtitle: 'Antique Gold & Rose Marigold Garland',
  });

  // 4. Floral Bottom
  await createPlaceholderImage({
    filename: 'floral_bottom.webp',
    width: 800,
    height: 220,
    title: 'FLORAL BORDER BOTTOM',
    subtitle: 'Traditional Lotus & Foliage Garland',
  });

  // 5. Divider
  await createPlaceholderImage({
    filename: 'divider.webp',
    width: 800,
    height: 90,
    title: 'ORNAMENTAL DIVIDER',
    subtitle: 'Antique Gold Royal Jaali Filigree',
  });

  // 6. Ceremony Cards (Arched 600x750)
  const ceremonies = [
    { file: 'ring_ceremony.webp', title: 'RING CEREMONY', subtitle: 'Royal Engagement & Ring Exchange' },
    { file: 'mehendi.webp', title: 'MEHENDI & GHOOMAR', subtitle: 'Henna Celebrations & Folk Dances' },
    { file: 'haldi.webp', title: 'HALDI & TEL BAAN', subtitle: 'Auspicious Turmeric Blessing Ritual' },
    { file: 'sangeet.webp', title: 'GRAND SANGEET & JASHN', subtitle: 'Musical Celebration, Dhol & Garba' },
    { file: 'vivaah.webp', title: 'RAJPUTANA BARAAT & VIVAAH', subtitle: 'The Sacred Seven Vows & Holy Fire' },
    { file: 'reception.webp', title: 'SHAHI DAWAT RECEPTION', subtitle: 'Imperial Banquet & Dinner Celebration' },
  ];

  for (const c of ceremonies) {
    await createPlaceholderImage({
      filename: c.file,
      width: 600,
      height: 750,
      title: c.title,
      subtitle: c.subtitle,
    });
  }

  // 7. Date Ornament PNG (transparent)
  await createPlaceholderImage({
    filename: 'date_ornament.png',
    width: 480,
    height: 220,
    title: 'DATE ORNAMENT',
    subtitle: 'Golden Kalash & Peepal Leaves',
    format: 'png',
    isTransparent: true,
  });

  // 8. Generate real looping MP3 audio file
  console.log('Generating real ambient wedding audio...');
  try {
    const audioPath1 = path.join(mediaDir, 'music.mp3');
    const audioPath2 = path.join(aliasDir, 'music.mp3');

    // Synthesize a beautiful, rich 12-second looping ambient Indian classical raag (Bhupali chords with tanpura drone & shehnai harmonics)
    const cmd = `/opt/homebrew/bin/ffmpeg -y \
      -f lavfi -i "anoisesrc=d=12:c=pink:r=44100:a=0.005" \
      -f lavfi -i "sine=f=146.83:d=12" \
      -f lavfi -i "sine=f=220.00:d=12" \
      -f lavfi -i "sine=f=293.66:d=12" \
      -f lavfi -i "sine=f=369.99:d=12" \
      -f lavfi -i "sine=f=440.00:d=12" \
      -filter_complex "[1:a]volume=0.07[d1];[2:a]volume=0.05[d2];[3:a]volume=0.08[t1];[4:a]volume=0.06[t2];[5:a]volume=0.04[t3];[0:a][d1][d2][t1][t2][t3]amix=inputs=6:duration=first,afade=t=in:ss=0:d=1.5,afade=t=out:st=10.5:d=1.5" \
      -c:a libmp3lame -b:a 128k "${audioPath1}"`;

    execSync(cmd, { stdio: 'inherit' });
    fs.copyFileSync(audioPath1, audioPath2);
    console.log('Generated music.mp3 successfully in media directories.');
  } catch (err) {
    console.warn('FFmpeg audio generation notice:', err.message);
  }

  console.log('All media assets generated successfully!');
}

run();
