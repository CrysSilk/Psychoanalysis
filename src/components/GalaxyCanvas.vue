<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer
} from 'three'

const canvasRef = ref(null)

/* ═══════════════════════════════════════════
 *  "意识漩涡" — 精神分析学主题粒子视觉
 *
 *  设计理念：
 *  · 漩涡形态 → 向内窥探潜意识的视觉隐喻
 *  · 差速旋转 → 内快外慢，产生"吸入"感
 *  · 呼吸脉动 → 像一个活着的心灵在思考
 *  · 色彩梯度 → 金色核心(本我欲望) → 紫色(梦境)
 *                → 冷蓝外缘(意识边界)
 *  · 漏斗深度 → 中心粒子 z 轴分布更深，暗示深渊
 * ═══════════════════════════════════════════ */

/* ---------------- 漩涡形态参数 ---------------- */
const ARMS = 3                  // 3 条意识流旋臂
const TWIST = 5.2               // 旋臂卷曲（比银河更紧凑）
const SPREAD_BASE = 0.22        // 旋臂散布（内圈紧凑）
const SPREAD_GROW = 0.75        // 越往外越发散
const ARM_FRACTION = 0.62       // 跟随旋臂的粒子比例

/* ---------------- 粒子数量 ---------------- */
const STREAM_COUNT = 36000      // 意识流主体
const CORE_COUNT = 4500         // 深层核心（本我）
const MIST_COUNT = 2200         // 梦境迷雾（大而柔的光斑）
const WISP_COUNT = 6500         // 外围思绪（意识边界的微光）
const SPARK_COUNT = 200         // 思维火花（偶尔闪烁的亮点）
const GLOW_COUNT = 5            // 核心辉光层数

/* ---------------- 视角与运动 ---------------- */
const INCLINATION = Math.acos(0.74) // 更正面以突出漩涡吸引力
const TILT_ANGLE = -0.3            // 屏幕内倾斜
const SPEED = 0.000025             // 自转基础速度 (rad/ms)
const FOV = 30
const CAM_Z = 3.9
const EDGE_FADE_START = 0.72
const EXPOSURE = 1.05

let canvasExtent = 2
let edgeFadeEnd = 1.8

/* ═════════════ 工具函数 ═════════════ */
const TAU = Math.PI * 2
const rnd = Math.random
const gauss = () => (rnd() + rnd() + rnd() + rnd() - 2) / 2
const radial = (h, max = 1) => -h * Math.log(1 - rnd() * (1 - Math.exp(-max / h)))
const smooth = (t) => t * t * (3 - 2 * t)

// 旋臂散布：内紧外松
const spread = (r) => SPREAD_BASE + SPREAD_GROW * r

// 旋臂角度：幂律螺旋 + 有机扰动（比对数螺旋更像漩涡）
const armTheta = (arm, r) =>
  (arm * TAU) / ARMS +
  TWIST * Math.pow(r + 0.01, 0.65) +
  Math.sin(r * 9 + arm * 2.1) * 0.055 +
  arm * r * 0.07

// 边缘柔和淡出
const edgeFade = (r) =>
  1 - smooth(Math.min(1, Math.max(0, (r - EDGE_FADE_START) / (edgeFadeEnd - EDGE_FADE_START))))

// 漩涡深度：中心更深，外围更浅（漏斗效果）
const vortexDepth = (r) => 0.02 + 0.14 * Math.pow(Math.max(0, 1 - r * 1.2), 2.2)

/* ═════════════ 心理学调色板 ═════════════ */
// 核心 → 外缘：金色(深层欲望) → 玫瑰(情感) → 紫色(梦境) → 靛蓝(前意识) → 冷蓝(意识边界)
const GOLD   = [255, 215, 145]
const ROSE   = [235, 165, 190]
const VIOLET = [175, 148, 255]
const INDIGO = [125, 128, 230]
const FROST  = [100, 140, 210]

const mix = (a, b, t) => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t
]

function paletteColor(radius) {
  const t = Math.min(1, radius * 1.2)
  let c
  if (t < 0.12) c = mix(GOLD, ROSE, t / 0.12)
  else if (t < 0.35) c = mix(ROSE, VIOLET, (t - 0.12) / 0.23)
  else if (t < 0.65) c = mix(VIOLET, INDIGO, (t - 0.35) / 0.3)
  else c = mix(INDIGO, FROST, (t - 0.65) / 0.35)
  return [c[0] / 255, c[1] / 255, c[2] / 255]
}

