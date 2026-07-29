/**
 * Markdown 题库解析器 — 适配 MinerU 输出格式
 *
 * MinerU 格式：
 * - 章节：## 第X章 XXX
 * - 分层：## 基础题 / ## 综合题 / ## 拓展题
 * - 题型：## 一、选择题 / ## 二、填空题 / ## 三、解答题
 * - 题号：(1) (2) ... (nn)
 * - 选项：A. xxx B. xxx C. xxx D. xxx（可能同行）
 * - 子题：(I) (II) (III)
 */

import type { Question } from '@/types'

// ─── 中文数字 → 阿拉伯数字 ─────────────────────────

const CN_NUM: Record<string, number> = {
  '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
  '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
}

function parseCnNumber(s: string): number | null {
  const trimmed = s.trim()
  // 直接阿拉伯数字
  if (/^\d+$/.test(trimmed)) return parseInt(trimmed)
  // 直接查表（一 → 1, 九 → 9）
  if (CN_NUM[trimmed]) return CN_NUM[trimmed]

  // 组合数字：十一 = 10+1, 二十三 = 2*10+3, 二十 = 2*10
  let result = 0
  let temp = 0
  for (const ch of trimmed) {
    if (ch === '十' || ch === '拾') {
      temp = temp === 0 ? 10 : temp * 10
      result += temp
      temp = 0
    } else if (CN_NUM[ch]) {
      temp = CN_NUM[ch]
    }
  }
  result += temp
  return result || null
}

// ─── 章节页范围（来自原始 PDF 目录） ──────────

const GAOSHU_RANGES: [number, string, number, number][] = [
  [1, '函数、极限、连续', 2, 23],
  [2, '一元函数微分学及其应用', 24, 64],
  [3, '一元函数积分学及其应用', 65, 115],
  [4, '空间解析几何', 116, 124],
  [5, '多元函数微分学及其应用', 125, 150],
  [6, '重积分及其应用', 151, 184],
  [7, '微分方程及其应用', 185, 210],
  [8, '无穷级数', 211, 237],
  [9, '曲线积分与曲面积分', 238, 266],
]

const GAXIAN_RANGES: [number, string, number, number][] = [
  [10, '行列式', 1, 13],
  [11, '矩阵', 14, 29],
  [12, '向量', 30, 44],
  [13, '线性方程组', 45, 62],
  [14, '相似矩阵', 63, 89],
  [15, '二次型', 90, 119],
  [16, '随机事件及其概率', 120, 129],
  [17, '随机变量及其分布', 130, 141],
  [18, '多维随机变量及其分布', 142, 157],
  [19, '随机变量的数字特征', 158, 176],
  [20, '大数定律与中心极限定理', 177, 180],
  [21, '数理统计的基本概念', 181, 189],
  [22, '参数估计', 190, 199],
]

const ALL_RANGES = [...GAOSHU_RANGES, ...GAXIAN_RANGES]

const CHAPTER_RE = /^##\s+第([一二三四五六七八九十百零]+)章\s*(.*)/
const QUESTION_RE = /^\((\d+)\)\s*(.*)/
const OPTION_LINE = /^[A-D]\s*[.、）)]/
const SUB_Q_RE = /^\(([IVXL]+|[一二三四五六七八九十]+)\)/

// ─── 题型映射 ─────────────────────────────────────────

const TYPE_MAP: Record<string, 'choice' | 'blank' | 'answer'> = {
  '选择题': 'choice',
  '填空题': 'blank',
  '解答题': 'answer',
}

// ─── 解析器 ────────────────────────────────────────────

export interface ParseOptions {
  subject: string
  book: string
  /** 手动指定文件名→章节映射，用于跨文件时的 id 分配 */
  chapterOffset?: number
}

