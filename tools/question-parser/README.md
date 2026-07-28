# question-parser

题库转换工具：将文字版 PDF 题库转换为标准 JSON 格式。

## 使用方法

```bash
cd tools/question-parser

# 基础用法
python parser.py --input 李林880.pdf --output ../../public/question-bank/math1/lilin880/

# 指定学科和题库
python parser.py --input 李林880.pdf --subject math2 --book lilin880 --output ../../public/question-bank/math2/lilin880/

# 更多选项
python parser.py --input 李林880.pdf --subject math1 --book lilin880 --output ./output --start-chapter 1
```

## 参数说明

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--input` | 输入 PDF 文件路径 | 必填 |
| `--subject` | 学科标识（math1/math2/math3） | `math1` |
| `--book` | 题库标识（lilin880/zhangyu1000 等） | `lilin880` |
| `--output` | 输出目录 | `./output` |
| `--start-chapter` | 起始章节编号 | `1` |
| `--help` | 显示帮助 | |

## 输出

每组输出一套 JSON 文件：

```
output/
  book.json            — 题库元数据（需手动填写 sections/chapters）
  chapter01.json       — 第 1 章题目
  chapter02.json       — 第 2 章题目
  ...
  report.json          — 转换报告
```

## book.json 格式

转换后需手动补充 sections 和 chapters 字段：

```json
{
  "id": "lilin880",
  "name": "李林880",
  "year": 2027,
  "subject": "math1",
  "sections": [
    { "id": "basic", "name": "基础篇" },
    { "id": "comprehensive", "name": "综合篇" },
    { "id": "advanced", "name": "拓展篇" }
  ],
  "chapters": [
    { "id": 1, "name": "函数、极限与连续" },
    { "id": 2, "name": "导数与微分" }
  ]
}
```

## 题目 JSON 格式

每道题按 DATA_SPEC.md 规范输出：

```json
{
  "id": "M1-L880-C01-0001",
  "subject": "math1",
  "book": "lilin880",
  "sectionId": "basic",
  "sectionName": "基础篇",
  "chapter": 1,
  "chapterName": "函数、极限与连续",
  "type": "choice",
  "questionNumber": 1,
  "page": 254,
  "content": "",
  "answer": "",
  "analysis": "",
  "images": [],
  "tags": []
}
```

## 依赖安装

```bash
pip install pdfplumber
```
