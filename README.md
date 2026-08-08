# HH Goa 2026 – Frame & Builder ID Card Generator 🌴⚡

[![Live Web Tool](https://img.shields.io/badge/Live_App-HH_Goa_2026-00F2FE?style=for-the-badge&logo=vercel)](https://github.com/Kausha07/hhgoa-badge-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Mobile Friendly](https://img.shields.io/badge/Mobile-Optimized-00FF87)](index.html)

An ultra-sleek, zero-latency, client-side web application built for the **Hacker House Goa 2026** shortlisting task. It enables builders to generate custom **PFP Frames (Format A)** and **Builder ID Pass Badges (Format B)** instantly, ready for download and sharing on X (#FrameInGoa).

---

## 🔥 Features & Highlights

- **Dual Mode Format Support**:
  - **Format A: PFP Frame / Overlay**: 1080x1080 high-res avatar overlay with `#FrameInGoa` branding.
  - **Format B: Builder ID Pass Card**: 1200x1600 futuristic hacker pass complete with Name, X handle, Stack, Auto-Generated Builder Title, QR/Barcode, and Holographic Lanyard Slot.
- **Interactive Photo Positioning Canvas**:
  - Drag, scale (zoom in/out), rotate, and pan photo position directly on canvas or via precision sliders.
  - Touch gesture support for mobile devices.
- **Auto-Generate Builder Titles**: Instant randomizer generating titles like `Kernel Alchemist 🧪`, `GPU Whisperer ⚡`, `Solana Byte Wizard 🚀`, `Agentic AI Overlord 🤖`.
- **4 Custom Themes**:
  - 🌴 **Cyber Goa** (Neon Cyan & Magenta)
  - 🌅 **Sunset Gold** (Golden Hour Sunset)
  - 💻 **Matrix Hacker** (Neon Cyber Green)
  - ⚡ **Electric White** (Minimal Tech)
- **Instant High-Res Export & Share Flow**:
  - 1-Click High DPI PNG Download.
  - 1-Click Copy Image to Clipboard.
  - Pre-filled **Share to X** intent pre-populated with `#FrameInGoa @HackerHouseGoa`.
  - Confetti celebration upon generation.
- **Zero Login / Zero Signup Gate**: Immediate one-pass execution.

---

## 🚀 Quick Start (Local Setup)

### 1. Clone & Run
```bash
git clone https://github.com/Kausha07/hhgoa-badge-generator.git
cd hhgoa-badge-generator
```

### 2. Launch Local Server
No build tools required! Simply open `index.html` in your browser or run with any static file server:

```bash
# Using Python
python3 -m http.server 3000

# OR using Node serve
npx serve .
```

Open `http://localhost:3000` in your browser.

---

## 🐳 Docker Deployment

```bash
# Build Docker Image
docker build -t hhgoa-badge-generator .

# Run Container
docker run -p 3000:3000 hhgoa-badge-generator
```

---

## 🛠 Tech Stack

- **Frontend**: HTML5 Canvas, Vanilla CSS3 (CSS Variables, Flexbox/Grid, Glassmorphism), Modern JavaScript (ES6+).
- **Libraries**: Canvas Confetti.
- **Design System**: Goa Cyberpunk Neon Palette (`#00F2FE`, `#FF0844`, `#00FF87`).

---

## 📄 License

This project is licensed under the MIT License.
