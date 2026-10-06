const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'images', 'products');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

function svgTemplate(bgColor, accentColor, emoji, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgColor}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${bgColor}" stop-opacity="1"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="${accentColor}" flood-opacity="0.15"/>
    </filter>
  </defs>
  <rect width="400" height="400" rx="40" fill="url(#bg)"/>
  <circle cx="200" cy="180" r="100" fill="#ffffff" filter="url(#shadow)"/>
  <text x="200" y="210" font-size="90" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
  <rect x="80" y="310" width="240" height="36" rx="18" fill="#ffffff" fill-opacity="0.9"/>
  <text x="200" y="333" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="${accentColor}" text-anchor="middle" letter-spacing="1">${title.toUpperCase()}</text>
</svg>`;
}

const assets = [
  { file: 'fruits.svg', bg: '#FEF3C7', accent: '#D97706', emoji: '🍎', title: 'Fresh Fruits' },
  { file: 'vegetables.svg', bg: '#ECFDF5', accent: '#059669', emoji: '🥦', title: 'Fresh Veggies' },
  { file: 'dairy.svg', bg: '#EFF6FF', accent: '#2563EB', emoji: '🥛', title: 'Daily Dairy' },
  { file: 'staples.svg', bg: '#FFFBEB', accent: '#B45309', emoji: '🌾', title: 'Atta & Rice' },
  { file: 'pulses.svg', bg: '#FEF2F2', accent: '#DC2626', emoji: '🍲', title: 'Dals & Pulses' },
  { file: 'oil.svg', bg: '#FFFBEB', accent: '#D97706', emoji: '🫒', title: 'Oils & Ghee' },
  { file: 'spices.svg', bg: '#FFF1F2', accent: '#E11D48', emoji: '🌶️', title: 'Masala Spices' },
  { file: 'snacks.svg', bg: '#FEF3C7', accent: '#B45309', emoji: '🥨', title: 'Crispy Snacks' },
  { file: 'biscuits.svg', bg: '#FDF2E9', accent: '#C2410C', emoji: '🍪', title: 'Biscuits & Bakes' },
  { file: 'beverages.svg', bg: '#ECFDF5', accent: '#047857', emoji: '☕', title: 'Tea & Coffee' },
  { file: 'breakfast.svg', bg: '#FEF3C7', accent: '#D97706', emoji: '🥣', title: 'Morning Breakfast' },
  { file: 'household.svg', bg: '#F0FDFA', accent: '#0D9488', emoji: '🧼', title: 'Home Essentials' },
];

for (const a of assets) {
  const filePath = path.join(dir, a.file);
  fs.writeFileSync(filePath, svgTemplate(a.bg, a.accent, a.emoji, a.title));
  console.log('Created asset:', a.file);
}
