"use client"

import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Calculator, Headphones, FileText, Target, BookMarked, PenLine, ChevronRight, Play, Phone } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface Suggestion {
  label: string
  action: string
}

interface CourseTask {
  name: string
  completed: number
  total: number
}

interface CourseCard {
  type: "course"
  title: string
  image: string
  courseName: string
  tasks: CourseTask[]
  buttonText: string
}

interface AIToolsCard {
  type: "ai-tools"
  tools: { icon: string; label: string }[]
}

interface DailyTaskCard {
  type: "daily-task"
  title: string
  count: string
  date: string
  progress: number
  tag: string
}

interface AIVoiceCard {
  type: "ai-voice"
  title: string
  image: string
  message: string
  buttonText: string
}

interface KnowledgeCard {
  type: "knowledge"
  title: string
  description: string
  buttonText: string
}

interface SummaryCard {
  type: "summary"
  title: string
  description: string
  icon: string
}

interface ExerciseCard {
  type: "exercise"
  title: string
  description: string
  image: string
  questionCount: number
}

type CardItem = CourseCard | AIToolsCard | DailyTaskCard | AIVoiceCard | KnowledgeCard | SummaryCard | ExerciseCard

interface DashboardData {
  title: string
  suggestions: Suggestion[]
  cards: CardItem[]
}

// 校内同步学习数据
const SCHOOL_SYNC_DATA: DashboardData = {
  title: "来看看下周的预习内容吧",
  suggestions: [
    { label: "有理数运算 ▶", action: "帮我预习有理数运算" },
    { label: "文言文理解 ▶", action: "帮我预习文言文理解" }
  ],
  cards: [
    {
      type: "course",
      title: "校内同步",
      image: "/images/course-math.png",
      courseName: "第一章 有理数运算综合测试",
      tasks: [
        { name: "课后练习", completed: 0, total: 3 },
        { name: "课堂总结", completed: 0, total: 1 }
      ],
      buttonText: "写作业"
    },
    {
      type: "ai-tools",
      tools: [
        { icon: "calculator", label: "AI口算批改" },
        { icon: "headphones", label: "AI语文听写" },
        { icon: "translate", label: "AI指尖翻译" }
      ]
    },
    {
      type: "daily-task",
      title: "天天口算",
      count: "第5次",
      date: "2025.03.03",
      progress: 50,
      tag: "进行中"
    },
    {
      type: "ai-voice",
      title: "AI口语对话",
      image: "/images/ai-avatar.png",
      message: "Hey, nice to meet you!",
      buttonText: "0元，开始通话"
    }
  ]
}

// 薄弱知识点学习数据
const WEAK_POINTS_DATA: DashboardData = {
  title: "准备好「薄弱项」提升了吗",
  suggestions: [
    { label: "如何判断一个方程是二元一次方程？ ▶", action: "如何判断一个方程是二元一次方程" },
    { label: "如何求解二元一次方程组？ ▶", action: "如何求解二元一次方程组" }
  ],
  cards: [
    {
      type: "knowledge",
      title: "精准学推荐",
      description: "掌握二元一次方程的解题技巧，理解方程的基本概念和性质。",
      buttonText: "开始学习"
    },
    {
      type: "summary",
      title: "考点归纳",
      description: "二元一次方程的常见题型和解题方法总结。",
      icon: "book"
    },
    {
      type: "daily-task",
      title: "数学计划",
      count: "第1节",
      date: "2025.03.03",
      progress: 0,
      tag: "未开始"
    },
    {
      type: "exercise",
      title: "基础练习",
      description: "二元一次方程基础概念理解",
      image: "/images/exercise-math.png",
      questionCount: 10
    }
  ]
}

interface DashboardCardsProps {
  accentColor: string
  mode?: "school-sync" | "weak-points"
  onSuggestionClick?: (action: string) => void
}

