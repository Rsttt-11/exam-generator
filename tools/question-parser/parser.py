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
    print("错误：请先安装 pdfplumber: pip install pdfplumber")
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
    mapping = {
        "lilin880": "L880",
        "zhangyu1000": "ZY1000",
    }
    return mapping.get(book, book.upper())


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
    # 优先检查选择题选项模式
    if re.search(r'\n[ABCDEF]\s*[.．、]', text):
        return "choice"
    # 填空题：有下划线或空格
    if re.search(r'_{2,}|____|　　', text):
        return "blank"
    # 解答题：无选项，较长
    return "answer"


def parse_questions(pages: list[dict], args) -> list[dict]:
    """解析 PDF 文本为题目列表"""
    questions = []
    chapter_num = args.start_chapter
    chapter_name = ""
    section_id = ""
    section_name = ""
    q_number = 0
    prefix = book_id_to_subject(args.subject) + "-" + book_id_to_prefix(args.book)

    # 尝试识别章节标题和分类
    chapter_pattern = re.compile(r'(?:第?\s*(\d+)\s*章|Chapter\s*(\d+))\s*[：:]\s*(.+)')
    section_pattern = re.compile(r'(基础篇|综合篇|拓展篇|A篇|B篇|C篇|提高篇|巩固篇)')

    current_buffer = ""
    current_type = None
    page_num = 0

    for pg in pages:
        text = pg["text"]
        page_num = pg["page"]

        # 检测章节标题
        ch_match = chapter_pattern.search(text)
        if ch_match:
            # 保存上一章
            if current_buffer.strip():
                q_number += 1
                q_type = current_type or classify_type(current_buffer)
                questions.append(build_question(current_buffer, q_type, q_number, page_num, chapter_num, chapter_name, section_id, section_name, args, prefix))
                current_buffer = ""

            ch_num = ch_match.group(1) or ch_match.group(2)
            chapter_num = int(ch_num)
            chapter_name = ch_match.group(3).strip()
            q_number = 0
            continue

        # 检测分类
        sec_match = section_pattern.search(text)
        if sec_match:
            if current_buffer.strip():
                q_number += 1
                q_type = current_type or classify_type(current_buffer)
                questions.append(build_question(current_buffer, q_type, q_number, page_num, chapter_num, chapter_name, section_id, section_name, args, prefix))
                current_buffer = ""

            section_name = sec_match.group(1)
            # section_id 映射
            sec_id_map = {
                "基础篇": "basic", "综合篇": "comprehensive", "拓展篇": "advanced",
                "A篇": "a", "B篇": "b", "C篇": "c",
                "提高篇": "advanced", "巩固篇": "basic",
            }
            section_id = sec_id_map.get(section_name, section_name)
            q_number = 0
            continue

        # 检测新题目（以数字+题号开头）
        q_start = re.match(r'^\s*(\d+)\s*[.．、]', text)
        if q_start:
            if current_buffer.strip():
                q_number += 1
                q_type = current_type or classify_type(current_buffer)
                questions.append(build_question(current_buffer, q_type, q_number, page_num - 1 if len(questions) % 2 == 0 else page_num, chapter_num, chapter_name, section_id, section_name, args, prefix))
                current_buffer = ""

            current_type = classify_type(text)
            current_buffer = text
        else:
            # 续接上一题
            if current_buffer:
                current_buffer += "\n" + text
            else:
                current_buffer = text

    # 最后一题
    if current_buffer.strip():
        q_number += 1
        q_type = current_type or classify_type(current_buffer)
        questions.append(build_question(current_buffer, q_type, q_number, page_num, chapter_num, chapter_name, section_id, section_name, args, prefix))

    return questions


def book_id_to_subject(subject: str) -> str:
    mapping = {
        "math1": "M1",
        "math2": "M2",
        "math3": "M3",
    }
    return mapping.get(subject, subject.upper())


def build_question(text: str, q_type: str, q_number: int, page: int,
                    chapter: int, chapter_name: str,
                    section_id: str, section_name: str,
                    args, prefix: str) -> dict:
    """构建标准题目 JSON"""
    # 生成唯一 ID
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

    # 按章节分组输出
    chapters = group_by_chapter(questions)
    for ch_num, ch_questions in chapters.items():
        filename = f"chapter{ch_num:02d}.json"
        filepath = os.path.join(args.output, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(ch_questions, f, ensure_ascii=False, indent=2)
        print(f"  ✓ 第{ch_num}章: {len(ch_questions)} 题 → {filename}")

    # 统计各种题型
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

    # 输出报告
    report_path = os.path.join(args.output, "report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)
    print(f"  ✓ 转换报告 → report.json")

    print(f"\n总题数: {stats['total']}")
    print(f"选择题: {type_count['choice']}")
    print(f"填空题: {type_count['blank']}")
    print(f"解答题: {type_count['answer']}")
    print(f"章节数: {len(chapters)}")


def main():
    args = parse_args()

    if not os.path.isfile(args.input):
        print(f"错误：文件不存在: {args.input}")
        sys.exit(1)

    print(f"正在读取: {args.input}")
    pages = extract_text(args.input)
    print(f"  共 {len(pages)} 页（含文本）")

    print("正在解析题目...")
    questions = parse_questions(pages, args)

    if not questions:
        print("警告：未解析到任何题目，请检查 PDF 格式")
        sys.exit(1)

    print(f"\n解析完成: {len(questions)} 题")
    print(f"输出目录: {os.path.abspath(args.output)}")
    write_output(questions, args, {})

    print("\n提示: 转换后请检查并补充:")
    print("  1. book.json 的 sections 和 chapters 字段")
    print("  2. 题目的 sectionId/sectionName 归属是否正确")


if __name__ == "__main__":
    main()
