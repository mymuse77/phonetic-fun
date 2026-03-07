import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  // 是否正在播放（控制按钮禁用）
  const isPlaying = ref(false)

  // 冷却时间（秒）
  const cooldownTime = ref(parseInt(localStorage.getItem('phoneticCooldown') || '5'))

  // 是否显示声音图标
  const showSoundIcon = ref(localStorage.getItem('phoneticShowSoundIcon') !== 'false')

  // 播放超时定时器
  let playTimeout = null

  // 设置冷却时间
  const setCooldownTime = (seconds) => {
    const time = Math.max(1, Math.min(10, parseInt(seconds) || 5))
    cooldownTime.value = time
    localStorage.setItem('phoneticCooldown', time.toString())
  }

  // 设置是否显示声音图标
  const setShowSoundIcon = (show) => {
    showSoundIcon.value = show
    localStorage.setItem('phoneticShowSoundIcon', show.toString())
  }

  // 开始播放，禁用所有按钮（冷却时间内不可点击）
  const startPlaying = () => {
    // 清除之前的定时器
    if (playTimeout) {
      clearTimeout(playTimeout)
    }

    isPlaying.value = true

    // 根据配置的冷却时间设置定时器
    playTimeout = setTimeout(() => {
      stopPlaying()
    }, cooldownTime.value * 1000)
  }

  // 停止播放，启用所有按钮
  const stopPlaying = () => {
    isPlaying.value = false
    if (playTimeout) {
      clearTimeout(playTimeout)
      playTimeout = null
    }
  }

  // 手动取消播放状态（用于处理异常情况）
  const cancelPlaying = () => {
    stopPlaying()
  }

  return {
    isPlaying,
    cooldownTime,
    showSoundIcon,
    setCooldownTime,
    setShowSoundIcon,
    startPlaying,
    stopPlaying,
    cancelPlaying
  }
})