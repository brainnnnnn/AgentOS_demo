/**
 * 小思 AI 全局配置中心
 *
 * 所有硬编码数据集中管理，方便后期替换为 API
 */

// 学科/区块配置
export { sections, type Section } from './sections.config'

// 主题/颜色配置
export { themes, type Theme, getThemeByMode, getPlanetColors, getChatBackground } from './themes.config'

// 卡片模板配置
export { cardTemplates, type CardTemplate, type CardMode } from './cards.config'

// API 配置（Mock 或真实 API）
export { API_ENDPOINTS, MOCK_RESPONSES, api, getApiConfig, type ApiResponse, type APIService } from './api.config'
