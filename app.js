// =============================================================================
// HH GOA 2026 - Official Brand Builder ID Pass Generator (Format B Only)
// Perfected Compact Aspect Ratio & Zero-Gap High-Contrast Layout
// =============================================================================

let currentTheme = 'emerald'; // 'emerald', 'official', 'neon', 'sunset'
let userImage = null;
let userHasUploadedPhoto = false; // Strict photo upload requirement flag
let cachedQRCodeImg = null;
let lastQRData = '';

// Photo Transformation State
const transformState = {
  scale: 1.0,
  offsetX: 0,
  offsetY: 0,
  rotate: 0,
  flipped: false
};

// Canvas & Context (Compact Proportional Badge: 1200 x 1350)
const canvas = document.getElementById('badge-canvas');
const ctx = canvas.getContext('2d');

// Builder Titles Pool
const BUILDER_TITLES = [
  "Kernel Alchemist 🧪",
  "GPU Whisperer ⚡",
  "Solana Byte Wizard 🚀",
  "Agentic AI Overlord 🤖",
  "Latency Exorcist ⚡",
  "Zero-Knowledge Phantom 👻",
  "Full-Stack Architect 🏗️",
  "Smart Contract Ninja 🥷",
  "Rust Memory Slayer ⚙️",
  "Distributed Systems Monk 🧘"
];

// Color Theme Palettes
const THEME_PALETTES = {
  emerald: {
    primary: '#FACC15',      // Electric Gold
    secondary: '#FF007A',    // Hot Pink
    bgStart: '#004D2C',      // Deep Tropical Emerald Green
    bgEnd: '#002615',        // Dark Emerald
    badgeBg: '#003820',      // Title Box Bg
    accentText: '#00FF87',   // Neon Mint
    handleBg: 'rgba(255, 0, 122, 0.25)',
    handleBorder: '#FF007A'
  },
  official: {
    primary: '#00FF87',      // Neon Mint
    secondary: '#00F2FE',    // Cyan
    bgStart: '#091322',      // Cyber Dark Navy
    bgEnd: '#030710',
    badgeBg: '#12223B',
    accentText: '#00FF87',
    handleBg: 'rgba(0, 255, 135, 0.2)',
    handleBorder: '#00FF87'
  },
  neon: {
    primary: '#00F2FE',      // Cyan
    secondary: '#FF0844',    // Magenta
    bgStart: '#0F172A',      // Dark Slate
    bgEnd: '#020617',
    badgeBg: '#1E293B',
    accentText: '#00FF87',
    handleBg: 'rgba(0, 242, 254, 0.2)',
    handleBorder: '#00F2FE'
  },
  sunset: {
    primary: '#FFB800',      // Sunset Gold
    secondary: '#FF0844',    // Sunset Magenta
    bgStart: '#2A0819',      // Dark Sunset Purple
    bgEnd: '#0F0208',
    badgeBg: '#3B0F20',
    accentText: '#FFD700',
    handleBg: 'rgba(255, 184, 0, 0.2)',
    handleBorder: '#FFB800'
  }
};

// Code 39 Character Bit Patterns
const CODE39_PATTERNS = {
  '0': '101001101101', '1': '110100101011', '2': '101100101011', '3': '110110010101',
  '4': '101001101011', '5': '110100110101', '6': '101100110101', '7': '101001011011',
  '8': '110100101101', '9': '101100101101', 'A': '110101001011', 'B': '101101001011',
  'C': '110110100101', 'D': '101011001011', 'E': '110101100101', 'F': '101101100101',
  'G': '101010011011', 'H': '110101001101', 'I': '101101001101', 'J': '101011001101',
  'K': '110101010011', 'L': '101101010011', 'M': '110110101001', 'N': '101011010011',
  'O': '110101101001', 'P': '101101101001', 'Q': '101010110011', 'R': '110101011001',
  'S': '101101011001', 'T': '101011011001', 'U': '110010101011', 'V': '100110101011',
  'W': '110011010101', 'X': '100101101011', 'Y': '110010110101', 'Z': '100110110101',
  '-': '100101011011', '.': '110010101101', ' ': '100110101101', '*': '100101101101'
};