/* ═════════════ three.js 状态 ═════════════ */
let renderer, scene, camera, geometry, material
let size = 0
let angle = 0
let animationFrame = 0
let lastFrameTime = 0
let startTime = 0
let reducedMotion = false
let inViewport = true
let resizeObserver, intersectionObserver, motionQuery

/* ═════════════ 自定义着色器 ═════════════ */

// 顶点着色器：差速旋转 + 呼吸脉动
const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3  aColor;
  attribute float aPhase;

  uniform float uScale;
  uniform float uAngle;
  uniform float uTime;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;

    // ── 差速旋转：内圈更快，产生漩涡吸入感 ──
    float r = length(position.xy);
    float speed = 1.0 + 0.45 / (r + 0.18);
    float a = uAngle * speed;
    float c = cos(a);
    float s = sin(a);
    vec3 rotated = vec3(
      position.x * c - position.y * s,
      position.x * s + position.y * c,
      position.z
    );

    // ── 呼吸脉动：相位随半径变化，形成涟漪 ──
    float breath = 1.0 + 0.06 * sin(uTime * 0.0008 + aPhase);
    vAlpha = aAlpha * (0.90 + 0.10 * sin(uTime * 0.0006 + aPhase * 0.7));

    vec4 mv = modelViewMatrix * vec4(rotated, 1.0);
    gl_PointSize = max(aSize * uScale * breath / -mv.z, 1.0);
    gl_Position  = projectionMatrix * mv;
  }
`

// 片元着色器：柔和衰减 + 核心微光
const fragmentShader = /* glsl */ `
  uniform float uExposure;
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float falloff = pow(1.0 - d, 2.4);
    float glow = exp(-d * d * 4.0) * 0.12;
    gl_FragColor = vec4(vColor * uExposure, vAlpha * falloff + glow * vAlpha);
  }
