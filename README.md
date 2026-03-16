 一个面向儿童/学生的智能化 AI 学习辅助平台，采用沉浸式 3D 交互界面，提供多学科个性化辅导体验。

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan?style=flat-square&logo=tailwindcss)
![Three.js](https://img.shields.io/badge/Three.js-0.160-white?style=flat-square&logo=three.js)

## 功能特性

- **沉浸式 3D 体验** - 基于 Three.js 的交互式星球场景，提供独特的视觉体验
- **多角色学科助手** - 数学、语文、科学、英语等多领域 AI 辅导
- **智能语音交互** - 支持语音输入，自然的对话式学习体验
- **个性化学习路径** - 根据学习进度智能推荐内容
- **主题切换** - 多种视觉主题，适应不同学习场景

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **3D 渲染**: Three.js + React Three Fiber
- **动画**: Framer Motion + GSAP
- **图表**: Recharts
- **图标**: Lucide React

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/brainnnnnn/AgentOS_demo.git
cd AgentOS_demo

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看应用。

## 构建部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

本项目已配置 Vercel 自动部署，推送代码到 main 分支即可自动构建上线。

## 项目结构

```
app/
├── page.tsx          # 主页面
├── layout.tsx        # 根布局
├── globals.css       # 全局样式
├── orb-demo/         # 小球通知组件演示
└── popup-demo/       # 弹窗组件演示

components/
├── planet-experience.tsx   # 3D 星球场景
├── loading-screen.tsx      # 加载动画
├── voice-input.tsx         # 语音输入组件
├── dashboard-cards.tsx     # 功能卡片
├── orb-notification.tsx    # 小球通知
└── ui/                     # shadcn/ui 组件

lib/
├── themes.ts         # 主题配置
└── utils.ts          # 工具函数
```

## 浏览器支持

- Chrome 90+
- Safari 15+
- Firefox 88+
- Edge 90+

## License

MIT License