let isDragging = false;
let startX, startY;

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
  canvas.width = 1200;
  canvas.height = 1350; // Compact proportional badge height
  createDefaultPlaceholderImage();
  setupCanvasInteractions();
});

// Create Default Avatar Placeholder
function createDefaultPlaceholderImage() {
  const pCanvas = document.createElement('canvas');
  pCanvas.width = 600;
  pCanvas.height = 600;
  const pCtx = pCanvas.getContext('2d');

  const grad = pCtx.createLinearGradient(0, 0, 600, 600);
  grad.addColorStop(0, '#004D2C');
  grad.addColorStop(1, '#002515');
  pCtx.fillStyle = grad;
  pCtx.fillRect(0, 0, 600, 600);

  pCtx.fillStyle = 'rgba(250, 204, 21, 0.18)';
  pCtx.beginPath();
  pCtx.arc(300, 240, 110, 0, Math.PI * 2);
  pCtx.fill();

  pCtx.beginPath();
  pCtx.arc(300, 520, 200, Math.PI, 0);
  pCtx.fill();

  pCtx.fillStyle = '#FACC15';
  pCtx.font = 'bold 28px Outfit, sans-serif';
  pCtx.textAlign = 'center';
  pCtx.fillText('UPLOAD PHOTO REQUIRED 📸', 300, 310);

  const img = new Image();
  img.src = pCanvas.toDataURL();
  img.onload = () => {
    userImage = img;
    renderCanvas();
  };
}

// Theme Switcher
function setTheme(theme) {
  currentTheme = theme;
  document.querySelectorAll('.theme-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.theme === theme);
  });
  renderCanvas();
}

function generateRandomTitle() {
  const randomTitle = BUILDER_TITLES[Math.floor(Math.random() * BUILDER_TITLES.length)];
  document.getElementById('input-title').value = randomTitle;
  renderCanvas();
}

// Photo Transformations
function updateAdjustment(type, value) {
  transformState[type] = parseFloat(value);
  
  if (type === 'scale') document.getElementById('val-scale').innerText = `${transformState.scale.toFixed(2)}x`;
  if (type === 'offsetX') document.getElementById('val-offset-x').innerText = `${transformState.offsetX}px`;
  if (type === 'offsetY') document.getElementById('val-offset-y').innerText = `${transformState.offsetY}px`;
  if (type === 'rotate') document.getElementById('val-rotate').innerText = `${transformState.rotate}°`;

  renderCanvas();
}

function flipPhoto() {
  transformState.flipped = !transformState.flipped;
  renderCanvas();
}

function resetAdjustments() {
  transformState.scale = 1.0;
  transformState.offsetX = 0;
  transformState.offsetY = 0;
  transformState.rotate = 0;
  transformState.flipped = false;

  document.getElementById('slider-scale').value = 1.0;
  document.getElementById('slider-offset-x').value = 0;
  document.getElementById('slider-offset-y').value = 0;
  document.getElementById('slider-rotate').value = 0;

  document.getElementById('val-scale').innerText = '1.00x';
  document.getElementById('val-offset-x').innerText = '0px';
  document.getElementById('val-offset-y').innerText = '0px';
  document.getElementById('val-rotate').innerText = '0°';

  renderCanvas();
}

// Image Upload Handler
function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;
    img.onload = () => {
      userImage = img;
      userHasUploadedPhoto = true;
      resetAdjustments();
      renderCanvas();
      showToast('Photo uploaded successfully! 📸');
    };
  };
  reader.readAsDataURL(file);
}

