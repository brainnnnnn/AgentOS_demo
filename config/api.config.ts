/**
 * API 配置中心
 *
 * 统一管理所有 API 端点和 Mock 数据
 * 支持一键切换真实 API / Mock 数据
 */

// ========================================
// API 端点配置
// ========================================

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.xiaosi.example.com/v1'

export const API_ENDPOINTS = {
  // 学科/区块配置
  sections: `${API_BASE_URL}/sections`,

  // 主题配置
  themes: `${API_BASE_URL}/themes`,

  // 卡片模板配置
  cardTemplates: `${API_BASE_URL}/card-templates`,

  // 作业相关
  homework: {
    list: `${API_BASE_URL}/homework/list`,
    stats: `${API_BASE_URL}/homework/stats`,
    detail: (id: string) => `${API_BASE_URL}/homework/${id}`,
    submit: (id: string) => `${API_BASE_URL}/homework/${id}/submit`,
  },

  // 学习记录
  learning: {
    progress: `${API_BASE_URL}/learning/progress`,
    history: `${API_BASE_URL}/learning/history`,
    weakPoints: `${API_BASE_URL}/learning/weak-points`,
  },

  // 对话/聊天
  chat: {
    send: `${API_BASE_URL}/chat/send`,
    history: `${API_BASE_URL}/chat/history`,
    stream: `${API_BASE_URL}/chat/stream`,
  },

  // 游戏
  game: {
    gomoku: {
      start: `${API_BASE_URL}/game/gomoku/start`,
      move: `${API_BASE_URL}/game/gomoku/move`,
      aiMove: `${API_BASE_URL}/game/gomoku/ai-move`,
      surrender: `${API_BASE_URL}/game/gomoku/surrender`,
    },
  },

  // 用户配置
  user: {
    profile: `${API_BASE_URL}/user/profile`,
    settings: `${API_BASE_URL}/user/settings`,
  },
} as const

// ========================================
// Mock 响应数据
// ========================================

