<script setup>
import { ref, computed } from 'vue'
import { usePhoneticStore } from '../stores/phonetic'
import SettingsModal from './SettingsModal.vue'
import confetti from 'canvas-confetti'

const store = usePhoneticStore()
const showSettings = ref(false)
const starContainerRef = ref(null)
const isAnimating = ref(false)

const starCount = computed(() => store.totalStars)

const openSettings = () => {
  showSettings.value = true
}

const closeSettings = () => {
  showSettings.value = false
}

// 获取星星元素的位置
const getStarPosition = () => {
  if (starContainerRef.value) {
    const rect = starContainerRef.value.getBoundingClientRect()
    return {
      x: rect.left / window.innerWidth + (rect.width / window.innerWidth) * 0.5,
      y: rect.top / window.innerHeight
    }
  }
  return null
}

// 触发星星烟花效果
const triggerStarFireworks = (event) => {
  // 防止连续点击触发
  if (isAnimating.value) return
  isAnimating.value = true

  const position = getStarPosition()
  if (!position) {
    isAnimating.value = false
    return
  }

  // 触发烟花
  const particleCount = 50
  const duration = 1500
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()
    if (timeLeft <= 0) {
      clearInterval(interval)
      isAnimating.value = false
      return
    }

    const particleMultiplier = timeLeft / duration
    confetti({
      ...defaults,
      particleCount: Math.round(particleCount * particleMultiplier),
      origin: position,
      colors: ['#FFD700', '#FFA500', '#FFEC8B', '#FFE135', '#FFC125']
    })
  }, 250)
}
</script>

<template>
  <div class="star-counter-wrapper">
    <div
      ref="starContainerRef"
      class="star-counter"
      :class="{ animating: isAnimating }"
      @click="triggerStarFireworks"
    >
      <span class="star-icon">⭐</span>
      <span class="star-count">{{ starCount }}</span>
    </div>

    <button class="settings-btn" @click="openSettings" title="设置">
      <span class="gear-icon">⚙️</span>
    </button>

    <SettingsModal :show="showSettings" @close="closeSettings" />
  </div>
</template>

<style scoped>
.star-counter-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.star-counter {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 25px;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s;
}

.star-counter:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.star-counter:active,
.star-counter.animating {
  animation: starClickBounce 0.5s ease;
}

@keyframes starClickBounce {
  0% { transform: scale(1); }
  30% { transform: scale(1.3) rotate(-10deg); }
  60% { transform: scale(1.2) rotate(10deg); }
  100% { transform: scale(1); }
}

.star-counter.animating .star-icon {
  animation: starGlow 0.5s ease;
}

@keyframes starGlow {
  0% { filter: drop-shadow(0 0 0 rgba(255, 215, 0, 0)); }
  50% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 1)); }
  100% { filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5)); }
}

.star-icon {
  font-size: 24px;
  animation: starPulse 2s infinite;
}

@keyframes starPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.star-count {
  color: white;
  font-size: 20px;
  font-weight: bold;
  min-width: 30px;
  text-align: center;
}

.settings-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.settings-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(30deg);
}

.settings-btn:active {
  transform: scale(0.95) rotate(30deg);
}

.gear-icon {
  font-size: 20px;
}
</style>