function requirePhotoUpload() {
  if (!userHasUploadedPhoto) {
    showToast('⚠️ Please upload your photo first to generate your badge!');
    const dropzone = document.getElementById('dropzone');
    dropzone.scrollIntoView({ behavior: 'smooth', block: 'center' });
    dropzone.classList.add('drag-over');
    setTimeout(() => dropzone.classList.remove('drag-over'), 2000);
    document.getElementById('file-input').click();
    return false;
  }
  return true;
}

// Core Canvas Rendering Engine
function renderCanvas() {
  if (!userImage) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderBuilderIDCard();
}

// Builder ID Card / Event Badge (1200 x 1350)
// Zero-Gap Perfect Proportional Padding & High-Contrast Scanners
function renderBuilderIDCard() {
  const W = 1200;
  const H = 1350;
  const palette = THEME_PALETTES[currentTheme] || THEME_PALETTES.emerald;

  const name = document.getElementById('input-name').value || 'SATOSHI NAKAMOTO';
  const handle = document.getElementById('input-handle').value || 'kaushal_dev';
  const role = document.getElementById('input-role').value || 'Full-Stack & AI Systems';
  const title = document.getElementById('input-title').value || 'Kernel Alchemist ⚡';

  ctx.save();

  // 1. Tropical Deep Emerald Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, palette.bgStart);
  bgGrad.addColorStop(1, palette.bgEnd);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Outer Border Frame
  ctx.lineWidth = 16;
  const frameGrad = ctx.createLinearGradient(0, 0, W, H);
  frameGrad.addColorStop(0, palette.primary);
  frameGrad.addColorStop(0.5, palette.secondary);
  frameGrad.addColorStop(1, palette.primary);
  ctx.strokeStyle = frameGrad;
  ctx.roundRect(25, 25, W - 50, H - 50, 40);
  ctx.stroke();

  // 2. Exact Website 3-Line Header Logo (HACKER [गोवा] HOUSE)
  // Top Line: BUILDER PASS · GOA 2026 (Hot Pink)
  ctx.fillStyle = '#FF007A';
  ctx.font = '800 22px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BUILDER PASS   ·   GOA 2026', W / 2, 60);

  // Center Line: HACKER (Gold Serif) + [गोवा] (Hot Pink Devanagari) + HOUSE (Gold Serif)
  ctx.fillStyle = palette.primary;
  ctx.font = '900 80px "Playfair Display", Georgia, serif';

  // HACKER on Left
  ctx.textAlign = 'right';
  ctx.fillText('HACKER', W / 2 - 45, 150);

  // HOUSE on Right
  ctx.textAlign = 'left';
  ctx.fillText('HOUSE', W / 2 + 45, 150);

  // Hot Pink Devanagari [गोवा] in Center with Yellow Outline
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = '900 52px Outfit, sans-serif';

  // Yellow Glow Outline
  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 6;
  ctx.strokeText('गोवा', W / 2, 146);

  // Hot Pink Text Fill
  ctx.fillStyle = '#FF007A';
  ctx.fillText('गोवा', W / 2, 146);
  ctx.restore();

  // Bottom Line: GOA, INDIA · 28 – 31 OCT 2026 (White Monospace)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 20px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GOA, INDIA   ·   28 – 31 OCT 2026', W / 2, 195);

  // Decorative Horizontal Divider
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 218);
  ctx.lineTo(W - 80, 218);
  ctx.stroke();

  // 3. Photo Frame Area (480 x 420)
  const photoX = W / 2 - 240;
  const photoY = 240;
  const photoW = 480;
  const photoH = 420;
  const photoRadius = 28;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, photoRadius);
  ctx.clip();

  ctx.save();
  ctx.translate(W / 2 + transformState.offsetX, photoY + photoH / 2 + transformState.offsetY);
  ctx.rotate((transformState.rotate * Math.PI) / 180);
  if (transformState.flipped) ctx.scale(-1, 1);
  ctx.scale(transformState.scale, transformState.scale);

  const aspect = userImage.width / userImage.height;
  let drawW = photoW;
  let drawH = photoW / aspect;
  if (drawH < photoH) {
    drawH = photoH;
    drawW = photoH * aspect;
  }

  ctx.drawImage(userImage, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();
  ctx.restore();

  // Photo Frame Border
  ctx.lineWidth = 8;
  ctx.strokeStyle = palette.primary;
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, photoRadius);
  ctx.stroke();

  // 4. Builder Information Section
  // Full Name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 52px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(name.toUpperCase(), W / 2, 715);

  // X Handle Chip
  ctx.fillStyle = palette.handleBg;
  ctx.beginPath();
  ctx.roundRect(W / 2 - 180, 738, 360, 46, 23);
  ctx.fill();
  ctx.strokeStyle = palette.handleBorder;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 24px "JetBrains Mono", monospace';
  ctx.fillText(`@${handle.replace('@', '')}`, W / 2, 770);

  // Role Tag
  ctx.fillStyle = palette.primary;
  ctx.font = '800 26px Outfit, sans-serif';
  ctx.fillText(`⚡ ${role}`, W / 2, 825);

  // Builder Title Box
  ctx.fillStyle = palette.badgeBg;
  ctx.beginPath();
  ctx.roundRect(120, 855, W - 240, 72, 18);
  ctx.fill();
  ctx.strokeStyle = palette.primary;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = palette.primary;
  ctx.font = '900 34px Outfit, sans-serif';
  ctx.fillText(title, W / 2, 902);

  // 5. Dual Linear Barcode & Instant Scannable QR Code Section (Nested & Perfectly Spaced)
  const cleanHandle = handle.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'KAUSHAL';
  const scanTargetURL = `https://hhgoa.com/builder/${cleanHandle.toLowerCase()}`;
  const barcodeY = 952;

  // High-Contrast Linear Barcode (Height 55px)
  drawLinearBarcode(ctx, W / 2, barcodeY, W - 320, 55, cleanHandle);

  // 100% Instant Scannable QR Code (Size 145px)
  const qrY = barcodeY + 75;
  drawScannableQRCode(ctx, W / 2, qrY, 145, scanTargetURL, () => renderCanvas());

  // Pass ID Label
  const scannedLabel = `PASS ID: HHG-2026-${cleanHandle}`;
  ctx.fillStyle = palette.primary;
  ctx.font = '800 22px "JetBrains Mono", monospace';
  ctx.fillText(scannedLabel, W / 2, qrY + 182);

  // Footer Tagline
  ctx.fillStyle = palette.accentText;
  ctx.font = '900 26px Outfit, sans-serif';
  ctx.fillText('🌴 #FrameInGoa ⚡ @HackerHouseGoa', W / 2, qrY + 224);

  ctx.restore();
}

