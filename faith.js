/* ============================================================
   Fé (Three.js): a cruz vazia de madeira bruta, com o linho
   dobrado sobre a trave, a coroa de espinhos e os três cravos
   que ficaram. Ao acender, nasce a luz do amanhecer por trás,
   o linho se ilumina, brota luz dos espinhos e aparece o
   versículo. Só símbolos, nenhuma imagem.
   ============================================================ */
const wrap = document.querySelector(".fa-wrap");
const stage = document.getElementById("fa-stage");
if (wrap && stage) boot();

function boot() {
  const root = document.documentElement;
  const still = () => !!root.dataset.still || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const glCanvas = wrap.querySelector(".fa-gl");
  const rays = godRays(stage.querySelector(".fa-rays"));

  const tint = mkEl("div", "glory-tint"), cone = mkEl("div", "glory-rays"), fx = mkEl("canvas", "glory-fx");
  document.body.append(tint, cone, fx);
  const fctx = fx.getContext("2d");

  let cross = null, visible = false, busy = false, auto = false, litTimer = 0, mx = 0, my = 0;

  new IntersectionObserver(es => es.forEach(e => {
    visible = e.isIntersecting;
    if (visible && !cross) { cross = {}; makeCross(glCanvas).then(c => cross = c).catch(err => { cross = null; console.warn("Cruz 3D indisponível", err); }); }
    if (visible && e.intersectionRatio > .6 && !auto && !still()) { auto = true; setTimeout(() => visible && light(), 700); }
  }), { rootMargin: "500px 0px", threshold: [0, .6] }).observe(stage);

  wrap.addEventListener("pointermove", e => { const r = wrap.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5; });
  wrap.addEventListener("pointerleave", () => { mx = my = 0; });
  stage.addEventListener("click", light);

  let last = performance.now();
  (function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (!visible || document.hidden) return;
    const s = still();
    rays && rays.draw(now / 1000, dt, s);
    cross && cross.draw && cross.draw(now / 1000, dt, mx, my, s);
  })(last);

  function light() {
    if (busy) return; busy = true;
    const s = still();
    stage.classList.add("lit");
    rays && rays.lit(1);
    cross && cross.glory && cross.glory(s);
    if (!s) glory();
    clearTimeout(litTimer);
    litTimer = setTimeout(() => { stage.classList.remove("lit"); rays && rays.lit(0); cross && cross.unlit && cross.unlit(); }, 7500);
    setTimeout(() => { busy = false; }, s ? 600 : 2600);
  }

  function glory() {
    const r = glCanvas.getBoundingClientRect();
    const gx = r.left + r.width * .5, gy = r.top + r.height * .5;
    [tint, cone].forEach(el => {
      el.style.setProperty("--gx", gx + "px"); el.style.setProperty("--gy", gy + "px");
      el.classList.remove("on"); void el.offsetWidth; el.classList.add("on");
    });
    // faíscas douradas subindo e se espalhando
    const dpr = Math.min(devicePixelRatio || 1, 2), W = innerWidth, H = innerHeight;
    fx.width = W * dpr; fx.height = H * dpr;
    const P = Array.from({ length: 140 }, () => {
      const a = Math.random() * Math.PI * 2, v = 60 + Math.random() * 420;
      return { x: gx, y: gy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, r: .8 + Math.random() * 2.4, life: 1.2 + Math.random() * 1.6, t: 0, tw: Math.random() * 6 };
    });
    let prev = performance.now();
    (function step(now) {
      const dt = Math.min(.05, (now - prev) / 1000); prev = now;
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0); fctx.clearRect(0, 0, W, H);
      let alive = 0;
      for (const p of P) {
        p.t += dt; if (p.t > p.life) continue; alive++;
        p.vx *= .965; p.vy = p.vy * .965 - 22 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        const k = 1 - p.t / p.life, tw = .6 + .4 * Math.sin(p.t * 14 + p.tw);
        const g = fctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, `rgba(255,246,214,${k * tw})`); g.addColorStop(.3, `rgba(255,196,86,${k * tw * .6})`); g.addColorStop(1, "rgba(255,170,60,0)");
        fctx.fillStyle = g; fctx.beginPath(); fctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2); fctx.fill();
      }
      if (alive) requestAnimationFrame(step); else fctx.clearRect(0, 0, W, H);
    })(prev);
  }
}

