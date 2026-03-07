<script setup>
import { ref, computed } from 'vue'
import { usePhoneticStore } from '../stores/phonetic'
import { usePlayerStore } from '../stores/player'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const store = usePhoneticStore()
const playerStore = usePlayerStore()
const showConfirm = ref(false)

// 计算统计数据
const totalStars = computed(() => store.totalStars)
const totalLearnCounts = computed(() => {
  const counts = store.learnCounts
  return Object.values(counts).reduce((sum, count) => sum + count, 0)
})

// 冷却时间配置
const cooldownTime = computed({
  get: () => playerStore.cooldownTime,
  set: (value) => playerStore.setCooldownTime(value)
})

// 声音图标显示配置
const showSoundIcon = computed({
  get: () => playerStore.showSoundIcon,
  set: (value) => playerStore.setShowSoundIcon(value)
})

// 点击重置按钮
const handleReset = () => {
  showConfirm.value = true
}

// 确认重置
const confirmReset = () => {
  store.resetProgress()
  showConfirm.value = false
  emit('close')
}

// 取消重置
const cancelReset = () => {
  showConfirm.value = false
}

// 关闭弹窗
const handleClose = () => {
  showConfirm.value = false
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click="handleClose">
        <div class="modal-content" @click.stop>
          <!-- 确认重置弹窗 -->
          <div v-if="showConfirm" class="confirm-dialog">
            <h3>确认重置</h3>
            <p>确定要清空所有学习进度吗？此操作不可撤销。</p>
            <div class="confirm-buttons">
              <button class="btn btn-cancel" @click="cancelReset">取消</button>
              <button class="btn btn-confirm" @click="confirmReset">确认重置</button>
            </div>
          </div>

          <!-- 设置内容 -->
          <div v-else class="settings-content">
            <div class="modal-header">
              <h2>设置</h2>
              <button class="close-btn" @click="handleClose">×</button>
            </div>

            <div class="stats-section">
              <h3>学习统计</h3>
              <div class="stat-item">
                <span class="stat-label">获得星星</span>
                <span class="stat-value">⭐ {{ totalStars }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">学习次数</span>
                <span class="stat-value">{{ totalLearnCounts }}</span>
              </div>
            </div>

            <div class="settings-section">
              <h3>播放设置</h3>
              
              <!-- 冷却时间设置 -->
              <div class="setting-item">
                <div class="setting-label">
                  <span>播放冷却时间</span>
                  <span class="setting-value">{{ cooldownTime }}秒</span>
                </div>
                <div class="setting-control">
                  <button 
                    class="control-btn" 
                    :disabled="cooldownTime <= 1"
                    @click="cooldownTime = Math.max(1, cooldownTime - 1)"
                  >
                    -
                  </button>
                  <input 
                    type="range" 
                    v-model="cooldownTime"
                    min="1" 
                    max="10" 
                    step="1"
                    class="slider"
                  />
                  <button 
                    class="control-btn" 
                    :disabled="cooldownTime >= 10"
                    @click="cooldownTime = Math.min(10, cooldownTime + 1)"
                  >
                    +
                  </button>
                </div>
                <p class="setting-desc">防止快速点击，建议 3-5 秒</p>
              </div>

              <!-- 声音图标设置 -->
              <div class="setting-item">
                <div class="setting-label">
                  <span>显示声音图标</span>
                  <span class="setting-value">{{ showSoundIcon ? '开启' : '关闭' }}</span>
                </div>
                <div class="setting-control">
                  <label class="toggle-switch">
                    <input 
                      type="checkbox" 
                      v-model="showSoundIcon"
                      class="toggle-input"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <p class="setting-desc">播放时在音标和单词旁显示动画图标</p>
              </div>
            </div>

            <div class="actions-section">
              <button class="reset-btn" @click="handleReset">
                <span class="btn-icon">🔄</span>
                重置学习进度
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
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
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: #999;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: #333;
}

.stats-section {
  padding: 20px;
}

.stats-section h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #666;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.stat-value {
  font-weight: bold;
  color: #333;
  font-size: 16px;
}

.settings-section {
  padding: 20px;
  border-top: 1px solid #eee;
}

.settings-section h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #666;
}

.setting-item {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.setting-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.setting-label span:first-child {
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.setting-value {
  color: #666;
  font-size: 14px;
}

.setting-control {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 8px;
}

.control-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.control-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #ccc;
  color: #ccc;
}

.slider {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(to right, #667eea, #764ba2);
  border-radius: 3px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 2px solid #667eea;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 2px solid #667eea;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* 开关样式 */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 34px;
  transition: .4s;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  border-radius: 50%;
  transition: .4s;
}

.toggle-input:checked + .toggle-slider {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(30px);
}

.setting-desc {
  margin: 0;
  color: #999;
  font-size: 12px;
  line-height: 1.4;
}

.actions-section {
  padding: 20px;
  border-top: 1px solid #eee;
}

.reset-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  background: #fff5f5;
  border: 2px solid #ff6b6b;
  border-radius: 12px;
  color: #ff6b6b;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.reset-btn:hover {
  background: #ff6b6b;
  color: white;
}

.btn-icon {
  font-size: 18px;
}

.confirm-dialog {
  padding: 30px;
  text-align: center;
}

.confirm-dialog h3 {
  margin: 0 0 15px 0;
  font-size: 20px;
  color: #333;
}

.confirm-dialog p {
  margin: 0 0 25px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.confirm-buttons {
  display: flex;
  gap: 15px;
}

.btn {
  flex: 1;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-cancel {
  background: #f0f0f0;
  color: #666;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-confirm {
  background: #ff6b6b;
  color: white;
}

.btn-confirm:hover {
  background: #ff5252;
}

/* Transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}
</style>