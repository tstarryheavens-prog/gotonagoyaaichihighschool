#!/usr/bin/env python3
"""
auto_aichi_publisher.py
愛知県高校受験ナビ＆公式はてなブログ 週2回自律更新エンジン
- 毎週火・金 09:00 に Hermes cron から自動起動
- 受験シーズンに応じた最新特集記事（特待生・奨学金、三者面談、冬休み集中演習、公立過去問等）を選定
- はてなブログ（AtomPub）への新規投稿（hatena_publisher.py 連携）
- メインサイト（Cloudflare Pages）用HTMLページの自動作成（AdSense + A8.net標準準拠）
- index.html および generate_school_pages.js のナビゲーション自動更新
- node generate_school_pages.js による全41高校ページの再生成
- git commit & git push による Cloudflare Pages への自動デプロイ
"""

from __future__ import annotations

import os
import sys
import json
import re
import datetime
import subprocess
from pathlib import Path

BASE_DIR = Path("/Volumes/Docker/AichiHighschoolRoom")
HATENA_DIR = BASE_DIR / "hatena_blog"
ARTICLES_DIR = HATENA_DIR / "articles"
SCRIPTS_DIR = BASE_DIR / "scripts"
LOG_FILE = SCRIPTS_DIR / "auto_publisher.log"

sys.path.insert(0, str(HATENA_DIR))
try:
    import hatena_publisher
except ImportError:
    hatena_publisher = None

# ============================================================
# 長文執筆エンジン（2026-11-06: 1記事 純テキスト10,000字以上を必須化）
# 従来は固定文面の記事（実測 数百字）をそのまま はてなブログと本サイトへ投稿していた。
# SmartAILife 側 article_generator.py の「10章逐次生成 + 文字数ゲート」を共用し、
# 10,000字に届かない記事は投稿も git push も行わない（スタブ記事の量産を止める）。
# ============================================================
MIN_ARTICLE_CHARS = int(os.getenv("MIN_ARTICLE_CHARS", "10000"))
LONGFORM_ENGINE_DIRS = [
    "/Volumes/Docker/SmartAILife/ai_company/02_production",   # フォールバック (article_generator)
]
LONGFORM_TOOL_DIR = "/Volumes/Docker/SmartAILife/tools"


def load_longform_writer():
    """long-form-writer スキルのエンジン (long_form_writer.py) を import して返す"""
    if Path(LONGFORM_TOOL_DIR).exists() and LONGFORM_TOOL_DIR not in sys.path:
        sys.path.insert(0, LONGFORM_TOOL_DIR)
    try:
        import long_form_writer
        return long_form_writer
    except Exception as e:
        print(f"[!] long_form_writer の import 失敗: {e}", file=sys.stderr)
        return None



def load_longform_engine():
    """共用の長文エンジン (article_generator) を import して返す。取得できなければ None"""
    for d in LONGFORM_ENGINE_DIRS:
        if Path(d).exists():
            if d not in sys.path:
                sys.path.insert(0, d)
            try:
                import article_generator
                return article_generator
            except Exception as e:
                print(f"[!] 長文エンジンの import 失敗 ({d}): {e}", file=sys.stderr)
    return None


