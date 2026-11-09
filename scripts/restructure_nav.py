#!/usr/bin/env python3
"""グローバルナビを「主要チップ1段＋カテゴリ別パネル」に再構成する。

背景: 21本のリンクが1行の横スクロールに詰め込まれ、目的のページに辿り着けない。
方針:
  - 1段目 = 主要導線（ランキング / 合否シミュレーター / 相談 / ブログ）だけを常時表示
  - 2段目以降 = 「メニュー」で開くカテゴリ別パネル（本文は動かないオーバーレイ）
  - 全ページで同じ並び・同じ本数にそろえる（従来はページごとにリンク集合がばらついていた）
  - 文言は既存ページのものを使い、無ければ canonical にフォールバック
  - 何度流しても差分ゼロ（生成結果を比較して書き込むため）
使い方: python3 scripts/restructure_nav.py [--check]
"""
from __future__ import annotations

import glob
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SENTINEL = "<!-- NAV_ROWS v1 -->"
CSS_SENTINEL = "/* === NAV_ROWS v1 === */"
BLOG = ("https://naogoya-aichi-koukoujyuken.hatenadiary.com", "📝 公式ブログ", "📝 ブログ")
BLOG_CLASS = "nav-blog"

# ナビを持たないが導線を付けたいページ（<body> 直後にナビを差し込む）
NO_NAV_PAGES = {"tokutai-scholarship-guide.html"}

# (ファイル名, デスクトップ表記, モバイル表記)
PRIMARY = [
    ("index.html", "📊 内申点ランキングTOP", "📊 内申ランキング"),
    ("simulator.html", "🎯 内申×当日 合否シミュレーター", "🎯 合否シミュレーター"),
    ("community.html", "💬 質問・相談チャネル", "💬 相談チャネル"),
]
PRIMARY_CLASS = {"community.html": "nav-community"}

GROUPS: list[tuple[str, list[tuple[str, str]]]] = [
    ("内申・時期", [
        ("final-exam-naishin-guide.html", "📝 2学期期末・内申攻略"),
        ("mock-exam-guide.html", "📈 模試判定の読み方"),
        ("autumn-tour-guide.html", "🍂 秋の見学会チェック"),
        ("schedule.html", "🗓 進学スケジュール"),
        ("test-study-guide.html", "✏️ 普段のテスト対策"),
    ]),
    ("出願・併願", [
        ("private-exam-guide.html", "🏫 私立3日間併願パターン"),
        ("recommendation-guide.html", "🎖 推薦・特色選抜"),
        ("composite-selection-guide.html", "🔗 複合選抜・W出願"),
        ("public-vs-private-guide.html", "⚖️ 公立・私立比較"),
    ]),
    ("お金・特待", [
        ("tokutai-scholarship-guide.html", "🎓 私立特待・奨学金"),
        ("tuition-guide.html", "💰 学費・補助金ガイド"),
    ]),
    ("対策・交流", [
        ("past-exam-guide.html", "📄 マークシート・過去問対策"),
        ("sns-real-voices.html", "💬 SNSリアル本音口コミ"),
        ("ai-study-guide.html", "🤖 最新AI勉強法"),
        ("ai-prompts.html", "⚡ 神プロンプト集"),
        ("about-shachifuku.html", "🦉 シャチフク先輩とは"),
        ("math-movie-lab.html", "🎬 動く図でわかる数学"),
    ]),
]

