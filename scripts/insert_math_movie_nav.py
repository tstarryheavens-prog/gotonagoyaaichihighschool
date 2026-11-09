#!/usr/bin/env python3
"""全ページの top-nav に「🎬 動く図でわかる数学」へのリンクを挿入する（冪等）。

- トップ階層: href="math-movie-lab.html"
- schools/ 配下: href="../math-movie-lab.html"
- 挿入位置: コミュニティリンクの直前（無ければ </div> の直前）
- 既に含まれていれば何もしない
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LABEL = "🎬 動く図でわかる数学"
TARGET = "math-movie-lab.html"


def inject(html: str, prefix: str) -> tuple[str, bool]:
    m = re.search(r'<nav class="top-nav">.*?</nav>', html, re.S)
    if not m:
        return html, False
    nav = m.group(0)
    if f'href="{prefix}{TARGET}"' in nav:
        return html, False

    lines = nav.split("\n")
    idx = None
    for i, ln in enumerate(lines):
        if "community.html" in ln and "<a " in ln:
            idx = i
            break
    if idx is None:
        for i in range(len(lines) - 1, -1, -1):
            if "</div>" in lines[i]:
                idx = i
                break
    if idx is None:
        return html, False

    m2 = re.match(r"\s*", lines[idx])
    indent = m2.group(0) if m2 else ""
    lines.insert(idx, f'{indent}<a href="{prefix}{TARGET}">{LABEL}</a>')
    new_nav = "\n".join(lines)
    return html.replace(nav, new_nav, 1), True


def main() -> int:
    changed = 0
    files = sorted(ROOT.glob("*.html")) + sorted(ROOT.glob("schools/*.html"))
    for p in files:
        if p.name == TARGET:
            continue
        prefix = "../" if p.parent.name == "schools" else ""
        html = p.read_text(encoding="utf-8")
        new, ok = inject(html, prefix)
        if ok:
            p.write_text(new, encoding="utf-8")
            changed += 1
            print(f"NAV+ {p.relative_to(ROOT)}")
    print(f"done: {changed} files updated / {len(files)} scanned")
    return 0


if __name__ == "__main__":
    sys.exit(main())
