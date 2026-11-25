<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvas = ref(null)

let context
let particles = []
let width = 0
let height = 0
let pixelRatio = 1
let frameId = 0
let previousTime = 0
let reducedMotion = false
let motionQuery

function createParticle() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.1 + 0.35,
    speedX: (Math.random() - 0.5) * 0.22,
    speedY: (Math.random() - 0.5) * 0.18,
    phase: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.0007 + 0.0002,
    violet: Math.random() > 0.55
  }
}

function draw(time = 0, delta = 0) {
  if (!context) return

  context.clearRect(0, 0, width, height)

  for (const particle of particles) {
    if (!reducedMotion) {
      particle.x += particle.speedX * delta
      particle.y += particle.speedY * delta

      if (particle.x < -4) particle.x = width + 4
      if (particle.x > width + 4) particle.x = -4
      if (particle.y < -4) particle.y = height + 4
      if (particle.y > height + 4) particle.y = -4
    }

    const twinkle = reducedMotion
      ? 0.52
      : 0.28 + (Math.sin(time * particle.twinkleSpeed + particle.phase) + 1) * 0.27

    context.globalAlpha = twinkle
    context.fillStyle = particle.violet ? '#beaeff' : '#e0e7ff'
    context.beginPath()
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
    context.fill()
  }

  if (!reducedMotion) {
    const connectionDistance = width < 600 ? 80 : 108
    const maxDistSq = connectionDistance * connectionDistance
    context.strokeStyle = '#aea0eb'
    context.lineWidth = 0.6

    for (let i = 0; i < particles.length; i += 1) {
      const first = particles[i]
      for (let j = i + 1; j < particles.length; j += 1) {
        const second = particles[j]
        const distanceX = first.x - second.x
        const distanceY = first.y - second.y
        const distSq = distanceX * distanceX + distanceY * distanceY

        if (distSq < maxDistSq) {
          const distance = Math.sqrt(distSq)
          context.globalAlpha = (1 - distance / connectionDistance) * 0.09
          context.beginPath()
          context.moveTo(first.x, first.y)
          context.lineTo(second.x, second.y)
          context.stroke()
        }
      }
    }
  }

  context.globalAlpha = 1
}

function animate(time) {
  const delta = previousTime ? Math.min(time - previousTime, 40) : 16
  previousTime = time
  draw(time, delta)
  frameId = window.requestAnimationFrame(animate)
}

function stopAnimation() {
  if (frameId) {
    window.cancelAnimationFrame(frameId)
    frameId = 0
  }
  previousTime = 0
}

function startAnimation() {
  if (!reducedMotion && !document.hidden && !frameId) {
    frameId = window.requestAnimationFrame(animate)
  }
}

function resizeCanvas() {
  const element = canvas.value
  if (!element) return

  stopAnimation()
  width = window.innerWidth
  height = window.innerHeight
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
  element.width = Math.round(width * pixelRatio)
  element.height = Math.round(height * pixelRatio)
  context = element.getContext('2d')
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

  const count = Math.max(28, Math.min(82, Math.round((width * height) / 18000)))
  particles = Array.from({ length: count }, createParticle)
  draw()
  startAnimation()
}

function handleMotionChange(event) {
  reducedMotion = event.matches
  stopAnimation()
  draw()
  startAnimation()
}

function handleVisibilityChange() {
  if (document.hidden) {
    stopAnimation()
  } else {
    startAnimation()
  }
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion = motionQuery.matches
  motionQuery.addEventListener('change', handleMotionChange)
  window.addEventListener('resize', resizeCanvas, { passive: true })
  document.addEventListener('visibilitychange', handleVisibilityChange)
  resizeCanvas()
})

onUnmounted(() => {
  stopAnimation()
  motionQuery?.removeEventListener('change', handleMotionChange)
  window.removeEventListener('resize', resizeCanvas)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <div class="universe-background" aria-hidden="true">
    <canvas ref="canvas"></canvas>
  </div>
</template>
