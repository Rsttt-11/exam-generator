/**
 * 题库数据清洗脚本
 *
 * 运行: node tools/question-parser/cleanData.js
 *
 * 清洗内容：
 *   - PUA 私用区字符 → 标准 Unicode 数学符号
 *   - 去除封面页/目录等垃圾条目
 *   - 规范化空格和换行
 */

const fs = require('fs')
const path = require('path')

// ─── PUA 字符映射表 ───────────────────────────────────

/** 成对匹配的字符（按出现次序奇偶 → 开/闭） */
const PAIR_MAP = {
  //  (U+F0EE) 6624次 — 最通用的括号
  '': { open: '(', close: ')' },
  //  (U+F0CB) 313次 — 方括号
  '': { open: '[', close: ']' },
  //  (U+F0ED) 610次 — 矩阵/行列式竖括号
  '': { open: '[', close: ']' },
  //  (U+F0EA) 141次 — 矩阵竖括号（变体）
  '': { open: '[', close: ']' },
}

/** 一对一映射 */
const CHAR_MAP = {
  // 括号第二套编码
  '': '(',   //  270次
  '': ')',   //  270次
  // 竖线 / 行列式符号
  '': '|',   //  528次
  '': '|',   //  273次
  '': '|',   //  200次 (分段条件)
  // 积分求和
  '': '∫',   //  323次
  '': '∑',   //  214次
  // 花括号
  '': '{',   //  92次
  '': '}',   //  92次
  '': '{',   //  200次
  '': '}',   //  200次
  '': '{',   //  92次
  '': '}',   //  83次
  // 方括号变体
  '': '[',   //  95次
  // 点号
  '': '·',   //  94次
  // 箭头
  '': '→',   //  38次
}

/** 直接删除的垃圾字符 */
const GARBAGE_RE = /[]/g

/** 零宽空格 */
const ZWS_RE = /​/g

// ─── 清洗函数 ──────────────────────────────────────────

function cleanContent(content) {
  if (!content) return content
  let s = content

  // 1) 成对括号
  for (const [ch, repl] of Object.entries(PAIR_MAP)) {
    let depth = 0
    let out = ''
    for (const c of s) {
      if (c === ch) {
        out += depth % 2 === 0 ? repl.open : repl.close
        depth++
      } else {
        out += c
      }
    }
    s = out
  }

  // 2) 一对一映射
  const mapPattern = new RegExp(Object.keys(CHAR_MAP).join('|'), 'g')
  s = s.replace(mapPattern, (m) => CHAR_MAP[m] || m)

  // 3) 删除垃圾
  s = s.replace(GARBAGE_RE, '')
  s = s.replace(ZWS_RE, '')

  // 4) 空格规范化：去除行内多余空格，但保留换行
  s = s.split('\n')
    .map(line => line
      .replace(/\s{2,}/g, ' ')
      // 去除 ) 前空格:  "(x )" → "(x)"
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      .replace(/\[\s+/g, '[')
      .replace(/\s+\]/g, ']')
      .replace(/\{\s+/g, '{')
      .replace(/\s+\}/g, '}')
      .trim()
    )
    .join('\n')

  return s.trim()
}

// ─── 主流程 ────────────────────────────────────────────

const DATA_DIR = path.join(__dirname, '..', '..', 'public', 'question-bank', 'math1', 'lilin880')

function main() {
  const files = fs.readdirSync(DATA_DIR)
    .filter(f => f.startsWith('chapter') && f.endsWith('.json'))
    .sort()

  let totalQuestions = 0
  let totalCleaned = 0
  let totalRemoved = 0

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file)
    const raw = fs.readFileSync(filePath, 'utf8')
    const questions = JSON.parse(raw)
    const originalCount = questions.length

    const cleaned = questions.filter(q => {
      // 移除封面/目录垃圾
      if (!q.content || !q.content.trim()) return false
      if (q.content.includes('精讲精练') && q.content.includes('做题本')) return false
      if (q.content === '目录') return false

      // 清洗内容
      q.content = cleanContent(q.content)
      q.answer = cleanContent(q.answer || '')
      q.analysis = cleanContent(q.analysis || '')

      return true
    })

    if (cleaned.length !== originalCount) {
      console.log(`  ${file}: ${originalCount} → ${cleaned.length} (移除 ${originalCount - cleaned.length})`)
      totalRemoved += originalCount - cleaned.length
    }

    fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2), 'utf8')
    totalQuestions += cleaned.length

    // 统计清洗效果
    let puaCount = 0
    let cleanQs = 0
    for (const q of cleaned) {
      let hasPua = false
      for (let i = 0; i < q.content.length; i++) {
        const cp = q.content.charCodeAt(i)
        if (cp >= 0xE000 && cp <= 0xF8FF) { puaCount++; hasPua = true }
      }
      if (!hasPua) cleanQs++
    }
    totalCleaned += cleanQs
    if (puaCount > 0) {
      console.log(`  ${file}: ${cleanQs}/${cleaned.length} 无PUA (剩余 ${puaCount} 个 PUA 字符)`)
    }
  }

  console.log(`\n总计: ${totalQuestions} 题, 移除 ${totalRemoved} 条垃圾, ${totalCleaned} 题已清洗`)
}

main()
