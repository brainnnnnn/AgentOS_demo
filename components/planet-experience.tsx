"use client"

import type React from "react"

import { useRef, useState, useEffect, forwardRef, useImperativeHandle, useCallback, useMemo } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { Stars, OrbitControls, PerspectiveCamera, Sparkles } from "@react-three/drei"
import type { OrbitControls as OrbitControlsType } from "three-stdlib"
import * as THREE from "three"
import Planet from "./planet"
import ContentPanel from "./content-panel"
import { useLanguage } from "./language-provider"
import { sections, type Section } from "@/lib/content"
import { PlanetAnimationController } from "./intro-animation"
// Import Theme type
import { type Theme, themes } from "@/lib/themes"
import type gsap from "gsap"

// Scene setup component - kept within the same file
function SceneSetup({ activeSection, theme }: { activeSection: string | null; theme: Theme }) {
  const { scene } = useThree()

  // Add fog to the scene
  useEffect(() => {
    scene.fog = new THREE.FogExp2("#000", 0.015)

    return () => {
      scene.fog = null
    }
  }, [scene])

  // Directional light to simulate sun
  const directionalLightRef = useRef<THREE.DirectionalLight>(null)

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight ref={directionalLightRef} position={[10, 5, 10]} intensity={1.5} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={theme.accentColor} />

      {/* 使行星发光的中央光源 - 增强亮度 */}
      <pointLight position={[0, 0, 0]} intensity={5} color={theme.planetColor} distance={15} />

      {/* 额外光源产生更强的发光效果 */}
      <pointLight position={[0, 0, 0]} intensity={3} color={theme.glowColor} distance={10} />

      {/* Volumetric light beam */}
      {activeSection && (
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={0.8}
          intensity={1}
          color={theme.glowColor}
          distance={20}
          castShadow
        />
      )}

      {/* Particle effects */}
      <Sparkles count={100} scale={20} size={1} speed={0.3} color={theme.orbitColor} opacity={0.5} />
      <Sparkles count={50} scale={30} size={2} speed={0.1} color={theme.starColor} opacity={0.3} />
    </>
  )
}

// Background stars that move slowly - kept within the same file
function MovingStars({ theme }: { theme: Theme }) {
  const starsRef = useRef<THREE.Points>(null)

  useFrame(({ clock }) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = clock.getElapsedTime() * 0.01
    }
  })

  return (
    <>
      <Stars
        ref={starsRef}
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
        // @ts-expect-error: color prop type mismatch in @react-three/drei Stars
        color={theme.starColor}
      />
      {/* 额外星星图层 */}
      <Stars radius={150} depth={100} count={3000} factor={6} saturation={0} fade speed={0.5}
        // @ts-expect-error: color prop type mismatch in @react-three/drei Stars
        color={theme.starColor}
      />
    </>
  )
}

// Camera controller for smooth transitions - kept within the same file
function CameraController({
  activeSection,
  sectionPositions,
  isIntroActive,
}: {
  activeSection: string | null
  sectionPositions: Record<string, THREE.Vector3>
  isIntroActive: boolean
}) {
  const { camera } = useThree()
  const controlsRef = useRef<OrbitControlsType>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)

  // Set initial camera position for intro
  useEffect(() => {
    if (isIntroActive) {
      // Position camera for intro - closer to the planet
      camera.position.set(0, 0, 15)
      camera.lookAt(0, 0, 0)
    }
  }, [camera, isIntroActive])

  useEffect(() => {
    if (!controlsRef.current) return

    // Disable controls during intro
    (controlsRef.current as unknown as { enabled: boolean }).enabled = !isIntroActive && !activeSection

    if (activeSection && sectionPositions[activeSection]) {
      const targetPosition = sectionPositions[activeSection].clone()
      const distance = 8 // Closer zoom distance when focusing on a section

      // Calculate direction
      const direction = targetPosition.clone().normalize()
      const finalPosition = direction.multiplyScalar(distance)

      // Animate camera position
      camera.position.copy(finalPosition)
      camera.lookAt(0, 0, 0)
    } else if (!isIntroActive) {
      // Reset camera position when no section is active and not in intro
      camera.position.set(0, 0, 25)
    }
  }, [activeSection, camera, sectionPositions, isIntroActive])

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={true}
      enablePan={false}
      minDistance={8}
      maxDistance={35}
      autoRotate={!isIntroActive && !activeSection}
      autoRotateSpeed={0.3}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
      dampingFactor={0.1}
      enableDamping
    />
  )
}