export function DashboardCards({ accentColor, mode = "school-sync", onSuggestionClick }: DashboardCardsProps) {
  const currentData = mode === "school-sync" ? SCHOOL_SYNC_DATA : WEAK_POINTS_DATA

  // 保留旧数据用于退出动画
  const [prevMode, setPrevMode] = useState(mode)
  const [exitData, setExitData] = useState<DashboardData | null>(null)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (mode !== prevMode) {
      // mode 变化时，保存旧数据并开始退出动画
      const oldData = prevMode === "school-sync" ? SCHOOL_SYNC_DATA : WEAK_POINTS_DATA
      setExitData(oldData)
      setIsExiting(true)
      setPrevMode(mode)

      // 1.5秒后清除退出数据
      const timer = setTimeout(() => {
        setIsExiting(false)
        setExitData(null)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [mode, prevMode])

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative" }}>
      {/* 退出层 - 旧内容（绝对定位覆盖） */}
      <AnimatePresence>
        {isExiting && exitData && (
          <motion.div
            key="exit-layer"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 1.0 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              pointerEvents: "none",
              display: "flex",
              flexDirection: "column",
              gap: 16
            }}
          >
            {/* 旧标题 */}
            <motion.h3
              initial={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: 600,
                margin: 0
              }}
            >
              {exitData.title}
            </motion.h3>

            {/* 旧卡片列表 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {exitData.cards.map((card, index) => (
                <motion.div
                  key={`exit-${card.type}-${index}`}
                  initial={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{
                    opacity: 0,
                    scale: 2.0,
                    filter: "blur(60px)",
                    y: -50,
                    transition: {
                      duration: 1.2,
                      delay: index * 0.1,
                      ease: [0.4, 0, 0.2, 1]
                    }
                  }}
                >
                  <CardItemRenderer card={card} accentColor={accentColor} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 进入层 - 新内容 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* 标题 */}
        <motion.h3
          key={currentData.title}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: isExiting ? 0.3 : 0 }}
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: 600,
            margin: 0
          }}
        >
          {currentData.title}
        </motion.h3>

        {/* Suggestions */}
        <motion.div
          key={`suggestions-${mode}`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: isExiting ? 0.4 : 0.1 }}
          style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
        >
          {currentData.suggestions.map((suggestion, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: (isExiting ? 0.5 : 0.15) + idx * 0.05 }}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSuggestionClick?.(suggestion.action)}
              style={{
                padding: "8px 16px",
                borderRadius: 20,
                background: "rgba(255,255,255,0.08)",
                border: "none",
                color: "rgba(255,255,255,0.7)",
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "white"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.7)"
              }}
            >
              {suggestion.label}
            </motion.button>
          ))}
        </motion.div>

        {/* 卡片列表 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {currentData.cards.map((card, index) => (
            <motion.div
              key={`${mode}-${card.type}-${index}`}
              initial={{ opacity: 0, y: 30, scale: 1.1, filter: "blur(15px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.5,
                delay: (isExiting ? 0.6 : 0) + index * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <CardItemRenderer card={card} accentColor={accentColor} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CardItemRenderer({ card, accentColor }: { card: CardItem; accentColor: string }) {
  switch (card.type) {
    case "course":
      return <CourseCard card={card} accentColor={accentColor} />
    case "ai-tools":
      return <AIToolsCard card={card} />
    case "daily-task":
      return <DailyTaskCard card={card} />
    case "ai-voice":
      return <AIVoiceCard card={card} accentColor={accentColor} />
    case "knowledge":
      return <KnowledgeCard card={card} accentColor={accentColor} />
    case "summary":
      return <SummaryCard card={card} accentColor={accentColor} />
    case "exercise":
      return <ExerciseCard card={card} accentColor={accentColor} />
    default:
      return null
  }
}

// 课程卡片
function CourseCard({ card, accentColor }: { card: CourseCard; accentColor: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12
      }}
    >
      {/* 标题行 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{card.title}</span>
        <BookOpen size={14} style={{ color: accentColor }} />
      </div>

      {/* 内容区 */}
      <div style={{ display: "flex", gap: 12 }}>
        {/* 图片占位 */}
        <div
          style={{
            width: 80,
            height: 60,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${accentColor}40, ${accentColor}20)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <BookMarked size={24} style={{ color: accentColor }} />
        </div>

        {/* 信息 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <h4 style={{ color: "white", fontSize: 14, fontWeight: 500, margin: 0 }}>
            {card.courseName}
          </h4>

          {/* 任务列表 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {card.tasks.map((task, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{task.name}</span>
                <span style={{ color: task.completed === task.total ? accentColor : "rgba(255,255,255,0.5)", fontSize: 12 }}>
                  {task.completed}/{task.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 按钮 */}
      <button
        style={{
          padding: "10px 20px",
          borderRadius: 20,
          background: accentColor,
          border: "none",
          color: "white",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          alignSelf: "flex-end"
        }}
      >
        {card.buttonText}
      </button>
    </div>
  )
}

