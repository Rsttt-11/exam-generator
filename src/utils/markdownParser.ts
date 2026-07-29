/**
 * Markdown 题库解析器
 *
 * 解析标准 Markdown 题库文件，提取题目结构。
 *
 * 输入格式：
 * ```markdown
 * # 第X章 章节名称
 *
 * ## 基础题
 *
 * 1. 题目内容 $f(x)=\int_a^b x^2\,dx$
 *    A. 选项A $x+y$
 *    B. 选项B
 *    C. 选项C
 *    D. 选项D
 *
 * 2. 填空题内容 $x=$______.
 *
 * ## 综合题
 *
 * 1. (I) 第一问 (II) 第二问 (III) 第三问
 * ```
 *
 * 输出：Question[]（与现有类型完全兼容）
 */

import type { Question } from '@/types'

export interface MarkdownMeta {
  subject: string
  book: string
  /** 章列表：{ id, name, startLine, endLine } */
  chapters: { id: number; name: string; pageStart?: number; pageEnd?: number }[]
}

// ─── 正则 ──────────────────────────────────────────────

const CHAPTER_RE = /^#\s{1,4}第(\d+)\s*章\s*(.*)/
const SECTION_RE = /^#{2,4}\s+(.+)/  // 二级标题（基础题/综合题/拓展题）
const QUESTION_RE = /^\d+[.、）)]\s*(.*)/
const OPTION_RE = /^([A-D])\s*[.、）)]\s*(.*)/
const SUB_QUESTION_RE = /^\(([IVXL]+|[一二三四五六七八九十]+)\)/

const SECTION_NAMES: Record<string, string> = {
  '基础题': '基础',
  '基础': '基础',
  '综合题': '综合',
  '综合': '综合',
  '拓展题': '拓展',
  '拓展': '拓展',
  '基础篇': '基础',
  '综合篇': '综合',
  '拓展篇': '拓展',
}

// ─── 智能类型检测 ─────────────────────────────────────

function detectType(lines: string[]): 'choice' | 'blank' | 'answer' {
  const joined = lines.join(' ')
  // 如果包含 A. B. C. D. 选项 → choice
  if (/(?:^|\s)[A-D]\s*[.、）)](?:\s|$)/.test(joined)) {
    return 'choice'
  }
  // 如果是解答题特征（多行、有小问号 (I)(II) 等）
  if (SUB_QUESTION_RE.test(joined) || joined.includes('解答题') || joined.includes('证明')) {
    return 'answer'
  }
  // 包含下划线填空 → blank
  if (/_{3,}|______/.test(joined) || /$____/.test(joined)) {
    return 'blank'
  }
  // 如果超过 3 行且有复杂结构 → answer
  if (lines.length > 4) {
    return 'answer'
  }
  return 'blank' // 默认
}

function detectSection(name: string): { sectionId: string; sectionName: string } {
  const trimmed = name.trim()
  // 去掉 "一、" "1." 等前缀
  const clean = trimmed.replace(/^[一二三四五六七八九十]+[.、）)]\s*/, '').trim()
  const sid = SECTION_NAMES[clean]
  if (sid) {
    return { sectionId: sid, sectionName: clean }
  }
  // 不认识的分节名，尝试映射
  return { sectionId: clean, sectionName: clean }
}

// ─── 解析器 ───────────────────────────────────────────

