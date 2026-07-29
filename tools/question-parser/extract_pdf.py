"""
PDF 题库解析器 v3
基于页区间检测章节，上下文感知 PUA 映射

用法: python extract_pdf.py
"""

import pdfplumber, json, re, os
from collections import defaultdict

# ─── PUA 映射 ─────────────────────────────────────────

PAIR_MAP = {0xF0EE: ('(', ')'), 0xF0CB: ('[', ']'), 0xF0ED: ('[', ']'), 0xF0EA: (']', '[')}
CHAR_MAP = {
    0xF0EC: '(', 0xF0EB: ')', 0xF0F4: '|', 0xF0F6: '|', 0xF0E2: '|',
    0xF0B6: '∫', 0xF0B1: '∑', 0xF0E8: '{', 0xF0E9: '}', 0xF0E0: '{', 0xF0E1: '}',
    0xF0E3: '{', 0xF0E4: '}', 0xF0DC: '[', 0xF0B7: '·', 0xF092: '→',
    0xF001: '·', 0xF00A: '', 0xF00B: '', 0xF00C: '', 0xF026: '',
}

def map_pua(line):
    cnt = {0xF0EE: 0, 0xF0CB: 0, 0xF0ED: 0, 0xF0EA: 0}
    out = []
    for ch in line:
        cp = ord(ch)
        if cp in PAIR_MAP:
            p = PAIR_MAP[cp]; idx = cnt[cp] % 2; cnt[cp] += 1; out.append(p[idx])
        elif cp in CHAR_MAP:
            m = CHAR_MAP[cp]; out.append(m) if m else None
        else:
            out.append(ch)
    return ''.join(out)

def is_noise(text):
    if not text.strip(): return True
    if re.search(r'^[·\s]*第\s*\d+\s*页', text.strip()): return True
    if '公众号' in text or '做题本集结地' in text or 'nocode' in text: return True
    if '小坏蛋' in text or '转卖' in text: return True
    if text.strip().startswith('https://') or text.strip() == '👆所有题本': return True
    return False

def page_text(page):
    rows = defaultdict(list)
    for c in page.chars:
        rows[round(c['top'] / 5) * 5].append(c)
    out = []
    for k in sorted(rows):
        row = sorted(rows[k], key=lambda c: c['x0'])
        t = ''.join(c['text'] for c in row).strip()
        if t and not is_noise(t):
            out.append(map_pua(t))
    return '\n'.join(out)

# ─── 章节页范围（从目录页读取） ─────────────────────────

GAOSHU_CHAPTERS = [
    (1, '函数、极限、连续', 3, 24),
    (2, '一元函数微分学及其应用', 25, 65),
    (3, '一元函数积分学及其应用', 66, 116),
    (4, '空间解析几何', 117, 125),
    (5, '多元函数微分学及其应用', 126, 151),
    (6, '重积分及其应用', 152, 185),
    (7, '微分方程及其应用', 186, 211),
    (8, '无穷级数', 212, 238),
    (9, '曲线积分与曲面积分', 239, 267),
]

# 线概篇章节（通过扫描确定页范围）
GAXIAN_CHAPTERS = [
    (10, '行列式', 3, 14),
    (11, '矩阵', 15, 30),
    (12, '向量', 31, 45),
    (13, '线性方程组', 46, 63),
    (14, '相似矩阵', 64, 89),
    (15, '二次型', 90, 130),
    (16, '随机事件与概率', 131, 131),
    (17, '一维随机变量及其分布', 132, 142),
    (18, '多维随机变量及其分布', 143, 158),
    (19, '随机变量的数字特征', 159, 177),
    (20, '大数定律与中心极限定理', 178, 181),
    (21, '数理统计', 182, 190),
    (22, '假设检验', 191, 206),
]

def get_chapter(pg_num, chapters):
    for ch_id, ch_name, start, end in chapters:
        if start <= pg_num <= end:
            return ch_id, ch_name
    return 0, ''

# ─── 行合并 ─────────────────────────────────────────

def merge_lines(lines):
    if not lines: return []
    out = []
    for line in lines:
        if not line.strip(): continue
        is_opt = re.match(r'^[A-D]\s*[.、）)]', line)
        if not out:
            if is_opt:
                for p in re.split(r'(?=[A-D]\s*[.、）)])', line):
                    if p.strip(): out.append(p.strip())
            else: out.append(line)
            continue
        prev = out[-1]
        if is_opt:
            for p in re.split(r'(?=[A-D]\s*[.、）)])', line):
                if p.strip(): out.append(p.strip())
            continue
        if re.match(r'^[A-D]\s*[.、）)]', prev):
            out.append(line); continue
        plain = line.replace(' ', '')
        if len(plain) <= 6:
            if re.match(r'^[\d\-+·π∞e^{}/|，、]+$', plain):
                out[-1] = prev + line; continue
            if re.match(r'^[)}\]]', line):
                out[-1] = prev + line; continue
            if re.match(r'^(x|n|k)\s*→', line):
                out[-1] = prev + ' ' + line; continue
            if re.match(r'^[a-z×÷=+→，,]', line):
                out[-1] = prev + ' ' + line; continue
        out.append(line)
    return out