// AI工具卡片
function AIToolsCard({ card }: { card: AIToolsCard }) {
  const iconMap: Record<string, React.ReactNode> = {
    calculator: <Calculator size={20} />,
    headphones: <Headphones size={20} />,
    translate: <FileText size={20} />
  }

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: 16
      }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        {card.tools.map((tool, idx) => (
          <button
            key={idx}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: "16px 12px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.08)",
              border: "none",
              color: "white",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {iconMap[tool.icon] || <Target size={20} />}
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// 日常任务卡片
function DailyTaskCard({ card }: { card: DailyTaskCard }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: 16,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <PenLine size={20} style={{ color: "white" }} />
        </div>
        <div>
          <h4 style={{ color: "white", fontSize: 14, fontWeight: 500, margin: 0 }}>{card.title}</h4>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: "4px 0 0 0" }}>
            {card.count} · {card.date}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* 进度圆环 */}
        <div style={{ position: "relative", width: 40, height: 40 }}>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="3"
            />
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${card.progress * 1.005} 100`}
              transform="rotate(-90 20 20)"
            />
          </svg>
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 10,
              color: "white"
            }}
          >
            {card.progress}%
          </span>
        </div>

        {/* 标签 */}
        <span
          style={{
            padding: "4px 10px",
            borderRadius: 12,
            background: card.progress > 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
            color: card.progress > 0 ? "white" : "rgba(255,255,255,0.5)",
            fontSize: 11
          }}
        >
          {card.tag}
        </span>
      </div>
    </div>
  )
}

// AI语音对话卡片
function AIVoiceCard({ card, accentColor }: { card: AIVoiceCard; accentColor: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: 16,
        display: "flex",
        alignItems: "center",
        gap: 16
      }}
    >
      {/* 头像 */}
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${accentColor}60, ${accentColor}30)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Headphones size={28} style={{ color: "white" }} />
      </div>

      {/* 内容 */}
      <div style={{ flex: 1 }}>
        <h4 style={{ color: "white", fontSize: 14, fontWeight: 500, margin: 0 }}>{card.title}</h4>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: "6px 0" }}>
          "{card.message}"
        </p>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            borderRadius: 20,
            background: accentColor,
            border: "none",
            color: "white",
            fontSize: 13,
            cursor: "pointer"
          }}
        >
          <Phone size={14} />
          {card.buttonText}
        </button>
      </div>
    </div>
  )
}

// 知识点卡片
function KnowledgeCard({ card, accentColor }: { card: KnowledgeCard; accentColor: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Target size={16} style={{ color: accentColor }} />
        <span style={{ color: accentColor, fontSize: 13, fontWeight: 500 }}>{card.title}</span>
      </div>

      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0, lineHeight: 1.5 }}>
        {card.description}
      </p>

      <button
        style={{
          padding: "10px 20px",
          borderRadius: 20,
          background: accentColor,
          border: "none",
          color: "white",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          alignSelf: "flex-start"
        }}
      >
        {card.buttonText}
      </button>
    </div>
  )
}

// 考点归纳卡片
function SummaryCard({ card, accentColor }: { card: SummaryCard; accentColor: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: 16,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${accentColor}40, ${accentColor}20)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <BookOpen size={20} style={{ color: accentColor }} />
        </div>
        <div>
          <h4 style={{ color: "white", fontSize: 14, fontWeight: 500, margin: 0 }}>{card.title}</h4>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: "4px 0 0 0" }}>
            {card.description}
          </p>
        </div>
      </div>

      <ChevronRight size={20} style={{ color: "rgba(255,255,255,0.3)" }} />
    </div>
  )
}

// 练习卡片
function ExerciseCard({ card, accentColor }: { card: ExerciseCard; accentColor: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: 16,
        display: "flex",
        gap: 12
      }}
    >
      {/* 图片占位 */}
      <div
        style={{
          width: 70,
          height: 70,
          borderRadius: 10,
          background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <FileText size={28} style={{ color: accentColor }} />
      </div>

      {/* 内容 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <h4 style={{ color: "white", fontSize: 14, fontWeight: 500, margin: 0 }}>{card.title}</h4>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: "6px 0 0 0" }}>
            {card.description}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: accentColor, fontSize: 12 }}>{card.questionCount}道题</span>
          <button
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: accentColor,
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <Play size={14} style={{ color: "white", marginLeft: 2 }} />
          </button>
        </div>
      </div>
    </div>
  )
}
