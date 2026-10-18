#!/usr/bin/env python3
"""
scripts/shorts/shachifuku_shorts_engine.py - シャチフク先輩 先生風 Google Vidsスタイル 縦型ショート動画エンジン v2

特長:
1. 【1.7倍特大フォント】スマホの小さな画面でも圧倒的な視認性（110px超の巨大テロップ・Noto Sans JP Black/Bold採用）
2. 【Google Vids風モダン教育デザイン】ダークインディゴ×グラスモーフィズム×ゴールド＆シアン発光アクセント
3. 【シャチフク先輩 先生風キャラクター】熱血で親しみやすい講師風Keitaボイス（pitch=+3Hz, rate=+20%）＆特大アバター
4. 【豆腐文字完全防止】絵文字を排除し、美しく洗練された日本語タイポグラフィ
5. 【動的文字折り返し＆枠収まり最適化】大文字でも絶対に見切れない緻密な描画計算
"""

import os
import sys
import json
import asyncio
import subprocess
import edge_tts
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FONT_DIR = os.path.join(BASE_DIR, "fonts")
FONT_BLACK = os.path.join(FONT_DIR, "NotoSansJP-Black.ttf")
FONT_BOLD = os.path.join(FONT_DIR, "NotoSansJP-Bold.ttf")

WIDTH = 1080
HEIGHT = 1920
SAFE_MARGIN = 64
CONTENT_WIDTH = WIDTH - (SAFE_MARGIN * 2)  # 952px

# ボイス設定 (シャチフク先輩 先生風)
VOICE_CONFIG = {
    "voice": "ja-JP-KeitaNeural",
    "pitch": "+3Hz",
    "rate": "+20%"
}

def get_font_black(size: int):
    if os.path.exists(FONT_BLACK):
        return ImageFont.truetype(FONT_BLACK, size)
    return ImageFont.load_default()

def get_font_bold(size: int):
    if os.path.exists(FONT_BOLD):
        return ImageFont.truetype(FONT_BOLD, size)
    return ImageFont.load_default()

def wrap_text_to_width(text: str, font: ImageFont.FreeTypeFont, max_width: int, draw: ImageDraw.ImageDraw):
    lines = []
    current_line = ""
    for char in text:
        test_line = current_line + char
        w = draw.textlength(test_line, font=font)
        if w <= max_width:
            current_line = test_line
        else:
            if current_line:
                lines.append(current_line)
            current_line = char
    if current_line:
        lines.append(current_line)
    return lines

def get_fitted_font(text: str, target_size: int, max_width: int, draw: ImageDraw.ImageDraw, is_black=True, min_size=50):
    size = target_size
    while size >= min_size:
        font = get_font_black(size) if is_black else get_font_bold(size)
        if draw.textlength(text, font=font) <= max_width:
            return font
        size -= 4
    return get_font_black(min_size) if is_black else get_font_bold(min_size)

def get_audio_duration(file_path: str) -> float:
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        file_path
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    try:
        return float(res.stdout.strip())
    except ValueError:
        return 4.0

async def generate_speech(text: str, output_path: str):
    communicate = edge_tts.Communicate(
        text,
        VOICE_CONFIG["voice"],
        pitch=VOICE_CONFIG["pitch"],
        rate=VOICE_CONFIG["rate"]
    )
    await communicate.save(output_path)

def create_gradient_bg(width: int, height: int, top_color=(10, 15, 30), bottom_color=(18, 25, 45)):
    """Google Vids風の高級感あるディープインディゴグラデーション背景"""
    base = Image.new("RGBA", (width, height), top_color)
    draw = ImageDraw.Draw(base)
    r1, g1, b1 = top_color
    r2, g2, b2 = bottom_color
    for y in range(height):
        factor = y / height
        r = int(r1 + (r2 - r1) * factor)
        g = int(g1 + (g2 - g1) * factor)
        b = int(b1 + (b2 - b1) * factor)
        draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
    return base

def draw_round_avatar(img: Image.Image, avatar_path: str, x: int, y: int, size: int):
    """シャチフク先輩アバターを円形に綺麗にくり抜いてゴールド枠付きで描画"""
    draw = ImageDraw.Draw(img)
    if not os.path.exists(avatar_path):
        draw.ellipse([(x, y), (x + size, y + size)], fill=(245, 158, 11, 255))
        return

    orig = Image.open(avatar_path).convert("RGBA")
    # 元画像の角丸外枠を落とすため、少し中心をクロップ（インセット6%）
    ow, oh = orig.size
    inset_x = int(ow * 0.06)
    inset_y = int(oh * 0.06)
    cropped = orig.crop((inset_x, inset_y, ow - inset_x, oh - inset_y)).resize((size, size), Image.Resampling.LANCZOS)

    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse((0, 0, size, size), fill=255)
    img.paste(cropped, (x, y), mask)

    # 先生風ゴールド＆シアン二重枠
    draw.ellipse([(x, y), (x + size, y + size)], outline=(245, 158, 11, 255), width=8)
    draw.ellipse([(x - 6, y - 6), (x + size + 6, y + size + 6)], outline=(56, 189, 248, 180), width=3)

