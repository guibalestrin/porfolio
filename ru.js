/* ============================================================
   Russo: matrioscas 3D (Three.js). Cada boneca que sai de dentro
   da outra é uma camada do idioma: alfabeto, sons, palavras e a
   primeira frase. Elas balançam como joão-bobo quando o mouse
   passa, e a neve cai sobre as cúpulas de Moscou ao fundo.
   ============================================================ */
import * as THREE from "three";

const stage = document.getElementById("ru-stage");
const canvas = document.getElementById("ru-gl");
if (stage && canvas) boot();

function boot() {
  const root = document.documentElement;
  const still = () => !!root.dataset.still || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const btn = document.getElementById("ru-btn"), nEl = document.getElementById("ru-n");
  const words = [...stage.querySelectorAll(".ru-w")];

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); }
  catch (e) { renderer = null; }
  if (renderer) {
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
  }

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(30, 1, .1, 100);
  scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x2a1a10, 1.1));
  const key = new THREE.DirectionalLight(0xfff0dc, 2.2); key.position.set(-2.5, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0x8fb0ff, 1.4); rim.position.set(3, 2, -3); scene.add(rim);

  const world = new THREE.Group(); scene.add(world);

  /* ---------- perfil da matriosca (torno) ---------- */
  const H = 1.55, WAIST = .5 * H;
  const ctrl = [[.385, .01], [.42, .08], [.44, .2], [.43, .33], [.39, .44], [.345, .52], [.33, .6], [.335, .7], [.3, .8], [.24, .88], [.16, .94], [.07, .985], [0, 1]]
    .map(([r, y]) => new THREE.Vector2(r, y * H));
  const prof = [new THREE.Vector2(0, 0), new THREE.Vector2(.36, 0), ...new THREE.SplineCurve(ctrl).getPoints(90)];
  const lo = [], hi = [];
  for (let i = 0; i < prof.length; i++) {
    const p = prof[i];
    if (p.y <= WAIST) lo.push(p);
    else {
      if (!hi.length) { const a = prof[i - 1], k = (WAIST - a.y) / (p.y - a.y), m = new THREE.Vector2(a.x + (p.x - a.x) * k, WAIST); lo.push(m); hi.push(m.clone()); }
      hi.push(p);
    }
  }
  hi[hi.length - 1].x = 0;
  const lathe = (pts, dy) => {
    const g = new THREE.LatheGeometry(pts, 56, Math.PI);
    const pos = g.attributes.position, uv = g.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setY(i, pos.getY(i) / H);
    g.translate(0, -dy, 0); g.computeVertexNormals(); return g;
  };
  const gLo = lathe(lo, 0), gHi = lathe(hi, WAIST);

  /* ---------- pintura em canvas (frente da boneca em x = 512) ---------- */
  const R = (y) => (1 - y) * 1024;
  function paint(body, scarf, apron, accent) {
    const c = document.createElement("canvas"); c.width = c.height = 1024;
    const x = c.getContext("2d");
    x.fillStyle = body; x.fillRect(0, 0, 1024, 1024);
    // lenço na cabeça, com bolinhas
    x.fillStyle = scarf; x.fillRect(0, 0, 1024, R(.555));
    x.fillStyle = "rgba(255,255,255,.85)";
    for (let i = 0; i < 70; i++) { const px = (i * 157) % 1024, py = 30 + ((i * 89) % (R(.56) - 40)); if (Math.abs(px - 512) > 100 || py < 160 || py > 380) { x.beginPath(); x.arc(px, py, 5, 0, 7); x.fill(); } }
    // rosto
    x.fillStyle = "#fbe3cf"; x.beginPath(); x.ellipse(512, R(.735), 76, 78, 0, 0, 7); x.fill();
    x.fillStyle = "#5a3418"; x.beginPath(); x.ellipse(512, R(.735) - 46, 80, 40, 0, Math.PI, 0); x.fill();
    x.beginPath(); x.ellipse(478, R(.735) - 44, 40, 22, .5, 0, 7); x.ellipse(546, R(.735) - 44, 40, 22, -.5, 0, 7); x.fill();
    x.fillStyle = "#2a1a12";
    [-24, 24].forEach(d => { x.beginPath(); x.ellipse(512 + d, R(.735) + 2, 6, 8, 0, 0, 7); x.fill(); });
    x.strokeStyle = "#2a1a12"; x.lineWidth = 2.5;
    [-24, 24].forEach(d => { x.beginPath(); x.arc(512 + d, R(.735) - 10, 12, Math.PI * 1.2, Math.PI * 1.8); x.stroke(); });
    x.fillStyle = "rgba(230,80,90,.45)";
    [-40, 40].forEach(d => { x.beginPath(); x.arc(512 + d, R(.735) + 26, 13, 0, 7); x.fill(); });
    x.fillStyle = "#c8102e"; x.beginPath(); x.ellipse(512, R(.735) + 40, 10, 5.5, 0, 0, 7); x.fill();
    // nó do lenço
    x.fillStyle = scarf; x.beginPath(); x.moveTo(512, R(.56) - 8); x.lineTo(470, R(.535)); x.lineTo(490, R(.505)); x.closePath(); x.moveTo(512, R(.56) - 8); x.lineTo(554, R(.535)); x.lineTo(534, R(.505)); x.closePath(); x.fill();
    // avental com flor
    x.fillStyle = apron; x.beginPath(); x.ellipse(512, R(.27), 150, 205, 0, 0, 7); x.fill();
    x.strokeStyle = accent; x.lineWidth = 6; x.stroke();
    const flower = (fx, fy, r, petal) => {
      x.fillStyle = "#2f7d3a";
      [[-1, .9], [1, .9]].forEach(([s]) => { x.beginPath(); x.ellipse(fx + s * r * 1.5, fy + r * 1.3, r * .9, r * .38, s * .6, 0, 7); x.fill(); });
      x.fillStyle = petal;
      for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; x.beginPath(); x.ellipse(fx + Math.cos(a) * r * .75, fy + Math.sin(a) * r * .75, r * .6, r * .42, a, 0, 7); x.fill(); }
      x.fillStyle = "#f2c14e"; x.beginPath(); x.arc(fx, fy, r * .38, 0, 7); x.fill();
    };
    flower(512, R(.3), 52, accent);
    flower(452, R(.13), 24, accent); flower(572, R(.13), 24, accent); flower(512, R(.45), 20, accent);
    // faixas douradas e motivos nas costas
    x.fillStyle = "#e7b53c"; x.fillRect(0, R(.5) - 5, 1024, 10); x.fillRect(0, R(.03), 1024, 14); x.fillRect(0, R(.565) - 4, 1024, 7);
    for (let i = 0; i < 18; i++) { const px = (i * 61 + 700) % 1024; if (Math.abs(px - 512) < 190) continue; flower(px, R(.12 + (i % 3) * .13), 13, i % 2 ? "#f2c14e" : "#fff"); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  }

  const inner = new THREE.MeshStandardMaterial({ color: 0xd9b07a, roughness: .8, side: THREE.BackSide });
  const looks = [
    ["#c8102e", "#e7b53c", "#fff3df", "#c8102e"],
    ["#1d4fa0", "#c8102e", "#fff3df", "#1d4fa0"],
    ["#2f7d3a", "#e7b53c", "#fff3df", "#c8102e"],
    ["#e7a52c", "#c8102e", "#fff3df", "#1d4fa0"],
  ];
  const SC = [1, .78, .6, .45];
  const dolls = SC.map((s, i) => {
    const mat = new THREE.MeshPhysicalMaterial({ map: paint(...looks[i]), roughness: .32, clearcoat: 1, clearcoatRoughness: .12 });
    const pivot = new THREE.Group(), body = new THREE.Group(), top = new THREE.Group();
    pivot.scale.setScalar(s); pivot.add(body);
    body.add(new THREE.Mesh(gLo, mat), new THREE.Mesh(gLo, inner));
    top.position.y = WAIST; body.add(top);
    top.add(new THREE.Mesh(gHi, mat), new THREE.Mesh(gHi, inner));
    world.add(pivot);
    return { s, pivot, body, top, x: 0, y: 0, a: 0, v: 0, b: 0, bv: 0, vis: i === 0, scl: 1 };
  });

  /* ---------- neve ---------- */
  const N = 220, sp = new Float32Array(N * 3), sd = new Float32Array(N);
  for (let i = 0; i < N; i++) { sp.set([(Math.random() - .5) * 6, Math.random() * 4 - 1, (Math.random() - .5) * 3 - .5], i * 3); sd[i] = Math.random(); }
  const sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  const fc = document.createElement("canvas"); fc.width = fc.height = 64;
  const fx = fc.getContext("2d"), fg = fx.createRadialGradient(32, 32, 0, 32, 32, 32);
  fg.addColorStop(0, "rgba(255,255,255,1)"); fg.addColorStop(.4, "rgba(255,255,255,.5)"); fg.addColorStop(1, "rgba(255,255,255,0)");
  fx.fillStyle = fg; fx.fillRect(0, 0, 64, 64);
  const snow = new THREE.Points(sg, new THREE.PointsMaterial({ map: new THREE.CanvasTexture(fc), size: .055, transparent: true, depthWrite: false, opacity: .85 }));
  scene.add(snow);

  /* ---------- estado: quantas bonecas já saíram ---------- */
  let k = 1, anim = null;
  const GAP = .14;
  const layout = (n) => {
    const w = SC.slice(0, n).map(s => .88 * s), tot = w.reduce((a, b) => a + b, 0) + GAP * (n - 1);
    let x = -tot / 2; return w.map(wi => { const c = x + wi / 2; x += wi + GAP; return c; });
  };
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const seg = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));

  function label() {
    nEl.textContent = k;
    words.forEach((w, i) => w.classList.toggle("on", i === k - 1));
    stage.classList.toggle("full", k === SC.length);
    barH = null;
  }
  function step() {
    if (anim) return;
    if (k < SC.length) {
      anim = { type: "open", t: 0, dur: still() ? .01 : 1.7, from: layout(k), to: layout(k + 1), n: k };
      dolls[k].vis = true; dolls[k].x = dolls[k - 1].x; dolls[k].y = 0; dolls[k].scl = 1;
      k++;
    } else {
      anim = { type: "close", t: 0, dur: still() ? .01 : 1.1, from: dolls.map(d => d.x) };
      k = 1;
    }
    label();
  }
  btn.addEventListener("click", step);
  canvas.addEventListener("click", step);

  // o mouse empurra as bonecas (joão-bobo)
  let lastX = null, half = 2, vh = 1.6, barH = null, baseY = null;
  const barEl = stage.querySelector(".ru-bar");
  stage.addEventListener("pointermove", e => {
    const r = stage.getBoundingClientRect(), nx = ((e.clientX - r.left) / r.width - .5) * 2 * half;
    if (lastX !== null && !still()) {
      const dv = nx - lastX;
      dolls.forEach(d => { if (d.vis && Math.abs(nx - d.x) < .55 * d.s) d.v -= dv * 9 / d.s; });
    }
    lastX = nx;
  });
  stage.addEventListener("pointerleave", () => { lastX = null; });

  let visible = false, auto = false;
  new IntersectionObserver(es => es.forEach(e => {
    visible = e.isIntersecting;
    if (visible && e.intersectionRatio > .55 && !auto && !still()) {
      auto = true;
      const tick = () => { if (k < SC.length && visible) { step(); setTimeout(tick, 2300); } };
      setTimeout(tick, 900);
    }
  }), { threshold: [0, .55] }).observe(stage);

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    const pr = renderer.getPixelRatio();
    if (canvas.width === Math.round(w * pr) && canvas.height === Math.round(h * pr)) return;
    renderer.setSize(w, h, false); cam.aspect = w / h;
    const v = Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2), fitW = 3.2, fitH = 3.2;
    const z = Math.max(fitH / 2 / v, fitW / 2 / (v * cam.aspect));
    cam.position.set(0, .35, z); cam.lookAt(0, .35, 0); cam.updateProjectionMatrix();
    half = v * cam.aspect * z;
    vh = v * z; barH = null;
  }

  if (!renderer) { label(); return; }
  let last = performance.now();
  (function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (!visible || document.hidden) return;
    const s = still(), t = now / 1000;
    resize();
    // base das bonecas sempre logo acima da barra de baixo
    if (barH === null) barH = barEl.offsetHeight;
    const by = .35 - vh + 2 * vh * Math.min(.36, (barH + 22) / canvas.clientHeight);
    baseY = baseY === null || s ? by : baseY + (by - baseY) * Math.min(1, dt * 4);
    world.position.y = baseY;

    if (anim) {
      anim.t += dt; const p = Math.min(1, anim.t / anim.dur), e = ease(p);
      if (anim.type === "open") {
        const par = dolls[anim.n - 1], ch = dolls[anim.n];
        for (let i = 0; i < anim.n; i++) dolls[i].x = anim.from[i] + (anim.to[i] - anim.from[i]) * e;
        // a parte de cima sobe e tomba para trás, a de dentro sai em arco e a tampa volta
        const lift = ease(seg(p, 0, .28)) - ease(seg(p, .7, .95));
        par.top.position.y = WAIST + lift * 1.15; par.top.position.x = -lift * .28; par.top.rotation.z = lift * .5;
        const q = seg(p, .22, .8), eq = ease(q);
        ch.x = par.x + (anim.to[anim.n] - par.x) * eq;
        ch.y = Math.sin(Math.PI * q) * 1.05 * par.s;
        if (p >= 1) { ch.v += 2.2; par.v -= 1; }
      } else {
        dolls.forEach((d, i) => {
          if (!i) { d.x = anim.from[0] * (1 - e); return; }
          d.x = anim.from[i] + (dolls[0].x - anim.from[i]) * e; d.scl = 1 - e; d.y = Math.sin(Math.PI * e) * .3;
        });
        if (p >= 1) { dolls.forEach((d, i) => { if (i) { d.vis = false; d.scl = 1; d.y = 0; } }); dolls[0].v += 2; }
      }
      if (p >= 1) anim = null;
    }

    dolls.forEach((d, i) => {
      // mola amortecida: balança e volta a ficar em pé
      d.v += (-60 * d.a - 3.2 * d.v) * dt; d.a += d.v * dt;
      d.a = Math.max(-.6, Math.min(.6, d.a));
      d.pivot.visible = d.vis;
      d.pivot.position.set(d.x, d.y, 0);
      d.pivot.scale.setScalar(d.s * Math.max(.001, d.scl));
      d.pivot.rotation.z = s ? 0 : d.a;
      d.pivot.rotation.y = s ? -.15 : Math.sin(t * .7 + i * 1.3) * .32 - .1;
    });

    if (!s) {
      const pa = sg.attributes.position.array;
      for (let i = 0; i < N; i++) {
        let y = pa[i * 3 + 1] - dt * (.18 + sd[i] * .25);
        if (y < -1.2) y += 4.2;
        pa[i * 3 + 1] = y; pa[i * 3] += Math.sin(t * .8 + sd[i] * 30) * dt * .08;
      }
      sg.attributes.position.needsUpdate = true;
    }
    renderer.render(scene, cam);
  })(last);
  label();
}