// Update the PlanetExperienceProps interface
interface PlanetExperienceProps {
  onLoaded: () => void
  sidebarOpen?: boolean
  sidebarWidth?: number
  isIntroActive?: boolean
  selectedTheme?: Theme
  onOpenChat?: (sectionId?: string) => void
  showOrangeMarker?: boolean
  onOrangeMarkerClick?: () => void
}

// Update the PlanetExperience component
const PlanetExperience = forwardRef<{ handleSectionClick: (sectionId: string) => void }, PlanetExperienceProps>(
  ({ onLoaded, sidebarOpen = false, sidebarWidth = 0, isIntroActive = false, selectedTheme, onOpenChat, showOrangeMarker = false, onOrangeMarkerClick }, ref) => {
    const [activeSection, setActiveSection] = useState<string | null>(null)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [currentSection, setCurrentSection] = useState<Section | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera>(null)
    const planetRef = useRef<{ planetGroupRef: React.RefObject<THREE.Group> } | null>(null)
    const { t, language } = useLanguage()

    // 检测移动端环境
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }

      checkMobile()

      window.addEventListener("resize", checkMobile)

      return () => {
        window.removeEventListener("resize", checkMobile)
      }
    }, [])

    // Use the selected theme or default to the first theme
    const baseTheme = selectedTheme || themes[0]

    // 根据 activeSection 动态改变星球颜色
    const theme = useMemo(() => {
      const dynamicColor = (() => {
        if (activeSection === "homework") return "#FF9500" // 橙色
        if (activeSection === "sponsor") return "#78ffd6"  // 青绿色
        return baseTheme.planetColor // 默认蓝色
      })()

      return {
        ...baseTheme,
        planetColor: dynamicColor,
        glowColor: dynamicColor,
        accentColor: dynamicColor,
      }
    }, [activeSection, baseTheme])

    // Calculate section positions for camera targeting - use deterministic pseudo-random based on section id
    // to avoid hydration mismatch between SSR and client
    const sectionPositions = useMemo(() => {
      // Simple hash function for deterministic "random" values
      const hashString = (str: string): number => {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i)
          hash = ((hash << 5) - hash) + char
          hash = hash & hash // Convert to 32bit integer
        }
        return Math.abs(hash)
      }

      const pseudoRandom = (seed: number): number => {
        const x = Math.sin(seed) * 10000
        return x - Math.floor(x)
      }

      const positions = sections.reduce(
        (acc, section, index) => {
          const seed = hashString(section.id)

          // 各区块不同的轨道设置 - deterministic
          const orbitRadius = 7 + pseudoRandom(seed) * 1.5 // 半径在 7~8.5 之间

          // 各区块不同的轨道倾斜和旋转 - deterministic
          const orbitTiltX = (pseudoRandom(seed + 1) - 0.5) * Math.PI * 0.5
          const orbitTiltY = (pseudoRandom(seed + 2) - 0.5) * Math.PI * 0.5

          // 各区块不同的起始位置 - deterministic
          const startAngle = pseudoRandom(seed + 3) * Math.PI * 2

          // 计算轨道上的位置
          const x = Math.cos(startAngle) * orbitRadius
          const y = Math.sin(orbitTiltX) * orbitRadius * 0.2
          const z = Math.sin(startAngle) * orbitRadius

          // 应用旋转
          const rotatedX = x * Math.cos(orbitTiltY) - z * Math.sin(orbitTiltY)
          const rotatedZ = x * Math.sin(orbitTiltY) + z * Math.cos(orbitTiltY)

          acc[section.id] = new THREE.Vector3(rotatedX, y, rotatedZ)

          return acc
        },
        {} as Record<string, THREE.Vector3>,
      )

      // 添加橙色小球（作业模式）的位置 - 与 OrangeMarker 轨道配置匹配
      const orangeRadius = 8.5
      const orangeTiltX = 0.8
      const orangeTiltY = -0.5
      const orangeStartAngle = Math.PI

      const ox = Math.cos(orangeStartAngle) * orangeRadius
      const oy = Math.sin(orangeTiltX) * orangeRadius * 0.2
      const oz = Math.sin(orangeStartAngle) * orangeRadius

      const orangeRotatedX = ox * Math.cos(orangeTiltY) - oz * Math.sin(orangeTiltY)
      const orangeRotatedZ = ox * Math.sin(orangeTiltY) + oz * Math.cos(orangeTiltY)

      positions["homework"] = new THREE.Vector3(orangeRotatedX, oy, orangeRotatedZ)

      return positions
    }, []) // Empty dependency array - positions are fixed based on section IDs

    // 点击区块时显示弹窗
    const handleSectionClick = useCallback(
      (sectionId: string) => {
        console.log("Section clicked:", sectionId)
        // 空字符串表示关闭/重置
        if (!sectionId) {
          setActiveSection(null)
          setCurrentSection(null)
          setShowModal(false)
          return
        }
        // 所有section点击都打开聊天窗口，并传递sectionId
        setActiveSection(sectionId)
        onOpenChat?.(sectionId)
      },
      [onOpenChat],
    )

    // Note: Language change modal state preservation removed to prevent infinite loop
    // The modal state is already managed properly by handleSectionClick and handleClosePanel

    // Handle section change from modal
    const handleModalSectionChange = useCallback((sectionId: string) => {
      // Update active section without closing modal
      setActiveSection(sectionId)
      const sectionData = sections.find((s) => s.id === sectionId)
      if (sectionData) {
        setCurrentSection(sectionData)
      }
    }, [])

    // Expose the handleSectionClick method to parent components
    useImperativeHandle(
      ref,
      () => ({
        handleSectionClick,
        getPlanetRef: () => planetRef.current?.planetGroupRef || null,
      }),
      [handleSectionClick],
    )

    const handleClosePanel = useCallback(() => {
      setActiveSection(null)
      setShowModal(false)
      setCurrentSection(null)
    }, [])

    // 部署环境调试错误处理
    const handleCanvasError = useCallback((error: unknown) => {
      console.error("Canvas error:", error)
      console.log("Environment info:", {
        userAgent: navigator.userAgent,
        webglSupport: !!window.WebGLRenderingContext,
        webgl2Support: !!window.WebGL2RenderingContext,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: (navigator as any).deviceMemory,
        platform: navigator.platform,
      })
    }, [])

    // Update the Planet component to pass the theme props
    return (
      <>
        <Canvas
          className="w-full h-screen pointer-events-auto"
          shadows
          dpr={[1, 2]}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.5, // 增加色调映射曝光
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false, // 即使有性能问题也允许 fallback
            preserveDrawingBuffer: false,
            alpha: false,
            premultipliedAlpha: false,
            stencil: false,
            depth: true,
          }}
          onError={handleCanvasError}
          onCreated={({ gl, scene, camera }) => {
            console.log("Canvas created:", {
              renderer: gl.info.render,
              memory: gl.info.memory,
              capabilities: gl.capabilities,
            })
          }}
        >
          <color attach="background" args={["#000"]} />
          <fog attach="fog" args={["#000", 0, 40]} />

          <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 25]} fov={50} near={0.1} far={1000} />

          <SceneSetup activeSection={activeSection} theme={theme} />
          <MovingStars theme={theme} />

          {/* Add planet animation controller during intro */}
          {isIntroActive && planetRef.current?.planetGroupRef && (
            <PlanetAnimationController planetRef={planetRef.current.planetGroupRef} />
          )}

          <Planet
            ref={planetRef}
            onSectionClick={handleSectionClick}
            activeSection={activeSection}
            onLoaded={onLoaded}
            isIntroActive={isIntroActive}
            planetColor={theme.planetColor}
            glowColor={theme.glowColor}
            orbitColor={theme.orbitColor}
            isMobile={isMobile}
            showOrangeMarker={showOrangeMarker}
            onOrangeMarkerClick={() => handleSectionClick("homework")}
          />

          <CameraController
            activeSection={activeSection}
            sectionPositions={sectionPositions}
            isIntroActive={isIntroActive}
          />
        </Canvas>

        {/* 弹窗只在 showModal 状态为 true 时显示 - 现在使用小思对话框，此弹窗已禁用 */}
        {/* {showModal && currentSection && (
          <ContentPanel
            section={currentSection}
            onClose={handleClosePanel}
            onSectionChange={handleModalSectionChange}
            sidebarOpen={sidebarOpen}
            sidebarWidth={sidebarWidth}
            theme={theme}
            useDefaultUIColor={true}
          />
        )} */}
      </>
    )
  },
)

PlanetExperience.displayName = "PlanetExperience"

export default PlanetExperience
