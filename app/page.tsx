"use client"

import { Suspense, useState, useRef, useCallback, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PlanetExperience from "@/components/planet-experience"
import LoadingScreen from "@/components/loading-screen"
import { LanguageProvider } from "@/components/language-provider"
import type * as THREE from "three"
import { themes, type Theme } from "@/lib/themes"
import { X, Sparkles } from "lucide-react"
import { DashboardCards } from "@/components/dashboard-cards"
import { VoiceInput } from "@/components/voice-input"
import OrbNotification, { ORB_THEMES } from "@/components/orb-notification"
import { GomokuGame } from "@/components/gomoku-game"

// ===== Config imports =====
import {
  sections,
  getSectionById,
  type Section,
} from "@/config/sections.config"
import {
  getCardTemplate,
  getHomeworkList,
  getHomeworkStats,
  type CardMode,
} from "@/config/cards.config"
import {
  getThemeByMode,
  getModeBySection,
  getChatBackground,
  type AppMode,
} from "@/config/themes.config"
import { fetchXiaosiResponse, type XiaosiResponse } from "@/lib/api"

// ===== Types =====
interface SuggestionButton {
  label: string
  action: string
}

// ===== Theme Constants =====
const ORANGE_THEME = {
  primary: "#FF8800",
  glow: "#FFAA33",
  secondary: "#FF6600",
}

function MainContent() {
  const [loaded, setLoaded] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [input, setInput] = useState("")
  const [currentResponse, setCurrentResponse] = useState<XiaosiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0])
  const [mounted, setMounted] = useState(false)

  // 当前应用模式（替代多个布尔值）
  const [appMode, setAppMode] = useState<AppMode>("default")

  // 当前 section ID
  const [activeSectionId, setActiveSectionId] = useState<string>("hero")

  // 是否显示3D橙色小球
  const [showOrangeMarker, setShowOrangeMarker] = useState(false)

  // 小球通知状态
  const [showOrb, setShowOrb] = useState(false)

  // ===== Computed Values =====

  // 根据模式获取主题色
  const accentColor = useMemo(() => {
    if (appMode === "homework") {
      return ORANGE_THEME.glow
    }
    const themeColors = getThemeByMode(appMode)
    return themeColors.accentColor || selectedTheme.displayColor || "#29B6F6"
  }, [appMode, selectedTheme])

  // 当前 section 配置
  const currentSection = useMemo<Section | undefined>(
    () => getSectionById(activeSectionId),
    [activeSectionId]
  )

  // 获取卡片模式（作业模式有自己的视图，这里返回其他模式）
  const getCardMode = useCallback((): Exclude<CardMode, "homework"> => {
    if (appMode === "game") return "game"
    const cardMode = currentSection?.cardMode
    if (cardMode === "school-sync") return "school-sync"
    if (cardMode === "reading") return "reading"
    return "weak-points"
  }, [appMode, currentSection])

  // ===== Effects =====

  useEffect(() => {
    setMounted(true)
    // 页面加载后 2 秒显示小球
    const timer = setTimeout(() => {
      setShowOrb(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // ===== Refs =====

  const planetExperienceRef = useRef<{
    handleSectionClick: (sectionId: string, forceFromOrangeOrb?: boolean) => void
    getPlanetRef: () => React.RefObject<THREE.Group> | null
  } | null>(null)

  // ===== Handlers =====

  const handleSend = useCallback(
    async (textToSend?: string) => {
      const text = textToSend || input.trim()
      if (!text || isLoading) return

      // 处理游戏内的特殊操作
      if (text === "重新开始") {
        if (typeof window !== "undefined" && (window as any).resetGomokuGame) {
          (window as any).resetGomokuGame()
        }
        return
      }

      setShowChat(true)
      planetExperienceRef.current?.handleSectionClick("hero")

      if (!textToSend) {
        setInput("")
      }
      setIsLoading(true)

      const response = await fetchXiaosiResponse(text)
      setCurrentResponse(response)
      setIsLoading(false)
    },
    [input, isLoading]
  )

  const handleCloseChat = useCallback(() => {
    setShowChat(false)
    setIsLoading(false)
    setInput("")
    setCurrentResponse(null)
    setActiveSectionId("hero")
    setAppMode("default")
    setShowOrangeMarker(true)
    planetExperienceRef.current?.handleSectionClick("")
  }, [])

  // 处理3D橙色小球点击
  const handleOrangeMarkerClick = useCallback(() => {
    setAppMode("homework")
    setActiveSectionId("hero")
    setShowChat(true)
  }, [])

  // 处理 section 点击
  const handleOpenChat = useCallback(
    (sectionId?: string) => {
      const targetId = sectionId || "hero"

      // 处理橙色小球（作业模式）
      if (targetId === "homework") {
        setActiveSectionId("hero")
        setAppMode("homework")
        setShowChat(true)
        return
      }

      const section = getSectionById(targetId)

      if (section) {
        setActiveSectionId(targetId)
        setAppMode(section.mode === "game" ? "game" : section.mode === "learning" ? "learning" : "default")
      }

      setShowChat(true)
    },
    []
  )

  // 处理小球展开
  const handleOrbExpand = useCallback(() => {
    setAppMode("homework")
    setActiveSectionId("hero")
    setShowChat(true)
    setShowOrb(false)
    // 触发 Three.js 相机移动到橙色小球位置
    planetExperienceRef.current?.handleSectionClick("homework")
  }, [])

  // 处理开始学习
  const handleStartLearning = useCallback(() => {
    setAppMode("learning")
    setCurrentResponse({
      summary: "让我来帮你制定学习计划",
      ttsText: "我可以帮你解答各种问题。我们可以从你感兴趣的话题开始，或者我也可以根据你的学习情况推荐合适的内容。",
      suggestions: [
        { label: "详细解释一下", action: "详细解释一下" },
        { label: "举个例子", action: "给我举个例子" },
        { label: "来道题试试", action: "出一道相关练习题" },
        { label: "相关知识", action: "相关的知识有哪些" },
      ],
    })
  }, [])

  // ===== Render Helpers =====

  // 获取当前建议列表
  const getCurrentSuggestions = useCallback((): SuggestionButton[] => {
    if (currentResponse?.suggestions?.length) {
      return currentResponse.suggestions
    }
    if (currentSection?.suggestions?.length) {
      return currentSection.suggestions
    }
    return [
      { label: "详细解释一下", action: "详细解释一下" },
      { label: "举个例子", action: "给我举个例子" },
      { label: "来道题试试", action: "出一道相关练习题" },
      { label: "相关知识", action: "相关的知识有哪些" },
    ]
  }, [currentResponse, currentSection])

  // ===== Render =====

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        background: "black",
        overflow: "hidden",
      }}
    >
      {/* 星球全屏底层 */}
      <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
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

      {/* 小球通知 */}
      <OrbNotification
        isOpen={showOrb}
        onClose={() => {
          setShowOrb(false)
          setShowOrangeMarker(true)
        }}
        colors={ORANGE_THEME}
        title="小思助手"
        subtitle="新消息"
        autoExpand
        autoExpandDelay={2000}
        onOrbClick={() => {
          setShowOrb(false)
          setShowOrangeMarker(true)
          handleOrbExpand()
        }}
        onExpandComplete={handleOrbExpand}
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
                position: "fixed",
                inset: 0,
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* 背景遮罩 - 根据模式显示不同渐变 */}
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: (() => {
                    const bg = getChatBackground(appMode)
                    // 简化：中心颜色（带透明度）→ 边缘黑色半透明
                    return `radial-gradient(circle at center, ${bg.modalGradient.center}30 0%, ${bg.modalGradient.edge} 100%)`
                  })(),
                }}
                onClick={handleCloseChat}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />

              {/* 主弹窗 */}
              <motion.div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: 600,
                  maxHeight: "80vh",
                  display: "flex",
                  flexDirection: "column",
                }}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
              >
                {/* 主卡片 - 黑色半透明毛玻璃 + 渐变边框 */}
                <div
                  style={{
                    position: "relative",
                    borderRadius: 20,
                    padding: "1px",
                    background: `linear-gradient(135deg, ${accentColor}80, ${accentColor}40, ${accentColor}4D, ${accentColor}30)`,
                    boxShadow: `0 25px 60px ${accentColor}40, 0 0 100px ${accentColor}20`,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      background: "rgba(10,15,20,0.8)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      borderRadius: 19,
                      display: "flex",
                      flexDirection: "column",
                      maxHeight: "80vh",
                      padding: "32px",
                    }}
                  >
                    {/* 关闭按钮 */}
                    <button
                      onClick={handleCloseChat}
                      style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        padding: 8,
                        borderRadius: "50%",
                        background: "transparent",
                        border: "none",
                        color: "rgba(255,255,255,0.5)",
                        cursor: "pointer",
                        zIndex: 10,
                      }}
                    >
                      <X size={20} />
                    </button>

                    {/* 内容区域 */}
                    {!currentResponse && !isLoading ? (
                      /* 初始欢迎状态 */
                      <div style={{ marginBottom: 24, flex: 1, display: "flex", flexDirection: "column" }}>
                        {appMode === "homework" ? (
                          /* 作业模式 - 显示作业列表 */
                          <HomeworkView
                            accentColor={accentColor}
                            onStartLearning={handleStartLearning}
                          />
                        ) : appMode === "game" ? (
                          /* 游戏模式 - 显示五子棋卡片 */
                          <DashboardCards
                            accentColor={accentColor}
                            mode="game"
                            onSuggestionClick={handleSend}
                          />
                        ) : (
                          /* 普通学习模式 - 显示学习面板 */
                          <DashboardCards
                            accentColor={accentColor}
                            mode={getCardMode()}
                            onSuggestionClick={handleSend}
                          />
                        )}
                      </div>
                    ) : (
                      /* 小思回复状态 */
                      <div style={{ flex: 1, marginBottom: 24 }}>
                        {/* 加载状态 */}
                        {isLoading && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                              display: "flex",
                              gap: 12,
                              alignItems: "center",
                              padding: "40px 0",
                            }}
                          >
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background: `linear-gradient(135deg, ${accentColor}, #0288D1)`,
                              }}
                            />
                            <div style={{ display: "flex", gap: 4 }}>
                              <span
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: accentColor,
                                }}
                              />
                              <span
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: accentColor,
                                }}
                              />
                              <span
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: accentColor,
                                }}
                              />
                            </div>
                          </motion.div>
                        )}

                        {/* 回复内容 */}
                        {!isLoading && currentResponse && (
                          <motion.div
                            key={currentResponse.summary}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {/* 大字体核心概要 */}
                            <h2
                              style={{
                                color: "white",
                                fontSize: 26,
                                fontWeight: 600,
                                margin: 0,
                                marginBottom: 12,
                                letterSpacing: "-0.3px",
                              }}
                            >
                              {currentResponse.summary}
                            </h2>

                            {/* 小字详细内容 */}
                            <p
                              style={{
                                color: "rgba(255,255,255,0.7)",
                                fontSize: 14,
                                lineHeight: 1.6,
                                margin: 0,
                                marginBottom: 20,
                              }}
                            >
                              {currentResponse.ttsText}
                            </p>

                            {/* 建议按钮 */}
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 10,
                                justifyContent: "flex-start",
                              }}
                            >
                              {getCurrentSuggestions().map((sug, idx) => (
                                <SuggestionPill
                                  key={idx}
                                  label={sug.label}
                                  onClick={() => handleSend(sug.action)}
                                  isAccent={appMode === "homework" && idx === 0}
                                  accentColor={accentColor}
                                />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* 底部输入框 */}
                    <div style={{ marginTop: "auto", position: "relative" }}>
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
            position: "fixed",
            bottom: 64,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 50,
            width: "85%",
            maxWidth: 420,
            pointerEvents: "auto",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.3s ease",
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

// ===== Sub Components =====

/**
 * 作业列表视图
 */
function HomeworkView({
  accentColor,
  onStartLearning,
}: {
  accentColor: string
  onStartLearning: () => void
}) {
  const homeworkList = getHomeworkList()
  const stats = getHomeworkStats()
  const template = getCardTemplate("homework")

  // 替换模板变量
  const description = template.description
    ?.replace("{{total}}", String(stats.total))
    ?.replace("{{time}}", stats.estimatedTime)

  return (
    <div style={{ padding: "8px 0" }}>
      {/* 大标题 */}
      <h2
        style={{
          color: "white",
          fontSize: 26,
          fontWeight: 600,
          margin: 0,
          marginBottom: 12,
          letterSpacing: "-0.3px",
        }}
      >
        {template.title}
      </h2>

      {/* 小字说明 */}
      <p
        style={{
          color: "rgba(255,255,255,0.7)",
          fontSize: 14,
          lineHeight: 1.6,
          margin: 0,
          marginBottom: 20,
        }}
      >
        {description}
      </p>

      {/* 作业列表 */}
      <div style={{ marginBottom: 20 }}>
        {homeworkList.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 0",
              borderBottom:
                idx < homeworkList.length - 1
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "none",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: accentColor,
                flexShrink: 0,
                boxShadow: `0 0 8px ${accentColor}80`,
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 15,
                  color: "white",
                  fontWeight: 500,
                  marginBottom: 2,
                }}
              >
                {item.subject}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                {item.task}
              </div>
            </div>
            <div
              style={{
                fontSize: 13,
                color: accentColor,
                fontWeight: 500,
              }}
            >
              {item.time}
            </div>
          </div>
        ))}
      </div>

      {/* sug 按钮 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {template.suggestions?.map((sug, idx) => (
          <SuggestionPill
            key={idx}
            label={sug.label}
            onClick={onStartLearning}
            isAccent={idx === 0}
            accentColor={accentColor}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * 建议按钮组件
 */
function SuggestionPill({
  label,
  onClick,
  isAccent = false,
  accentColor,
}: {
  label: string
  onClick: () => void
  isAccent?: boolean
  accentColor: string
}) {
  const accentBg = `${accentColor}40`
  const accentBorder = `${accentColor}66`

  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px",
        borderRadius: 9999,
        background: isAccent ? accentBg : "rgba(255,255,255,0.15)",
        border: isAccent ? `1px solid ${accentBorder}` : "none",
        color: isAccent ? accentColor : "rgba(255,255,255,0.9)",
        fontSize: 13,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = isAccent
          ? `${accentColor}59`
          : "rgba(255,255,255,0.25)"
        e.currentTarget.style.color = isAccent ? "white" : "white"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isAccent ? accentBg : "rgba(255,255,255,0.15)"
        e.currentTarget.style.color = isAccent ? accentColor : "rgba(255,255,255,0.9)"
      }}
    >
      {label}
    </button>
  )
}

export default function Home() {
  return (
    <LanguageProvider>
      <MainContent />
    </LanguageProvider>
  )
}
