#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""愛知県公立高校 合否シミュレーター用データ生成スクリプト.

正本（single source of truth）は Hermes 側の
  ~/.hermes/scripts/aichi_exam/data/schools.json
（計算式・型・数値ボーダー・出典）。本スクリプトはそれを Web 用に射影し、
このサイトの schools_data.js（内申目安・偏差値・個別ページ）と結合して
  simulator-data.json
を出力する。サイト側で数値を手編集しないこと。

校内順位の決定方式（Ⅰ〜Ⅴ型）は愛知県教育委員会の公式PDF
  https://www.pref.aichi.jp/uploaded/attachment/623173.pdf
（令和9年度=2027年度 一般選抜）に基づく。SCHOOL_TYPES は
「学校名と学科・方式が同じ行に並んでいる箇所」だけを採用し、
判読が曖昧な学校は意図的に未登録（Is None）にしている。

使い方:
  python3 scripts/sync_simulator_data.py           # 生成
  python3 scripts/sync_simulator_data.py --check    # 差分があれば exit 1
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
from datetime import datetime, timezone, timedelta

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RUNNER_DATA = os.path.expanduser("~/.hermes/scripts/aichi_exam/data/schools.json")
OUT_PATH = os.path.join(BASE_DIR, "simulator-data.json")
SCHOOLS_JS = os.path.join(BASE_DIR, "schools_data.js")

SOURCE_PDF = "https://www.pref.aichi.jp/uploaded/attachment/623173.pdf"

# 校内順位の決定方式（公式PDF・令和9年度）。キーは schools_data.js の id。
# deps は学科ごとの方式。先頭が代表学科（＝ページの既定値）。
SCHOOL_TYPES = {
    "asahi":            {"deps": {"普通科": "V", "美術科": "I"}},
    "meiwa":            {"deps": {"普通科": "V", "音楽科": "V"}},
    "ichinomiya":       {"deps": {"普通科": "V"}},
    "koyo":             {"deps": {"普通科": "V", "国際科学科": "V"},
                         "extra": [{"dep": "国際科学科", "runner_id": "koyo-rikka"}]},
    "kikuzato":         {"deps": {"普通科": "V", "音楽科": "V"}},
    "zuiryo":           {"deps": {"普通科": "V", "理数科": "V", "食物科": "III"}},
    "chigusa":          {"deps": {"普通科": "V", "国際教養科": "V"}},
    "ichinomiya-nishi": {"deps": {"普通科": "V"}},
    "sakuradai":        {"deps": {"普通科": "V", "ファッション創造科": "I"}},
    "meito":            {"deps": {"普通科": "V"}},
    "yokosuka":         {"deps": {"普通科": "V"}},
    "showa":            {"deps": {"普通科": "V"}},
    "shoin":            {"deps": {"普通科": "V"}},          # 松蔭
    "nagoya-minami":    {"deps": {"普通科": "V"}},
    "tempaku":          {"deps": {"普通科": "V"}},
    "atsuta":           {"deps": {"普通科": "V"}},
    "narumi":           {"deps": {"普通科": "III"}},
    "nisshin-nishi":    {"deps": {"普通科": "I"}},
    "nagakute":         {"deps": {"普通科": "III"}},
    "midori":           {"deps": {"普通科": "III"}},        # 市立緑
    "yamada":           {"deps": {"普通科": "III"}},        # 市立山田
    "moriyama":         {"deps": {"普通科": "I"}, "interview": True},
}

# サイト側（index.html の naishinDiagnosisData）が公表している
# 「内申帯 → 公立一般入試の当日点目標レンジ」。参考レンジ算出にのみ使用。
BAND_TARGETS = [
    (43, 43, 45, 98, 106),
    (40, 40, 42, 88, 96),
    (37, 37, 39, 82, 88),
    (35, 35, 36, 78, 84),
    (33, 33, 34, 72, 78),
    (30, 29, 32, 64, 72),
    (26, 25, 28, 54, 64),
    (22, 21, 24, 42, 52),
    (18, 18, 20, 35, 45),
]

