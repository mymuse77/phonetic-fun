// 徽章数据定义
export const badges = [
  {
    id: 'beginner',
    name: '初学者',
    description: '完成第一个音标学习',
    icon: '🌟',
    condition: 'learn_1',
    requirement: 1
  },
  {
    id: 'phonetic_master',
    name: '音标小达',
    description: '学习 10 个音标',
    icon: '🔤',
    condition: 'learn_10',
    requirement: 10
  },
  {
    id: 'vowel_master',
    name: '元音大师',
    description: '掌握全部 20 个元音',
    icon: '🎯',
    condition: 'master_vowels',
    requirement: 20
  },
  {
    id: 'consonant_master',
    name: '辅音高手',
    description: '掌握全部 28 个辅音',
    icon: '🔧',
    condition: 'master_consonants',
    requirement: 28
  },
  {
    id: 'all_master',
    name: '全能选手',
    description: '掌握全部 48 个音标',
    icon: '🏆',
    condition: 'master_all',
    requirement: 48
  },
  {
    id: 'game_pro',
    name: '游戏达人',
    description: '游戏连续答对 5 次',
    icon: '🎮',
    condition: 'streak_5',
    requirement: 5
  }
]

// 获取徽章通过ID
export const getBadgeById = (id) => badges.find(b => b.id === id)