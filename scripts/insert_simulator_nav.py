#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ナビと学校ページ導線に「🎯 合否シミュレーター」を冪等注入する.

- 全ページのグローバルナビ（トップ階層 / schools/ 配下）にリンクを1本追加
- schools/*.html には、その高校の校内順位方式（Ⅰ〜Ⅴ型）を出したCTAバナーを追加
  （型は simulator-data.json を正とする。未登録の学校は型表記なしの汎用文言）

  python3 scripts/insert_simulator_nav.py
"""
import glob
import json
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(BASE, "simulator-data.json")
LINK_TEXT = "🎯 内申×当日 合否シミュレーター"
CTA_SENTINEL = "<!-- SIMULATOR_CTA -->"
CTA_RE = re.compile(r"[ \t]*" + re.escape(CTA_SENTINEL) + r"[\s\S]*?</a>[ \t]*\n?", re.S)
ROMA = {"I": "Ⅰ", "II": "Ⅱ", "III": "Ⅲ", "IV": "Ⅳ", "V": "Ⅴ"}
FORMULA = {
    "I": "評定＋当日", "II": "評定×1.5＋当日", "III": "評定＋当日×1.5",
    "IV": "評定×2＋当日", "V": "評定＋当日×2",
}


def load_types() -> dict:
    if not os.path.exists(DATA):
        return {}
    d = json.load(open(DATA, encoding="utf-8"))
    return {s["id"]: s for s in d.get("schools", [])}


def cta_html(prefix: str, sid: str, school: dict | None) -> str:
    if school:
        code = school["type"]
        head = f"この高校の校内順位方式は {ROMA[code]}型（{FORMULA[code]}）"
        mx = school["max"]
        mx_s = str(int(mx)) if float(mx).is_integer() else str(mx)
        sub = f"内申と当日点を入れると、{mx_s}点満点の方式スコアと合格目安まで何点かを即計算できます。"
    else:
        head = "内申×当日点で合否を判定"
        sub = "校内順位の決定方式（Ⅰ〜Ⅴ型）を再現した計算ツールで、現在地と必要な当日点を確認できます。"
    return (
        f"{CTA_SENTINEL}\n"
        f'    <a href="{prefix}simulator.html?school={sid}" style="display:block;text-decoration:none;'
        "margin:14px 0 4px;background:linear-gradient(135deg,#0f172a,#7c2d12);border-radius:14px;"
        'padding:14px 18px;box-shadow:0 3px 12px rgba(15,23,42,0.18);">\n'
        '      <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;">\n'
        "        <div>\n"
        '          <div style="font-size:0.7rem;font-weight:800;color:#FDE68A;letter-spacing:0.06em;">'
        "🎯 合否シミュレーター（無料）</div>\n"
        f'          <div style="font-size:0.95rem;font-weight:800;color:#fff;line-height:1.5;margin-top:2px;">{head}</div>\n'
        f'          <div style="font-size:0.78rem;color:#CBD5E1;line-height:1.6;margin-top:3px;">{sub}</div>\n'
        "        </div>\n"
        '        <div style="background:#F59E0B;color:#0f172a;font-weight:800;font-size:0.82rem;'
        'padding:9px 18px;border-radius:9999px;white-space:nowrap;">判定する ↗</div>\n'
        "      </div>\n"
        "    </a>\n"
    )


def process(path: str, schools: dict) -> str:
    rel = os.path.relpath(path, BASE)
    depth = rel.count(os.sep)
    prefix = "../" * depth
    html = open(path, encoding="utf-8").read()
    changed = False

    # 1) ナビへのリンク挿入
    nav_link = f'<a href="{prefix}simulator.html">{LINK_TEXT}</a>'
    if nav_link not in html:
        anchor = re.compile(
            r'(<a href="%sindex\.html"[^>]*>📊 内申点ランキングTOP</a>)' % re.escape(prefix)
        )
        new, n = anchor.subn(lambda m: m.group(1) + "\n      " + nav_link, html, count=1)
        if n:
            html = new
            changed = True

    # 2) CTA（学校ページ＋ナビを持たない独立ページ）
    is_school = depth == 1 and os.path.basename(os.path.dirname(path)) == "schools"
    if is_school or 'class="top-nav"' not in html:
        sid = os.path.splitext(os.path.basename(path))[0]
        # 旧CTAを毎回除去してから作り直す（型データ変更・文科省表記の修正を反映するため）
        stripped = CTA_RE.sub("", html)
        m = re.search(r'(<div class="container"[^>]*>[ \t]*\n)', stripped)
        if m:
            rebuilt = stripped[: m.end()] + cta_html(prefix, sid, schools.get(sid)) + stripped[m.end():]
            if rebuilt != html:
                html = rebuilt
                changed = True

    if changed:
        open(path, "w", encoding="utf-8").write(html)
        return "updated"
    return "skip"


def main() -> int:
    schools = load_types()
    files = sorted(glob.glob(os.path.join(BASE, "*.html"))) + \
        sorted(glob.glob(os.path.join(BASE, "schools", "*.html")))
    stats = {"updated": 0, "skip": 0}
    for path in files:
        if os.path.basename(path) == "simulator.html":
            continue
        r = process(path, schools)
        stats[r] += 1
    print(f"[✓] 更新 {stats['updated']} / 変更なし {stats['skip']}（型データ {len(schools)} 校）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