// Guaranteed High-Contrast Code 39 Barcode Generator
function drawLinearBarcode(ctx, centerX, y, width, height, handleText) {
  ctx.save();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(centerX - width / 2 - 16, y - 6, width + 32, height + 12, 10);
  ctx.fill();

  ctx.fillStyle = '#000000';
  let safeText = (handleText || 'KAUSHAL').toUpperCase().replace(/[^0-9A-Z-. ]/g, '');
  if (safeText.length === 0) safeText = 'BUILDER';
  const code = `*HHG-${safeText.substring(0, 10)}*`;
  
  let bitPattern = '';
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const pattern = CODE39_PATTERNS[char] || CODE39_PATTERNS['A'];
    bitPattern += pattern + '0';
  }

  const moduleWidth = width / bitPattern.length;
  const startX = centerX - width / 2;

  for (let i = 0; i < bitPattern.length; i++) {
    if (bitPattern[i] === '1') {
      ctx.fillRect(startX + i * moduleWidth, y, moduleWidth * 0.95, height);
    }
  }

  ctx.restore();
}

// Real 100% Scannable QR Code Canvas Engine (with instant fallback box)
function drawScannableQRCode(ctx, centerX, y, size, textUrl, onQrLoaded) {
  ctx.save();

  // White High-Contrast Quiet Zone Box (Always drawn instantly on frame 1!)
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(centerX - size / 2 - 10, y - 10, size + 20, size + 20, 14);
  ctx.fill();
  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 3;
  ctx.stroke();

  if (lastQRData === textUrl && cachedQRCodeImg) {
    ctx.drawImage(cachedQRCodeImg, centerX - size / 2, y, size, size);
    ctx.restore();
    return;
  }

  if (typeof QRCode !== 'undefined' && QRCode.toDataURL) {
    QRCode.toDataURL(textUrl, {
      width: size * 2,
      margin: 1,
      color: { dark: '#000000', light: '#FFFFFF' }
    }, (err, url) => {
      if (!err && url) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          cachedQRCodeImg = img;
          lastQRData = textUrl;
          if (onQrLoaded) onQrLoaded();
        };
      }
    });
  }

  ctx.restore();
}

