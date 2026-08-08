// =============================================================================
// HH Goa 2026 - Frame & Builder ID Card Generator Engine
// =============================================================================

let currentFormat = 'B'; // 'A' = PFP Frame, 'B' = Builder ID Card
let currentTheme = 'neon'; // 'neon', 'sunset', 'matrix', 'minimal'
let userImage = null;

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

// Builder Titles Pool for Randomizer
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
  neon: {
    primary: '#00F2FE',
    secondary: '#FF0844',
    bgStart: '#0F172A',
    bgEnd: '#020617',
    badgeBg: '#1E293B',
    accentText: '#00FF87'
  },
  sunset: {
    primary: '#FFB800',
    secondary: '#FF0844',
    bgStart: '#2A0819',
    bgEnd: '#0F0208',
    badgeBg: '#3B0F20',
    accentText: '#FFD700'
  },
  matrix: {
    primary: '#00FF87',
    secondary: '#00F2FE',
    bgStart: '#041F14',
    bgEnd: '#010B07',
    badgeBg: '#0B2E1E',
    accentText: '#00FF87'
  },
  minimal: {
    primary: '#FFFFFF',
    secondary: '#94A3B8',
    bgStart: '#1E293B',
    bgEnd: '#0F172A',
    badgeBg: '#334155',
    accentText: '#38BDF8'
  }
};

// Mouse / Touch Dragging State on Canvas
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

  // Background Gradient
  const grad = pCtx.createLinearGradient(0, 0, 600, 600);
  grad.addColorStop(0, '#1E293B');
  grad.addColorStop(1, '#0F172A');
  pCtx.fillStyle = grad;
  pCtx.fillRect(0, 0, 600, 600);

  // Avatar Icon Silhouette
  pCtx.fillStyle = '#334155';
  pCtx.beginPath();
  pCtx.arc(300, 240, 110, 0, Math.PI * 2);
  pCtx.fill();

  pCtx.beginPath();
  pCtx.arc(300, 520, 200, Math.PI, 0);
  pCtx.fill();

  // Text Placeholder
  pCtx.fillStyle = '#94A3B8';
  pCtx.font = 'bold 28px Outfit, sans-serif';
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

  // 1. Draw User Image in Circle Clip
  ctx.save();
  
  // Background behind user image
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, W, H);

  // Circular avatar mask
  const centerX = W / 2;
  const centerY = H / 2 - 20;
  const radius = 430;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  // Draw Transformed User Image
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

  // 2. Outer Ring Glow & Frame Border
  ctx.lineWidth = 28;
  const ringGrad = ctx.createLinearGradient(0, 0, W, H);
  ringGrad.addColorStop(0, palette.primary);
  ringGrad.addColorStop(1, palette.secondary);
  ctx.strokeStyle = ringGrad;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Top Header Branding Badge
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(W / 2 - 210, 45, 420, 65, 30);
  ctx.fill();
  ctx.strokeStyle = palette.primary;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 28px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('HACKER HOUSE GOA 2026', W / 2, 88);

  // 4. Bottom #FrameInGoa Curved Banner
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.beginPath();
  ctx.roundRect(W / 2 - 260, H - 140, 520, 85, 40);
  ctx.fill();
  ctx.strokeStyle = palette.secondary;
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = palette.accentText;
  ctx.font = '900 36px Outfit, sans-serif';
  ctx.fillText('🌴 #FrameInGoa ⚡', W / 2, H - 85);
}

// Helper to generate deterministic pass number from string
function getPassID(handleStr) {
  let hash = 0;
  const str = (handleStr || 'kaushal').toLowerCase();
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const code = Math.abs(hash % 9000) + 1000;
  return `PASS ID: HHG-2026-${code}`;
}

