#!/usr/bin/env python3
"""
question-parser 测试脚本：在没有真实 PDF 的情况下，
模拟 pdfplumber 输出的文本，验证解析逻辑是否正确。
"""

import json
import os
import sys

# 模拟 PDF 提取的文本（模拟李林880第一章的部分内容）
MOCK_PAGES = [
    {
        "page": 1,
        "text": "第一章 函数、极限与连续",
    },
    {
        "page": 1,
        "text": "基础篇",
    },
    {
        "page": 1,
        "text": "1. 设函数 $f(x)=\\frac{1}{1+x}$，则 $f(f(x))$ 等于（）\n\nA. $\\frac{1+x}{2+x}$\nB. $\\frac{1+x}{1+2x}$\nC. $\\frac{x}{1+x}$\nD. $\\frac{1}{x}$",
    },
    {
        "page": 1,
        "text": "2. 极限 $\\lim_{x\\to 0}\\frac{\\sin 3x}{x}$ 等于（）\n\nA. 0\nB. 1\nC. 3\nD. 不存在",
    },
    {
        "page": 2,
        "text": "3. 设 $f(x)$ 在 $x=0$ 处连续，则 $a=$____。",
    },
    {
        "page": 2,
        "text": "4. 极限 $\\lim_{n\\to\\infty}\\left(1+\\frac{2}{n}\\right)^n=$____。",
    },
    {
        "page": 3,
        "text": "综合篇",
    },
    {
        "page": 3,
        "text": "5. 求极限 $\\lim_{x\\to 0}\\frac{e^x-1-x}{x^2}$。",
    },
    {
        "page": 5,
        "text": "6. 讨论函数 $f(x)=\\frac{x}{|x|}$ 在 $x=0$ 处的连续性。",
    },
    {
        "page": 10,
        "text": "拓展篇",
    },
    {
        "page": 10,
        "text": "7. 设 $f(x)$ 在 $\\mathbb{R}$ 上连续，且 $f(x+y)=f(x)+f(y)$，则 $f(x)$ 必为（）\n\nA. $f(x)=x$\nB. $f(x)=cx$\nC. $f(x)=x^2$\nD. 无法确定",
    },
    {
        "page": 10,
        "text": "第二章 导数与微分",
    },
    {
        "page": 10,
        "text": "基础篇",
    },
    {
        "page": 15,
        "text": "1. 设 $f(x)=\\ln(1+x)$，则 $f'(0)$ 等于（）\n\nA. 0\nB. 1\nC. -1\nD. 2",
    },
    {
        "page": 15,
        "text": "2. 设 $y=x^2\\sin x$，则 $y'=$____。",
    },
    {
        "page": 18,
        "text": "综合篇",
    },
    {
        "page": 18,
        "text": "3. 设函数 $y=f(x)$ 由方程 $e^y+xy=e$ 确定，则 $y'(0)$ 等于（）\n\nA. $-\\frac{1}{e}$\nB. $\\frac{1}{e}$\nC. $-e$\nD. $e$",
    },
    {
        "page": 18,
        "text": "4. 设 $y=\\ln(x+\\sqrt{1+x^2})$，则 $dy=$____。",
    },
    {
        "page": 22,
        "text": "拓展篇",
    },
    {
        "page": 22,
        "text": "5. 求函数 $f(x)=x^3-3x+2$ 在区间 $[-2,2]$ 上的最大值和最小值。",
    },
    {
        "page": 22,
        "text": "6. 证明：当 $x>0$ 时，$\\frac{x}{1+x}<\\ln(1+x)<x$。",
    },
]


def test_no_pdfplumber():
    """测试在没有 pdfplumber 的情况下 parser 的报错是否友好"""
    print("=" * 50)
    print("测试 1：直接运行 parser.py 需要 pdfplumber")
    print("=" * 50)
    print("  → pip install pdfplumber")
    print()

    # 模拟在没有 pdfplumber 时报错
    try:
        import pdfplumber  # noqa: F401
        print("  ✓ pdfplumber 已安装")
    except ImportError:
        print("  ✗ 需要安装: pip install pdfplumber")
        return False
    return True


def test_parse_questions():
    """测试解析逻辑"""
    print("=" * 50)
    print("测试 2：解析模拟 PDF 文本")
    print("=" * 50)

    # 把 parser.py 的解析函数 import 进来
    sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

    # 直接复制核心函数来测试（避免 import 问题）
    from parser import (
        classify_type,
        parse_questions,
        write_output,
    )

    class MockArgs:
        subject = "math1"
        book = "lilin880"
        output = os.path.join(os.path.dirname(__file__), "test_output")
        start_chapter = 1

    args = MockArgs()
    questions = parse_questions(MOCK_PAGES, args)

    print(f"  解析出 {len(questions)} 道题\n")

    # 验证
    assert len(questions) == 13, f"期望 13 题，实际 {len(questions)}"

    # 检查章节分组
    chapters = set(q["chapter"] for q in questions)
    assert 1 in chapters, "缺失第一章"
    assert 2 in chapters, "缺失第二章"
    print(f"  ✓ 章节正确: {sorted(chapters)}")

    # 检查题型分类
    types = set(q["type"] for q in questions)
    assert "choice" in types, "缺少选择题"
    assert "blank" in types, "缺少填空题"
    assert "answer" in types, "缺少解答题"
    print(f"  ✓ 题型正确: {types}")

    # 检查分类归属
    sections = set(q["sectionId"] for q in questions)
    assert "basic" in sections, "缺少基础篇"
    assert "comprehensive" in sections, "缺少综合篇"
    assert "advanced" in sections, "缺少拓展篇"
    print(f"  ✓ 分类正确: {sections}")

    # 检查 ID 生成
    for q in questions:
        assert q["id"].startswith("M1-L880-"), f"ID 格式错误: {q['id']}"
        assert len(q["id"].split("-")[-1]) == 4, f"题号格式错误: {q['id']}"
    print(f"  ✓ ID 格式正确（示例: {questions[0]['id']}）")

    # 输出到测试目录
    write_output(questions, args, {})
    output_dir = args.output
    files = os.listdir(output_dir)
    print(f"\n  ✓ 输出文件: {files}")

    # 验证 chapter01.json
    ch1_path = os.path.join(output_dir, "chapter01.json")
    with open(ch1_path, "r", encoding="utf-8") as f:
        ch1 = json.load(f)
    assert len(ch1) == 7, f"第一章期望 7 题，实际 {len(ch1)}"

    # 验证 chapter02.json
    ch2_path = os.path.join(output_dir, "chapter02.json")
    with open(ch2_path, "r", encoding="utf-8") as f:
        ch2 = json.load(f)
    assert len(ch2) == 6, f"第二章期望 6 题，实际 {len(ch2)}"

    print("\n  输出 JSON 头部预览:")
    with open(ch1_path, "r", encoding="utf-8") as f:
        content = f.read()
    print(f"  {content[:300]}...")

    print(f"\n  {'='*20} 全部测试通过！{'='*20}")

    # 清理测试输出
    import shutil
    shutil.rmtree(output_dir, ignore_errors=True)

    return True


if __name__ == "__main__":
    test_no_pdfplumber()
    try:
        test_parse_questions()
    except AssertionError as e:
        print(f"\n  ✗ 测试失败: {e}")
        sys.exit(1)
    except ImportError as e:
        print(f"\n  ✗ 导入失败: {e}")
        print("  请确保 test_parser.py 和 parser.py 在同一个目录")
        sys.exit(1)
