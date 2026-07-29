/**
 * 题库数据智能化修复 v4
 *
 * 核心策略：在 PUA 原始文本上操作，先修断裂再映射
 *
 * 断裂合并规则（原始 PUA 文本，尚未映射）：
 *   - 孤立数字行（"π", "2", "0" 等）→ 合并到上行（作为分数）
 *   - 极限标记行（"x→∞", "n→∞"）→ 合并到上行
 *   - 闭合括号起始行 → 合并到上行
 *   - 小写字母/数字起始的短行 → 合并到上行（可能是下标）
 *   - A/B/C/D 选项挤在一行 → 拆为独立行
 *
 * 运行: node tools/question-parser/repairData.cjs
 */

const fs = require('fs')
const path = require('path')

const DIR = path.join(__dirname, '..', '..', 'public', 'question-bank', 'math1', 'lilin880')

// ═══════════════════════════════════════════════════
//  规则
// ═══════════════════════════════════════════════════

/** 纯数字短行（含 π∞e 等符号），极可能是分数孤岛 */
const RE_NUM_ISLAND = /^[\s\d.,\-+·π∞e×÷±\u{F0EE}\u{F0EC}\u{F0EB}]+$/u
/** 极限/下标标记（原始 PUA 文本，匹配 "x→∞" 类模式） */
const RE_LIMIT_TAG = /^[\s]*(x|n|k|i|j|N)\s*→\s*[\d∞\-]+[\s\u{F0EE}\u{F0EC}\u{F0EB}]*$/
/** 纯变量名短行（可能是下标） */
const RE_VAR_ISLAND = /^[\s]*(n|x|y|z|t|i|j|k|p|q|N|T|k|σ|μ|λ)[\s\u{F0EE}\u{F0EC}\u{F0EB}]*$/
/** 以闭合括号开头的行 */
const RE_CLOSE_START = /^[\s]*[\u{F0EB}\u{F0EE}\)\]]/
/** 以开放符号结尾的行 */
const RE_OPEN_END = /[\u{F0EE}\u{F0EC}\u{F0CB}\u{F0DC}\u{F0E8}\u{F0E0}\u{F0E3}([{=+→→∞]$/
/** 选项标记 */
const RE_OPTION = /^[A-D]\s*[.、）)]/

// ═══════════════════════════════════════════════════
//  PUA → 标准符号（最终映射）
// ═══════════════════════════════════════════════════

function puaMap(s) {
  return s
    .replace(/\u{F0EE}/g, '(')   //  → (
    .replace(/\u{F0CB}/g, '[')   //  → [
    .replace(/\u{F0ED}/g, '[')   //  → [
    .replace(/\u{F0EA}/g, ']')   //  → ]
    .replace(/\u{F0EC}/g, '(')   //  → (
    .replace(/\u{F0EB}/g, ')')   //  → )
    .replace(/[\u{F0F4}\u{F0F6}\u{F0E2}]/g, '|')
    .replace(/\u{F0B6}/g, '∫')
    .replace(/\u{F0B1}/g, '∑')
    .replace(/[\u{F0E8}\u{F0E0}\u{F0E3}]/g, '{')
    .replace(/[\u{F0E9}\u{F0E1}\u{F0E4}]/g, '}')
    .replace(/\u{F0DC}/g, '[')
    .replace(/\u{F0B7}/g, '·')
    .replace(/\u{F092}/g, '→')
    .replace(/[\u{F00A}\u{F00B}\u{F00C}\u{F026}\u{F0B8}\u{F0B9}\u{F0BA}\u{200B}]/g, '')
}

// ═══════════════════════════════════════════════════
//  行合并（PUA 原始文本上操作）
// ═══════════════════════════════════════════════════

function isOptionLine(s) { return RE_OPTION.test(s) }

function isCompleteLine(s) {
  // A/B/C/D 选项行总是完整的
  if (isOptionLine(s)) return true
  // 长度 > 40 的通常完整
  if (s.length > 40) return true
  // 以句号/右括号/问号结束的通常完整
  if (/[。)？?}\]）.．:]$/.test(s)) return true
  // 包含常见完整句子标记
  if (/则(下列|其中|有|当|设|函数|在|对|若|已|由)/.test(s)) return true
  return false
}

