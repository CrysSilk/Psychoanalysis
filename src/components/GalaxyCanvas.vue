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

/* ---------------- 可调参数 ---------------- */
// 形态
const ARMS = 2
const TWIST = 3.2 // 旋臂卷曲程度
const SPREAD_BASE = 0.42 // 旋臂散布（内圈）
const SPREAD_GROW = 1.25 // 越大越往外越发散
const ARM_FRACTION = 0.5 // 跟随旋臂的星点比例，越小越均匀
// 粒子数量（窄屏会自动减半）
const DISK_COUNT = 60000
const BULGE_COUNT = 5200 // 核球（柔和的暖金色核心）
const BAR_COUNT = 2600 // 中央星棒（很淡，只用来托住旋臂的起点）
const CLUSTER_COUNT = 360 // 旋臂上零星的年轻星团
const HAZE_COUNT = 3600
const HALO_COUNT = 12000
// 视角 / 运动
const INCLINATION = Math.acos(0.68) // 盘面倾角
const TILT_ANGLE = -0.35 // 屏幕平面内的旋转
const SPEED = 0.00003 // 自转速度（rad/ms）
const FOV = 30
const CAM_Z = 3.9
const EDGE_FADE_START = 0.76
// 亮度
const EXPOSURE = 1.0
let canvasExtent = 2
let edgeFadeEnd = 1.8

/* ---------------- 工具函数 ---------------- */
const TAU = Math.PI * 2
const rnd = Math.random
const gauss = () => (rnd() + rnd() + rnd() + rnd() - 2) / 2
const radial = (h, max = 1) => -h * Math.log(1 - rnd() * (1 - Math.exp(-max / h)))
const smooth = (t) => t * t * (3 - 2 * t)
const spread = (r) => SPREAD_BASE + SPREAD_GROW * r
const armTheta = (arm, r) =>
  (arm * TAU) / ARMS +
  (TWIST * Math.log1p(r * 4)) / Math.log(5) +
  Math.sin(r * 11 + arm * 2.7) * 0.035 +
  arm * r * 0.09
const edgeFade = (r) =>
  1 - smooth(Math.min(1, Math.max(0, (r - EDGE_FADE_START) / (edgeFadeEnd - EDGE_FADE_START))))

const AMBER = [255, 190, 128] // 核心：琥珀金，叠加饱和后也停在暖金，不会变白
const ROSE = [236, 160, 196] // 内盘：柔和玫瑰
const VIOLET = [184, 164, 255]
const BLUE = [128, 178, 255]
const INDIGO = [112, 130, 220]
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

// 半径 -> 颜色（0..1 的 sRGB，直接输出，不经过 three 的色彩管理）
function paletteColor(radius) {
  const t = Math.min(1, radius * 1.15)
  let c
  if (t < 0.16) c = mix(AMBER, ROSE, t / 0.16)
  else if (t < 0.4) c = mix(ROSE, VIOLET, (t - 0.16) / 0.24)
  else if (t < 0.78) c = mix(VIOLET, BLUE, (t - 0.4) / 0.38)
  else c = mix(BLUE, INDIGO, (t - 0.78) / 0.22)
  return [c[0] / 255, c[1] / 255, c[2] / 255]
}

/* ---------------- three.js 状态 ---------------- */
let renderer
let scene
let camera
let spinGroup
let geometry
let material
let size = 0
let angle = 0
let animationFrame = 0
let lastFrameTime = 0
let reducedMotion = false
let resizeObserver
let motionQuery

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  uniform float uScale;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;
    vAlpha = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = max(aSize * uScale / -mv.z, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uExposure;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float falloff = pow(1.0 - d, 2.2);
    gl_FragColor = vec4(vColor * uExposure, vAlpha * falloff);
  }