def create_title_card_image(data: dict, avatar_path: str, output_path: str):
    """冒頭インパクトタイトルカード（1.7倍特大フォント＆Google Vidsスタイル）"""
    img = create_gradient_bg(WIDTH, HEIGHT, (8, 12, 24), (18, 26, 46))
    draw = ImageDraw.Draw(img)

    # 1. 先生講義バッジ (52px)
    badge_text = data.get("intro_badge", "【集中講義】シャチフク先輩の入試攻略")
    badge_font = get_font_black(50)
    badge_w = int(draw.textlength(badge_text, font=badge_font)) + 70
    badge_x = (WIDTH - badge_w) // 2
    draw.rounded_rectangle([(badge_x, 90), (badge_x + badge_w, 195)], radius=50, fill=(217, 119, 6, 245), outline=(253, 230, 138, 200), width=4)
    draw.text((badge_x + 35, 114), badge_text, font=badge_font, fill=(255, 255, 255, 255))

    # 2. 中央: シャチフク先輩 特大アイコン (270px)
    avatar_size = 270
    avatar_x = (WIDTH - avatar_size) // 2
    avatar_y = 230
    draw_round_avatar(img, avatar_path, avatar_x, avatar_y, avatar_size)

    # 3. 画面中央いっぱいの巨大タイトル（1.7倍 115px〜122px Noto Sans JP Black）
    hook_lines = data.get("intro_hook_lines", [
        "内申が足りない？",
        "諦めるのはまだ早い！",
        "当日点2倍の逆転ルール！"
    ])

    cur_y = 560
    colors = [
        ((255, 255, 255), (15, 23, 42)),   # 白
        ((254, 240, 138), (120, 53, 15)),  # ビビッドイエロー
        ((56, 189, 248), (12, 74, 110)),   # エレクトリックシアン
    ]

    for idx, line in enumerate(hook_lines):
        line_font = get_fitted_font(line, 116, CONTENT_WIDTH - 40, draw, is_black=True, min_size=70)
        text_w = int(draw.textlength(line, font=line_font))
        text_h = 138

        box_x0 = (WIDTH - text_w - 60) // 2
        box_y0 = cur_y
        box_x1 = box_x0 + text_w + 60
        box_y1 = box_y0 + text_h

        # Google Vids風のハイライト背景プレート
        plate_color = (28, 38, 58, 235)
        draw.rounded_rectangle([(box_x0, box_y0), (box_x1, box_y1)], radius=26, fill=plate_color, outline=(255, 255, 255, 50), width=2)

        tc, shadow_c = colors[idx % len(colors)]
        draw.text(((WIDTH - text_w) // 2 + 5, cur_y + 18), line, font=line_font, fill=shadow_c)
        draw.text(((WIDTH - text_w) // 2, cur_y + 14), line, font=line_font, fill=tc)
        cur_y += 160

    # 4. 中間サブキャッチカード（Google Vidsスタイル）
    sub_text = data.get("intro_subcatch", "愛知県公立高校 複合選抜・逆転の法則")
    sub_font = get_font_bold(44)
    sub_w = int(draw.textlength(sub_text, font=sub_font)) + 50
    sub_x = (WIDTH - sub_w) // 2
    draw.rounded_rectangle([(sub_x, 1160), (sub_x + sub_w, 1245)], radius=20, fill=(30, 41, 59, 200), outline=(56, 189, 248, 120), width=2)
    draw.text((sub_x + 25, 1180), sub_text, font=sub_font, fill=(186, 230, 253, 255))

    # 5. 最下部CTA（先生風 58px）
    cta_font = get_font_black(54)
    cta_text = "▼ シャチフク先生が40秒で伝授！"
    cta_w = int(draw.textlength(cta_text, font=cta_font))
    cta_box_w = cta_w + 80
    cta_x0 = (WIDTH - cta_box_w) // 2
    draw.rounded_rectangle([(cta_x0, 1660), (cta_x0 + cta_box_w, 1785)], radius=36, fill=(239, 68, 68, 250), outline=(254, 202, 202, 220), width=4)
    draw.text(((WIDTH - cta_w) // 2, 1692), cta_text, font=cta_font, fill=(255, 255, 255, 255))

    img.convert("RGB").save(output_path, "PNG")

def create_scene_image(scene: dict, scene_idx: int, total_scenes: int, avatar_path: str, output_path: str):
    """Google Vids風のスタイリッシュな講義シーン（文字1.7倍特大化）"""
    img = create_gradient_bg(WIDTH, HEIGHT, (9, 14, 28), (17, 24, 42))
    draw = ImageDraw.Draw(img)

    # 1. 講義バッジ (48px)
    badge_text = scene.get("badge", f"【第{scene_idx}講】")
    badge_font = get_font_black(46)
    badge_w = int(draw.textlength(badge_text, font=badge_font)) + 50
    draw.rounded_rectangle([(SAFE_MARGIN, 60), (SAFE_MARGIN + badge_w, 142)], radius=38, fill=(217, 119, 6, 240), outline=(253, 230, 138, 160), width=3)
    draw.text((SAFE_MARGIN + 25, 76), badge_text, font=badge_font, fill=(255, 255, 255, 255))

    # 2. ヘッダー大見出し（1.7倍 110px Noto Sans JP Black）
    header_text = scene.get("header", "")
    h_font = get_fitted_font(header_text, 108, CONTENT_WIDTH, draw, is_black=True, min_size=60)
    draw.text((SAFE_MARGIN + 4, 166), header_text, font=h_font, fill=(0, 0, 0, 240))
    draw.text((SAFE_MARGIN, 162), header_text, font=h_font, fill=(254, 240, 138, 255))

    # 3. Google Vids風 メイン講義スクリーンカード
    card_x0 = SAFE_MARGIN
    card_y0 = 300
    card_x1 = WIDTH - SAFE_MARGIN
    card_y1 = 1250
    card_w = card_x1 - card_x0

    # スタイリッシュなダークグラスボード
    draw.rounded_rectangle(
        [(card_x0, card_y0), (card_x1, card_y1)],
        radius=40,
        fill=(22, 31, 48, 240),
        outline=(56, 189, 248, 140),
        width=4
    )

    # カードタイトル（1.6倍 80px）
    card_title = scene.get("card_title", "")
    ctitle_font = get_fitted_font(card_title, 78, card_w - 70, draw, is_black=True, min_size=50)
    draw.text((card_x0 + 35, card_y0 + 32), card_title, font=ctitle_font, fill=(56, 189, 248, 255))
    draw.line([(card_x0 + 35, card_y0 + 130), (card_x1 - 35, card_y0 + 130)], fill=(255, 255, 255, 60), width=3)

    # 箇条書きポイント（1.6倍 60px + 自動ラップ）
    points = scene.get("card_points", [])
    pt_font = get_font_bold(58)
    cur_y = card_y0 + 160
    max_pt_width = card_w - 70

    for pt in points:
        wrapped_lines = wrap_text_to_width(pt, pt_font, max_pt_width, draw)
        for line in wrapped_lines:
            draw.text((card_x0 + 38, cur_y + 3), line, font=pt_font, fill=(0, 0, 0, 200))
            draw.text((card_x0 + 35, cur_y), line, font=pt_font, fill=(255, 255, 255, 255))
            cur_y += 82
        cur_y += 24

    # 4. 下部: シャチフク先輩 先生アバター (230px) ＆ セリフ吹き出し
    avatar_x, avatar_y = SAFE_MARGIN, 1285
    avatar_size = 220
    draw_round_avatar(img, avatar_path, avatar_x, avatar_y, avatar_size)

    # セリフ吹き出しカード
    bubble_x0 = SAFE_MARGIN + avatar_size + 20
    bubble_y0 = 1285
    bubble_x1 = WIDTH - SAFE_MARGIN
    bubble_y1 = 1770
    bubble_w = bubble_x1 - bubble_x0

    draw.rounded_rectangle(
        [(bubble_x0, bubble_y0), (bubble_x1, bubble_y1)],
        radius=32,
        fill=(255, 255, 255, 250),
        outline=(245, 158, 11, 240),
        width=5
    )

    # 先生ラベル (40px)
    name_font = get_font_black(38)
    draw.text((bubble_x0 + 26, bubble_y0 + 18), "シャチフク先輩（先生風）", font=name_font, fill=(180, 83, 9, 255))

    # セリフテキスト（1.6倍 58px + 自動ラップ、行間76px）
    narration_text = scene.get("narration", "")
    serif_font = get_font_bold(56)
    serif_max_w = bubble_w - 50
    serif_lines = wrap_text_to_width(narration_text, serif_font, serif_max_w, draw)

    line_y = bubble_y0 + 82
    for l in serif_lines:
        draw.text((bubble_x0 + 26, line_y), l, font=serif_font, fill=(15, 23, 42, 255))
        line_y += 76

    # 5. 最下部フッター
    footer_font = get_font_bold(34)
    draw.text((SAFE_MARGIN, 1805), "愛知県高校受験進学ナビ ｜ aichi-highschool.jp", font=footer_font, fill=(148, 163, 184, 255))

    img.convert("RGB").save(output_path, "PNG")

def build_scene_video(img_path: str, audio_path: str, se_path: str, duration: float, out_video: str):
    total_dur = duration + 0.15
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", img_path,
        "-i", audio_path,
    ]
    if os.path.exists(se_path):
        cmd.extend([
            "-i", se_path,
            "-filter_complex",
            f"[1:a]volume=1.0[a1];[2:a]volume=0.35[a2];[a1][a2]amix=inputs=2:duration=first[aout]",
            "-map", "0:v",
            "-map", "[aout]"
        ])
    else:
        cmd.extend(["-map", "0:v", "-map", "1:a"])

    cmd.extend([
        "-c:v", "libx264",
        "-tune", "stillimage",
        "-c:a", "aac",
        "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        "-t", f"{total_dur:.2f}",
        out_video
    ])
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

async def main():
    script_path = os.path.join(BASE_DIR, "shachifuku_shorts_script.json")
    if len(sys.argv) > 1:
        script_path = sys.argv[1]

    with open(script_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    temp_dir = os.path.join(BASE_DIR, "temp", data.get("id", "shachifuku_shorts"))
    output_dir = os.path.join(BASE_DIR, "output")
    os.makedirs(temp_dir, exist_ok=True)
    os.makedirs(output_dir, exist_ok=True)

    avatar_path = os.path.join(BASE_DIR, "assets", "shachifuku.png")
    beep_se = os.path.join(BASE_DIR, "assets", "beep.wav")
    impact_se = os.path.join(BASE_DIR, "assets", "impact.wav")

    print(f"🎬 シャチフク先輩 Google Vids風 特大フォントShorts動画 生成開始: {data.get('title')}")
    print(f"🎙️ ボイス: [{VOICE_CONFIG['voice']}] シャチフク先生（pitch={VOICE_CONFIG['pitch']}, rate={VOICE_CONFIG['rate']}）")

    video_parts = []

    # 1. オープニングタイトルカード
    intro_img = os.path.join(temp_dir, "slide_intro.png")
    intro_audio = os.path.join(temp_dir, "audio_intro.mp3")
    intro_vid = os.path.join(temp_dir, "scene_intro.mp4")

    print("  [0] オープニング特大タイトルカード生成中...")
    create_title_card_image(data, avatar_path, intro_img)
    await generate_speech(data.get("intro_call", "内申点が足りないからって諦めるな！愛知公立高校の逆転ルールを、シャチフク先輩が徹底解説するぞ！"), intro_audio)
    intro_dur = get_audio_duration(intro_audio)
    build_scene_video(intro_img, intro_audio, impact_se, intro_dur, intro_vid)
    video_parts.append(intro_vid)

    # 2. 本編シーン
    scenes = data.get("scenes", [])
    for idx, sc in enumerate(scenes):
        print(f"  [{idx+1}/{len(scenes)}] 本編講義シーン生成中: {sc.get('header')}")
        s_img = os.path.join(temp_dir, f"slide_{idx}.png")
        s_audio = os.path.join(temp_dir, f"audio_{idx}.mp3")
        s_vid = os.path.join(temp_dir, f"scene_{idx}.mp4")

        create_scene_image(sc, idx+1, len(scenes), avatar_path, s_img)
        await generate_speech(sc.get("narration", ""), s_audio)
        dur = get_audio_duration(s_audio)
        build_scene_video(s_img, s_audio, beep_se, dur, s_vid)
        video_parts.append(s_vid)

    # 3. 結合
    concat_txt = os.path.join(temp_dir, "concat.txt")
    with open(concat_txt, "w") as f:
        for vp in video_parts:
            f.write(f"file '{vp}'\n")

    final_out = os.path.join(output_dir, f"{data.get('id', 'shachifuku_shorts')}.mp4")
    print("🔄 全講義シーンを連結中...")
    subprocess.run([
        "ffmpeg", "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", concat_txt,
        "-c", "copy",
        final_out
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    final_dur = get_audio_duration(final_out)
    size_mb = os.path.getsize(final_out) / (1024 * 1024)

    print("=" * 66)
    print("🎉 シャチフク先輩 特大フォント＆Google Vidsスタイル Shorts動画が完成！")
    print(f"📁 出力先: {final_out}")
    print(f"⏱️ 長さ: {final_dur:.1f} 秒")
    print(f"📦 サイズ: {size_mb:.2f} MB")
    print("🎨 フォント: Noto Sans JP (1.7倍特大スケール)")
    print("🎙️ キャラ: シャチフク先輩（先生風）")
    print("=" * 66)

if __name__ == "__main__":
    asyncio.run(main())
