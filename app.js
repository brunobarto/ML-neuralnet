const D = window.LANDSCAPE;
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

/* ================= I18N ================= */
const T = {
  en: {
    nav_steps:"Steps", nav_lab:"Landscape",
    hero_tag:"NumPy · Matplotlib · from scratch",
    hero_t:"Watching gradient descent<br>find its way down.",
    hero_s:"A 337-parameter network, written without any ML library, trained, then projected onto the 2D plane where it moved the most.",
    hero_cta:"See the landscape ↓",
    s1_t:"Data", s1_p:"Two interleaved half-moons, 400 noisy points. No straight line separates them, so the model needs hidden layers to bend the decision boundary.",
    s2_t:"Forward pass", s2_p:"2 → 16 → 16 → 1. Tanh in the hidden layers, sigmoid at the output, binary cross-entropy as the loss. Every weight lives in one flat vector θ.",
    s3_t:"Backpropagation", s3_p:"The chain rule, applied layer by layer from the loss back to the input. Sigmoid + cross-entropy simplify to <b>p − y</b>. The analytic gradient is checked against finite differences before training.",
    s4_t:"Gradient descent", s4_p:"Full batch, θ ← θ − η∇L, for 1500 steps. A snapshot of θ is saved every 10 steps: that sequence is the path.",
    s5_t:"Projecting 337 dimensions to 2", s5_p:"PCA on the snapshots (θₜ − θ*) gives the two directions δ₁, δ₂ where the optimizer moved the most. The loss is then evaluated on a 41×41 grid: L(θ* + αδ₁ + βδ₂).",
    s6_t:"Reading the result", s6_p:"A steep first drop, then a slow slide along a flat valley toward the minimum. It is a slice: real curvature in the other 335 dimensions stays hidden.",
    lab_t:"The landscape", st_acc:"accuracy", st_evr:"path variance in 2 PCs", st_par:"parameters",
    c3d_t:"3D surface — drag to rotate", c2d_t:"Top view — contour levels", cl_t:"Loss over training",
    lg_surf:"loss surface", lg_path:"descent path", lg_min:"minimum θ*", replay:"↻ replay",
    tip_loss:"loss", tip_step:"step",
    pop_surface_t:"Loss surface", pop_surface_b:"Height = training loss at θ* + αδ₁ + βδ₂. Purple is low, yellow is high. Each point is a full network whose weights were moved along the two PCA directions.",
    pop_path_t:"Descent path", pop_path_b:"Weight snapshots projected onto (δ₁, δ₂). Its height is the loss at the projected point, so it sits exactly on the surface. The sharp turn shows the optimizer switching from the steep direction to the valley floor.",
    pop_start_t:"Start", pop_start_b:"Random Xavier initialization. The gradient is large here, so the first steps cover the most distance.",
    pop_end_t:"Minimum θ*", pop_end_b:"Final weights, at the origin (0,0) by construction. The surface is flat around it: gradients are close to zero and training slows down.",
    pop_heat_t:"Contour levels", pop_heat_b:"The same surface seen from above, split into discrete loss bands. The path crosses bands at right angles when the descent is steep: the gradient is perpendicular to the level lines. Hover to read values.",
    pop_curve_t:"Training curve", pop_curve_b:"Loss per step on a log scale. A fast drop followed by a long plateau, the same shape as the path on the surface. Hover to read values.",
    pop_acc_t:"Accuracy", pop_acc_b:"Share of training points classified correctly (threshold p > 0.5).",
    pop_evr_t:"Explained variance", pop_evr_b:"How much of the trajectory's movement the two PCA directions capture. High means the 2D picture is a faithful view of the optimization path, even though the network has 337 dimensions.",
    pop_params_t:"Parameters", pop_params_b:"16·2 + 16 + 16·16 + 16 + 16 + 1 = 337 weights and biases, all in one NumPy vector."
  },
  fr: {
    nav_steps:"Étapes", nav_lab:"Paysage",
    hero_tag:"NumPy · Matplotlib · from scratch",
    hero_t:"Regarder la descente de gradient<br>trouver son chemin.",
    hero_s:"Un réseau de 337 paramètres, écrit sans aucune bibliothèque de ML, entraîné, puis projeté sur le plan 2D où il a le plus bougé.",
    hero_cta:"Voir le paysage ↓",
    s1_t:"Données", s1_p:"Deux demi-lunes imbriquées, 400 points bruités. Aucune droite ne les sépare : le modèle a besoin de couches cachées pour courber la frontière de décision.",
    s2_t:"Propagation avant", s2_p:"2 → 16 → 16 → 1. Tanh dans les couches cachées, sigmoïde en sortie, entropie croisée binaire comme perte. Tous les poids vivent dans un seul vecteur θ.",
    s3_t:"Rétropropagation", s3_p:"La règle de dérivation en chaîne, couche par couche, de la perte vers l'entrée. Sigmoïde + entropie croisée se simplifient en <b>p − y</b>. Le gradient analytique est vérifié par différences finies avant l'entraînement.",
    s4_t:"Descente de gradient", s4_p:"Lot complet, θ ← θ − η∇L, pendant 1500 pas. Un instantané de θ tous les 10 pas : cette suite forme le chemin.",
    s5_t:"Projeter 337 dimensions en 2", s5_p:"Une ACP sur les instantanés (θₜ − θ*) donne les deux directions δ₁, δ₂ où l'optimiseur a le plus bougé. La perte est évaluée sur une grille 41×41 : L(θ* + αδ₁ + βδ₂).",
    s6_t:"Lire le résultat", s6_p:"Une chute raide, puis une lente glissade le long d'une vallée plate vers le minimum. C'est une coupe : la courbure des 335 autres dimensions reste cachée.",
    lab_t:"Le paysage", st_acc:"précision", st_evr:"variance du chemin sur 2 CP", st_par:"paramètres",
    c3d_t:"Surface 3D — glisser pour tourner", c2d_t:"Vue de dessus — niveaux", cl_t:"Perte pendant l'entraînement",
    lg_surf:"surface de perte", lg_path:"chemin de descente", lg_min:"minimum θ*", replay:"↻ rejouer",
    tip_loss:"perte", tip_step:"pas",
    pop_surface_t:"Surface de perte", pop_surface_b:"Hauteur = perte d'entraînement en θ* + αδ₁ + βδ₂. Violet = faible, jaune = élevée. Chaque point est un réseau complet dont les poids sont déplacés selon les deux directions de l'ACP.",
    pop_path_t:"Chemin de descente", pop_path_b:"Instantanés des poids projetés sur (δ₁, δ₂). Sa hauteur est la perte au point projeté : il repose exactement sur la surface. Le virage marque le passage de la pente raide au fond de la vallée.",
    pop_start_t:"Départ", pop_start_b:"Initialisation aléatoire de Xavier. Le gradient y est fort : les premiers pas parcourent le plus de distance.",
    pop_end_t:"Minimum θ*", pop_end_b:"Poids finaux, à l'origine (0,0) par construction. La surface y est plate : les gradients tendent vers zéro et l'entraînement ralentit.",
    pop_heat_t:"Lignes de niveau", pop_heat_b:"La même surface vue de dessus, découpée en bandes de perte. Dans les zones raides, le chemin coupe les bandes à angle droit : le gradient est perpendiculaire aux lignes de niveau. Survoler pour lire les valeurs.",
    pop_curve_t:"Courbe d'entraînement", pop_curve_b:"Perte par pas, échelle logarithmique. Chute rapide puis long plateau : la même forme que le chemin sur la surface. Survoler pour lire les valeurs.",
    pop_acc_t:"Précision", pop_acc_b:"Part des points d'entraînement bien classés (seuil p > 0,5).",
    pop_evr_t:"Variance expliquée", pop_evr_b:"Part du mouvement de la trajectoire captée par les deux directions de l'ACP. Élevée = la vue 2D est fidèle au chemin d'optimisation, malgré les 337 dimensions du réseau.",
    pop_params_t:"Paramètres", pop_params_b:"16·2 + 16 + 16·16 + 16 + 16 + 1 = 337 poids et biais, tous dans un seul vecteur NumPy."
  }
};
let lang = localStorage.lang || (navigator.language.startsWith('fr') ? 'fr' : 'en');
function setLang(l){
  lang = l; localStorage.lang = l; document.documentElement.lang = l;
  $$('[data-i18n]').forEach(e => { const v = T[l][e.dataset.i18n]; if (v) e.innerHTML = v; });
  $('#langBtn').textContent = l === 'en' ? 'FR' : 'EN';
}
$('#langBtn').onclick = () => setLang(lang === 'en' ? 'fr' : 'en');