def build_longform_body(topic: dict, engine) -> tuple:
    """10,000字以上の特集記事本文（HTML）を組み上げる (本文, ゲート情報)

    1st: long-form-writer スキルの共通エンジン (SmartAILife/tools/long_form_writer.py)
    2nd: 既存の article_generator (Strata 逐次生成 + 増補)
    """
    idea = {
        "id": f"aichi_feature_{topic['id']}",
        "site_id": "aichi-high",
        "division_title": "愛知高校受験ナビ",
        "title": topic["title"],
        "summary": topic["description"],
        "target_audience": "愛知県の公立・私立高校受験を控える中学生とその保護者",
        "source_name": "愛知県公立高校入試（複合選抜）の公表資料・尾張高校ナビの全校データ",
        "source_url": "https://ai-living-lab.pages.dev/divisions/aichi-high/",
        "direct_quote": topic["description"],
        "suggested_outline": topic["categories"],
    }

    lfw = load_longform_writer()
    if lfw is not None:
        # ドラフトはサイトのgitリポジトリ外に置く（誤コミット防止）
        draft_dir = Path("/Volumes/Docker/SmartAILife/output/aichi_drafts")
        draft_dir.mkdir(parents=True, exist_ok=True)
        draft_md = draft_dir / f"aichi_{topic['id']}_longform.md"
        try:
            log("[*] 長文エンジン: long-form-writer (long_form_writer.py, backend=auto) を使用")
            res = lfw.write_long_article(
                topic=f"{topic['title']}\n\n{topic['description']}\n対象読者: 愛知県の高校受験生と保護者",
                target_words=max(MIN_ARTICLE_CHARS + 3000, 13000),
                backend="auto",
                min_chars=MIN_ARTICLE_CHARS,
                output_path=str(draft_md),
                fmt="md",
            )
            gate = {
                "chars": res["chars"],
                "rounds": res["rounds"],
                "shortfall": not res["gate_pass"],
                "min_chars": MIN_ARTICLE_CHARS,
                "engine": "long-form-writer",
            }
            if res["gate_pass"]:
                return lfw.markdown_to_html(res["markdown"]), gate
            log(f"[!] long-form-writer ゲート未達 ({res['chars']}字) -> article_generator で再試行")
        except Exception as e:  # noqa: BLE001
            log(f"[!] long-form-writer 実行例外: {e} -> article_generator で再試行")

    if engine is None:
        log("[!] article_generator フォールバックも利用不可")
        return "", {"chars": 0, "rounds": 0, "shortfall": True,
                    "min_chars": MIN_ARTICLE_CHARS, "engine": "none"}

    raw = engine.generate_longform_article(idea, prefer="strata")
    body, gate = engine.ensure_min_length(raw, idea, prefer="strata", min_chars=MIN_ARTICLE_CHARS)
    gate["engine"] = gate.get("engine", "article_generator")
    return body, gate

