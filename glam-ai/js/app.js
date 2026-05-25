// ─── STATE ───────────────────────────────────────────────────────────────────
const state = {
  currentFilter: 'none',
  filterStrength: 0.8,
  beauty: { skin: 60, bright: 50, glow: 40, warm: 50, sharp: 30 },
  adj: { brightness: 0, contrast: 0, saturation: 0, exposure: 0, highlights: 0, shadows: 0 },
  text: { content: '', style: 'bold', color: '#ffffff' },
  format: 'square',
  originalImageData: null,
  hasImage: false
};

// ─── CANVAS SETUP ─────────────────────────────────────────────────────────────
let mainCanvas, mainCtx, heroCanvas, heroCtx;
let beforeCanvas, afterCanvas, beforeCtx, afterCtx;

document.addEventListener('DOMContentLoaded', () => {
  mainCanvas = document.getElementById('mainCanvas');
  mainCtx = mainCanvas.getContext('2d');
  heroCanvas = document.getElementById('heroCanvas');
  heroCtx = heroCanvas.getContext('2d');
  beforeCanvas = document.getElementById('beforeCanvas');
  afterCanvas = document.getElementById('afterCanvas');
  beforeCtx = beforeCanvas.getContext('2d');
  afterCtx = afterCanvas.getContext('2d');

  drawDemoImage(heroCtx, 320, 380, 'glamour');
  drawShowcaseCanvases();
});

