/**
 * API 服务层
 *
 * 统一管理所有 API 调用，支持 Mock 数据和真实 API 切换
 */

import { api } from '@/config'

export interface SuggestionButton {
  label: string
  action: string
}

export interface XiaosiResponse {
  summary: string  // 大字体：核心概要
  ttsText: string  // 小字：详细内容
  suggestions: SuggestionButton[]  // sug按钮
}

/**
 * 获取小思 AI 回复
 * @param userInput 用户输入
 * @returns 小思回复
 */
export async function fetchXiaosiResponse(userInput: string): Promise<XiaosiResponse> {
  // 这里将来替换为真实的API调用
  // const response = await api.sendChatMessage(userInput)
  // return response.data as XiaosiResponse

  return new Promise((resolve) => {
    setTimeout(() => {
      const input = userInput.toLowerCase()

      // 校内同步学习相关回复
      if (input.includes('有理数') || input.includes('运算')) {
        resolve({
          summary: "有理数运算的关键技巧",
          ttsText: "有理数运算要注意三个要点：第一，确定结果的符号；第二，正确处理绝对值的运算；第三，熟练运用运算律简化计算。咱们可以从加减法开始练起，你觉得怎么样？",
          suggestions: [
            { label: "详细解释一下", action: "详细解释一下有理数运算规则" },
            { label: "举个例子", action: "给我举个有理数运算的例子" },
            { label: "来道题试试", action: "出一道有理数运算题" },
            { label: "相关知识点", action: "有理数的相关知识点有哪些" }
          ]
        })
      } else if (input.includes('文言文') || input.includes('古文')) {
        resolve({
          summary: "文言文阅读理解的窍门",
          ttsText: "理解文言文要从'字、词、句、篇'四个层面入手。先抓关键词的古今异义，再理清楚句式结构，最后结合上下文把握文章主旨。需要我带你具体分析一篇吗？",
          suggestions: [
            { label: "常用实词", action: "文言文常用实词有哪些" },
            { label: "虚词用法", action: "之乎者也的用法区别" },
            { label: "来篇练习", action: "给我一篇文言文练习" },
            { label: "翻译技巧", action: "文言文翻译有什么技巧" }
          ]
        })
      }
      // 薄弱知识点相关回复
      else if (input.includes('二元一次') || input.includes('方程')) {
        resolve({
          summary: "二元一次方程组的解法",
          ttsText: "解二元一次方程组主要有代入消元法和加减消元法两种思路。关键是观察未知数系数的特点，选择最简便的方法来消去一个未知数，把二元转化为一元来解决。",
          suggestions: [
            { label: "代入消元法", action: "详细讲代入消元法" },
            { label: "加减消元法", action: "详细讲加减消元法" },
            { label: "来道题试试", action: "出一道二元一次方程题" },
            { label: "应用场景", action: "生活中什么时候会用到二元一次方程" }
          ]
        })
      }
      // 通用学习回复
      else if (input.includes('预习')) {
        resolve({
          summary: "高效预习的方法",
          ttsText: "预习不是提前学一遍，而是带着问题去听课。建议你先快速浏览课本标题和小结，标记出不懂的地方，上课重点听这些部分。这样听课效率会高很多！",
          suggestions: [
            { label: "预习笔记怎么记", action: "预习笔记怎么记" },
            { label: "各科预习方法", action: "不同科目预习方法有什么区别" },
            { label: "预习时间安排", action: "预习一般要花多长时间" }
          ]
        })
      } else if (input.includes('薄弱') || input.includes('提升')) {
        resolve({
          summary: "针对性提升薄弱项的策略",
          ttsText: "找到薄弱点只是第一步，关键是针对性练习。我建议你先分析错题原因，是概念不清还是计算粗心？然后有针对性地做同类题，每周复习一次错题本，效果会非常明显。",
          suggestions: [
            { label: "错题本怎么用", action: "错题本怎么整理最高效" },
            { label: "制定提升计划", action: "帮我制定一个薄弱项提升计划" },
            { label: "复习频率", action: "错题多久复习一次比较好" }
          ]
        })
      }
      // 游戏相关回复
      else if (input.includes('五子棋') || input.includes('游戏')) {
        resolve({
          summary: "五子棋游戏规则",
          ttsText: "五子棋很简单：两人轮流在棋盘交叉点落子，先连成五子者获胜。黑棋先行，白棋后走。我可以陪你下一盘，你想执黑还是执白？",
          suggestions: [
            { label: "开始游戏", action: "开始五子棋游戏" },
            { label: "我要执黑", action: "我要执黑棋" },
            { label: "我要执白", action: "我要执白棋" },
            { label: "游戏技巧", action: "五子棋有什么技巧" }
          ]
        })
      }
      // 通用兜底回复
      else {
        resolve({
          summary: `关于${userInput.slice(0, 15)}${userInput.length > 15 ? '...' : ''}`,
          ttsText: "好的，我来帮你解答这个问题。我们可以从基础概念开始梳理，然后结合具体例子来理解。有什么不清楚的地方随时问我！",
          suggestions: [
            { label: "详细解释一下", action: "详细解释一下" },
            { label: "举个例子", action: "给我举个例子" },
            { label: "来道题试试", action: "出一道相关练习题" },
            { label: "相关知识", action: "相关的知识有哪些" }
          ]
        })
      }
    }, 1500)
  })
}

/**
 * 获取作业列表
 */
export async function fetchHomeworkList() {
  const response = await api.getHomeworkList()
  if (response.success && response.data) {
    return response.data
  }
  // 默认返回
  return [
    { id: '1', subject: '数学', task: '完成练习题第15-18题', time: '30分钟', status: 'pending' },
    { id: '2', subject: '语文', task: '背诵古诗《静夜思》', time: '15分钟', status: 'pending' },
    { id: '3', subject: '英语', task: '单词听写 Unit 3', time: '20分钟', status: 'completed' },
  ]
}

/**
 * 获取作业统计
 */
export async function fetchHomeworkStats() {
  const response = await api.getHomeworkStats()
  if (response.success && response.data) {
    return response.data
  }
  // 默认返回
  return {
    total: 3,
    completed: 1,
    pending: 2,
    estimatedTime: '65分钟',
    progress: 33,
  }
}

// 重新导出 api 实例和类型
export { api }
export type { ApiResponse } from '@/config'
