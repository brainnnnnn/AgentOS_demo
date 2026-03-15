"use client"

import { useState, useEffect, useCallback, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles } from "lucide-react"

// ============================================
// OrbNotification - 可复用的小球通知组件
// ============================================
// 功能：橙红色小球飞入 → 悬浮脉动 → 展开成聊天窗口

export interface OrbNotificationProps {
  /** 是否显示组件 */
  isOpen: boolean
  /** 关闭回调 */
  onClose: () => void
  /** 展开后显示的内容 */
  children: ReactNode
  /** 小球颜色配置 */
  colors?: OrbColors
  /** 小球大小 (像素) */
  size?: number
  /** 小球位置 */
  position?: OrbPosition
  /** 是否自动展开 (默认 false，点击展开) */
  autoExpand?: boolean
  /** 自动展开延迟 (毫秒) */
  autoExpandDelay?: number
  /** 飞入动画方向 */
  enterDirection?: "bottom" | "right" | "left" | "top"
  /** 展开后的标题 */
  title?: string
  /** 展开后的副标题 */
  subtitle?: string
  /** 自定义小球图标 */
  orbIcon?: ReactNode
  /** 小球脉动文字提示 */
  orbHint?: string
  /** 是否显示脉动光环 */
  showPulse?: boolean
  /** 展开后的最大宽度 */
  maxWidth?: number
  /** 展开后的最大高度 */
  maxHeight?: number
  /** 点击小球时的回调 */
  onOrbClick?: () => void
  /** 展开完成后的回调 */
  onExpandComplete?: () => void
  /** 收缩完成后的回调 */
  onCollapseComplete?: () => void
}

export interface OrbColors {
  /** 主色调 */
  primary: string
  /** 发光色 */
  glow: string
  /** 次要色/渐变终点 */
  secondary?: string
  /** 边框色 */
  border?: string
}

export interface OrbPosition {
  /** 距离底部的距离 */
  bottom?: number | string
  /** 距离右侧的距离 */
  right?: number | string
  /** 距离左侧的距离 (与 right 二选一) */
  left?: number | string
  /** 距离顶部的距离 (与 bottom 二选一) */
  top?: number | string
}

// 默认橙红色主题 (Sunset)
const DEFAULT_COLORS: OrbColors = {
  primary: "#FF7621",
  glow: "#FFCD43",
  secondary: "#FF9800",
  border: "rgba(255, 118, 33, 0.5)",
}

// 默认位置：右下角
const DEFAULT_POSITION: OrbPosition = {
  bottom: 100,
  right: 40,
}