`

function buildGeometry() {
  const scale = canvasExtent < 2 ? 0.5 : 1
  const diskCount = Math.round(DISK_COUNT * scale)
  const bulgeCount = Math.round(BULGE_COUNT * scale)
  const hazeCount = Math.round(HAZE_COUNT * scale)
  const haloCount = Math.round(HALO_COUNT * scale)
  const barCount = Math.round(BAR_COUNT * scale)
  const clusterCount = Math.round(CLUSTER_COUNT * scale)
  const glowCount = 3
  const total = diskCount + bulgeCount + barCount + clusterCount + hazeCount + haloCount + glowCount

  const positions = new Float32Array(total * 3)
  const colors = new Float32Array(total * 3)
  const sizes = new Float32Array(total)
  const alphas = new Float32Array(total)
  let i = 0

  const put = (x, y, z, color, s, a) => {
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
    colors[i * 3] = color[0]
    colors[i * 3 + 1] = color[1]
    colors[i * 3 + 2] = color[2]
    sizes[i] = s
    alphas[i] = a
    i += 1
  }

  // y 取负：让旋臂的旋向与原 2D 版本保持一致
  // 1. 盘面星点：向低密度外盘延伸，并逐渐融入背景
  for (let n = 0; n < diskCount; n += 1) {
    const r = 0.03 + radial(0.4, edgeFadeEnd - 0.15)
    const theta =
      rnd() < ARM_FRACTION ? armTheta(n % ARMS, r) + gauss() * spread(r) : rnd() * TAU
    const rr = r * (1 + gauss() * 0.06)
    const base = paletteColor(r)
    const shade = 0.8 + rnd() * 0.2
    const bright = rnd() < 0.003
    put(
      Math.cos(theta) * rr,
      -Math.sin(theta) * rr,
      gauss() * 0.05 * (1 - 0.5 * r),
      [base[0] * shade, base[1] * shade, base[2] * shade],
      bright ? 0.016 + rnd() * 0.01 : 0.005 + rnd() * 0.01,
      (bright ? 0.4 : 0.05 + rnd() * 0.2) *
        edgeFade(rr) *
        (0.1 + 0.9 * Math.pow(smooth(Math.min(1, rr / 0.8)), 1.2))
    )
  }

  // 2. 核球：Plummer 型平滑衰减，暖金色，中心亮度被刻意压在饱和线以下
  for (let n = 0; n < bulgeCount; n += 1) {
    const u = Math.min(0.999, rnd())
    const r = Math.min(0.62, 0.12 / Math.sqrt(Math.pow(u, -2 / 3) - 1))
    const theta = rnd() * TAU
    const c = mix(AMBER, ROSE, Math.min(1, r / 0.5))
    put(
      Math.cos(theta) * r,
      -Math.sin(theta) * r,
      gauss() * 0.12 * (0.4 + r),
      [c[0] / 255, c[1] / 255, c[2] / 255],
      0.004 + rnd() * 0.007,
      (0.1 + rnd() * 0.18) * (1 - smooth(Math.min(1, r / 0.62)))
    )
  }

  // 2b. 中央星棒：沿旋臂起始方向拉长的淡淡一条，让旋臂有根可依
  const barAngle = armTheta(0, 0.14)
  for (let n = 0; n < barCount; n += 1) {
    const along = gauss() * 0.9
    const across = gauss() * 0.22
    const falloff = 1 - smooth(Math.min(1, Math.abs(along) / 0.5))
    const c = mix(AMBER, ROSE, Math.min(1, Math.abs(along) / 0.45))
    const cos = Math.cos(barAngle)
    const sin = Math.sin(barAngle)
    put(
      cos * along - sin * across,
      -(sin * along + cos * across),
      gauss() * 0.04,
      [c[0] / 255, c[1] / 255, c[2] / 255],
      0.004 + rnd() * 0.006,
      (0.03 + rnd() * 0.07) * falloff
    )
  }

  // 3. 弥散星云：大而淡的光斑，提供整体的朦胧光雾，没有方向性的亮线
  for (let n = 0; n < hazeCount; n += 1) {
    const r = 0.04 + (edgeFadeEnd + 0.1) * Math.pow(rnd(), 0.6)
    const theta =
      rnd() < 0.6 ? armTheta(n % ARMS, r) + gauss() * spread(r) * 1.1 : rnd() * TAU
    const color = rnd() < 0.58 ? [124 / 255, 157 / 255, 255 / 255] : [176 / 255, 139 / 255, 255 / 255]
    put(
      Math.cos(theta) * r,
      -Math.sin(theta) * r,
      0,
      color,
      0.12 + rnd() * 0.18,
      (0.016 + rnd() * 0.026) * edgeFade(r) * (0.12 + 0.88 * smooth(Math.min(1, r / 0.55)))
    )
  }

  // 4. 外围稀疏星尘：弱化盘面轮廓，不让星系止于一个固定圆周
  for (let n = 0; n < haloCount; n += 1) {
    const r = edgeFadeEnd * 0.46 + Math.sqrt(rnd()) * edgeFadeEnd * 0.52
    const followsArm = rnd() < 0.34
    const theta = followsArm
      ? armTheta(n % ARMS, r) + gauss() * spread(r) * 1.25
      : rnd() * TAU
    const color = paletteColor(Math.min(1, r / edgeFadeEnd))
    put(
      Math.cos(theta) * r,
      -Math.sin(theta) * r,
      gauss() * 0.07,
      color,
      0.003 + rnd() * 0.006,
      (0.035 + rnd() * 0.09) * edgeFade(r)
    )
  }

  // 5. 年轻星团：零星的玫瑰色 / 冰蓝色亮点，只作点缀，不连成线
  for (let n = 0; n < clusterCount; n += 1) {
    const r = 0.3 + rnd() * 0.55
    const theta = armTheta(n % ARMS, r) + gauss() * spread(r) * 0.8
    const rose = rnd() < 0.55
    put(
      Math.cos(theta) * r,
      -Math.sin(theta) * r,
      gauss() * 0.03,
      rose ? [1, 0.64, 0.84] : [0.66, 0.82, 1],
      0.007 + rnd() * 0.01,
      (0.18 + rnd() * 0.22) * edgeFade(r)
    )
  }

  // 6. 核心辉光：宽而淡的紫晕托底 + 琥珀色柔光，没有任何接近白色的层
  put(0, 0, 0, [150 / 255, 128 / 255, 255 / 255], 1.1, 0.03)
  put(0, 0, 0, [255 / 255, 170 / 255, 150 / 255], 0.7, 0.055)
  put(0, 0, 0, [255 / 255, 186 / 255, 120 / 255], 0.38, 0.15)

  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(positions, 3))
  geo.setAttribute('aColor', new BufferAttribute(colors, 3))
  geo.setAttribute('aSize', new BufferAttribute(sizes, 1))
  geo.setAttribute('aAlpha', new BufferAttribute(alphas, 1))
  return geo
}

function setupScene(canvas) {
  renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' })
  renderer.setClearColor(0x000000, 0)

  scene = new Scene()
  camera = new PerspectiveCamera(FOV, 1, 0.1, 20)
  camera.position.set(0, 0, CAM_Z * canvasExtent)

  geometry = buildGeometry()
  material = new ShaderMaterial({
    uniforms: { uScale: { value: 1 }, uExposure: { value: EXPOSURE } },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: AdditiveBlending
  })

  // 屏幕内旋转 -> 盘面倾斜 -> 自转
  const tilt = new Group()
  tilt.rotation.z = -TILT_ANGLE
  const incline = new Group()
  incline.rotation.x = INCLINATION
  spinGroup = new Group()
  spinGroup.add(new Points(geometry, material))
  incline.add(spinGroup)
  tilt.add(incline)
  scene.add(tilt)
}

function render() {
  if (!renderer || !size) return
  spinGroup.rotation.z = -angle
  renderer.render(scene, camera)
}

function animate(time) {
  const delta = lastFrameTime ? time - lastFrameTime : 16
  lastFrameTime = time
  if (!reducedMotion) angle += delta * SPEED
  render()

  if (!reducedMotion && !document.hidden) {
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
  if (!reducedMotion && !document.hidden && !animationFrame) {
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
  motionQuery.addEventListener('change', handleMotionChange)
  document.addEventListener('visibilitychange', handleVisibilityChange)
  startAnimation()
})

onBeforeUnmount(() => {
  stopAnimation()
  resizeObserver?.disconnect()
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
