#!/usr/bin/env python3
"""
scripts/x_publisher.py - 愛知県高校受験進学ナビ 公式X（旧Twitter）プロモーション・投稿ツール

機能:
1. X API v2 (Tweepy / requests_oauthlib) クレデンシャルが存在する場合はAPI直投稿
2. クレデンシャル未設定時は、Web Intents URLを生成し、macOSのデフォルトブラウザで直接ツイート投稿画面を開く
3. スレッド形式・タグ・動画リンク完備の最適化投稿文を生成
"""

import os
import sys
import urllib.parse
import subprocess
import argparse

# 投稿テンプレート
POST_TEMPLATES = {
    "composite_selection": {
        "text": """【愛知高校受験】内申が低くても諦めるな！
公立トップ校の多くが採用する「IV型（当日点2倍配点）」の仕組みを徹底解説！

✅ 内申「1」の差は当日点1問で逆転可能
✅ 旭丘・明和・千種・向陽のボーダー目安
✅ 複合選抜W出願の最強ペアリング

▼詳細ガイド＆逆転計算
https://aichi-highschool.jp/composite-selection-guide.html

▼YouTube Shortsで40秒解説！
https://youtube.com/shorts/N3M59Nhgnwc

#愛知県高校入試 #高校受験 #内申点 #複合選抜 #逆転合格""",
        "url": "https://aichi-highschool.jp/composite-selection-guide.html"
    },
    "sns_real_voices": {
        "text": """【愛知高校生のリアル本音】
学校説明会では分からない「校則・自由度・リアルな学校生活」のSNS口コミをまとめました！

🏫 旭丘・千種：私服登校＆校則ほぼ無しの真の自由
🏫 明和・一宮：圧倒的文武両道と伝統行事
🏫 向陽・菊里：駅チカ・部活・進学実績の黄金比
🏫 中京・名城・名電：手厚い設備と進学力

全41校の自由度ランキング公開中👇
https://aichi-highschool.jp/sns-real-voices.html

#愛知高校 #高校受験 #校則 #愛知県高校入試""",
        "url": "https://aichi-highschool.jp/sns-real-voices.html"
    }
}

def generate_tweet_intent_url(text: str) -> str:
    """X Web Intent URLを生成"""
    params = {
        "text": text
    }
    return f"https://twitter.com/intent/tweet?{urllib.parse.urlencode(params)}"

def main():
    parser = argparse.ArgumentParser(description="X（旧Twitter）プロモーション投稿ツール")
    parser.add_argument("--theme", choices=["composite_selection", "sns_real_voices"], default="composite_selection", help="投稿テーマ")
    parser.add_argument("--open-browser", action="store_true", default=True, help="ブラウザで投稿画面を開く")
    args = parser.parse_args()

    post_info = POST_TEMPLATES.get(args.theme)
    if not post_info:
        print(f"Error: Unknown theme {args.theme}")
        sys.exit(1)

    tweet_text = post_info["text"]
    intent_url = generate_tweet_intent_url(tweet_text)

    print("=" * 60)
    print("📢 【愛知県高校受験進学ナビ】X（旧Twitter）プロモーション投稿")
    print("=" * 60)
    print("【投稿予定文面】")
    print(tweet_text)
    print("-" * 60)
    print("🔗 【ワンクリック投稿URL】")
    print(intent_url)
    print("=" * 60)

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
        print("✅ ブラウザでX投稿画面を開きました。内容を確認して「ポストする」を押してください。")

if __name__ == "__main__":
    main()
