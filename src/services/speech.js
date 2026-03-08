// Speech service using Web Speech API
// Provides pronunciation for phonetic symbols
// 优化：优先使用示例单词发音，更准确自然

// 优化的语音配置
const SPEECH_CONFIG = {
  rate: 0.85,      // 稍慢一点，更清晰
  pitch: 1.0,      // 正常音调
  volume: 1.0,     // 最大音量
  pauseMs: 500     // 音标和单词之间的暂停
}

// IPA 符号到发音名称的映射（备用，当没有示例单词时使用）
const phoneticNameMap = {
  'i:': 'see',     // 用完整单词代替
  'ɪ': 'sit',
  'u:': 'blue',
  'ʊ': 'book',
  'ə:': 'bird',
  'ə': 'teacher',
  'ɑ:': 'car',
  'ʌ': 'cup',
  'ɔ:': 'door',
  'ɒ': 'hot',
  'ɜ:': 'girl',
  'e': 'bed',
  'eɪ': 'cake',
  'aɪ': 'time',
  'ɔɪ': 'boy',
  'əʊ': 'go',
  'aʊ': 'house',
  'ɪə': 'ear',
  'eə': 'air',
  'ʊə': 'tour',
  'θ': 'think',
  'ð': 'this',
  'ʃ': 'ship',
  'ʒ': 'television',
  'tʃ': 'chair',
  'dʒ': 'juice',
  'ŋ': 'sing',
  'tr': 'tree',
  'dr': 'drink',
  'ts': 'cats',
  'dz': 'beds'
}

class SpeechService {
  constructor() {
    this.synth = window.speechSynthesis
    this.voices = []
    this.initialized = false
    this.isPlaying = false
    this.preferredVoice = null

    // Load voices
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices()
    }
    