ROMA = {"I": "Ⅰ", "II": "Ⅱ", "III": "Ⅲ", "IV": "Ⅳ", "V": "Ⅴ"}


def load_runner_data() -> dict:
    with open(RUNNER_DATA, encoding="utf-8") as f:
        return json.load(f)


def parse_schools_js() -> dict:
    """schools_data.js から id -> 表示情報を抜く（JSはevalせず正規表現で読む）。"""
    h = open(SCHOOLS_JS, encoding="utf-8").read()
    out = {}
    for m in re.finditer(r'\{\s*"rank"[\s\S]*?\n  \}', h):
        block = m.group(0)
        def g(key):
            mm = re.search(r'"%s":\s*"([^"]*)"' % key, block)
            return mm.group(1) if mm else ""
        sid = g("id")
        if not sid:
            continue
        out[sid] = {
            "name": g("name"),
            "kind": g("type"),
            "typeLabel": g("typeLabel"),
            "location": g("location"),
            "group": g("group"),
            "naishin": g("score"),
            "deviation": g("deviation"),
            "page": g("pageUrl"),
        }
    return out


def band_for(naishin_low: int):
    for key, lo, hi, dlo, dhi in BAND_TARGETS:
        if lo <= naishin_low <= hi:
            return key, dlo, dhi
    return None, None, None


def type_score(naishin: int, day: int, weights: dict) -> float:
    return round(naishin * 2 * weights["naishin_weight"] + day * weights["day_weight"], 1)


