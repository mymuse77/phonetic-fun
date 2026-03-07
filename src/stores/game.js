import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  // 游戏星星（从 localStorage 读取）
  const gameStars = ref(JSON.parse(localStorage.getItem('gameStars') || '0'))

  // 当前得分
  const score = ref(0)

  // 连对次数
  const streak = ref(0)

  // 最高连对
  const maxStreak = ref(0)

  // 游戏总星星数
  const totalGameStars = computed(() => gameStars.value)

  // 添加游戏星星
  const addGameStar = () => {
    gameStars.value++
    saveToStorage()
  }

  // 添加得分
  const addScore = (points) => {
    score.value += points
  }

  // 增加连对
  const incrementStreak = () => {
    streak.value++
    if (streak.value > maxStreak.value) {
      maxStreak.value = streak.value
    }
    // 连对3次以上额外奖励星星
    if (streak.value >= 3) {
      addGameStar()
    }
  }

  // 重置连对
  const resetStreak = () => {
    streak.value = 0
  }

  // 重置游戏
  const resetGame = () => {
    score.value = 0
    streak.value = 0
    maxStreak.value = 0
  }

  // 保存到 localStorage
  const saveToStorage = () => {
    localStorage.setItem('gameStars', JSON.stringify(gameStars.value))
  }

  return {
    gameStars,
    score,
    streak,
    maxStreak,
    totalGameStars,
    addGameStar,
    addScore,
    incrementStreak,
    resetStreak,
    resetGame
  }
})