<script setup>
import { computed } from 'vue'
import { usePhoneticStore } from '../stores/phonetic'

const props = defineProps({
  current: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  }
})

const store = usePhoneticStore()

const progress = computed(() => {
  if (props.total === 0) return 0
  return Math.round((store.totalStars / props.total) * 100)
})

const progressStyle = computed(() => ({
  width: `${progress.value}%`
}))
</script>

<template>
  <div class="progress-container">
    <div class="progress-info">
      <span class="progress-label">学习进度</span>
      <span class="progress-value">{{ store.totalStars }} / {{ total }}</span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" :style="progressStyle"></div>
    </div>
    <span class="progress-percent">{{ progress }}%</span>
  </div>
</template>

<style scoped>
.progress-container {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  padding: 15px 20px;
  backdrop-filter: blur(10px);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.progress-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.progress-value {
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.progress-bar {
  height: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFD700, #FFA500);
  border-radius: 5px;
  transition: width 0.5s ease;
}

.progress-percent {
  display: block;
  text-align: right;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  margin-top: 5px;
}
</style>