export default function OrbNotification({
  isOpen,
  onClose,
  children,
  colors = DEFAULT_COLORS,
  size = 64,
  position = DEFAULT_POSITION,
  autoExpand = false,
  autoExpandDelay = 2000,
  enterDirection = "bottom",
  title = "小思助手",
  subtitle,
  orbIcon,
  orbHint,
  showPulse = true,
  maxWidth = 480,
  maxHeight = 600,
  onOrbClick,
  onExpandComplete,
  onCollapseComplete,
}: OrbNotificationProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasAutoExpanded, setHasAutoExpanded] = useState(false)

  // 重置状态当 isOpen 变化时
  useEffect(() => {
    if (!isOpen) {
      setIsExpanded(false)
      setHasAutoExpanded(false)
    }
  }, [isOpen])

  // 自动展开逻辑
  useEffect(() => {
    if (isOpen && autoExpand && !hasAutoExpanded && !isExpanded) {
      const timer = setTimeout(() => {
        setIsExpanded(true)
        setHasAutoExpanded(true)
        onExpandComplete?.()
      }, autoExpandDelay)
      return () => clearTimeout(timer)
    }
  }, [isOpen, autoExpand, autoExpandDelay, hasAutoExpanded, isExpanded, onExpandComplete])

  // 处理小球点击
  const handleOrbClick = useCallback(() => {
    onOrbClick?.()
    if (!isExpanded) {
      setIsExpanded(true)
      onExpandComplete?.()
    }
  }, [isExpanded, onOrbClick, onExpandComplete])

  // 处理关闭
  const handleClose = useCallback(() => {
    setIsExpanded(false)
    setTimeout(() => {
      onClose()
      onCollapseComplete?.()
    }, 300)
  }, [onClose, onCollapseComplete])

  // 从中心展开的动画（模拟从蓝色球体中心出现）
  const enterVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
      }
    }
  }

  // 构建位置样式 - 在输入框上方、大球底部
  const positionStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 9999,
    bottom: 120, // 距离底部输入框上方
    left: "50%",
    transform: "translateX(-50%)",
  }

  // 渐变背景
  const gradientBg = `linear-gradient(135deg, ${colors.primary}, ${colors.secondary || colors.glow})`

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={positionStyle}>
          {/* ========== 小球状态 ========== */}
          <AnimatePresence>
            {!isExpanded && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit={{ scale: 0, opacity: 0 }}
                variants={enterVariants}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
              >
                {/* 小球主体容器 */}
                <motion.button
                  onClick={handleOrbClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: size,
                    height: size,
                    position: "relative",
                    cursor: "pointer",
                    background: "transparent",
                    border: "none",
                    padding: 0,
                  }}
                >
                  {/* 脉动光晕层 */}
                  {showPulse && (
                    <motion.div
                      style={{
                        position: "absolute",
                        inset: -size * 0.1,
                        borderRadius: "50%",
                        background: `${colors.glow}40`,
                        pointerEvents: "none",
                      }}
                      animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.4, 0.7, 0.4],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  {/* 核心球体 - 亮橙色实心 */}
                  <div
                    style={{
                      position: "absolute",
                      inset: size * 0.1,
                      borderRadius: "50%",
                      background: colors.primary,
                      opacity: 0.9,
                      boxShadow: `0 0 ${size * 0.3}px ${colors.glow}80, 0 0 ${size * 0.5}px ${colors.primary}40`,
                    }}
                  />

                  {/* 外环 - 白色半透明 */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.6)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* 内环 - 白色更透明 */}
                  <div
                    style={{
                      position: "absolute",
                      inset: size * 0.15,
                      borderRadius: "50%",
                      border: "1.5px solid rgba(255,255,255,0.4)",
                      pointerEvents: "none",
                    }}
                  />
                </motion.button>

                {/* 提示文字 */}
                {orbHint && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{
                      position: "absolute",
                      top: -36,
                      left: "50%",
                      transform: "translateX(-50%",
                      whiteSpace: "nowrap",
                      padding: "6px 12px",
                      borderRadius: 12,
                      background: "rgba(0,0,0,0.8)",
                      color: colors.glow,
                      fontSize: 13,
                      fontWeight: 500,
                      boxShadow: `0 0 10px ${colors.glow}40`,
                    }}
                  >
                    {orbHint}
                    {/* 小三角 */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: -6,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 0,
                        height: 0,
                        borderLeft: "6px solid transparent",
                        borderRight: "6px solid transparent",
                        borderTop: "6px solid rgba(0,0,0,0.8)",
                      }}
                    />
                  </motion.div>
                )}

              </motion.div>
            )}
          </AnimatePresence>

          {/* ========== 展开状态（聊天窗口） ========== */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ width: size, height: size, borderRadius: size / 2, opacity: 0 }}
                animate={{
                  width: maxWidth,
                  height: "auto",
                  maxHeight,
                  borderRadius: 20,
                  opacity: 1,
                }}
                exit={{ width: size, height: size, borderRadius: size / 2, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                style={{
                  background: "rgba(10, 15, 20, 0.95)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: `1px solid ${colors.border || colors.glow}50`,
                  boxShadow: `
                    0 25px 60px rgba(0,0,0,0.5),
                    0 0 30px ${colors.glow}30,
                    inset 0 1px 0 rgba(255,255,255,0.1)
                  `,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* 渐变边框光效 */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 20,
                    padding: "1px",
                    background: `linear-gradient(135deg, ${colors.primary}80, ${colors.glow}40, rgba(255,255,255,0.2), ${colors.primary}30)`,
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    pointerEvents: "none",
                  }}
                />

                {/* 头部 */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    background: `linear-gradient(90deg, ${colors.primary}10, transparent)`,
                  }}
                >
                  {/* 左侧：头像和标题 */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* 小头像 */}
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: gradientBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 0 15px ${colors.glow}50`,
                      }}
                    >
                      <Sparkles size={20} color="white" />
                    </div>
                    {/* 标题区 */}
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          color: "white",
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        {title}
                      </h3>
                      {subtitle && (
                        <p
                          style={{
                            margin: "2px 0 0 0",
                            color: colors.glow,
                            fontSize: 12,
                          }}
                        >
                          {subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 关闭按钮 */}
                  <button
                    onClick={handleClose}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: "none",
                      background: "rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.6)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.2)"
                      e.currentTarget.style.color = "white"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.1)"
                      e.currentTarget.style.color = "rgba(255,255,255,0.6)"
                    }}
                  >
                    <X size={18} />
                  </button>
                </motion.div>

                {/* 内容区 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    padding: 20,
                    maxHeight: maxHeight - 80,
                    overflow: "auto",
                  }}
                >
                  {children}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  )
}

// ============================================
// 预设主题配置 - 方便快速使用
// ============================================

export const ORB_THEMES = {
  /** 橙红色 - Sunset */
  sunset: {
    primary: "#FF7621",
    glow: "#FFCD43",
    secondary: "#FF9800",
    border: "rgba(255, 118, 33, 0.5)",
  } as OrbColors,
  /** 青色 - Cosmic Blue */
  cosmicBlue: {
    primary: "#29B6F6",
    glow: "#4FC3F7",
    secondary: "#0288D1",
    border: "rgba(41, 182, 246, 0.5)",
  } as OrbColors,
  /** 紫色 - Violet */
  violet: {
    primary: "#9C27B0",
    glow: "#F066FF",
    secondary: "#D428FF",
    border: "rgba(156, 39, 176, 0.5)",
  } as OrbColors,
  /** 绿色 - Emerald */
  emerald: {
    primary: "#4CAF50",
    glow: "#80FF40",
    secondary: "#13DDB8",
    border: "rgba(76, 175, 80, 0.5)",
  } as OrbColors,
  /** 粉色 - Flamingo */
  flamingo: {
    primary: "#E91E63",
    glow: "#FF83C9",
    secondary: "#FF459F",
    border: "rgba(233, 30, 99, 0.5)",
  } as OrbColors,
  /** 红色 - Scarlet */
  scarlet: {
    primary: "#F44336",
    glow: "#DF2D2A",
    secondary: "#FF6750",
    border: "rgba(244, 67, 54, 0.5)",
  } as OrbColors,
}

// ============================================
// 预设位置配置
// ============================================

export const ORB_POSITIONS = {
  /** 右下角（默认） */
  bottomRight: { bottom: 100, right: 40 } as OrbPosition,
  /** 左下角 */
  bottomLeft: { bottom: 100, left: 40 } as OrbPosition,
  /** 右上角 */
  topRight: { top: 100, right: 40 } as OrbPosition,
  /** 左上角 */
  topLeft: { top: 100, left: 40 } as OrbPosition,
  /** 底部居中 */
  bottomCenter: { bottom: 100, left: "50%" } as OrbPosition,
}
