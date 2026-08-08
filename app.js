// =============================================================================
// HH GOA 2026 - Official Brand Builder ID Pass Generator (Format B Only)
// 100% Scannable Code 39 Barcode Engine (Decodes to PASS ID: HHG-2026-<HANDLE>)
// =============================================================================

let currentTheme = 'emerald'; // 'emerald', 'official', 'neon', 'sunset'
let userImage = null;
let userHasUploadedPhoto = false; // Strict photo upload requirement flag

// Photo Transformation State
const transformState = {
  scale: 1.0,
  offsetX: 0,
  offsetY: 0,
  rotate: 0,
  flipped: false
};

// Canvas & Context (High-Res 1200 x 1360 with Scannable Barcode Engine)
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

// Color Theme Palettes (All optimized for 100% Maximum Text Contrast)
const THEME_PALETTES = {
  emerald: {
    primary: '#FACC15',      // Electric Gold
    secondary: '#FF007A',    // Hot Pink
    bgStart: '#004D2C',      // Deep Tropical Emerald Green
    bgEnd: '#002615',        // Dark Emerald
    badgeBg: 'rgba(0, 56, 32, 0.9)',
    accentText: '#00FF87',   // Neon Mint
    handleBg: 'rgba(250, 204, 21, 0.18)',
    handleBorder: '#FACC15'
  },
  official: {
    primary: '#FACC15',      // Electric Gold
    secondary: '#00FF87',    // Neon Mint
    bgStart: '#091322',      // Cyber Dark Navy
    bgEnd: '#030710',
    badgeBg: 'rgba(18, 34, 59, 0.9)',
    accentText: '#00FF87',
    handleBg: 'rgba(250, 204, 21, 0.18)',
    handleBorder: '#FACC15'
  },
  neon: {
    primary: '#FACC15',      // Electric Gold
    secondary: '#00F2FE',    // Cyan
    bgStart: '#0F172A',      // Dark Slate
    bgEnd: '#020617',
    badgeBg: 'rgba(30, 41, 59, 0.9)',
    accentText: '#00F2FE',
    handleBg: 'rgba(250, 204, 21, 0.18)',
    handleBorder: '#FACC15'
  },
  sunset: {
    primary: '#FACC15',      // Electric Gold
    secondary: '#FF0844',    // Sunset Magenta
    bgStart: '#2A0819',      // Dark Sunset Purple
    bgEnd: '#0F0208',
    badgeBg: 'rgba(59, 15, 32, 0.9)',
    accentText: '#FFD700',
    handleBg: 'rgba(250, 204, 21, 0.18)',
    handleBorder: '#FACC15'
  }
};

// Official Code 39 Specification Patterns (9 elements: b s b s b s b s b, 'w'=wide=3u, 'n'=narrow=1u)
const CODE39_SPEC = {
  '0': 'nnnwwnwnn', '1': 'wnnwnnnnw', '2': 'nnwwnnnnw', '3': 'wnwwnnnnn',
  '4': 'nnnwwnnnw', '5': 'wnnwwnnnn', '6': 'nnwwwnnnn', '7': 'nnnwnnwnw',
  '8': 'wnnwnnwnn', '9': 'nnwwnnwnn', 'A': 'wnnnnwnnw', 'B': 'nnwnnwnnw',
  'C': 'wnwnnwnnn', 'D': 'nnnnwwnnw', 'E': 'wnnnwwnnn', 'F': 'nnwnwwnnn',
  'G': 'nnnnnwwnw', 'H': 'wnnnnwwnn', 'I': 'nnwnnwwnn', 'J': 'nnnnwwwnn',
  'K': 'wnnnnnnww', 'L': 'nnwnnnnww', 'M': 'wnwnnnnwn', 'N': 'nnnnwnnww',
  'O': 'wnnnwnnwn', 'P': 'nnwnwnnwn', 'Q': 'nnnnnnwww', 'R': 'wnnnnnwwn',
  'S': 'nnwnnnwwn', 'T': 'nnnnwnwwn', 'U': 'wwnnnnnnw', 'V': 'nwwnnnnnw',
  'W': 'wwwnnnnnn', 'X': 'nwnnwnnnw', 'Y': 'wwnnwnnnn', 'Z': 'nwwnwnnnn',
  '-': 'nwnnnnwnw', '.': 'wwnnnnwnn', ' ': 'nwwnnnwnn', '*': 'nwnnwnwnn'
};

let isDragging = false;
let startX, startY;

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
  canvas.width = 1200;
  canvas.height = 1360;
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
  pCtx.font = 'bold 30px Outfit, sans-serif';
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