function mkEl(tag, cls) { const el = document.createElement(tag); el.className = cls; el.setAttribute("aria-hidden", "true"); return el; }

/* ---------- raios de luz (god rays) sobre a foto ---------- */
function godRays(canvas) {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: false, alpha: true });
  if (!gl) return null;
  const fs = `precision highp float;
uniform vec2 r;uniform float t,L;
float h(float x){return fract(sin(x*127.1)*43758.5453);}
float n(float x){float i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(h(i),h(i+1.),f);}
void main(){
  vec2 uv=gl_FragCoord.xy/r; vec2 src=vec2(.74,1.12);
  vec2 d=uv-src; d.x*=r.x/r.y;
  float ang=atan(d.x,-d.y), dist=length(d);
  float k=n(ang*9.+t*.25)*.6+n(ang*23.-t*.4)*.4;
  float ray=pow(k,3.)*smoothstep(1.5,.05,dist);
  float core=exp(-dist*dist*(7.-3.*L))*(.25+.75*L);
  float a=ray*(.35+.9*L)+core*.8;
  vec3 col=mix(vec3(1.,.66,.28),vec3(1.,.94,.8),clamp(core,0.,1.));
  gl_FragColor=vec4(col*a,1.);
}`;
  const sh = (ty, src) => { const s = gl.createShader(ty); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}"));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
  gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const ur = gl.getUniformLocation(pr, "r"), ut = gl.getUniformLocation(pr, "t"), uL = gl.getUniformLocation(pr, "L");
  let L = 0, Lto = 0;
  return {
    lit(v) { Lto = v; },
    draw(t, dt, still) {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      L += (Lto - L) * Math.min(1, dt * (Lto > L ? 2.4 : 1.2));
      gl.uniform2f(ur, w, h); gl.uniform1f(ut, still ? 3 : t); gl.uniform1f(uL, still ? Lto : L);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  };
}