// ─── DEMO IMAGE GENERATOR ─────────────────────────────────────────────────────
function drawDemoImage(ctx, w, h, filter) {
  ctx.clearRect(0, 0, w, h);

  // background gradient
  const bg = ctx.createLinearGradient(0, 0, w, h);
  if (filter === 'glamour') { bg.addColorStop(0, '#2a1520'); bg.addColorStop(1, '#1a0a10'); }
  else if (filter === 'golden') { bg.addColorStop(0, '#3a2510'); bg.addColorStop(1, '#1a1005'); }
  else if (filter === 'cinematic') { bg.addColorStop(0, '#051020'); bg.addColorStop(1, '#020810'); }
  else if (filter === 'neon') { bg.addColorStop(0, '#150030'); bg.addColorStop(1, '#0a0018'); }
  else { bg.addColorStop(0, '#2a2520'); bg.addColorStop(1, '#1a1510'); }
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Abstract face silhouette
  ctx.save();
  // Head
  const headGrad = ctx.createRadialGradient(w/2, h*0.38, 10, w/2, h*0.38, h*0.22);
  if (filter === 'glamour') { headGrad.addColorStop(0, '#f4c0a0'); headGrad.addColorStop(1, '#d0806060'); }
  else if (filter === 'golden') { headGrad.addColorStop(0, '#f8d090'); headGrad.addColorStop(1, '#d09040'); }
  else if (filter === 'cinematic') { headGrad.addColorStop(0, '#a0c0d0'); headGrad.addColorStop(1, '#406080'); }
  else if (filter === 'neon') { headGrad.addColorStop(0, '#e080f0'); headGrad.addColorStop(1, '#8020b0'); }
  else { headGrad.addColorStop(0, '#e8c0a0'); headGrad.addColorStop(1, '#c09070'); }

  ctx.beginPath();
  ctx.ellipse(w/2, h*0.38, w*0.22, h*0.26, 0, 0, Math.PI*2);
  ctx.fillStyle = headGrad;
  ctx.fill();

  // Hair
  const hairGrad = ctx.createLinearGradient(w/2 - 70, 0, w/2 + 70, h*0.4);
  if (filter === 'neon') { hairGrad.addColorStop(0, '#400080'); hairGrad.addColorStop(1, '#200040'); }
  else { hairGrad.addColorStop(0, '#1a0a05'); hairGrad.addColorStop(1, '#0a0502'); }
  ctx.beginPath();
  ctx.ellipse(w/2, h*0.26, w*0.25, h*0.18, 0, 0, Math.PI);
  ctx.fillStyle = hairGrad;
  ctx.fill();

  // Shoulders / body
  const bodyGrad = ctx.createLinearGradient(0, h*0.6, 0, h);
  if (filter === 'glamour') { bodyGrad.addColorStop(0, '#c0607060'); bodyGrad.addColorStop(1, '#80202000'); }
  else if (filter === 'golden') { bodyGrad.addColorStop(0, '#b0701060'); bodyGrad.addColorStop(1, '#80401000'); }
  else { bodyGrad.addColorStop(0, '#404040'); bodyGrad.addColorStop(1, '#202020'); }
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(w*0.1, h*0.62);
  ctx.bezierCurveTo(w*0.25, h*0.58, w*0.35, h*0.56, w/2, h*0.56);
  ctx.bezierCurveTo(w*0.65, h*0.56, w*0.75, h*0.58, w*0.9, h*0.62);
  ctx.lineTo(w, h);
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // Eyes
  const eyeColor = filter === 'neon' ? '#d040f0' : filter === 'cinematic' ? '#60a0c0' : filter === 'golden' ? '#80600020' : '#40202010';
  [[w*0.42, h*0.36], [w*0.58, h*0.36]].forEach(([ex, ey]) => {
    ctx.beginPath();
    ctx.ellipse(ex, ey, 9, 5, 0, 0, Math.PI*2);
    ctx.fillStyle = '#151005';
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(ex+2, ey-1, 2, 2, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fill();
  });

  // Lips
  const lipColor = filter === 'glamour' ? '#d04060' : filter === 'rose' ? '#e07090' : filter === 'neon' ? '#e030a0' : '#b05050';
  ctx.beginPath();
  ctx.moveTo(w*0.44, h*0.44);
  ctx.bezierCurveTo(w*0.47, h*0.43, w*0.5, h*0.445, w*0.5, h*0.445);
  ctx.bezierCurveTo(w*0.5, h*0.445, w*0.53, h*0.43, w*0.56, h*0.44);
  ctx.bezierCurveTo(w*0.55, h*0.46, w*0.5, h*0.475, w*0.5, h*0.475);
  ctx.bezierCurveTo(w*0.5, h*0.475, w*0.45, h*0.46, w*0.44, h*0.44);
  ctx.fillStyle = lipColor;
  ctx.fill();

  // Overlay filter effects
  if (filter !== 'none') {
    applyCanvasFilterEffect(ctx, w, h, filter, 0.7);
  }

  ctx.restore();

  // Decorative elements
  drawSparkles(ctx, w, h, filter);
}

function applyCanvasFilterEffect(ctx, w, h, filter, strength) {
  ctx.save();
  ctx.globalAlpha = strength * 0.5;
  if (filter === 'glamour') {
    ctx.fillStyle = 'rgba(244, 165, 176, 0.15)';
    ctx.fillRect(0, 0, w, h);
  } else if (filter === 'golden') {
    ctx.fillStyle = 'rgba(255, 215, 80, 0.2)';
    ctx.fillRect(0, 0, w, h);
  } else if (filter === 'cinematic') {
    // Letterbox bars
    ctx.fillStyle = '#000';
    ctx.globalAlpha = 0.4;
    ctx.fillRect(0, 0, w, h * 0.08);
    ctx.fillRect(0, h * 0.92, w, h * 0.08);
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = 'rgba(0, 30, 60, 0.3)';
    ctx.fillRect(0, 0, w, h);
  } else if (filter === 'neon') {
    const g = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w*0.6);
    g.addColorStop(0, 'rgba(180, 0, 255, 0.1)');
    g.addColorStop(1, 'rgba(100, 0, 200, 0.3)');
    ctx.fillStyle = g;
    ctx.globalAlpha = 0.6;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
}

function drawSparkles(ctx, w, h, filter) {
  const sparkColor = filter === 'neon' ? '#e080ff' : filter === 'golden' ? '#ffd700' : '#f4a5b0';
  const positions = [[w*0.15, h*0.15], [w*0.82, h*0.2], [w*0.1, h*0.7], [w*0.88, h*0.75], [w*0.5, h*0.08]];
  positions.forEach(([sx, sy]) => {
    ctx.save();
    ctx.translate(sx, sy);
    ctx.fillStyle = sparkColor;
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.rotate(i * Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(1, -1);
      ctx.lineTo(6, 0);
      ctx.lineTo(1, 1);
      ctx.lineTo(0, 6);
      ctx.lineTo(-1, 1);
      ctx.lineTo(-6, 0);
      ctx.lineTo(-1, -1);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  });
}

function drawShowcaseCanvases() {
  // Before (no filter)
  drawDemoImage(beforeCtx, 260, 300, 'none');
  // After (with beauty)
  drawDemoImage(afterCtx, 260, 300, 'glamour');

  // Add beauty overlay glow on afterCanvas
  afterCtx.save();
  const glow = afterCtx.createRadialGradient(130, 120, 20, 130, 120, 100);
  glow.addColorStop(0, 'rgba(244, 200, 180, 0.2)');
  glow.addColorStop(1, 'rgba(244, 200, 180, 0)');
  afterCtx.fillStyle = glow;
  afterCtx.fillRect(0, 0, 260, 300);
  afterCtx.restore();
}

// ─── HERO FILTER ──────────────────────────────────────────────────────────────
let activeHeroFilter = 'glamour';
function applyHeroFilter(filter) {
  activeHeroFilter = filter;
  document.querySelectorAll('.hero .filter-pill').forEach(p => p.classList.remove('active'));
  event.target.classList.add('active');
  drawDemoImage(heroCtx, 320, 380, filter);
}

// ─── FILE UPLOAD ──────────────────────────────────────────────────────────────
function triggerUpload() {
  document.getElementById('fileInput').click();
}

function loadImage(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const uploadZone = document.getElementById('uploadZone');
      const canvas = document.getElementById('mainCanvas');

      // Set canvas size based on format
      const ratio = getFormatRatio(state.format);
      let cw = Math.min(img.width, 600);
      let ch = cw / ratio;

      mainCanvas.width = img.width;
      mainCanvas.height = img.height;
      mainCtx.drawImage(img, 0, 0);

      state.originalImageData = mainCtx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
      state.hasImage = true;

      uploadZone.style.display = 'none';
      canvas.style.display = 'block';
      applyAllEffects();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function getFormatRatio(format) {
  const ratios = { square: 1, portrait: 4/5, story: 9/16, landscape: 16/9 };
  return ratios[format] || 1;
}

// ─── CANVAS FILTER ENGINE ─────────────────────────────────────────────────────
function applyAllEffects() {
  if (!state.hasImage || !state.originalImageData) return;

  // Reset to original
  mainCtx.putImageData(state.originalImageData, 0, 0);
  const imageData = mainCtx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
  const data = imageData.data;

  // Apply adjustments
  applyAdjustmentsToData(data);

  // Apply beauty
  applyBeautyToData(data);

  // Apply filter
  applyFilterToData(data, state.currentFilter, state.filterStrength);

  mainCtx.putImageData(imageData, 0, 0);
}

function applyAdjustmentsToData(data) {
  const { brightness, contrast, saturation, exposure } = state.adj;
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i], g = data[i+1], b = data[i+2];

    // Brightness
    if (brightness !== 0) {
      const b2 = brightness * 1.5;
      r = clamp(r + b2); g = clamp(g + b2); b = clamp(b + b2);
    }

    // Exposure
    if (exposure !== 0) {
      const exp = Math.pow(2, exposure / 100);
      r = clamp(r * exp); g = clamp(g * exp); b = clamp(b * exp);
    }

    // Contrast
    if (contrast !== 0) {
      const f = (259 * (contrast + 255)) / (255 * (259 - contrast));
      r = clamp(f * (r - 128) + 128);
      g = clamp(f * (g - 128) + 128);
      b = clamp(f * (b - 128) + 128);
    }

    // Saturation
    if (saturation !== 0) {
      const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const s = 1 + saturation / 100;
      r = clamp(gray + (r - gray) * s);
      g = clamp(gray + (g - gray) * s);
      b = clamp(gray + (b - gray) * s);
    }

    data[i] = r; data[i+1] = g; data[i+2] = b;
  }
}

function applyBeautyToData(data) {
  const warmth = (state.beauty.warm - 50) / 50;
  const brightBoost = (state.beauty.bright - 50) / 50 * 20;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i], g = data[i+1], b = data[i+2];

    // Warmth
    if (warmth > 0) {
      r = clamp(r + warmth * 15);
      b = clamp(b - warmth * 10);
    } else if (warmth < 0) {
      r = clamp(r + warmth * 15);
      b = clamp(b - warmth * 10);
    }

    // Brightness boost
    r = clamp(r + brightBoost);
    g = clamp(g + brightBoost);
    b = clamp(b + brightBoost);

    // Glow effect (soft light)
    const glow = state.beauty.glow / 100;
    if (glow > 0) {
      r = clamp(r + (255 - r) * glow * 0.15);
      g = clamp(g + (255 - g) * glow * 0.15);
      b = clamp(b + (255 - b) * glow * 0.1);
    }

    data[i] = r; data[i+1] = g; data[i+2] = b;
  }
}