// Interactive Drag & Touch Controls on Canvas
function setupCanvasInteractions() {
  const getEventCoords = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrag = (e) => {
    isDragging = true;
    const coords = getEventCoords(e);
    startX = coords.x - transformState.offsetX;
    startY = coords.y - transformState.offsetY;
  };

  const doDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const coords = getEventCoords(e);
    transformState.offsetX = Math.round(coords.x - startX);
    transformState.offsetY = Math.round(coords.y - startY);

    document.getElementById('slider-offset-x').value = transformState.offsetX;
    document.getElementById('slider-offset-y').value = transformState.offsetY;
    document.getElementById('val-offset-x').innerText = `${transformState.offsetX}px`;
    document.getElementById('val-offset-y').innerText = `${transformState.offsetY}px`;

    renderCanvas();
  };

  const stopDrag = () => {
    isDragging = false;
  };

  canvas.addEventListener('mousedown', startDrag);
  canvas.addEventListener('mousemove', doDrag);
  window.addEventListener('mouseup', stopDrag);

  canvas.addEventListener('touchstart', startDrag, { passive: false });
  canvas.addEventListener('touchmove', doDrag, { passive: false });
  window.addEventListener('touchend', stopDrag);
}

// Accordion Toggle
function toggleAccordion(id) {
  const body = document.getElementById(id);
  const icon = document.getElementById('adjust-accordion-icon');
  const isHidden = body.style.display === 'none';
  body.style.display = isHidden ? 'flex' : 'none';
  icon.innerText = isHidden ? '▼' : '▲';
}

// Download, Copy & Share Functions (Strict Photo Requirement Enforcement)
function downloadGraphic() {
  if (!requirePhotoUpload()) return;

  const link = document.createElement('a');
  link.download = 'HH_Goa_2026_Builder_Pass.png';
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();

  triggerConfetti();
  showToast('Badge downloaded in High-Res! 🚀');
}

function shareToX() {
  if (!requirePhotoUpload()) return;

  const text = encodeURIComponent(
    `Just built my official HH Goa 2026 Builder Pass! 🚀🌴\n\nReady to hack in Goa. Get yours now! #FrameInGoa @HackerHouseGoa`
  );
  const shareUrl = `https://twitter.com/intent/tweet?text=${text}`;
  window.open(shareUrl, '_blank');

  triggerConfetti();
  showToast('Opened Twitter share! Don\'t forget to attach your downloaded graphic! 🐦');
}

async function copyImageToClipboard() {
  if (!requirePhotoUpload()) return;

  try {
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 1.0));
    if (blob) {
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      triggerConfetti();
      showToast('Image copied to clipboard! Ready to paste on X 📋');
    }
  } catch (err) {
    downloadGraphic();
  }
}

// Toast Feedback
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// Celebration Confetti
function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}
