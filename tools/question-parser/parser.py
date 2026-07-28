#!/usr/bin/env python3
"""
question-parser: 题库转换工具

将文字版 PDF 题库（如李林880）解析为标准 JSON 格式。
输出按章节拆分，每章一个 JSON 文件，符合 DATA_SPEC.md 规范。

依赖: pip install pdfplumber

用法:
  python parser.py --input 李林880.pdf --output ./output
  python parser.py --input 李林880.pdf --subject math1 --book lilin880 --start-chapter 1
"""

import argparse
import json
import os
import re
import sys

try:
    import pdfplumber
except ImportError:
    print("[FAIL] 请先安装 pdfplumber: pip install pdfplumber")
    sys.exit(1)


def parse_args():
    parser = argparse.ArgumentParser(description="题库转换工具：PDF -> JSON")
    parser.add_argument("--input", required=True, help="输入 PDF 文件路径")
    parser.add_argument("--subject", default="math1", help="学科标识 (math1/math2/math3)")
    parser.add_argument("--book", default="lilin880", help="题库标识")
    parser.add_argument("--output", default="./output", help="输出目录")
    parser.add_argument("--start-chapter", type=int, default=1, help="起始章节编号")
    return parser.parse_args()


def book_id_to_prefix(book: str) -> str:
    mapping = {"lilin880": "L880", "zhangyu1000": "ZY1000"}
    return mapping.get(book, book.upper())


def book_id_to_subject(subject: str) -> str:
    mapping = {"math1": "M1", "math2": "M2", "math3": "M3"}
    return mapping.get(subject, subject.upper())


def extract_text(pdf_path: str) -> list[dict]:
    """提取 PDF 每页文本和页号"""
    pages = []
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            if text and text.strip():
                pages.append({"page": i + 1, "text": text.strip()})
    return pages


def classify_type(text: str) -> str:
    """根据题目文本判断题型"""
    if re.search(r'(?:^|\n)[ABCDEF]\s*[.．、]', text):
        return "choice"
    if re.search(r'_{2,}|____|　　', text):
        return "blank"
    return "answer"


def cn_to_int(s: str) -> int:
    """中文数字转阿拉伯数字"""
    cn_map = dict(zip('一二三四五六七八九十', range(1, 11)))
    total = 0
    for ch in s:
        total = total * 10 + cn_map.get(ch, 0)
    return total


def is_line_watermark_or_page_num(line: str) -> bool:
    """判断是否为水印、页码、公众号等干扰行"""
    line = line.strip()
    if not line:
        return True
    # 页码
    if re.match(r'^·?\s*第\s*\d+\s*页[，,]\s*共\s*\d+\s*页\s*·?$', line):
        return True
    # 公众号水印
    if '公众号' in line or '做题本集结地' in line or 'nocode.host' in line or '本本' in line:
        return True
    # 防转卖水印
    if '小坏蛋' in line or '转卖' in line or '抹掉' in line or '免费获取' in line:
        return True
    # 封面/广告性文字
    if line.startswith('https://') or line.startswith('👆'):
        return True
    return False


