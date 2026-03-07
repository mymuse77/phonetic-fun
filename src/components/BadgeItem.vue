<script setup>
import { computed } from 'vue'
import { useBadgeStore } from '../stores/badge'

const props = defineProps({
  badge: {
    type: Object,
    required: true
  },
  showDate: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const store = useBadgeStore()

// 是否已解锁
const isUnlocked = computed(() => store.isUnlocked(props.badge.id))

// 获取解锁日期
const unlockDate = computed(() => {
  const date = store.getUnlockDate(props.badge.id)
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
})

// 是否是新解锁的
const isNewlyUnlocked = computed(() => store.newlyUnlockedBadge === props.badge.id)
</script>

<template>
  <div
    class="badge-item"
    :class="{ unlocked: isUnlocked, newly: isNewlyUnlocked }"
    @click="emit('click', badge)"
  >
    <div class="badge-icon" :class="{ locked: !isUnlocked }">
      {{ badge.icon }}
    </div>
    <div class="badge-info">
      <div class="badge-name">{{ badge.name }}</div>
      <div class="badge-desc">{{ badge.description }}</div>
      <div v-if="showDate && isUnlocked" class="badge-date">
        解锁于: {{ unlockDate }}
      </div>
    </div>
    <div v-if="isUnlocked" class="unlocked-badge">✓</div>
    <div v-else class="locked-badge">🔒</div>
  </div>
</template>

<style scoped>
.badge-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.badge-item:active {
  transform: scale(0.98);
}

.badge-item.unlocked {
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  border: 2px solid #FFD700;
}

.badge-item.unlocked:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
}

.badge-item.locked {
  background: #f5f5f5;
  opacity: 0.7;
}

.badge-item.locked:hover {
  opacity: 0.9;
}

.badge-item.newly {
  animation: newlyUnlocked 0.5s ease;
}

@keyframes newlyUnlocked {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(255, 215, 0, 0.6); }
  100% { transform: scale(1); }
}

.badge-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  flex-shrink: 0;
}

.badge-icon.locked {
  background: linear-gradient(135deg, #ccc 0%, #999 100%);
  filter: grayscale(100%);
}

.badge-info {
  flex: 1;
  min-width: 0;
}

.badge-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.badge-desc {
  font-size: 14px;
  color: #666;
}

.badge-date {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.unlocked-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  background: #4CAF50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.locked-badge {
  font-size: 20px;
  opacity: 0.5;
}
</style>