function mergeRawLines(lines) {
  const out = []

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim()
    if (!line) continue

    // 跳过封面/目录
    if (/精讲精练|做题本|数一高数篇|书籍作者|目 录/.test(line)) continue

    const isNumIsland = RE_NUM_ISLAND.test(line) && line.replace(/\s/g,'').length < 8
    const isLimitTag = RE_LIMIT_TAG.test(line)
    const isVarIsland = RE_VAR_ISLAND.test(line)
    const isCloseStart = RE_CLOSE_START.test(line) && !isOptionLine(line)
    const isOption = isOptionLine(line)

    if (out.length === 0) { out.push(line); continue }

    const prev = out[out.length - 1]
    const prevEndsOpen = RE_OPEN_END.test(prev)
    const prevComplete = isCompleteLine(prev)

    // ─── 合并判断 ───

    // 数字孤岛：合并到上行作为分数
    if (isNumIsland) {
      out[out.length - 1] = prevEndsOpen ? prev + line : prev + '/' + line
      continue
    }

    // 极限/下标标记：合并到上行
    if (isLimitTag) {
      out[out.length - 1] = prev + line
      continue
    }

    // 纯变量孤岛：合并到上行
    if (isVarIsland) {
      out[out.length - 1] = prev + line
      continue
    }

    // 闭合括号开头的行：合并到上行（除非是选项行）
    if (isCloseStart) {
      out[out.length - 1] = prev + line
      continue
    }

    // 上行以开放符号结尾：合并
    if (prevEndsOpen) {
      out[out.length - 1] = prev + line
      continue
    }

    // A/B/C/D 选项：如果上一行也是选项，独立；否则作为新行
    if (isOption) {
      // 如果一行有多个选项（A. .. B. .. C. .. D. .. 挤在一起）
      const parts = line.split(/(?=[A-D]\s*[.、）)])/).filter(Boolean)
      for (const p of parts) {
        if (p.trim()) out.push(p.trim())
      }
      continue
    }

    // 默认：新行
    out.push(line)
  }

  return out
}

// ═══════════════════════════════════════════════════
//  后处理
// ═══════════════════════════════════════════════════

function clean(s) {
  return s
    .replace(/\(\s+/g, '(').replace(/\s+\)/g, ')')
    .replace(/\[\s+/g, '[').replace(/\s+\]/g, ']')
    .replace(/\s{2,}/g, ' ')
    .split('\n').map(l => l.trim()).join('\n')
    .trim()
}

// ═══════════════════════════════════════════════════
//  主修复
// ═══════════════════════════════════════════════════

function repairContent(raw) {
  if (!raw) return raw

  // Step 1: 在原始 PUA 文本上分割
  let lines = raw.split('\n')

  // Step 2: 智能行合并（保留 PUA）
  lines = mergeRawLines(lines)

  // Step 3: 再分离合并的选项行
  lines = mergeRawLines(lines)

  // Step 4: 合成字符串
  let s = lines.join('\n')

  // Step 5: PUA → 标准符号
  s = puaMap(s)

  // Step 6: 清理
  s = clean(s)

  return s
}

// ═══════════════════════════════════════════════════
//  执行
// ═══════════════════════════════════════════════════

const files = fs.readdirSync(DIR)
  .filter(f => f.startsWith('chapter') && f.endsWith('.json'))
  .sort()

let total = 0, changed = 0

for (const file of files) {
  const fp = path.join(DIR, file)
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'))
  let fc = 0

  for (const q of data) {
    const orig = q.content
    q.content = repairContent(q.content)
    if (q.answer) q.answer = repairContent(q.answer)
    if (q.analysis) q.analysis = repairContent(q.analysis)
    if (q.content !== orig) fc++
  }

  fs.writeFileSync(fp, JSON.stringify(data, null, 2))
  total += data.length
  changed += fc
  if (fc > 0) console.log(`  ${file}: ${data.length} 题, ${fc} 修复`)
}

console.log(`\n总计: ${total} 题, ${changed} 题已修复`)