`

/* ═════════════ 粒子生成 ═════════════ */
function buildGeometry() {
  const scale = canvasExtent < 2 ? 0.5 : 1
  const streamCount = Math.round(STREAM_COUNT * scale)
  const coreCount = Math.round(CORE_COUNT * scale)
  const mistCount = Math.round(MIST_COUNT * scale)
  const wispCount = Math.round(WISP_COUNT * scale)
  const sparkCount = Math.round(SPARK_COUNT * scale)
  const total = streamCount + coreCount + mistCount + wispCount + sparkCount + GLOW_COUNT

  const positions = new Float32Array(total * 3)
  const colors = new Float32Array(total * 3)
  const sizes = new Float32Array(total)
  const alphas = new Float32Array(total)
  const phases = new Float32Array(total)
  let i = 0

  const put = (x, y, z, rColor, gColor, bColor, s, a, ph) => {
    const i3 = i * 3
    positions[i3] = x
    positions[i3 + 1] = y
    positions[i3 + 2] = z
    colors[i3] = rColor
    colors[i3 + 1] = gColor
    colors[i3 + 2] = bColor
    sizes[i] = s
    alphas[i] = a
    phases[i] = ph
    i += 1
  }

  /*
   * 1. 意识流主体
   *    漩涡旋臂，紧密卷曲的幂律螺旋
   *    y 取负保持旋向一致
   */
  for (let n = 0; n < streamCount; n += 1) {
    const r = 0.04 + radial(0.38, edgeFadeEnd - 0.12)
    const followArm = rnd() < ARM_FRACTION
    const theta = followArm
      ? armTheta(n % ARMS, r) + gauss() * spread(r)
      : rnd() * TAU
    const rr = r * (1 + gauss() * 0.05)
    const base = paletteColor(r)
    const shade = 0.78 + rnd() * 0.22
    const bright = rnd() < 0.004
    const z = gauss() * vortexDepth(r)
    const phase = r * 3.0 + rnd() * TAU
    put(
      Math.cos(theta) * rr,
      -Math.sin(theta) * rr,
      z,
      base[0] * shade,
      base[1] * shade,
      base[2] * shade,
      bright ? 0.018 + rnd() * 0.012 : 0.005 + rnd() * 0.009,
      (bright ? 0.45 : 0.06 + rnd() * 0.22) *
        edgeFade(rr) *
        (0.12 + 0.88 * Math.pow(smooth(Math.min(1, rr / 0.75)), 1.1)),
      phase
    )
  }

  /*
   * 2. 深层核心（本我）
   *    温暖金色，Plummer 球分布，象征深层欲望
   */
  for (let n = 0; n < coreCount; n += 1) {
    const u = Math.min(0.999, rnd())
    const r = Math.min(0.55, 0.11 / Math.sqrt(Math.pow(u, -2 / 3) - 1))
    const theta = rnd() * TAU
    const t = Math.min(1, r / 0.45)
    const c = mix(GOLD, ROSE, t)
    const phase = rnd() * TAU
    put(
      Math.cos(theta) * r,
      -Math.sin(theta) * r,
      gauss() * (0.08 + 0.1 * (1 - t)),
      c[0] / 255,
      c[1] / 255,
      c[2] / 255,
      0.004 + rnd() * 0.008,
      (0.1 + rnd() * 0.2) * (1 - smooth(Math.min(1, r / 0.55))),
      phase
    )
  }

  /*
   * 3. 梦境迷雾
   *    大而柔的紫色光斑，营造梦幻氛围
   */
  for (let n = 0; n < mistCount; n += 1) {
    const r = 0.06 + (edgeFadeEnd + 0.05) * Math.pow(rnd(), 0.55)
    const followArm = rnd() < 0.55
    const theta = followArm
      ? armTheta(n % ARMS, r) + gauss() * spread(r) * 1.2
      : rnd() * TAU
    const isViolet = rnd() < 0.6
    const phase = r * 2.0 + rnd() * TAU
    put(
      Math.cos(theta) * r,
      -Math.sin(theta) * r,
      gauss() * 0.03,
      isViolet ? 170 / 255 : 120 / 255,
      isViolet ? 140 / 255 : 150 / 255,
      isViolet ? 1 : 245 / 255,
      0.14 + rnd() * 0.2,
      (0.014 + rnd() * 0.024) *
        edgeFade(r) *
        (0.15 + 0.85 * smooth(Math.min(1, r / 0.5))),
      phase
    )
  }

  /*
   * 4. 外围思绪
   *    稀疏冷色星尘，意识边界的微光
   */
  for (let n = 0; n < wispCount; n += 1) {
    const r = edgeFadeEnd * 0.4 + Math.sqrt(rnd()) * edgeFadeEnd * 0.58
    const followArm = rnd() < 0.3
    const theta = followArm
      ? armTheta(n % ARMS, r) + gauss() * spread(r) * 1.3
      : rnd() * TAU
    const color = paletteColor(Math.min(1, r / edgeFadeEnd))
    const phase = rnd() * TAU
    put(
      Math.cos(theta) * r,
      -Math.sin(theta) * r,
      gauss() * 0.06,
      color[0],
      color[1],
      color[2],
      0.003 + rnd() * 0.006,
      (0.03 + rnd() * 0.08) * edgeFade(r),
      phase
    )
  }

  /*
   * 5. 思维火花
   *    旋臂上偶尔闪烁的玫瑰色 / 冰蓝色亮点
   */
  for (let n = 0; n < sparkCount; n += 1) {
    const r = 0.2 + rnd() * 0.6
    const theta = armTheta(n % ARMS, r) + gauss() * spread(r) * 0.7
    const isRose = rnd() < 0.5
    const phase = rnd() * TAU
    put(
      Math.cos(theta) * r,
      -Math.sin(theta) * r,
      gauss() * 0.03,
      isRose ? 1 : 0.55,
      isRose ? 0.6 : 0.78,
      isRose ? 0.78 : 1,
      0.008 + rnd() * 0.012,
      (0.2 + rnd() * 0.25) * edgeFade(r),
      phase
    )
  }

  /*
   * 6. 核心辉光
   *    多层叠加：外层紫晕 → 中层琥珀暖光 → 内核金色
   *    象征深藏的欲望与真相
   */
  put(0, 0, 0, 160 / 255, 135 / 255, 1, 1.2, 0.025, 0)
  put(0, 0, 0, 200 / 255, 160 / 255, 1, 0.8, 0.04, 0.5)
  put(0, 0, 0, 1, 185 / 255, 155 / 255, 0.5, 0.06, 1.0)
  put(0, 0, 0, 1, 210 / 255, 140 / 255, 0.3, 0.12, 1.5)
  put(0, 0, 0, 1, 225 / 255, 180 / 255, 0.15, 0.18, 2.0)

  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(positions, 3))
  geo.setAttribute('aColor', new BufferAttribute(colors, 3))
  geo.setAttribute('aSize', new BufferAttribute(sizes, 1))
  geo.setAttribute('aAlpha', new BufferAttribute(alphas, 1))
  geo.setAttribute('aPhase', new BufferAttribute(phases, 1))
  return geo
}

/* ═════════════ 场景搭建 ═════════════ */
function setupScene(canvas) {
  renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' })
  renderer.setClearColor(0x000000, 0)

  scene = new Scene()
  camera = new PerspectiveCamera(FOV, 1, 0.1, 20)
  camera.position.set(0, 0, CAM_Z * canvasExtent)

  geometry = buildGeometry()
  material = new ShaderMaterial({
    uniforms: {
      uScale: { value: 1 },
      uExposure: { value: EXPOSURE },
      uAngle: { value: 0 },
      uTime: { value: 0 }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: AdditiveBlending
  })

  // 屏幕内旋转 → 盘面倾斜（自转由着色器差速处理）
  const tilt = new Group()
  tilt.rotation.z = -TILT_ANGLE
  const incline = new Group()
  incline.rotation.x = INCLINATION
  incline.add(new Points(geometry, material))
  tilt.add(incline)
  scene.add(tilt)
}

function render() {
  if (!renderer || !size) return
  renderer.render(scene, camera)
}

function animate(time) {
  if (!startTime) startTime = time
  const elapsed = time - startTime
  const delta = lastFrameTime ? time - lastFrameTime : 16
  lastFrameTime = time

  if (!reducedMotion) angle += delta * SPEED

  material.uniforms.uAngle.value = angle
  material.uniforms.uTime.value = elapsed
  render()

  if (!reducedMotion && !document.hidden && inViewport) {
    animationFrame = window.requestAnimationFrame(animate)
  } else {
    animationFrame = 0
  }
}

function stopAnimation() {
  if (animationFrame) {
    window.cancelAnimationFrame(animationFrame)
    animationFrame = 0
  }
  lastFrameTime = 0
}

function startAnimation() {
  if (!reducedMotion && !document.hidden && inViewport && !animationFrame) {
    animationFrame = window.requestAnimationFrame(animate)
  }
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas || !renderer) return

  const width = canvas.clientWidth
  const height = canvas.clientHeight || width
  if (!width || !height) return
  size = width

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(width, height, false)

  const aspect = width / height
  camera.aspect = aspect
  camera.position.z = (CAM_Z * canvasExtent) / Math.min(1, aspect)

  material.uniforms.uScale.value =
    (renderer.domElement.height * canvasExtent) / (2 * Math.tan((FOV * Math.PI) / 360))
  camera.updateProjectionMatrix()
  render()
}

function handleMotionChange(event) {
  reducedMotion = event.matches
  stopAnimation()
  render()
  startAnimation()
}

function handleVisibilityChange() {
  if (document.hidden) stopAnimation()
  else startAnimation()
}

onMounted(() => {
  const canvas = canvasRef.value
  if (window.matchMedia('(max-width: 720px)').matches) {
    canvasExtent = 1.5
    edgeFadeEnd = 1.35
  }

  try {
    setupScene(canvas)
  } catch (error) {
    console.warn('GalaxyCanvas: WebGL is unavailable.', error)
    return
  }

  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion = motionQuery.matches
  resize()

  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  if ('IntersectionObserver' in window) {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        inViewport = entries[0]?.isIntersecting ?? true
        if (inViewport) startAnimation()
        else stopAnimation()
      },
      { threshold: 0.01 }
    )
    intersectionObserver.observe(canvas)
  }
  motionQuery.addEventListener('change', handleMotionChange)
  document.addEventListener('visibilitychange', handleVisibilityChange)
  startAnimation()
})

onBeforeUnmount(() => {
  stopAnimation()
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  motionQuery?.removeEventListener('change', handleMotionChange)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  geometry?.dispose()
  material?.dispose()
  renderer?.dispose()
})
</script>

<template>
  <canvas ref="canvasRef" class="galaxy-canvas"></canvas>
</template>
