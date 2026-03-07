// 48个国际音标数据
export const phonetics = [
  // 元音 - 单元音 (12个)
  { symbol: 'i:', name: '长元音 i', category: 'vowel', type: 'monophthong', example: 'see', exampleZh: '看', audio: '/audio/i_.mp3' },
  { symbol: 'ɪ', name: '短元音 i', category: 'vowel', type: 'monophthong', example: 'sit', exampleZh: '坐', audio: '/audio/I.mp3' },
  { symbol: 'u:', name: '长元音 u', category: 'vowel', type: 'monophthong', example: 'blue', exampleZh: '蓝色', audio: '/audio/u_.mp3' },
  { symbol: 'ʊ', name: '短元音 u', category: 'vowel', type: 'monophthong', example: 'book', exampleZh: '书', audio: '/audio/U.mp3' },
  { symbol: 'ə:', name: '长元音 er', category: 'vowel', type: 'monophthong', example: 'bird', exampleZh: '鸟', audio: '/audio/3_.mp3' },
  { symbol: 'ə', name: '短元音 er', category: 'vowel', type: 'monophthong', example: 'teacher', exampleZh: '老师', audio: '/audio/@.mp3' },
  { symbol: 'ɑ:', name: '长元音 a', category: 'vowel', type: 'monophthong', example: 'car', exampleZh: '汽车', audio: '/audio/a_.mp3' },
  { symbol: 'ʌ', name: '短元音 a', category: 'vowel', type: 'monophthong', example: 'cup', exampleZh: '杯子', audio: '/audio/A.mp3' },
  { symbol: 'ɔ:', name: '长元音 o', category: 'vowel', type: 'monophthong', example: 'door', exampleZh: '门', audio: '/audio/O_.mp3' },
  { symbol: 'ɒ', name: '短元音 o', category: 'vowel', type: 'monophthong', example: 'hot', exampleZh: '热的', audio: '/audio/Q.mp3' },
  { symbol: 'ɜ:', name: '长元音 e', category: 'vowel', type: 'monophthong', example: 'girl', exampleZh: '女孩', audio: '/audio/3_.mp3' },
  { symbol: 'e', name: '短元音 e', category: 'vowel', type: 'monophthong', example: 'bed', exampleZh: '床', audio: '/audio/e.mp3' },

  // 元音 - 双元音 (8个)
  { symbol: 'eɪ', name: '双元音 ei', category: 'vowel', type: 'diphthong', example: 'cake', exampleZh: '蛋糕', audio: '/audio/eI.mp3' },
  { symbol: 'aɪ', name: '双元音 ai', category: 'vowel', type: 'diphthong', example: 'time', exampleZh: '时间', audio: '/audio/aI.mp3' },
  { symbol: 'ɔɪ', name: '双元音 oi', category: 'vowel', type: 'diphthong', example: 'boy', exampleZh: '男孩', audio: '/audio/OI.mp3' },
  { symbol: 'əʊ', name: '双元音 ou', category: 'vowel', type: 'diphthong', example: 'go', exampleZh: '去', audio: '/audio/@U.mp3' },
  { symbol: 'aʊ', name: '双元音 au', category: 'vowel', type: 'diphthong', example: 'house', exampleZh: '房子', audio: '/audio/aU.mp3' },
  { symbol: 'ɪə', name: '双元音 ie', category: 'vowel', type: 'diphthong', example: 'ear', exampleZh: '耳朵', audio: '/audio/I@.mp3' },
  { symbol: 'eə', name: '双元音 ea', category: 'vowel', type: 'diphthong', example: 'air', exampleZh: '空气', audio: '/audio/E@.mp3' },
  { symbol: 'ʊə', name: '双元音 ue', category: 'vowel', type: 'diphthong', example: 'tour', exampleZh: '旅游', audio: '/audio/U@.mp3' },

  // 辅音 - 爆破音 (6个)
  { symbol: 'p', name: '清辅音 p', category: 'consonant', type: 'plosive', example: 'pen', exampleZh: '钢笔', audio: '/audio/p.mp3' },
  { symbol: 'b', name: '浊辅音 b', category: 'consonant', type: 'plosive', example: 'bag', exampleZh: '袋子', audio: '/audio/b.mp3' },
  { symbol: 't', name: '清辅音 t', category: 'consonant', type: 'plosive', example: 'tea', exampleZh: '茶', audio: '/audio/t.mp3' },
  { symbol: 'd', name: '浊辅音 d', category: 'consonant', type: 'plosive', example: 'dog', exampleZh: '狗', audio: '/audio/d.mp3' },
  { symbol: 'k', name: '清辅音 k', category: 'consonant', type: 'plosive', example: 'key', exampleZh: '钥匙', audio: '/audio/k.mp3' },
  { symbol: 'g', name: '浊辅音 g', category: 'consonant', type: 'plosive', example: 'girl', exampleZh: '女孩', audio: '/audio/g.mp3' },

  // 辅音 - 摩擦音 (10个)
  { symbol: 'f', name: '清辅音 f', category: 'consonant', type: 'fricative', example: 'fish', exampleZh: '鱼', audio: '/audio/f.mp3' },
  { symbol: 'v', name: '浊辅音 v', category: 'consonant', type: 'fricative', example: 'van', exampleZh: '货车', audio: '/audio/v.mp3' },
  { symbol: 'θ', name: '清辅音 th', category: 'consonant', type: 'fricative', example: 'think', exampleZh: '想', audio: '/audio/T.mp3' },
  { symbol: 'ð', name: '浊辅音 th', category: 'consonant', type: 'fricative', example: 'this', exampleZh: '这个', audio: '/audio/D.mp3' },
  { symbol: 's', name: '清辅音 s', category: 'consonant', type: 'fricative', example: 'sun', exampleZh: '太阳', audio: '/audio/s.mp3' },
  { symbol: 'z', name: '浊辅音 z', category: 'consonant', type: 'fricative', example: 'zoo', exampleZh: '动物园', audio: '/audio/z.mp3' },
  { symbol: 'ʃ', name: '清辅音 sh', category: 'consonant', type: 'fricative', example: 'ship', exampleZh: '船', audio: '/audio/S.mp3' },
  { symbol: 'ʒ', name: '浊辅音 zh', category: 'consonant', type: 'fricative', example: 'television', exampleZh: '电视', audio: '/audio/Z.mp3' },
  { symbol: 'h', name: '清辅音 h', category: 'consonant', type: 'fricative', example: 'hand', exampleZh: '手', audio: '/audio/h.mp3' },
  { symbol: 'r', name: '浊辅音 r', category: 'consonant', type: 'fricative', example: 'red', exampleZh: '红色', audio: '/audio/r.mp3' },

  // 辅音 - 破擦音 (6个)
  { symbol: 'tʃ', name: '清辅音 ch', category: 'consonant', type: 'affricate', example: 'chair', exampleZh: '椅子', audio: '/audio/tS.mp3' },
  { symbol: 'dʒ', name: '浊辅音 j', category: 'consonant', type: 'affricate', example: 'juice', exampleZh: '果汁', audio: '/audio/dZ.mp3' },
  { symbol: 'tr', name: '清辅音 tr', category: 'consonant', type: 'affricate', example: 'tree', exampleZh: '树', audio: '/audio/tr.mp3' },
  { symbol: 'dr', name: '浊辅音 dr', category: 'consonant', type: 'affricate', example: 'drink', exampleZh: '喝', audio: '/audio/dr.mp3' },
  { symbol: 'ts', name: '清辅音 ts', category: 'consonant', type: 'affricate', example: 'cats', exampleZh: '猫(复数)', audio: '/audio/ts.mp3' },
  { symbol: 'dz', name: '浊辅音 dz', category: 'consonant', type: 'affricate', example: 'beds', exampleZh: '床(复数)', audio: '/audio/dz.mp3' },

  // 辅音 - 鼻音 (3个)
  { symbol: 'm', name: '鼻音 m', category: 'consonant', type: 'nasal', example: 'moon', exampleZh: '月亮', audio: '/audio/m.mp3' },
  { symbol: 'n', name: '鼻音 n', category: 'consonant', type: 'nasal', example: 'nose', exampleZh: '鼻子', audio: '/audio/n.mp3' },
  { symbol: 'ŋ', name: '鼻音 ng', category: 'consonant', type: 'nasal', example: 'sing', exampleZh: '唱', audio: '/audio/N.mp3' },

  // 辅音 - 舌侧音 (1个)
  { symbol: 'l', name: '舌侧音 l', category: 'consonant', type: 'lateral', example: 'leg', exampleZh: '腿', audio: '/audio/l.mp3' },

  // 辅音 - 半元音 (2个)
  { symbol: 'w', name: '半元音 w', category: 'consonant', type: 'semi-vowel', example: 'water', exampleZh: '水', audio: '/audio/w.mp3' },
  { symbol: 'j', name: '半元音 y', category: 'consonant', type: 'semi-vowel', example: 'yes', exampleZh: '是的', audio: '/audio/j.mp3' }
]

// 分类辅助函数
export const getCategories = () => [
  { id: 'vowel', name: '元音', color: '#FF6B6B' },
  { id: 'consonant', name: '辅音', color: '#4ECDC4' }
]

export const getVowelTypes = () => [
  { id: 'monophthong', name: '单元音' },
  { id: 'diphthong', name: '双元音' }
]

export const getConsonantTypes = () => [
  { id: 'plosive', name: '爆破音' },
  { id: 'fricative', name: '摩擦音' },
  { id: 'affricate', name: '破擦音' },
  { id: 'nasal', name: '鼻音' },
  { id: 'lateral', name: '舌侧音' },
  { id: 'semi-vowel', name: '半元音' }
]