// Chuyển ảnh gốc trong source-images thành WebP nhiều kích thước (public/images) + logo, favicon, ảnh chia sẻ.
// Chạy: npm run images
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'source-images/portfolio';
const OUT = 'public/images/portfolio';
const WIDTHS = [640, 1200, 2000];

// Tên gốc (bỏ đuôi) -> tên ngắn dùng trong src/data/portfolio.js
const NAMES = {
  'IMG_0861': 'prewedding-sunset-dip',
  'IMG_2236': 'island-cliff-sunset',
  'DSC_3764': 'wedding-beach-open-arms',
  'DSC_3696': 'wedding-beach-cheek-kiss',
  'IMG_2288': 'family-sunset-three',
  'IMG_0863': 'couple-sunset-kiss-waves',
  'DDH07823_(2)': 'lookbook-library-hat',
  'DSC_3593': 'family-lawn-play',
  'DSC_2455': 'island-sunset-rocks',
  'DSC_3815': 'wedding-kiss-bouquet',
  'IMG_2292': 'family-first-steps',
  'IMG_2238': 'portrait-rock-sunset',
  'IMG_2375': 'island-beach-trio',
  'IMG_2299': 'couple-maternity-kiss',
  'DDH07960_(2)': 'lookbook-lobby-front',
  'IMG_0858': 'prewedding-sunset-lift',
  'IMG_2290': 'family-mother-lift-baby',
  'IMG_2383': 'island-resort-bikes',
  'DSC_2476': 'portrait-sunset-rock-seated',
  'DSC_3913': 'wedding-walk-to-sea',
  'IMG_0865': 'prewedding-sunset-bouquet',
  'DSC_3704': 'wedding-beach-playful',
  'DSC_3753': 'wedding-beach-walk',
  'DSC_3755': 'wedding-beach-hand-in-hand',
  'DSC_3766': 'wedding-beach-embrace',
  'DSC_3827': 'wedding-beach-kiss',
  'DSC_3849': 'wedding-beach-joy',
  'DSC_3943': 'wedding-portrait-sea',
  'IMG_0862': 'couple-sunset-twirl',
  'IMG_0875': 'couple-roses-kiss',
  'IMG_2298': 'couple-pier-sunset',
  'IMG_2300': 'couple-maternity-embrace',
  'IMG_2301': 'couple-pier-together',
  'DSC_3377': 'family-resort-suite',
  'DSC_3407': 'family-bed-cuddle',
  'DSC_3436': 'family-bed-laughing',
  'DSC_3617': 'family-lawn-portrait',
  'DSC_3764(1)': 'family-father-lift-baby',
  'DSC_3775': 'family-father-lift-boy',
  'DSC_3854': 'family-beach-walk',
  'DSC_3933': 'family-lawn-run',
  'DSC_4018': 'family-lawn-seated',
  'IMG_2287': 'family-beach-birthday',
  'IMG_2291': 'family-mother-kiss-baby',
  'IMG_2293': 'family-walk-sunset',
  'IMG_2296': 'family-mother-toddler',
  'DDH08006_(2)': 'lookbook-library-front',
  'DDH08035_(2)': 'lookbook-window-seat',
  'DDH08039_(2)': 'lookbook-window-glance',
  'DSC_2532': 'portrait-sunset-white-shirt',
  'IMG_3673': 'portrait-beach-palm',
  'IMG_7711': 'portrait-sand-golden',
  'DSC_2529': 'island-sunset-seated',
  'IMG_2237': 'island-rock-sunset-rest',
  'IMG_2239': 'island-rock-reclining',
  'IMG_2376': 'island-beach-waves',
  'IMG_7708': 'island-beach-sunset',
  'IMG_7709': 'island-shore-golden',
  'IMG_7713': 'island-beach-stroll',
};

fs.mkdirSync(OUT, { recursive: true });
const manifest = {};
for (const file of fs.readdirSync(SRC)) {
  const name = NAMES[path.parse(file).name];
  if (!name) continue;
  const input = path.join(SRC, file);
  const { width, height } = await sharp(input).metadata();
  const widths = WIDTHS.filter((w) => w <= width);
  manifest[name] = { width, height, widths };
  for (const w of widths) {
    await sharp(input).resize({ width: w }).webp({ quality: 78 }).toFile(path.join(OUT, `${name}-${w}.webp`));
  }
}

// Logo Studio Bin (chữ vàng trên nền đen) -> nền trong suốt để đặt lên header/footer tối.
const BRAND = 'public/images/brand';
fs.mkdirSync(BRAND, { recursive: true });
const logo = await sharp('source-images/brand/studio-bin-logo.jpg').removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: lw, height: lh } = logo.info;
const rgba = Buffer.alloc(lw * lh * 4);
let [x0, y0, x1, y1] = [lw, lh, 0, 0];
for (let i = 0; i < lw * lh; i++) {
  const [r, g, b] = [logo.data[i * 3], logo.data[i * 3 + 1], logo.data[i * 3 + 2]];
  const m = Math.max(r, g, b);
  const a = Math.max(0, Math.min(255, Math.round(((m - 14) * 255) / 76)));
  const k = a < 255 && m > 0 ? Math.min(215 / m, 4) : 1;
  rgba.set([Math.min(255, r * k), Math.min(255, g * k), Math.min(255, b * k), a], i * 4);
  if (a > 40) {
    const x = i % lw, y = Math.floor(i / lw);
    x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
  }
}
const pad = 6;
const crop = { left: Math.max(0, x0 - pad), top: Math.max(0, y0 - pad) };
crop.width = Math.min(lw, x1 + pad + 1) - crop.left;
crop.height = Math.min(lh, y1 + pad + 1) - crop.top;
await sharp(rgba, { raw: { width: lw, height: lh, channels: 4 } }).extract(crop).webp({ quality: 90 }).toFile(`${BRAND}/logo-light.webp`);
manifest.logo = { width: crop.width, height: crop.height };

// Favicon: biểu tượng ống kính trong logo (nền trong suốt).
const FAVICON = { left: 292, top: 7, width: 124, height: 124 };
const circle = Buffer.from('<svg width="192" height="192"><circle cx="96" cy="96" r="90"/></svg>');
const favicon = await sharp(`${BRAND}/logo-light.webp`).extract(FAVICON).resize(192, 192).png().toBuffer();
await sharp(favicon).composite([{ input: circle, blend: 'dest-in' }]).png().toFile(`${BRAND}/favicon.png`);

// Ảnh chia sẻ mạng xã hội (Open Graph) 1200 × 630.
await sharp(path.join(SRC, 'IMG_0858.JPG')).resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 82 }).toFile('public/images/og-image.jpg');

// Ảnh nền footer (hoàng hôn trên biển) và ảnh nền mờ của khối giới thiệu.
await sharp(path.join(SRC, 'DSC_2455.jpeg')).resize({ width: 1800 }).webp({ quality: 70 }).toFile('public/images/footer-sunset.webp');
await sharp(path.join(SRC, 'IMG_0858.JPG')).resize({ width: 800 }).webp({ quality: 60 }).toFile('public/images/intro-bg.webp');

console.log(JSON.stringify(manifest));
