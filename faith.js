/* ============================================================
   Fé: cruz templária 3D (Three.js): cruz pattée em ouro com
   esmalte vermelho, coroa de espinhos e auréola; raios de luz
   em shader sobre a foto do devocional; ao acender, a luz se
   espalha pela tela e aparece um versículo.
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
    litTimer = setTimeout(() => { stage.classList.remove("lit"); rays && rays.lit(0); }, 7500);
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

/* ---------- cruz templária 3D ---------- */
async function makeCross(canvas) {
  const THREE = await import("three");
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.setClearColor(0x000000, 0);
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
  const cam = new THREE.PerspectiveCamera(26, 1, .1, 100);

  scene.add(new THREE.AmbientLight(0xffe2b0, .35));
  const key = new THREE.DirectionalLight(0xfff1d6, 2.4); key.position.set(-3, 6, 8); scene.add(key);
  const warm = new THREE.PointLight(0xffa640, 30, 20); warm.position.set(2.5, 1.5, 3); scene.add(warm);
  const back = new THREE.PointLight(0xffd27a, 40, 20); back.position.set(0, 0, -3); scene.add(back);

  const gold = new THREE.MeshStandardMaterial({ color: 0xe0ac48, metalness: 1, roughness: .22, emissive: 0x7a4a08, emissiveIntensity: .15 });
  const enamel = new THREE.MeshPhysicalMaterial({ color: 0x8e0b14, metalness: .1, roughness: .25, clearcoat: 1, clearcoatRoughness: .08, emissive: 0x5a0006, emissiveIntensity: .25 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x3b2414, roughness: .85, metalness: 0 });

  // perfil da cruz pattée: braços que se abrem até as pontas
  const pattee = (a, W, L, notch) => {
    const S = new THREE.Shape();
    const rot = (x, y, k) => { for (let i = 0; i < k; i++) [x, y] = [y, -x]; return [x, y]; };
    for (let k = 0; k < 4; k++) {
      const P = (x, y) => rot(x, y, k);
      const [sx, sy] = P(-a, a);
      if (k === 0) S.moveTo(sx, sy);
      S.quadraticCurveTo(...P(-a - .04, L * .72), ...P(-W, L));
      S.quadraticCurveTo(...P(0, L - notch), ...P(W, L));
      S.quadraticCurveTo(...P(a + .04, L * .72), ...P(a, a));
    }
    return S;
  };
  const g = new THREE.Group(), cr = new THREE.Group(); g.add(cr);
  const frameGeo = new THREE.ExtrudeGeometry(pattee(.17, .64, 1.5, .16), { depth: .22, bevelEnabled: true, bevelThickness: .07, bevelSize: .06, bevelSegments: 5, curveSegments: 24 });
  frameGeo.center(); cr.add(new THREE.Mesh(frameGeo, gold));
  const inlay = new THREE.ExtrudeGeometry(pattee(.11, .5, 1.32, .13), { depth: .06, bevelEnabled: true, bevelThickness: .02, bevelSize: .02, bevelSegments: 3, curveSegments: 24 });
  inlay.center();
  const front = new THREE.Mesh(inlay, enamel); front.position.z = .2; cr.add(front);
  const backIn = front.clone(); backIn.position.z = -.2; cr.add(backIn);
  // medalhão central
  const boss = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .56, 40), gold); boss.rotation.x = Math.PI / 2; cr.add(boss);
  const gem = new THREE.Mesh(new THREE.SphereGeometry(.12, 32, 20), new THREE.MeshPhysicalMaterial({ color: 0xffe9b0, emissive: 0xffc35a, emissiveIntensity: .6, roughness: .05, transmission: .3, clearcoat: 1 }));
  gem.scale.z = .6; gem.position.z = .29; cr.add(gem);
  const gem2 = gem.clone(); gem2.position.z = -.29; cr.add(gem2);

  // coroa de espinhos: dois galhos trançados + espinhos
  const crown = new THREE.Group(); cr.add(crown);
  const R = .58;
  for (let s = 0; s < 2; s++) {
    const pts = [];
    for (let i = 0; i <= 160; i++) { const t = i / 160 * Math.PI * 2; pts.push(new THREE.Vector3((R + .04 * Math.sin(t * 7 + s * Math.PI)) * Math.cos(t), (R + .04 * Math.sin(t * 7 + s * Math.PI)) * Math.sin(t), .1 * Math.sin(t * 5 + s * Math.PI))); }
    crown.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 220, .028, 6, true), wood));
  }
  const thorn = new THREE.ConeGeometry(.018, .13, 5);
  for (let i = 0; i < 46; i++) {
    const t = Math.random() * Math.PI * 2, m = new THREE.Mesh(thorn, wood);
    m.position.set(R * Math.cos(t), R * Math.sin(t), .1 * Math.sin(t * 5));
    const dir = new THREE.Vector3(Math.cos(t) * (Math.random() - .2), Math.sin(t) * (Math.random() - .2), (Math.random() - .5) * 1.6).normalize();
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); m.position.addScaledVector(dir, .05); crown.add(m);
  }
  crown.rotation.set(.5, .25, 0);

  // auréola + brilho
  const halo = new THREE.Mesh(new THREE.TorusGeometry(1.85, .016, 8, 120), new THREE.MeshBasicMaterial({ color: 0xffd98a, transparent: true, opacity: .7, depthWrite: false }));
  halo.position.z = -.5; g.add(halo);
  const gc = document.createElement("canvas"); gc.width = gc.height = 256;
  const gx = gc.getContext("2d"), rg = gx.createRadialGradient(128, 128, 0, 128, 128, 128);
  rg.addColorStop(0, "rgba(255,236,190,.9)"); rg.addColorStop(.25, "rgba(255,190,90,.35)"); rg.addColorStop(1, "rgba(255,160,60,0)");
  gx.fillStyle = rg; gx.fillRect(0, 0, 256, 256);
  const glowTex = new THREE.CanvasTexture(gc);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, opacity: .55 }));
  glow.position.z = -.7; g.add(glow);

  // poeira de luz
  const N = 160, pos = new Float32Array(N * 3), seed = new Float32Array(N);
  for (let i = 0; i < N; i++) { const a = Math.random() * Math.PI * 2, rr = .6 + Math.random() * 1.8; pos.set([Math.cos(a) * rr, Math.sin(a) * rr * 1.1, (Math.random() - .5) * 1.4], i * 3); seed[i] = Math.random(); }
  const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const dustMat = new THREE.PointsMaterial({ map: glowTex, size: .16, transparent: true, depthWrite: false, color: 0xffd58a, opacity: .8 });
  const dust = new THREE.Points(pg, dustMat); g.add(dust);
  const base = pos.slice();

  scene.add(g);

  let gT = 9, spin = 0;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    const pr = renderer.getPixelRatio();
    if (canvas.width !== Math.round(w * pr) || canvas.height !== Math.round(h * pr)) {
      renderer.setSize(w, h, false); cam.aspect = w / h;
      const v = Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2), fit = 4.3;
      cam.position.set(0, 0, Math.max(fit / 2 / v, fit / 2 / (v * cam.aspect))); cam.updateProjectionMatrix();
    }
  }

  return {
    glory(still) { gT = still ? 9 : 0; },
    draw(t, dt, mx, my, still) {
      resize();
      const tt = still ? 0 : t;
      gT += dt;
      const k = Math.min(1, gT / 1.8), e = ease(k);
      spin = gT < 1.8 ? e * Math.PI * 2 : 0;
      const pulse = gT < 3.2 ? Math.sin(Math.min(1, gT / 3.2) * Math.PI) : 0;
      cr.rotation.y = Math.sin(tt * .5) * .35 + mx * .6 + spin;
      cr.rotation.x = Math.sin(tt * .4) * .08 + my * .3;
      g.position.y = Math.sin(tt * 1.0) * .07;
      gold.emissiveIntensity = .15 + pulse * 1.1 + (still ? 0 : Math.max(0, Math.sin(t * 1.7)) * .08);
      enamel.emissiveIntensity = .25 + pulse * .8;
      halo.scale.setScalar(1 + pulse * .12); halo.material.opacity = .55 + pulse * .45;
      halo.rotation.z = tt * .1;
      glow.scale.setScalar(1 + pulse * .15); glow.material.opacity = .45 + pulse * .55;
      // poeira sobe devagar e explode no "acender"
      const p = pg.attributes.position.array;
      for (let i = 0; i < N; i++) {
        const s = seed[i], burst = 1 + pulse * 1.2 * s;
        const y = ((base[i * 3 + 1] + tt * (.12 + s * .2) + 2.2) % 4.4) - 2.2;
        p[i * 3] = base[i * 3] * burst + Math.sin(tt * .8 + s * 20) * .05;
        p[i * 3 + 1] = y * burst;
        p[i * 3 + 2] = base[i * 3 + 2];
      }
      pg.attributes.position.needsUpdate = true;
      dustMat.opacity = .55 + pulse * .45;
      renderer.render(scene, cam);
    }
  };
}