/* ---------- cruz vazia 3D: madeira, linho, coroa de espinhos e cravos ---------- */
async function makeCross(canvas) {
  const THREE = await import("three");
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
  scene.environmentIntensity = .45;
  const cam = new THREE.PerspectiveCamera(26, 1, .1, 100);

  scene.add(new THREE.AmbientLight(0xffe2b0, .3));
  const key = new THREE.DirectionalLight(0xfff1d6, 2.2); key.position.set(-3, 5, 7); scene.add(key);
  const warm = new THREE.PointLight(0xffa640, 18, 20); warm.position.set(2.5, 1, 3); scene.add(warm);
  // a luz do amanhecer atrás da cruz: cresce ao "acender"
  const dawn = new THREE.PointLight(0xffd892, 10, 12); dawn.position.set(0, .6, -1.6); scene.add(dawn);

  // semente fixa: a cena é sempre a mesma
  let sd = 7; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;

  // veios de madeira desenhados em canvas
  const wc = document.createElement("canvas"); wc.width = 256; wc.height = 512;
  const wx = wc.getContext("2d");
  wx.fillStyle = "#6b4527"; wx.fillRect(0, 0, 256, 512);
  for (let i = 0; i < 140; i++) {
    const x0 = rnd() * 256, a = .05 + rnd() * .18, wob = 2 + rnd() * 7, ph = rnd() * 9;
    wx.strokeStyle = rnd() < .5 ? `rgba(40,22,10,${a})` : `rgba(160,112,66,${a * .7})`;
    wx.lineWidth = .6 + rnd() * 2.2; wx.beginPath();
    for (let y = 0; y <= 512; y += 8) { const x = x0 + Math.sin(y * .012 + ph) * wob + Math.sin(y * .05 + ph * 2) * 1.2; y ? wx.lineTo(x, y) : wx.moveTo(x, y); }
    wx.stroke();
  }
  for (let i = 0; i < 5; i++) { // nós da madeira
    const x = rnd() * 256, y = rnd() * 512, r = 4 + rnd() * 7;
    const g = wx.createRadialGradient(x, y, 0, x, y, r * 2.2);
    g.addColorStop(0, "rgba(30,16,6,.85)"); g.addColorStop(.45, "rgba(45,25,10,.4)"); g.addColorStop(1, "rgba(45,25,10,0)");
    wx.fillStyle = g; wx.beginPath(); wx.ellipse(x, y, r * 1.4, r * 2.4, 0, 0, Math.PI * 2); wx.fill();
  }
  const woodTex = (rot) => {
    const t = new THREE.CanvasTexture(wc); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    if (rot) { t.center.set(.5, .5); t.rotation = Math.PI / 2; }
    return t;
  };
  const bumpTex = (rot) => { const t = new THREE.CanvasTexture(wc); if (rot) { t.center.set(.5, .5); t.rotation = Math.PI / 2; } return t; };
  const woodMat = (rot) => new THREE.MeshStandardMaterial({ map: woodTex(rot), bumpMap: bumpTex(rot), bumpScale: 2.2, roughness: .88, metalness: 0, emissive: 0x2a1404, emissiveIntensity: 0 });
  const woodV = woodMat(false), woodH = woodMat(true);

  // trave talhada à mão: caixa subdividida com relevo irregular
  const hewn = (w, h, d, sx, sy) => {
    const geo = new THREE.BoxGeometry(w, h, d, sx, sy, 2), p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const n = Math.sin(x * 23.1 + y * 7.3) * Math.cos(z * 19.7 + y * 3.1) + .5 * Math.sin(y * 41.7 + x * 13.3 + z * 5.1);
      const f = .012 * n;
      p.setXYZ(i, x + Math.sign(x) * f * (Math.abs(x) > w / 2 - .001), y + Math.sign(y) * f * (Math.abs(y) > h / 2 - .001), z + Math.sign(z) * f * (Math.abs(z) > d / 2 - .001));
    }
    geo.computeVertexNormals(); return geo;
  };

  const g = new THREE.Group(), cr = new THREE.Group(); g.add(cr);
  const BW = .26, BD = .22, YB = .78, HW = 2.1;
  cr.add(new THREE.Mesh(hewn(BW, 3.7, BD, 2, 40), woodV));
  const beam = new THREE.Mesh(hewn(HW, .24, BD * .96, 30, 2), woodH); beam.position.set(0, YB, .005); cr.add(beam);

  // título no alto (INRI)
  const tc = document.createElement("canvas"); tc.width = 256; tc.height = 96;
  const tx = tc.getContext("2d");
  tx.drawImage(wc, 0, 0, 96, 256, 0, 0, 256, 96); tx.fillStyle = "rgba(230,205,160,.35)"; tx.fillRect(0, 0, 256, 96);
  tx.fillStyle = "#2a160a"; tx.font = "600 62px 'Cormorant Garamond', Georgia, serif"; tx.textAlign = "center"; tx.textBaseline = "middle";
  tx.fillText("INRI", 128, 52);
  const tTex = new THREE.CanvasTexture(tc); tTex.colorSpace = THREE.SRGBColorSpace;
  const plankSide = new THREE.MeshStandardMaterial({ color: 0x5a3a20, roughness: .9 });
  const plank = new THREE.Mesh(new THREE.BoxGeometry(.62, .23, .035), [plankSide, plankSide, plankSide, plankSide, new THREE.MeshStandardMaterial({ map: tTex, roughness: .85 }), plankSide]);
  plank.position.set(0, 1.62, BD / 2 + .02); plank.rotation.z = -.03; cr.add(plank);

  // cravos: os três ficaram, Ele não está mais ali
  const iron = new THREE.MeshStandardMaterial({ color: 0x6a6058, metalness: .9, roughness: .45 });
  const nailGeo = new THREE.CylinderGeometry(.02, .011, .2, 6), headGeo = new THREE.CylinderGeometry(.06, .052, .03, 10);
  const nail = (x, y, tilt) => {
    const n = new THREE.Group();
    const shaft = new THREE.Mesh(nailGeo, iron); shaft.position.y = .1; n.add(shaft);
    const head = new THREE.Mesh(headGeo, iron); head.position.y = .2; n.add(head);
    n.rotation.set(Math.PI / 2 - .12, 0, tilt); n.position.set(x, y, BD / 2 - .07); cr.add(n);
  };
  nail(-HW / 2 + .2, YB, .2); nail(HW / 2 - .2, YB, -.15); nail(0, -1.05, .08);

  // pano de linho dobrado sobre a trave, movido pelo vento
  const W = .8, CU = 26, CV = 90, rr = .19, Lb = .5, arc = Math.PI * rr;
  const cloth = new THREE.PlaneGeometry(1, 1, CU, CV), cp = cloth.attributes.position;
  const clothMat = new THREE.MeshPhysicalMaterial({ color: 0xe6dac2, roughness: .85, sheen: 1, sheenRoughness: .55, sheenColor: 0xfff3dc, side: THREE.DoubleSide, emissive: 0xffdca0, emissiveIntensity: 0 });
  const clothMesh = new THREE.Mesh(cloth, clothMat); cr.add(clothMesh);
  const hem = []; for (let i = 0; i <= CU; i++) { const u = i / CU; hem.push(1.02 + .07 * Math.sin(u * 6.3 + 1) + .025 * Math.sin(u * 11)); }
  function drape(t) {
    for (let j = 0; j <= CV; j++) for (let i = 0; i <= CU; i++) {
      const u = i / CU, v = 1 - j / CV, Lf = hem[i], s = v * (Lb + arc + Lf);
      let x = (u - .5) * W, y, z, d;
      if (s < Lb) { d = Lb - s; z = -rr; y = YB - d; }
      else if (s < Lb + arc) { const f = (s - Lb) / rr; z = -rr * Math.cos(f); y = YB + rr * Math.sin(f); d = 0; }
      else { d = s - Lb - arc; z = rr; y = YB - d; }
      const side = z > 0 ? 1 : -1, k = Math.min(1, d / .35);
      // pregas verticais e o tecido que se junta embaixo da trave
      x *= 1 - .18 * Math.min(1, d / .9) * (1 - Math.abs(u - .5));
      z += side * (.05 + .04 * Math.sin(u * 26 + 1.3) + .015 * Math.sin(u * 9)) * k;
      z += side * Math.pow(d, 1.6) * .09 * Math.sin(t * 1.4 + d * 3.2 + u * 4);
      x += Math.pow(d, 1.8) * .035 * Math.sin(t * 1.1 + d * 2.5);
      cp.setXYZ(j * (CU + 1) + i, x, y, z);
    }
    cp.needsUpdate = true; cloth.computeVertexNormals();
  }

  // coroa de espinhos pousada no alto da cruz; dos espinhos brota luz
  const crown = new THREE.Group(); crown.position.set(0, 1.2, 0); cr.add(crown);
  const ring = new THREE.Group(); ring.rotation.set(Math.PI / 2 - .45, 0, .12); crown.add(ring);
  const vine = new THREE.MeshStandardMaterial({ color: 0x4a2f1a, roughness: .8, emissive: 0x2a1404, emissiveIntensity: 0 });
  const R = .3;
  for (let s = 0; s < 3; s++) {
    const pts = [];
    for (let i = 0; i <= 180; i++) { const t = i / 180 * Math.PI * 2, ph = s * Math.PI * 2 / 3; const rr2 = R + .035 * Math.sin(t * 8 + ph); pts.push(new THREE.Vector3(rr2 * Math.cos(t), rr2 * Math.sin(t), .045 * Math.sin(t * 6 + ph))); }
    ring.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 240, .017, 6, true), vine));
  }
  const thorn = new THREE.ConeGeometry(.011, .09, 5), budGeo = new THREE.SphereGeometry(.024, 10, 8);
  const budMat = new THREE.MeshStandardMaterial({ color: 0xffe4a0, emissive: 0xffbe55, emissiveIntensity: 2.2, roughness: .3 });
  const buds = [];
  for (let i = 0; i < 52; i++) {
    const t = rnd() * Math.PI * 2, m = new THREE.Mesh(thorn, vine);
    const base = new THREE.Vector3(R * Math.cos(t), R * Math.sin(t), .045 * Math.sin(t * 6));
    const dir = new THREE.Vector3(Math.cos(t) * (rnd() - .15), Math.sin(t) * (rnd() - .15), (rnd() - .5) * 1.8).normalize();
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); m.position.copy(base).addScaledVector(dir, .04); ring.add(m);
    if (i % 2 === 0) { const b = new THREE.Mesh(budGeo, budMat); b.position.copy(base).addScaledVector(dir, .095); b.scale.setScalar(0); b.userData.d = rnd() * .9; ring.add(b); buds.push(b); }
  }

  // brilho do amanhecer atrás da cruz
  const gc = document.createElement("canvas"); gc.width = gc.height = 256;
  const gx = gc.getContext("2d"), rg = gx.createRadialGradient(128, 128, 0, 128, 128, 128);
  rg.addColorStop(0, "rgba(255,240,205,.95)"); rg.addColorStop(.22, "rgba(255,196,100,.4)"); rg.addColorStop(1, "rgba(255,160,60,0)");
  gx.fillStyle = rg; gx.fillRect(0, 0, 256, 256);
  const glowTex = new THREE.CanvasTexture(gc);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.2), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, opacity: .4 }));
  glow.position.set(0, .7, -.8); g.add(glow);

  // poeira de luz
  const N = 150, pos = new Float32Array(N * 3), seed = new Float32Array(N);
  for (let i = 0; i < N; i++) { const a = rnd() * Math.PI * 2, r2 = .5 + rnd() * 1.7; pos.set([Math.cos(a) * r2, Math.sin(a) * r2 * 1.2, (rnd() - .5) * 1.4], i * 3); seed[i] = rnd(); }
  const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const dustMat = new THREE.PointsMaterial({ map: glowTex, size: .14, transparent: true, depthWrite: false, color: 0xffd58a, opacity: .7 });
  const dust = new THREE.Points(pg, dustMat); g.add(dust);
  const base = pos.slice();

  scene.add(g);
  drape(0);

  let gT = 9, lit = 0, litTo = 0;
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    const pr = renderer.getPixelRatio();
    if (canvas.width !== Math.round(w * pr) || canvas.height !== Math.round(h * pr)) {
      renderer.setSize(w, h, false); cam.aspect = w / h;
      const v = Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2), fitH = 4.3, fitW = 2.7;
      cam.position.set(0, .05, Math.max(fitH / 2 / v, fitW / 2 / (v * cam.aspect))); cam.updateProjectionMatrix();
    }
  }

  return {
    glory(still) { gT = still ? 9 : 0; litTo = 1; },
    unlit() { litTo = 0; },
    draw(t, dt, mx, my, still) {
      resize();
      const tt = still ? 0 : t;
      gT += dt;
      lit += (litTo - lit) * Math.min(1, dt * (litTo > lit ? 1.6 : .9));
      const L = still ? litTo : lit;
      const pulse = gT < 3.2 ? Math.sin(Math.min(1, gT / 3.2) * Math.PI) : 0;
      cr.rotation.y = Math.sin(tt * .45) * .3 + mx * .55 + (still ? -.25 : 0);
      cr.rotation.x = Math.sin(tt * .35) * .05 + my * .22;
      g.position.y = Math.sin(tt * .9) * .05 + L * .05;
      if (!still || !gT) drape(tt);
      // o linho se ilumina, a madeira esquenta, a luz de trás cresce
      clothMat.emissiveIntensity = L * .22 + pulse * .45;
      woodV.emissiveIntensity = woodH.emissiveIntensity = vine.emissiveIntensity = L * .5 + pulse * .6;
      dawn.intensity = 10 + L * 60 + pulse * 40;
      glow.material.opacity = .35 + L * .45 + pulse * .2; glow.scale.setScalar(1 + L * .25 + pulse * .1);
      for (const b of buds) { const k = Math.min(1, Math.max(0, (L - b.userData.d * .5) * 2)); b.scale.setScalar(k * (1 + .15 * Math.sin(t * 3 + b.userData.d * 20) * !still)); }
      budMat.emissiveIntensity = 1.6 + pulse * 2;
      const p = pg.attributes.position.array;
      for (let i = 0; i < N; i++) {
        const s = seed[i], burst = 1 + pulse * 1.1 * s;
        const y = ((base[i * 3 + 1] + tt * (.1 + s * .18) + 2.2) % 4.4) - 2.2;
        p[i * 3] = base[i * 3] * burst + Math.sin(tt * .8 + s * 20) * .05;
        p[i * 3 + 1] = y * burst;
        p[i * 3 + 2] = base[i * 3 + 2];
      }
      pg.attributes.position.needsUpdate = true;
      dustMat.opacity = .45 + L * .3 + pulse * .25;
      renderer.render(scene, cam);
    }
  };
}