# ─── 主解析 ─────────────────────────────────────────

def extract(pdf_path, chapters, subject, book):
    qs = []
    qid = 0

    with pdfplumber.open(pdf_path) as pdf:
        cur_type = 'choice'
        cur_sec = '基础题'
        buf = []
        qnum = 0
        pg_start = 0

        for pg_i in range(len(pdf.pages)):
            pg_num = pg_i + 1
            ch_id, ch_name = get_chapter(pg_num, chapters)
            if ch_id == 0: continue  # 跳过封面/目录

            text = page_text(pdf.pages[pg_i])
            lines = [l for l in text.split('\n') if l.strip()]
            if not lines: continue

            merged = merge_lines(lines)

            for line in merged:
                # 跳过一切杂行：章节名、题型名、区域名
                if line in ['基础题', '综合题', '拓展题']:
                    cur_sec = line
                    continue
                if line.startswith('第') and '章' in line and len(line) < 30:
                    continue
                if line in ['线性代数篇', '高等数学篇', '概率论与数理统计篇']:
                    continue
                # 题型检测
                m = re.match(r'[一二三]、\s*(选择题|填空题|解答题)', line)
                if m:
                    t = m.group(1)
                    cur_type = {'选择题': 'choice', '填空题': 'blank', '解答题': 'answer'}[t]
                    continue

                # 题目编号
                qm = re.match(r'\((\d+)\)\s*(.*)', line)
                is_opt = re.match(r'^[A-D]\s*[.、）)]', line)

                if qm:
                    # 保存上题
                    if buf and cur_type:
                        qid += 1
                        qs.append({
                            'id': f'M1-L880-C{ch_id:02d}-{qid:04d}',
                            'subject': subject, 'book': book,
                            'sectionId': cur_sec.replace('题', ''),
                            'sectionName': cur_sec,
                            'chapter': ch_id, 'chapterName': ch_name,
                            'type': cur_type, 'questionNumber': qnum,
                            'page': pg_num,
                            'content': '\n'.join(buf).strip(),
                            'answer': '', 'analysis': '',
                            'images': [], 'tags': [],
                        })
                    qnum = int(qm.group(1))
                    buf = [qm.group(2).strip()] if qm.group(2).strip() else []
                elif is_opt and buf:
                    buf.append(line)
                elif buf and line.strip() and not re.match(r'[二三]、', line):
                    buf.append(line)

        # 最后一题
        if buf and cur_type and ch_id:
            qid += 1
            qs.append({
                'id': f'M1-L880-C{ch_id:02d}-{qid:04d}',
                'subject': subject, 'book': book,
                'sectionId': cur_sec.replace('题', ''),
                'sectionName': cur_sec,
                'chapter': ch_id, 'chapterName': ch_name,
                'type': cur_type, 'questionNumber': qnum,
                'page': pg_num,
                'content': '\n'.join(buf).strip(),
                'answer': '', 'analysis': '',
                'images': [], 'tags': [],
            })

    return qs

# ─── 执行 ─────────────────────────────────────────

if __name__ == '__main__':
    base = 'D:/Codex-Projects/Claude 1/题库/'
    out_dir = 'D:/Codex-Projects/Claude 1/智能组卷系统/exam-generator/public/question-bank/math1/lilin880/'
    os.makedirs(out_dir, exist_ok=True)

    all_qs = []

    gs = extract(base + '【A4留白版】880数一高数篇做题本.pdf', GAOSHU_CHAPTERS, 'math1', 'lilin880')
    print(f'高数篇: {len(gs)} 题')
    all_qs.extend(gs)

    gx = extract(base + '【A4留白版】880数一线概篇做题本.pdf', GAXIAN_CHAPTERS, 'math1', 'lilin880')
    print(f'线概篇: {len(gx)} 题')
    all_qs.extend(gx)

    # 按章节分组输出
    chapters = defaultdict(list)
    for q in all_qs:
        chapters[q['chapter']].append(q)

    for ch in sorted(chapters):
        qs = chapters[ch]
        # 重新编号
        for i, q in enumerate(qs):
            q['id'] = f'M1-L880-C{ch:02d}-{i+1:04d}'
        fn = os.path.join(out_dir, f'chapter{ch:02d}.json')
        with open(fn, 'w', encoding='utf8') as f:
            json.dump(qs, f, ensure_ascii=False, indent=2)
        types = defaultdict(int)
        for q in qs: types[q['type']] += 1
        print(f'  ch{ch:02d}: {qs[0]["chapterName"]} - {len(qs)} 题 ({dict(types)})')

    type_total = defaultdict(int)
    for q in all_qs: type_total[q['type']] += 1
    print(f'\n总计: {len(all_qs)} 题 ({dict(type_total)})')
