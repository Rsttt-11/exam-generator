/**
 * 题目内容清洗（浏览器端）
 * 所有视图通用，用于前端展示
 */

/** 渲染题目内容到可读文本 */
export function renderQuestionContent(raw: string): string {
  if (!raw) return ''
  return raw
    // PUA 成对括号
    .replace(/\u{F0EE}/gu, '(')   // 
    .replace(/\u{F0CB}/gu, '[')   // 
    // PUA 一对一映射
    .replace(/\u{F0ED}/gu, '[')   // 
    .replace(/\u{F0EA}/gu, ']')   // 
    .replace(/\u{F0EC}/gu, '(')   // 
    .replace(/\u{F0EB}/gu, ')')   // 
    .replace(/\u{F0F4}/gu, '|')   // 
    .replace(/\u{F0F6}/gu, '|')   // 
    .replace(/\u{F0E2}/gu, '|')   // 
    .replace(/\u{F0B6}/gu, '∫')   // 
    .replace(/\u{F0B1}/gu, '∑')   // 
    .replace(/\u{F0E8}/gu, '{')   // 
    .replace(/\u{F0E9}/gu, '}')   // 
    .replace(/\u{F0E0}/gu, '{')   // 
    .replace(/\u{F0E1}/gu, '}')   // 
    .replace(/\u{F0E3}/gu, '{')   // 
    .replace(/\u{F0E4}/gu, '}')   // 
    .replace(/\u{F0DC}/gu, '[')   // 
    .replace(/\u{F0B7}/gu, '·')   // 
    .replace(/\u{F092}/gu, '→')   // 
    // 直接删除的字符（含 PUA 空隙 chars）
    .replace(/[\u{F00A}\u{F00B}\u{F00C}\u{F026}\u{F0B8}\u{F0B9}\u{F0BA}\u{200B}]/gu, '')
    .trim()
}

/** 渲染选项行（A. xxx B. xxx → 换行分段） */
export function renderOptions(text: string): string {
  return text.replace(/([A-D])\./g, '\n$1. ').trim()
}

/** 内联数学公式概览（PDF 和预览用） */
export function simpleLatex(raw: string): string {
  let s = renderQuestionContent(raw)
  s = s.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)')
  s = s.replace(/\^\{([^}]*)\}/g, '^$1')
  s = s.replace(/\_\{([^}]*)\}/g, '_$1')
  s = s.replace(/\\sqrt\{([^}]*)\}/g, '√($1)')
  s = s.replace(/\\int/g, '∫')
  s = s.replace(/\\sum/g, '∑')
  s = s.replace(/\\infty/g, '∞')
  s = s.replace(/\\to/g, '→')
  s = s.replace(/\\partial/g, '∂')
  s = s.replace(/\\sin/g, 'sin').replace(/\\cos/g, 'cos').replace(/\\tan/g, 'tan')
  s = s.replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\pi/g, 'π')
  s = s.replace(/\\([a-zA-Z]+)/g, '$1')
  return s.trim()
}
