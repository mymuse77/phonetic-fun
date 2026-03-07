// Speech service using Web Speech API
// Provides pronunciation for phonetic symbols

// IPA 符号到发音名称的映射（不带 Long/Short 前缀）
const phoneticNameMap = {
  'i:': 'ee',
  'ɪ': 'ih',
  'u:': 'oo',
  'ʊ': 'uh',
  'ə:': 'er',
  'ə': 'schwa',
  'ɑ:': 'ah',
  'ʌ': 'ah',
  'ɔ:': 'aw',
  'ɒ': 'ah',
  'ɜ:': 'er',
  'e': 'eh',
  'eɪ': 'ay',
  'aɪ': 'eye',
  'ɔɪ': 'oy',
  'əʊ': 'oh',
  'aʊ': 'ow',
  'ɪə': 'eer',
  'eə': 'air',
  'ʊə': 'oor',
  'θ': 'theta',
  'ð': 'eth',
  'ʃ': 'sh',
  'ʒ': 'zh',
  'tʃ': 'ch',
  'dʒ': 'j',
  'ŋ': 'ng',
  'tr': 'tr',
  'dr': 'dr',
  'ts': 'ts',
  'dz': 'dz'
}

class SpeechService {
  constructor() {
    this.synth = window.speechSynthesis
    this.voices = []
    this.initialized = false
    this.isPlaying = false

    // Load voices
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices()
    }
  }

  loadVoices() {
    this.voices = this.synth.getVoices()
    this.initialized = true
  }

  // Get the best English voice
  getBestVoice() {
    // Prefer US English voices
    const usVoice = this.voices.find(v => v.lang === 'en-US' && v.name.includes('Google'))
    if (usVoice) return usVoice

    const enVoice = this.voices.find(v => v.lang.startsWith('en-'))
    return enVoice || this.voices[0]
  }

  // Speak a phonetic symbol
  speak(symbol, options = {}) {
    // If already playing, just start new speech without cancelling
    if (this.isPlaying) {
      // Continue with new speech, previous one will be interrupted silently
    } else {
      // Cancel any ongoing speech only if not currently playing
      this.synth.cancel()
    }

    // Check if this is a special IPA symbol and get its pronunciation
    const phoneticName = phoneticNameMap[symbol]
    let textToSpeak = symbol

    if (phoneticName) {
      // Use the phonetic name or try the example word
      textToSpeak = phoneticName
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.lang = 'en-US'
    utterance.rate = options.rate || 1.0
    utterance.pitch = options.pitch || 1
    utterance.volume = options.volume || 1

    // Use best available voice
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
        // Ignore 'interrupted' error - it happens when cancel() is called
        if (e.error === 'interrupted') {
          console.warn('Speech interrupted (expected)')
          resolve() // Resolve instead of reject for interrupted
          return
        }
        console.warn('Speech synthesis error:', e)
        // Retry with example word if available
        if (options.example) {
          this.speakWord(options.example, options).then(resolve).catch(reject)
        } else {
          reject(e)
        }
      }

      // Fallback timeout
      setTimeout(() => {
        this.synth.cancel()
        this.isPlaying = false
        resolve()
      }, 3000)

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
    // If already playing, just continue; otherwise cancel previous speech
    if (!this.isPlaying) {
      this.synth.cancel()
    }

    const utterance = new SpeechSynthesisUtterance(word)
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
        reject(e)
      }

      setTimeout(() => {
        this.synth.cancel()
        this.isPlaying = false
        resolve()
      }, 3000)

      this.synth.speak(utterance)
    })
  }

  // Speak phonetic symbol first, then example word with pause
  async speakPhoneticAndExample(symbol, exampleWord, options = {}) {
    // First, speak the phonetic symbol name
    await this.speak(symbol, options)

    // Pause for 0.3 seconds
    await new Promise(resolve => setTimeout(resolve, 300))

    // Then speak the example word
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