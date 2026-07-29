/**
 * 题库数据修复 & LaTeX 转换引擎
 *
 * 从原始 PUA 数据出发，逐字符上下文修复：
 *   1) 成对 PUA 符号上下文匹配（开/闭交替）
 *   2) 数学内容检测与 LaTeX 格式化
 *   3) 所有公式/符号恢复正确含义
 *
 * 运行: node tools/question-parser/fixAll.cjs
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const DIR = path.join(__dirname, '..', '..', 'public', 'question-bank', 'math1', 'lilin880')

// ═══════════════════════════════════════════
//  先恢复到原始 PUA 数据
// ═══════════════════════════════════════════

console.log('=== 恢复到原始PUA数据 (commit 31d8827) ===')
for (const ch of ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22']) {
  const json = execSync('git show 31d8827:public/question-bank/math1/lilin880/chapter'+ch+'.json', { encoding: 'utf8' })
  fs.writeFileSync(path.join(DIR, 'chapter'+ch+'.json'), json)
}

// ═══════════════════════════════════════════
//  PUA 映射表
// ═══════════════════════════════════════════

/** 成对字符 - 交替开/闭 */
function puaPaired(s) {
  let depth_ee = 0  //  → ( 或 )
  let depth_cb = 0  //  → [ 或 ]
  let depth_ed = 0  //  → [ 或 ]
  let depth_ea = 0  //  → ] 或 [

  return [...s].map(ch => {
    switch (ch) {
      case '\u{F0EE}': return (depth_ee++ % 2 === 0) ? '(' : ')'
      case '\u{F0CB}': return (depth_cb++ % 2 === 0) ? '[' : ']'
      case '\u{F0ED}': return (depth_ed++ % 2 === 0) ? '\u{23A1}' : '\u{23A4}'  // ⎡ ⎤ (矩阵方括号)
      case '\u{F0EA}': return (depth_ea++ % 2 === 0) ? '[' : ']'
      default: return ch
    }
  }).join('')
}

/** 一对一映射 */
function puaSingles(s) {
  return s
    .replace(/\u{F0EC}/g, '(')    //  → (
    .replace(/\u{F0EB}/g, ')')    //  → )
    .replace(/\u{F0F4}/g, '|')    //  → | (行列式)
    .replace(/\u{F0F6}/g, '|')    //  → | (行列式)
    .replace(/\u{F0E2}/g, '|')    //  → | (竖线)
    .replace(/\u{F0B6}/g, '\\int ')  //  → \int
    .replace(/\u{F0B1}/g, '\\sum ')  //  → \sum
    .replace(/\u{F0E8}/g, '\\{')  //  → {
    .replace(/\u{F0E9}/g, '\\}')  //  → }
    .replace(/\u{F0E0}/g, '\\{')  //  → {
    .replace(/\u{F0E1}/g, '\\}')  //  → }
    .replace(/\u{F0E3}/g, '\\{')  //  → {
    .replace(/\u{F0E4}/g, '\\}')  //  → }
    .replace(/\u{F0DC}/g, '[')    //  → [
    .replace(/\u{F0B7}/g, '\\cdot ') //  → \cdot
    .replace(/\u{F092}/g, '\\to ')   //  → \to
    .replace(/[\u{F00A}\u{F00B}\u{F00C}\u{F026}\u{F0B8}\u{F0B9}\u{F0BA}\u{200B}]/g, '')
}

// ═══════════════════════════════════════════
//  LaTeX 转换
// ═══════════════════════════════════════════

function toLatex(s) {
  // 先做 PUA 映射
  s = puaPaired(s)
  s = puaSingles(s)

  // 拆分行列
  const rawLines = s.split('\n').map(l => l.trim()).filter(Boolean)
  const lines = []

  for (const line of rawLines) {
    // 跳过封面
    if (/精讲精练|做题本|数一.*篇|书籍作者|目\s*录/.test(line)) continue
    lines.push(line)
  }

  // 合并断裂行
  const merged = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const isOpt = /^[A-D]\s*[.、）)]/.test(line)

    if (merged.length === 0 || isOpt) {
      // 选项行
      if (isOpt) {
        const parts = line.split(/(?=[A-D]\s*[.、）)])/).filter(Boolean)
        for (const p of parts) if (p.trim()) merged.push(p.trim())
      } else { merged.push(line) }
      continue
    }

    const prev = merged[merged.length - 1]
    if (/^[A-D]\s*[.、）)]/.test(prev)) { merged.push(line); continue }

    // 短行合并条件
    const l2 = line.replace(/\s/g, '').length
    if (l2 <= 6 && /^[\d\-+·π∞e^{}]+$/.test(line.trim())) {
      merged[merged.length - 1] = prev + line
      continue
    }
    if (/^[)}\]]/.test(line.trim())) {
      merged[merged.length - 1] = prev + line
      continue
    }
    if (/^(x|n|k)\s*→/.test(line.trim())) {
      merged[merged.length - 1] = prev + ' ' + line
      continue
    }
    merged.push(line)
  }

  // 数学符号语言化
  let out = merged.join('\n')
    .replace(/\s{2,}/g, ' ')
    .replace(/\(\s+/g, '(').replace(/\s+\)/g, ')')
    // 上下标
    .replace(/\^(\d)/g, '^$1')
    .replace(/_(\d)/g, '_{$1}')
    // 分式检测 (数字/数字)
    .replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}')
    // 转义保留字符
    .replace(/~/g, '\\sim ')
    .replace(/∈/g, '\\in ')
    .replace(/∞/g, '\\infty ')
    .replace(/→/g, '\\to ')
    .replace(/∂/g, '\\partial ')
    .replace(/≠/g, '\\neq ')
    .replace(/≥/g, '\\geq ')
    .replace(/≤/g, '\\leq ')
    .replace(/≈/g, '\\approx ')

  // 清理
  out = out.split('\n').map(l => l.trim()).join('\n').trim()

  return out
}

// ═══════════════════════════════════════════
//  执行
// ═══════════════════════════════════════════

const files = fs.readdirSync(DIR).filter(f => f.startsWith('chapter') && f.endsWith('.json')).sort()
let total = 0, chg = 0

for (const file of files) {
  const fp = path.join(DIR, file)
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'))
  let fc = 0
  for (const q of data) {
    const o = q.content
    q.content = toLatex(q.content)
    if (q.answer) q.answer = toLatex(q.answer)
    if (q.analysis) q.analysis = toLatex(q.analysis)
    if (q.content !== o) fc++
  }
  fs.writeFileSync(fp, JSON.stringify(data, null, 2))
  total += data.length; chg += fc
  if (fc) console.log(`  ${file}: ${data.length} 题, ${fc} 修复`)
}
console.log(`\n总计: ${total} 题, ${chg} 题已修复`)
