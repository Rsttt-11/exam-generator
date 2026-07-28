/**
 * 题目内容清洗工具
 * - 映射 PDF 提取产生的 PUA 私用区字符 → 正确数学符号
 * - 清理乱码/垃圾条目
 */

// ─── PUA 字符合映射表 ───────────────────────────────────

/** 成对匹配的字符（需根据奇偶性交替开闭） */
const PAIR_MAP: Record<string, { open: string; close: string }> = {
  //  6624次 — 最通用的括号，开闭同一字符
  '\u{F0EE}': { open: '(', close: ')' },
  //  313次 — 方括号
  '\u{F0CB}': { open: '[', close: ']' },
}

/** 一对一映射 */
const CHAR_MAP: Record<string, string> = {
  // 配对括号（第二套编码）
  '\u{F0EC}': '(',   //  270次
  '\u{F0EB}': ')',   //  270次

  // 竖线
  '\u{F0F4}': '|',   //  528次 — 矩阵行列式竖线
  '\u{F0F6}': '|',   //  273次
  '\u{F0E2}': '|',   //  200次 — 分段函数条件分隔

  // 积分与求和
  '\u{F0B6}': '∫',   //  323次
  '\u{F0B1}': '∑',   //  214次

  // 花括号
  '\u{F0E8}': '{',   //  92次
  '\u{F0E9}': '}',   //  92次
  '\u{F0E0}': '{',   //  200次
  '\u{F0E1}': '}',   //  200次
  '\u{F0E3}': '{',   //  92次
  '\u{F0E4}': '}',   //  83次

  // 方括号类
  '\u{F0DC}': '[',   //  95次 — 在上下文中为括号

  // 点号
  '\u{F0B7}': '·',   //  94次

  // 箭头
  '\u{F092}': '→',   //  38次
}

// ─── 不可见/垃圾字符（直接删除） ───────────────────────────

const REMOVE_PATTERN = /[\u{F00A}\u{F00B}\u{F00C}\u{F026}\u{F0B8}\u{F0B9}\u{F0BA}]/g

// ─── 空格规范化 ─────────────────────────────────────────

const COLLAPSE_WS = /\s{2,}/g

// ─── 成对字符清洗 ──────────────────────────────────────

function cleanPairedChars(text: string, pairChar: string, replacement: { open: string; close: string }): string {
  let depth = 0
  let result = ''
  for (const ch of text) {
    if (ch === pairChar) {
      result += depth % 2 === 0 ? replacement.open : replacement.close
      depth++
    } else {
      result += ch
    }
  }
  return result
}

// ─── 主清洗函数 ─────────────────────────────────────────

export function cleanContent(content: string): string {
  let s = content

  // 1. 成对括号（全局匹配上下文）
  for (const [char, repl] of Object.entries(PAIR_MAP)) {
    s = cleanPairedChars(s, char, repl)
  }

  // 2. 一对一映射
  const mapPattern = new RegExp(
    Object.keys(CHAR_MAP).join('|'),
    'g',
  )
  s = s.replace(mapPattern, (m) => CHAR_MAP[m] ?? m)

  // 3. 删除不可见/垃圾字符
  s = s.replace(REMOVE_PATTERN, '')

  // 4. 合并多余空格
  s = s.replace(COLLAPSE_WS, ' ')

  // 5. 去除行首行尾空白
  s = s.split('\n').map(line => line.trim()).join('\n')

  return s.trim()
}