function applyFilterToData(data, filter, strength) {
  if (filter === 'none') return;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i], g = data[i+1], b = data[i+2];
    let nr = r, ng = g, nb = b;

    switch(filter) {
      case 'glamour':
        nr = clamp(r * 1.05 + 15 * strength);
        ng = clamp(g * 0.95);
        nb = clamp(b * 0.95 + 5 * strength);
        // Pink tint
        nr = clamp(nr + 10 * strength);
        nb = clamp(nb + 5 * strength);
        break;
      case 'golden':
        nr = clamp(r * 1.1 + 20 * strength);
        ng = clamp(g * 1.05 + 10 * strength);
        nb = clamp(b * 0.8);
        break;
      case 'cinematic':
        const lum = 0.2126*r + 0.7152*g + 0.0722*b;
        nr = clamp(r * 0.85 + lum * 0.1 - 10 * strength);
        ng = clamp(g * 0.9 + lum * 0.05);
        nb = clamp(b * 1.1 + 15 * strength);
        break;
      case 'neon':
        const nl = 0.3*r + 0.59*g + 0.11*b;
        nr = clamp(nl + 100 * strength * (r/255));
        ng = clamp(nl * 0.3);
        nb = clamp(nl + 120 * strength * (b/255));
        break;
      case 'dreamy':
        nr = clamp(r * 0.95 + 25 * strength);
        ng = clamp(g * 0.9 + 20 * strength);
        nb = clamp(b + 35 * strength);
        break;
      case 'vintage':
        nr = clamp(r * 0.9 + 40 * strength);
        ng = clamp(g * 0.85 + 25 * strength);
        nb = clamp(b * 0.65);
        break;
      case 'bw':
        const bwl = 0.2126*r + 0.7152*g + 0.0722*b;
        const contrasted = clamp((bwl - 128) * 1.2 + 128);
        nr = ng = nb = contrasted;
        break;
      case 'rose':
        nr = clamp(r + 20 * strength);
        ng = clamp(g * 0.9 + 5 * strength);
        nb = clamp(b * 0.95 + 10 * strength);
        break;
    }

    // Blend with original
    data[i]   = Math.round(r + (nr - r) * strength);
    data[i+1] = Math.round(g + (ng - g) * strength);
    data[i+2] = Math.round(b + (nb - b) * strength);
  }
}

