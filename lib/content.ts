export interface Section {
  id: string
  title: {
    kr: string
    en: string
  }
  description: {
    kr: string
    en: string
  }
  button?: {
    kr: string
    en: string
  }
}

export const sections: Section[] = [
  {
    id: "hero",
    title: {
      kr: "欢迎来到小思",
      en: "欢迎来到小思",
    },
    description: {
      kr: "我是你的AI学习伙伴，可以帮你解答学习中的各种问题。无论是数学、语文还是科学知识，我都可以为你提供帮助。",
      en: "我是你的AI学习伙伴，可以帮你解答学习中的各种问题。无论是数学、语文还是科学知识，我都可以为你提供帮助。",
    },
    button: {
      kr: "开始对话",
      en: "开始对话",
    },
  },
  {
    id: "speaker",
    title: {
      kr: "数学辅导",
      en: "数学辅导",
    },
    description: {
      kr: "我可以帮你解答数学题，从基础运算到高级代数，一步步带你理解解题思路。让数学变得简单有趣！",
      en: "我可以帮你解答数学题，从基础运算到高级代数，一步步带你理解解题思路。让数学变得简单有趣！",
    },
    button: {
      kr: "提问数学",
      en: "提问数学",
    },
  },
  {
    id: "lightning",
    title: {
      kr: "语文学习",
      en: "语文学习",
    },
    description: {
      kr: "我可以帮你分析文章、讲解古诗词、练习写作。让语文学习更加生动有趣，提升你的语言表达能力。",
      en: "我可以帮你分析文章、讲解古诗词、练习写作。让语文学习更加生动有趣，提升你的语言表达能力。",
    },
    button: {
      kr: "学习语文",
      en: "学习语文",
    },
  },
  {
    id: "sponsor",
    title: {
      kr: "科学探索",
      en: "科学探索",
    },
    description: {
      kr: "从物理到生物，从化学到天文，我可以带你探索科学的奥秘。用有趣的方式理解复杂的科学概念。",
      en: "从物理到生物，从化学到天文，我可以带你探索科学的奥秘。用有趣的方式理解复杂的科学概念。",
    },
    button: {
      kr: "探索科学",
      en: "探索科学",
    },
  },
]
