<script setup>
import { ref, computed, onMounted } from 'vue'
import { phonetics } from '../data/phonetics'
import { useGameStore } from '../stores/game'
import { usePlayerStore } from '../stores/player'
import { speechService } from '../services/speech'

const props = defineProps({
  category: {
    type: String,
    default: 'all'
  },
  difficulty: {
    type: String,
    default: 'normal', // easy, normal, hard
    validator: (value) => ['easy', 'normal', 'hard'].includes(value)
  }
})

const emit = defineEmits(['back'])

// Store
const gameStore = useGameStore()
const playerStore = usePlayerStore()

// 游戏状态
const currentPhonetic = ref(null)
const options = ref([])
const selectedOption = ref(null)
const isCorrect = ref(null)
const showResult = ref(false)
const isPlaying = ref(false)
const showStars = ref(false)

// 难度配置
const difficultyConfig = {
  easy: 2,
  normal: 4,
  hard: 6
}

// 选项数量
const optionCount = computed(() => difficultyConfig[props.difficulty] || 4)

// 当前题号
const questionNumber = ref(1)
const totalQuestions = 10

// 随机打乱数组
const shuffleArray = (array) => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// 获取随机音标
const getRandomPhonetics = (count) => {
  const categoryPhonetics = props.category === 'all'
    ? phonetics
    : phonetics.filter(p => p.category === props.category)

  const shuffled = shuffleArray(categoryPhonetics)
  return shuffled.slice(0, count)
}

// 生成题目
const generateQuestion = () => {
  const availablePhonetics = getRandomPhonetics(optionCount.value + 1)
  currentPhonetic.value = availablePhonetics[0]

  // 生成选项，确保正确答案在其中
  const wrongOptions = availablePhonetics.slice(1)
  const allOptions = shuffleArray([currentPhonetic.value, ...wrongOptions])

  options.value = allOptions
  selectedOption.value = null
  isCorrect.value = null
  showResult.value = false
}

// 播放音频
const playCurrentAudio = async () => {
  // 如果自己正在播放，直接返回
  if (isPlaying.value) return

  // 如果全局正在播放，也不允许点击
  if (playerStore.isPlaying) return

  // 开始全局播放状态，禁用所有按钮
  playerStore.startPlaying()
  isPlaying.value = true

  // 优先尝试播放真实音频
  const audio = new Audio(currentPhonetic.value.audio)

  audio.onended = () => {
    isPlaying.value = false
    // 注意：不调用 playerStore.stopPlaying()，让定时器在冷却时间结束后自动启用按钮
  }

  audio.onerror = () => {
    isPlaying.value = false
    speechService.speak(currentPhonetic.value.symbol).then(() => {
      isPlaying.value = false
      // 注意：不调用 playerStore.stopPlaying()，让定时器在冷却时间结束后自动启用按钮
    })
  }

  try {
    await audio.play()
  } catch {
    isPlaying.value = false
    await speechService.speak(currentPhonetic.value.symbol)
    isPlaying.value = false
    // 注意：不调用 playerStore.stopPlaying()，让定时器在冷却时间结束后自动启用按钮
  }
}

// 播放音效
const playSound = (type) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()

  if (type === 'correct') {
    // 正确的音效 - 上升音阶
    const frequencies = [523, 659, 784] // C5, E5, G5
    frequencies.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = freq
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + i * 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.3)

      oscillator.start(audioContext.currentTime + i * 0.1)
      oscillator.stop(audioContext.currentTime + i * 0.1 + 0.3)
    })
  } else {
    // 错误的音效 - 下降音阶
    const frequencies = [200, 150, 100]
    frequencies.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = freq
      oscillator.type = 'sawtooth'

      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.15)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.15 + 0.2)

      oscillator.start(audioContext.currentTime + i * 0.15)
      oscillator.stop(audioContext.currentTime + i * 0.15 + 0.2)
    })
  }
}

// 选择答案
const selectAnswer = (phonetic) => {
  if (showResult.value) return

  selectedOption.value = phonetic.symbol
  showResult.value = true

  const correct = phonetic.symbol === currentPhonetic.value.symbol

  if (correct) {
    isCorrect.value = true
    gameStore.addScore(10)
    gameStore.incrementStreak()
    gameStore.addGameStar()
    playSound('correct')

    // 显示星星动画
    showStars.value = true
    setTimeout(() => {
      showStars.value = false
      // 延迟进入下一题
      setTimeout(() => {
        nextQuestion()
      }, 800)
    }, 600)
  } else {
    isCorrect.value = false
    gameStore.resetStreak()
    playSound('wrong')

    // 2秒后进入下一题
    setTimeout(() => {
      nextQuestion()
    }, 2000)
  }
}

