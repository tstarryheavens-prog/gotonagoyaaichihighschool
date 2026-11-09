#!/usr/bin/env python3
"""サイトの基準URL（ホスト）を一括で付け替える。

独自ドメインを取得/接続したとき、あるいは pages.dev へ戻すときに使う。
対象: robots.txt / llms.txt / sitemap.xml / *.html の canonical・og:url、scripts/build_sitemap.py

- .html 付きの公開URLは clean URL に正規化（/index.html → /、/simulator.html → /simulator）
- 何度実行しても同じ結果（冪等）
使い方: python3 scripts/set_base_url.py https://example.com [--check]
"""
from __future__ import annotations

import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# 既知のホスト（古い→新しいへ置換する候補）
KNOWN_HOSTS = [
    r"https?://aichi-highschool\.jp",
    r"https?://ikomainagoyaaichihighschool\.pages\.dev",
]
TEXT_FILES = ["robots.txt", "llms.txt", "llms-full.txt", "sitemap.xml"]
EXTRA = [os.path.join("scripts", "build_sitemap.py")]


def files() -> list[str]:
    out = [f for f in TEXT_FILES if os.path.exists(os.path.join(ROOT, f))]
    out += [f for f in EXTRA if os.path.exists(os.path.join(ROOT, f))]
    for name in sorted(os.listdir(ROOT)):
        if name.endswith(".html") and name != "404.html":
            out.append(name)
    sdir = os.path.join(ROOT, "schools")
    if os.path.isdir(sdir):
        out += [os.path.join("schools", n) for n in sorted(os.listdir(sdir)) if n.endswith(".html")]
    return out


def rewrite(text: str, base: str) -> str:
    for host in KNOWN_HOSTS:
        text = re.sub(host, base, text)
    # 旧スクリプトの二重スラッシュ（base//path）を正規化
    text = re.sub(re.escape(base) + r"/{2,}", base + "/", text)
    # 内部リンクの .html を clean URL に（外部URLとパス無しは除外）
    b = re.escape(base)

    def strip_html(m: re.Match[str]) -> str:
        path = m.group(1)
        if path == "/index.html":
            return base + "/"
        return base + path

    text = re.sub(b + r"(/[A-Za-z0-9_\-/]+?)\.html", strip_html, text)
    text = re.sub(b + r"/index\b(?![\w.\-])", base + "/", text)
    text = re.sub(b + r"/simulator\b(?![\w.\-])", base + "/simulator", text)
    return text


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        print(__doc__)
        return 2
    base = args[0].rstrip("/")
    check = "--check" in sys.argv
    changed = []
    for rel in files():
        p = os.path.join(ROOT, rel)
        cur = open(p, encoding="utf-8").read()
        new = rewrite(cur, base)
        if new != cur:
            changed.append(rel)
            if not check:
                open(p, "w", encoding="utf-8").write(new)
    if check:
        print(f"[{'!' if changed else '✓'}] {base}: 差分 {len(changed)} ファイル" + (f" → {changed[:8]}" if changed else ""))
        return 1 if changed else 0
    print(f"[✓] {base} へ付け替え: {len(changed)} ファイル更新 {changed[:8]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
