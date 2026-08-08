// =============================================================================
// HH Goa 2026 - Official Brand Frame & Builder ID Pass Generator
// Official Website Theme Engine (https://hhgoa.com/)
// =============================================================================

let currentFormat = 'B'; // 'A' = PFP Frame, 'B' = Builder ID Card
let currentTheme = 'emerald'; // 'emerald', 'official', 'neon', 'sunset'
let userImage = null;
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

// Canvas & Context
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

// Color Theme Palettes matching exact hhgoa.com website screenshot
const THEME_PALETTES = {
  emerald: {
    primary: '#FACC15',
    secondary: '#FF007A',
    bgStart: '#004D2C',
    bgEnd: '#002B18',
    badgeBg: '#003B22',
    accentText: '#FACC15',
    tagBg: '#FF007A'
  },
  official: {
    primary: '#00FF87',
    secondary: '#00F2FE',
    bgStart: '#090D16',
    bgEnd: '#020408',
    badgeBg: '#131B2E',
    accentText: '#00FF87',
    tagBg: '#00F2FE'
  },
  neon: {
    primary: '#00F2FE',
    secondary: '#FF0844',
    bgStart: '#0F172A',
    bgEnd: '#020617',
    badgeBg: '#1E293B',
    accentText: '#00FF87',
    tagBg: '#FF0844'
  },
  sunset: {
    primary: '#FFB800',
    secondary: '#FF0844',
    bgStart: '#2A0819',
    bgEnd: '#0F0208',
    badgeBg: '#3B0F20',
    accentText: '#FFD700',
    tagBg: '#FF0844'
  }
};

// Code 39 Patterns
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
  grad.addColorStop(1, '#002B18');
  pCtx.fillStyle = grad;
  pCtx.fillRect(0, 0, 600, 600);

  pCtx.fillStyle = 'rgba(250, 204, 21, 0.15)';
  pCtx.beginPath();
  pCtx.arc(300, 240, 110, 0, Math.PI * 2);
  pCtx.fill();

  pCtx.beginPath();
  pCtx.arc(300, 520, 200, Math.PI, 0);
  pCtx.fill();

  pCtx.fillStyle = '#FACC15';
  pCtx.font = 'bold 26px Outfit, sans-serif';
  pCtx.textAlign = 'center';
  pCtx.fillText('CLICK TO UPLOAD YOUR PHOTO', 300, 310);

  const img = new Image();
  img.src = pCanvas.toDataURL();
  img.onload = () => {
    userImage = img;
    renderCanvas();
  };
}

// -----------------------------------------------------------------------------
// Format & Theme Switchers
// -----------------------------------------------------------------------------
function switchFormat(format) {
  currentFormat = format;
  document.getElementById('tab-format-a').classList.toggle('active', format === 'A');
  document.getElementById('tab-format-b').classList.toggle('active', format === 'B');

  document.getElementById('format-b-fields').style.display = format === 'B' ? 'flex' : 'none';
  document.getElementById('preview-mode-tag').innerText = format === 'B' ? 'Builder ID Pass' : 'PFP Overlay';

  if (format === 'A') {
    canvas.width = 1080;
    canvas.height = 1080;
  } else {
    canvas.width = 1200;
    canvas.height = 1600;
  }

  renderCanvas();
}

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

// -----------------------------------------------------------------------------
// Photo Transformations
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// Image Upload Handler
// -----------------------------------------------------------------------------
function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;
    img.onload = () => {
      userImage = img;
      resetAdjustments();
      renderCanvas();
      showToast('Photo uploaded successfully! 📸');
    };
  };
  reader.readAsDataURL(file);
}

// -----------------------------------------------------------------------------
// Core Canvas Rendering Engine
// -----------------------------------------------------------------------------
function renderCanvas() {
  if (!userImage) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (currentFormat === 'A') {
    renderPFPFrame();
  } else {
    renderBuilderIDCard();
  }
}