function clamp(v) { return Math.max(0, Math.min(255, Math.round(v))); }

// ─── TOOL SWITCHING ───────────────────────────────────────────────────────────
function setTool(tool, btn) {
  document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.panel').forEach(p => p.style.display = 'none');
  const panel = document.getElementById('panel-' + tool);
  if (panel) panel.style.display = 'block';
}

// ─── FILTERS ──────────────────────────────────────────────────────────────────
function applyFilter(filter, el) {
  state.currentFilter = filter;
  document.querySelectorAll('.filter-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  applyAllEffects();
}

function updateFilterStrength(val) {
  state.filterStrength = val / 100;
  document.getElementById('filterStrengthVal').textContent = val + '%';
  applyAllEffects();
}

// ─── BEAUTY ───────────────────────────────────────────────────────────────────
function applyBeauty(prop, val) {
  state.beauty[prop] = parseInt(val);
  const ids = { skin: 'skinVal', bright: 'brightVal', glow: 'glowVal', warm: 'warmVal', sharp: 'sharpVal' };
  if (ids[prop]) document.getElementById(ids[prop]).textContent = val;
  applyAllEffects();
}

function applyBeautyPreset(preset) {
  const presets = {
    natural: { skin: 40, bright: 55, glow: 35, warm: 55, sharp: 20 },
    glam:    { skin: 80, bright: 65, glow: 70, warm: 60, sharp: 40 },
    editorial: { skin: 30, bright: 45, glow: 20, warm: 40, sharp: 60 }
  };
  const p = presets[preset];
  if (!p) return;
  Object.assign(state.beauty, p);
  // Update sliders
  const sliderMap = { skin: 0, bright: 1, glow: 2, warm: 3, sharp: 4 };
  const sliders = document.querySelectorAll('#panel-beauty input[type=range]');
  sliders[0].value = p.skin;   document.getElementById('skinVal').textContent = p.skin;
  sliders[1].value = p.bright; document.getElementById('brightVal').textContent = p.bright;
  sliders[2].value = p.glow;   document.getElementById('glowVal').textContent = p.glow;
  sliders[3].value = p.warm;   document.getElementById('warmVal').textContent = p.warm;
  sliders[4].value = p.sharp;  document.getElementById('sharpVal').textContent = p.sharp;
  applyAllEffects();
}

// ─── ADJUSTMENTS ──────────────────────────────────────────────────────────────
function applyAdj(prop, val) {
  state.adj[prop] = parseInt(val);
  const ids = { brightness: 'adjBright', contrast: 'adjContrast', saturation: 'adjSat', exposure: 'adjExp', highlights: 'adjHigh', shadows: 'adjShadow' };
  if (ids[prop]) document.getElementById(ids[prop]).textContent = val;
  applyAllEffects();
}

// ─── TEXT ─────────────────────────────────────────────────────────────────────
function setTextStyle(style, btn) {
  state.text.style = style;
  document.querySelectorAll('.ts-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function setTextColor(color, btn) {
  state.text.color = color;
  document.querySelectorAll('.color-dot').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function addTextToCanvas() {
  if (!state.hasImage) { alert('Please upload an image first!'); return; }
  const text = document.getElementById('textInput').value.trim();
  if (!text) { alert('Please enter some text!'); return; }

  const fonts = {
    bold: 'bold 36px "Playfair Display"',
    script: 'italic 32px "Playfair Display"',
    minimal: '300 28px "DM Sans"',
    display: '900 40px "Playfair Display"'
  };

  mainCtx.save();
  mainCtx.font = fonts[state.text.style] || fonts.bold;
  mainCtx.fillStyle = state.text.color;
  mainCtx.textAlign = 'center';
  mainCtx.shadowColor = 'rgba(0,0,0,0.5)';
  mainCtx.shadowBlur = 8;
  mainCtx.fillText(text, mainCanvas.width/2, mainCanvas.height * 0.9);
  mainCtx.restore();
}

// ─── FORMAT ───────────────────────────────────────────────────────────────────
function setFormat(format, btn) {
  state.format = format;
  document.querySelectorAll('.fmt-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ─── VIRAL ANALYZER ───────────────────────────────────────────────────────────
function analyzeViral() {
  const btn = document.querySelector('#panel-viral .panel-btn.big');
  btn.textContent = '⏳ Analyzing...';
  btn.disabled = true;

  setTimeout(() => {
    const visual  = 75 + Math.floor(Math.random() * 22);
    const trend   = 65 + Math.floor(Math.random() * 30);
    const engage  = 70 + Math.floor(Math.random() * 25);
    const score   = Math.round((visual + trend + engage) / 3);

    document.getElementById('viralScoreNum').textContent = score;
    document.getElementById('viralResults').style.display = 'block';

    setTimeout(() => {
      document.getElementById('vbVisual').style.width  = visual + '%';
      document.getElementById('vbTrend').style.width   = trend + '%';
      document.getElementById('vbEngage').style.width  = engage + '%';
    }, 100);

    const tips = [
      '✦ Strong visual contrast detected — great for mobile feeds',
      '✦ Add a bold text overlay to increase dwell time by ~40%',
      '✦ Crop to 4:5 for optimal Instagram feed performance',
      '✦ Warm tones trending +22% on TikTok this week',
      '✦ Consider adding motion: Reels with movement get 3× reach'
    ].slice(0, 3 + Math.floor(Math.random() * 2));

    document.getElementById('viralTips').innerHTML = tips.map(t => `<div style="margin-bottom:6px;">${t}</div>`).join('');

    btn.textContent = '✦ Re-Analyze';
    btn.disabled = false;
  }, 1800);
}

function exportFor(platform) {
  const ratios = { tiktok: '9:16', instagram: '4:5', youtube: '16:9' };
  const formatMap = { tiktok: 'story', instagram: 'portrait', youtube: 'landscape' };
  // Set format
  const fmtBtns = { square: 0, portrait: 1, story: 2, landscape: 3 };
  const fmt = formatMap[platform];
  state.format = fmt;
  const btns = document.querySelectorAll('.fmt-btn');
  btns.forEach(b => b.classList.remove('active'));
  btns[fmtBtns[fmt]].classList.add('active');
  alert(`✦ Optimized for ${platform.charAt(0).toUpperCase() + platform.slice(1)} (${ratios[platform]})\nDownloading...`);
  downloadCanvas();
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────
function downloadCanvas() {
  if (!state.hasImage) {
    // Download demo canvas
    const link = document.createElement('a');
    link.download = 'glam-ai-demo.png';
    link.href = mainCanvas.toDataURL('image/png');
    link.click();
    return;
  }
  const link = document.createElement('a');
  link.download = `glam-ai-${state.currentFilter}-${Date.now()}.png`;
  link.href = mainCanvas.toDataURL('image/png');
  link.click();
}

function resetCanvas() {
  if (state.originalImageData) {
    mainCtx.putImageData(state.originalImageData, 0, 0);
  }
  state.currentFilter = 'none';
  state.filterStrength = 0.8;
  state.beauty = { skin: 60, bright: 50, glow: 40, warm: 50, sharp: 30 };
  state.adj = { brightness: 0, contrast: 0, saturation: 0, exposure: 0, highlights: 0, shadows: 0 };
  document.querySelectorAll('.filter-thumb').forEach(t => t.classList.remove('active'));
  document.querySelector('.filter-thumb').classList.add('active');
  document.getElementById('filterStrength').value = 80;
  document.getElementById('filterStrengthVal').textContent = '80%';
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function openStudio() {
  document.getElementById('modalBackdrop').classList.add('open');
}
function closeStudio() {
  document.getElementById('modalBackdrop').classList.remove('open');
}
function closeModal(e) {
  if (e.target === document.getElementById('modalBackdrop')) closeStudio();
}

// ─── SCROLL HELPER ────────────────────────────────────────────────────────────
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ─── DRAG & DROP ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const zone = document.getElementById('uploadZone');
  if (!zone) return;

  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.style.borderColor = 'rgba(232,196,160,0.6)';
  });
  zone.addEventListener('dragleave', () => {
    zone.style.borderColor = '';
  });
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const input = document.getElementById('fileInput');
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      loadImage({ target: input });
    }
  });
});
