/* ============================================================
   CS2 · AWP | Lightning Strike — modelo 3D procedural (Three.js),
   fundo de raios em shader, scope e raio cruzando a tela no tiro.
   ============================================================ */
const wrap = document.querySelector(".jc-cs");
const stage = document.getElementById("awp-stage");
if (wrap && stage) boot();

function boot() {
  const root = document.documentElement;
  const still = () => !!root.dataset.still || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const glCanvas = wrap.querySelector(".awp-gl");
  const bgCanvas = stage.querySelector(".awp-bg");
  const fireBtn = document.getElementById("awp-fire");
  const kill = stage.querySelector(".awp-kill");

  /* ---------- fundo: shader de raios (WebGL puro) ---------- */
  const bg = lightningBG(bgCanvas);

  /* ---------- raio em tela cheia ---------- */
  const fx = document.createElement("canvas"); fx.className = "bolt-fx"; fx.setAttribute("aria-hidden", "true");
  const tint = document.createElement("div"); tint.className = "bolt-tint"; tint.setAttribute("aria-hidden", "true");
  document.body.append(tint, fx);
  const fctx = fx.getContext("2d");

  let gun = null, visible = false, busy = false, autoFired = false;
  let mx = 0, my = 0;

  const io = new IntersectionObserver(es => es.forEach(e => {
    visible = e.isIntersecting;
    if (visible && !gun) loadGun();
    if (visible && e.intersectionRatio > .55 && !autoFired && !still()) { autoFired = true; setTimeout(() => visible && fire(), 900); }
  }), { rootMargin: "500px 0px", threshold: [0, .55] });
  io.observe(stage);

  wrap.addEventListener("pointermove", e => { const r = wrap.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5; });
  wrap.addEventListener("pointerleave", () => { mx = my = 0; });
  stage.addEventListener("click", e => { if (e.target.closest(".awp-fire")) return; fire(); });
  fireBtn.addEventListener("click", fire);

  async function loadGun() {
    gun = {};
    try { gun = await makeGun(glCanvas); } catch (err) { gun = null; console.warn("AWP 3D indisponível", err); }
  }

  /* ---------- loop ---------- */
  let last = performance.now();
  (function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (!visible || document.hidden) return;
    const s = still();
    bg && bg.draw(now / 1000, dt, s);
    gun && gun.draw && gun.draw(now / 1000, dt, mx, my, s);
  })(last);

  /* ---------- sequência de tiro ---------- */
  function fire() {
    if (busy) return; busy = true;
    const s = still();
    wrap.classList.add("scoped"); stage.classList.add("scoped");
    bg && bg.zoom(1.9);
    setTimeout(() => {
      stage.classList.remove("shot"); void stage.offsetWidth; stage.classList.add("shot");
      bg && bg.flash();
      if (!s) strike();
      kill.classList.add("on");
      clearTimeout(kill._t); kill._t = setTimeout(() => kill.classList.remove("on"), 3800);
    }, s ? 200 : 620);
    setTimeout(() => {
      wrap.classList.remove("scoped"); stage.classList.remove("scoped");
      bg && bg.zoom(1);
      gun && gun.recoil && gun.recoil();
    }, s ? 700 : 1250);
    setTimeout(() => { busy = false; }, s ? 900 : 2200);
  }

  function strike() {
    const r = stage.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const W = innerWidth, H = innerHeight;
    fx.width = W * dpr; fx.height = H * dpr;
    const sx = r.left + r.width / 2, sy = r.top + r.height / 2;
    tint.style.setProperty("--bx", (sx / W * 100) + "%");
    tint.style.setProperty("--by", (sy / H * 100) + "%");
    tint.classList.remove("on"); void tint.offsetWidth; tint.classList.add("on");
    // alvo: atravessa a tela para o lado oposto
    const goLeft = sx > W / 2;
    const tx = goLeft ? -40 : W + 40, ty = H * (.15 + Math.random() * .7);
    const main = boltPath(sx, sy, tx, ty, Math.hypot(tx - sx, ty - sy) * .16, 7);
    const branches = [];
    for (let i = 0; i < 5; i++) {
      const p = main[Math.floor(main.length * (.15 + Math.random() * .7))];
      const ang = Math.atan2(ty - sy, tx - sx) + (Math.random() - .5) * 1.6;
      const len = 120 + Math.random() * 260;
      branches.push(boltPath(p[0], p[1], p[0] + Math.cos(ang) * len, p[1] + Math.sin(ang) * len, len * .22, 5));
    }
    // 2º raio vindo de cima até o ponto de impacto
    const top = boltPath(tx + (goLeft ? 120 : -120) * Math.random(), -30, (sx + tx) / 2, (sy + ty) / 2, H * .12, 6);
    const t0 = performance.now(), D = 620;
    (function step(now) {
      const k = (now - t0) / D;
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fctx.clearRect(0, 0, W, H);
      if (k >= 1) return;
      const flick = (k < .08 || (k > .16 && k < .34)) ? 1 : (k > .45 ? (1 - k) * 1.6 : .35);
      const grow = Math.min(1, k / .07);
      drawBolt(main, flick, 1, grow);
      branches.forEach(b => drawBolt(b, flick * .8, .55, Math.max(0, (grow - .4) / .6)));
      if (k > .12) drawBolt(top, flick * .9, .7, Math.min(1, (k - .12) / .06));
      requestAnimationFrame(step);
    })(t0);
  }

  function drawBolt(pts, a, w, grow) {
    if (a <= 0 || grow <= 0) return;
    const n = Math.max(2, Math.floor(pts.length * grow));
    fctx.lineJoin = fctx.lineCap = "round";
    const pass = (lw, col, blur) => {
      fctx.beginPath(); fctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < n; i++) fctx.lineTo(pts[i][0], pts[i][1]);
      fctx.lineWidth = lw; fctx.strokeStyle = col; fctx.shadowBlur = blur; fctx.shadowColor = "rgba(190,100,255,1)"; fctx.stroke();
    };
    fctx.globalAlpha = Math.min(1, a);
    pass(14 * w, "rgba(150,60,255,.25)", 40);
    pass(5.5 * w, "rgba(120,40,235,.95)", 18);
    pass(3.2 * w, "rgba(215,170,255,1)", 8);
    pass(1.8 * w, "#fff", 6);
    fctx.globalAlpha = 1; fctx.shadowBlur = 0;
  }
}

