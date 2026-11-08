#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""全ページのグローバルナビに「🎯 合否シミュレーター」リンクを注入する（冪等）.

新規ページを追加したときにも実行すればナビが揃う。
  python3 scripts/insert_simulator_nav.py
"""
import glob
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LINK = '<a href="simulator.html">🎯 内申×当日 合否シミュレーター</a>'
ANCHOR_RE = re.compile(r'(<a href="index\.html"[^>]*>📊 内申点ランキングTOP</a>)')


def process(path: str) -> str:
    html = open(path, encoding="utf-8").read()
    if 'href="simulator.html"' in html or "📊 内申点ランキングTOP" not in html:
        return "skip"
    new, n = ANCHOR_RE.subn(lambda m: m.group(1) + "\n      " + LINK, html, count=1)
    if n == 0:
        return "no-anchor"
    open(path, "w", encoding="utf-8").write(new)
    return "updated"


def main() -> int:
    updated = skipped = missing = 0
    for path in sorted(glob.glob(os.path.join(BASE, "*.html"))):
        if os.path.basename(path) == "simulator.html":
            continue
        r = process(path)
        if r == "updated":
            updated += 1
        elif r == "no-anchor":
            missing += 1
            print(f"[?] ナビ位置が見つからない: {os.path.basename(path)}")
        else:
            skipped += 1
    print(f"[✓] 更新 {updated} / 既存 {skipped} / 未検出 {missing}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
