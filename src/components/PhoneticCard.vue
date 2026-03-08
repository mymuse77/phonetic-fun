<script setup>
import { ref, computed } from 'vue'
import { usePhoneticStore } from '../stores/phonetic'
import { usePlayerStore } from '../stores/player'
import { speechService } from '../services/speech'

const props = defineProps({
  phonetic: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['starEarned'])

const store = usePhoneticStore()
const playerStore = usePlayerStore()
const isPlaying = ref(false)
const isPlayingPhonetic = ref(false)  // 正在读音标
const isPlayingWord = ref(false)      // 正在读单词
const starContainerRef = ref(null)

// 获取星星容器在页面中的位置
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

// 学习次数
const learnCount = computed(() => store.getLearnCount(props.phonetic.symbol))
// 星星是否已收集
const hasStar = computed(() => store.hasStar(props.phonetic.symbol))
// 是否达到学习目标 (3次)
const isCompleted = computed(() => learnCount.value >= 3)

// 星星状态：0=未学习, 1-2=学习中, 3=已完成
const starStatus = computed(() => {
  if (learnCount.value >= 3) return 'completed'
  if (learnCount.value >= 1) return 'learning'
  return 'empty'
})

// 播放音频（星星在播放成功后增加）
const playAudio = async () => {
  // 如果自己正在播放，直接返回
  if (isPlaying.value) return

  // 如果全局正在播放，也不允许点击
  if (playerStore.isPlaying) return

  // 开始全局播放状态，禁用所有按钮
  playerStore.startPlaying()
  isPlaying.value = true

  // 防止重复调用 onSuccess 的标志
  let successCalled = false

  // 尝试播放真实音频文件
  const audio = new Audio(props.phonetic.audio)

  // 成功回调 - 增加星星
  const onSuccess = () => {
    if (successCalled) return
    successCalled = true
    isPlaying.value = false
    isPlayingPhonetic.value = false
    isPlayingWord.value = false
    // 注意：不调用 playerStore.stopPlaying()，让定时器在冷却时间结束后自动启用按钮
    // 播放成功后增加学习次数
    const hadStar = store.hasStar(props.phonetic.symbol)
    store.incrementLearnCount(props.phonetic.symbol)

    // 如果刚获得星星，触发烟花效果
    if (!hadStar && store.hasStar(props.phonetic.symbol)) {
      emit('starEarned', getStarPosition())
    }
  }

  // 失败回调
  const onFailure = () => {
    if (successCalled) return
    isPlaying.value = false
    isPlayingPhonetic.value = false
    isPlayingWord.value = false
    // 注意：不调用 playerStore.stopPlaying()，让定时器在冷却时间结束后自动启用按钮
    console.warn('Failed to play audio:', props.phonetic.symbol)
  }

  audio.onended = () => {
    onSuccess()
  }

  audio.onerror = async () => {
    // 音频文件不存在时使用 Web Speech API - 优化版
    try {
      // 使用优化后的 API：先读单词（更标准），再读音标
      isPlayingPhonetic.value = true
      await speechService.speakPhoneticAndExample(
        props.phonetic.symbol, 
        props.phonetic.example
      )
      // 播放完成后延迟显示图标
      await new Promise(resolve => setTimeout(resolve, 800))
      isPlayingPhonetic.value = false
      isPlayingWord.value = false
      
      onSuccess()
    } catch (e) {
      console.warn('Failed to speak:', props.phonetic.symbol, e)
      onFailure()
    }
  }

  try {
    await audio.play()
  } catch {
    // 音频无法播放时使用 Web Speech API - 优化版
    try {
      // 使用优化后的 API：先读单词（更标准），再读音标
      isPlayingPhonetic.value = true
      await speechService.speakPhoneticAndExample(
        props.phonetic.symbol, 
        props.phonetic.example
      )
      // 播放完成后延迟显示图标
      await new Promise(resolve => setTimeout(resolve, 800))
      isPlayingPhonetic.value = false
      isPlayingWord.value = false
      
      onSuccess()
    } catch (e) {
      console.warn('Failed to speak:', props.phonetic.symbol, e)
      onFailure()
    }
  }
}

// 不再通过点击星星直接标记，星星状态由学习次数决定
const handleStarClick = (e) => {
  e.stopPropagation()
  // 提示用户需要学习发音才能获得星星
}
</script>

<template>
  <div class="phonetic-card" :class="{ disabled: playerStore.isPlaying }" @click="playAudio">
    <div class="card-header">
      <div class="symbol-container">
        <span class="symbol">{{ phonetic.symbol }}</span>
        <span 
          v-if="playerStore.showSoundIcon && isPlayingPhonetic" 
          class="sound-icon phonetic-sound"
        >
          🎵
        </span>
      </div>
      <div ref="starContainerRef" class="star-container" :class="starStatus">
        <span v-if="starStatus === 'empty'" class="star-icon">☆</span>
        <span v-else-if="starStatus === 'learning'" class="star-icon half">🌟</span>
        <span v-else class="star-icon">⭐</span>
        <span class="learn-count">{{ learnCount }}/3</span>
      </div>
    </div>

    <div class="card-body">
      <p class="name">{{ phonetic.name }}</p>
      <p class="example">
        <span class="example-en">
          {{ phonetic.example }}
          <span 
            v-if="playerStore.showSoundIcon && isPlayingWord" 
            class="sound-icon word-sound"
          >
            🎵
          </span>
        </span>
        <span class="example-zh">{{ phonetic.exampleZh }}</span>
      </p>
    </div>

    <div class="play-indicator" :class="{ playing: isPlaying }">
      <span class="sound-icon">{{ isPlaying ? '🔊' : '🔈' }}</span>
      <span class="play-text">{{ isPlaying ? '播放中...' : '点击发音' }}</span>
    </div>
  </div>
</template>

<style scoped>
.phonetic-card {
  background: white;
  border-radius: 15px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  min-height: 140px;
}

.phonetic-card:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.phonetic-card.disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.phonetic-card.disabled:active {
  transform: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.symbol-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.symbol {
  font-size: 32px;
  font-weight: bold;
  color: #333;
}

.sound-icon {
  display: inline-block;
  font-size: 18px;
  animation: soundWave 0.8s ease-in-out infinite;
}

.phonetic-sound {
  color: #667eea;
}

.word-sound {
  color: #764ba2;
  margin-left: 5px;
}

@keyframes soundWave {
  0%, 100% { 
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% { 
    transform: scale(1.3) rotate(-10deg);
    opacity: 0.8;
  }
}

.star-container {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  background: #f0f0f0;
  transition: all 0.3s;
}

.star-container.empty {
  opacity: 0.5;
}

.star-container.learning {
  background: #fff8e1;
}

.star-container.completed {
  background: #fff3cd;
  animation: starPop 0.5s ease;
}

.star-icon {
  font-size: 18px;
}

.star-icon.half {
  filter: brightness(0.8);
}

.learn-count {
  font-size: 12px;
  color: #666;
  font-weight: 600;
}

.star-container.completed .learn-count {
  color: #f59e0b;
}

.star-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s;
}

.star-btn:active {
  transform: scale(1.3);
}

.star-btn.collected {
  animation: starPop 0.3s ease;
}

@keyframes starPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.card-body {
  flex: 1;
}

.name {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
}

.example {
  margin: 0;
}

.example-en {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.example-zh {
  display: block;
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.play-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 8px;
  background: #f0f0f0;
  border-radius: 10px;
  margin-top: 10px;
  transition: all 0.3s;
}

.play-indicator.playing {
  background: #667eea;
  color: white;
}

.sound-icon {
  font-size: 16px;
}

.play-text {
  font-size: 12px;
}
</style>