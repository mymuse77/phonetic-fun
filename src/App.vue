<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import PhoneticList from './components/PhoneticList.vue'
import PhoneticMatchGame from './components/PhoneticMatchGame.vue'
import BadgePage from './components/BadgePage.vue'
import StarCounter from './components/StarCounter.vue'
import ProgressBar from './components/ProgressBar.vue'
import { useBadgeStore } from './stores/badge'

const badgeStore = useBadgeStore()

const currentPage = ref('home')
const totalPhonetics = 48

// 游戏相关状态
const selectedDifficulty = ref('normal')
const gameCategory = ref('all')

// 难度选择键盘支持
const difficultyOptions = ['easy', 'normal', 'hard']
const focusedDifficultyIndex = ref(1) // 默认选中普通难度
let difficultyRefs = []

const setDifficultyRef = (el, index) => {
  if (el) {
    difficultyRefs[index] = el
  }
}

// 键盘事件处理
const handleDifficultyKeydown = (event) => {
  if (currentPage.value !== 'game-select') return

  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault()
      focusedDifficultyIndex.value = Math.max(0, focusedDifficultyIndex.value - 1)
      difficultyRefs[focusedDifficultyIndex.value]?.focus()
      break
    case 'ArrowDown':
      event.preventDefault()
      focusedDifficultyIndex.value = Math.min(difficultyOptions.length - 1, focusedDifficultyIndex.value + 1)
      difficultyRefs[focusedDifficultyIndex.value]?.focus()
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      startGame(difficultyOptions[focusedDifficultyIndex.value])
      break
    case 'Escape':
      event.preventDefault()
      goHome()
      break
  }
}

// 切换页面
const goToList = (category) => {
  currentPage.value = 'list'
  selectedCategory.value = category
}

const goHome = () => {
  currentPage.value = 'home'
}

// 开始游戏
const startGame = (difficulty) => {
  selectedDifficulty.value = difficulty
  currentPage.value = 'game'
}

const goToGameSelect = () => {
  currentPage.value = 'game-select'
}

const goToBadges = () => {
  currentPage.value = 'badges'
}

const selectedCategory = ref('vowel')

// 首页类别选择
const categories = [
  { id: 'vowel', name: '元音', emoji: '🎵', color: '#FF4757' },
  { id: 'consonant', name: '辅音', emoji: '🔤', color: '#2ED573' }
]

// 游戏卡片颜色 - 鲜亮的蓝紫色
const gameCardColor = '#5F6AFF'

// 徽章卡片颜色 - 鲜亮的橙金色
const badgeCardColor = 'linear-gradient(135deg, #FFBE0B 0%, #FB5607 100%)'