export const MOCK_RESPONSES = {
  // 区块配置
  sections: {
    data: [
      {
        id: 'hero',
        title: { kr: '欢迎来到小思', en: 'Welcome to Xiaosi', zh: '欢迎来到小思' },
        description: {
          kr: 'AI 학습 도우미',
          en: 'Your AI learning partner',
          zh: '我是你的AI学习伙伴，可以帮你解答学习中的各种问题。无论是数学、语文还是科学知识，我都可以为你提供帮助。',
        },
        button: { kr: '시작하기', en: 'Start Chat', zh: '开始对话' },
        mode: 'default',
        cardMode: 'weak-points',
        quickButtons: ['练口语', '写作文', '继续学昨天的', '数学辅导'],
        suggestions: [
          { label: '详细解释一下', action: '详细解释一下' },
          { label: '举个例子', action: '给我举个例子' },
          { label: '换种说法', action: '换种说法解释' },
          { label: '相关知识', action: '相关的知识有哪些' },
        ],
      },
      {
        id: 'speaker',
        title: { kr: '수학 코칭', en: 'Math Tutoring', zh: '数学辅导' },
        description: {
          kr: '수학 문제 해결',
          en: 'Math problem solving',
          zh: '我可以帮你解答数学题，从基础运算到高级代数，一步步带你理解解题思路。让数学变得简单有趣！',
        },
        button: { kr: '질문하기', en: 'Ask Math', zh: '提问数学' },
        mode: 'learning',
        cardMode: 'school-sync',
        quickButtons: ['解方程', '几何题', '应用题', '公式推导'],
        suggestions: [
          { label: '一步步讲解', action: '一步步讲解' },
          { label: '画图说明', action: '画图说明' },
          { label: '类似例题', action: '出几道类似例题' },
          { label: '总结方法', action: '总结解题方法' },
        ],
      },
      {
        id: 'lightning',
        title: { kr: '중국어 학습', en: 'Chinese Learning', zh: '语文学习' },
        description: {
          kr: '중국어 학습 도우미',
          en: 'Chinese language assistant',
          zh: '我可以帮你分析文章、讲解古诗词、练习写作。让语文学习更加生动有趣，提升你的语言表达能力。',
        },
        button: { kr: '학습하기', en: 'Learn Chinese', zh: '学习语文' },
        mode: 'learning',
        cardMode: 'weak-points',
        quickButtons: ['古诗词', '阅读理解', '作文技巧', '成语解释'],
        suggestions: [
          { label: '详细赏析', action: '详细赏析' },
          { label: '作者背景', action: '介绍作者背景' },
          { label: '写作手法', action: '分析写作手法' },
          { label: '背诵技巧', action: '给背诵技巧' },
        ],
      },
      {
        id: 'sponsor',
        title: { kr: '과학 탐험', en: 'Science Exploration', zh: '科学探索' },
        description: {
          kr: '과학 탐험하기',
          en: 'Explore science',
          zh: '从物理到生物，从化学到天文，我可以带你探索科学的奥秘。用有趣的方式理解复杂的科学概念。',
        },
        button: { kr: '탐험하기', en: 'Explore', zh: '探索科学' },
        mode: 'game',
        cardMode: 'game',
        quickButtons: ['物理实验', '生物现象', '化学反应', '天文知识'],
        suggestions: [
          { label: '原理解释', action: '解释原理' },
          { label: '生活中的应用', action: '生活中的应用' },
          { label: '相关实验', action: '推荐相关实验' },
          { label: '拓展知识', action: '拓展知识' },
        ],
      },
    ],
  },

  // 作业列表
  homeworkList: {
    data: [
      { id: '1', subject: '数学', task: '完成练习题第15-18题', time: '30分钟', status: 'pending' },
      { id: '2', subject: '语文', task: '背诵古诗《静夜思》', time: '15分钟', status: 'pending' },
      { id: '3', subject: '英语', task: '单词听写 Unit 3', time: '20分钟', status: 'completed' },
    ],
  },

  // 作业统计
  homeworkStats: {
    data: {
      total: 3,
      completed: 1,
      pending: 2,
      estimatedTime: '65分钟',
      progress: 33,
    },
  },

  // 卡片模板
  cardTemplates: {
    data: {
      'school-sync': {
        id: 'school-sync',
        title: '来复习一下这周学习的新内容吧',
        suggestions: [
          { label: '有理数运算 ▶', action: '帮我预习有理数运算' },
          { label: '文言文理解 ▶', action: '帮我预习文言文理解' },
        ],
        cards: [
          {
            id: 'course-1',
            type: 'course',
            title: '校内同步',
            description: '第一章：有理数运算',
            metadata: { courseName: '第一章：有理数运算' },
          },
          {
            id: 'knowledge-1',
            type: 'knowledge',
            title: '精准学推荐',
            description: '掌握有理数运算的解题技巧',
          },
          {
            id: 'summary-1',
            type: 'summary',
            title: '考点归纳',
            description: '有理数的常见题型总结',
          },
          {
            id: 'exercise-1',
            type: 'exercise',
            title: '基础练习',
            description: '有理数运算基础概念',
            metadata: { questionCount: 10 },
          },
        ],
      },
      'weak-points': {
        id: 'weak-points',
        title: '准备好「薄弱项」提升了吗',
        suggestions: [
          { label: '如何判断二元一次方程？ ▶', action: '如何判断二元一次方程' },
          { label: '求解方法 ▶', action: '求解二元一次方程组' },
        ],
        cards: [
          {
            id: 'knowledge-2',
            type: 'knowledge',
            title: '精准学推荐',
            description: '掌握二元一次方程解题技巧',
          },
          {
            id: 'summary-2',
            type: 'summary',
            title: '考点归纳',
            description: '二元一次方程题型总结',
          },
          {
            id: 'task-1',
            type: 'task',
            title: '数学计划',
            description: '第1节',
            metadata: { progress: 0, tag: '未开始' },
          },
          {
            id: 'exercise-2',
            type: 'exercise',
            title: '基础练习',
            description: '二元一次方程基础概念',
            metadata: { questionCount: 10 },
          },
        ],
      },
      homework: {
        id: 'homework',
        title: '让我们开始今天的作业吧！',
        description: '今天有{{total}}项作业需要完成，预计用时{{time}}。记得先完成数学作业，有不懂的随时问我～',
        suggestions: [
          { label: '现在开始', action: '开始做作业' },
          { label: '先学数学', action: '先学数学' },
        ],
        cards: [
          {
            id: 'homework-list',
            type: 'task',
            title: '今日作业',
            description: '作业列表',
            metadata: {},
          },
        ],
      },
      game: {
        id: 'game',
        title: '学累了？来和小思下盘五子棋吧！',
        suggestions: [
          { label: '五子棋规则 ▶', action: '五子棋怎么玩' },
          { label: '让我赢一把 😄', action: '小思让让我' },
        ],
        cards: [
          {
            id: 'gomoku',
            type: 'game',
            title: '五子棋对战',
            description: '和 AI 小思来一场五子棋对决',
            metadata: { gameType: 'gomoku' },
          },
        ],
      },
    },
  },
}

