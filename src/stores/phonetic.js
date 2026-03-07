import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePhoneticStore = defineStore('phonetic', () => {
  // 从 localStorage 读取已收集的星星
  const collectedStars = ref(JSON.parse(localStorage.getItem('phoneticStars') || '[]'))

  // 学习次数记录
  const learnCounts = ref(JSON.parse(localStorage.getItem('phoneticLearnCounts') || '{}'))

  // 计算总星星数
  const totalStars = computed(() => collectedStars.value.length)

  // 检查某个音标是否已收集星星
  const hasStar = (symbol) => collectedStars.value.includes(symbol)

  // 获取学习次数
  const getLearnCount = (symbol) => learnCounts.value[symbol] || 0

  // 增加学习次数
  const incrementLearnCount = (symbol) => {
    const currentCount = learnCounts.value[symbol] || 0
    learnCounts.value[symbol] = currentCount + 1

    // 保存学习次数
    saveLearnCountsToStorage()

    // 如果达到3次，自动收集星星
    if (learnCounts.value[symbol] >= 3 && !hasStar(symbol)) {
      collectStar(symbol)
    }
  }

  // 重置学习次数
  const resetLearnCount = (symbol) => {
    learnCounts.value[symbol] = 0
    saveLearnCountsToStorage()
  }

  // 收集星星
  const collectStar = (symbol) => {
    if (!hasStar(symbol)) {
      collectedStars.value.push(symbol)
      saveToStorage()
    }
  }

  // 移除星星
  const removeStar = (symbol) => {
    const index = collectedStars.value.indexOf(symbol)
    if (index > -1) {
      collectedStars.value.splice(index, 1)
      saveToStorage()
    }
  }

  // 保存到 localStorage
  const saveToStorage = () => {
    localStorage.setItem('phoneticStars', JSON.stringify(collectedStars.value))
  }

  // 保存学习次数到 localStorage
  const saveLearnCountsToStorage = () => {
    localStorage.setItem('phoneticLearnCounts', JSON.stringify(learnCounts.value))
  }

  // 重置进度
  const resetProgress = () => {
    collectedStars.value = []
    learnCounts.value = {}
    saveToStorage()
    saveLearnCountsToStorage()
  }

  return {
    collectedStars,
    learnCounts,
    totalStars,
    hasStar,
    getLearnCount,
    incrementLearnCount,
    resetLearnCount,
    collectStar,
    removeStar,
    resetProgress
  }
})