/* ================= THEME & ACCENT ================= */
function setTheme(t){ document.documentElement.dataset.theme = t; localStorage.theme = t; redraw(); }
$('#themeBtn').onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
function setAccent(c){ document.documentElement.style.setProperty('--accent', c); localStorage.accent = c; redraw(); }
$$('.sw[data-c]').forEach(b => b.onclick = () => setAccent(b.dataset.c));
$('#accentPick').oninput = e => setAccent(e.target.value);

/* ================= LOADER ================= */
const segs = $('#segs');
for (let i = 0; i < 24; i++) segs.appendChild(document.createElement('span'));
let pct = 0;
(function load(){
  pct = Math.min(100, pct + Math.random() * 6 + 2);
  const on = Math.round(pct / 100 * 24);
  [...segs.children].forEach((s, i) => s.classList.toggle('on', i < on));
  $('#pct').textContent = String(Math.floor(pct)).padStart(2, '0');
  if (pct < 100) setTimeout(load, 55);
  else setTimeout(() => { $('#loader').classList.add('done'); document.body.classList.add('ready'); }, 350);
})();

/* ================= REVEAL ================= */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .15 });
$$('.reveal').forEach(el => io.observe(el));

/* ================= STARS ================= */
const sc = $('#stars'), sx = sc.getContext('2d');
let SW, SH, stars = [], mouse = { x: -999, y: -999 };
function sizeStars(){
  const d = devicePixelRatio || 1;
  SW = innerWidth; SH = innerHeight;
  sc.width = SW * d; sc.height = SH * d; sx.setTransform(d, 0, 0, d, 0, 0);
  stars = Array.from({ length: Math.round(SW * SH / 9000) }, () => ({
    x: Math.random() * SW, y: Math.random() * SH, r: Math.random() * 1.3 + .3,
    vx: (Math.random() - .5) * .15, vy: (Math.random() - .5) * .15, tw: Math.random() * 6
  }));
}
addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
function starLoop(t){
  sx.clearRect(0, 0, SW, SH);
  const fg = css('--fg'), ac = css('--accent');
  for (const s of stars){
    s.x += s.vx; s.y += s.vy;
    const dx = s.x - mouse.x, dy = s.y - mouse.y, d = Math.hypot(dx, dy);
    if (d < 130 && d > 0){ const f = (130 - d) / 130; s.x += dx / d * f * 2; s.y += dy / d * f * 2; }
    if (s.x < 0) s.x += SW; if (s.x > SW) s.x -= SW;
    if (s.y < 0) s.y += SH; if (s.y > SH) s.y -= SH;
    sx.globalAlpha = .35 + .35 * Math.sin(t / 900 + s.tw);
    sx.fillStyle = d < 130 ? ac : fg;
    sx.fillRect(s.x, s.y, s.r * 1.6, s.r * 1.6);   // square stars: discrete geometry
  }
  sx.globalAlpha = 1;
  requestAnimationFrame(starLoop);
}