def parse_questions(pages: list[dict], args) -> list[dict]:
    """解析 PDF 文本为题目列表"""
    questions = []
    chapter_num = args.start_chapter
    chapter_name = ""
    section_id = ""
    section_name = ""
    q_number = 0
    prefix = book_id_to_subject(args.subject) + "-" + book_id_to_prefix(args.book)

    # 正则
    cn_nums = '一二三四五六七八九十'
    chapter_pattern = re.compile(
        r'(?:第\s*(\d+|[' + cn_nums + r']+)\s*章|Chapter\s*(\d+))\s*(?::|：|[ ])?\s*(.+)'
    )
    # 也匹配纯数字开头的章节: "1. 函数、极限、连续"
    chapter_num_pattern = re.compile(r'^(\d+)\s*[.．、]\s*(.+)$')
    section_pattern = re.compile(r'(基础[篇题]|综合[篇题]|拓展[篇题]|A篇|B篇|C篇|提高篇|巩固篇)')
    type_header_pattern = re.compile(r'^[一二三]\s*[、．.．]\s*(选择题|填空题|解答题)')
    # 匹配 (1)、(2) 或 1. 2. 格式的题号
    qnum_pattern = re.compile(r'^\((\d+)\)\s*')
    qnum_dot_pattern = re.compile(r'^(\d+)\s*[.．、]\s*')

    current_buffer = ""
    current_type = None
    page_num = 0

    # 状态：检测到 type_header 后，后续的 (1) (2) 才被认为是题目
    expect_questions = False

    for pg_idx, pg in enumerate(pages):
        text = pg["text"]
        page_num = pg["page"]

        # 按行处理
        lines = text.split('\n')
        for line in lines:
            if is_line_watermark_or_page_num(line):
                continue

            # --- 章节标题 ---
            ch_match = chapter_pattern.search(line)
            if ch_match:
                ch_num_str = ch_match.group(1) or ch_match.group(2)
                ch_name_str = ch_match.group(3) or ""
                if ch_num_str and ch_name_str:
                    # flush 上一题
                    if current_buffer.strip():
                        q_number += 1
                        q_type = classify_type(current_buffer)
                        questions.append(build_question(
                            current_buffer, q_type, q_number, page_num,
                            chapter_num, chapter_name, section_id, section_name, args, prefix
                        ))
                        current_buffer = ""
                    try:
                        chapter_num = int(ch_num_str)
                    except ValueError:
                        chapter_num = cn_to_int(ch_num_str)
                    chapter_name = ch_name_str.strip()
                    q_number = 0
                    expect_questions = False
                    continue

            # --- 数字章节标题: "1. 函数、极限、连续" ---
            ch_num_match = chapter_num_pattern.match(line)
            if ch_num_match and not qnum_dot_pattern.match(line):
                if current_buffer.strip():
                    q_number += 1
                    q_type = classify_type(current_buffer)
                    questions.append(build_question(
                        current_buffer, q_type, q_number, page_num,
                        chapter_num, chapter_name, section_id, section_name, args, prefix
                    ))
                    current_buffer = ""
                chapter_num = int(ch_num_match.group(1))
                chapter_name = ch_num_match.group(2).strip()
                q_number = 0
                expect_questions = False
                continue

            # --- 分类（基础篇/综合篇/拓展篇） ---
            sec_match = section_pattern.search(line)
            if sec_match:
                if current_buffer.strip():
                    q_number += 1
                    q_type = classify_type(current_buffer)
                    questions.append(build_question(
                        current_buffer, q_type, q_number, page_num,
                        chapter_num, chapter_name, section_id, section_name, args, prefix
                    ))
                    current_buffer = ""
                section_name = sec_match.group(1)
                sec_id_map = {
                    "基础篇": "basic", "基础题": "basic",
                    "综合篇": "comprehensive", "综合题": "comprehensive",
                    "拓展篇": "advanced", "拓展题": "advanced",
                    "A篇": "a", "B篇": "b", "C篇": "c",
                    "提高篇": "advanced", "巩固篇": "basic",
                }
                section_id = sec_id_map.get(section_name, section_name)
                q_number = 0
                expect_questions = False
                continue

            # --- 题型标题（一、选择题 二、填空题 三、解答题） ---
            type_match = type_header_pattern.search(line)
            if type_match:
                expect_questions = True
                continue

            # --- 题目行 ---
            qnum_match = qnum_pattern.match(line)
            qnum_dot_match = qnum_dot_pattern.match(line)

            if qnum_match and expect_questions:
                # 新题目开始 (1)、(2) ...
                if current_buffer.strip():
                    q_number += 1
                    q_type = classify_type(current_buffer)
                    questions.append(build_question(
                        current_buffer, q_type, q_number, page_num,
                        chapter_num, chapter_name, section_id, section_name, args, prefix
                    ))
                    current_buffer = ""
                current_type = classify_type(line)
                current_buffer = line
            elif qnum_dot_match and expect_questions:
                # 新题目开始 1. 2. ...
                if current_buffer.strip():
                    q_number += 1
                    q_type = classify_type(current_buffer)
                    questions.append(build_question(
                        current_buffer, q_type, q_number, page_num,
                        chapter_num, chapter_name, section_id, section_name, args, prefix
                    ))
                    current_buffer = ""
                current_type = classify_type(line)
                current_buffer = line
            else:
                # 续接当前题目
                if current_buffer:
                    current_buffer += "\n" + line
                else:
                    current_buffer = line

    # 最后一题
    if current_buffer.strip():
        q_number += 1
        q_type = classify_type(current_buffer)
        questions.append(build_question(
            current_buffer, q_type, q_number, page_num,
            chapter_num, chapter_name, section_id, section_name, args, prefix
        ))

    return questions