// -----------------------------------------------------------------------------
// FORMAT B: Builder ID Card / Event Badge (1200 x 1600)
// -----------------------------------------------------------------------------
function renderBuilderIDCard() {
  const W = 1200;
  const H = 1600;
  const palette = THEME_PALETTES[currentTheme];

  const name = document.getElementById('input-name').value || 'Satoshi Nakamoto';
  const handle = document.getElementById('input-handle').value || 'kaushal_dev';
  const role = document.getElementById('input-role').value || 'Full-Stack & AI Systems';
  const title = document.getElementById('input-title').value || 'Kernel Alchemist ⚡';

  // 1. Badge Base Gradient & Outer Glow Border
  ctx.save();
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

  // 2. Lanyard Hole Slot (Top Center)
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.roundRect(W / 2 - 70, 55, 140, 32, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // 3. Header Branding Banner
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 52px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('HH GOA 2026', W / 2, 165);

  ctx.fillStyle = palette.primary;
  ctx.font = '700 22px "JetBrains Mono", monospace';
  ctx.fillText('OFFICIAL BUILDER PASS // FEB 2026', W / 2, 205);

  // Decorative Horizontal Line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 235);
  ctx.lineTo(W - 100, 235);
  ctx.stroke();

  // 4. Photo Frame Area (Rectangular Rounded Avatar)
  const photoX = W / 2 - 270;
  const photoY = 265;
  const photoW = 540;
  const photoH = 560;
  const photoRadius = 30;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, photoRadius);
  ctx.clip();

  // Draw Transformed Photo
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

  // 5. Builder Information Section
  // Full Name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 52px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(name.toUpperCase(), W / 2, 895);

  // X Handle Badge
  ctx.fillStyle = 'rgba(29, 155, 240, 0.15)';
  ctx.beginPath();
  ctx.roundRect(W / 2 - 180, 920, 360, 48, 24);
  ctx.fill();
  ctx.strokeStyle = '#1D9BF0';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#1D9BF0';
  ctx.font = '700 24px "JetBrains Mono", monospace';
  ctx.fillText(`@${handle.replace('@', '')}`, W / 2, 953);

  // Role / Stack Tag
  ctx.fillStyle = palette.accentText;
  ctx.font = '700 26px Outfit, sans-serif';
  ctx.fillText(`⚡ ${role}`, W / 2, 1015);

  // Fun Builder Title Box
  ctx.fillStyle = palette.badgeBg;
  ctx.beginPath();
  ctx.roundRect(140, 1050, W - 280, 90, 20);
  ctx.fill();
  ctx.strokeStyle = palette.secondary;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 34px Outfit, sans-serif';
  ctx.fillText(title, W / 2, 1108);

  // 6. Footer Barcode & Unique Pass ID Section
  const barcodeY = 1175;
  const barcodeHeight = 60;
  drawBarcode(ctx, 180, barcodeY, W - 360, barcodeHeight, palette.primary, handle);

  // Pass ID Number
  const passID = getPassID(handle);
  ctx.fillStyle = palette.primary;
  ctx.font = '700 22px "JetBrains Mono", monospace';
  ctx.fillText(passID, W / 2, barcodeY + barcodeHeight + 32);

  // Event Tagline
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.fillText('VERIFIED BUILDER // GOA INDIA // 2026', W / 2, barcodeY + barcodeHeight + 68);

  ctx.fillStyle = palette.accentText;
  ctx.font = '900 26px Outfit, sans-serif';
  ctx.fillText('🌴 #FrameInGoa ⚡ @HackerHouseGoa', W / 2, barcodeY + barcodeHeight + 110);

  ctx.restore();
}

// Draw Barcode with handle-seeded bar pattern
function drawBarcode(ctx, x, y, width, height, color, seedStr) {
  ctx.save();
  ctx.fillStyle = color;
  const numBars = 60;
  const barWidth = width / numBars;
  
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed += seedStr.charCodeAt(i);

  for (let i = 0; i < numBars; i++) {
    // Deterministic bar thickness based on seed
    const val = (i * 13 + seed * 7) % 17;
    const isThick = val > 10;
    const isGap = val < 3 && i > 3 && i < numBars - 4; // keep outer edges solid

    if (!isGap) {
      const w = isThick ? barWidth * 0.85 : barWidth * 0.45;
      ctx.fillRect(x + i * barWidth, y, w, height);
    }
  }
  ctx.restore();
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
