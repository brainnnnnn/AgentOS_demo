"use client"

import { useCallback } from "react"
import { useRef, useState, useEffect, useMemo, forwardRef, useImperativeHandle } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Sphere } from "@react-three/drei"
import * as THREE from "three"
import { sections } from "@/lib/content"
import SectionMarker from "./section-marker"
import PulsingGlow from "./pulsing-glow"
import PlanetCountdown from "./planet-countdown"

interface PlanetProps {
  onSectionClick: (sectionId: string) => void
  activeSection: string | null
  onLoaded: () => void
  isIntroActive?: boolean
  planetColor?: string
  glowColor?: string
  orbitColor?: string
  isMobile?: boolean
  showOrangeMarker?: boolean
  onOrangeMarkerClick?: () => void
}

const Planet = forwardRef(
  (
    {
      onSectionClick,
      activeSection,
      onLoaded,
      isIntroActive = false,
      planetColor = "#92CBDA",
      glowColor = "#4FC3F7",
      orbitColor = "#4FC3F7",
      isMobile = false,
      showOrangeMarker = false,
      onOrangeMarkerClick,
    }: PlanetProps,
    ref,
  ) => {
    const planetGroupRef = useRef<THREE.Group>(null)
    const glowRef = useRef<THREE.Mesh | null>(null)
    const innerGlowRef = useRef<THREE.PointLight>(null)
    const secondaryGlowRef = useRef<THREE.PointLight>(null)
    const planetOccluderRef = useRef<THREE.Mesh>(null)
    const { scene, camera, gl } = useThree()

    // 向父组件暴露 planet group ref
    useImperativeHandle(ref, () => ({
      planetGroupRef,
    }))

    // 追踪最近标记的状态
    const [closestMarkers, setClosestMarkers] = useState<number[]>([0, 1])

    // 追踪相机视野中标记的状态
    const [visibleMarkers, setVisibleMarkers] = useState<number[]>([])

    // 检测相机移动的状态
    const [cameraHasMoved, setCameraHasMoved] = useState(false)
    const lastCameraPositionRef = useRef<THREE.Vector3>(new THREE.Vector3())

    // 检测移动端环境的状态
    const [isMobileState, setIsMobile] = useState(false)

    // 计算相机视锥体的引用
    const frustumRef = useRef(new THREE.Frustum())
    const projScreenMatrixRef = useRef(new THREE.Matrix4())

    // 创建射线检测器
    const raycasterRef = useRef(new THREE.Raycaster())

    // 行星半径（与遮挡器大小匹配）
    const planetRadius = 6.3

    // 创建大气层效果 - 安全分离
    const createAtmosphere = useCallback(() => {
      console.log("Creating atmosphere effect...")

      // 大气层效果着色器定义
      const atmosphereVertexShader = `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `
      const atmosphereFragmentShader = `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(glowColor, 1.0) * intensity;
        }
      `

      try {
        // 检查 Three.js 渲染器状态
        if (!gl || !gl.domElement) {
          console.warn("WebGL renderer is not available")
          return createFallbackAtmosphere()
        }

        // 获取 WebGL 上下文（从 Three.js 渲染器）
        const webglContext = gl.getContext()
        if (!webglContext) {
          console.warn("WebGL context is not available")
          return createFallbackAtmosphere()
        }

        // 创建大气层效果网格
        const atmosphereGeometry = new THREE.SphereGeometry(6.5, 32, 32)
        const atmosphereMaterial = new THREE.ShaderMaterial({
          vertexShader: atmosphereVertexShader,
          fragmentShader: atmosphereFragmentShader,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide,
          transparent: true,
          uniforms: {
            glowColor: { value: new THREE.Color(planetColor) },
          },
        })

        // 检查着色器编译状态
        atmosphereMaterial.needsUpdate = true

        const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
        atmosphereMesh.renderOrder = -1

        console.log("Atmosphere mesh created successfully")
        return atmosphereMesh
      } catch (error) {
        console.error("Error creating shader-based atmosphere:", error)
        return createFallbackAtmosphere()
      }
    }, [planetColor, gl])

    // 备用大气层效果创建函数
    const createFallbackAtmosphere = useCallback(() => {
      console.log("Creating fallback atmosphere...")

      try {
        const fallbackGeometry = new THREE.SphereGeometry(6.4, 16, 16)
        const fallbackMaterial = new THREE.MeshBasicMaterial({
          color: planetColor,
          transparent: true,
          opacity: 0.1,
          side: THREE.BackSide,
        })

        const fallbackMesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial)
        fallbackMesh.renderOrder = -1

        console.log("Fallback atmosphere created successfully")
        return fallbackMesh
      } catch (fallbackError) {
        console.error("Fallback atmosphere creation failed:", fallbackError)
        return null
      }
    }, [planetColor])

    // 组件挂载时设置加载状态
    useEffect(() => {
      console.log("Planet component mounting...")

      onLoaded()

      // 保存初始相机位置
      lastCameraPositionRef.current.copy(camera.position)

      // 检测移动端环境
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }

      // 初始检查
      checkMobile()

      // 添加窗口大小变化监听
      window.addEventListener("resize", checkMobile)

      // 创建大气层效果
      const atmosphereMesh = createAtmosphere()
      if (atmosphereMesh) {
        glowRef.current = atmosphereMesh
        scene.add(atmosphereMesh)
        console.log("Atmosphere mesh added to scene")
      }

      return () => {
        if (glowRef.current) {
          scene.remove(glowRef.current)

          // 清理内存
          if (glowRef.current.geometry) {
            glowRef.current.geometry.dispose()
          }
          if (glowRef.current.material) {
            if (Array.isArray(glowRef.current.material)) {
              glowRef.current.material.forEach((material) => material.dispose())
            } else {
              glowRef.current.material.dispose()
            }
          }

          console.log("Atmosphere mesh removed and disposed")
        }
        window.removeEventListener("resize", checkMobile)
      }
    }, [onLoaded, scene, camera, createAtmosphere])

    // 当 planetColor 变化时更新大气层颜色
    useEffect(() => {
      if (glowRef.current && glowRef.current.material) {
        try {
          if (glowRef.current.material instanceof THREE.ShaderMaterial) {
            // 更新基于着色器的大气层效果颜色
            if (glowRef.current.material.uniforms?.glowColor) {
              glowRef.current.material.uniforms.glowColor.value.set(planetColor)
              console.log("Shader atmosphere color updated to:", planetColor)
            }
          } else if (glowRef.current.material instanceof THREE.MeshBasicMaterial) {
            // 更新备用材质颜色
            glowRef.current.material.color.set(planetColor)
            console.log("Fallback atmosphere color updated to:", planetColor)
          }
        } catch (error) {
          console.error("Error updating atmosphere color:", error)
        }
      }
    }, [planetColor])

    // 各区块标记的轨道设置 - 更美观的布局
    const orbitalConfigs = useMemo(() => {
      // 计算均匀间隔
      const sectionCount = sections.length
      const angleStep = (Math.PI * 2) / sectionCount

      // 统一所有轨道半径
      const orbitRadius = 10.0

      // 根据 section ID 获取对应的颜色
      const getSectionColor = (sectionId: string) => {
        switch (sectionId) {
          case "sponsor":
            return "#39FF14" // 亮绿色 - 科学探索/游戏模式
          default:
            return orbitColor // 默认蓝色
        }
      }

      return sections.map((section, index) => {
        // 均匀分布起始角度
        const startAngle = index * angleStep

        // 多样化轨道倾斜以避免重叠
        const orbitTiltX = Math.sin(index * 0.7) * 0.5
        const orbitTiltY = Math.cos(index * 0.9) * 0.4
        const orbitTiltZ = Math.sin(index * 1.2) * 0.3

        // 设置模式化速度
        const orbitSpeed = 0.03 + Math.sin(index * 0.8) * 0.01

        return {
          radius: orbitRadius,
          tiltX: orbitTiltX,
          tiltY: orbitTiltY,
          tiltZ: orbitTiltZ,
          speed: orbitSpeed,
          startAngle: startAngle,
          color: getSectionColor(section.id),
        }
      })
    }, [orbitColor])

    // 保存标记位置的引用
    const markerPositionsRef = useRef<THREE.Vector3[]>(Array(sections.length).fill(new THREE.Vector3()))

    // 行星动画和效果
    useFrame(({ clock }) => {
      const time = clock.getElapsedTime()

      // 大气层效果旋转
      if (glowRef.current && !activeSection) {
        glowRef.current.rotation.y += 0.0005
      }

      // 脉冲效果的正弦波（0~1之间）
      const pulse = (Math.sin(time * 0.3) + 1) * 0.5

      // 直接使用提供的颜色
      const currentColor = new THREE.Color(planetColor)
      const pulseColor = new THREE.Color(planetColor).lerp(
        new THREE.Color().setRGB(currentColor.r * 1.2, currentColor.g * 1.2, currentColor.b * 1.2),
        pulse,
      )

      // 内部发光效果动画
      if (innerGlowRef.current) {
        // 更新颜色
        innerGlowRef.current.color.copy(pulseColor)
        // 脉冲效果强度变化
        innerGlowRef.current.intensity = 3.5 + pulse * 2
      }

      // 辅助发光效果动画
      if (secondaryGlowRef.current) {
        secondaryGlowRef.current.color.set(glowColor)
        secondaryGlowRef.current.intensity = 2 + pulse * 0.8
      }

      // 安全地更新大气层效果颜色
      if (glowRef.current && glowRef.current.material instanceof THREE.ShaderMaterial) {
        try {
          if (glowRef.current.material.uniforms?.glowColor) {
            glowRef.current.material.uniforms.glowColor.value.set(planetColor)
          }
        } catch (error) {
          // 静默处理着色器更新错误
        }
      }

      // 检测相机移动
      if (!cameraHasMoved) {
        // 检查相机是否移动了一定距离
        const cameraMovementThreshold = 0.5
        const distanceMoved = camera.position.distanceTo(lastCameraPositionRef.current)

        if (distanceMoved > cameraMovementThreshold) {
          setCameraHasMoved(true)
        }
      }

      // 更新相机视锥体
      projScreenMatrixRef.current.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
      frustumRef.current.setFromProjectionMatrix(projScreenMatrixRef.current)

      // 检查各标记是否在相机视野中
      const newVisibleMarkers: number[] = []

      markerPositionsRef.current.forEach((position, index) => {
        // 假设标记位置有小球体进行视野检查
        const sphere = new THREE.Sphere(position, 0.5)

        if (frustumRef.current.intersectsSphere(sphere)) {
          // 计算从相机到标记的方向向量
          const direction = position.clone().sub(camera.position).normalize()

          // 设置射线检测
          raycasterRef.current.set(camera.position, direction)

          // 计算到行星中心的距离
          const distanceToCenter = camera.position.distanceTo(new THREE.Vector3(0, 0, 0))

          // 计算到标记的距离
          const distanceToMarker = camera.position.distanceTo(position)

          // 只有当相机到行星中心的距离大于行星半径且标记不在行星后方时才显示
          if (distanceToCenter > planetRadius || distanceToMarker < distanceToCenter) {
            // 检查与行星球体的交集
            const planetSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), planetRadius)
            const ray = new THREE.Ray(camera.position, direction)
            const intersectionPoint = new THREE.Vector3()

            // 检查射线是否与行星相交
            const doesIntersect = ray.intersectSphere(planetSphere, intersectionPoint)

            // 计算到交点的距离
            const distanceToIntersection = doesIntersect
              ? camera.position.distanceTo(intersectionPoint)
              : Number.POSITIVE_INFINITY

            // 如果交点比标记远或不相交，则标记可见
            if (!doesIntersect || distanceToIntersection > distanceToMarker) {
              newVisibleMarkers.push(index)
            }
          }
        }
      })

      // 更新视野中的标记
      if (JSON.stringify(newVisibleMarkers) !== JSON.stringify(visibleMarkers)) {
        setVisibleMarkers(newVisibleMarkers)
      }

      // 当没有激活区块时计算最近标记（在移动端无需检测相机移动）
      if (!activeSection && (cameraHasMoved || isMobileState)) {
        // 计算到各标记的距离
        const distances = markerPositionsRef.current.map((position, index) => {
          // 计算从相机到标记的距离
          const distance = camera.position.distanceTo(position)
          return { index, distance }
        })

        // 按距离排序
        distances.sort((a, b) => a.distance - b.distance)

        // 在移动端显示更多标记（3个）
        const numMarkersToShow = isMobileState ? 3 : 2

        // 提取最近标记索引
        const newClosestMarkers = distances.slice(0, numMarkersToShow).map((item) => item.index)

        // 仅当状态变化时更新
        if (
          newClosestMarkers.length !== closestMarkers.length ||
          newClosestMarkers.some((marker, idx) => marker !== closestMarkers[idx])
        ) {
          setClosestMarkers(newClosestMarkers)
        }
      }

      // 保存当前相机位置
      lastCameraPositionRef.current.copy(camera.position)
    })

    // 更新标记位置函数
    const updateMarkerPosition = (index: number, position: THREE.Vector3) => {
      markerPositionsRef.current[index] = position.clone()
    }

    // 更新 isMobile 状态
    useEffect(() => {
      setIsMobile(isMobile)
    }, [isMobile])

    // 检查是否应显示标记的函数
    const shouldShowMarker = (index: number) => {
      // 有激活区块时隐藏所有标记
      if (activeSection !== null) return false

      // 在移动端只显示视野中的标记
      if (isMobileState) {
        return visibleMarkers.includes(index)
      }

      // 在桌面端显示最近标记
      return closestMarkers.includes(index)
    }

    return (
      <group ref={planetGroupRef}>
        {/* 增强的引导脉冲光晕 */}
        <PulsingGlow
          active={isIntroActive}
          color={planetColor}
          intensity={5}
          distance={25}
          pulseSpeed={1.2}
          pulseIntensity={2}
        />

        {/* 常规发光效果 */}
        <pointLight ref={innerGlowRef} position={[0, 0, 0]} intensity={5} color={planetColor} distance={20} />
        <pointLight ref={secondaryGlowRef} position={[0, 0, 0]} intensity={3} color={glowColor} distance={30} />

        {/* 行星遮挡器 */}
        <Sphere ref={planetOccluderRef} args={[planetRadius, 32, 32]}>
          <meshBasicMaterial color={planetColor} transparent opacity={0.05} depthWrite={true} colorWrite={true} />
        </Sphere>

        {/* 区块标记 */}
        {!isIntroActive &&
          !activeSection &&
          sections.map((section, index) => (
            <SectionMarker
              key={section.id}
              section={section}
              onClick={() => onSectionClick(section.id)}
              isActive={activeSection === section.id}
              anyActive={activeSection !== null}
              orbitConfig={orbitalConfigs[index]}
              index={index}
              isVisible={shouldShowMarker(index)}
              updatePosition={(position) => updateMarkerPosition(index, position)}
            />
          ))}

        {/* 橙色小球 - 关闭弹窗后加入轨道 */}
        {!isIntroActive && !activeSection && showOrangeMarker && (
          <OrangeMarker onClick={onOrangeMarkerClick} />
        )}

        {/* 行星中央倒计时器 */}
        {!isIntroActive && !activeSection && (
          <PlanetCountdown
            position={[0, 0, 0]}
            color={planetColor}
            planetRadius={planetRadius}
            scale={1.5}
            onSectionClick={() => onSectionClick("hero")}
          />
        )}
      </group>
    )
  },
)

