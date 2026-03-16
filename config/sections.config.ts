/**
 * Section（学科/区块）配置
 *
 * 定义每个小球对应的学科信息
 */

export interface Section {
  id: string
  title: {
    kr: string
    en: string
    zh: string
  }
  description: {
    kr: string
    en: string
    zh: string
  }
  button?: {
    kr: string
    en: string
    zh: string
  }
  /** 关联的主题模式 */
  mode: 'default' | 'learning' | 'game'
  /** 卡片模式 */
  cardMode: 'school-sync' | 'weak-points' | 'game' | 'reading'
  /** 快捷按钮 */
  quickButtons: string[]
  /** 建议提示 */
  suggestions: { label: string; action: string }[]
}

export const sections: Section[] = [
  {
    id: "hero",
    title: {
      kr: "欢迎来到小思",
      en: "Welcome to Xiaosi",
      zh: "欢迎来到小思",
    },
    description: {
      kr: "AI 학습 도우미",
      en: "Your AI learning partner",
      zh: "我是你的AI学习伙伴，可以帮你解答学习中的各种问题。无论是数学、语文还是科学知识，我都可以为你提供帮助。",
    },
    button: {
      kr: "시작하기",
      en: "Start Chat",
      zh: "开始对话",
    },
    mode: 'default',
    cardMode: 'weak-points',
    quickButtons: ["练口语", "写作文", "继续学昨天的", "数学辅导"],
    suggestions: [
      { label: "详细解释一下", action: "详细解释一下" },
      { label: "举个例子", action: "给我举个例子" },
      { label: "换种说法", action: "换种说法解释" },
      { label: "相关知识", action: "相关的知识有哪些" },
    ],
  },
  {
    id: "speaker",
    title: {
      kr: "수학 코칭",
      en: "Math Tutoring",
      zh: "数学辅导",
    },
    description: {
      kr: "수학 문제 해결",
      en: "Math problem solving",
      zh: "我可以帮你解答数学题，从基础运算到高级代数，一步步带你理解解题思路。让数学变得简单有趣！",
    },
    button: {
      kr: "질문하기",
      en: "Ask Math",
      zh: "提问数学",
    },
    mode: 'learning',
    cardMode: 'school-sync',
    quickButtons: ["解方程", "几何题", "应用题", "公式推导"],
    suggestions: [
      { label: "一步步讲解", action: "一步步讲解" },
      { label: "画图说明", action: "画图说明" },
      { label: "类似例题", action: "出几道类似例题" },
      { label: "总结方法", action: "总结解题方法" },
    ],
  },
  {
    id: "lightning",
    title: {
      kr: "중국어 학습",
      en: "Chinese Learning",
      zh: "语文学习",
    },
    description: {
      kr: "중국어 학습 도우미",
      en: "Chinese language assistant",
      zh: "我可以帮你分析文章、讲解古诗词、练习写作。让语文学习更加生动有趣，提升你的语言表达能力。",
    },
    button: {
      kr: "학습하기",
      en: "Learn Chinese",
      zh: "学习语文",
    },
    mode: 'learning',
    cardMode: 'reading',
    quickButtons: ["古诗词", "阅读理解", "作文技巧", "成语解释"],
    suggestions: [
      { label: "详细赏析", action: "详细赏析" },
      { label: "作者背景", action: "介绍作者背景" },
      { label: "写作手法", action: "分析写作手法" },
      { label: "背诵技巧", action: "给背诵技巧" },
    ],
  },
  {
    id: "sponsor",
    title: {
      kr: "과학 탐험",
      en: "Science Exploration",
      zh: "科学探索",
    },
    description: {
      kr: "과학 탐험하기",
      en: "Explore science",
      zh: "从物理到生物，从化学到天文，我可以带你探索科学的奥秘。用有趣的方式理解复杂的科学概念。",
    },
    button: {
      kr: "탐험하기",
      en: "Explore",
      zh: "探索科学",
    },
    mode: 'game',
    cardMode: 'game',
    quickButtons: ["物理实验", "生物现象", "化学反应", "天文知识"],
    suggestions: [
      { label: "原理解释", action: "解释原理" },
      { label: "生活中的应用", action: "生活中的应用" },
      { label: "相关实验", action: "推荐相关实验" },
      { label: "拓展知识", action: "拓展知识" },
    ],
  },
]

/** 根据 ID 获取 section */
export function getSectionById(id: string): Section | undefined {
  return sections.find(s => s.id === id)
}

/** 根据模式获取 sections */
export function getSectionsByMode(mode: Section['mode']): Section[] {
  return sections.filter(s => s.mode === mode)
}