CSS = CSS_SENTINEL + """
/* 1段目=主要導線（常時表示） / 「メニュー」でカテゴリ別パネルを重ねて開く（本文は動かない） */
.top-nav .nav-shell { max-width: 1320px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.top-nav .nav-rows { position: absolute; left: 0; right: 0; top: 100%; z-index: 120; display: none; flex-direction: column; gap: 8px; padding: 14px max(16px, calc((100% - 1320px) / 2)) 16px; background: #FFFEFB; border-top: 1px solid #EFEBE3; box-shadow: 0 16px 32px rgba(15, 23, 42, 0.10); max-height: 75vh; overflow: auto; }
.top-nav input.nav-toggle { position: absolute; opacity: 0; width: 1px; height: 1px; pointer-events: none; }
.top-nav input.nav-toggle:checked ~ .nav-rows { display: flex; }
.top-nav .nav-group { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.top-nav .nav-group .nav-label { flex: 0 0 6.2em; font-size: 0.7rem; font-weight: 800; color: #9b968c; letter-spacing: 0.06em; white-space: nowrap; }
.top-nav .nav-chip .nav-sm { display: none; }
.top-nav .nav-toggle-label { display: inline-flex; align-items: center; gap: 4px; font-size: 0.78rem; font-weight: 800; color: #4b5563; background: #F3F1EC; border: 1px solid #E5E1D8; border-radius: 9999px; padding: 6px 12px; cursor: pointer; user-select: none; }
.top-nav input.nav-toggle:checked + .nav-shell .nav-toggle-label { background: #111827; color: #FFFFFF; border-color: #111827; }
.top-nav input.nav-toggle:focus-visible + .nav-shell .nav-toggle-label { outline: 2px solid #F2A93B; outline-offset: 2px; }
.top-nav .nav-toggle-label .nav-sm { display: none; }
@media (max-width: 820px) {
  body .top-nav { padding: 8px 10px; }
  .top-nav .nav-shell { gap: 6px; }
  .top-nav .nav-chip { font-size: 0.78rem; padding: 5px 10px; }
  .top-nav .nav-chip .nav-lg { display: none; }
  .top-nav .nav-chip .nav-sm { display: inline; }
  .top-nav .nav-rows { padding: 12px 12px 14px; gap: 6px; }
  .top-nav .nav-group .nav-label { flex: 0 0 100%; margin: 6px 0 0; }
  .top-nav .nav-toggle-label .nav-lg { display: none; }
  .top-nav .nav-toggle-label .nav-sm { display: inline; }
  /* 上部の AIカンパニー相互ネットワーク帯も折り返す（ラベル行が切れていた） */
  #ai-company-network-bar > div > div:first-child { flex-wrap: wrap; }
}
"""

ANCHOR_RE = re.compile(r'<a\b([^>]*)>(.*?)</a>', re.S)
NAV_RE = re.compile(r'(<nav class="top-nav">)(.*?)(</nav>)', re.S)
TAG_RE = re.compile(r'<[^>]+>')


def base_of(href: str) -> str:
    if href.startswith("http"):
        return href
    name = href.split("#")[0].split("?")[0].rstrip("/").split("/")[-1]
    return name or "index.html"


def collect_labels() -> dict[str, str]:
    """既存ページのナビ文言を集約（同じページに対して最頻の文言を採用）。"""
    seen: dict[str, dict[str, int]] = {}
    for path in sorted(glob.glob(os.path.join(ROOT, "*.html")) +
                       glob.glob(os.path.join(ROOT, "schools", "*.html"))):
        if os.path.basename(path) == "404.html":
            continue
        html = open(path, encoding="utf-8").read()
        m = NAV_RE.search(html)
        if not m:
            continue
        for am in ANCHOR_RE.finditer(m.group(2)):
            href = re.search(r'href="([^"]*)"', am.group(1))
            if not href:
                continue
            key = base_of(href.group(1))
            body = am.group(2)
            lg = re.search(r'<span class="nav-lg">(.*?)</span>', body, re.S)
            text = TAG_RE.sub("", lg.group(1) if lg else body).strip()
            if not text:
                continue
            seen.setdefault(key, {})
            seen[key][text] = seen[key].get(text, 0) + 1
    return {k: max(v.items(), key=lambda kv: kv[1])[0] for k, v in seen.items()}


def exists(name: str) -> bool:
    return os.path.exists(os.path.join(ROOT, name))


