<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { badges } from '../data/badges'
import { useBadgeStore } from '../stores/badge'
import { usePhoneticStore } from '../stores/phonetic'
import { useGameStore } from '../stores/game'
import BadgeItem from './BadgeItem.vue'

const badgeStore = useBadgeStore()
const phoneticStore = usePhoneticStore()
const gameStore = useGameStore()

// 当前查看的徽章详情
const selectedBadge = ref(null)

// 显示详情弹窗
const showBadgeDetail = (badge) => {
  selectedBadge.value = badge
}

// 关闭详情弹窗
const closeBadgeDetail = () => {
  selectedBadge.value = null
}

// 监听学习进度和游戏连对来检查徽章
watch(
  () => [phoneticStore.totalStars, gameStore.streak],
  ([stars, streak]) => {
    badgeStore.checkBadges(stars, streak)
  },
  { immediate: true }
)

// 徽章解锁进度
const badgeProgress = computed(() => {
  return badges.map(badge => ({
    ...badge,
    unlocked: badgeStore.isUnlocked(badge.id),
    unlockDate: badgeStore.getUnlockDate(badge.id)
  }))
})
</script>

<template>
  <div class="badge-page">
    <!-- 解锁提示 -->
    <Transition name="slide">
      <div v-if="badgeStore.newlyUnlockedBadge" class="unlock-toast">
        <span class="toast-icon">🎉</span>
        <span class="toast-text">
          恭喜获得徽章: {{ badges.find(b => b.id === badgeStore.newlyUnlockedBadge)?.name }}
        </span>
      </div>
    </Transition>

    <!-- 徽章进度摘要 -->
    <div class="badge-summary">
      <div class="summary-icon">🏅</div>
      <div class="summary-info">
        <div class="summary-title">我的徽章</div>
        <div class="summary-count">
          {{ badgeStore.unlockedCount }} / {{ badgeStore.totalBadges }}
        </div>
      </div>
    </div>

    <!-- 徽章列表 -->
    <div class="badge-list">
      <BadgeItem
        v-for="badge in badgeProgress"
        :key="badge.id"
        :badge="badge"
        :show-date="true"
        @click="showBadgeDetail"
      />
    </div>

    <!-- 徽章详情弹窗 -->
    <Transition name="fade">
      <div v-if="selectedBadge" class="badge-modal" @click="closeBadgeDetail">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeBadgeDetail">×</button>

          <div class="modal-icon" :class="{ locked: !selectedBadge.unlocked }">
            {{ selectedBadge.icon }}
          </div>

          <h2 class="modal-title">{{ selectedBadge.name }}</h2>
          <p class="modal-desc">{{ selectedBadge.description }}</p>

          <div class="modal-status">
            <span v-if="selectedBadge.unlocked" class="status unlocked">
              ✓ 已解锁
            </span>
            <span v-else class="status locked">
              🔒 未解锁
            </span>
          </div>

          <div v-if="selectedBadge.unlockDate" class="modal-date">
            解锁时间: {{ new Date(selectedBadge.unlockDate).toLocaleDateString('zh-CN') }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.badge-page {
  max-width: 800px;
  margin: 0 auto;
}

/* 解锁提示 */
.unlock-toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: white;
  padding: 15px 30px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 30px rgba(255, 165, 0, 0.4);
  z-index: 1000;
  font-weight: bold;
}

.toast-icon {
  font-size: 24px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}

/* 徽章进度摘要 */
.badge-summary {
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.summary-icon {
  font-size: 48px;
}

.summary-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.summary-count {
  font-size: 16px;
  color: #666;
  margin-top: 5px;
}

/* 徽章列表 */
.badge-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 详情弹窗 */
.badge-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  position: relative;
  animation: modalIn 0.3s ease;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 32px;
  height: 32px;
  border: none;
  background: #f0f0f0;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.modal-close:hover {
  background: #e0e0e0;
}

.modal-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.modal-icon.locked {
  filter: grayscale(100%);
  opacity: 0.5;
}

.modal-title {
  font-size: 28px;
  color: #333;
  margin: 0 0 10px 0;
}

.modal-desc {
  font-size: 16px;
  color: #666;
  margin: 0 0 20px 0;
}

.modal-status {
  margin-bottom: 15px;
}

.status {
  display: inline-block;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: bold;
}

.status.unlocked {
  background: #4CAF50;
  color: white;
}

.status.locked {
  background: #ccc;
  color: #666;
}

.modal-date {
  font-size: 14px;
  color: #999;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>