// Validation: Require Photo, Full Name, Stack, and Builder Title
function requireAllFields() {
  const name = document.getElementById('input-name').value.trim();
  const role = document.getElementById('input-role').value.trim();
  const title = document.getElementById('input-title').value.trim();

  if (!userHasUploadedPhoto) {
    showToast('⚠️ Photo Upload Required!');
    const dropzone = document.getElementById('dropzone');
    dropzone.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.getElementById('file-input').click();
    return false;
  }
  if (!name) {
    showToast('⚠️ Please enter your Full Name!');
    document.getElementById('input-name').focus();
    return false;
  }
  if (!role) {
    showToast('⚠️ Please enter your Stack / Primary Skill!');
    document.getElementById('input-role').focus();
    return false;
  }
  if (!title) {
    showToast('⚠️ Please enter your Builder Title!');
    document.getElementById('input-title').focus();
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

// Builder ID Card / Event Badge (1200 x 1360)
function renderBuilderIDCard() {
  const W = 1200;
  const H = 1360;
  const palette = THEME_PALETTES[currentTheme] || THEME_PALETTES.emerald;

  const name = document.getElementById('input-name').value || 'SATOSHI NAKAMOTO';
  const rawHandle = document.getElementById('input-handle').value.trim();
  const handle = rawHandle ? `@${rawHandle.replace('@', '')}` : '';
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
  ctx.lineWidth = 18;
  const frameGrad = ctx.createLinearGradient(0, 0, W, H);
  frameGrad.addColorStop(0, '#FACC15');
  frameGrad.addColorStop(0.5, '#FF007A');
  frameGrad.addColorStop(1, '#FACC15');
  ctx.strokeStyle = frameGrad;
  ctx.roundRect(25, 25, W - 50, H - 50, 44);
  ctx.stroke();

  // 2. Header Logo (HACKER [गोवा] HOUSE)
  ctx.fillStyle = '#FF007A';
  ctx.font = '800 32px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BUILDER PASS   ·   GOA, INDIA', W / 2, 75);

  ctx.font = '900 96px "Playfair Display", Georgia, serif';

  // HACKER on Left
  ctx.textAlign = 'right';
  ctx.fillStyle = '#FACC15';
  ctx.fillText('HACKER', W / 2 - 60, 175);

  // HOUSE on Right
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FACC15';
  ctx.fillText('HOUSE', W / 2 + 60, 175);

  // Hot Pink Devanagari [गोवा] in Center
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = '900 64px Outfit, sans-serif';

  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 7;
  ctx.strokeText('गोवा', W / 2, 170);

  ctx.fillStyle = '#FF007A';
  ctx.fillText('गोवा', W / 2, 170);
  ctx.restore();

  // Subtitle Date
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 28px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('28  –  31 OCTOBER 2026', W / 2, 230);

  // Divider Line
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(70, 255);
  ctx.lineTo(W - 70, 255);
  ctx.stroke();

  // 3. Photo Frame Area (460 x 440)
  const photoX = W / 2 - 230;
  const photoY = 278;
  const photoW = 460;
  const photoH = 440;
  const photoRadius = 32;

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

  ctx.lineWidth = 10;
  ctx.strokeStyle = '#FACC15';
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, photoRadius);
  ctx.stroke();

  // 4. Builder Information Section
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 68px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(name.toUpperCase(), W / 2, 792);

  // X Handle Chip
  let nextY = 822;
  if (handle) {
    ctx.fillStyle = 'rgba(250, 204, 21, 0.18)';
    ctx.beginPath();
    ctx.roundRect(W / 2 - 220, nextY, 440, 58, 29);
    ctx.fill();
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#FACC15';
    ctx.font = '800 34px "JetBrains Mono", monospace';
    ctx.fillText(handle, W / 2, nextY + 41);
    nextY += 78;
  } else {
    nextY += 20;
  }

  // Role Tag
  ctx.fillStyle = palette.accentText;
  ctx.font = '800 38px Outfit, sans-serif';
  ctx.fillText(`⚡ ${role}`, W / 2, nextY + 25);
  nextY += 58;

  // Builder Title Box
  ctx.fillStyle = palette.badgeBg;
  ctx.beginPath();
  ctx.roundRect(90, nextY, W - 180, 86, 24);
  ctx.fill();
  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#FACC15';
  ctx.font = '900 46px Outfit, sans-serif';
  ctx.fillText(title, W / 2, nextY + 58);
  nextY += 114;

  // 5. 100% Scannable Official Code 39 Barcode (Decodes to HHG-2026-<HANDLE>)
  const cleanHandle = handle ? handle.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : 'BUILDER';
  const passIdText = `HHG-2026-${cleanHandle}`;
  
  drawScannableCode39Barcode(ctx, W / 2, nextY, W - 240, 72, passIdText);
  nextY += 106;

  // Pass ID Text
  ctx.fillStyle = '#FACC15';
  ctx.font = '800 32px "JetBrains Mono", monospace';
  ctx.fillText('📷 SCAN BARCODE TO VIEW PASS ID', W / 2, nextY);
  nextY += 48;

  // Footer Tagline
  ctx.fillStyle = palette.accentText;
  ctx.font = '900 36px Outfit, sans-serif';
  ctx.fillText('🌴 #FrameInGoa ⚡ @HackerHouseGoa', W / 2, nextY);

  ctx.restore();
}