def build_nav(page_basename: str, prefix: str, labels: dict[str, str]) -> str:
    def anchor(href: str, text: str, extra: list[str], short: str | None = None) -> str:
        cls = " ".join(["nav-chip"] + extra)
        body = (f'<span class="nav-lg">{text}</span><span class="nav-sm">{short}</span>'
                if short else text)
        target = ' target="_blank" rel="noopener"' if href.startswith("http") else ""
        return f'<a href="{href}"{target} class="{cls}">{body}</a>'

    shell: list[str] = []
    for name, lg, sm in PRIMARY:
        if not exists(name):
            continue
        text = labels.get(name, lg)
        extra = ["nav-primary"]
        if name in PRIMARY_CLASS:
            extra.append(PRIMARY_CLASS[name])
        if name == page_basename:
            extra.append("active")
        shell.append(anchor(prefix + name, text, extra, sm))
    blog_href, blog_lg, blog_sm = BLOG
    shell.append(anchor(blog_href, labels.get(blog_href, blog_lg), ["nav-primary", BLOG_CLASS], blog_sm))

    rows: list[str] = []
    for label, items in GROUPS:
        chips = []
        for name, text in items:
            if not exists(name):
                continue
            extra = ["active"] if name == page_basename else []
            chips.append(anchor(prefix + name, labels.get(name, text), extra))
        if chips:
            rows.append(
                '      <div class="nav-group">\n'
                f'        <span class="nav-label">{label}</span>\n'
                '        ' + "\n        ".join(chips) + "\n"
                '      </div>'
            )

    return (
        f"{SENTINEL}\n"
        '    <input type="checkbox" class="nav-toggle" id="navRowsToggle" aria-label="メニューを開閉">\n'
        '    <div class="nav-shell">\n'
        '      ' + "\n      ".join(shell) + "\n"
        '      <label class="nav-toggle-label" for="navRowsToggle">'
        '<span class="nav-lg">☰ すべてのメニュー</span><span class="nav-sm">☰ メニュー</span></label>\n'
        '    </div>\n'
        '    <div class="nav-rows">\n' + "\n".join(rows) + "\n    </div>\n  "
    )


def main() -> int:
    check = "--check" in sys.argv
    labels = collect_labels()
    files = sorted(glob.glob(os.path.join(ROOT, "*.html"))) + \
        sorted(glob.glob(os.path.join(ROOT, "schools", "*.html")))
    changed = 0
    total = 0
    for path in files:
        name = os.path.basename(path)
        if name == "404.html":
            continue
        html = open(path, encoding="utf-8").read()
        m = NAV_RE.search(html)
        if not m:
            if name in NO_NAV_PAGES and "<body" in html:
                total += 1
                nav = '<nav class="top-nav">\n  ' + build_nav(name, "", labels) + "</nav>\n"
                new_html = re.sub(r'(<body[^>]*>\n)', lambda mm: mm.group(1) + "  " + nav, html, count=1)
                if new_html != html:
                    changed += 1
                    if not check:
                        open(path, "w", encoding="utf-8").write(new_html)
            continue
        total += 1
        prefix = "../" * os.path.relpath(path, ROOT).count(os.sep)
        head = m.group(1) + "\n  " + build_nav(name, prefix, labels) + m.group(3)
        new_html = html[: m.start()] + head + html[m.end():]
        if new_html == html:
            continue
        changed += 1
        if not check:
            open(path, "w", encoding="utf-8").write(new_html)

    css_path = os.path.join(ROOT, "common.css")
    css = open(css_path, encoding="utf-8").read()
    css_needs = CSS_SENTINEL not in css or css[css.index(CSS_SENTINEL):].strip() != CSS.strip()
    if css_needs and not check:
        body = css[: css.index(CSS_SENTINEL)].rstrip() if CSS_SENTINEL in css else css.rstrip()
        open(css_path, "w", encoding="utf-8").write(body + "\n\n" + CSS)

    mark = "!" if (changed or css_needs) else "✓"
    state = "差分あり" if changed else "差分なし"
    print(f"[{mark}] ナビ再構成: {state} {changed}/{total} ページ"
          + ("・common.css 更新" if (css_needs and not check) else "")
          + ("（--check のため未書き込み）" if check and (changed or css_needs) else ""))
    return 1 if (check and (changed or css_needs)) else 0


if __name__ == "__main__":
    raise SystemExit(main())