// 下一题
const nextQuestion = () => {
  if (questionNumber.value >= totalQuestions) {
    // 游戏结束
    questionNumber.value = totalQuestions + 1
    return
  }

  questionNumber.value++
  generateQuestion()
  
  // 2 秒后自动播放新题目的音频
  setTimeout(() => {
    playCurrentAudio()
  }, 2000)
}

// 重新开始
const restartGame = () => {
  gameStore.resetGame()
  questionNumber.value = 1
  generateQuestion()
}

// 获取选项样式
const getOptionClass = (phonetic) => {
  if (!showResult.value) {
    return 'option-card'
  }

  if (phonetic.symbol === currentPhonetic.value.symbol) {
    return 'option-card correct'
  }

  if (selectedOption.value === phonetic.symbol && !isCorrect.value) {
    return 'option-card wrong'
  }

  return 'option-card'
}

// 初始化游戏
onMounted(() => {
  gameStore.resetGame()
  generateQuestion()
  // 自动播放第一题
  setTimeout(() => {
    playCurrentAudio()
  }, 500)
})

// 游戏是否结束
const isGameOver = computed(() => questionNumber.value > totalQuestions)
</script>

<template>
  <div class="game-container">
    <!-- 星星动画 -->
    <div v-if="showStars" class="stars-overlay">
      <div class="star star-1">⭐</div>
      <div class="star star-2">⭐</div>
      <div class="star star-3">⭐</div>
      <div class="star star-4">⭐</div>
      <div class="star star-5">⭐</div>
    </div>

    <!-- 游戏结束画面 -->
    <div v-if="isGameOver" class="game-over">
      <div class="game-over-content">
        <h2 class="game-over-title">🎉 游戏完成!</h2>

        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">{{ gameStore.score }}</span>
            <span class="stat-label">总分</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ gameStore.totalGameStars }}</span>
            <span class="stat-label">获得星星</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ gameStore.maxStreak }}</span>
            <span class="stat-label">最高连对</span>
          </div>
        </div>

        <button class="restart-btn" @click="restartGame">
          再玩一次
        </button>

        <button class="back-btn" @click="emit('back')">
          返回首页
        </button>
      </div>
    </div>

    <!-- 游戏进行中 -->
    <div v-else class="game-content">
      <!-- 返回按钮 - 悬浮在左上角 -->
      <button class="back-float-btn" @click="emit('back')" title="返回">
        <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    
      <!-- 游戏头部 -->
      <div class="game-header">
        <div class="question-counter">
          第 {{ questionNumber }} / {{ totalQuestions }} 题
        </div>
        <div class="game-stats">
          <span class="stat">
            <span class="stat-icon">⭐</span>
            {{ gameStore.totalGameStars }}
          </span>
          <span class="stat">
            <span class="stat-icon">🔥</span>
            {{ gameStore.streak }} 连对
          </span>
        </div>
      </div>

      <!-- 播放按钮 -->
      <div class="play-section">
        <button
          class="play-btn"
          :class="{ playing: isPlaying, disabled: playerStore.isPlaying }"
          :disabled="playerStore.isPlaying"
          @click="playCurrentAudio"
        >
          <span class="play-icon">{{ isPlaying ? '🔊' : '🔈' }}</span>
          <span class="play-text">{{ isPlaying ? '播放中...' : '点击播放发音' }}</span>
        </button>
      </div>

      <!-- 选择提示 -->
      <p class="instruction">请选择听到的音标:</p>

      <!-- 选项卡片 -->
      <div class="options-grid" :class="`options-${optionCount}`">
        <button
          v-for="phonetic in options"
          :key="phonetic.symbol"
          :class="getOptionClass(phonetic)"
          @click="selectAnswer(phonetic)"
          :disabled="showResult"
        >
          <span class="option-symbol">{{ phonetic.symbol }}</span>
          <span class="option-name">{{ phonetic.name }}</span>
        </button>
      </div>

      <!-- 结果提示 -->
      <div v-if="showResult" class="result-message" :class="{ correct: isCorrect, wrong: !isCorrect }">
        <template v-if="isCorrect">
          <span class="result-icon">🎉</span>
          <span>太棒了! 回答正确!</span>
        </template>
        <template v-else>
          <span class="result-icon">😢</span>
          <span>正确答案是: <strong>{{ currentPhonetic.symbol }}</strong> ({{ currentPhonetic.name }})</span>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  max-width: 800px;
  margin: 0 auto;
  min-height: calc(100vh - 100px);
  position: relative;
}