// 100% Specification-Compliant Code 39 Barcode Generator
// Decodes directly to string (e.g. HHG-2026-KAUSHALDEV) when scanned by mobile phone cameras!
function drawScannableCode39Barcode(ctx, centerX, y, availableWidth, height, textToEncode) {
  ctx.save();

  let raw = textToEncode.toUpperCase().replace(/[^0-9A-Z-. ]/g, '');
  if (!raw) raw = 'HHG-2026-BUILDER';
  
  // Code 39 requires Start/Stop character '*'
  const fullCode = `*${raw}*`;

  // Calculate total module width of Code 39 text
  // Wide element = 3 units, narrow element = 1 unit. Inter-character space = 1 unit.
  let totalUnits = 0;
  const elements = [];

  for (let i = 0; i < fullCode.length; i++) {
    const char = fullCode[i];
    const pattern = CODE39_SPEC[char] || CODE39_SPEC['*'];

    // 9 elements per character (5 bars, 4 spaces)
    for (let p = 0; p < 9; p++) {
      const isBar = (p % 2 === 0);
      const isWide = (pattern[p] === 'w');
      const widthUnits = isWide ? 3 : 1;

      elements.push({ isBar, widthUnits });
      totalUnits += widthUnits;
    }

    // Inter-character gap space (1 unit) except after last character
    if (i < fullCode.length - 1) {
      elements.push({ isBar: false, widthUnits: 1 });
      totalUnits += 1;
    }
  }

  // Determine narrow module width
  const unitWidth = (availableWidth - 80) / totalUnits;
  const actualBarcodeWidth = totalUnits * unitWidth;

  // Draw Solid White High-Contrast Quiet Zone Box
  const quietZonePaddingX = 32;
  const quietZonePaddingY = 12;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(
    centerX - actualBarcodeWidth / 2 - quietZonePaddingX,
    y - quietZonePaddingY,
    actualBarcodeWidth + quietZonePaddingX * 2,
    height + quietZonePaddingY * 2,
    14
  );
  ctx.fill();

  // Render Barcode Black & White Bars
  ctx.fillStyle = '#000000';
  let curX = centerX - actualBarcodeWidth / 2;

  for (let i = 0; i < elements.length; i++) {
    const elem = elements[i];
    const elemPxWidth = elem.widthUnits * unitWidth;

    if (elem.isBar) {
      ctx.fillRect(curX, y, elemPxWidth + 0.3, height);
    }
    curX += elemPxWidth;
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

// Download, Copy & Share Functions (Strict Validation & Clean Clipboard Copy)
function downloadGraphic() {
  if (!requireAllFields()) return;

  const link = document.createElement('a');
  link.download = 'HH_Goa_2026_Builder_Pass.png';
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();

  triggerConfetti();
  showToast('Badge downloaded in High-Res! 🚀');
}

function shareToX() {
  if (!requireAllFields()) return;

  const text = encodeURIComponent(
    `Just built my official HH Goa 2026 Builder Pass! 🚀🌴\n\nReady to hack in Goa. Get yours now! #FrameInGoa @HackerHouseGoa`
  );
  const shareUrl = `https://twitter.com/intent/tweet?text=${text}`;
  window.open(shareUrl, '_blank');

  triggerConfetti();
  showToast('Opened Twitter share! Don\'t forget to attach your downloaded graphic! 🐦');
}

async function copyImageToClipboard() {
  if (!requireAllFields()) return;

  const copyBtn = document.getElementById('btn-copy');
  const originalText = copyBtn ? copyBtn.innerHTML : '📋 Copy Image';

  try {
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 1.0));
    if (blob) {
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      
      if (copyBtn) {
        copyBtn.innerHTML = '✓ Copied to Clipboard!';
        copyBtn.style.background = 'rgba(0, 255, 135, 0.25)';
        copyBtn.style.borderColor = '#00FF87';
        copyBtn.style.color = '#00FF87';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.style.background = '';
          copyBtn.style.borderColor = '';
          copyBtn.style.color = '';
        }, 2500);
      }
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