# 受験ロードマップに基づく特集記事カリキュラム
ARTICLE_TOPICS = [
    {
        "id": "14",
        "slug": "tokutai-scholarship-guide",
        "file_name": "14_tokutai_scholarship_guide.html",
        "site_file": "tokutai-scholarship-guide.html",
        "title": "【愛知の私立高校】奨学金・特待生（授業料免除）制度まとめ！公立併願で狙える基準・内申・当日点の目安",
        "short_nav": "🎓 私立特待・奨学金",
        "categories": ["高校受験", "私立高校", "愛知県", "特待生制度", "授業料無償化"],
        "description": "愛知県内の主要私立高校（名城大附、中京大中京、愛工大名電、東邦、愛知等）における特待生・奨学金制度（入学金免除・授業料全額免除等）を徹底解説！公立トップ校（旭丘・明和・一宮・向陽）併願者が知っておくべき内申点や当日点の目安を完全網羅。",
    },
    {
        "id": "15",
        "slug": "sansha-mendan-strategy",
        "file_name": "15_sansha_mendan_strategy.html",
        "site_file": "sansha-mendan-strategy.html",
        "title": "【中3・12月】三者面談で絶対に後悔しない志望校決定術！内申確定後の公立W出願・私立併願の最終詰め",
        "short_nav": "🤝 12月三者面談攻略",
        "categories": ["高校受験", "三者面談", "愛知県", "公立高校", "志望校決定"],
        "description": "12月上旬に実施される中3「最終三者面談」の完全攻略マニュアル！2学期期末テスト後の確定内申点を元に、中学校の先生から志望校変更を促された際の対処法、公立W出願の安全な組み合わせ（相撃ち回避）、私立滑り止め校の最終確認ポイントを解説。",
    },
    {
        "id": "16",
        "slug": "winter-vacation-study-plan",
        "file_name": "16_winter_vacation_study_plan.html",
        "site_file": "winter-vacation-study-plan.html",
        "title": "【中3冬休み】愛知県公立入試まであと2ヶ月！偏差値・当日点を急上昇させる「1日10時間」集中演習メニュー",
        "short_nav": "❄️ 冬休み10時間計画",
        "categories": ["高校受験", "冬休み勉強法", "愛知県", "公立高校", "過去問演習"],
        "description": "公立入試本番まで残り約60日となる「中3冬休み」。逆転合格を掴み取るための1日10時間タイムスケジュール、主要5教科の優先順位、マークシート形式に慣れる過去問演習法をステップ別で解説。",
    },
    {
        "id": "17",
        "slug": "past-exam-analysis-5subjects",
        "file_name": "17_past_exam_analysis_5subjects.html",
        "site_file": "past-exam-analysis-5subjects.html",
        "title": "【愛知公立過去問】主要5教科の出題傾向・頻出分野とマークシート配点配分＆足切り回避テクニック",
        "short_nav": "📖 過去問5教科分析",
        "categories": ["高校受験", "公立入試過去問", "愛知県", "マークシート", "出題傾向"],
        "description": "愛知県公立高校学力検査（各22点×5教科＝110点満点）の教科別出題傾向を徹底分析。英語の長文読解、数学の図形証明・関数、国語の現代文要約、理科・社会の資料読み取り問題を時間内に解き切るマークシート解答戦略。",
    },
    {
        "id": "18",
        "slug": "bairitsu-and-saishuu-syutsugan",
        "file_name": "18_bairitsu_and_saishuu_syutsugan.html",
        "site_file": "bairitsu-and-saishuu-syutsugan.html",
        "title": "【愛知県公立高校】出願倍率速報の正しい読み解き方と志願変更の最終判断基準",
        "short_nav": "📊 出願倍率速報・志願変更",
        "categories": ["高校受験", "出願倍率", "愛知県", "公立高校", "志願変更"],
        "description": "毎年2月に発表される愛知県公立高校の志願者数・出願倍率速報の読み解き方を解説。第1希望・第2希望の重複比率による「実質倍率」の計算式や、定員割れ・高倍率校への志願変更を検討する際の判断基準。",
    }
]

