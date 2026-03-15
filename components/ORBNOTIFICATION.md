# OrbNotification 组件

一个可复用的"小球通知"组件，实现"收到新消息 → 飞入动画 → 点击展开"的交互效果。

## 效果预览

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    ┌──────────────┐                         │
│                    │   🌟 新消息   │ ← 提示文字 (可选)        │
│                    └──────┬───────┘                         │
│                          │                                  │
│    ┌─────────────────────┼─────────────────────┐           │
│    │                     ▼                     │           │
│    │              ┌────────────┐               │           │
│    │              │            │               │           │
│    │              │    🤖     │ ← 脉动小球      │           │
│    │              │            │               │           │
│    │              └────────────┘               │           │
│    │                                           │           │
│    └───────────────────────────────────────────┘           │
│                          │                                  │
│           点击后展开 ↓                                      │
│                          │                                  │
│    ┌───────────────────────────────────────────┐           │
│    │  ┌────┐ 小思助手                    ✕    │           │
│    │  │ 🤖 │ 新消息                          │           │
│    │  └────┘                                   │           │
│    │ ───────────────────────────────────────── │           │
│    │                                           │           │
│    │  你好~航航                                │           │
│    │  需要我帮你做些什么呢？                   │           │
│    │                                           │           │
│    │  [练口语]  [写作文]  [数学辅导]           │           │
│    │                                           │           │
│    └───────────────────────────────────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 基础用法

```tsx
import { useState } from "react"
import OrbNotification from "@/components/orb-notification"

export default function MyPage() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>显示小球</button>

      <OrbNotification
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="小思助手"
        subtitle="新消息"
        orbHint="点击查看"
      >
        <p>这里是展开后的内容</p>
      </OrbNotification>
    </div>
  )
}
```

## Props 详解

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `isOpen` | `boolean` | 必填 | 是否显示组件 |
| `onClose` | `() => void` | 必填 | 关闭回调 |
| `children` | `ReactNode` | 必填 | 展开后的内容 |
| `colors` | `OrbColors` | 橙红色主题 | 颜色配置 |
| `size` | `number` | 64 | 小球大小（像素） |
| `position` | `OrbPosition` | 右下角 | 小球位置 |
| `autoExpand` | `boolean` | false | 是否自动展开 |
| `autoExpandDelay` | `number` | 2000 | 自动展开延迟（毫秒） |
| `enterDirection` | `"bottom" \| "right" \| "left" \| "top"` | "bottom" | 飞入方向 |
| `title` | `string` | "小思助手" | 展开后的标题 |
| `subtitle` | `string` | - | 展开后的副标题 |
| `orbIcon` | `ReactNode` | 消息图标 | 自定义小球图标 |
| `orbHint` | `string` | - | 小球提示文字 |
| `showPulse` | `boolean` | true | 是否显示脉动光环 |
| `maxWidth` | `number` | 480 | 展开后最大宽度 |
| `maxHeight` | `number` | 600 | 展开后最大高度 |
| `onOrbClick` | `() => void` | - | 点击小球回调 |
| `onExpandComplete` | `() => void` | - | 展开完成回调 |
| `onCollapseComplete` | `() => void` | - | 收起完成回调 |

## 预设主题

```tsx
import OrbNotification, { ORB_THEMES } from "@/components/orb-notification"

// 使用预设主题
<OrbNotification
  colors={ORB_THEMES.sunset}      // 橙红色
  colors={ORB_THEMES.cosmicBlue}  // 青色
  colors={ORB_THEMES.violet}      // 紫色
  colors={ORB_THEMES.emerald}     // 绿色
  colors={ORB_THEMES.flamingo}    // 粉色
  colors={ORB_THEMES.scarlet}     // 红色
>
```

## 预设位置

```tsx
import OrbNotification, { ORB_POSITIONS } from "@/components/orb-notification"

// 使用预设位置
<OrbNotification
  position={ORB_POSITIONS.bottomRight}  // 右下角（默认）
  position={ORB_POSITIONS.bottomLeft}   // 左下角
  position={ORB_POSITIONS.topRight}     // 右上角
  position={ORB_POSITIONS.topLeft}      // 左上角
>
```

## 完整示例

### 场景1：新消息通知（自动展开）

