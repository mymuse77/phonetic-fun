<script setup>
import { onMounted, ref, watch } from 'vue'
import confetti from 'canvas-confetti'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  starCount: {
    type: Number,
    default: 0
  },
  starPosition: {
    type: Object,
    default: () => null
  }
})

let confettiInstance = null

const triggerConfetti = () => {
  // 根据星星数量确定粒子数
  let particleCount = 30 // 默认小烟花
  if (props.starCount >= 4) {
    particleCount = 100 // 超大烟花
  } else if (props.starCount >= 3) {
    particleCount = 80  // 大烟花
  } else if (props.starCount >= 2) {
    particleCount = 50  // 中烟花
  } else {
    particleCount = 30 // 小烟花
  }

  // 持续时间缩短到 1-1.5 秒
  const duration = 1500
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 }

  // 确定发射位置：优先使用星星位置，否则使用默认值
  let originX = 0.5
  let originY = 0.3

  if (props.starPosition) {
    originX = props.starPosition.x
    originY = props.starPosition.y
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleMultiplier = timeLeft / duration

    // 从星星位置发射烟花
    confetti({
      ...defaults,
      particleCount: Math.round(particleCount * particleMultiplier),
      origin: { x: originX, y: originY },
      colors: ['#FFD700', '#FFA500', '#FFEC8B', '#FFE135', '#FFC125'] // 金色系
    })

    // 添加一些向外扩散的小粒子
    confetti({
      ...defaults,
      particleCount: Math.round(particleCount * 0.3 * particleMultiplier),
      origin: { x: originX, y: originY },
      spread: 180,
      startVelocity: 15,
      colors: ['#FFD700', '#FFA500', '#FFEC8B']
    })
  }, 250)
}

watch(() => props.active, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    triggerConfetti()
  }
})
</script>

<template>
  <div class="confetti-container"></div>
</template>

<style scoped>
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}
</style>