// 橙色小球组件 - 关闭弹窗后围绕大球旋转
function OrangeMarker({ onClick }: { onClick?: () => void }) {
  const markerRef = useRef<THREE.Mesh>(null)
  const pulseRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.PointLight>(null)
  const orbitRef = useRef<THREE.Group>(null)

  // 橙色小球轨道配置 - 独立轨道
  const orbitConfig = useMemo(() => ({
    radius: 8.5,
    tiltX: 0.8,
    tiltY: -0.5,
    tiltZ: 0.3,
    speed: 0.025,
    startAngle: Math.PI,
    color: "#FF8800",
  }), [])

  // 橙色主题色
  const orangeColor = "#FF8800"
  const orangeGlow = "#FFAA33"

  useFrame(({ clock }) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.x = orbitConfig.tiltX
      orbitRef.current.rotation.y = orbitConfig.tiltY
      orbitRef.current.rotation.z = orbitConfig.tiltZ
    }

    if (markerRef.current) {
      const time = clock.getElapsedTime() * orbitConfig.speed + orbitConfig.startAngle
      const x = Math.cos(time) * orbitConfig.radius
      const z = Math.sin(time) * orbitConfig.radius
      markerRef.current.position.x = x
      markerRef.current.position.z = z
      markerRef.current.lookAt(0, 0, 0)
      markerRef.current.renderOrder = 1
    }

    if (pulseRef.current && markerRef.current) {
      pulseRef.current.position.copy(markerRef.current.position)
      const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.1
      pulseRef.current.scale.setScalar(scale)
      pulseRef.current.renderOrder = 1
    }

    if (ringRef.current && markerRef.current) {
      ringRef.current.position.copy(markerRef.current.position)
      ringRef.current.rotation.z += 0.01
      ringRef.current.rotation.x += 0.005
      ringRef.current.renderOrder = 1
    }

    if (glowRef.current && markerRef.current) {
      glowRef.current.position.copy(markerRef.current.position)
      const baseIntensity = 2
      glowRef.current.intensity = baseIntensity + Math.sin(clock.getElapsedTime() * 3) * 0.5
    }
  })

  return (
    <group ref={orbitRef}>
      {/* 轨道线 */}
      <OrbitLine radius={orbitConfig.radius} color={orangeGlow} />

      {/* 核心球体 */}
      <Sphere
        ref={markerRef}
        args={[0.25, 16, 16]}
        renderOrder={1}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "auto"
        }}
      >
        <meshBasicMaterial color={orangeColor} transparent opacity={0.9} />
      </Sphere>

      {/* 脉动光晕 */}
      <Sphere ref={pulseRef} args={[0.32, 16, 16]} renderOrder={1}>
        <meshBasicMaterial color={orangeColor} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </Sphere>

      {/* 白色旋转环 */}
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

      {/* 发光效果 */}
      <pointLight ref={glowRef} color={orangeGlow} intensity={2} distance={3} />
    </group>
  )
}

// 轨道线组件
function OrbitLine({ radius, color }: { radius: number; color: string }) {
  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      pts.push(new THREE.Vector3(x, 0, z))
    }
    return pts
  }, [radius])

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])

  return (
    // @ts-expect-error: @react-three/fiber JSX types
    <line geometry={geometry} renderOrder={0}>
      <lineDashedMaterial
        color={color}
        dashSize={0.5}
        gapSize={0.3}
        opacity={0.3}
        transparent
        linewidth={2}
        depthWrite={false}
      />
    </line>
  )
}

Planet.displayName = "Planet"

export default Planet
