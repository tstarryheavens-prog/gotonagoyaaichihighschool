#!/usr/bin/env python3
"""sitemap.xml を生成する（Cloudflare Pages の clean URL 前提）。

- トップ階層の *.html（simulator.html は /simulator として出力）
- schools/*.html
- lastmod は git の最終コミット日（不明なら今日）
使い方: python3 scripts/build_sitemap.py [--check]
"""
from __future__ import annotations

import datetime as dt
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://ikomainagoyaaichihighschool.pages.dev"
OUT = os.path.join(ROOT, "sitemap.xml")

# サイトマップに載せない/別URLで載せるページ
SKIP = {"404.html"}
RENAME = {"simulator.html": "simulator", "index.html": ""}


def git_date(rel: str) -> str:
    try:
        d = subprocess.run(
            ["git", "log", "-1", "--format=%cs", "--", rel],
            cwd=ROOT, capture_output=True, text=True, check=True,
        ).stdout.strip()
        return d or dt.date.today().isoformat()
    except Exception:
        return dt.date.today().isoformat()


def url_for(rel: str) -> str:
    base = os.path.basename(rel)
    if base in RENAME:
        path = RENAME[base]
        return f"{BASE}/{path}".rstrip("/") + ("/" if path == "" else "")
    path = rel[:-5] if rel.endswith(".html") else rel
    return f"{BASE}/{path}"


def priority(rel: str) -> str:
    if rel == "index.html":
        return "1.0"
    if rel == "simulator.html":
        return "0.9"
    if rel.startswith("schools/"):
        return "0.7"
    return "0.6"


def entries() -> list[tuple[str, str, str]]:
    rels: list[str] = []
    for name in sorted(os.listdir(ROOT)):
        if name.endswith(".html") and name not in SKIP:
            rels.append(name)
    schools = os.path.join(ROOT, "schools")
    if os.path.isdir(schools):
        rels += [os.path.join("schools", n) for n in sorted(os.listdir(schools)) if n.endswith(".html")]
    rows = []
    for rel in rels:
        loc = url_for(rel) if not rel.startswith("schools/") else f"{BASE}/{rel[:-5]}"
        rows.append((loc, git_date(rel), priority(rel)))
    return rows


def render() -> str:
    today = dt.date.today().isoformat()
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, lastmod, pri in entries():
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", lastmod):
            lastmod = today
        out.append("  <url>")
        out.append(f"    <loc>{loc}</loc>")
        out.append(f"    <lastmod>{lastmod}</lastmod>")
        out.append(f"    <priority>{pri}</priority>")
        out.append("  </url>")
    out.append("</urlset>")
    return "\n".join(out) + "\n"


def main() -> int:
    xml = render()
    n = xml.count("<url>")
    if "--check" in sys.argv:
        cur = open(OUT, encoding="utf-8").read() if os.path.exists(OUT) else ""
        if cur == xml:
            print(f"[✓] 一致（{n} URL）")
            return 0
        print(f"[!] 差分あり（{n} URL）: python3 scripts/build_sitemap.py で再生成してください")
        return 1
    open(OUT, "w", encoding="utf-8").write(xml)
    print(f"[✓] {OUT}（{n} URL）")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
