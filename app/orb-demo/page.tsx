"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import OrbNotification, {
  ORB_THEMES,
  ORB_POSITIONS,
} from "@/components/orb-notification"
import { VoiceInput } from "@/components/voice-input"
import { DashboardCards } from "@/components/dashboard-cards"
import { Bot, MessageSquare, Bell, Gift, Star, Zap } from "lucide-react"

export default function OrbDemoPage() {
  // 不同示例的状态
  const [basicOpen, setBasicOpen] = useState(false)
  const [autoOpen, setAutoOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const [customOpen, setCustomOpen] = useState(false)
  const [giftOpen, setGiftOpen] = useState(false)

  const [input, setInput] = useState("")
  const [activeTheme, setActiveTheme] = useState<keyof typeof ORB_THEMES>("sunset")

  return (
    <div className="min-h-screen bg-black p-8">
      <h1 className="text-3xl font-bold text-white mb-2">OrbNotification 组件演示</h1>
      <p className="text-white/60 mb-8">可复用的小球通知组件 - 飞入、脉动、展开效果</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ===== 基础用法 ===== */}
        <DemoCard
          title="基础用法"
          description="点击小球展开聊天窗口，再次点击关闭"
        >
          <Button
            onClick={() => setBasicOpen(true)}
            className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/50"
          >
            打开基础小球
          </Button>
        </DemoCard>

        {/* ===== 自动展开 ===== */}
        <DemoCard
          title="自动展开"
          description="2秒后自动展开，无需点击"
        >
          <Button
            onClick={() => setAutoOpen(true)}
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50"
          >
            打开自动展开
          </Button>
        </DemoCard>

        {/* ===== 完整聊天界面 ===== */}
        <DemoCard
          title="完整聊天界面"
          description="集成 VoiceInput 和 DashboardCards"
        >
          <Button
            onClick={() => setChatOpen(true)}
            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50"
          >
            打开聊天界面
          </Button>
        </DemoCard>

        {/* ===== 多主题切换 ===== */}
        <DemoCard
          title="多主题切换"
          description="点击不同按钮切换主题色"
        >
          <div className="flex flex-wrap gap-2">
            {Object.entries(ORB_THEMES).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTheme(key as keyof typeof ORB_THEMES)
                  setThemeOpen(true)
                }}
                className="w-8 h-8 rounded-full border-2 border-white/20 hover:scale-110 transition-transform"
                style={{ background: theme.primary }}
                title={key}
              />
            ))}
          </div>
        </DemoCard>

        {/* ===== 自定义图标 ===== */}
        <DemoCard
          title="自定义图标"
          description="使用不同的图标和提示文字"
        >
          <Button
            onClick={() => setCustomOpen(true)}
            className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/50"
          >
            打开自定义图标
          </Button>
        </DemoCard>

        {/* ===== 礼物/奖励场景 ===== */}
        <DemoCard
          title="礼物/奖励场景"
          description="新消息、奖励、通知等场景"
        >
          <Button
            onClick={() => setGiftOpen(true)}
            className="bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 border border-pink-500/50"
          >
            打开礼物通知
          </Button>
        </DemoCard>
      </div>

      {/* ===== 组件实例 ===== */}

      {/* 1. 基础用法 */}
      <OrbNotification
        isOpen={basicOpen}
        onClose={() => setBasicOpen(false)}
        title="小思助手"
        subtitle="随时为你解答"
        orbHint="点击打开"
      >
        <div className="space-y-4">
          <p className="text-white/80">你好！我是小思，有什么可以帮你的吗？</p>
          <div className="flex gap-2 flex-wrap">
            {["讲个故事", "数学题", "英语单词", "历史知识"].map((item) => (
              <button
                key={item}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-sm transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </OrbNotification>

      {/* 2. 自动展开 */}
      <OrbNotification
        isOpen={autoOpen}
        onClose={() => setAutoOpen(false)}
        colors={ORB_THEMES.cosmicBlue}
        title="自动通知"
        subtitle="2秒后自动打开"
        autoExpand
        autoExpandDelay={2000}
        orbHint="即将打开..."
      >
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎉</div>
          <h4 className="text-white font-semibold mb-2">恭喜获得新成就！</h4>
          <p className="text-white/60 text-sm">连续学习7天，获得"学习达人"称号</p>
        </div>
      </OrbNotification>

      {/* 3. 完整聊天界面 */}
      <OrbNotification
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        colors={ORB_THEMES.emerald}
        title="小思学习助手"
        subtitle="数学辅导模式"
        maxWidth={520}
        maxHeight={700}
        orbIcon={<Bot size={28} color="white" />}
        orbHint="新消息"
      >
        <div className="space-y-4">
          {/* 欢迎语 */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center flex-shrink-0">
              <Bot size={20} color="white" />
            </div>
            <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
              <p className="text-white/90">你好~航航</p>
              <p className="text-white/60 text-sm mt-1">准备好开始今天的学习了吗？</p>
            </div>
          </div>

          {/* Dashboard 面板 */}
          <DashboardCards
            accentColor="#4CAF50"
            mode="school-sync"
            onSuggestionClick={(action) => console.log(action)}
          />

          {/* 输入框 */}
          <VoiceInput
            value={input}
            onChange={setInput}
            onSend={() => setInput("")}
            accentColor="#4CAF50"
            placeholder="问我任何问题..."
          />
        </div>
      </OrbNotification>

      {/* 4. 多主题 */}
      <OrbNotification
        isOpen={themeOpen}
        onClose={() => setThemeOpen(false)}
        colors={ORB_THEMES[activeTheme]}
        title={`${activeTheme} 主题`}
        subtitle="点击其他颜色切换"
        orbHint="切换主题"
      >
        <div className="py-6 text-center">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4"
            style={{
              background: `linear-gradient(135deg, ${ORB_THEMES[activeTheme].primary}, ${ORB_THEMES[activeTheme].glow})`,
              boxShadow: `0 0 30px ${ORB_THEMES[activeTheme].glow}60`,
            }}
          />
          <p className="text-white/80">当前主题: {activeTheme}</p>
          <div className="flex justify-center gap-4 mt-4">
            {Object.entries(ORB_THEMES).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => setActiveTheme(key as keyof typeof ORB_THEMES)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  activeTheme === key ? "border-white scale-110" : "border-white/20"
                }`}
                style={{ background: theme.primary }}
              />
            ))}
          </div>
        </div>
      </OrbNotification>

      {/* 5. 自定义图标 */}
      <OrbNotification
        isOpen={customOpen}
        onClose={() => setCustomOpen(false)}
        colors={ORB_THEMES.violet}
        title="AI 助手"
        subtitle="智能问答模式"
        size={72}
        orbIcon={<Zap size={32} color="white" />}
        orbHint="AI 就绪"
        position={ORB_POSITIONS.bottomLeft}
      >
        <div className="space-y-4">
          {[
            { icon: <MessageSquare size={16} />, text: "自然语言对话" },
            { icon: <Star size={16} />, text: "个性化推荐" },
            { icon: <Zap size={16} />, text: "实时响应" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="text-violet-400">{item.icon}</div>
              <span className="text-white/80">{item.text}</span>
            </div>
          ))}
        </div>
      </OrbNotification>

      {/* 6. 礼物/奖励 */}
      <OrbNotification
        isOpen={giftOpen}
        onClose={() => setGiftOpen(false)}
        colors={ORB_THEMES.flamingo}
        title="新礼物！"
        subtitle="你收到了一份惊喜"
        size={80}
        orbIcon={<Gift size={36} color="white" />}
        orbHint="打开礼物"
        position={ORB_POSITIONS.topRight}
        autoExpand
        autoExpandDelay={1500}
      >
        <div className="text-center py-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: 2 }}
            className="text-6xl mb-4"
          >
            🎁
          </motion.div>
          <h4 className="text-white font-bold text-lg mb-2">获得学习礼包</h4>
          <ul className="text-white/60 text-sm space-y-1">
            <li>✨ 7天会员体验</li>
            <li>📚 精选习题集</li>
            <li>🎯 专属学习计划</li>
          </ul>
          <button className="mt-6 px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium hover:scale-105 transition-transform">
            立即领取
          </button>
        </div>
      </OrbNotification>
    </div>
  )
}

// 辅助组件：演示卡片
function DemoCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-white/50 text-sm mb-4">{description}</p>
      {children}
    </div>
  )
}
