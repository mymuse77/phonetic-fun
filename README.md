# Phonetic Fun - 趣味音标学习应用

![Vue 3](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-FFD700?style=for-the-badge&logo=pinia&logoColor=black)
![Web Speech API](https://img.shields.io/badge/Web%20Speech%20API-4285F4?style=for-the-badge&logo=google&logoColor=white)

专为 K-12 学生设计的英语音标学习 Web 应用，通过游戏化学习帮助孩子掌握 48 个国际音标。

## ✨ 功能特性

### 🎵 音标学习
- **48 个国际音标**：包含 20 个元音和 28 个辅音
- **发音练习**：点击卡片听发音，学习 3 次后获得星星
- **分段播放**：先读音标，再读单词，声音图标动态显示
- **进度保存**：学习进度自动保存到本地存储

### 🎮 游戏模式
- **音标配对游戏**：听音标选择正确答案
- **三种难度**：简单（2 选项）、普通（4 选项）、困难（6 选项）
- **连击奖励**：连续答对获得额外分数
- **键盘支持**：使用 ↑↓ 键选择难度，Enter 确认

### 🏆 成就系统
- **星星收集**：每个音标学习 3 次获得金色星星
- **徽章系统**：6 个成就徽章，完成特定目标解锁
- **进度追踪**：实时显示学习进度和星星总数

### ⚙️ 个性化设置
- **冷却时间**：可配置 1-10 秒，防止快速点击
- **声音图标**：可开启/关闭播放时的动态图标
- **重置功能**：一键重置所有学习进度

### 📱 设备支持
- **响应式设计**：完美适配桌面、平板和手机
- **iPad 优化**：专门为平板设备优化界面
- **离线使用**：本地部署，无需网络连接

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn
- Nginx（用于生产部署）

### 安装步骤
```bash
# 克隆项目
git clone https://github.com/mymuse77/phonetic-fun.git
cd phonetic-fun

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 访问地址
- 开发环境：http://localhost:5173
- 生产环境：http://localhost:8086

## 📁 项目结构

```
phonetic-fun/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # Vue 组件
│   │   ├── PhoneticCard.vue      # 音标卡片组件
│   │   ├── PhoneticList.vue      # 音标列表组件
│   │   ├── PhoneticMatchGame.vue # 音标配对游戏
│   │   ├── BadgeItem.vue         # 徽章组件
│   │   ├── SettingsModal.vue     # 设置弹窗
│   │   └── ...
│   ├── data/            # 应用数据
│   │   ├── phonetics.js  # 48 个音标数据
│   │   └── badges.js     # 6 个徽章数据
│   ├── services/        # 服务层
│   │   └── speech.js     # Web Speech API 语音服务
│   ├── stores/          # Pinia 状态管理
│   │   ├── phonetic.js   # 音标学习状态
│   │   ├── game.js       # 游戏状态
│   │   ├── badge.js      # 徽章状态
│   │   └── player.js     # 播放器状态（冷却时间、声音图标）
│   ├── views/           # 页面视图
│   ├── App.vue          # 根组件
│   └── main.js          # 入口文件
├── public/              # 公共资源
├── index.html           # HTML 模板
├── package.json         # 项目配置
├── vite.config.js       # Vite 配置
├── nginx.conf           # Nginx 部署配置
└── SPEC.md              # 项目规格文档
```

## 🎮 使用说明

### 学习模式
1. **选择分类**：点击"元音"或"辅音"进入学习页面
2. **听发音**：点击音标卡片，先读音标，再读单词
3. **收集星星**：每个音标学习 3 次后获得金色星星
4. **查看进度**：首页显示总进度和星星数量

### 游戏模式
1. **进入游戏**：点击"音标配对"卡片
2. **选择难度**：使用键盘 ↑↓ 键选择，Enter 确认
3. **开始游戏**：听音标发音，从选项中选择正确答案
4. **查看得分**：完成 10 题后显示总分和连击次数

### 成就系统
1. **查看徽章**：点击"成就徽章"卡片
2. **解锁条件**：
   - 🥇 音标大师：学习所有 48 个音标
   - 🥈 游戏高手：在游戏中获得 100 分
   - 🥉 连击之王：游戏中连续答对 5 题
   - 🏅 星星收集者：收集 20 颗星星
   - 🎯 完美发音：10 个音标达到 3/3 学习
   - ⭐ 学习达人：总学习次数达到 50 次

### 设置选项
1. **打开设置**：点击右上角 ⚙️ 图标
2. **调整冷却时间**：1-10 秒，防止快速点击
3. **声音图标**：开启/关闭播放时的动态图标
4. **重置进度**：清空所有学习数据（谨慎使用）

## 🌐 部署

### Nginx 部署
```bash
# 构建项目
npm run build

# 复制到 Nginx 目录
sudo mkdir -p /var/www/phonetic-fun
sudo cp -r dist/* /var/www/phonetic-fun/

# 配置 Nginx
sudo cp nginx.conf /etc/nginx/sites-available/phonetic-fun
sudo ln -sf /etc/nginx/sites-available/phonetic-fun /etc/nginx/sites-enabled/

# 重新加载 Nginx
sudo systemctl reload nginx
```

### 访问生产环境
```
http://localhost:8086
```

## 🛠️ 技术栈

| 技术 | 用途 | 版本 |
|------|------|------|
| **Vue 3** | 前端框架 | 3.4+ |
| **Vite** | 构建工具 | 5.4+ |
| **Pinia** | 状态管理 | 2.1+ |
| **Web Speech API** | 语音合成 | 浏览器原生 |
| **CSS3** | 样式和动画 | - |
| **Nginx** | Web 服务器 | 1.18+ |

## 📝 开发说明

### 添加新音标
编辑 `src/data/phonetics.js`，按照现有格式添加：
```javascript
{
  symbol: '/新音标/',
  name: '音标名称',
  example: '示例单词',
  exampleZh: '中文翻译',
  category: 'vowels'  // 或 'consonants'
}
```

### 修改冷却时间
默认 5 秒，可在设置中调整，或直接修改 `src/stores/player.js`：
```javascript
const cooldownTime = ref(parseInt(localStorage.getItem('phoneticCooldown') || '5'))
```

### 自定义徽章
编辑 `src/data/badges.js`，添加新的徽章条件：
```javascript
{
  id: 'new-badge',
  name: '新徽章',
  description: '徽章描述',
  icon: '🎖️',
  condition: (store) => {
    // 解锁条件
    return store.totalStars >= 30
  }
}
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👨‍💻 作者

- **GitHub**: [@mymuse77](https://github.com/mymuse77)
- **项目地址**: https://github.com/mymuse77/phonetic-fun

## 🙏 致谢

- 感谢所有测试用户提供的宝贵反馈
- 感谢 Vue 3 和 Vite 团队提供的优秀框架
- 感谢 Web Speech API 让浏览器语音合成成为可能

---

**让音标学习变得有趣！** 🎵✨