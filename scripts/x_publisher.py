#!/usr/bin/env python3
"""
scripts/x_publisher.py - 愛知県高校受験進学ナビ 公式X（旧Twitter）プロモーション・投稿ツール

特長:
1. 【厳格なX文字数チェック】URL=23文字、全角=2文字、半角=1文字換算で280カウント以内を完全保証
2. 【ワンクリックWeb Intent起動】macOSデフォルトブラウザで安全に投稿画面をオープン
3. 【X API自動連携】環境変数にAPIキーがある場合はAPIダイレクト投稿
"""

import os
import sys
import re
import urllib.parse
import subprocess
import argparse

# 投稿テンプレート（すべて280カウント以内を厳密に保証）
POST_TEMPLATES = {
    "composite_selection": {
        "title": "公立高校 複合選抜＆IV型当日点逆転ガイド",
        "text": """【愛知高校受験】内申が低くても当日点で大逆転！？
公立トップ校が採用する「IV型（当日点2倍）」のルールをシャチフク先輩が解説！

内申1の差はテスト1問で相殺可能！

▼Shorts（40秒）
https://youtube.com/shorts/ZoG4ngjrcZ4

▼詳細ガイド
https://aichi-highschool.jp/composite-selection-guide.html

#愛知県高校入試"""
    },
    "sns_real_voices": {
        "title": "先輩・保護者のリアルSNS本音口コミ＆校則自由度ガイド",
        "text": """【愛知高校生のリアル本音】
説明会では分からない校則・自由度のSNS口コミを公開！

・旭丘・千種：私服＆校則フリー
・明和・一宮：文武両道と伝統行事
・向陽・菊里：駅チカ＆進学実績
・中京・名城：手厚い設備

全41校の自由度ランキング👇
https://aichi-highschool.jp/sns-real-voices.html

#愛知高校 #高校受験"""
    },
    "shorts_focus": {
        "title": "YouTube Shorts集中プロモーション",
        "text": """【愛知高校受験】公立高校の配点ルール知ってる？
多くの進学校は当日点2倍の「IV型配点」！
内申点が足りなくても、テスト1問で大逆転が狙えるぞ！

シャチフク先輩が40秒で解説👇
https://youtube.com/shorts/ZoG4ngjrcZ4

全41校の逆転ボーダー👇
https://aichi-highschool.jp/

#愛知県高校入試 #高校受験"""
    }
}

def calc_x_weight(text: str) -> int:
    """X (Twitter) のウェイト計算 (URLは固定23文字、全角2、半角1)"""
    urls = re.findall(r'https?://[^\s]+', text)
    text_no_url = re.sub(r'https?://[^\s]+', '', text)
    weight = len(urls) * 23
    for c in text_no_url:
        weight += 2 if ord(c) > 127 else 1
    return weight

def generate_tweet_intent_url(text: str) -> str:
    """X Web Intent URLを生成"""
    params = {
        "text": text
    }
    return f"https://twitter.com/intent/tweet?{urllib.parse.urlencode(params)}"

def main():
    parser = argparse.ArgumentParser(description="X（旧Twitter）プロモーション投稿ツール")
    parser.add_argument("--theme", choices=list(POST_TEMPLATES.keys()), default="composite_selection", help="投稿テーマ")
    parser.add_argument("--open-browser", action="store_true", default=True, help="ブラウザで投稿画面を開く")
    args = parser.parse_args()

    post_info = POST_TEMPLATES.get(args.theme)
    if not post_info:
        print(f"Error: Unknown theme {args.theme}")
        sys.exit(1)

    tweet_text = post_info["text"]
    weight = calc_x_weight(tweet_text)
    intent_url = generate_tweet_intent_url(tweet_text)

    print("=" * 66)
    print("📢 【愛知県高校受験進学ナビ】X（旧Twitter）プロモーション投稿")
    print(f"📌 テーマ: {post_info['title']}")
    print("=" * 66)
    print("【投稿文面】")
    print(tweet_text)
    print("-" * 66)
    print(f"📏 X文字数ウェイト: {weight} / 280 カウント (残り枠: {280 - weight})")
    if weight > 280:
        print(f"❌ 警告: 文字数制限を超過しています（{weight - 280}カウントオーバー）")
        sys.exit(1)
    else:
        print("✅ 文字数チェック合格！1ツイートに完全に収まります。")
    print("-" * 66)
    print("🔗 【ワンクリック投稿URL】")
    print(intent_url)
    print("=" * 66)

    # API キーが存在するかチェック
    api_key = os.environ.get("TWITTER_API_KEY")
    api_secret = os.environ.get("TWITTER_API_SECRET")
    access_token = os.environ.get("TWITTER_ACCESS_TOKEN")
    access_token_secret = os.environ.get("TWITTER_ACCESS_TOKEN_SECRET")

    if api_key and api_secret and access_token and access_token_secret:
        print("🔑 X API クレデンシャルを検出しました。API経由で投稿を試みます...")
        try:
            import tweepy
            client = tweepy.Client(
                consumer_key=api_key,
                consumer_secret=api_secret,
                access_token=access_token,
                access_token_secret=access_token_secret
            )
            resp = client.create_tweet(text=tweet_text)
            print(f"🎉 Xへの自動投稿が完了しました！ Tweet ID: {resp.data['id']}")
            return
        except Exception as e:
            print(f"⚠️ API投稿に失敗しました: {e}。ブラウザIntentにフォールバックします。")

    if args.open_browser and sys.platform == "darwin":
        print("🌐 デフォルトブラウザでX投稿画面を開きます...")
        subprocess.run(["open", intent_url])
        print("✅ ブラウザでX投稿画面を開きました。文字数エラーなくそのまま「ポストする」を押せます。")

if __name__ == "__main__":
    main()
