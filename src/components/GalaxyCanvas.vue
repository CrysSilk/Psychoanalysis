<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvasRef = ref(null)

const ARMS = 2
const TWIST = 3.8
const TILT = 0.68
const TILT_ANGLE = -0.35
const SPEED = 0.00003
const SRC = 1200

const WARM = [255, 231, 201]
const VIOLET = [197, 177, 255]
const BLUE = [132, 186, 255]
const INDIGO = [116, 135, 218]

const rnd = Math.random
const gauss = () => (rnd() + rnd() + rnd() + rnd() - 2) / 2
const radial = (h) => -h * Math.log(1 - rnd() * (1 - Math.exp(-1 / h)))
const armTheta = (arm, radius) =>
  (arm * 2 * Math.PI) / ARMS +
  (TWIST * Math.log1p(radius * 4)) / Math.log(5) +
  Math.sin(radius * 11 + arm * 2.7) * 0.035 +
  arm * radius * 0.09
const lerp = (a, b, t) => Math.round(a + (b - a) * t)

const starColor = (radius) => {
  const t = Math.min(1, radius * 1.15)
  let first
  let second
  let mix

  if (t < 0.34) {
    first = WARM
    second = VIOLET
    mix = t / 0.34
  } else if (t < 0.78) {
    first = VIOLET
    second = BLUE
    mix = (t - 0.34) / 0.44
  } else {
    first = BLUE
    second = INDIGO
    mix = (t - 0.78) / 0.22
  }

  const red = lerp(first[0], second[0], mix)
  const green = lerp(first[1], second[1], mix)
  const blue = lerp(first[2], second[2], mix)
  return `${red},${green},${blue}`
}

let sprite
let context
let size = 0
let angle = 0
let animationFrame = 0
let lastFrameTime = 0
let reducedMotion = false
let resizeObserver
let motionQuery

