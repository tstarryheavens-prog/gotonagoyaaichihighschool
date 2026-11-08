#!/usr/bin/env python3
"""シャチフク先輩 Shorts サムネイル生成（バナー調で全5本を統一）

- 出力: characters/shorts/thumb_0X.webp  (720x1280, サイト埋め込み用)
        characters/shorts/yt_thumb_0X.jpg (1080x1920, YouTube投稿用)
- 素材: characters/shachifuku-banner.webp / characters/shachifuku_face.webp / logo.png
- 依存: Pillow のみ

使い方: python3 scripts/generate_shachifuku_thumbs.py
"""
import os
from PIL import Image, ImageChops, ImageDraw, ImageFont, ImageFilter

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(BASE, "characters", "shorts")
F8 = "/System/Library/Fonts/ヒラギノ角ゴシック W8.ttc"
F6 = "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc"

CREAM_TOP = (255, 253, 248)
CREAM_BOTTOM = (255, 236, 209)
BROWN = (74, 44, 10)
BROWN_SOFT = (138, 90, 30)
GOLD_DARK = (160, 100, 12)
GOLD = (245, 158, 11)
ORANGE = (230, 126, 34)

# (番号, カテゴリ, メインコピー(改行込み), サブコピー, 動画ID)
EPISODES = [
    ("01", "複合選抜", "当日点2倍で\n大逆転できる", "IV型配点の\nカラクリ解説", "ZoG4ngjrcZ4"),
    ("02", "SNS口コミ", "校則・私服\nスマホも暴露", "先輩の本音を\n厳選して紹介", "yu3oSmy5rL4"),
    ("03", "内申35", "内申35でも\n合格できる道", "合格ボーダーと\n併願の組み方", "0XzcHodpMgA"),
    ("04", "通学戦略", "通学の落とし穴\n坂道ルート注意", "3年間通えるか\nで志望校を選ぶ", "Kloc1GRDd4Q"),
    ("05", "学費・無償化", "私立の学費は\nこう変わる", "支援金で学費は\nここまで減る", "4Hxch3G265k"),
]

W, H = 1080, 1920


def font(path, size):
    return ImageFont.truetype(path, size)


