/**
 * 卡片模板配置
 *
 * 定义不同模式下的卡片内容
 */

/** 卡片模式类型 */
export type CardMode = 'school-sync' | 'weak-points' | 'game' | 'homework' | 'reading'

/** 单个卡片数据 */
export interface CardData {
  id: string
  type: 'course' | 'knowledge' | 'summary' | 'task' | 'exercise' | 'game'
  title: string
  description?: string
  metadata?: Record<string, string | number>
  actions?: { label: string; action: string }[]
}

/** 卡片模板 */
export interface CardTemplate {
  id: CardMode
  title: string
  description?: string
  suggestions: { label: string; action: string }[]
  cards: CardData[]
}

// ========================================
// 卡片模板定义
// ========================================

export const cardTemplates: Record<CardMode, CardTemplate> = {
  // 校内同步学习（数学模式）
  'school-sync': {
    id: 'school-sync',
    title: '来复习一下这周学习的新内容吧',
    suggestions: [
      { label: '有理数运算 ▶', action: '帮我复习有理数运算' },
      { label: '文言文理解 ▶', action: '帮我复习文言文理解' },
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

  // 薄弱知识点（默认学习模式）
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

  // 作业模式（橙色小球）
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
        // 实际数据会通过 API 动态加载
        metadata: {},
      },
    ],
  },

  // 游戏模式（绿色小球）
  game: {
    id: 'game',
    title: '学累了？来和小思下盘五子棋吧！',
    suggestions: [
      { label: '重来一局 🔄', action: '重新开始' },
      { label: '五子棋规则 ▶', action: '五子棋怎么玩' },
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

  // 阅读相关（语文学习模式）
  reading: {
    id: 'reading',
    title: '妈妈的100天阅读冲刺',
    suggestions: [
      { label: '古诗词赏析 ▶', action: '帮我赏析古诗词' },
      { label: '阅读理解技巧 ▶', action: '阅读理解答题技巧' },
    ],
    cards: [
      {
        id: 'reading-course-1',
        type: 'course',
        title: '经典阅读',
        description: '古诗词名篇赏析',
        metadata: { courseName: '古诗词名篇赏析' },
      },
      {
        id: 'reading-knowledge-1',
        type: 'knowledge',
        title: '阅读技巧',
        description: '掌握文章分析和理解方法',
      },
      {
        id: 'reading-summary-1',
        type: 'summary',
        title: '写作手法',
        description: '常见修辞手法和表达方式总结',
      },
      {
        id: 'reading-exercise-1',
        type: 'exercise',
        title: '阅读理解练习',
        description: '提高阅读速度和理解能力',
        metadata: { questionCount: 8 },
      },
    ],
  },
}

/** 根据模式获取卡片模板 */
export function getCardTemplate(mode: CardMode): CardTemplate {
  return cardTemplates[mode] || cardTemplates['weak-points']
}

/** 获取作业列表（Mock 数据，后期替换为 API） */
export function getHomeworkList() {
  return [
    { subject: '数学', task: '完成练习题第15-18题', time: '30分钟' },
    { subject: '语文', task: '背诵古诗《静夜思》', time: '15分钟' },
    { subject: '英语', task: '单词听写 Unit 3', time: '20分钟' },
  ]
}

/** 获取作业统计 */
export function getHomeworkStats() {
  const list = getHomeworkList()
  const totalMinutes = list.reduce((sum, item) => {
    const minutes = parseInt(item.time)
    return sum + (isNaN(minutes) ? 0 : minutes)
  }, 0)
  return {
    total: list.length,
    estimatedTime: `${totalMinutes}分钟`,
  }
}
