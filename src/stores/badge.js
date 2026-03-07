import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { badges, getBadgeById } from '../data/badges'
import { phonetics } from '../data/phonetics'

export const useBadgeStore = defineStore('badge', () => {
  // 从 localStorage 读取已解锁的徽章
  // 格式: { badgeId: unlockDate }
  const unlockedBadges = ref(JSON.parse(localStorage.getItem('unlockedBadges') || '{}'))

  // 最近解锁的徽章（用于显示动画）
  const newlyUnlockedBadge = ref(null)

  // 计算属性
  const unlockedCount = computed(() => Object.keys(unlockedBadges.value).length)

  const totalBadges = computed(() => badges.length)

  // 检查是否已解锁
  const isUnlocked = (badgeId) => {
    return !!unlockedBadges.value[badgeId]
  }

  // 获取解锁日期
  const getUnlockDate = (badgeId) => {
    return unlockedBadges.value[badgeId] || null
  }

  // 解锁徽章
  const unlockBadge = (badgeId) => {
    if (!isUnlocked(badgeId)) {
      const now = new Date().toISOString()
      unlockedBadges.value[badgeId] = now
      newlyUnlockedBadge.value = badgeId
      saveToStorage()

      // 3秒后清除新解锁标记
      setTimeout(() => {
        newlyUnlockedBadge.value = null
      }, 3000)
    }
  }

  // 检查并更新徽章状态
  const checkBadges = (learnedCount, streak) => {
    const vowels = phonetics.filter(p => p.category === 'vowel')
    const consonants = phonetics.filter(p => p.category === 'consonant')

    // 初学者 - 学习1个音标
    if (learnedCount >= 1 && !isUnlocked('beginner')) {
      unlockBadge('beginner')
    }

    // 音标小达 - 学习10个音标
    if (learnedCount >= 10 && !isUnlocked('phonetic_master')) {
      unlockBadge('phonetic_master')
    }

    // 元音大师 - 掌握全部20个元音
    if (learnedCount >= vowels.length && !isUnlocked('vowel_master')) {
      unlockBadge('vowel_master')
    }

    // 辅音高手 - 掌握全部28个辅音
    if (learnedCount >= consonants.length && !isUnlocked('consonant_master')) {
      unlockBadge('consonant_master')
    }

    // 全能选手 - 掌握全部48个音标
    if (learnedCount >= 48 && !isUnlocked('all_master')) {
      unlockBadge('all_master')
    }

    // 游戏达人 - 连续答对5次
    if (streak >= 5 && !isUnlocked('game_pro')) {
      unlockBadge('game_pro')
    }
  }

  // 保存到 localStorage
  const saveToStorage = () => {
    localStorage.setItem('unlockedBadges', JSON.stringify(unlockedBadges.value))
  }

  // 重置徽章进度
  const resetBadges = () => {
    unlockedBadges.value = {}
    saveToStorage()
  }

  return {
    unlockedBadges,
    newlyUnlockedBadge,
    unlockedCount,
    totalBadges,
    isUnlocked,
    getUnlockDate,
    unlockBadge,
    checkBadges,
    resetBadges
  }
})