def gradient(w, h, top, bottom):
    img = Image.new("RGB", (1, h))
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(1, h - 1)
        d.point((0, y), tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    return img.resize((w, h), Image.BILINEAR)


def rounded(draw, box, r, fill):
    draw.rounded_rectangle(box, radius=r, fill=fill)


def main():
    os.makedirs(OUT, exist_ok=True)
    banner = Image.open(os.path.join(BASE, "characters", "shachifuku-banner.webp")).convert("RGB")
    face = Image.open(os.path.join(BASE, "characters", "shachifuku_face.webp")).convert("RGB")

    for num, cat, headline, sub, vid in EPISODES:
        # --- 背景: バナーの暖色領域（城・桜）を強くぼかして金色の「柄」にする ---
        bw, bh = banner.size
        warm = banner.crop((int(bw * 0.30), 0, bw, bh))
        ww, wh = warm.size
        scale = H / wh
        big = warm.resize((max(W, round(ww * scale)), H), Image.LANCZOS)
        x0 = max(0, (big.width - W) // 2)
        bg = big.crop((x0, 0, x0 + W, H))
        bg = bg.filter(ImageFilter.GaussianBlur(44))
        bg = Image.blend(bg, ImageChops.multiply(bg, Image.new("RGB", (W, H), (255, 190, 112))), 0.55)
        haze = Image.new("RGBA", (W, H), (255, 248, 236, 150))
        bg = Image.alpha_composite(bg.convert("RGBA"), haze).convert("RGB")

        fade_h = H
        fade = Image.new("L", (1, fade_h))
        for y in range(fade_h):
            t = y / (fade_h - 1)
            fade.putpixel((0, y), int(255 * min(1, max(0, (t - 0.10) / 0.50)) ** 1.1))
        bg.paste(Image.new("RGB", (W, fade_h), CREAM_TOP), (0, 0), fade.resize((W, fade_h)))
        img = bg

        d = ImageDraw.Draw(img, "RGBA")

        # --- 通し番号ピル（右上） ---
        ep_txt = f"EP.{num}"
        ep_f = font(F8, 46)
        ew = d.textlength(ep_txt, font=ep_f)
        d.rounded_rectangle((W - 74 - ew - 60, 92, W - 74 + 34, 92 + 84), radius=42,
                            fill=(255, 255, 255, 225), outline=(240, 190, 100, 255), width=4)
        d.text((W - 74 - ew / 2 - 13, 92 + 42), ep_txt, font=ep_f, fill=GOLD_DARK, anchor="mm")

        # --- バッジ ---
        badge_f = font(F8, 46)
        badge_txt = "40秒でわかる 愛知の入試"
        tw = d.textlength(badge_txt, font=badge_f)
        rounded(d, (60, 92, 60 + tw + 76, 92 + 84), 42, ORANGE)
        d.text((60 + 38, 92 + 42), badge_txt, font=badge_f, fill="white", anchor="lm")

        # --- カテゴリピル ---
        y = 402
        cat_f = font(F8, 48)
        cw = d.textlength(cat, font=cat_f)
        rounded(d, (64, y, 64 + cw + 64, y + 84), 42, (255, 243, 216, 255))
        d.rectangle((64, y, 64 + cw + 64, y + 84), outline=(246, 200, 120, 255), width=3, )
        d.rounded_rectangle((64, y, 64 + cw + 64, y + 84), radius=42, outline=(246, 200, 120, 255), width=3)
        d.text((64 + 32, y + 42), cat, font=cat_f, fill=GOLD_DARK, anchor="lm")
        d.text((64 + cw + 96, y + 42), "シャチフク先輩の40秒講義", font=font(F6, 40), fill=BROWN_SOFT, anchor="lm")

        # --- メインコピー ---
        ty = y + 112
        for line in headline.split("\n"):
            fs = 112
            while fs > 78 and d.textlength(line, font=font(F8, fs)) > W - 132:
                fs -= 2
            d.text((64, ty), line, font=font(F8, fs), fill=BROWN)
            ty += 142

        # --- キャラクター（右下・円形）: 位置を先に確定し、本文が重ならない幅で折り返す ---
        size = 500
        px, py = W - size - 56, H - size - 440

        # --- サブコピー（明示改行を尊重し、キャラの手前まで） ---
        sub_f = font(F6, 48)
        max_w = px - 100
        for i, ln in enumerate(sub.split("\n")):
            if d.textlength(ln, font=sub_f) > max_w:
                print("  WARN long sub:", num, ln, round(d.textlength(ln, font=sub_f)))
            d.text((68, ty + 26 + i * 66), ln, font=sub_f, fill=BROWN_SOFT)

        av = face.resize((size, size), Image.LANCZOS)
        mask = Image.new("L", (size, size), 0)
        ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)
        # 後光
        glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow)
        gd.ellipse((px - 40, py - 40, px + size + 40, py + size + 40), fill=(255, 214, 140, 150))
        img.paste(glow.filter(ImageFilter.GaussianBlur(40)), (0, 0), glow.filter(ImageFilter.GaussianBlur(40)))
        d.ellipse((px - 14, py - 14, px + size + 14, py + size + 14), fill=(255, 255, 255, 255))
        d.ellipse((px - 14, py - 14, px + size + 14, py + size + 14), outline=(240, 190, 100, 255), width=6)
        img.paste(av, (px, py), mask)

        # --- 下部バンド ---
        band_y = H - 320
        d.rounded_rectangle((52, band_y, W - 52, band_y + 132), radius=40, fill=(74, 44, 10, 235))
        d.text((100, band_y + 66), "尾張・名古屋 高校進学ナビ", font=font(F8, 46), fill=(255, 243, 216), anchor="lm")
        d.text((W - 100, band_y + 66), "シャチフク先輩", font=font(F6, 40), fill=(246, 200, 120), anchor="rm")

        # --- 保存 ---
        site = img.resize((720, 1280), Image.LANCZOS)
        site.save(os.path.join(OUT, f"thumb_{num}.webp"), quality=86, method=6)
        img.save(os.path.join(OUT, f"yt_thumb_{num}.jpg"), quality=90, optimize=True, progressive=True)
        print("OK", num, cat, vid)


if __name__ == "__main__":
    main()