```tsx
import { useEffect, useState } from "react"
import OrbNotification, { ORB_THEMES } from "@/components/orb-notification"
import { Gift } from "lucide-react"

export default function GiftNotification() {
  const [show, setShow] = useState(false)

  // 页面加载3秒后显示
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <OrbNotification
      isOpen={show}
      onClose={() => setShow(false)}
      colors={ORB_THEMES.flamingo}
      title="新礼物！"
      subtitle="你收到了一份惊喜"
      orbIcon={<Gift size={32} color="white" />}
      orbHint="打开礼物"
      autoExpand
      autoExpandDelay={1500}
    >
      <div className="text-center py-6">
        <div className="text-6xl mb-4">🎁</div>
        <h4 className="text-white font-bold">恭喜获得学习礼包！</h4>
      </div>
    </OrbNotification>
  )
}
```

### 场景2：AI助手（点击展开）

```tsx
import { useState } from "react"
import OrbNotification, { ORB_THEMES } from "@/components/orb-notification"
import { VoiceInput } from "@/components/voice-input"
import { Bot } from "lucide-react"

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")

  return (
    <OrbNotification
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      colors={ORB_THEMES.violet}
      title="AI 助手"
      subtitle="智能问答模式"
      orbIcon={<Bot size={28} />}
      orbHint="AI 就绪"
      maxWidth={520}
    >
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
            <Bot size={20} color="white" />
          </div>
          <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
            <p className="text-white/90">你好！有什么可以帮你的？</p>
          </div>
        </div>

        <VoiceInput
          value={input}
          onChange={setInput}
          onSend={() => console.log(input)}
          accentColor="#9C27B0"
        />
      </div>
    </OrbNotification>
  )
}
```

### 场景3：学习助手（集成 Dashboard）

```tsx
import { useState } from "react"
import OrbNotification, { ORB_THEMES } from "@/components/orb-notification"
import { DashboardCards } from "@/components/dashboard-cards"
import { VoiceInput } from "@/components/voice-input"
import { Sparkles } from "lucide-react"

export default function LearningAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")

  return (
    <OrbNotification
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      colors={ORB_THEMES.emerald}
      title="小思学习助手"
      subtitle="数学辅导模式"
      orbIcon={<Sparkles size={24} />}
      orbHint="新消息"
      maxWidth={520}
      maxHeight={700}
    >
      <div className="space-y-4">
        {/* 欢迎语 */}
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
            <Sparkles size={20} color="white" />
          </div>
          <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
            <p className="text-white/90">你好~航航</p>
            <p className="text-white/60 text-sm mt-1">准备好开始今天的学习了吗？</p>
          </div>
        </div>

        {/* 学习面板 */}
        <DashboardCards
          accentColor="#4CAF50"
          mode="school-sync"
          onSuggestionClick={(action) => console.log(action)}
        />

        {/* 输入框 */}
        <VoiceInput
          value={input}
          onChange={setInput}
          onSend={() => console.log(input)}
          accentColor="#4CAF50"
          placeholder="问我任何问题..."
        />
      </div>
    </OrbNotification>
  )
}
```

## 自定义主题

```tsx
const myTheme = {
  primary: "#FF7621",     // 主色调
  glow: "#FFCD43",        // 发光色
  secondary: "#FF9800",   // 次要色/渐变终点
  border: "rgba(255, 118, 33, 0.5)",  // 边框色
}

<OrbNotification colors={myTheme}>
  {/* 内容 */}
</OrbNotification>
```

## 动画流程

1. **飞入阶段** (0-600ms)
   - 小球从屏幕外飞入（方向可配置）
   - 使用 spring 动画，带有弹性效果

2. **等待阶段**
   - 小球悬浮在固定位置
   - 显示脉动光环（可关闭）
   - 显示提示文字（可选）
   - 内部图标轻微摆动

3. **展开阶段** (点击或自动)
   - 小球放大并变形为圆角矩形
   - 渐变边框光效显现
   - 标题和内容依次淡入

4. **关闭阶段**
   - 窗口收缩回小球
   - 小球缩小消失

## 注意事项

1. 组件使用 `position: fixed`，会固定在视口指定位置
2. 小球层级为 `z-index: 9999`，确保在最上层
3. 展开后点击外部不会自动关闭，需点击关闭按钮
4. 支持深色背景，建议在深色页面使用