    // 初始化时加载语音
    this.loadVoices()
  }

  loadVoices() {
    this.voices = this.synth.getVoices()
    this.initialized = true
    // 选择最佳语音并缓存
    this.preferredVoice = this.getBestVoice()
    console.log('[Speech] 可用语音数量:', this.voices.length)
    console.log('[Speech] 已选择语音:', this.preferredVoice?.name, this.preferredVoice?.lang)
  }

  // Get the best English voice
  getBestVoice() {
    // 优先级排序：
    // 1. 高质量的美式英语 (Google US English)
    // 2. 其他美式英语
    // 3. 英式英语
    // 4. 任何英语
    
    // 首选：Google 美音（最自然）
    const googleUs = this.voices.find(v => 
      v.lang === 'en-US' && 
      (v.name.includes('Google') || v.name.includes('US'))
    )
    if (googleUs) {
      console.log('[Speech] 使用 Google 美音:', googleUs.name)
      return googleUs
    }

    // 次选：其他美音
    const usVoice = this.voices.find(v => v.lang === 'en-US')
    if (usVoice) {
      console.log('[Speech] 使用美式英语:', usVoice.name)
      return usVoice
    }

    // 再次：英音
    const ukVoice = this.voices.find(v => v.lang === 'en-GB')
    if (ukVoice) {
      console.log('[Speech] 使用英式英语:', ukVoice.name)
      return ukVoice
    }

    // 最后：任何英语
    const enVoice = this.voices.find(v => v.lang.startsWith('en'))
    if (enVoice) {
      console.log('[Speech] 使用英语:', enVoice.name)
      return enVoice
    }

    console.warn('[Speech] 未找到英语语音，使用默认语音')
    return this.voices[0]
  }

  // Speak a phonetic symbol - 优化版：优先使用示例单词
  speak(symbol, exampleWord, options = {}) {
    // 如果有示例单词，优先使用示例单词发音（更准确自然）
    const textToSpeak = exampleWord || phoneticNameMap[symbol] || symbol
    
    // 如果正在播放，先停止当前播放
    if (this.isPlaying) {
      this.synth.cancel()
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.lang = 'en-US'
    utterance.rate = options.rate || SPEECH_CONFIG.rate
    utterance.pitch = options.pitch || SPEECH_CONFIG.pitch
    utterance.volume = options.volume || SPEECH_CONFIG.volume

    // 使用预选择的最佳语音
    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice
    }

    this.isPlaying = true

    return new Promise((resolve, reject) => {
      utterance.onend = () => {
        this.isPlaying = false
        resolve()
      }
      utterance.onerror = (e) => {
        this.isPlaying = false
        // 忽略 'interrupted' 错误
        if (e.error === 'interrupted') {
          console.warn('Speech interrupted (expected)')
          resolve()
          return
        }
        console.warn('Speech synthesis error:', e)
        reject(e)
      }

      // 超时保护
      setTimeout(() => {
        if (this.isPlaying) {
          this.synth.cancel()
          this.isPlaying = false
        }
        resolve()
      }, 4000)

      this.synth.speak(utterance)
    })
  }

  // Speak a phonetic symbol using its example word
  speakWithExample(symbol, exampleWord, options = {}) {
    // If already playing, just continue; otherwise cancel previous speech
    if (!this.isPlaying) {
      this.synth.cancel()
    }

    const utterance = new SpeechSynthesisUtterance(exampleWord)
    utterance.lang = 'en-US'
    utterance.rate = options.rate || 1.0
    utterance.pitch = options.pitch || 1
    utterance.volume = options.volume || 1

    const voice = this.getBestVoice()
    if (voice) {
      utterance.voice = voice
    }

    this.isPlaying = true

    return new Promise((resolve, reject) => {
      utterance.onend = () => {
        this.isPlaying = false
        resolve()
      }
      utterance.onerror = (e) => {
        this.isPlaying = false
        // Ignore 'interrupted' error
        if (e.error === 'interrupted') {
          console.warn('Speech interrupted (expected)')
          resolve()
          return
        }
        console.warn('Speech error, trying phonetic name:', e)
        // Fallback to phonetic name
        const phoneticName = phoneticNameMap[symbol] || symbol
        this.speak(phoneticName, options).then(resolve).catch(reject)
      }

      setTimeout(() => {
        this.synth.cancel()
        this.isPlaying = false
        resolve()
      }, 3000)

      this.synth.speak(utterance)
    })
  }

  // Speak an example word
  speakWord(word, options = {}) {
    if (!word) {
      console.warn('[Speech] 没有提供单词')
      return Promise.resolve()
    }

    // 如果正在播放，先停止
    if (this.isPlaying) {
      this.synth.cancel()
    }

    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = 'en-US'
    utterance.rate = options.rate || SPEECH_CONFIG.rate
    utterance.pitch = options.pitch || SPEECH_CONFIG.pitch
    utterance.volume = options.volume || SPEECH_CONFIG.volume

    // 使用预选择的最佳语音
    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice
    }

    this.isPlaying = true

    return new Promise((resolve, reject) => {
      utterance.onend = () => {
        this.isPlaying = false
        resolve()
      }
      utterance.onerror = (e) => {
        this.isPlaying = false
        if (e.error === 'interrupted') {
          console.warn('Speech interrupted (expected)')
          resolve()
          return
        }
        console.warn('Speech error:', e)
        reject(e)
      }

      // 超时保护
      setTimeout(() => {
        if (this.isPlaying) {
          this.synth.cancel()
          this.isPlaying = false
        }
        resolve()
      }, 4000)

      this.synth.speak(utterance)
    })
  }

  // Speak phonetic symbol first, then example word with pause
  // 优化版：先读示例单词（更准确），然后读音标
  async speakPhoneticAndExample(symbol, exampleWord, options = {}) {
    // 先读示例单词（这是最标准的发音）
    await this.speakWord(exampleWord, options)

    // 暂停 500ms
    await new Promise(resolve => setTimeout(resolve, SPEECH_CONFIG.pauseMs))

    // 再读音标（用映射的单词）
    await this.speak(symbol, exampleWord, options)
  }

  // Check if browser supports speech synthesis
  isSupported() {
    return 'speechSynthesis' in window
  }

  // Cancel current speech
  cancel() {
    this.synth.cancel()
  }
}

// Export singleton instance
export const speechService = new SpeechService()