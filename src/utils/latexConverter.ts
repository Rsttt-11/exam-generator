/**
 * 内容 → LaTeX 数学公式转换器
 *
 * 将清洗后的题目文本转为适合 KaTeX 渲染的格式：
 * - 消除 PUA 字符
 * - 将 Unicode 数学符号转为 LaTeX 命令
 * - 智能检测数学区域并包裹 $...$
 * - 保持中文文本原样
 *
 * 输出范例：
 *   "设函数f(x)=\int_{-∞}^{+∞} e^{-x^2} dx，则..."
 *   → "设函数$f(x)=\int_{-\infty}^{+\infty} e^{-x^2} dx$，则..."
 */

type PairState = Record<string, number>

const PAIR_MAP: Record<string, [string, string]> = {
  '\u{F0EE}': ['(', ')'],
  '\u{F0CB}': ['[', ']'],
  '\u{F0ED}': ['[', ']'],
  '\u{F0EA}': [']', '['],  // swapped
}

const PUA_CHAR_MAP: Record<string, string> = {
  '\u{F0EC}': '(', '\u{F0EB}': ')',
  '\u{F0F4}': '|', '\u{F0F6}': '|', '\u{F0E2}': '|',
  '\u{F0B6}': '\\int ', '\u{F0B1}': '\\sum ',
  '\u{F0E8}': '{', '\u{F0E9}': '}', '\u{F0E0}': '{', '\u{F0E1}': '}',
  '\u{F0E3}': '{', '\u{F0E4}': '}',
  '\u{F0DC}': '[',
  '\u{F0B7}': '\\cdot ',
  '\u{F092}': '\\to ',
  '\u{F001}': '\\cdot ',
}

const PUA_STRIP = /[\u{F00A}\u{F00B}\u{F00C}\u{F026}\u{F0B8}\u{F0B9}\u{F0BA}\u{200B}]/gu

/**
 * Unicode 数学符号 → LaTeX 宏
 */
const UNI_MAP: [RegExp, string][] = [
  [/[αάΑ]/g,    '\\alpha '],
  [/β/g,        '\\beta '],
  [/γ/g,        '\\gamma '],
  [/δ/g,        '\\delta '],
  [/[εέΕ]/g,    '\\varepsilon '],
  [/[θϑΘ]/g,    '\\theta '],
  [/λ/g,        '\\lambda '],
  [/π/g,        '\\pi '],
  [/ρ/g,        '\\rho '],
  [/σ/g,        '\\sigma '],
  [/τ/g,        '\\tau '],
  [/[φϕΦ]/g,    '\\phi '],
  [/ω/g,        '\\omega '],
  [/μ/g,        '\\mu '],
  [/×/g,        '\\times '],
  [/÷/g,        '\\div '],
  [/±/g,        '\\pm '],
  [/∞/g,        '\\infty '],
  [/∂/g,        '\\partial '],
  [/→/g,        '\\to '],
  [/∈/g,        '\\in '],
  [/∉/g,        '\\notin '],
  [/√/g,        '\\sqrt '],
  [/≠/g,        '\\neq '],
  [/≥/g,        '\\geq '],
  [/≤/g,        '\\leq '],
  [/·/g,        '\\cdot '],
]

// ─── PUA 清除 ──────────────────────────────────────────

/**
 * 清除 PUA 字符，映射为正常符号
 */
export function cleanPua(raw: string): string {
  let s = ''
  const pairState: PairState = { '\u{F0EE}': 0, '\u{F0CB}': 0, '\u{F0ED}': 0, '\u{F0EA}': 0 }

  for (const ch of raw) {
    if (ch in PAIR_MAP) {
      const [open, close] = PAIR_MAP[ch]
      const idx = pairState[ch] % 2
      pairState[ch]++
      s += idx === 0 ? open : close
    } else if (ch in PUA_CHAR_MAP) {
      s += PUA_CHAR_MAP[ch]
    } else {
      s += ch
    }
  }

  s = s.replace(PUA_STRIP, '')
  return s
}

/**
 * Unicode 数学符号 → LaTeX 宏
 */
export function unicodeToLatex(s: string): string {
  for (const [re, latex] of UNI_MAP) {
    s = s.replace(re, latex)
  }
  return s
}

// ─── 智能数学区域检测 ├─────────────────────────────────

/**
 * 从一行文本中检测数学区域并包裹 $...$
 *
 * 策略：
 * 1. 按中文字符和标点分割文本
 * 2. 每个片段判断是否包含数学元素（LaTeX 命令、=号、字母函数等）
 * 3. 数学片段用 $...$ 包裹，文本片段保持原样
 */
