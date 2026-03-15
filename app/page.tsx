"use client"

import { Suspense, useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PlanetExperience from "@/components/planet-experience"
import LoadingScreen from "@/components/loading-screen"
import { LanguageProvider } from "@/components/language-provider"
import type * as THREE from "three"
import { themes, type Theme } from "@/lib/themes"
import { X, User, Bot, Sparkles } from "lucide-react"
import { DashboardCards } from "@/components/dashboard-cards"
import { VoiceInput } from "@/components/voice-input"
import OrbNotification, { ORB_THEMES } from "@/components/orb-notification"

interface SuggestionButton {
  label: string
  action: string
}

interface XiaosiResponse {
  summary: string  // 大字体：核心概要
  ttsText: string  // 小字：详细内容
  suggestions: SuggestionButton[]  // sug按钮
}

// Section 配置数据
interface SectionConfig {
  id: string
  greeting: string
  title: string
  quickButtons: string[]
  suggestions: SuggestionButton[]
}

const SECTION_CONFIGS: Record<string, SectionConfig> = {
  hero: {
    id: "hero",
    greeting: "你好~航航",
    title: "需要我帮你做些什么呢？",
    quickButtons: ["练口语", "写作文", "继续学昨天的", "数学辅导"],
    suggestions: [
      { label: "详细解释一下", action: "详细解释一下" },
      { label: "举个例子", action: "给我举个例子" },
      { label: "换种说法", action: "换种说法解释" },
      { label: "相关知识", action: "相关的知识有哪些" }
    ]
  },
  speaker: {
    id: "speaker",
    greeting: "你好~数学小助手来了",
    title: "有什么数学问题想问我吗？",
    quickButtons: ["解方程", "几何题", "应用题", "公式推导"],
    suggestions: [
      { label: "一步步讲解", action: "一步步讲解" },
      { label: "画图说明", action: "画图说明" },
      { label: "类似例题", action: "出几道类似例题" },
      { label: "总结方法", action: "总结解题方法" }
    ]
  },
  lightning: {
    id: "lightning",
    greeting: "你好~语文小助手来了",
    title: "今天想学习哪方面的语文知识？",
    quickButtons: ["古诗词", "阅读理解", "作文技巧", "成语解释"],
    suggestions: [
      { label: "详细赏析", action: "详细赏析" },
      { label: "作者背景", action: "介绍作者背景" },
      { label: "写作手法", action: "分析写作手法" },
      { label: "背诵技巧", action: "给背诵技巧" }
    ]
  },
  sponsor: {
    id: "sponsor",
    greeting: "你好~科学小助手来了",
    title: "想了解哪方面的科学知识？",
    quickButtons: ["物理实验", "生物现象", "化学反应", "天文知识"],
    suggestions: [
      { label: "原理解释", action: "解释原理" },
      { label: "生活中的应用", action: "生活中的应用" },
      { label: "相关实验", action: "推荐相关实验" },
      { label: "拓展知识", action: "拓展知识" }
    ]
  }
}

function MainContent() {
  const [loaded, setLoaded] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [input, setInput] = useState("")
  const [currentResponse, setCurrentResponse] = useState<XiaosiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0])
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("hero") // 当前活跃的section

  // 小球通知状态
  const [showOrb, setShowOrb] = useState(false)

  // 是否从橙色小球打开弹窗
  const [isFromOrangeOrb, setIsFromOrangeOrb] = useState(false)

  // 是否在3D场景中显示橙色小球
  const [showOrangeMarker, setShowOrangeMarker] = useState(false)

  // 橙色小球的主题色
  const orangeTheme = {
    primary: "#FF8800",
    glow: "#FFAA33",
    secondary: "#FF6600",
  }

  // 根据section决定显示哪种学习面板内容
  const getDashboardMode = (section: string): "school-sync" | "weak-points" => {
    // 数学显示校内同步
    if (section === "speaker") return "school-sync"
    // 其他显示薄弱知识点
    return "weak-points"
  }

  // 获取当前section配置
  const currentSectionConfig = SECTION_CONFIGS[activeSection] || SECTION_CONFIGS.hero

  useEffect(() => {
    setMounted(true)
    // 页面加载后 2 秒显示小球
    const timer = setTimeout(() => {
      setShowOrb(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const planetExperienceRef = useRef<{
    handleSectionClick: (sectionId: string) => void
    getPlanetRef: () => React.RefObject<THREE.Group> | null
  } | null>(null)

  // 根据是否从橙色小球打开，使用对应的颜色
  const accentColor = isFromOrangeOrb ? orangeTheme.glow : (selectedTheme.displayColor || "#29B6F6")

  // 模拟调用小思API获取回复
  const fetchXiaosiResponse = async (userInput: string): Promise<XiaosiResponse> => {
    // 这里将来替换为真实的API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const input = userInput.toLowerCase()

        // 校内同步学习相关回复
        if (input.includes('有理数') || input.includes('运算')) {
          resolve({
            summary: "有理数运算的关键技巧",
            ttsText: "有理数运算要注意三个要点：第一，确定结果的符号；第二，正确处理绝对值的运算；第三，熟练运用运算律简化计算。咱们可以从加减法开始练起，你觉得怎么样？",
            suggestions: [
              { label: "详细解释一下", action: "详细解释一下有理数运算规则" },
              { label: "举个例子", action: "给我举个有理数运算的例子" },
              { label: "来道题试试", action: "出一道有理数运算题" },
              { label: "相关知识点", action: "有理数的相关知识点有哪些" }
            ]
          })
        } else if (input.includes('文言文') || input.includes('古文')) {
          resolve({
            summary: "文言文阅读理解的窍门",
            ttsText: "理解文言文要从'字、词、句、篇'四个层面入手。先抓关键词的古今异义，再理清楚句式结构，最后结合上下文把握文章主旨。需要我带你具体分析一篇吗？",
            suggestions: [
              { label: "常用实词", action: "文言文常用实词有哪些" },
              { label: "虚词用法", action: "之乎者也的用法区别" },
              { label: "来篇练习", action: "给我一篇文言文练习" },
              { label: "翻译技巧", action: "文言文翻译有什么技巧" }
            ]
          })
        }
        // 薄弱知识点相关回复
        else if (input.includes('二元一次') || input.includes('方程')) {
          resolve({
            summary: "二元一次方程组的解法",
            ttsText: "解二元一次方程组主要有代入消元法和加减消元法两种思路。关键是观察未知数系数的特点，选择最简便的方法来消去一个未知数，把二元转化为一元来解决。",
            suggestions: [
              { label: "代入消元法", action: "详细讲代入消元法" },
              { label: "加减消元法", action: "详细讲加减消元法" },
              { label: "来道题试试", action: "出一道二元一次方程题" },
              { label: "应用场景", action: "生活中什么时候会用到二元一次方程" }
            ]
          })
        }
        // 通用学习回复
        else if (input.includes('预习')) {
          resolve({
            summary: "高效预习的方法",
            ttsText: "预习不是提前学一遍，而是带着问题去听课。建议你先快速浏览课本标题和小结，标记出不懂的地方，上课重点听这些部分。这样听课效率会高很多！",
            suggestions: [
              { label: "预习笔记怎么记", action: "预习笔记怎么记" },
              { label: "各科预习方法", action: "不同科目预习方法有什么区别" },
              { label: "预习时间安排", action: "预习一般要花多长时间" }
            ]
          })
        } else if (input.includes('薄弱') || input.includes('提升')) {
          resolve({
            summary: "针对性提升薄弱项的策略",
            ttsText: "找到薄弱点只是第一步，关键是针对性练习。我建议你先分析错题原因，是概念不清还是计算粗心？然后有针对性地做同类题，每周复习一次错题本，效果会非常明显。",
            suggestions: [
              { label: "错题本怎么用", action: "错题本怎么整理最高效" },
              { label: "制定提升计划", action: "帮我制定一个薄弱项提升计划" },
              { label: "复习频率", action: "错题多久复习一次比较好" }
            ]
          })
        }
        // 通用兜底回复
        else {
          resolve({
            summary: `关于${userInput.slice(0, 15)}${userInput.length > 15 ? '...' : ''}`,
            ttsText: "好的，我来帮你解答这个问题。我们可以从基础概念开始梳理，然后结合具体例子来理解。有什么不清楚的地方随时问我！",
            suggestions: [
              { label: "详细解释一下", action: "详细解释一下" },
              { label: "举个例子", action: "给我举个例子" },
              { label: "来道题试试", action: "出一道相关练习题" },
              { label: "相关知识", action: "相关的知识有哪些" }
            ]
          })
        }
      }, 1500)
    })
  }

  const handleSend = useCallback(async (textToSend?: string) => {
    const text = textToSend || input.trim()
    if (!text || isLoading) return

    // 用户输入不上屏，直接触发请求
    setShowChat(true)
    // 触发星球放大效果
    planetExperienceRef.current?.handleSectionClick("hero")
    if (!textToSend) {
      setInput("")
    }
    setIsLoading(true)

    // 获取小思回复（原地刷新）
    const response = await fetchXiaosiResponse(text)
    setCurrentResponse(response)
    setIsLoading(false)
  }, [input, isLoading])

  const handleCloseChat = () => {
    setShowChat(false)
    setIsLoading(false)
    setInput("")
    setCurrentResponse(null) // 清空当前回复
    setActiveSection("hero") // 重置为hero
    // 关闭弹窗后显示3D橙色小球
    setShowOrangeMarker(true)
    setIsFromOrangeOrb(false) // 重置橙色小球标记
    // 重置星球视角（传入空字符串关闭 section）
    planetExperienceRef.current?.handleSectionClick("")
  }

  // 处理3D橙色小球点击
  const handleOrangeMarkerClick = () => {
    setShowChat(true)
    setIsFromOrangeOrb(true) // 标记为从橙色小球打开
  }

  const handleOpenChat = (sectionId?: string) => {
    setShowChat(true)
    setIsFromOrangeOrb(false) // 从其他方式打开，重置标记
    if (sectionId && SECTION_CONFIGS[sectionId]) {
      setActiveSection(sectionId)
    }
  }

  // 处理小球展开
  const handleOrbExpand = () => {
    setShowChat(true)
    setShowOrb(false)
    setIsFromOrangeOrb(true) // 标记为从橙色小球打开
  }

  const handleStartLearning = () => {
    // 现在开始按钮点击后，切换到学习面板
    setCurrentResponse({
      summary: "让我来帮你制定学习计划",
      ttsText: "我可以帮你解答各种问题。我们可以从你感兴趣的话题开始，或者我也可以根据你的学习情况推荐合适的内容。",
      suggestions: [
        { label: "详细解释一下", action: "详细解释一下" },
        { label: "举个例子", action: "给我举个例子" },
        { label: "来道题试试", action: "出一道相关练习题" },
        { label: "相关知识", action: "相关的知识有哪些" }
      ]
    })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', background: 'black', overflow: 'hidden' }}>
      {/* 星球全屏底层 */}
      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <Suspense fallback={<LoadingScreen />}>
          <PlanetExperience
            onLoaded={() => setLoaded(true)}
            ref={planetExperienceRef}
            sidebarOpen={false}
            sidebarWidth={0}
            isIntroActive={false}
            selectedTheme={selectedTheme}
            onOpenChat={handleOpenChat}
            showOrangeMarker={showOrangeMarker}
            onOrangeMarkerClick={handleOrangeMarkerClick}
          />
        </Suspense>
        {!loaded && <LoadingScreen />}
      </div>

      {/* 演示入口已移除 - 改为点击蓝色球体触发或直接显示 */}

      {/* 小球通知 - 点击后打开聊天窗口显示作业列表 */}
      <OrbNotification
        isOpen={showOrb}
        onClose={() => {
          setShowOrb(false)
          // 如果直接关闭小球，也显示3D橙色小球
          setShowOrangeMarker(true)
        }}
        colors={orangeTheme}
        title="小思助手"
        subtitle="新消息"
        autoExpand
        autoExpandDelay={2000}
        onOrbClick={() => {
          setShowOrb(false)
          // 点击小球后显示3D橙色小球
          setShowOrangeMarker(true)
          handleOrbExpand()
        }}
        onExpandComplete={() => {
          // 自动展开后，打开聊天窗口
          handleOrbExpand()
        }}
      >
        <div className="space-y-4">
          {/* 欢迎语 */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} color="white" />
            </div>
            <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
              <p className="text-white/90">你好~航航</p>
              <p className="text-white/60 text-sm mt-1">需要我帮你做些什么呢？</p>
            </div>
          </div>

          {/* 快捷操作 */}
          <div className="grid grid-cols-2 gap-2">
            {["练口语", "写作文", "数学辅导", "其他问题"].map((item) => (
              <button
                key={item}
                onClick={() => handleSend(item)}
                className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-sm transition-colors text-left"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </OrbNotification>

      {/* 聊天弹窗 */}
      {mounted && (
        <AnimatePresence>
          {showChat && (
            <motion.div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: isFromOrangeOrb
                    ? `radial-gradient(circle at center, ${orangeTheme.primary}20 0%, rgba(0,0,0,0.7) 100%)`
                    : 'rgba(0,0,0,0.5)'
                }}
                onClick={handleCloseChat}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />

              <motion.div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 600,
                  maxHeight: '80vh',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
              >
                {/* 主卡片 - 黑色半透明毛玻璃 + 渐变边框 */}
                <div
                  style={{
                    position: 'relative',
                    borderRadius: 20,
                    padding: '1px',
                    background: `linear-gradient(135deg, ${accentColor}80, ${accentColor}40, rgba(255,255,255,0.3), ${accentColor}30)`,
                    boxShadow: `0 25px 60px ${accentColor}40, 0 0 100px ${accentColor}20`
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      background: 'rgba(10,15,20,0.8)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      borderRadius: 19,
                      display: 'flex',
                      flexDirection: 'column',
                      maxHeight: '80vh',
                      padding: '32px'
                    }}
                  >
                    {/* 关闭按钮 - 右上角 */}
                    <button
                      onClick={handleCloseChat}
                      style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        padding: 8,
                        borderRadius: '50%',
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        zIndex: 10
                      }}
                    >
                    <X size={20} />
                  </button>

                  {/* 内容区域 - 初始欢迎 vs 小思回复 */}
                  {!currentResponse && !isLoading ? (
                    /* 初始欢迎状态 */
                    <div style={{ marginBottom: 24 }}>
                      {isFromOrangeOrb ? (
                        /* 从橙色小球打开 - 显示作业列表（图2布局风格） */
                        <div style={{ padding: "8px 0" }}>
                          {/* 大标题 */}
                          <h2 style={{
                            color: 'white',
                            fontSize: 26,
                            fontWeight: 600,
                            margin: 0,
                            marginBottom: 12,
                            letterSpacing: '-0.3px'
                          }}>
                            让我们开始今天的作业吧！
                          </h2>

                          {/* 小字说明 */}
                          <p style={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: 14,
                            lineHeight: 1.6,
                            margin: 0,
                            marginBottom: 20
                          }}>
                            今天有3项作业需要完成，预计用时65分钟。记得先完成数学作业，有不懂的随时问我～
                          </p>

                          {/* 作业列表 */}
                          <div style={{ marginBottom: 20 }}>
                            {[
                              { subject: "数学", task: "完成练习题第15-18题", time: "30分钟" },
                              { subject: "语文", task: "背诵古诗《静夜思》", time: "15分钟" },
                              { subject: "英语", task: "单词听写 Unit 3", time: "20分钟" },
                            ].map((item, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 12,
                                  padding: "14px 0",
                                  borderBottom: idx < 2 ? "1px solid rgba(255,255,255,0.1)" : "none",
                                }}
                              >
                                <div
                                  style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    background: "#FF8800",
                                    flexShrink: 0,
                                    boxShadow: "0 0 8px rgba(255,136,0,0.5)",
                                  }}
                                />
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 15, color: "white", fontWeight: 500, marginBottom: 2 }}>
                                    {item.subject}
                                  </div>
                                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                                    {item.task}
                                  </div>
                                </div>
                                <div style={{ fontSize: 13, color: "#FFAA33", fontWeight: 500 }}>
                                  {item.time}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* sug 按钮 */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                            <button
                              onClick={handleStartLearning}
                              style={{
                                padding: '8px 16px',
                                borderRadius: 9999,
                                background: 'rgba(255,136,0,0.25)',
                                border: '1px solid rgba(255,136,0,0.4)',
                                color: '#FFAA33',
                                fontSize: 13,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255,136,0,0.35)'
                                e.currentTarget.style.color = '#FFBB55'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255,136,0,0.25)'
                                e.currentTarget.style.color = '#FFAA33'
                              }}
                            >
                              现在开始
                            </button>
                            <button
                              onClick={handleStartLearning}
                              style={{
                                padding: '8px 16px',
                                borderRadius: 9999,
                                background: 'rgba(255,255,255,0.15)',
                                border: 'none',
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: 13,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.25)'
                                e.currentTarget.style.color = 'white'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                                e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
                              }}
                            >
                              先学数学
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* 普通方式打开 - 显示学习面板 */
                        <DashboardCards
                          accentColor={accentColor}
                          mode={getDashboardMode(activeSection)}
                          onSuggestionClick={handleSend}
                        />
                      )}
                    </div>
                  ) : (
                    /* 小思回复状态 - 三部分结构 */
                    <div style={{ flex: 1, marginBottom: 24 }}>
                      {/* 加载状态 */}
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '40px 0' }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${accentColor}, #0288D1)`
                            }}
                          />
                          <div style={{ display: 'flex', gap: 4 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: accentColor }} />
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: accentColor }} />
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: accentColor }} />
                          </div>
                        </motion.div>
                      )}

                      {/* 回复内容 - 大标题 + 小字 + sug */}
                      {!isLoading && currentResponse && (
                        <motion.div
                          key={currentResponse.summary}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* 第一部分：大字体核心概要 */}
                          <h2 style={{
                            color: 'white',
                            fontSize: 26,
                            fontWeight: 600,
                            margin: 0,
                            marginBottom: 12,
                            letterSpacing: '-0.3px'
                          }}>
                            {currentResponse.summary}
                          </h2>

                          {/* 第二部分：小字详细TTS内容 */}
                          <p style={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: 14,
                            lineHeight: 1.6,
                            margin: 0,
                            marginBottom: 20
                          }}>
                            {currentResponse.ttsText}
                          </p>

                          {/* 第三部分：sug建议按钮 - 使用section配置 */}
                          {(currentResponse.suggestions.length > 0 || currentSectionConfig.suggestions.length > 0) && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'flex-start' }}>
                              {(currentResponse.suggestions.length > 0 ? currentResponse.suggestions : currentSectionConfig.suggestions).map((sug, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSend(sug.action)}
                                  style={{
                                    padding: '8px 16px',
                                    borderRadius: 9999,
                                    background: 'rgba(255,255,255,0.15)',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.9)',
                                    fontSize: 13,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.25)'
                                    e.currentTarget.style.color = 'white'
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                                    e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
                                  }}
                                >
                                  {sug.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* 底部输入框 - 带语音输入 */}
                  <div style={{ marginTop: 'auto', position: 'relative' }}>
                    <VoiceInput
                      value={input}
                      onChange={setInput}
                      onSend={() => handleSend()}
                      placeholder="你可以问我任何问题..."
                      accentColor={accentColor}
                      disabled={isLoading}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* 初始输入框 - 底部居中 */}
      {mounted && !showChat && (
        <div
          style={{
            position: 'fixed',
            bottom: 64,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            width: '85%',
            maxWidth: 420,
            pointerEvents: 'auto',
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        >
          <VoiceInput
            value={input}
            onChange={setInput}
            onSend={() => handleSend()}
            placeholder="和小思聊聊..."
            accentColor={accentColor}
            variant="homepage"
          />
        </div>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <LanguageProvider>
      <MainContent />
    </LanguageProvider>
  )
}
