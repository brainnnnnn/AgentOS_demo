"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Mic, MicOff, Send, Loader2 } from "lucide-react"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"

interface VoiceInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  placeholder?: string
  accentColor: string
  disabled?: boolean
  isLoading?: boolean
  variant?: "default" | "homepage" // 添加样式变体
}

export function VoiceInput({
  value,
  onChange,
  onSend,
  placeholder = "你可以问我任何问题...",
  accentColor,
  disabled = false,
  isLoading = false,
  variant = "default",
}: VoiceInputProps) {
  const isHomepage = variant === "homepage"
  const [isComposing, setIsComposing] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const valueRef = useRef(value)
  const onSendRef = useRef(onSend)
  const onChangeRef = useRef(onChange)

  // 保持 ref 最新
  useEffect(() => {
    valueRef.current = value
  }, [value])

  useEffect(() => {
    onSendRef.current = onSend
  }, [onSend])

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // 使用 ref 来处理 ASR 结果，避免闭包问题
  const handleASRResult = useCallback((text: string, isFinal: boolean) => {
    if (isFinal) {
      const finalText = valueRef.current + text
      onChangeRef.current(finalText)
      // ASR 完成后自动发送
      if (finalText.trim()) {
        setTimeout(() => {
          onSendRef.current()
        }, 300)
      }
    }
  }, [])

  const {
    status,
    interimTranscript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    lang: "zh-CN",
    continuous: false,
    interimResults: true,
    onResult: handleASRResult,
  })

  // 显示错误提示
  useEffect(() => {
    if (error) {
      setErrorMsg(error)
      const timer = setTimeout(() => setErrorMsg(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    if (isListening) {
      stopListening()
    }
    onSend()
  }

  const toggleVoice = () => {
    if (!isSupported) {
      setErrorMsg("当前浏览器不支持语音输入，请使用 Chrome/Edge/Safari")
      return
    }

    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  // 显示文本：优先显示输入值，如果没有则显示临时识别结果
  const displayValue = value || interimTranscript

  return (
    <div style={{ position: "relative" }}>
      {/* 错误提示 */}
      {errorMsg && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "8px 16px",
            borderRadius: 20,
            background: "rgba(244,67,54,0.9)",
            color: "white",
            fontSize: 13,
            whiteSpace: "nowrap",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <MicOff size={14} />
          {errorMsg}
        </div>
      )}


      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px",
          paddingLeft: isHomepage ? "20px" : "20px",
          borderRadius: 9999,
          background: isListening
            ? `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`
            : isHomepage
              ? "rgba(255,255,255,0.12)"
              : "rgba(255,255,255,0.04)",
          border: isListening
            ? `1px solid ${accentColor}60`
            : isHomepage
              ? "1px solid rgba(255,255,255,0.2)"
              : "none",
          boxShadow: isHomepage
            ? "0 25px 50px rgba(0,0,0,0.3), 0 0 15px rgba(255,255,255,0.05)"
            : "none",
          transition: "all 0.3s ease",
        }}
      >
        {/* 输入框容器 */}
        <div style={{ flex: 1, position: "relative" }}>
          {/* 输入框 */}
          <input
            type="text"
            value={displayValue}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder={isListening ? "请说话..." : placeholder}
            disabled={disabled || isLoading}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: 15,
              fontFamily: "inherit",
              padding: 0,
              height: 24,
              lineHeight: "24px",
            }}
          />
        </div>

        {/* 语音按钮 - 放在右侧 */}
        <button
          onClick={toggleVoice}
          disabled={disabled || isLoading}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isListening ? accentColor : "transparent",
            border: isListening ? "none" : "1px solid rgba(255,255,255,0.2)",
            color: isListening ? "white" : "rgba(255,255,255,0.6)",
            cursor: disabled || isLoading ? "not-allowed" : "pointer",
            opacity: disabled || isLoading ? 0.3 : 1,
            transition: "all 0.2s",
            flexShrink: 0,
          }}
          title={isListening ? "停止录音" : "语音输入"}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>

        {/* 发送按钮 */}
        <button
          onClick={handleSend}
          disabled={!displayValue.trim() || isLoading || disabled}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              displayValue.trim() && !isLoading && !disabled
                ? accentColor
                : "rgba(255,255,255,0.15)",
            border: "none",
            cursor:
              displayValue.trim() && !isLoading && !disabled
                ? "pointer"
                : "not-allowed",
            opacity: displayValue.trim() && !isLoading && !disabled ? 1 : 0.5,
            transition: "all 0.2s",
            flexShrink: 0,
          }}
        >
          {isLoading ? (
            <Loader2
              size={16}
              style={{
                color: "white",
                animation: "spin 1s linear infinite",
              }}
            />
          ) : (
            <Send size={16} style={{ color: "white" }} />
          )}
        </button>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
