"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import FuturisticPopup from "./futuristic-popup"

interface DemoItem {
  id: string
  title: string
  description: string
  path: string
  color: string
}

const DEMOS: DemoItem[] = [
  {
    id: "popup",
    title: "未来感弹窗",
    description: "科幻风格的发光边框弹窗组件",
    path: "/popup-demo",
    color: "#29B6F6",
  },
  {
    id: "orb",
    title: "小球通知组件",
    description: "飞入动画、脉动等待、点击展开",
    path: "/orb-demo",
    color: "#FF7621",
  },
]

export default function DemoEntrance() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* 弹窗 - 使用 futuristic-popup，由外部触发 */}
      <FuturisticPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Component Demos"
        type="info"
        width="400px"
      >
        <div style={{ padding: "8px 0" }}>
          {/* 简洁的列表风格 - 参考 animejs */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {DEMOS.map((demo) => (
              <Link
                key={demo.id}
                href={demo.path}
                onClick={() => setIsOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: 8,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent"
                }}
              >
                {/* 彩色圆点指示器 */}
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: demo.color,
                    flexShrink: 0,
                    boxShadow: `0 0 8px ${demo.color}60`,
                  }}
                />

                {/* 标题 */}
                <span
                  style={{
                    flex: 1,
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 15,
                    fontWeight: 500,
                  }}
                >
                  {demo.title}
                </span>

                {/* 箭头 */}
                <ArrowRight
                  size={18}
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    transition: "transform 0.2s ease, color 0.2s ease",
                  }}
                />
              </Link>
            ))}
          </div>

          {/* 底部提示 */}
          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 12,
                margin: 0,
              }}
            >
              点击列表项在新页面打开
            </p>
          </div>
        </div>
      </FuturisticPopup>
    </>
  )
}
