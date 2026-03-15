"use client"

import { useEffect, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, AlertCircle, CheckCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FuturisticPopupProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  type?: "info" | "success" | "warning" | "error"
  actionLabel?: string
  onAction?: () => void
  width?: string
  height?: string
}

export default function FuturisticPopup({
  isOpen,
  onClose,
  title = "System Notification",
  children,
  type = "info",
  actionLabel,
  onAction,
  width = "500px",
  height = "auto",
}: FuturisticPopupProps) {
  // 阻止滚动当弹窗打开时
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Define colors based on type
  const getTypeColors = () => {
    switch (type) {
      case "success":
        return {
          primary: "#FFFFFF",
          secondary: "#FFFFFF",
          icon: <CheckCircle size={24} />,
        }
      case "warning":
        return {
          primary: "#FFD700",
          secondary: "#FFFFFF",
          icon: <AlertCircle size={24} />,
        }
      case "error":
        return {
          primary: "#FF4D4D",
          secondary: "#FFFFFF",
          icon: <AlertCircle size={24} />,
        }
      case "info":
      default:
        return {
          primary: "#FFFFFF",
          secondary: "#FFFFFF",
          icon: <Info size={24} />,
        }
    }
  }

  const { primary, secondary, icon } = getTypeColors()

  // Gradient styles
  const gradientStyle = {
    background: `linear-gradient(to right, ${primary}, ${secondary})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent",
  }

  // Border gradient
  const borderGradient = {
    borderColor: `${primary}50`,
  }

  // Header gradient
  const headerGradient = {
    background: `linear-gradient(90deg, ${primary}20, ${primary}05)`,
    borderBottom: `1px solid ${primary}30`,
  }

  // Glossy reflection
  const glossyReflection = {
    background: `linear-gradient(135deg, ${primary}10 0%, transparent 50%, ${primary}05 100%)`,
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2147483647, // 最大 z-index
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop with blur */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Popup Container */}
          <motion.div
            style={{
              position: "relative",
              width,
              height,
              zIndex: 2147483647,
            }}
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main popup container */}
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderRadius: 16,
                overflow: "hidden",
                position: "relative",
                outline: "1px solid rgba(255, 255, 255, 0.2)",
                ...borderGradient,
              }}
            >
              {/* Animated glowing border effect */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 16,
                  overflow: "hidden",
                  pointerEvents: "none",
                }}
              >
                {/* Top border glow */}
                <motion.div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 1,
                    background: `linear-gradient(90deg, transparent, ${primary}70, transparent)`,
                    boxShadow: `0 0 5px ${primary}30, 0 0 10px ${primary}20`,
                  }}
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Right border glow */}
                <motion.div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: 1,
                    background: `linear-gradient(180deg, transparent, ${primary}70, transparent)`,
                    boxShadow: `0 0 5px ${primary}30, 0 0 10px ${primary}20`,
                  }}
                  initial={{ y: "-100%" }}
                  animate={{ y: "100%" }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 1,
                  }}
                />

                {/* Bottom border glow */}
                <motion.div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 1,
                    background: `linear-gradient(270deg, transparent, ${primary}70, transparent)`,
                    boxShadow: `0 0 5px ${primary}30, 0 0 10px ${primary}20`,
                  }}
                  initial={{ x: "100%" }}
                  animate={{ x: "-100%" }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 2,
                  }}
                />

                {/* Left border glow */}
                <motion.div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: 1,
                    background: `linear-gradient(0deg, transparent, ${primary}70, transparent)`,
                    boxShadow: `0 0 5px ${primary}30, 0 0 10px ${primary}20`,
                  }}
                  initial={{ y: "100%" }}
                  animate={{ y: "-100%" }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 3,
                  }}
                />
              </div>

              {/* Glossy reflection overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  borderRadius: 16,
                  ...glossyReflection,
                }}
              />

              {/* Animated scanning line */}
              <motion.div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0.2,
                  pointerEvents: "none",
                  backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 5px, ${primary} 5px, ${primary} 6px)`,
                  backgroundSize: "100% 10px",
                }}
                initial={{ backgroundPosition: "0% 0%" }}
                animate={{ backgroundPosition: "0% 100%" }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              {/* Animated border glow */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 16,
                  pointerEvents: "none",
                }}
              >
                <motion.div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 16,
                    boxShadow: `0 0 8px ${primary}30`,
                  }}
                  animate={{
                    boxShadow: [
                      `0 0 5px ${primary}20`,
                      `0 0 10px ${primary}40`,
                      `0 0 5px ${primary}20`,
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              {/* Header with Close Button */}
              <div
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "relative",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  ...headerGradient,
                }}
              >
                {/* Title in header */}
                <h2
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    margin: 0,
                    ...gradientStyle,
                  }}
                >
                  {title}
                </h2>

                {/* Close button */}
                <button
                  onClick={onClose}
                  style={{
                    padding: 6,
                    borderRadius: "50%",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    color: primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.4)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.2)"
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: 24 }}>
                {/* Animated underline */}
                <motion.div
                  style={{
                    height: 1,
                    background: `linear-gradient(to right, ${primary}, ${primary})`,
                    marginBottom: 16,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                />

                {/* Children content */}
                <div style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                  {children}
                </div>

                {/* Action button */}
                {actionLabel && (
                  <div style={{ marginTop: 50, display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      onClick={onAction}
                      style={{
                        backgroundColor: "white",
                        color: "#000",
                        fontWeight: "bold",
                        borderRadius: 200,
                        boxShadow: "0 0 15px rgba(255,255,255,0.5)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 20px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.9)"
                        e.currentTarget.style.boxShadow = "0 0 20px rgba(255,255,255,0.7)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "white"
                        e.currentTarget.style.boxShadow = "0 0 15px rgba(255,255,255,0.5)"
                      }}
                    >
                      <span>{actionLabel}</span>
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