function buildSprite() {
  const image = document.createElement('canvas')
  image.width = SRC
  image.height = SRC

  const drawingContext = image.getContext('2d')
  if (!drawingContext) {
    throw new Error('Unable to initialize the galaxy sprite 2D context.')
  }

  const center = SRC / 2
  const radius = SRC * 0.47

  const blob = (x, y, blobRadius, rgb, alpha) => {
    const gradient = drawingContext.createRadialGradient(x, y, 0, x, y, blobRadius)
    gradient.addColorStop(0, `rgba(${rgb},${alpha})`)
    gradient.addColorStop(1, `rgba(${rgb},0)`)
    drawingContext.fillStyle = gradient
    drawingContext.beginPath()
    drawingContext.arc(x, y, blobRadius, 0, Math.PI * 2)
    drawingContext.fill()
  }

  const position = (theta, r) => [
    center + Math.cos(theta) * r * radius,
    center + Math.sin(theta) * r * radius
  ]

  drawingContext.globalCompositeOperation = 'source-over'
  blob(center, center, radius * 0.94, '100,125,225', 0.1)
  blob(center, center, radius * 0.72, '112,98,205', 0.07)
  blob(center, center, radius * 0.38, '188,151,255', 0.06)

  for (let i = 0; i < 2800; i += 1) {
    const r = 0.08 + 0.92 * Math.pow(rnd(), 0.85)
    const spread = 0.42 + 0.86 * r
    const theta = armTheta(i % ARMS, r) + gauss() * spread * 0.68
    const [x, y] = position(theta, r)
    const color = rnd() < 0.58 ? '124,157,255' : '176,139,255'
    blob(x, y, 22 + rnd() * 48 * (0.5 + r), color, 0.024 + rnd() * 0.032)
  }

  for (let i = 0; i < 1400; i += 1) {
    const r = 0.12 + 0.88 * Math.pow(rnd(), 0.9)
    const theta = armTheta(i % ARMS, r) + gauss() * (0.72 + 0.9 * r)
    const [x, y] = position(theta, r)
    blob(x, y, 42 + rnd() * 78, '110,132,235', 0.006 + rnd() * 0.01)
  }

  drawingContext.globalCompositeOperation = 'destination-out'
  for (let i = 0; i < 1400; i += 1) {
    const r = 0.16 + 0.68 * rnd()
    const theta = armTheta(i % ARMS, r) - 0.15 + gauss() * (0.045 + r * 0.035)
    const [x, y] = position(theta, r)
    blob(x, y, 7 + rnd() * 20, '0,0,0', 0.04)
  }

  drawingContext.globalCompositeOperation = 'lighter'
  for (let i = 0; i < 22000; i += 1) {
    const r = Math.min(1, 0.05 + radial(0.4))
    const arm = i % ARMS
    const side = rnd() < 0.5 ? -1 : 1
    const offset = side * Math.pow(rnd(), 2.8) * (0.5 + 1.25 * r)
    const theta = armTheta(arm, r) + offset
    const gapCenter = armTheta(arm, r) - 0.15 + Math.sin(r * 13 + arm) * 0.035
    const gapDistance = Math.atan2(Math.sin(theta - gapCenter), Math.cos(theta - gapCenter))
    if (r > 0.2 && r < 0.9 && Math.abs(gapDistance) < 0.035 + r * 0.025 && rnd() < 0.68) {
      continue
    }

    const [x, y] = position(theta, r)
    const bright = rnd() < 0.008
    drawingContext.fillStyle = `rgba(${starColor(r)},${bright ? 0.82 : 0.035 + rnd() * 0.24})`
    const starSize = bright ? 1.5 + rnd() * 0.8 : 0.65 + rnd() * 1.2
    drawingContext.fillRect(x, y, starSize, starSize)
  }

  for (let i = 0; i < 6000; i += 1) {
    const r = Math.min(1, radial(0.45))
    const [x, y] = position(rnd() * Math.PI * 2, r)
    drawingContext.fillStyle = `rgba(${starColor(r)},${0.08 + rnd() * 0.22})`
    drawingContext.fillRect(x, y, 1.1 + rnd() * 1.3, 1.1 + rnd() * 1.3)
  }

  for (let i = 0; i < 180; i += 1) {
    const r = 0.35 + 0.6 * rnd()
    const theta = armTheta(i % ARMS, r) + gauss() * 0.16
    const [x, y] = position(theta, r)
    blob(x, y, 5 + rnd() * 10, '190,155,255', 0.22)
  }

  for (let i = 0; i < 5600; i += 1) {
    const r = Math.abs(gauss()) * 0.21
    const [x, y] = position(rnd() * Math.PI * 2, r)
    drawingContext.fillStyle = `rgba(255,${224 + rnd() * 22},${192 + rnd() * 36},${0.14 + rnd() * 0.34})`
    drawingContext.fillRect(x, y, 0.9 + rnd() * 1.6, 0.9 + rnd() * 1.6)
  }

  drawingContext.globalCompositeOperation = 'source-over'
  blob(center, center, radius * 0.5, '157,133,255', 0.05)
  blob(center, center, radius * 0.36, '255,202,158', 0.08)
  blob(center, center, radius * 0.21, '255,220,174', 0.12)
  blob(center, center, radius * 0.085, '255,239,210', 0.18)
  blob(center, center, radius * 0.035, '250,244,255', 0.28)

  drawingContext.globalCompositeOperation = 'destination-in'
  const edgeFade = drawingContext.createRadialGradient(
    center,
    center,
    0,
    center,
    center,
    radius * 1.04
  )
  edgeFade.addColorStop(0, 'rgba(255,255,255,1)')
  edgeFade.addColorStop(0.78, 'rgba(255,255,255,1)')
  edgeFade.addColorStop(0.88, 'rgba(255,255,255,0.68)')
  edgeFade.addColorStop(0.96, 'rgba(255,255,255,0)')
  drawingContext.fillStyle = edgeFade
  drawingContext.fillRect(0, 0, SRC, SRC)

  return image
}

function render() {
  if (!context || !sprite || !size) return

  context.clearRect(0, 0, size, size)
  context.save()
  context.translate(size / 2, size / 2)
  context.rotate(TILT_ANGLE)
  context.scale(1, TILT)
  context.rotate(angle)
  context.drawImage(sprite, -size / 2, -size / 2, size, size)
  context.restore()
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
  if (!canvas) return

  size = canvas.clientWidth
  if (!size) return

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(size * pixelRatio)
  canvas.height = Math.round(size * pixelRatio)
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  context.imageSmoothingQuality = 'high'
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
  context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Unable to initialize the galaxy canvas 2D context.')
  }

  sprite = buildSprite()
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
})
</script>

<template>
  <canvas ref="canvasRef" class="galaxy-canvas"></canvas>
</template>