def build_question(text: str, q_type: str, q_number: int, page: int,
                   chapter: int, chapter_name: str,
                   section_id: str, section_name: str,
                   args, prefix: str) -> dict:
    """构建标准题目 JSON"""
    qid = f"{prefix}-C{chapter:02d}-{q_number:04d}"
    return {
        "id": qid,
        "subject": args.subject,
        "book": args.book,
        "sectionId": section_id or "basic",
        "sectionName": section_name or "基础篇",
        "chapter": chapter,
        "chapterName": chapter_name or f"第{chapter}章",
        "type": q_type,
        "questionNumber": q_number,
        "page": page,
        "content": text.strip(),
        "answer": "",
        "analysis": "",
        "images": [],
        "tags": [],
    }


def group_by_chapter(questions: list[dict]) -> dict[int, list[dict]]:
    chapters = {}
    for q in questions:
        ch = q["chapter"]
        if ch not in chapters:
            chapters[ch] = []
        chapters[ch].append(q)
    return dict(sorted(chapters.items()))


def write_output(questions: list[dict], args, stats: dict):
    os.makedirs(args.output, exist_ok=True)

    chapters = group_by_chapter(questions)
    for ch_num, ch_questions in chapters.items():
        filename = f"chapter{ch_num:02d}.json"
        filepath = os.path.join(args.output, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(ch_questions, f, ensure_ascii=False, indent=2)
        print(f"  [OK] 第{ch_num}章: {len(ch_questions)} 题 -> {filename}")

    type_count = {"choice": 0, "blank": 0, "answer": 0}
    for q in questions:
        t = q["type"]
        if t in type_count:
            type_count[t] += 1

    stats.update({
        "total": len(questions),
        "by_type": type_count,
        "by_chapter": {str(ch): len(qs) for ch, qs in chapters.items()},
    })

    report_path = os.path.join(args.output, "report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)
    print(f"  [OK] 转换报告 -> report.json")

    print(f"\n总题数: {stats['total']}")
    print(f"选择题: {type_count['choice']}")
    print(f"填空题: {type_count['blank']}")
    print(f"解答题: {type_count['answer']}")
    print(f"章节数: {len(chapters)}")


def main():
    args = parse_args()

    if not os.path.isfile(args.input):
        print(f"[FAIL] 文件不存在: {args.input}")
        sys.exit(1)

    print(f"正在读取: {args.input}")
    pages = extract_text(args.input)
    print(f"  共 {len(pages)} 页（含文本）")

    print("正在解析题目...")
    questions = parse_questions(pages, args)

    if not questions:
        print("[WARN] 未解析到任何题目，请检查 PDF 格式")
        sys.exit(1)

    print(f"\n解析完成: {len(questions)} 题")
    print(f"输出目录: {os.path.abspath(args.output)}")
    write_output(questions, args, {})

    print("\n提示: 转换后请检查并补充:")
    print("  1. book.json 的 sections 和 chapters 字段")
    print("  2. 题目的 sectionId/sectionName 归属是否正确")


if __name__ == "__main__":
    main()