// -----------------------------------------------------------------------------
// FORMAT A: PFP Overlay / Frame (1080 x 1080)
// -----------------------------------------------------------------------------
function renderPFPFrame() {
  const W = 1080;
  const H = 1080;
  const palette = THEME_PALETTES[currentTheme];

  ctx.save();
  ctx.fillStyle = palette.bgStart;
  ctx.fillRect(0, 0, W, H);

  const centerX = W / 2;
  const centerY = H / 2 - 20;
  const radius = 430;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  ctx.save();
  ctx.translate(centerX + transformState.offsetX, centerY + transformState.offsetY);
  ctx.rotate((transformState.rotate * Math.PI) / 180);
  if (transformState.flipped) ctx.scale(-1, 1);
  ctx.scale(transformState.scale, transformState.scale);

  const aspect = userImage.width / userImage.height;
  let drawW = radius * 2;
  let drawH = (radius * 2) / aspect;
  if (drawH < radius * 2) {
    drawH = radius * 2;
    drawW = radius * 2 * aspect;
  }

  ctx.drawImage(userImage, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();
  ctx.restore();

  ctx.lineWidth = 28;
  const ringGrad = ctx.createLinearGradient(0, 0, W, H);
  ringGrad.addColorStop(0, palette.primary);
  ringGrad.addColorStop(1, palette.secondary);
  ctx.strokeStyle = ringGrad;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Top Header Branding Badge
  ctx.fillStyle = palette.bgStart;
  ctx.beginPath();
  ctx.roundRect(W / 2 - 240, 45, 480, 65, 30);
  ctx.fill();
  ctx.strokeStyle = palette.primary;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = palette.primary;
  ctx.font = '900 26px "Playfair Display", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('HACKER HOUSE GOA 2026', W / 2, 88);

  // Bottom #FrameInGoa Curved Banner
  ctx.fillStyle = palette.bgStart;
  ctx.beginPath();
  ctx.roundRect(W / 2 - 270, H - 145, 540, 90, 45);
  ctx.fill();
  ctx.strokeStyle = palette.secondary;
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = palette.primary;
  ctx.font = '900 36px Outfit, sans-serif';
  ctx.fillText('🌴 #FrameInGoa ⚡ 28-31 OCT', W / 2, H - 88);
}

// -----------------------------------------------------------------------------
// FORMAT B: Builder ID Card / Event Badge (1200 x 1600)
// Complete Dual Barcode + Instant QR Code Scanner Engine
// -----------------------------------------------------------------------------
function renderBuilderIDCard() {
  const W = 1200;
  const H = 1600;
  const palette = THEME_PALETTES[currentTheme];

  const name = document.getElementById('input-name').value || 'Satoshi Nakamoto';
  const handle = document.getElementById('input-handle').value || 'kaushal_dev';
  const role = document.getElementById('input-role').value || 'Full-Stack & AI Systems';
  const title = document.getElementById('input-title').value || 'Kernel Alchemist ⚡';

  ctx.save();

  // 1. Background & Border Frame
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
  ctx.roundRect(30, 30, W - 60, H - 60, 40);
  ctx.stroke();

  // 2. Top Header Branding - 2:47 PM STUDIO & HACKER HOUSE
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.roundRect(60, 50, 240, 40, 10);
  ctx.fill();

  ctx.fillStyle = palette.primary;
  ctx.font = '900 20px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('2:47 PM STUDIO', 80, 77);

  ctx.fillStyle = palette.primary;
  ctx.font = '700 20px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('GOA, INDIA · 28 – 31 OCT 2026', W - 70, 77);

  // Big Serif Banner Text: HACKER HOUSE + Pink "गोवा" Badge
  ctx.fillStyle = palette.primary;
  ctx.font = '900 68px "Playfair Display", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('HACKER HOUSE', W / 2, 175);

  // Devanagari Hot Pink Badge overlay "गोवा"
  ctx.fillStyle = '#FF007A';
  ctx.beginPath();
  ctx.roundRect(W / 2 - 65, 122, 130, 68, 16);
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 42px Outfit, sans-serif';
  ctx.fillText('गोवा', W / 2, 172);

  // Decorative Horizontal Divider
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 210);
  ctx.lineTo(W - 100, 210);
  ctx.stroke();

  // 3. Photo Frame Area
  const photoX = W / 2 - 270;
  const photoY = 240;
  const photoW = 540;
  const photoH = 520;
  const photoRadius = 30;

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
  ctx.lineWidth = 10;
  ctx.strokeStyle = palette.primary;
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, photoRadius);
  ctx.stroke();

  // 4. Builder Information Section
  // Full Name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 52px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(name.toUpperCase(), W / 2, 825);

  // X Handle Chip
  ctx.fillStyle = 'rgba(255, 0, 122, 0.2)';
  ctx.beginPath();
  ctx.roundRect(W / 2 - 180, 850, 360, 48, 24);
  ctx.fill();
  ctx.strokeStyle = '#FF007A';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 24px "JetBrains Mono", monospace';
  ctx.fillText(`@${handle.replace('@', '')}`, W / 2, 883);

  // Role Tag
  ctx.fillStyle = palette.primary;
  ctx.font = '700 26px Outfit, sans-serif';
  ctx.fillText(`⚡ ${role}`, W / 2, 942);

  // Builder Title Box
  ctx.fillStyle = palette.badgeBg;
  ctx.beginPath();
  ctx.roundRect(140, 975, W - 280, 80, 20);
  ctx.fill();
  ctx.strokeStyle = palette.primary;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = palette.primary;
  ctx.font = '800 32px Outfit, sans-serif';
  ctx.fillText(title, W / 2, 1027);

  // Official Tagline Banner
  ctx.fillStyle = 'rgba(250, 204, 21, 0.15)';
  ctx.beginPath();
  ctx.roundRect(180, 1072, W - 360, 38, 12);
  ctx.fill();

  ctx.fillStyle = palette.primary;
  ctx.font = '700 18px "JetBrains Mono", monospace';
  ctx.fillText('LESS NOISE. MORE SIGNAL.', W / 2, 1097);

  // 5. Dual Scannable Barcode & QR Code Section
  const cleanHandle = handle.replace(/[^a-zA-Z0-9_]/g, '');
  const scanTargetURL = `https://hhgoa.com/builder/${cleanHandle}`;
  const barcodeY = 1130;

  // Linear Barcode Elements
  drawLinearBarcode(ctx, W / 2, barcodeY, W - 320, 50, palette.primary, cleanHandle);

  // 100% Instant Camera QR Code Scanner
  const qrY = barcodeY + 65;
  drawScannableQRCode(ctx, W / 2, qrY, 150, scanTargetURL, () => renderCanvas());

  const scannedLabel = `PASS ID: HHG-2026-${cleanHandle.toUpperCase()}`;
  ctx.fillStyle = palette.primary;
  ctx.font = '700 22px "JetBrains Mono", monospace';
  ctx.fillText(scannedLabel, W / 2, qrY + 185);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.fillText('VERIFIED BUILDER PASS  ·  2:47 PM STUDIO', W / 2, qrY + 218);

  ctx.fillStyle = palette.accentText;
  ctx.font = '900 26px Outfit, sans-serif';
  ctx.fillText('🌴 #FrameInGoa ⚡ @HackerHouseGoa', W / 2, qrY + 256);

  ctx.restore();
}