// 页面加载和卸载时处理键盘事件
onMounted(() => {
  window.addEventListener('keydown', handleDifficultyKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleDifficultyKeydown)
})
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 v-if="currentPage === 'home'" class="title">Phonetic Fun</h1>
      <button v-else class="back-btn" @click="goHome">
        <span class="back-icon">←</span>
        返回
      </button>
      <StarCounter />
    </header>

    <main class="main-content">
      <!-- 首页 -->
      <div v-if="currentPage === 'home'" class="home-page">
        <div class="welcome">
          <h2 class="welcome-title">欢迎来到音标世界!</h2>
          <p class="welcome-text">点击下方开始学习</p>
        </div>

        <ProgressBar :current="0" :total="totalPhonetics" />

        <div class="category-grid">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="category-card"
            :style="{ backgroundColor: cat.color }"
            @click="goToList(cat.id)"
          >
            <span class="category-emoji">{{ cat.emoji }}</span>
            <span class="category-name">{{ cat.name }}</span>
          </div>

          <!-- 游戏入口卡片 -->
          <div
            class="category-card game-card"
            :style="{ backgroundColor: gameCardColor }"
            @click="goToGameSelect"
            @keydown.enter.prevent="goToGameSelect"
            tabindex="0"
          >
            <span class="category-emoji">🎮</span>
            <span class="category-name">音标配对</span>
          </div>

          <!-- 徽章入口卡片 -->
          <div
            class="category-card badge-card"
            :style="{ background: badgeCardColor }"
            @click="goToBadges"
            @keydown.enter.prevent="goToBadges"
            tabindex="0"
          >
            <span class="category-emoji">🏅</span>
            <span class="category-name">成就徽章</span>
            <span class="badge-count">{{ badgeStore.unlockedCount }}/{{ badgeStore.totalBadges }}</span>
          </div>
        </div>
      </div>

      <!-- 徽章页面 -->
      <div v-else-if="currentPage === 'badges'" class="badge-page-wrapper">
        <BadgePage />
      </div>

      <!-- 难度选择页 -->
      <div v-if="currentPage === 'game-select'" class="game-select-page">
        <div class="welcome">
          <h2 class="welcome-title">选择游戏难度</h2>
          <p class="welcome-text">开始你的音标挑战!</p>
          <p class="keyboard-hint">使用 ↑ ↓ 键选择，Enter 确认，Esc 返回</p>
        </div>

        <div class="difficulty-grid">
          <div
            :ref="(el) => setDifficultyRef(el, 0)"
            class="difficulty-card easy"
            :class="{ focused: focusedDifficultyIndex === 0 }"
            @click="startGame('easy')"
            @keydown.enter.prevent="startGame('easy')"
            tabindex="0"
            @focus="focusedDifficultyIndex = 0"
          >
            <span class="difficulty-emoji">🌟</span>
            <span class="difficulty-name">简单</span>
            <span class="difficulty-desc">2 选 1</span>
          </div>

          <div
            :ref="(el) => setDifficultyRef(el, 1)"
            class="difficulty-card normal"
            :class="{ focused: focusedDifficultyIndex === 1 }"
            @click="startGame('normal')"
            @keydown.enter.prevent="startGame('normal')"
            tabindex="0"
            @focus="focusedDifficultyIndex = 1"
          >
            <span class="difficulty-emoji">🌟🌟</span>
            <span class="difficulty-name">普通</span>
            <span class="difficulty-desc">4 选 1</span>
          </div>

          <div
            :ref="(el) => setDifficultyRef(el, 2)"
            class="difficulty-card hard"
            :class="{ focused: focusedDifficultyIndex === 2 }"
            @click="startGame('hard')"
            @keydown.enter.prevent="startGame('hard')"
            tabindex="0"
            @focus="focusedDifficultyIndex = 2"
          >
            <span class="difficulty-emoji">🌟🌟🌟</span>
            <span class="difficulty-name">困难</span>
            <span class="difficulty-desc">6 选 1</span>
          </div>
        </div>
      </div>

      <!-- 游戏页 -->
      <div v-else-if="currentPage === 'game'" class="game-page">
        <PhoneticMatchGame
          :difficulty="selectedDifficulty"
          :category="gameCategory"
          @back="goHome"
        />
      </div>

      <!-- 音标列表页 -->
      <PhoneticList
        v-else
        :category="selectedCategory"
      />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.title {
  font-size: 28px;
  color: white;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:active {
  transform: scale(0.95);
}

.back-icon {
  font-size: 20px;
}

.main-content {
  padding: 20px;
}

.home-page {
  max-width: 800px;
  margin: 0 auto;
}

.welcome {
  text-align: center;
  margin-bottom: 30px;
}

.welcome-title {
  color: white;
  font-size: 32px;
  margin: 0 0 10px 0;
}

.welcome-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
  margin: 0;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 30px;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.category-card:active {
  transform: scale(0.95);
}

.category-emoji {
  font-size: 60px;
  margin-bottom: 15px;
}

.category-name {
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.badge-card {
  position: relative;
}

.badge-count {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.3);
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 14px;
  color: white;
  font-weight: bold;
}

.badge-page-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

/* 难度选择页面 */
.game-select-page {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 60vh;
}

.keyboard-hint {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin-top: 10px;
}

.difficulty-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 400px;
}

.difficulty-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 32px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.difficulty-card:focus {
  outline: none;
}

.difficulty-card.focused {
  border: 3px solid #FF6B35;
  box-shadow: 0 0 20px rgba(255, 107, 53, 0.4);
  transform: scale(1.02);
}

.difficulty-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.difficulty-card.easy {
  border-left: 5px solid #4CAF50;
}

.difficulty-card.normal {
  border-left: 5px solid #2196F3;
}

.difficulty-card.hard {
  border-left: 5px solid #FF5722;
}

.difficulty-emoji {
  font-size: 32px;
}

.difficulty-name {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.difficulty-desc {
  font-size: 16px;
  color: #666;
  background: #f5f5f5;
  padding: 6px 12px;
  border-radius: 20px;
}

@media (max-width: 768px) {
  .category-grid {
    grid-template-columns: 1fr;
  }

  .category-card {
    padding: 30px;
  }
}
</style>