function wrapMathInLine(line: string): string {
  const trimmed = line.trim()
  if (!trimmed) return ''

  // 先转换符号 → LaTeX
  let s = unicodeToLatex(trimmed)

  // 判断行是否含数学内容
  const mathTrigger = /\\int|\\sum|\\infty|\\partial|\\neq|\\geq|\\leq|\\to|\\times|\\div|\\pm|\\cdot|\\alpha|\\beta|\\pi|\\theta|\\phi|\\in|\\sqrt|\\sin|\\cos|\\tan|\\lim|\\notin/
  const hasLatexCmd = mathTrigger.test(s)
  const hasFuncCall = /[a-zA-Z]\s*\(/.test(s) && !/^[A-D]\s*[.、）)]/.test(s)
  const hasEquals = /=/.test(s) && /[a-zA-Z0-9\\]/.test(s)
  const isOption = /^[A-D]\s*[.、）)]/.test(s)

  if (isOption) {
    // 选项行：只将明显数学部分包裹
    return wrapMathSegments(s, false)
  }

  if (hasLatexCmd || hasFuncCall || (hasEquals && s.replace(/[一-鿿]/g, '').trim().length > 3)) {
    return wrapMathSegments(s, true)
  }

  return s
}

/**
 * 按中文字符分割行，非中文部分包裹 $...$
 */
function wrapMathSegments(s: string, _aggressive: boolean): string {
  // 按中文字符、中文标点、英文标点组合分割
  // 使用正则分割：中文字符和非中文字符块
  const parts = s.split(/([一-鿿〇]+)/g)
  const out: string[] = []
  let i = 0

  while (i < parts.length) {
    if (/^[一-鿿〇]+$/.test(parts[i])) {
      // 纯中文
      out.push(parts[i])
      i++
    } else {
      // 非中文块（可能是数学）
      let mathBuf = ''
      while (i < parts.length && !/^[一-鿿〇]+$/.test(parts[i])) {
        mathBuf += parts[i]
        i++
      }
      mathBuf = mathBuf.trim()
      if (mathBuf) {
        // 只有包含数学意义的才包裹
        const hasMath = /[a-zA-Z0-9\\=∫∑∞∂≠≥≤→×÷±αβγπθφ∈√\^_\{\}]/.test(mathBuf)
        if (hasMath) {
          out.push(`$${mathBuf}$`)
        } else {
          out.push(mathBuf)
        }
      }
    }
  }

  return out.join('')
}

/**
 * 将题目内容转换为 LaTeX 格式（用于 HTML+KaTeX 渲染）
 */
export function toLatex(raw: string): string {
  const cleaned = cleanPua(raw)
  const lines = cleaned.split('\n')
  return lines.map(line => wrapMathInLine(line)).join('\n')
}

/**
 * LaTeX → 纯文本（降级方案，用于不支持 LaTeX 的场景）
 */
export function latexToPlain(latex: string): string {
  return latex
    .replace(/\$([^$]*)\$/g, '$1')
    .replace(/\\frac\s*\{([^}]*)\}\s*\{([^}]*)\}/g, '($1)/($2)')
    .replace(/\^\{([^}]*)\}/g, '^$1')
    .replace(/\_\{([^}]*)\}/g, '_{$1}')
    .replace(/\\sqrt\s*\{([^}]*)\}/g, '√($1)')
    .replace(/\\int\s*(?:_\{([^}]*)\})?\s*(?:\^\{([^}]*)\})?/g, '∫')
    .replace(/\\sum\s*(?:_\{([^}]*)\})?\s*(?:\^\{([^}]*)\})?/g, '∑')
    .replace(/\\lim\s*(?:_\{([^}]*)\})?/g, 'lim')
    .replace(/\\(sin|cos|tan|cot|sec|csc|ln|lg|log)/g, '$1')
    .replace(/\\(alpha|beta|gamma|delta|pi|theta|phi|omega|mu|varepsilon|rho|sigma|tau|lambda)/g, '')
    .replace(/\\infty/g, '∞')
    .replace(/\\to|\\rightarrow/g, '→')
    .replace(/\\partial/g, '∂')
    .replace(/\\neq/g, '≠')
    .replace(/\\geq/g, '≥')
    .replace(/\\leq/g, '≤')
    .replace(/\\times/g, '×')
    .replace(/\\div/g, '÷')
    .replace(/\\pm/g, '±')
    .replace(/\\cdot/g, '·')
    .replace(/\\cdots/g, '…')
    .replace(/\\in/g, '∈')
    .replace(/\\[a-zA-Z]+/g, '')
    .trim()
}
