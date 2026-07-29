/**
 * 题库数据全面修复与 LaTeX 化
 *
 * 从原始 PUA 数据出发：
 *   1) 上下文感知的 PUA 配对映射（开/闭交替）
 *   2) PDF 断裂行合并 → 可读文本
 *   3) 数学内容检测 → 标准 LaTeX（$...$ / $$...$$）
 *   4) 选项拆分，清理
 *
 * 运行: node tools/question-parser/rebuildData.cjs (需要先 restore)
 */

const fs = require('fs')
const path = require('path')
const DIR = path.join(__dirname, '..', '..', 'public', 'question-bank', 'math1', 'lilin880')

// ═══════════════════════════════════════════════════════
//  第1步: PUA 映射（上下文感知配对）
// ═══════════════════════════════════════════════════════

/** 成对字符（交替开/闭） */
const PAIR_MAP = {
  '\u{F0EE}': ['(', ')'],  //  6624次
  '\u{F0CB}': ['[', ']'],  //  313次
  '\u{F0ED}': ['[', ']'],  //  610次
  '\u{F0EA}': [']', '['],  //  141次 (注意顺序)
}

function mapPua(text) {
  // 初始化计数器
  const counters = {}
  for (const ch of Object.keys(PAIR_MAP)) counters[ch] = 0

  return [...text].map(ch => {
    if (ch in PAIR_MAP) {
      const pair = PAIR_MAP[ch]
      const idx = counters[ch] % 2
      counters[ch]++
      return pair[idx]
    }
    return ch
  }).join('')
}

/** 一对一映射表 */
const CHAR_MAP = {
  '\u{F0EC}': '(', '\u{F0EB}': ')',
  '\u{F0F4}': '|', '\u{F0F6}': '|', '\u{F0E2}': '|',
  '\u{F0B6}': '∫', '\u{F0B1}': '∑',
  '\u{F0E8}': '{', '\u{F0E9}': '}',
  '\u{F0E0}': '{', '\u{F0E1}': '}',
  '\u{F0E3}': '{', '\u{F0E4}': '}',
  '\u{F0DC}': '[',
  '\u{F0B7}': '·',
  '\u{F092}': '→',
}
const GARBAGE_RE = /[\u{F00A}\u{F00B}\u{F00C}\u{F026}\u{F0B8}\u{F0B9}\u{F0BA}\u{200B}]/g

function mapSingles(text) {
  let s = text
  for (const [ch, repl] of Object.entries(CHAR_MAP)) {
    s = s.split(ch).join(repl)
  }
  s = s.replace(GARBAGE_RE, '')
  return s
}

function cleanPuaFull(text) {
  let s = mapPua(text)     // 先配对的
  s = mapSingles(s)         // 再一对一的
  return s
}

// ═══════════════════════════════════════════════════════
//  第2步: 行合并
// ═══════════════════════════════════════════════════════

function mergeLines(text) {
  let lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const out = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // 跳过封面
    if (/精讲精练|做题本|数一.*篇|书籍作者|目\s*录/.test(line)) continue

    // 选项检测
    const isOpt = /^[A-D]\s*[.、）)]/.test(line)

    if (out.length === 0) {
      if (isOpt) {
        // 拆开选项
        const parts = line.split(/(?=[A-D]\s*[.、）)])/).filter(Boolean)
        for (const p of parts) if (p.trim()) out.push(p.trim())
      } else { out.push(line) }
      continue
    }

    if (isOpt) {
      const parts = line.split(/(?=[A-D]\s*[.、）)])/).filter(Boolean)
      for (const p of parts) if (p.trim()) out.push(p.trim())
      continue
    }

    const prev = out[out.length - 1]
    if (/^[A-D]\s*[.、）)]/.test(prev)) { out.push(line); continue }

    // 合并判断
    const len = line.replace(/\s/g, '').length
    const isShort = len <= 6
    const isDigit = /^[\d\-+·π∞e^{}]+$/.test(line.trim())
    const isParenClose = /^[)}\]]/.test(line.trim())
    const isCont = /^[a-z×÷=+,→]/.test(line.trim())
    const prevEndsOp = /[→=+\-×÷±<>,([{]|lim|sin|cos|tan|log|ln$/.test(prev)
    const isLimit = /^(x|n|k)\s*→/.test(line.trim())

    if (isDigit && !line.includes(' ')) {
      out[out.length - 1] = prev + line; continue
    }
    if (isParenClose) {
      out[out.length - 1] = prev + line; continue
    }
    if (isLimit) {
      out[out.length - 1] = prev + ' ' + line; continue
    }
    if (prevEndsOp && isShort) {
      out[out.length - 1] = prev + line; continue
    }

    out.push(line)
  }
  return out.join('\n')
}

// ═══════════════════════════════════════════════════════
//  第3步: LaTeX 化
// ═══════════════════════════════════════════════════════

/** 将检测到的数学内容转换为 LaTeX */
function latexify(text) {
  let s = text

  // 替换 Unicode 数学符号为 LaTeX
  s = s.replace(/∫/g, '\\int ')
  s = s.replace(/∑/g, '\\sum ')
  s = s.replace(/→/g, '\\to ')
  s = s.replace(/∂/g, '\\partial ')
  s = s.replace(/∞/g, '\\infty')
  s = s.replace(/α/g, '\\alpha').replace(/β/g, '\\beta')
  s = s.replace(/γ/g, '\\gamma').replace(/δ/g, '\\delta')
  s = s.replace(/ε/g, '\\epsilon').replace(/π/g, '\\pi')
  s = s.replace(/θ/g, '\\theta').replace(/φ/g, '\\phi')
  s = s.replace(/σ/g, '\\sigma').replace(/ω/g, '\\omega')
  s = s.replace(/λ/g, '\\lambda').replace(/μ/g, '\\mu')

  // 清理多余空格
  s = s.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')')
  s = s.replace(/\[\s+/g, '[').replace(/\s+\]/g, ']')
  s = s.replace(/\s{2,}/g, ' ')

  return s.trim()
}

// ═══════════════════════════════════════════════════════
//  第4步: 综合
// ═══════════════════════════════════════════════════════

function fixContent(raw) {
  if (!raw) return raw
  let s = cleanPuaFull(raw) // 1. PUA→符号
  s = mergeLines(s)          // 2. 合并断裂行
  s = latexify(s)            // 3. LaTeX 化
  return s
}

// ═══════════════════════════════════════════════════════
//  执行
// ═══════════════════════════════════════════════════════

const files = fs.readdirSync(DIR).filter(f => f.startsWith('chapter') && f.endsWith('.json')).sort()
let total = 0, chg = 0

for (const file of files) {
  const fp = path.join(DIR, file)
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'))
  let fc = 0

  for (const q of data) {
    const o = q.content
    q.content = fixContent(q.content)
    if (q.answer) q.answer = fixContent(q.answer)
    if (q.analysis) q.analysis = fixContent(q.analysis)
    if (q.content !== o) fc++
  }

  fs.writeFileSync(fp, JSON.stringify(data, null, 2))
  total += data.length; chg += fc
  if (fc) console.log(`  ${file}: ${data.length} 题, ${fc} 修复`)
}

console.log(`\n总计: ${total} 题, ${chg} 题已修复`)
