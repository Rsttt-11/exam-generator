/**
 * 题目内容清洗与排版
 *
 * 对 PDF 提取已损坏的数据做最大可读化渲染
 * - 不修改 JSON 源文件
 * - 只在渲染层做合并和清理
 */

// ─── PUA 残留字符映射（浏览器端兜底） ─────────────────────

function mapPua(s: string): string {
  if (!s) return s
  let depth_ee = 0, depth_cb = 0, depth_ed = 0
  return [...s].map(ch => {
    if (ch === '\u{F0EE}') return (depth_ee++ % 2 === 0) ? '(' : ')'
    if (ch === '\u{F0CB}') return (depth_cb++ % 2 === 0) ? '[' : ']'
    if (ch === '\u{F0ED}') return (depth_ed++ % 2 === 0) ? '[' : ']'
    if (ch === '\u{F0EA}') return ']'
    if ('\u{F0EC}' === ch) return '('
    if ('\u{F0EB}' === ch) return ')'
    if ('\u{F0F4}\u{F0F6}\u{F0E2}'.includes(ch)) return '|'
    if ('\u{F0B6}' === ch) return '∫'
    if ('\u{F0B1}' === ch) return '∑'
    if ('\u{F0E8}\u{F0E0}\u{F0E3}'.includes(ch)) return '{'
    if ('\u{F0E9}\u{F0E1}\u{F0E4}'.includes(ch)) return '}'
    if ('\u{F0DC}' === ch) return '['
    if ('\u{F0B7}' === ch) return '·'
    if ('\u{F092}' === ch) return '→'
    if ('\u{F00A}\u{F00B}\u{F00C}\u{F026}\u{F0B8}\u{F0B9}\u{F0BA}\u{200B}'.includes(ch)) return ''
    return ch
  }).join('')
}

// ─── 行重排 ──────────────────────────────────────────

/**
 * 渲染题目内容：处理 PDF 提取产生的断裂行
 *
 * 断裂模式示例（原始数据）：
 *   "limf(x\nx→∞\n)\n=1" → "limf(x  →  )\n=1"
 *
 * 合并规则：
 *   ① 纯数字短行 → 连接到上行尾部（分数/下标）
 *   ② 闭合括号开头行 → 连接到上行尾部（断裂回接）
 *   ③ 极限标记行 (x→∞) → 连接到上行尾部
 *   ④ 小写字母续行 (dx, n=1) → 连接到上行尾部
 *   ⑤ A/B/C/D 挤在一行 → 拆分成独立行
 */
export function reflowQuestion(raw: string): string {
  let s = mapPua(raw)
  const rawLines = s.split('\n').map(l => l.trim()).filter(Boolean)

  const out: string[] = []
  for (const line of rawLines) {
    const isOpt = /^[A-D]\s*[.、）)]/.test(line)

    if (isOpt) {
      // 选项：拆开挤在一起的
      const parts = line.split(/(?=[A-D]\s*[.、）)])/).filter(Boolean)
      for (const p of parts) if (p.trim()) out.push(p.trim())
      continue
    }

    if (out.length === 0) { out.push(line); continue }

    const prev = out[out.length - 1]
    if (/^[A-D]\s*[.、）)]/.test(prev)) { out.push(line); continue }

    const plain = line.replace(/\s/g, '')
    const len = plain.length

    // 合并条件
    const isNumIsland = len <= 6 && /^[\d\-+·π∞e^{}.,;:]+$/.test(plain)
    const isParenClose = /^[)}\]]/.test(line.trim())
    const isLimitTag = /^(x|n|k)\s*→/.test(line.trim())
    const isContinuation = len <= 6 && /^[a-z×÷=+,→]/.test(line.trim())

    if (isNumIsland || isParenClose) {
      out[out.length - 1] = prev + line.trim()
    } else if (isLimitTag || isContinuation) {
      out[out.length - 1] = prev + ' ' + line.trim()
    } else {
      out.push(line)
    }
  }

  // 清理空格
  let result = out.join('\n')
  result = result.replace(/\s{2,}/g, ' ')
  result = result.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')')
  result = result.replace(/\[\s+/g, '[').replace(/\s+\]/g, ']')
  result = result.split('\n').map(l => l.trim()).join('\n').trim()

  return result
}

/** 分割成渲染行（选项独立） */
export function splitToLines(text: string): string[] {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const out: string[] = []
  for (const line of lines) {
    if (/^[A-D]\s*[.、）)]/.test(line)) {
      const parts = line.split(/(?=[A-D]\s*[.、）)])/).filter(Boolean)
      for (const p of parts) if (p.trim()) out.push(p.trim())
    } else {
      out.push(line)
    }
  }
  return out
}
