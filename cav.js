/* ============================================================
   Caverna de Alexandria — cena 3D (Three.js)
   Monograma CA no centro, e-books orbitando e partículas douradas
   que se reúnem em volta da marca conforme a página rola
   (a comunidade se formando). Arraste para girar.
   ============================================================ */
import * as THREE from "three";

const stage = document.getElementById("cv-stage");
const canvas = document.getElementById("cv-gl");
if (stage && canvas) boot();

function boot() {
  const root = document.documentElement;
  const still = () => !!root.dataset.still || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = () => stage.clientWidth < 760;

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" }); }
  catch (e) { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0.6, 11);

  const world = new THREE.Group(); scene.add(world);   // posição na tela (direita no desktop, topo no celular)
  const spin = new THREE.Group(); world.add(spin);      // giro (arrastar + automático)
  spin.rotation.x = 0.18;

  const GOLD = new THREE.Color("#e5c77a");
  const loader = new THREE.TextureLoader();
  const tex = src => { const t = loader.load(src, () => draw()); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };

  /* ---------- brilho (textura radial gerada) ---------- */
  function glowTex(stops) {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d"), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    stops.forEach(([o, col]) => r.addColorStop(o, col));
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  const dotTex = glowTex([[0, "rgba(255,240,200,1)"], [.25, "rgba(240,205,120,.9)"], [1, "rgba(200,160,70,0)"]]);
  const haloTex = glowTex([[0, "rgba(255,215,130,.55)"], [.4, "rgba(210,160,60,.18)"], [1, "rgba(0,0,0,0)"]]);

  /* ---------- monograma CA ---------- */
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  halo.scale.set(6.5, 6.5, 1); world.add(halo);
  const mono = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 2.03),
    new THREE.MeshBasicMaterial({ map: tex("assets/cav-mono.webp"), transparent: true, depthWrite: false, side: THREE.DoubleSide }));
  world.add(mono);

  /* ---------- órbitas finas ---------- */
  const ringGeo = r => { const p = []; for (let i = 0; i <= 160; i++) { const a = i / 160 * Math.PI * 2; p.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r)); } return new THREE.BufferGeometry().setFromPoints(p); };
  const ringMat = o => new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: o, depthWrite: false });
  const ring1 = new THREE.Line(ringGeo(2.7), ringMat(.32)); spin.add(ring1);
  const ring2 = new THREE.Line(ringGeo(4.3), ringMat(.14)); ring2.rotation.z = 0.12; spin.add(ring2);

  /* ---------- e-books orbitando ---------- */
  const BOOKS = [
    { src: "assets/cr-escape.webp", w: 518, h: 751 },
    { src: "assets/cr-anti-mock.webp", w: 500, h: 805 }
  ];
  const books = BOOKS.map((b, i) => {
    const H = 2.15, W = H * b.w / b.h;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(W, H),
      new THREE.MeshBasicMaterial({ map: tex(b.src), transparent: true, side: THREE.DoubleSide, alphaTest: .02 }));
    m.userData.a0 = i / BOOKS.length * Math.PI * 2;
    world.add(m); return m;
  });

  /* ---------- partículas: comunidade ---------- */
  const N = small() ? 520 : 1000;
  const scatter = new Float32Array(N * 3), seed = new Float32Array(N * 4), pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    // espalhadas pelo espaço
    const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, R = 9 + Math.random() * 9;
    scatter[i * 3] = Math.sqrt(1 - u * u) * Math.cos(th) * R;
    scatter[i * 3 + 1] = u * R * .7;
    scatter[i * 3 + 2] = Math.sqrt(1 - u * u) * Math.sin(th) * R - 4;
    // destino: anel em volta da marca (raio, ângulo, altura, atraso)
    const shell = Math.random() < .28;
    seed[i * 4] = shell ? 4.6 + Math.random() * 1.6 : 3.1 + Math.pow(Math.random(), 1.6) * 1.5;
    seed[i * 4 + 1] = Math.random() * Math.PI * 2;
    seed[i * 4 + 2] = shell ? (Math.random() - .5) * 3.2 : (Math.random() - .5) * .55;
    seed[i * 4 + 3] = Math.random();
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const pMat = new THREE.PointsMaterial({ map: dotTex, size: .13, sizeAttenuation: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: GOLD });
  spin.add(new THREE.Points(pGeo, pMat));

  // fios ligando algumas pessoas ao centro
  const L = 26, lPos = new Float32Array(L * 6), lIdx = Array.from({ length: L }, () => (Math.random() * N) | 0);
  const lGeo = new THREE.BufferGeometry(); lGeo.setAttribute("position", new THREE.BufferAttribute(lPos, 3));
  const lMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  spin.add(new THREE.LineSegments(lGeo, lMat));

  /* ---------- estado ---------- */
  let p = 0, pT = 0, t = 0, last = performance.now();
  let rotY = 0, vel = 0.0016, dragging = false, lastX = 0, mx = 0, my = 0, tmx = 0, tmy = 0;
  const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

  function readScroll() {
    const r = stage.getBoundingClientRect(), vh = innerHeight;
    pT = Math.min(1, Math.max(0, (vh - r.top) / (vh * .95)));
  }

  function layout() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    if (small()) { world.position.set(0, 1.6, 0); world.scale.setScalar(.66); }
    else { world.position.set(w / h > 1.6 ? 2.25 : 1.7, .15, 0); world.scale.setScalar(1); }
  }

  function update(dt) {
    t += dt;
    p += (pT - p) * Math.min(1, dt * 3);
    if (!dragging) { rotY += vel; vel += (0.0016 - vel) * .02; }
    mx += (tmx - mx) * .06; my += (tmy - my) * .06;
    spin.rotation.y = rotY;
    world.rotation.x = my * .18; world.rotation.y = mx * .25;

    // monograma flutuando
    mono.position.y = Math.sin(t * .9) * .12;
    mono.rotation.y = Math.sin(t * .5) * .35 + mx * .3;
    halo.material.opacity = .75 + Math.sin(t * 1.3) * .15;

    // e-books em órbita, sempre virados para a câmera
    books.forEach((b, i) => {
      const a = b.userData.a0 + rotY * 1.0 + t * .12;
      const R = small() ? 2.15 : 2.7;
      const v = new THREE.Vector3(Math.cos(a) * R, Math.sin(t * .8 + i * 2) * .18 - .1, Math.sin(a) * R);
      v.applyEuler(spin.rotation);
      b.position.copy(v);
      b.quaternion.copy(camera.quaternion);
      b.rotateZ(Math.sin(t * .7 + i) * .06);
      const front = (v.z + R) / (2 * R);            // 0 atrás, 1 na frente
      b.material.color.setScalar(.38 + front * .62);
      b.renderOrder = front > .5 ? 2 : 0;
      b.scale.setScalar(.82 + front * .25);
    });

    // partículas: do espaço para o anel
    for (let i = 0; i < N; i++) {
      const d = seed[i * 4 + 3];
      const k = ease(Math.min(1, Math.max(0, p * 1.5 - d * .5)));
      const a = seed[i * 4 + 1] + t * (.05 + d * .05);
      const R = seed[i * 4];
      const tx = Math.cos(a) * R, ty = seed[i * 4 + 2] + Math.sin(t + d * 9) * .06, tz = Math.sin(a) * R;
      pos[i * 3] = scatter[i * 3] + (tx - scatter[i * 3]) * k;
      pos[i * 3 + 1] = scatter[i * 3 + 1] + (ty - scatter[i * 3 + 1]) * k;
      pos[i * 3 + 2] = scatter[i * 3 + 2] + (tz - scatter[i * 3 + 2]) * k;
    }
    pGeo.attributes.position.needsUpdate = true;
    pMat.opacity = .35 + p * .65;

    lIdx.forEach((ix, j) => {
      lPos[j * 6] = pos[ix * 3]; lPos[j * 6 + 1] = pos[ix * 3 + 1]; lPos[j * 6 + 2] = pos[ix * 3 + 2];
      lPos[j * 6 + 3] = lPos[j * 6 + 4] = lPos[j * 6 + 5] = 0;
    });
    lGeo.attributes.position.needsUpdate = true;
    lMat.opacity = Math.max(0, p - .55) * .22;
    ring1.material.opacity = .1 + p * .25;
  }

  function draw() { renderer.render(scene, camera); }

  let visible = false, raf = 0;
  function loop(now) {
    raf = 0;
    if (!visible || document.hidden || still()) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    readScroll(); update(dt); draw();
    raf = requestAnimationFrame(loop);
  }
  function kick() {
    if (still()) { readScroll(); pT = p = 1; update(0); draw(); return; }
    if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
  }

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); }, { rootMargin: "120px" }).observe(stage);
  document.addEventListener("visibilitychange", kick);
  new MutationObserver(kick).observe(root, { attributes: true, attributeFilter: ["data-still"] });
  new ResizeObserver(() => { layout(); if (still() || !raf) { update(0); draw(); } }).observe(stage);

  /* ---------- interação ---------- */
  canvas.addEventListener("pointerdown", e => { dragging = true; lastX = e.clientX; vel = 0; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener("pointermove", e => {
    const r = stage.getBoundingClientRect();
    tmx = (e.clientX - r.left) / r.width * 2 - 1; tmy = (e.clientY - r.top) / r.height * 2 - 1;
    if (!dragging) return;
    const dx = e.clientX - lastX; lastX = e.clientX;
    rotY += dx * .006; vel = dx * .006;
    if (still()) { update(0); draw(); }
  });
  const up = () => { dragging = false; };
  canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up);
  canvas.addEventListener("pointerleave", () => { tmx = tmy = 0; });

  layout(); readScroll(); update(0); draw();
}

/* ---------- cartões do fluxo: inclinação 3D seguindo o mouse ---------- */
document.querySelectorAll(".cv-step").forEach(el => {
  el.addEventListener("pointermove", e => {
    if (document.documentElement.dataset.still || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    el.style.transform = `rotateX(${(-y * 14).toFixed(2)}deg) rotateY(${(x * 16).toFixed(2)}deg)`;
  });
  el.addEventListener("pointerleave", () => { el.style.transform = ""; });
});
