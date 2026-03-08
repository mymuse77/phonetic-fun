<script setup>
import { ref, computed } from 'vue'
import { usePhoneticStore } from '../stores/phonetic'
import PhoneticCard from './PhoneticCard.vue'
import Confetti from './Confetti.vue'
import { phonetics, getVowelTypes, getConsonantTypes } from '../data/phonetics'

const props = defineProps({
  category: {
    type: String,
    required: true
  }
})

const store = usePhoneticStore()
const showConfetti = ref(false)
const starPosition = ref(null)
const starRef = ref(null)
const showBackBtn = ref(false)  // 是否显示返回按钮

// 获取星星数量
const starCount = computed(() => store.totalStars)

// 滚动监听
const handleScroll = () => {
  // 向下滚动超过 300px 时显示返回按钮
  showBackBtn.value = window.scrollY > 300
}

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 监听滚动事件
import { onMounted, onUnmounted } from 'vue'
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 导出 starRef 以便父组件可以获取位置
defineExpose({ starRef })

// 获取星星元素的位置
const getStarPosition = () => {
  const starElement = document.querySelector('.star-counter .star-icon')
  if (starElement) {
    const rect = starElement.getBoundingClientRect()
    return {
      x: rect.left / window.innerWidth + (rect.width / window.innerWidth) * 0.5,
      y: rect.top / window.innerHeight
    }
  }
  return null
}

// 处理星星获得事件
const handleStarEarned = (position) => {
  // 优先使用传入的位置（来自卡片），否则使用 header 星星位置
  starPosition.value = position || getStarPosition()
  showConfetti.value = true
  // 重置以允许再次触发
  setTimeout(() => {
    showConfetti.value = false
    starPosition.value = null
  }, 2000)
}

// 过滤音标
const filteredPhonetics = computed(() => {
  return phonetics.filter(p => p.category === props.category)
})

// 按类型分组
const groupedPhonetics = computed(() => {
  const types = props.category === 'vowel' ? getVowelTypes() : getConsonantTypes()

  return types.map(type => ({
    ...type,
    phonetics: filteredPhonetics.value.filter(p => p.type === type.id)
  }))
})

// 获取类型颜色
const getTypeColor = (typeId) => {
  const colors = {
    monophthong: '#FF6B6B',
    diphthong: '#FF8E53',
    plosive: '#4ECDC4',
    fricative: '#45B7D1',
    affricate: '#96CEB4',
    nasal: '#FFEAA7',
    lateral: '#DDA0DD',
    'semi-vowel': '#98D8C8'
  }
  return colors[typeId] || '#667eea'
}

// 获取分类名称
const categoryName = computed(() => {
  return props.category === 'vowel' ? '元音' : '辅音'
})
</script>

<template>
  <div class="phonetic-list">
    <Confetti :active="showConfetti" :star-count="starCount" :star-position="starPosition" />

    <!-- 悬浮返回按钮 - 滚动时显示 -->
    <button 
      v-show="showBackBtn" 
      class="back-float-btn" 
      @click="scrollToTop" 
      title="返回顶部"
    >
      <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 19V5M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <h2 class="page-title">{{ categoryName }}学习</h2>

    <div v-for="group in groupedPhonetics" :key="group.id" class="phonetic-group">
      <h3 class="group-title" :style="{ backgroundColor: getTypeColor(group.id) }">
        {{ group.name }}
        <span class="group-count">{{ group.phonetics.length }}</span>
      </h3>

      <div class="phonetic-grid">
        <PhoneticCard
          v-for="phonetic in group.phonetics"
          :key="phonetic.symbol"
          :phonetic="phonetic"
          @star-earned="handleStarEarned"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.phonetic-list {
  max-width: 1000px;
  margin: 0 auto;
}

.page-title {
  color: white;
  font-size: 28px;
  text-align: center;
  margin: 0 0 20px 0;
}

.phonetic-group {
  margin-bottom: 30px;
}

.group-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-radius: 15px;
  color: white;
  font-size: 18px;
  margin: 0 0 15px 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.group-count {
  background: rgba(255, 255, 255, 0.3);
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 14px;
}

.phonetic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 15px;
}

@media (max-width: 768px) {
  .phonetic-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }
}

/* 悬浮返回按钮 - 左侧中间 */
.back-float-btn {
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
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
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.back-float-btn:active {
  transform: translateY(-50%) scale(0.95);
}

.back-icon {
  width: 28px;
  height: 28px;
  color: white;
  transition: transform 0.3s ease;
}

.back-float-btn:hover .back-icon {
  transform: translateY(-3px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .back-float-btn {
    left: 10px;
    width: 45px;
    height: 45px;
  }
  
  .back-icon {
    width: 24px;
    height: 24px;
  }
}
</style>