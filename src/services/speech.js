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

// IPA 符号到发音的映射
// 策略：使用能准确发出该音标的英文单词或字母组合
const phoneticNameMap = {
  // 元音 - 长元音
  'i:': 'ee',      // 字母组合 ee 发 /i:/ 音
  'u:': 'oo',      // 字母组合 oo 发 /u:/ 音
  'ɑ:': 'ar',      // 字母组合 ar 发 /ɑ:/ 音
  'ɔ:': 'or',      // 字母组合 or 发 /ɔ:/ 音
  'ɜ:': 'er',      // 字母组合 er 发 /ɜ:/ 音
  'ə:': 'er',      // 同 ɜ:
  
  // 元音 - 短元音
  'ɪ': 'ih',       // 短 i 音
  'ʊ': 'uh',       // 短 u 音
  'ʌ': 'uh',       // 短 a 音
  'ɒ': 'ah',       // 短 o 音
  'ə': 'uh',       // 短 er 音
  'e': 'eh',       // 短 e 音
  
  // 元音 - 双元音
  'eɪ': 'ay',      // 字母组合 ay
  'aɪ': 'eye',     // 字母 i
  'ɔɪ': 'oy',      // 字母组合 oy
  'əʊ': 'oh',      // 字母 o
  'aʊ': 'ow',      // 字母组合 ow
  'ɪə': 'ear',     // 字母组合 ear
  'eə': 'air',     // 字母组合 air
  'ʊə': 'oor',     // 字母组合 oor
  
  // 辅音 - 摩擦音
  'θ': 'th',       // 清辅音 th
  'ð': 'th',       // 浊辅音 th
  'ʃ': 'sh',       // 字母组合 sh
  'ʒ': 'zh',       // 字母组合 zh
  'r': 'r',        // 字母 r
  'h': 'h',        // 字母 h
  'f': 'f',        // 字母 f
  'v': 'v',        // 字母 v
  's': 's',        // 字母 s
  'z': 'z',        // 字母 z
  
  // 辅音 - 爆破音
  'p': 'p',        // 字母 p
  'b': 'b',        // 字母 b
  't': 't',        // 字母 t
  'd': 'd',        // 字母 d
  'k': 'k',        // 字母 k
  'g': 'g',        // 字母 g
  
  // 辅音 - 破擦音
  'tʃ': 'ch',      // 字母组合 ch
  'dʒ': 'j',       // 字母 j
  'tr': 'tr',      // 字母组合 tr
  'dr': 'dr',      // 字母组合 dr
  'ts': 'ts',      // 字母组合 ts
  'dz': 'dz',      // 字母组合 dz
  
  // 辅音 - 鼻音
  'm': 'm',        // 字母 m
  'n': 'n',        // 字母 n
  'ŋ': 'ng',       // 字母组合 ng
  
  // 辅音 - 舌侧音
  'l': 'l',        // 字母 l
  
  // 辅音 - 半元音
  'w': 'w',        // 字母 w
  'j': 'y'         // 字母 y
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

  // Speak a phonetic symbol - 优化版：使用音标映射发音
  speak(symbol, exampleWord, options = {}) {
    // 使用音标映射的发音（不是示例单词）
    const phoneticName = phoneticNameMap[symbol]
    const textToSpeak = phoneticName || symbol
    
    // 如果正在播放，先停止当前播放
    if (this.isPlaying) {
      this.synth.cancel()
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.lang = 'en-US'
    // 读音标时用正常语速，不减速
    utterance.rate = 1.0
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
  // 保持原有逻辑：先读音标，再读单词
  async speakPhoneticAndExample(symbol, exampleWord, options = {}) {
    // 1. 先读音标（使用优化后的发音映射）
    await this.speak(symbol, exampleWord, options)

    // 2. 暂停 500ms
    await new Promise(resolve => setTimeout(resolve, SPEECH_CONFIG.pauseMs))

    // 3. 再读示例单词
    await this.speakWord(exampleWord, options)
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