/* ---------- utilidades de raio ---------- */
function boltPath(x0, y0, x1, y1, disp, depth) {
  let pts = [[x0, y0], [x1, y1]];
  for (let d = 0; d < depth; d++) {
    const out = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
      const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1;
      const o = (Math.random() - .5) * disp;
      out.push([(ax + bx) / 2 - dy / L * o, (ay + by) / 2 + dx / L * o], pts[i]);
    }
    pts = out; disp *= .55;
  }
  return pts;
}

/* ---------- shader de fundo (inspirado no Lightning do 21st.dev / React Bits) ---------- */
function lightningBG(canvas) {
  const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
  if (!gl) return null;
  const vs = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  const fs = `precision highp float;
uniform vec2 r;uniform float t,fl,zm;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*r)/r.y/zm;
  float v=1.-smoothstep(.2,1.4,length(uv*vec2(.7,1.)));
  vec3 col=vec3(.07,.01,.16)+vec3(.32,.07,.62)*v;
  col+=vec3(.4,.1,.75)*fbm(uv*2.6+vec2(t*.15,-t*.1))*.55*v;
  float g=0.;
  for(int i=0;i<5;i++){
    float fi=float(i);
    float tt=t*(.55+fi*.13)+fi*7.31;
    float st=floor(tt*2.2);
    float y=(fi-2.)*.16+(fbm(vec2(uv.x*1.8+st*.37,fi*3.1+st))-.5)*.7;
    y+=(n(vec2(uv.x*16.+st*5.,fi+st))-.5)*.05+(n(vec2(uv.x*55.,fi*9.+st))-.5)*.012;
    float d=abs(uv.y-y);
    float on=step(.42,n(vec2(floor(tt*7.),fi*4.7)));
    float fade=smoothstep(1.6,.2,abs(uv.x+(fi-2.)*.15));
    g+=.0038/(d+.0016)*(.18+.82*on)*fade;
  }
  col+=vec3(.72,.38,1.)*g+vec3(1.,.95,1.)*g*g*.06;
  col+=vec3(.55,.25,1.)*fl;
  col=1.-exp(-col*1.5);
  gl_FragColor=vec4(col,1.);
}`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
  gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = k => gl.getUniformLocation(pr, k), ur = U("r"), ut = U("t"), uf = U("fl"), uz = U("zm");
  let flash = 0, zoom = 1, zoomTo = 1, frozenT = 4.2;
  return {
    flash() { flash = 1; },
    zoom(z) { zoomTo = z; },
    draw(t, dt, still) {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      flash *= Math.exp(-dt * 7); zoom += (zoomTo - zoom) * Math.min(1, dt * 9);
      gl.uniform2f(ur, w, h); gl.uniform1f(ut, still ? frozenT : t); gl.uniform1f(uf, flash); gl.uniform1f(uz, zoom);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  };
}

/* ---------- AWP 3D ---------- */
async function makeGun(canvas) {
  const THREE = await import("three");
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
  const cam = new THREE.PerspectiveCamera(24, 2, .1, 100);
  cam.position.set(0, .4, 30);

  scene.add(new THREE.AmbientLight(0x8a5cff, .5));
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-4, 8, 10); scene.add(key);
  const rim = new THREE.PointLight(0xc070ff, 60, 30); rim.position.set(3, 2, -5); scene.add(rim);
  const fill = new THREE.PointLight(0x7a3cff, 40, 30); fill.position.set(-6, -3, 6); scene.add(fill);

  /* skin: textura procedural com raios */
  const { map, emap } = skinTextures(THREE);
  const skin = new THREE.MeshStandardMaterial({ map, emissive: 0xffffff, emissiveMap: emap, emissiveIntensity: 1.4, metalness: .25, roughness: .38 });
  const skinTube = skin.clone(); skinTube.map = map.clone(); skinTube.emissiveMap = emap.clone();
  [skinTube.map, skinTube.emissiveMap].forEach(t => { t.repeat.set(2, 1); t.needsUpdate = true; });
  const dark = new THREE.MeshStandardMaterial({ color: 0x15101c, metalness: .7, roughness: .32 });
  const darkSkin = new THREE.MeshStandardMaterial({ color: 0x2a0d4f, emissive: 0x5a1aa8, emissiveIntensity: .25, metalness: .6, roughness: .3 });
  const lens = new THREE.MeshPhysicalMaterial({ color: 0x0a0414, emissive: 0x9b4dff, emissiveIntensity: .7, metalness: .2, roughness: .05, clearcoat: 1 });

  const g = new THREE.Group(); const body = new THREE.Group(); g.add(body);
  const cyl = (rt, rb, len, mat, x, y, z = 0, seg = 32) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, len, seg), mat); m.rotation.z = Math.PI / 2; m.position.set(x, y, z); body.add(m); return m; };
  const box = (w, h, d, mat, x, y, z = 0) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); body.add(m); return m; };

  // coronha / chassi (perfil extrudado com furo do polegar)
  const S = new THREE.Shape();
  [[-3.75, 0], [-3.5, -.18], [-.4, -.28], [.2, -.38], [1.0, -.4], [1.4, -1.38], [1.95, -1.32], [2.3, -.95], [2.9, -1.05], [4.4, -1.1], [4.6, -1.0], [4.6, .45], [4.45, .55], [2.1, .52], [1.4, .3], [-3.7, .3]]
    .forEach(([x, y], i) => i ? S.lineTo(x, y) : S.moveTo(x, y));
  S.closePath();
  const hole = new THREE.Path();
  [[1.62, -.22], [3.35, -.18], [3.45, -.55], [2.5, -.7], [1.95, -.85], [1.62, -.68]].forEach(([x, y], i) => i ? hole.lineTo(x, y) : hole.moveTo(x, y));
  hole.closePath(); S.holes.push(hole);
  const stockGeo = new THREE.ExtrudeGeometry(S, { depth: .3, bevelEnabled: true, bevelThickness: .07, bevelSize: .06, bevelSegments: 4, curveSegments: 8 });
  stockGeo.translate(0, 0, -.15);
  const uv = stockGeo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) + 4) / 9, (uv.getY(i) + 1.5) / 2.2);
  body.add(new THREE.Mesh(stockGeo, skin));
  box(.14, 1.66, .5, dark, 4.67, -.27); // soleira

  // cano + freio de boca
  cyl(.085, .1, 5.0, darkSkin, -3.3, .12);
  cyl(.14, .14, .55, dark, -6.0, .12);
  for (let i = 0; i < 3; i++) box(.06, .3, .3, dark, -5.85 - i * .14, .12);
  // receptor e trilho
  box(2.4, .34, .36, skinTube, .15, .47);
  box(2.2, .08, .22, dark, .15, .68);
  // ferrolho (handle que cicla)
  const bolt = new THREE.Group(); bolt.position.set(1.05, .5, .18); body.add(bolt);
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(.035, .035, .42, 12), dark); arm.rotation.x = Math.PI / 2; arm.position.z = .2; bolt.add(arm);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(.09, 16, 12), dark); knob.position.z = .42; bolt.add(knob);
  // carregador, gatilho
  box(.44, .5, .24, dark, .35, -.55);
  const tg = new THREE.Mesh(new THREE.TorusGeometry(.2, .03, 8, 24, Math.PI), dark); tg.rotation.z = Math.PI; tg.position.set(.85, -.4, 0); body.add(tg);
  box(.05, .2, .06, dark, .85, -.48);
  // luneta
  cyl(.14, .14, 2.7, dark, -.2, 1.05);
  cyl(.27, .14, .5, dark, -1.8, 1.05);
  cyl(.27, .27, .55, darkSkin, -2.3, 1.05);
  cyl(.15, .22, .4, dark, 1.35, 1.05);
  cyl(.22, .22, .3, darkSkin, 1.7, 1.05);
  const fl = new THREE.Mesh(new THREE.CircleGeometry(.24, 32), lens); fl.rotation.y = -Math.PI / 2; fl.position.set(-2.58, 1.05, 0); body.add(fl);
  const tur = new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, .3, 20), dark); tur.position.set(-.25, 1.3, 0); body.add(tur);
  const tur2 = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, .28, 20), dark); tur2.rotation.x = Math.PI / 2; tur2.position.set(-.25, 1.05, .25); body.add(tur2);
  [-.95, .7].forEach(x => { box(.18, .36, .2, dark, x, .84); const ring = new THREE.Mesh(new THREE.TorusGeometry(.16, .04, 8, 24), dark); ring.rotation.y = Math.PI / 2; ring.position.set(x, 1.05, 0); body.add(ring); });
  // cabo da alça (detalhe da referência)
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-2.3, -.1, .1), new THREE.Vector3(-2.15, -.55, .16), new THREE.Vector3(-1.85, -.62, .16), new THREE.Vector3(-1.55, -.35, .12)]);
  body.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 30, .025, 6), dark));

  body.position.x = .9; // centraliza (cano mais longo que a coronha)
  scene.add(g);

  let recoilT = 9, cycleT = 9;
  const ease = t => 1 - Math.pow(1 - t, 3);

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    if (canvas.width !== Math.round(w * renderer.getPixelRatio()) || canvas.height !== Math.round(h * renderer.getPixelRatio())) {
      renderer.setSize(w, h, false); cam.aspect = w / h;
      // enquadra ~11.5 unidades de largura
      const fitW = 11.8, fitH = 4.2;
      const vfov = THREE.MathUtils.degToRad(cam.fov);
      const dW = fitW / 2 / (Math.tan(vfov / 2) * cam.aspect), dH = fitH / 2 / Math.tan(vfov / 2);
      cam.position.z = Math.max(dW, dH); cam.updateProjectionMatrix();
    }
  }

  return {
    recoil() { recoilT = 0; cycleT = 0; },
    draw(t, dt, mx, my, still) {
      resize();
      const tt = still ? 0 : t;
      g.rotation.y = Math.sin(tt * .45) * .22 + mx * .5 - .12;
      g.rotation.x = Math.sin(tt * .6) * .05 + my * .25 + .08;
      g.rotation.z = .04 + Math.sin(tt * .7) * .02;
      g.position.y = Math.sin(tt * 1.1) * .12;
      // recuo
      recoilT += dt;
      const r = recoilT < .5 ? Math.sin(Math.min(1, recoilT / .08) * Math.PI / 2) * Math.exp(-recoilT * 7) : 0;
      body.rotation.z = -r * .28; body.position.x = .9 + r * .7;
      // ciclo do ferrolho: levanta, puxa, empurra, abaixa
      cycleT += dt;
      const c = (cycleT - .25) / .8;
      if (c > 0 && c < 1) {
        const up = c < .2 ? ease(c / .2) : c > .8 ? 1 - ease((c - .8) / .2) : 1;
        const back = c > .2 && c < .5 ? ease((c - .2) / .3) : c >= .5 && c < .8 ? 1 - ease((c - .5) / .3) : 0;
        bolt.rotation.x = -up * 1.2; bolt.position.x = 1.05 + back * .45;
      } else { bolt.rotation.x = 0; bolt.position.x = 1.05; }
      // skin "carregada": pulsos de brilho
      skin.emissiveIntensity = skinTube.emissiveIntensity = still ? 1.3 : 1.1 + Math.max(0, Math.sin(t * 3.1) * Math.sin(t * 7.3)) * 1.4 + r * 4;
      renderer.render(scene, cam);
    }
  };
}