def log(msg: str):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted = f"[{timestamp}] {msg}"
    print(formatted)
    SCRIPTS_DIR.mkdir(parents=True, exist_ok=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(formatted + "\n")

def get_next_topic() -> dict | None:
    """未公開の記事トピックを1件特定"""
    existing_files = set(f.name for f in ARTICLES_DIR.glob("*.html"))
    for topic in ARTICLE_TOPICS:
        if topic["file_name"] not in existing_files:
            return topic
    return None

def build_hatena_html(topic: dict, long_body: str = "") -> str:
    """はてなブログ用のリッチHTMLを生成（long_body = 10,000字以上の本文HTML）"""
    return f"""<div style="line-height: 1.8; color: #1e293b; font-size: 16px;">

  <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px 22px; margin-bottom: 25px;">
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
      <span style="font-size: 24px;">📝</span>
      <strong style="color: #166534; font-size: 17px;">{topic['title']}</strong>
    </div>
    <p style="margin: 0; font-size: 14.5px; color: #14532d;">
      {topic['description']}
    </p>
  </div>

  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 20px; margin: 18px 0; border-left: 4px solid #2563eb;">
    <h3 style="margin-top:0; color: #1e40af; font-size: 16px;">💡 本記事の要点サマリー</h3>
    <ul style="margin: 0; padding-left: 20px; font-size: 14.5px; line-height: 1.8;">
      <li><strong>正確な情報把握</strong>：学校ごとの基準や日程の重複を事前にチェック。</li>
      <li><strong>リスク分散</strong>：公立第1・第2志望および私立併願の組み合わせを最適化。</li>
      <li><strong>過去問演習の徹底</strong>：マークシート形式に特化した時間配分を体得。</li>
    </ul>
  </div>

  {long_body}

  <p style="margin-top: 30px; font-size: 14px; color: #64748b; text-align: center;">
    ※愛知県尾張地区の高校受験進学ナビ（全校詳細データ・内申点ランキング）は本サイトにて公開中です。
  </p>
</div>
"""

def build_site_html(topic: dict, long_body: str = "") -> str:
    """本サイト用の完全なHTMLページを生成（long_body = 10,000字以上の本文HTML）"""
    return f"""<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{topic['title']}【尾張高校ナビ】</title>
  <meta name="description" content="{topic['description']}">

  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1988464307898443" crossorigin="anonymous"></script>

  <!-- A8.net リンクマネージャー -->
  <script src="//statics.8me.jp/a8link/a8linkmgr.js"></script>
  <script>
    a8linkmgr({{
      "config_id": "AiCzxW5LM9avBb8VJ393"
    }});
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&family=Noto+Sans+JP:wght@400;500;700;800&display=swap" rel="stylesheet">
  <link rel="icon" type="image/png" href="favicon.png">
  <link rel="apple-touch-icon" href="logo.png">
  <link rel="stylesheet" href="common.css">

  <style>
    .container {{ max-width: 1060px; margin: 0 auto; padding: 0 16px; }}
    .section-card {{
      background: #ffffff;
      border-radius: 16px;
      padding: 28px;
      margin: 22px 0;
      border: 1px solid var(--border-soft, #e2e8f0);
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
    }}
    .back-btn {{
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 16px; background: #f1f5f9; color: #334155;
      border-radius: 9999px; text-decoration: none; font-size: 0.85rem;
      font-weight: 700; margin-bottom: 16px;
    }}
  </style>
</head>
<body>
  <div class="container" style="padding-top: 20px;">
    <a href="index.html" class="back-btn">← 内申点ランキングTOPへ戻る</a>

    <div class="section-card">
      <h1 style="font-size: 1.5rem; color: #1e293b; margin-top: 0;">{topic['title']}</h1>
      <p style="color: #64748b; font-size: 0.95rem; line-height: 1.7;">
        {topic['description']}
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">

      <div style="line-height: 1.8; color: #334155;">
        <h3>📌 特集解説</h3>
        {long_body}
        <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 14px 18px; margin: 18px 0; border-radius: 8px;">
          <p style="margin: 0; font-size: 0.92rem; color: #1e40af;">
            💡 各高校の詳しい内申点目安・進学実績・制服・アクセス情報は <a href="index.html" style="color: #2563eb; font-weight: 700;">トップページの内申点一覧</a> よりご確認いただけます。
          </p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
"""

def update_navbars(topic: dict):
    """index.html および generate_school_pages.js のナビゲーションを更新"""
    nav_link = f'      <a href="../{topic["site_file"]}">{topic["short_nav"]}</a>\n'
    gen_file = BASE_DIR / "generate_school_pages.js"
    if gen_file.exists():
        content = gen_file.read_text(encoding="utf-8")
        if topic["site_file"] not in content:
            marker = '      <a href="../final-exam-naishin-guide.html">📝 2学期期末・内申攻略</a>\n'
            if marker in content:
                content = content.replace(marker, nav_link + marker)
                gen_file.write_text(content, encoding="utf-8")
                log(f"[✓] Added {topic['site_file']} to generate_school_pages.js nav")

    idx_file = BASE_DIR / "index.html"
    if idx_file.exists():
        content = idx_file.read_text(encoding="utf-8")
        idx_nav = f'      <a href="{topic["site_file"]}">{topic["short_nav"]}</a>\n'
        if topic["site_file"] not in content:
            marker_idx = '      <a href="final-exam-naishin-guide.html">📝 2学期期末・内申攻略</a>\n'
            if marker_idx in content:
                content = content.replace(marker_idx, idx_nav + marker_idx)
                idx_file.write_text(content, encoding="utf-8")
                log(f"[✓] Added {topic['site_file']} to index.html nav")

def run_pipeline():
    log("=== 愛知高校受験ナビ 定期自動更新パイプライン開始 ===")
    topic = get_next_topic()
    if not topic:
        log("全トピック公開済み、または未着手トピックなし。更新スキップ。")
        return

    log(f"選定トピック: [{topic['id']}] {topic['title']}")

    # 0. 長文本文（純テキスト 10,000字以上）を生成。未達なら投稿もデプロイも行わない。
    engine = load_longform_engine()
    if engine is None and load_longform_writer() is None:
        log("[!] 長文エンジン(long_form_writer / article_generator)を読み込めないため、今回は公開を中止します（短記事は投稿しない）")
        return
    target_chars = getattr(engine, "TARGET_ARTICLE_CHARS", MIN_ARTICLE_CHARS)
    log(f"長文生成開始: 要求 {MIN_ARTICLE_CHARS} 字以上（目標 {target_chars} 字）")
    long_body, gate = build_longform_body(topic, engine)
    log(f"長文生成結果: 純テキスト {gate['chars']} 字 / 要求 {gate['min_chars']} 字 (増補 {gate['rounds']} ラウンド, engine={gate.get('engine','article_generator')})")
    if gate["shortfall"]:
        log(f"[!] 長文ゲート未達 ({gate['chars']} 字 < {gate['min_chars']} 字) -> はてな投稿・git push を中止。次回は同一トピックで再試行します。")
        draft = SCRIPTS_DIR / f"draft_{topic['file_name']}"
        draft.write_text(long_body, encoding="utf-8")
        log(f"[✓] 未達ドラフト保存: {draft}")
        return

    # 1. はてなブログ用HTML生成
    hatena_html = build_hatena_html(topic, long_body)
    hatena_path = ARTICLES_DIR / topic["file_name"]
    hatena_path.write_text(hatena_html, encoding="utf-8")
    log(f"[✓] Hatena HTML 保存: {hatena_path.name}")

    # 2. はてなブログへAtomPub投稿
    if hatena_publisher:
        try:
            res = hatena_publisher.post_article(
                title=topic["title"],
                html_content=hatena_html,
                categories=topic["categories"],
                is_draft=False
            )
            log(f"[✓] はてなブログ投稿完了 (ステータス: {res.status_code if hasattr(res, 'status_code') else 'OK'})")
        except Exception as e:
            log(f"[!] はてなブログ投稿例外: {e}")

    # 3. 本サイト用HTML作成
    site_html = build_site_html(topic, long_body)
    site_path = BASE_DIR / topic["site_file"]
    site_path.write_text(site_html, encoding="utf-8")
    log(f"[✓] サイトHTML 保存: {site_path.name}")

    # 4. ナビゲーション更新
    update_navbars(topic)

    # 5. 全高校ページの再生成
    try:
        log("node generate_school_pages.js 実行中...")
        out = subprocess.check_output(["node", "generate_school_pages.js"], cwd=str(BASE_DIR), timeout=60, text=True)
        log(f"[✓] 全校ページ再生成完了: {out.strip()[:100]}")
    except Exception as e:
        log(f"[!] node generate_school_pages.js 失敗: {e}")

    # 6. Git commit & push
    try:
        subprocess.run(["git", "add", "-A"], cwd=str(BASE_DIR), check=True)
        commit_msg = f"Weekly auto content update: {topic['title'][:40]}"
        subprocess.run(
            ["git", "-c", "user.name=tstarryheavens-prog", "-c", "user.email=user@example.com", "commit", "-m", commit_msg],
            cwd=str(BASE_DIR), check=True
        )
        subprocess.run(["git", "push", "origin", "main"], cwd=str(BASE_DIR), check=True, timeout=60)
        log(f"[✓] Git commit & push 完了 (Cloudflare Pages 自動デプロイ)")
    except Exception as e:
        log(f"[!] Git commit/push 失敗: {e}")

    log("=== 愛知高校受験ナビ 定期自動更新パイプライン完了 ===")

if __name__ == "__main__":
    run_pipeline()
