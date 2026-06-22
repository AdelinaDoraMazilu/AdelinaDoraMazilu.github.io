import easingUtils from "https://esm.sh/easing-utils";

class BlackHole extends HTMLElement {
  /**
   * Init
   */
  connectedCallback() {
    // Elements
    this.canvas = this.querySelector(".js-canvas");
    this.ctx = this.canvas.getContext("2d");

    // Init
    this.setSizes();

    this.bindEvents();

    // RAF
    requestAnimationFrame(this.tick.bind(this));
  }

  /**
   * Bind events
   */
  bindEvents() {
    window.addEventListener("resize", this.onResize.bind(this));

    this.themeObserver = new MutationObserver(this.onThemeChange.bind(this));
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });
  }

  /**
   * Theme change handler
   */
  onThemeChange() {
    this.dots.forEach((dot) => {
      dot.c = this.randomDotColor();
    });
  }

  /**
   * Random dot color, based on the current theme
   */
  randomDotColor() {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";

    if (isLight) {
      return `rgb(255, 255, 255)`;
    }

    return `rgb(${Math.random() * 0}, ${150 + Math.random() * 50}, ${150 + Math.random() * 105})`;
  }

  /**
   * Resize handler
   */
  onResize() {
    this.setSizes()
  }

  /**
   * Set sizes
   */
  setSizes () {
    this.setCanvasSize()
    this.setGraphics()
  }
  
  /**
   * Set canvas size
   */
  setCanvasSize () {
    const rect = this.getBoundingClientRect()

    this.render = {
      width: rect.width,
      hWidth: rect.width * 0.5,
      height: rect.height,
      hHeight: rect.height * 0.5,
      dpi: window.devicePixelRatio
    }

    this.canvas.width = this.render.width * this.render.dpi
    this.canvas.height = this.render.height * this.render.dpi
  }

  /**
   * Set graphics
   */
  setGraphics () {
    this.setDiscs()
    this.setDots()
  }

  /**
   * Set discs
   */
  setDiscs () {
    this.discs = []

    this.startDisc = {
      x: this.render.width * 0.5,
      y: this.render.height * 0,
      w: this.render.width * 1,
      h: this.render.height * 1
    }

    const totalDiscs = 150

    for (let i = 0; i < totalDiscs; i++) {
      const p = i / totalDiscs

      const disc = this.tweenDisc({
        p
      })

      this.discs.push(disc)
    }
  }

  /**
   * Set dots
   */
  setDots () {
    this.dots = []

    const totalDots = 20000

    for (let i = 0; i < totalDots; i++) {
      const disc = this.discs[Math.floor(this.discs.length * Math.random())]
      const dot = {
        d: disc,
        a: 0,
        c: this.randomDotColor(),
        p: Math.random(),
        o: Math.random()
      }

      this.dots.push(dot)
    }
  }


  /**
   * Tween disc
   */
  tweenDisc (disc) {
    const { startDisc } = this

    const scaleX = this.tweenValue(1, 0, disc.p, 'outCubic')
    const scaleY = this.tweenValue(1, 0, disc.p, 'outExpo')

    disc.sx = scaleX
    disc.sy = scaleY

    disc.w = startDisc.w * scaleX
    disc.h = startDisc.h * scaleY

    disc.x = startDisc.x
    disc.y = startDisc.y + disc.p * startDisc.h * 1

    return disc
  }

  /**
   * Tween value
   */
  tweenValue (start, end, p, ease = false) {
    const delta = end - start

    const easeFn =
      easingUtils[
        ease ? "ease" + ease.charAt(0).toUpperCase() + ease.slice(1) : "linear"
      ];

    return start + delta * easeFn(p);
  }
  
  /**
   * Draw discs
   */
  drawDiscs () {
    const { ctx } = this

    const isLight = document.documentElement.getAttribute("data-theme") === "light"

    ctx.strokeStyle = isLight ? '#fff9' : '#0329'
    ctx.lineWidth = 1

    // Discs
    this.discs.forEach((disc, i) => {
      const p = disc.sx * disc.sy

      ctx.beginPath()

      ctx.globalAlpha = disc.a

      ctx.ellipse(
        disc.x,
        disc.y + disc.h,
        disc.w,
        disc.h,
        0,
        0,
        Math.PI * 2
      )
      ctx.stroke()

      ctx.closePath()
    })
  }

  /**
   * Draw dots
   */
  drawDots () {
    const { ctx } = this


    this.dots.forEach((dot) => {
      const { d, a, p, c, o } = dot
      
      const _p = d.sx * d.sy
      ctx.fillStyle = c

      const newA = a + (Math.PI * 2 * p)
      const x = d.x + Math.cos(newA) * d.w
      const y = d.y + Math.sin(newA) * d.h

      ctx.globalAlpha = d.a * o

      ctx.beginPath()
      ctx.arc(x, y + d.h, 1 + _p * 0.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.closePath()
    })
  }

  /**
   * Move discs
   */
  moveDiscs () {
    const isLight = document.documentElement.getAttribute("data-theme") === "light"
    const step = isLight ? -0.0003 : 0.0003

    this.discs.forEach((disc) => {
      disc.p = (disc.p + step + 1) % 1

      this.tweenDisc(disc)
      
      const p = disc.sx * disc.sy

      let a = 1
      if (p < 0.01) {
        a = Math.pow(Math.min(p / 0.01, 1), 3)
      } else if (p > 0.2) {
        a = 1 - Math.min((p - 0.2) / 0.8, 1)
      }
      
      disc.a = a
    })
  }

  /**
   * Move dots
   */
  moveDots () {
    const isLight = document.documentElement.getAttribute("data-theme") === "light"

    this.dots.forEach((dot) => {
      const v = this.tweenValue(0, 0.001, 1 - dot.d.sx * dot.d.sy, 'inExpo')
      dot.p = (dot.p + (isLight ? -v : v) + 1) % 1
    })
  }
  
  /**
   * Tick
   */
  tick(time) {
    const { ctx } = this;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    ctx.scale(this.render.dpi, this.render.dpi);

    // Move
    this.moveDiscs()
    this.moveDots()

    // Draw
    this.drawDiscs()
    this.drawDots()

    ctx.restore();

    requestAnimationFrame(this.tick.bind(this));
  }
}