/* 星星动画 */
.stars-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}

.star {
  position: absolute;
  font-size: 40px;
  animation: starFly 1s ease-out forwards;
}

.star-1 { top: 20%; left: 10%; animation-delay: 0s; }
.star-2 { top: 30%; left: 30%; animation-delay: 0.1s; }
.star-3 { top: 25%; right: 30%; animation-delay: 0.2s; }
.star-4 { top: 35%; right: 10%; animation-delay: 0.3s; }
.star-5 { top: 20%; left: 50%; animation-delay: 0.15s; }

@keyframes starFly {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.5) rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: scale(0) rotate(360deg);
    opacity: 0;
    top: 10%;
  }
}

/* 游戏头部 */
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.15);
  padding: 15px 25px;
  border-radius: 15px;
}

.question-counter {
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.game-stats {
  display: flex;
  gap: 20px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 5px;
  color: white;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 15px;
  border-radius: 20px;
}

.stat-icon {
  font-size: 18px;
}

/* 播放区域 */
.play-section {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.play-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 30px 60px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 10px 30px rgba(255, 165, 0, 0.4);
}

.play-btn:active {
  transform: scale(0.95);
}

.play-btn.playing {
  animation: pulse 1s infinite;
}

.play-btn.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.play-btn.disabled:active {
  transform: none;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.play-icon {
  font-size: 50px;
}

.play-text {
  font-size: 18px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

/* 提示文字 */
.instruction {
  text-align: center;
  color: white;
  font-size: 20px;
  margin-bottom: 20px;
}

/* 选项网格 */
.options-grid {
  display: grid;
  gap: 15px;
  margin-bottom: 20px;
}

.options-grid.options-2 {
  grid-template-columns: repeat(2, 1fr);
}

.options-grid.options-4 {
  grid-template-columns: repeat(2, 1fr);
}

.options-grid.options-6 {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 600px) {
  .options-grid.options-4,
  .options-grid.options-6 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 选项卡片 */
.option-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px 15px;
  background: white;
  border: 3px solid transparent;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.option-card:active:not(:disabled) {
  transform: scale(0.95);
}

.option-card:hover:not(:disabled) {
  border-color: #667eea;
  transform: translateY(-3px);
}

.option-card.correct {
  background: #4CAF50;
  border-color: #45a049;
  animation: correctPop 0.5s ease;
}

.option-card.wrong {
  background: #f44336;
  border-color: #da190b;
  animation: shake 0.5s ease;
}

@keyframes correctPop {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-10px); }
  40%, 80% { transform: translateX(10px); }
}

.option-symbol {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.option-name {
  font-size: 14px;
  color: #666;
}

/* 结果提示 */
.result-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  border-radius: 15px;
  font-size: 18px;
  color: white;
  animation: fadeIn 0.3s ease;
}

.result-message.correct {
  background: rgba(76, 175, 80, 0.9);
}

.result-message.wrong {
  background: rgba(244, 67, 54, 0.9);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.result-icon {
  font-size: 24px;
}

/* 游戏结束 */
.game-over {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.game-over-content {
  background: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.game-over-title {
  font-size: 32px;
  color: #333;
  margin: 0 0 30px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 15px;
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.restart-btn,
.back-btn {
  display: block;
  width: 100%;
  padding: 15px;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.restart-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.restart-btn:active {
  transform: scale(0.98);
}

.back-btn {
  background: #f0f0f0;
  color: #666;
}

.back-btn:active {
  transform: scale(0.98);
}

/* 悬浮返回按钮 - 左上角 */
.back-float-btn {
  position: fixed;
  left: 20px;
  top: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1000;
  padding: 0;
}

.back-float-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.back-float-btn:active {
  transform: scale(0.95);
}

.back-icon {
  width: 28px;
  height: 28px;
  color: white;
  transition: transform 0.3s ease;
}

.back-float-btn:hover .back-icon {
  transform: translateX(-3px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .back-float-btn {
    left: 10px;
    top: 10px;
    width: 45px;
    height: 45px;
  }
  
  .back-icon {
    width: 24px;
    height: 24px;
  }
}
</style>