// ========================================
// API Service 类
// ========================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export class APIService {
  private useMock: boolean

  constructor() {
    // 可以通过环境变量控制是否使用 Mock
    this.useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true'
  }

  /**
   * 设置是否使用 Mock 数据
   */
  setUseMock(useMock: boolean) {
    this.useMock = useMock
  }

  /**
   * 通用 GET 请求
   */
  async get<T>(url: string): Promise<ApiResponse<T>> {
    if (this.useMock) {
      return this.getMockResponse<T>(url)
    }

    try {
      const response = await fetch(url)
      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return { success: false, error: String(error) }
    }
  }

  /**
   * 通用 POST 请求
   */
  async post<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
    if (this.useMock) {
      return { success: true, data: undefined as T }
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return { success: false, error: String(error) }
    }
  }

  /**
   * 获取区块配置
   */
  async getSections() {
    if (this.useMock) {
      return { success: true, data: MOCK_RESPONSES.sections.data }
    }
    return this.get<typeof MOCK_RESPONSES.sections.data>(API_ENDPOINTS.sections)
  }

  /**
   * 获取作业列表
   */
  async getHomeworkList() {
    if (this.useMock) {
      return { success: true, data: MOCK_RESPONSES.homeworkList.data }
    }
    return this.get<typeof MOCK_RESPONSES.homeworkList.data>(API_ENDPOINTS.homework.list)
  }

  /**
   * 获取作业统计
   */
  async getHomeworkStats() {
    if (this.useMock) {
      return { success: true, data: MOCK_RESPONSES.homeworkStats.data }
    }
    return this.get<typeof MOCK_RESPONSES.homeworkStats.data>(API_ENDPOINTS.homework.stats)
  }

  /**
   * 获取卡片模板
   */
  async getCardTemplates() {
    if (this.useMock) {
      return { success: true, data: MOCK_RESPONSES.cardTemplates.data }
    }
    return this.get<typeof MOCK_RESPONSES.cardTemplates.data>(API_ENDPOINTS.cardTemplates)
  }

  /**
   * 发送聊天消息
   */
  async sendChatMessage(message: string, context?: unknown) {
    if (this.useMock) {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        success: true,
        data: {
          id: Date.now().toString(),
          role: 'assistant',
          content: `这是模拟回复：我收到了你的消息 "${message}"。在实际接入 API 后，这里会显示真实的 AI 回复。`,
          timestamp: Date.now(),
        },
      }
    }

    return this.post(API_ENDPOINTS.chat.send, { message, context })
  }

  /**
   * 获取 Mock 响应
   */
  private getMockResponse<T>(url: string): Promise<ApiResponse<T>> {
    // 简单的 URL 匹配逻辑
    if (url.includes('/sections')) {
      return Promise.resolve({ success: true, data: MOCK_RESPONSES.sections.data as T })
    }
    if (url.includes('/homework/list')) {
      return Promise.resolve({ success: true, data: MOCK_RESPONSES.homeworkList.data as T })
    }
    if (url.includes('/homework/stats')) {
      return Promise.resolve({ success: true, data: MOCK_RESPONSES.homeworkStats.data as T })
    }
    if (url.includes('/card-templates')) {
      return Promise.resolve({ success: true, data: MOCK_RESPONSES.cardTemplates.data as T })
    }

    return Promise.resolve({ success: false, error: '未找到对应的 Mock 数据' })
  }
}

// 导出单例实例
export const api = new APIService()

// 导出配置获取函数
export function getApiConfig() {
  return {
    baseUrl: API_BASE_URL,
    useMock: process.env.NEXT_PUBLIC_USE_MOCK === 'true',
  }
}