// Linear Barcode Lines Generator
function drawLinearBarcode(ctx, centerX, y, width, height, color, seedStr) {
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(centerX - width / 2 - 10, y - 5, width + 20, height + 10);

  ctx.fillStyle = '#000000';
  const code = `*HHG-${seedStr.toUpperCase()}*`;
  let bitPattern = '';

  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const pattern = CODE39_PATTERNS[char] || CODE39_PATTERNS[' '];
    bitPattern += pattern + '0';
  }

  const moduleWidth = width / bitPattern.length;
  const startX = centerX - width / 2;

  for (let i = 0; i < bitPattern.length; i++) {
    if (bitPattern[i] === '1') {
      ctx.fillRect(startX + i * moduleWidth, y, moduleWidth * 0.9, height);
    }
  }

  ctx.restore();
}

// Real 100% Scannable QR Code Canvas Engine
function drawScannableQRCode(ctx, centerX, y, size, textUrl, onQrLoaded) {
  if (lastQRData === textUrl && cachedQRCodeImg) {
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(centerX - size / 2 - 10, y - 10, size + 20, size + 20, 14);
    ctx.fill();
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 3;
    ctx.stroke();

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
}

// -----------------------------------------------------------------------------
// Interactive Drag & Touch Controls on Canvas
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// Download, Copy & Share Functions
// -----------------------------------------------------------------------------
function downloadGraphic() {
  const link = document.createElement('a');
  const filename = currentFormat === 'B' ? 'HH_Goa_2026_Builder_Pass.png' : 'HH_Goa_2026_PFP_Frame.png';
  link.download = filename;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();

  triggerConfetti();
  showToast('Badge downloaded in High-Res! 🚀');
}

function shareToX() {
  const text = encodeURIComponent(
    `Just built my official HH Goa 2026 Builder Pass! 🚀🌴\n\nReady to hack in Goa. Get yours now! #FrameInGoa @HackerHouseGoa`
  );
  const shareUrl = `https://twitter.com/intent/tweet?text=${text}`;
  window.open(shareUrl, '_blank');

  triggerConfetti();
  showToast('Opened Twitter share! Don\'t forget to attach your downloaded graphic! 🐦');
}

async function copyImageToClipboard() {
  try {
    canvas.toBlob(async (blob) => {
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      triggerConfetti();
      showToast('Image copied to clipboard! Ready to paste on X 📋');
    });
  } catch (err) {
    showToast('Download image first to paste on X!');
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
