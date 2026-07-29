/**
 * 题库数据修复 v7 — 精确模式匹配
 *
 * 基于对原始断裂模式的精确观察。
 * 在 PUA 已映射的数据上操作。
 * 运行: node tools/question-parser/fixData.cjs
 */

const fs = require('fs')
const path = require('path')
const DIR = path.join(__dirname, '..', '..', 'public', 'question-bank', 'math1', 'lilin880')

function fix(s) {
  if (!s) return s

  // 1) 数字/π 孤岛作为分母 — 但排除 n=1, k=0 等式子
  //    纯数字孤岛合并到上行，前面加 /
  //    "π" "2" "0" "3" 等
  s = s.replace(/^(π|[\d]+)\n/gm, (m, d) => {
    // 如果数字长于 4 不是孤岛
    if (d.length > 4) return m
    // 如果内容是 "1. " 样式不是孤岛
    if (/^\d+[.、]/.test(d)) return m
    return '/' + d
  })

  // 2) 极限下标孤岛
  s = s.replace(/\n(x\s*→\s*[\d∞\-+]+)\n/g, m => m.replace(/\n/g, ''))
  s = s.replace(/\n(n\s*→\s*[\d∞\-+]+)\n/g, m => m.replace(/\n/g, ''))
  s = s.replace(/\n(k\s*→\s*[\d∞\-+]+)\n/g, m => m.replace(/\n/g, ''))

  // 3) "n=1" / "n=0" 等短行 → 合并到上行
  s = s.replace(/\n([a-z]\s*=\s*\d+(?:\s+[a-z]\s*=\s*\d+)?)\n/g, ' $1\n')

  // 4) 单独的 ∞ → 合并
  s = s.replace(/^∞\n/gm, '∞\n')

  // 4) 选项拆分: "A. xxx B. xxx C. xxx D. xxx" → 每行一个
  //    但先处理选项行内部的换行断裂
  //    匹配非行首的 A. B. C. D.
  s = s.replace(/([^A])(A\s*[.、）)])/g, '$1\n$2')
  s = s.replace(/([^\n])(B\s*[.、）)])/g, '$1\n$2')
  s = s.replace(/([^\n])(C\s*[.、）)])/g, '$1\n$2')
  s = s.replace(/([^\n])(D\s*[.、）)])/g, '$1\n$2')

  // 5) 分段函数括号修复: "}{\n" → "}{" 内联
  s = s.replace(/}\n{/g, '}{')

  // 6) 短的续行合并 (< 6 字符, 非选项)
  //    如 dx 一行、n=1 一行
  const lines = s.split('\n')
  const result = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const isOpt = /^[A-D]\s*[.、）)]/.test(line)

    if (result.length > 0 && !isOpt && line.length <= 6) {
      // 合并到上一行
      const prev = result[result.length - 1]
      if (!/^[A-D]\s*[.、）)]/.test(prev)) {
        result[result.length - 1] = prev + ' ' + line
        continue
      }
    }

    if (!isOpt && line.length <= 8 && i > 0 && result.length > 0) {
      const prev = result[result.length - 1]
      if (!/^[A-D]\s*[.、）)]/.test(prev) && prev.length > 10) {
        result[result.length - 1] = prev + ' ' + line
        continue
      }
    }

    result.push(line)
  }

  // 7) 清理
  s = result.join('\n')
  s = s.replace(/\s{2,}/g, ' ')
  s = s.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')')
  s = s.replace(/\[\s+/g, '[').replace(/\s+\]/g, ']')
  s = s.split('\n').map(l => l.trim()).join('\n').trim()

  return s
}

// 执行
const files = fs.readdirSync(DIR).filter(f => f.startsWith('chapter') && f.endsWith('.json')).sort()
let total = 0, chg = 0
for (const file of files) {
  const fp = path.join(DIR, file)
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'))
  let fc = 0
  for (const q of data) {
    const o = q.content
    q.content = fix(q.content)
    if (q.answer) q.answer = fix(q.answer)
    if (q.analysis) q.analysis = fix(q.analysis)
    if (q.content !== o) fc++
  }
  fs.writeFileSync(fp, JSON.stringify(data, null, 2))
  total += data.length; chg += fc
  if (fc) console.log(`  ${file}: ${data.length} 题, ${fc} 修复`)
}
console.log(`\n总计: ${total} 题, ${chg} 题已修复`)