export function parseMarkdown(content: string, opts: ParseOptions): Question[] {
  const lines = content.split('\n')
  const questions: Question[] = []

  let chapterId = 0
  let chapterName = ''
  let sectionId = '基础'
  let sectionName = '基础题'
  let curType: 'choice' | 'blank' | 'answer' = 'choice'
  let buf: string[] = []
  let qnum = 0
  let qidCounter = 0
  let chPageStart = 0

  function detectSection(heading: string) {
    const trimmed = heading.replace(/^##\s+/, '').trim()
    // 基础题/综合题/拓展题
    const secMatch = trimmed.match(/^(基础题|综合题|拓展题)$/)
    if (secMatch) {
      sectionId = secMatch[1].replace('题', '')
      sectionName = secMatch[1]
      return true
    }
    // 一、选择题 / 二、填空题 / 三、解答题
    const typeMatch = trimmed.match(/^[一二三]+[.、）)]?\s*(选择题|填空题|解答题)$/)
    if (typeMatch) {
      curType = TYPE_MAP[typeMatch[1]] || 'choice'
      return true
    }
    return false
  }

  function flush() {
    if (buf.length === 0) return
    const raw = buf.join('\n').trim()
    if (!raw) { buf = []; return }
    qidCounter++

    // 剥离题号前缀
    let content = raw.replace(/^\(\d+\)\s*/, '')

    questions.push({
      id: `M1-${opts.book}-C${String(chapterId).padStart(2, '0')}-${String(qidCounter).padStart(4, '0')}`,
      subject: opts.subject,
      book: opts.book,
      sectionId,
      sectionName,
      chapter: chapterId,
      chapterName,
      type: curType,
      questionNumber: qnum,
      page: chPageStart,
      content,
      answer: '',
      analysis: '',
      images: [],
      tags: [],
    })
    buf = []
  }

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const trimmed = raw.trim()

    // 跳过目录区域、封面页、空行
    if (!trimmed ||
        trimmed.startsWith('所有题本') ||
        trimmed.startsWith('# 精讲精练') ||
        trimmed.startsWith('书籍作者') ||
        trimmed.startsWith('题本再排') ||
        trimmed.startsWith('安静做题') ||
        trimmed.startsWith('## 目录') ||
        trimmed.match(/^\S+…+\d+$/) ||  // 目录行 "基础题....2"
        trimmed.match(/^\d+$/) ||  // 纯页码行
        trimmed.startsWith('---')
    ) {
      continue
    }

    // 章节标题
    const chMatch = trimmed.match(CHAPTER_RE)
    if (chMatch) {
      flush()
      const cn = chMatch[1]
      const parsed = parseCnNumber(cn)
      if (parsed !== null) {
        chapterId = parsed
        chapterName = chMatch[2].trim()
        sectionId = '基础'
        sectionName = '基础题'
        curType = 'choice'
        qidCounter = 0
        // 查找章节页码
        const range = ALL_RANGES.find(r => r[0] === chapterId)
        chPageStart = range ? range[2] : 0
      }
      continue
    }

    // 分层/题型标题
    if (trimmed.startsWith('## ')) {
      if (detectSection(trimmed)) {
        flush()
        continue
      }
      // 其他 ## 标题跳过（如 ## 高等数学篇、## 线性代数篇）
      continue
    }

    // 题目编号 (1) (2) ...
    // 注意：MinerU 会把 D 选项和下一个题号连在同一行（无换行）：
    //   D. $\lim_{x\to\infty}f(x)=1$ (4) 设当 $x\to+\infty$ 时...
    // 这种情况在 pdfGenerator 渲染时检测并拆分
    const qMatch = trimmed.match(QUESTION_RE)
    if (qMatch) {
      flush()
      qnum = parseInt(qMatch[1])
      buf = [trimmed]
      continue
    }

    // 子题号 (I) (II) (III)
    if (SUB_Q_RE.test(trimmed) && buf.length > 0) {
      buf.push(trimmed)
      curType = 'answer'
      continue
    }

    // 普通内容行 — 如果是接续上一题的内容
    if (buf.length > 0) {
      buf.push(trimmed)
    }
  }

  flush()

  // ─── 后处理：拆开同行的选项 ─────────────────────
  for (const q of questions) {
    if (q.type !== 'choice') continue
    const lines = q.content.split('\n')
    const newLines: string[] = []
    for (const line of lines) {
      if (OPTION_LINE.test(line)) {
        newLines.push(line)
      } else {
        // 检测同行多选项："A. xxx B. xxx C. xxx D. xxx"
        const split = line.split(/\s+(?=[A-D]\s*[.、）)])/)
        if (split.length >= 3) {
          const reformatted = split.map((s, idx) => {
            if (idx === 0) return s
            const optMatch2 = s.match(/^([A-D])\s*[.、）)]\s*/)
            if (optMatch2) return `${optMatch2[1]}. ${s.slice(optMatch2[0].length)}`
            return s
          })
          newLines.push(...reformatted)
        } else {
          newLines.push(line)
        }
      }
    }
    q.content = newLines.join('\n')
  }

  return questions
}

/**
 * 从 markdown 文件加载整本习题集
 */
export function loadFromMarkdown(
  content: string,
  meta: { subject: string; book: string },
): Question[] {
  return parseMarkdown(content, meta)
}