export function parseMarkdown(
  content: string,
  subject: string,
  book: string,
  options?: {
    /** 覆盖章节 ID（跨文件时需要） */
    chapterOffset?: number
    /** 手动指定文件名→章节映射 */
    chapterMap?: [number, string][]
  },
): Question[] {
  const lines = content.split('\n')
  const questions: Question[] = []
  let chapterId = 0
  let chapterName = ''
  let sectionId = ''
  let sectionName = ''
  let curType: 'choice' | 'blank' | 'answer' = 'choice'
  let buf: string[] = []
  let qnum = 0
  let qidCounter = 0

  // 如果提供了 chapterMap，逐个匹配
  const chMap = options?.chapterMap || []

  function flush() {
    if (buf.length === 0) return
    const content = buf.join('\n').trim()
    if (!content) { buf = []; return }
    qidCounter++
    // 从 content 中剥离题号前缀（第一行可能带 "1. "）
    const cleanContent = content.replace(/^\d+\s*[.、）)]\s*/, '')
    const type = curType
    questions.push({
      id: `M1-${book}-C${String(chapterId).padStart(2, '0')}-${String(qidCounter).padStart(4, '0')}`,
      subject,
      book,
      sectionId,
      sectionName,
      chapter: chapterId,
      chapterName,
      type,
      questionNumber: qnum,
      page: 0,
      content: cleanContent,
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

    // 跳过空行、分割线、表格、代码块
    if (!trimmed || trimmed.startsWith('---') || trimmed.startsWith('|') || trimmed.startsWith('```')) {
      continue
    }

    // 章节标题 # 第X章 XXX
    const chMatch = trimmed.match(CHAPTER_RE)
    if (chMatch) {
      flush()
      chapterId = parseInt(chMatch[1])
      chapterName = chMatch[2].trim()
      sectionId = ''
      sectionName = ''
      qidCounter = 0
      continue
    }

    // 如果有 chapterMap，翻页检测
    for (const [cid, cname] of chMap) {
      if (trimmed.startsWith(`# ${cid}`) || trimmed.startsWith(`# 第${cid}章`)) {
        flush()
        chapterId = cid
        chapterName = cname
        sectionId = ''
        sectionName = ''
        qidCounter = 0
        break
      }
    }

    // 二级标题 ## 基础题 / 综合题 / 拓展题
    const secMatch = trimmed.match(SECTION_RE)
    if (secMatch && !QUESTION_RE.test(trimmed) && !OPTION_RE.test(trimmed)) {
      flush()
      const sec = detectSection(secMatch[1])
      sectionId = sec.sectionId
      sectionName = sec.sectionName
      curType = 'choice' // reset type
      continue
    }

    // 题型标注行（"选择题" "填空题" "解答题"）
    const typeMatch = trimmed.match(/^[一二三]+[.、）)]?\s*(选择题|填空题|解答题)/)
    if (typeMatch) {
      flush()
      const t = typeMatch[1]
      curType = t === '选择题' ? 'choice' : t === '填空题' ? 'blank' : 'answer'
      continue
    }

    // 题目编号
    const qMatch = trimmed.match(QUESTION_RE)
    if (qMatch) {
      flush()
      qnum = parseInt(trimmed.match(/^(\d+)/)?.[1] || '0')
      buf = [trimmed]
      // 如果题目编号行后面直接跟选项（A. B.），保留
      // 类型检测：如果有选项行特征
      continue
    }

    // 选项行 A./B./C./D.
    const optMatch = trimmed.match(OPTION_RE)
    if (optMatch && buf.length > 0) {
      buf.push(trimmed)
      curType = 'choice'
      continue
    }

    // 子题号 (I)(II)(III)
    if (SUB_QUESTION_RE.test(trimmed) && buf.length > 0) {
      buf.push(trimmed)
      curType = 'answer'
      continue
    }

    // 普通续行
    if (buf.length > 0 && trimmed) {
      buf.push(trimmed)
    }
  }

  // 最后一题
  flush()

  // 后处理：类型自动修正
  for (const q of questions) {
    const lines = q.content.split('\n')
    const detected = detectType(lines)
    if (detected === 'answer' && q.type !== 'answer') {
      // 如果检测到解答题特征，修正
      q.type = 'answer'
    }
    if (detected === 'choice' && lines.length >= 4) {
      q.type = 'choice'
    }
  }

  return questions
}

/**
 * 从 book.json 元数据 + Markdown 内容加载整本习题集
 */
export function loadFromMarkdown(
  content: string,
  meta: {
    subject: string
    book: string
    chapters: { id: number; name: string }[]
  },
): Question[] {
  return parseMarkdown(content, meta.subject, meta.book, {
    chapterMap: meta.chapters.map(ch => [ch.id, ch.name]),
  })
}
