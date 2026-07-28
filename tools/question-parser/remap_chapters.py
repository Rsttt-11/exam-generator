"""Remap chapter numbers and add categories"""
import json, os, re

bank_dir = r'D:\Codex-Projects\Claude 1\智能组卷系统\exam-generator\public\question-bank\math1\lilin880'

# (old_file_prefix, new_chapter, new_file_prefix, new_name, category)
chapter_map = [
    ('01', 1,  '01', '函数、极限、连续', '高数'),
    ('02', 2,  '02', '一元函数微分学及其应用', '高数'),
    ('03', 3,  '03', '一元函数积分学及其应用', '高数'),
    ('04', 4,  '04', '空间解析几何', '高数'),
    ('05', 5,  '05', '多元函数微分学及其应用', '高数'),
    ('06', 6,  '06', '重积分及其应用', '高数'),
    ('07', 7,  '07', '微分方程及其应用', '高数'),
    ('08', 8,  '08', '无穷级数', '高数'),
    ('09', 9,  '09', '曲线积分与曲面积分', '高数'),
    ('10', 10, '10', '行列式', '线代'),
    ('101',11, '11', '矩阵', '线代'),
    ('102',12, '12', '向量', '线代'),
    ('103',13, '13', '线性方程组', '线代'),
    ('104',14, '14', '相似矩阵', '线代'),
    ('105',15, '15', '二次型', '线代'),
    ('106',16, '16', '随机事件及其概率、大数定律', '概率'),
    ('107',17, '17', '随机变量及其分布', '概率'),
    ('108',18, '18', '多维随机变量及其分布', '概率'),
    ('109',19, '19', '随机变量的数字特征', '概率'),
    ('301',20, '20', '数理统计的基本概念', '概率'),
    ('302',21, '21', '参数估计', '概率'),
    ('303',22, '22', '假设检验', '概率'),
]

all_data = []
garbage_chars = re.compile(r'[\uf0ee\uf0e3\u2591\u25a0\uf03d\u2581\uffe5]+')

for old_ch, new_ch, new_file, new_name, category in chapter_map:
    old_path = os.path.join(bank_dir, f'chapter{old_ch}.json')
    if not os.path.exists(old_path):
        print(f'  [SKIP] chapter{old_ch}.json not found')
        continue
    with open(old_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Clean garbage chars
    for q in data:
        q['chapterName'] = garbage_chars.sub('', q.get('chapterName', '')).strip()
        q['sectionName'] = q['sectionName'].replace('基础题', '基础篇').replace('综合题', '综合篇').replace('拓展题', '拓展篇')

    # Remove false entries
    if old_ch == '01':
        data = [q for q in data if q['sectionName'] != '基础篇' or '目录' not in q['content'][:50]]
    if old_ch == '10':
        data = [q for q in data if '精讲精练' not in q['content'][:20] and '目录' not in q['content'][:20]]
    if old_ch == '105':
        data = [q for q in data if '概率篇' not in q['content'][:20]]
    if old_ch == '303':
        data = [q for q in data if '线性代数' not in q['content'][:20]]

    # Renumber
    for i, q in enumerate(data, 1):
        q['chapter'] = new_ch
        q['chapterName'] = new_name
        q['id'] = f'M1-L880-C{new_file}-{i:04d}'
        q['questionNumber'] = i
        q['category'] = category

    line = f'  chapter{old_ch}.json -> chapter{new_file}.json  第{new_ch:2d}章 {new_name:20s}  {len(data):3d}题  [{category}]'
    print(line)
    all_data.append((new_file, data))

    # Delete old file
    os.remove(old_path)

# Write new files
for new_file, data in all_data:
    new_path = os.path.join(bank_dir, f'chapter{new_file}.json')
    with open(new_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# Stats
total = sum(len(v) for _, v in all_data)
total_types = {'choice': 0, 'blank': 0, 'answer': 0}
by_cat = {}
for _, data in all_data:
    for q in data:
        total_types[q['type']] = total_types.get(q['type'], 0) + 1
        by_cat[q['category']] = by_cat.get(q['category'], 0) + 1

print(f'\n总计: {total} 题')
for cat, count in sorted(by_cat.items()):
    print(f'  {cat}: {count} 题')
print(f'  选择题: {total_types["choice"]}  填空题: {total_types["blank"]}  解答题: {total_types["answer"]}')

# book.json
categories = [
    {'id': 'gaoshu', 'name': '高数', 'chapters': [1, 2, 3, 4, 5, 6, 7, 8, 9]},
    {'id': 'xianshu', 'name': '线代', 'chapters': [10, 11, 12, 13, 14, 15]},
    {'id': 'gailv', 'name': '概率', 'chapters': [16, 17, 18, 19, 20, 21, 22]},
]
chapters = [{'id': ch, 'name': nm, 'category': cat}
            for _, ch, prefix, nm, cat in chapter_map]  # use sorted order

book = {
    'id': 'lilin880', 'name': '李林880题', 'year': 2027, 'subject': 'math1',
    'categories': categories,
    'sections': [
        {'id': 'basic', 'name': '基础篇'},
        {'id': 'comprehensive', 'name': '综合篇'},
        {'id': 'advanced', 'name': '拓展篇'},
    ],
    'chapters': chapters,
}
book_path = os.path.join(bank_dir, 'book.json')
with open(book_path, 'w', encoding='utf-8') as f:
    json.dump(book, f, ensure_ascii=False, indent=2)
print(f'\n[OK] book.json updated with {len(categories)} categories')

# report.json
report = {
    'total': total, 'by_type': total_types, 'by_category': by_cat,
    'by_chapter': {str(ch): len(d) for ch, d in all_data},
}
with open(os.path.join(bank_dir, 'report.json'), 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)
print('[OK] report.json updated')