/* ================= SHARED ================= */
function fit(c){
  const r = c.getBoundingClientRect(), d = devicePixelRatio || 1;
  c.width = r.width * d; c.height = r.height * d;
  const x = c.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0);
  return { x, w: r.width, h: r.height };
}
const STOPS = [[68,1,84],[59,82,139],[33,145,140],[94,201,98],[253,231,37]];
function cmap(t){
  t = Math.max(0, Math.min(1, t)) * (STOPS.length - 1);
  const i = Math.min(STOPS.length - 2, Math.floor(t)), f = t - i, a = STOPS[i], b = STOPS[i + 1];
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(',')})`;
}
const na = D.a.length, nb = D.b.length;
const flat = D.Z.flat(), lmin = Math.log(Math.min(...flat)), lmax = Math.log(Math.max(...flat));
const norm = L => (Math.log(L) - lmin) / (lmax - lmin);
const N = D.Z.map(r => r.map(norm));
const ai = a => (a - D.a[0]) / (D.a[na - 1] - D.a[0]) * (na - 1);
const bi = b => (b - D.b[0]) / (D.b[nb - 1] - D.b[0]) * (nb - 1);
const tip = $('#tip');
function showTip(e, html){ tip.innerHTML = html; tip.style.left = e.clientX + 14 + 'px'; tip.style.top = e.clientY + 14 + 'px'; tip.style.opacity = 1; }
const hideTip = () => tip.style.opacity = 0;
const f3 = v => v.toFixed(3);

/* ================= 3D SURFACE ================= */
const c3 = $('#c3d');
let yaw = -0.75, pitch = 0.95, prog = 0, drag = null;
function draw3D(){
  const { x, w, h } = fit(c3);
  const s = Math.min(w, h * 1.2) * 0.38, cx = w / 2, cy = h * 0.6;
  const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const P = (i, j, z) => {
    const X0 = i / (na - 1) * 2 - 1, Y0 = j / (nb - 1) * 2 - 1, Z0 = z * 0.85;
    const X = X0 * cyw - Y0 * syw, Y = X0 * syw + Y0 * cyw;
    return [cx + X * s, cy - (Z0 * cp + Y * sp) * s, Y * cp - Z0 * sp];
  };
  const quads = [];
  for (let j = 0; j < nb - 1; j++) for (let i = 0; i < na - 1; i++){
    const p = [P(i, j, N[j][i]), P(i + 1, j, N[j][i + 1]), P(i + 1, j + 1, N[j + 1][i + 1]), P(i, j + 1, N[j + 1][i])];
    quads.push({ p, d: (p[0][2] + p[1][2] + p[2][2] + p[3][2]) / 4, v: (N[j][i] + N[j][i + 1] + N[j + 1][i + 1] + N[j + 1][i]) / 4 });
  }
  quads.sort((a, b) => b.d - a.d);
  const dark = document.documentElement.dataset.theme === 'dark';
  x.lineWidth = .4; x.strokeStyle = dark ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.15)';
  for (const q of quads){
    x.beginPath(); x.moveTo(q.p[0][0], q.p[0][1]);
    for (let k = 1; k < 4; k++) x.lineTo(q.p[k][0], q.p[k][1]);
    x.closePath(); x.fillStyle = cmap(q.v); x.fill(); x.stroke();
  }
  // path
  const pts = D.path.map(([a, b, l]) => P(ai(a), bi(b), norm(l) + 0.015));
  const n = Math.max(2, Math.floor(prog * pts.length));
  x.strokeStyle = css('--accent'); x.lineWidth = 3.5; x.lineJoin = 'round';
  x.shadowColor = css('--accent'); x.shadowBlur = 12;
  x.beginPath(); pts.slice(0, n).forEach((p, k) => k ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.stroke();
  x.shadowBlur = 0;
  const st = pts[0]; x.fillStyle = '#fff'; x.beginPath(); x.arc(st[0], st[1], 6, 0, 7); x.fill();
  const hd = pts[n - 1]; x.fillStyle = css('--accent'); x.fillRect(hd[0] - 5, hd[1] - 5, 10, 10);
  if (prog >= 1){ const e = pts[pts.length - 1]; star(x, e[0], e[1], 11); }
  // axes labels
  x.fillStyle = css('--fg'); x.font = '600 13px Inconsolata';
  const la = P(na - 1, -2, 0), lb = P(-2, nb - 1, 0);
  x.fillText('PC1 · α', la[0], la[1]); x.fillText('PC2 · β', lb[0] - 30, lb[1]);
}
function star(x, cx, cy, r){
  x.fillStyle = 'gold'; x.beginPath();
  for (let k = 0; k < 10; k++){ const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * .45 : r; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
  x.closePath(); x.fill();
}
c3.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY }; c3.setPointerCapture(e.pointerId); });
c3.addEventListener('pointermove', e => {
  if (!drag) return;
  yaw += (e.clientX - drag.x) * 0.008;
  pitch = Math.max(0.15, Math.min(1.5, pitch + (e.clientY - drag.y) * 0.006));
  drag = { x: e.clientX, y: e.clientY }; draw3D();
});
c3.addEventListener('pointerup', () => drag = null);
$('#replay').onclick = () => { prog = 0; curveProg = 0; };

/* ================= 2D CONTOUR ================= */
const c2 = $('#c2d'); let g2 = null;
function draw2D(){
  const { x, w, h } = fit(c2); g2 = { w, h };
  const cw = w / na, ch = h / nb, LEVELS = 14;
  for (let j = 0; j < nb; j++) for (let i = 0; i < na; i++){
    x.fillStyle = cmap(Math.floor(N[j][i] * LEVELS) / LEVELS);   // discrete bands
    x.fillRect(i * cw, h - (j + 1) * ch, cw + 1, ch + 1);
  }
  const map = ([a, b]) => [(ai(a) + .5) * cw, h - (bi(b) + .5) * ch];
  const pts = D.path.map(map), n = Math.max(2, Math.floor(prog * pts.length));
  x.strokeStyle = css('--accent'); x.lineWidth = 3;
  x.beginPath(); pts.slice(0, n).forEach((p, k) => k ? x.lineTo(...p) : x.moveTo(...p)); x.stroke();
  const s = pts[0], e = pts[pts.length - 1];
  Object.assign($('#hotStart').style, { left: s[0] + 'px', top: s[1] + 'px' });
  Object.assign($('#hotEnd').style, { left: e[0] + 'px', top: e[1] + 'px', opacity: prog >= 1 ? 1 : 0 });
}
c2.addEventListener('mousemove', e => {
  const r = c2.getBoundingClientRect();
  const i = Math.floor((e.clientX - r.left) / r.width * na), j = Math.floor((1 - (e.clientY - r.top) / r.height) * nb);
  if (i < 0 || j < 0 || i >= na || j >= nb) return hideTip();
  showTip(e, `α ${f3(D.a[i])} · β ${f3(D.b[j])}<br>${T[lang].tip_loss} ${f3(D.Z[j][i])}`);
});
c2.addEventListener('mouseleave', hideTip);

/* ================= LOSS CURVE ================= */
const cl = $('#cl'); let curveProg = 0, gl = null;
function drawCurve(){
  const { x, w, h } = fit(cl);
  const pad = 30, H = D.hist, lo = Math.log(Math.min(...H)), hi = Math.log(Math.max(...H));
  const X = i => pad + i / (H.length - 1) * (w - pad * 1.5), Y = v => pad / 2 + (1 - (Math.log(v) - lo) / (hi - lo)) * (h - pad * 1.5);
  gl = { X, Y, pad, w };
  x.strokeStyle = css('--line'); x.lineWidth = 1;
  for (let k = 0; k <= 4; k++){ const yy = pad / 2 + k / 4 * (h - pad * 1.5); x.beginPath(); x.moveTo(pad, yy); x.lineTo(w - pad / 2, yy); x.stroke(); }
  x.strokeStyle = css('--fg'); x.lineWidth = 2;
  x.beginPath(); x.moveTo(pad, pad / 2); x.lineTo(pad, h - pad); x.lineTo(w - pad / 2, h - pad); x.stroke();
  const n = Math.max(2, Math.floor(curveProg * H.length));
  x.strokeStyle = css('--accent'); x.lineWidth = 3;
  x.beginPath(); for (let i = 0; i < n; i++) i ? x.lineTo(X(i), Y(H[i])) : x.moveTo(X(i), Y(H[i])); x.stroke();
  x.fillStyle = css('--mute'); x.font = '12px Inconsolata';
  x.fillText('log L', 4, 12); x.fillText(T[lang].tip_step, w - 40, h - 8);
}
cl.addEventListener('mousemove', e => {
  if (!gl) return;
  const r = cl.getBoundingClientRect(), H = D.hist;
  const i = Math.round((e.clientX - r.left - gl.pad) / (gl.w - gl.pad * 1.5) * (H.length - 1));
  if (i < 0 || i >= H.length) return hideTip();
  showTip(e, `${T[lang].tip_step} ${i * 5}<br>${T[lang].tip_loss} ${f3(H[i])}`);
});
cl.addEventListener('mouseleave', hideTip);

/* ================= MODAL ================= */
function openPop(k){
  $('#mT').textContent = T[lang][`pop_${k}_t`];
  $('#mB').textContent = T[lang][`pop_${k}_b`];
  $('#modal').classList.add('open');
}
document.addEventListener('click', e => { const b = e.target.closest('[data-pop]'); if (b) openPop(b.dataset.pop); });
$('#mClose').onclick = () => $('#modal').classList.remove('open');
$('#modal').onclick = e => { if (e.target.id === 'modal') $('#modal').classList.remove('open'); };
addEventListener('keydown', e => e.key === 'Escape' && $('#modal').classList.remove('open'));

/* ================= LOOP ================= */
let labVisible = false;
new IntersectionObserver(es => labVisible = es[0].isIntersecting, { threshold: .1 }).observe($('#lab'));
function redraw(){ if (!D) return; draw3D(); draw2D(); drawCurve(); }
function loop(){
  if (labVisible && (prog < 1 || curveProg < 1)){
    prog = Math.min(1, prog + 0.004); curveProg = Math.min(1, curveProg + 0.005);
    redraw();
  }
  requestAnimationFrame(loop);
}

/* ================= INIT ================= */
document.documentElement.dataset.theme = localStorage.theme || 'dark';
if (localStorage.accent){ document.documentElement.style.setProperty('--accent', localStorage.accent); $('#accentPick').value = localStorage.accent; }
setLang(lang);
$('#stAcc').textContent = Math.round(D.acc * 100) + '%';
$('#stEvr').textContent = Math.round((D.evr[0] + D.evr[1]) * 100) + '%';
$('#stPar').textContent = D.n_params;
sizeStars(); requestAnimationFrame(starLoop);
addEventListener('resize', () => { sizeStars(); redraw(); });
document.fonts.ready.then(() => { redraw(); loop(); });
