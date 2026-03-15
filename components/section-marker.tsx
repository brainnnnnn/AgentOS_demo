"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, Sphere } from "@react-three/drei"
import * as THREE from "three"
import { useLanguage } from "./language-provider"
import type { Section } from "@/lib/content"
import { motion, useAnimation } from "framer-motion"

// 根据区块索引返回数字 (01, 02, 03, 04)
const getSectionNumber = (index: number) => {
  return `${(index + 1).toString().padStart(2, "0")}`
}

// 组件接口添加 index 属性
interface OrbitConfig {
  radius: number
  tiltX: number
  tiltY: number
  tiltZ: number
  speed: number
  startAngle: number
  color: string
}

interface SectionMarkerProps {
  section: Section
  onClick: () => void
  isActive: boolean
  anyActive: boolean
  orbitConfig: OrbitConfig
  index?: number // 区块索引
  isVisible?: boolean // 标签显示状态
  updatePosition?: (position: THREE.Vector3) => void // 位置更新回调
}

// SectionMarker 函数参数添加 index
export default function SectionMarker({
  section,
  onClick,
  isActive,
  anyActive,
  orbitConfig,
  index = 0,
  isVisible = true, // 默认显示
  updatePosition,
}: SectionMarkerProps) {
  const [hovered, setHovered] = useState(false)
  const { t, language } = useLanguage()
  const markerRef = useRef<THREE.Mesh>(null)
  const pulseRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.PointLight>(null)
  const orbitRef = useRef<THREE.Group>(null)
  const labelGroupRef = useRef<THREE.Group>(null)
  const controls = useAnimation()

  // 标签透明度动画状态
  const [labelVisible, setLabelVisible] = useState(false)

  // isVisible 变化时应用动画
  useEffect(() => {
    if (isVisible) {
      controls.start({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.5 },
      })
    } else {
      controls.start({
        opacity: 0,
        scale: 0.8,
        y: -10,
        transition: { duration: 0.3 },
      })
    }
  }, [isVisible, controls])

  // 生成轨道路径点
  const orbitPoints = useMemo(() => {
    const points = []
    const segments = 128

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      const x = Math.cos(angle) * orbitConfig.radius
      const z = Math.sin(angle) * orbitConfig.radius
      points.push(new THREE.Vector3(x, 0, z))
    }

    return points
  }, [orbitConfig.radius])

  // 创建轨道线
  const orbitLine = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(orbitPoints)
    return geometry
  }, [orbitPoints])

  // 计算标记颜色
  const markerColor = isActive ? "#FFFFFF" : hovered ? "#FFFFFF" : orbitConfig.color
  const glowIntensity = isActive ? 2.5 : hovered ? 2 : 1.5

  // 更新标记位置和动画
  useFrame(({ clock }) => {
    if (orbitRef.current) {
      // 应用轨道倾斜
      orbitRef.current.rotation.x = orbitConfig.tiltX
      orbitRef.current.rotation.y = orbitConfig.tiltY
      orbitRef.current.rotation.z = orbitConfig.tiltZ
    }

    if (markerRef.current) {
      // 沿轨道移动标记
      const time = clock.getElapsedTime() * orbitConfig.speed + orbitConfig.startAngle
      const x = Math.cos(time) * orbitConfig.radius
      const z = Math.sin(time) * orbitConfig.radius
      markerRef.current.position.x = x
      markerRef.current.position.z = z

      // 마커가 항상 중앙을 바라보도록 설정
      markerRef.current.lookAt(0, 0, 0)

      // 设置 renderOrder 使标记显示在轨道上方
      markerRef.current.renderOrder = 1

      // 调用标记位置更新回调
      if (updatePosition) {
        updatePosition(markerRef.current.position)
      }
    }

    if (pulseRef.current && markerRef.current) {
      // 同步脉冲效果位置
      pulseRef.current.position.copy(markerRef.current.position)

      // 脉冲效果大小动画
      const scale =
        hovered || isActive
          ? 1 + Math.sin(clock.getElapsedTime() * 4) * 0.2
          : 1 + Math.sin(clock.getElapsedTime() * 2) * 0.1

      pulseRef.current.scale.setScalar(scale)

      // 设置 renderOrder
      pulseRef.current.renderOrder = 1
    }

    if (ringRef.current && markerRef.current) {
      // 同步环位置
      ringRef.current.position.copy(markerRef.current.position)

      // 环旋转动画
      ringRef.current.rotation.z += 0.01
      ringRef.current.rotation.x += 0.005

      // 设置 renderOrder
      ringRef.current.renderOrder = 1
    }

    // 发光效果动画
    if (glowRef.current && markerRef.current) {
      // 同步发光位置
      glowRef.current.position.copy(markerRef.current.position)

      // 发光强度动画
      const baseIntensity = isActive ? 2.5 : hovered ? 2 : 1.5
      glowRef.current.intensity = baseIntensity + Math.sin(clock.getElapsedTime() * 3) * 0.5
    }

    // 同步标签组位置
    if (labelGroupRef.current && markerRef.current) {
      labelGroupRef.current.position.copy(markerRef.current.position)
      // 라벨이 항상 카메라를 향하도록 설정
      labelGroupRef.current.lookAt(0, 0, 0)
    }
  })

  return (
    <group ref={orbitRef}>
      {/* 轨道路径可视化 - 增加粗细 */}
      {/* @ts-expect-error: @react-three/fiber JSX types conflict with React SVG types */}
      <line geometry={orbitLine} renderOrder={0}>
        <lineDashedMaterial
          color="#4FC3F7"
          dashSize={0.5}
          gapSize={0.3}
          opacity={0.3}
          transparent
          linewidth={2} // 1에서 2로 증가
          depthWrite={false}
        />
      </line>

      {/* 标记主体 */}
      <Sphere
        ref={markerRef}
        args={[0.25, 16, 16]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        renderOrder={1}
      >
        <meshBasicMaterial color={markerColor} transparent opacity={0.9} />
      </Sphere>

      {/* 脉冲效果 */}
      <Sphere ref={pulseRef} args={[0.32, 16, 16]} renderOrder={1}>
        <meshBasicMaterial color={markerColor} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </Sphere>

      {/* 旋转的环 - 颜色始终设为白色 */}
      <group ref={ringRef} renderOrder={1}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.38, 32]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.3, 0.33, 32]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 发光效果 - 颜色保持标记颜色 */}
      <pointLight ref={glowRef} color={markerColor} intensity={glowIntensity} distance={3.0} />

      {/* Label removed */}
    </group>
  )
}