customElements.define("black-hole", BlackHole);

/**
 * NeutronStar
 * Light-mode background: a rotating sphere with two polar light jets
 * and a tilted dipole magnetic field that precesses around the spin axis.
 */
class NeutronStar extends HTMLElement {
  /**
   * Init
   */
  connectedCallback() {
    this.canvas = this.querySelector(".js-canvas");
    this.ctx = this.canvas.getContext("2d");

    this.spinPeriod = 16000; // ms per full precession of the magnetic axis
    this.tiltAngle = (26 * Math.PI) / 180; // tilt of magnetic axis from spin axis
    this.shellLs = [1.35, 1.75, 2.2, 2.7]; // dipole L-shells, in star radii
    this.azimuths = [0, 90, 180, 270]; // degrees, around the magnetic axis

    this.setMagneticFrame();
    this.setSizes();
    this.bindEvents();

    requestAnimationFrame(this.tick.bind(this));
  }

  /**
   * Bind events
   */
  bindEvents() {
    window.addEventListener("resize", this.onResize.bind(this));

    this.themeObserver = new MutationObserver(() => {});
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });
  }

  /**
   * Whether this background is the one currently shown
   */
  isActive() {
    return document.documentElement.getAttribute("data-theme") === "light";
  }

  /**
   * Resize handler
   */
  onResize() {
    this.setSizes();
  }

  /**
   * Set sizes and rebuild the things that depend on them
   */
  setSizes() {
    const rect = this.getBoundingClientRect();

    this.dpi = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = rect.height;
    this.cx = this.width * 0.5;
    this.cy = this.height * 0.5;

    this.canvas.width = this.width * this.dpi;
    this.canvas.height = this.height * this.dpi;

    this.starRadius = Math.max(70, Math.min(Math.min(this.width, this.height) * 0.16, 220));

    this.setStarfield();
    this.setSurfaceSpots();
  }

  /**
   * Build the static starfield + space gradient onto an offscreen canvas
   * (cached, so it doesn't need to be redrawn every frame)
   */
  setStarfield() {
    const off = document.createElement("canvas");
    off.width = this.canvas.width;
    off.height = this.canvas.height;

    const sctx = off.getContext("2d");
    sctx.scale(this.dpi, this.dpi);

    const grad = sctx.createRadialGradient(
      this.cx, this.cy * 0.75, 0,
      this.cx, this.cy * 0.75, Math.max(this.width, this.height) * 0.85
    );
    grad.addColorStop(0, "#0c1c38");
    grad.addColorStop(0.55, "#060f22");
    grad.addColorStop(1, "#01040a");
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, this.width, this.height);

    const totalStars = Math.floor((this.width * this.height) / 2600);
    for (let i = 0; i < totalStars; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const r = Math.random() * 1.1 + 0.2;

      sctx.globalAlpha = Math.random() * 0.6 + 0.2;
      sctx.fillStyle = "#fff";
      sctx.beginPath();
      sctx.arc(x, y, r, 0, Math.PI * 2);
      sctx.fill();
    }
    sctx.globalAlpha = 1;

    this.starfieldCanvas = off;
  }

  /**
   * Random surface mottling, fixed to the star's body so it rotates with it
   */
  setSurfaceSpots() {
    this.spots = [];

    const total = 36;
    for (let i = 0; i < total; i++) {
      this.spots.push({
        theta: Math.acos(2 * Math.random() - 1),
        phi: Math.random() * Math.PI * 2,
        size: Math.random() * 0.16 + 0.05,
        light: Math.random() < 0.5,
        o: Math.random() * 0.35 + 0.15
      });
    }
  }

  /**
   * Build the rest-position dipole frame: tilted axis m0, and an
   * orthonormal pair e1_0/e2_0 spanning the plane perpendicular to it
   */
  setMagneticFrame() {
    const m0 = { x: Math.sin(this.tiltAngle), y: Math.cos(this.tiltAngle), z: 0 };
    const ref = { x: 0, y: 0, z: 1 };

    const e1 = this.normalize(this.cross(m0, ref));
    const e2 = this.normalize(this.cross(m0, e1));

    this.m0 = m0;
    this.e1_0 = e1;
    this.e2_0 = e2;
  }

  /**
   * Vector helpers
   */
  cross(a, b) {
    return {
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x
    };
  }

  normalize(v) {
    const len = Math.hypot(v.x, v.y, v.z) || 1;
    return { x: v.x / len, y: v.y / len, z: v.z / len };
  }

  rotateY(v, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: v.x * cos + v.z * sin,
      y: v.y,
      z: -v.x * sin + v.z * cos
    };
  }

  sphericalToCartesian(theta, phi) {
    return {
      x: Math.sin(theta) * Math.cos(phi),
      y: Math.cos(theta),
      z: Math.sin(theta) * Math.sin(phi)
    };
  }

  /**
   * Draw the star's body: outer glow, lit sphere, rotating surface
   * mottling, and a thin rim light
   */
  drawStar(spinAngle) {
    const { ctx, cx, cy, starRadius } = this;

    const glowR = starRadius * 2.2;
    const glow = ctx.createRadialGradient(cx, cy, starRadius * 0.4, cx, cy, glowR);
    glow.addColorStop(0, "rgba(190,230,255,0.35)");
    glow.addColorStop(1, "rgba(190,230,255,0)");

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const body = ctx.createRadialGradient(
      cx - starRadius * 0.25, cy - starRadius * 0.3, starRadius * 0.1,
      cx, cy, starRadius
    );
    body.addColorStop(0, "#ffffff");
    body.addColorStop(0.25, "#dff3ff");
    body.addColorStop(0.55, "#9fd4ff");
    body.addColorStop(0.8, "#4f9bdb");
    body.addColorStop(1, "#1f4d8a");

    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(cx, cy, starRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, starRadius, 0, Math.PI * 2);
    ctx.clip();

    this.spots.forEach((spot) => {
      const base = this.sphericalToCartesian(spot.theta, spot.phi);
      const p = this.rotateY(base, spinAngle);
      if (p.z <= 0) return;

      const sx = cx + p.x * starRadius;
      const sy = cy - p.y * starRadius;

      ctx.globalAlpha = spot.o * p.z;
      ctx.fillStyle = spot.light ? "#ffffff" : "#13345e";
      ctx.beginPath();
      ctx.ellipse(sx, sy, spot.size * starRadius, spot.size * starRadius * Math.max(0.3, p.z), 0, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    ctx.restore();

    ctx.save();
    ctx.lineWidth = starRadius * 0.06;
    ctx.strokeStyle = "rgba(220,245,255,0.55)";
    ctx.beginPath();
    ctx.arc(cx, cy, starRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Draw the dipole magnetic field lines, precessing around the spin axis
   */
  drawFieldLines(spinAngle) {
    const { ctx, cx, cy, starRadius } = this;

    const m = this.rotateY(this.m0, spinAngle);
    const e1 = this.rotateY(this.e1_0, spinAngle);
    const e2 = this.rotateY(this.e2_0, spinAngle);

    ctx.save();
    ctx.lineWidth = 1.3;
    ctx.strokeStyle = "rgba(170,225,255,0.7)";
    ctx.shadowColor = "rgba(140,210,255,0.9)";
    ctx.shadowBlur = 4;
    ctx.globalCompositeOperation = "lighter";

    this.shellLs.forEach((L) => {
      const thetaMin = Math.asin(Math.sqrt(1 / L));
      const steps = 40;

      this.azimuths.forEach((azDeg) => {
        const az = (azDeg * Math.PI) / 180;
        const ePhi = {
          x: e1.x * Math.cos(az) + e2.x * Math.sin(az),
          y: e1.y * Math.cos(az) + e2.y * Math.sin(az),
          z: e1.z * Math.cos(az) + e2.z * Math.sin(az)
        };

        ctx.globalAlpha = 0.32 + 0.5 * Math.max(0, ePhi.z);

        ctx.beginPath();
        let drawing = false;

        for (let i = 0; i <= steps; i++) {
          const theta = thetaMin + (Math.PI - 2 * thetaMin) * (i / steps);
          const r = L * Math.sin(theta) ** 2;
          const axial = r * Math.cos(theta);
          const perp = r * Math.sin(theta);

          const p = {
            x: m.x * axial + ePhi.x * perp,
            y: m.y * axial + ePhi.y * perp,
            z: m.z * axial + ePhi.z * perp
          };

          const sx = cx + p.x * starRadius;
          const sy = cy - p.y * starRadius;
          const dist = Math.hypot(sx - cx, sy - cy);
          const hidden = p.z < 0 && dist < starRadius * 0.92;

          if (hidden) {
            drawing = false;
            continue;
          }

          if (!drawing) {
            ctx.moveTo(sx, sy);
            drawing = true;
          } else {
            ctx.lineTo(sx, sy);
          }
        }

        ctx.stroke();
      });
    });

    ctx.restore();
  }

  /**
   * Draw the two polar light jets along the (precessing) magnetic axis
   */
  drawJets(spinAngle) {
    const { ctx, cx, cy, starRadius, width, height } = this;

    const m = this.rotateY(this.m0, spinAngle);
    const beamLen = Math.max(width, height) * 1.3;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    [1, -1].forEach((dir) => {
      const nx = cx + m.x * starRadius * dir;
      const ny = cy - m.y * starRadius * dir;
      const fx = cx + m.x * (starRadius + beamLen) * dir;
      const fy = cy - m.y * (starRadius + beamLen) * dir;

      const dx = fx - nx;
      const dy = fy - ny;
      const len = Math.hypot(dx, dy) || 1;
      const px = -dy / len;
      const py = dx / len;

      const baseW = starRadius * 0.42;
      const tipW = starRadius * 0.06;

      const grad = ctx.createLinearGradient(nx, ny, fx, fy);
      grad.addColorStop(0, "rgba(255,255,255,0.95)");
      grad.addColorStop(0.15, "rgba(200,235,255,0.65)");
      grad.addColorStop(0.5, "rgba(150,210,255,0.25)");
      grad.addColorStop(1, "rgba(150,210,255,0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(nx + px * baseW, ny + py * baseW);
      ctx.lineTo(fx + px * tipW, fy + py * tipW);
      ctx.lineTo(fx - px * tipW, fy - py * tipW);
      ctx.lineTo(nx - px * baseW, ny - py * baseW);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.lineWidth = starRadius * 0.05;
      ctx.beginPath();
      ctx.moveTo(nx, ny);
      ctx.lineTo(fx, fy);
      ctx.stroke();
    });

    ctx.restore();
  }

  /**
   * Tick
   */
  tick(time) {
    if (!this.isActive()) {
      requestAnimationFrame(this.tick.bind(this));
      return;
    }

    if (this._t0 === undefined) this._t0 = time;
    const spinAngle = ((time - this._t0) / this.spinPeriod) * Math.PI * 2;

    const { ctx } = this;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.drawImage(this.starfieldCanvas, 0, 0);

    ctx.save();
    ctx.scale(this.dpi, this.dpi);

    this.drawStar(spinAngle);
    this.drawFieldLines(spinAngle);
    this.drawJets(spinAngle);

    ctx.restore();

    requestAnimationFrame(this.tick.bind(this));
  }
}

customElements.define("neutron-star", NeutronStar);
