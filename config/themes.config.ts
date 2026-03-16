/**
 * 主题/颜色配置中心
 *
 * 统一管理所有颜色，支持按模式获取
 */

/** 基础主题接口 */
export interface Theme {
  id: string
  name: string
  displayColor: string
  planetColor: string
  glowColor: string
  orbitColor: string
  starColor: string
  accentColor: string
  uiColor: string
  description?: string
}

/** 聊天背景配置 */
export interface ChatBackgroundConfig {
  gradientCenter: string
  gradientEdge: string
  glowColor: string
  glowIntensity: number
}

/** 应用模式类型 */
export type AppMode = 'default' | 'homework' | 'learning' | 'game'

// ========================================
// 预设主题
// ========================================

export const themes: Theme[] = [
  {
    id: "cosmic-blue",
    name: "Cosmic Blue",
    displayColor: "#29B6F6",
    planetColor: "#29B6F6",
    glowColor: "#4FC3F7",
    orbitColor: "#BBDEFB",
    starColor: "#E3F2FD",
    accentColor: "#0288D1",
    uiColor: "#29B6F6",
    description: "A serene blue theme inspired by Earth viewed from space",
  },
  {
    id: "ruby",
    name: "Scarlet",
    displayColor: "#F44336",
    planetColor: "#FF6750",
    glowColor: "#DF2D2A",
    orbitColor: "#FFCDD2",
    starColor: "#FFEBEE",
    accentColor: "#D32F2F",
    uiColor: "#F44336",
    description: "A bold red theme like the surface of Mars",
  },
  {
    id: "emerald",
    name: "Emerald",
    displayColor: "#4CAF50",
    planetColor: "#13DDB8",
    glowColor: "#80FF40",
    orbitColor: "#C8E6C9",
    starColor: "#E8F5E9",
    accentColor: "#388E3C",
    uiColor: "#4CAF50",
    description: "A lush green theme reminiscent of verdant alien worlds",
  },
]

// ========================================
// 模式颜色映射
// ========================================

/** 模式对应的颜色配置 */
export const modeColors: Record<AppMode, { planetColor: string; glowColor: string; accentColor: string }> = {
  default: {
    planetColor: "#29B6F6",
    glowColor: "#4FC3F7",
    accentColor: "#29B6F6",
  },
  homework: {
    planetColor: "#FF8800",
    glowColor: "#FFAA33",
    accentColor: "#FFAA33",
  },
  learning: {
    planetColor: "#29B6F6",
    glowColor: "#4FC3F7",
    accentColor: "#29B6F6",
  },
  game: {
    planetColor: "#39FF14",
    glowColor: "#80FF40",
    accentColor: "#39FF14",
  },
}

/** 模式对应的聊天背景 */
export const modeBackgrounds: Record<AppMode, ChatBackgroundConfig> = {
  default: {
    gradientCenter: "rgba(41, 182, 246, 0.2)",
    gradientEdge: "rgba(0, 0, 0, 0.7)",
    glowColor: "#29B6F6",
    glowIntensity: 1,
  },
  homework: {
    gradientCenter: "rgba(255, 136, 0, 0.25)",
    gradientEdge: "rgba(0, 0, 0, 0.7)",
    glowColor: "#FFAA33",
    glowIntensity: 1.2,
  },
  learning: {
    gradientCenter: "rgba(41, 182, 246, 0.2)",
    gradientEdge: "rgba(0, 0, 0, 0.7)",
    glowColor: "#29B6F6",
    glowIntensity: 1,
  },
  game: {
    gradientCenter: "rgba(57, 255, 20, 0.15)",
    gradientEdge: "rgba(0, 0, 0, 0.7)",
    glowColor: "#39FF14",
    glowIntensity: 1.5,
  },
}

// ========================================
// 便捷获取函数
// ========================================

/** 根据模式获取颜色配置 */
export function getThemeByMode(mode: AppMode) {
  return modeColors[mode] || modeColors.default
}

/** 根据模式获取星球颜色 */
export function getPlanetColors(mode: AppMode) {
  return {
    planetColor: modeColors[mode]?.planetColor || modeColors.default.planetColor,
    glowColor: modeColors[mode]?.glowColor || modeColors.default.glowColor,
  }
}

/** 根据模式获取聊天背景 */
export function getChatBackground(mode: AppMode) {
  return modeBackgrounds[mode] || modeBackgrounds.default
}

/** 根据 section ID 推断模式 */
export function getModeBySection(sectionId: string, isHomework: boolean = false): AppMode {
  if (isHomework) return 'homework'
  if (sectionId === 'sponsor') return 'game'
  if (sectionId === 'speaker' || sectionId === 'lightning') return 'learning'
  return 'default'
}