def build() -> dict:
    rd = load_runner_data()
    js = parse_schools_js()
    types = rd["selection_types"]

    borders_by_name = {}
    for s in rd["schools"]:
        borders_by_name[s["id"]] = s

    # 跑者の正本IDのゆれ（旭丘高校=asahigaoka と asahi 等）を名前で吸収
    name_alias = {
        "旭丘高等学校": "asahigaoka", "明和高等学校": "meiwa",
        "一宮高等学校": "ichinomiya", "向陽高等学校": "koyo",
        "菊里高等学校": "kikuzato",
    }

    schools = []
    for sid, meta in js.items():
        if meta["kind"] != "public":
            continue
        t = SCHOOL_TYPES.get(sid)
        if not t:
            continue
        deps = t["deps"]
        main_dep = next(iter(deps))
        tcode = deps[main_dep]
        w = types[tcode]

        nlo = nhi = None
        mm = re.match(r"(\d+)[〜~](\d+)", meta["naishin"] or "")
        if mm:
            nlo, nhi = int(mm.group(1)), int(mm.group(2))

        entry = {
            "id": sid,
            "name": meta["name"],
            "dep": main_dep,
            "type": tcode,
            "type_label": ROMA[tcode] + "型",
            "type_formula": w["formula"],
            "max": round(90 * w["naishin_weight"] + 110 * w["day_weight"], 1),
            "deps": deps,
            "interview": t.get("interview", False),
            "group": meta["group"],
            "location": meta["location"],
            "naishin_ref": meta["naishin"],
            "deviation": meta["deviation"],
            "page": meta["page"],
            "border": None,
            "ref_range": None,
        }

        # 数値ボーダー（塾推定・信頼度C）がある学校
        alias = name_alias.get(meta["name"])
        src = None
        if alias and alias in borders_by_name:
            src = borders_by_name[alias]
        if src and src.get("border"):
            entry["border"] = {
                "naishin": src["border"]["naishin"],
                "day": src["border"]["day"],
                "score": src["border"]["score"],
                "confidence": src.get("border_confidence", "C"),
                "note": src.get("note", ""),
            }

        # 学科別ボーダー（例: 市立向陽の国際科学科は普通科と別ボーダー）
        dep_options = []
        for ex in t.get("extra", []):
            rid = ex["runner_id"]
            rb = borders_by_name.get(rid)
            dcode = deps.get(ex["dep"], tcode)
            dw = types[dcode]
            dep_options.append({
                "dep": ex["dep"],
                "type": dcode,
                "type_label": ROMA[dcode] + "型",
                "max": round(90 * dw["naishin_weight"] + 110 * dw["day_weight"], 1),
                "border": ({"naishin": rb["border"]["naishin"], "day": rb["border"]["day"],
                            "score": rb["border"]["score"],
                            "confidence": rb.get("border_confidence", "C"),
                            "note": rb.get("note", "")} if rb and rb.get("border") else None),
            })
        if dep_options:
            entry["dep_options"] = dep_options

        # ボーダー未整備の学校は、本サイト公表の内申目安×当日点目安から参考レンジを作る
        if nlo is not None and nhi is not None and not entry["border"]:
            key, dlo, dhi = band_for(nlo)
            if key is not None and dlo is not None and dhi is not None:
                entry["ref_range"] = {
                    "score_min": type_score(nlo, dlo, w),
                    "score_max": type_score(nhi, dhi, w),
                    "naishin": [nlo, nhi],
                    "day": [dlo, dhi],
                    "band": key,
                }

        schools.append(entry)

    schools.sort(key=lambda s: -(s["border"]["score"] if s["border"] else
                                 (s["ref_range"]["score_max"] if s["ref_range"] else 0)))

    payload = {
        "schema": 1,
        "data_version": rd["data_version"],
        "exam_year": "令和9年度（2027年度）",
        "generated_at": datetime.now(timezone(timedelta(hours=9))).isoformat(timespec="seconds"),
        "definition": rd["definition"],
        "selection_types": {
            code: {"label": v["label"], "formula": v["formula"],
                   "naishin_weight": v["naishin_weight"], "day_weight": v["day_weight"],
                   "max": round(90 * v["naishin_weight"] + 110 * v["day_weight"], 1)}
            for code, v in types.items()
        },
        "bands": rd["bands"],
        "band_targets": [
            {"key": k, "naishin": [lo, hi], "day": [dlo, dhi]} for k, lo, hi, dlo, dhi in BAND_TARGETS
        ],
        "schools": schools,
        "sources": rd["sources"],
        "source_pdf": SOURCE_PDF,
        "disclaimer": (
            "本シミュレーターは愛知県教育委員会が公表する校内順位の決定方式（Ⅰ〜Ⅴ型）に基づき、"
            "内申点と学力検査点から算出した数値を機械的に示すものです。実際の校内順位は、"
            "この数値を基礎資料として、面接・特別検査・調査書の記載事項などを総合して決定されます。"
            "また各校のボーダーは塾・各種情報の推定値であり、合格を保証するものではありません。"
        ),
    }
    return payload


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="差分検出のみ（書き込まない）")
    args = ap.parse_args()

    payload = build()
    text = json.dumps(payload, ensure_ascii=False, indent=1) + "\n"

    if args.check:
        if not os.path.exists(OUT_PATH):
            print("[!] simulator-data.json が無い")
            return 1
        old = open(OUT_PATH, encoding="utf-8").read()
        strip = lambda s: re.sub(r'"generated_at": "[^"]*"', "", s)
        if strip(old) != strip(text):
            print("[!] simulator-data.json が正本と一致しません。再生成してください")
            return 1
        print("[✓] 一致")
        return 0

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        f.write(text)

    n_border = sum(1 for s in payload["schools"] if s["border"])
    n_ref = sum(1 for s in payload["schools"] if s["ref_range"])
    sha = hashlib.sha256(text.encode()).hexdigest()[:12]
    print(f"[✓] {OUT_PATH} ({len(text)} bytes, sha={sha})")
    print(f"    型登録校: {len(payload['schools'])} / 数値ボーダー: {n_border} / 参考レンジ: {n_ref}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
