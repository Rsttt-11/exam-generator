/**
 * 智能排版 — 修复 PDF 解析导致的文本断裂
 * 在渲染层面做行合并，不修改数据源
 */

/** 渲染题目：合并断裂行 + 分离选项 */
export function reflowQuestion(raw: string): string {
  let lines = raw.split('\n').map(l => l.trim()).filter(Boolean)

  const result: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const isOpt = /^[A-D]\s*[.、）)]/.test(line)

    if (isOpt) {
      // 选项行：拆开挤在一起的选项
      const parts = line.split(/(?=[A-D]\s*[.、）)])/).filter(Boolean)
      for (const p of parts) {
        if (p.trim()) result.push(p.trim())
      }
      continue
    }

    // 非选项行：判断是否应该合并到上一行
    const prev = result[result.length - 1]

    if (!prev) { result.push(line); continue }

    // 合并条件：
    const isShort = line.length <= 8        // 短行（数字、dx、π、n=1 等）
    const isJustNum = /^[\d\-+·π∞e^{}]+$/.test(line) // 纯数字/符号行
    const isParenClose = /^[)}\]]/.test(line) // 闭合括号开头
    const isContinuation = /^[a-z×÷=+→，]/.test(line)  // 小写字母/符号开头（续行）

    if (isJustNum || isParenClose) {
      // 分数/下标：合并
      result[result.length - 1] = prev + line
      continue
    }

    if (isShort && isContinuation) {
      result[result.length - 1] = prev + ' ' + line
      continue
    }

    result.push(line)
  }

  return result.join('\n')
}

/** 一行一行分离选项（用于 PDF 渲染） */
export function splitToLines(text: string): string[] {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const result: string[] = []
  for (const line of lines) {
    if (/^[A-D]\s*[.、）)]/.test(line)) {
      const parts = line.split(/(?=[A-D]\s*[.、）)])/).filter(Boolean)
      for (const p of parts) if (p.trim()) result.push(p.trim())
    } else {
      result.push(line)
    }
  }
  return result
}