function skinTextures(THREE) {
  const W = 2048, H = 512;
  const mk = () => { const c = document.createElement("canvas"); c.width = W; c.height = H; return c; };
  const base = mk(), bctx = base.getContext("2d");
  const gr = bctx.createLinearGradient(0, 0, W, H);
  gr.addColorStop(0, "#5b16c4"); gr.addColorStop(.5, "#8e34ff"); gr.addColorStop(1, "#6a1fd8");
  bctx.fillStyle = gr; bctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * W, y = Math.random() * H, rr = 60 + Math.random() * 220;
    const rg = bctx.createRadialGradient(x, y, 0, x, y, rr);
    rg.addColorStop(0, `rgba(${Math.random() < .5 ? "210,140,255" : "40,0,90"},${.25 + Math.random() * .25})`); rg.addColorStop(1, "rgba(0,0,0,0)");
    bctx.fillStyle = rg; bctx.fillRect(0, 0, W, H);
  }
  // camada de raios
  const bolts = mk(), lctx = bolts.getContext("2d");
  lctx.lineJoin = lctx.lineCap = "round";
  const draw = (pts, w) => {
    const pass = (lw, col, blur) => { lctx.beginPath(); pts.forEach(([x, y], i) => i ? lctx.lineTo(x, y) : lctx.moveTo(x, y)); lctx.lineWidth = lw; lctx.strokeStyle = col; lctx.shadowBlur = blur; lctx.shadowColor = "#d7a3ff"; lctx.stroke(); };
    pass(7 * w, "rgba(200,140,255,.35)", 22); pass(2.6 * w, "#f3e6ff", 10); pass(1.1 * w, "#fff", 2);
  };
  for (let i = 0; i < 16; i++) {
    const y0 = Math.random() * H, y1 = Math.random() * H;
    const main = boltPath(-20, y0, W + 20, y1, 220, 8); draw(main, .8 + Math.random() * .7);
    for (let b = 0; b < 4; b++) {
      const p = main[Math.floor(Math.random() * main.length)], a = (Math.random() - .5) * 2.4, L = 60 + Math.random() * 200;
      draw(boltPath(p[0], p[1], p[0] + Math.cos(a) * L, p[1] + Math.sin(a) * L, L * .3, 5), .5);
    }
  }
  bctx.drawImage(bolts, 0, 0);
  const em = mk(), ectx = em.getContext("2d"); ectx.fillStyle = "#000"; ectx.fillRect(0, 0, W, H); ectx.drawImage(bolts, 0, 0);
  const T = c => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t; };
  return { map: T(base), emap: T(em) };
}
