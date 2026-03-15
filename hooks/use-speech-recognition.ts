"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export type SpeechRecognitionStatus =
  | "idle"
  | "listening"
  | "processing"
  | "error"
  | "unsupported"

interface UseSpeechRecognitionOptions {
  lang?: string
  continuous?: boolean
  interimResults?: boolean
  onResult?: (text: string, isFinal: boolean) => void
  onError?: (error: string) => void
}

interface UseSpeechRecognitionReturn {
  status: SpeechRecognitionStatus
  transcript: string
  interimTranscript: string
  isListening: boolean
  isSupported: boolean
  error: string | null
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}

export function useSpeechRecognition({
  lang = "zh-CN",
  continuous = false,
  interimResults = true,
  onResult,
  onError,
}: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn {
  const [status, setStatus] = useState<SpeechRecognitionStatus>("idle")
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(true)

  const recognitionRef = useRef<any>(null)
  const isListening = status === "listening" || status === "processing"

  // 检查浏览器支持
  useEffect(() => {
    if (typeof window === "undefined") {
      setIsSupported(false)
      setStatus("unsupported")
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSupported(false)
      setStatus("unsupported")
      return
    }

    // 初始化识别器
    const recognition = new SpeechRecognition()
    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = lang
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setStatus("listening")
      setError(null)
    }

    recognition.onresult = (event: any) => {
      let finalTranscript = ""
      let interim = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript)
        onResult?.(finalTranscript, true)
      }

      if (interim) {
        setInterimTranscript(interim)
        onResult?.(interim, false)
      }
    }

    recognition.onerror = (event: any) => {
      const errorMessages: Record<string, string> = {
        "no-speech": "没有检测到语音，请重试",
        "audio-capture": "无法访问麦克风",
        "not-allowed": "麦克风权限被拒绝",
        "network": "网络错误，请检查网络连接",
        "aborted": "识别已取消",
        "language-not-supported": "不支持该语言",
      }

      const message = errorMessages[event.error] || `识别错误: ${event.error}`
      setError(message)
      setStatus("error")
      onError?.(message)
    }

    recognition.onend = () => {
      setStatus((current) => current !== "error" ? "idle" : "error")
      setInterimTranscript("")
    }

    recognitionRef.current = recognition

    return () => {
      try {
        recognition.abort()
      } catch {
        // ignore
      }
    }
  }, []) // 只在挂载时初始化

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return
    try {
      setTranscript("")
      setInterimTranscript("")
      setError(null)
      recognitionRef.current.start()
    } catch (err) {
      // 如果已经在运行，先停止再重新开始
      try {
        recognitionRef.current.stop()
        setTimeout(() => {
          recognitionRef.current?.start()
        }, 100)
      } catch {
        setError("启动语音识别失败")
        setStatus("error")
      }
    }
  }, [])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.stop()
    } catch {
      // ignore
    }
    setStatus("idle")
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript("")
    setInterimTranscript("")
    setError(null)
  }, [])

  return {
    status,
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  }
}
