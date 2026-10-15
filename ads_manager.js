/**
 * 尾張・名古屋地区 高校進学ナビ
 * 広告・アフィリエイト自動配信＆空き地救済マネージャー (ads_manager.js)
 * 
 * 主な機能:
 * 1. A8.net提携済みバナーの動的ローテーション配信
 * 2. Google AdSense審査中・未配信時の自動フォールバック（空き地の完全ゼロ化）
 * 3. ネイティブインフィード広告カードの自動生成とリンク補完
 */

const A8_ADS_CONFIG = {
  // A8.net 案件プール
  items: [
    {
      id: "study_general",
      title: "高校受験・内申点アップ＆合格戦略サポート",
      desc: "愛知・尾張の志望校合格に向けた効率的な学習法・定期テスト対策・最新入試情報。",
      linkUrl: "https://px.a8.net/svt/ejp?a8mat=4BE70L+662RQI+36T2+TYQVL",
      imgUrl: "https://www29.a8.net/svt/bgt?aid=261002757373&wid=004&eno=01&mid=s00000014879005033000&mc=1",
      trackUrl: "https://www12.a8.net/0.gif?a8mat=4BE70L+662RQI+36T2+TYQVL",
      width: 300,
      height: 250,
      badge: "🎓 おすすめ進学・学習支援",
      ctaText: "公式プログラム・無料体験を見る ↗"
    },
    {
      id: "exam_prep",
      title: "愛知県公立マーク式入試＆私立難関対策",
      desc: "出題傾向を徹底分析！苦手教科を克服し、入試本番で80点以上を狙う実践トレーニング。",
      linkUrl: "https://px.a8.net/svt/ejp?a8mat=4BE70L+69NDD6+320A+BXIYP",
      imgUrl: "https://www29.a8.net/svt/bgt?aid=261002757379&wid=004&eno=01&mid=s00000014257002004000&mc=1",
      trackUrl: "https://www19.a8.net/0.gif?a8mat=4BE70L+69NDD6+320A+BXIYP",
      width: 468,
      height: 60,
      badge: "✏️ 中2・中3向け 入試対策特設",
      ctaText: "最新の学習サポートを見る ↗"
    },
    {
      id: "naishin_focus",
      title: "内申点35の壁を突破！定期テスト75点死守法",
      desc: "主要5教科はもちろん、実技4教科でオール4以上をキープするための学習習慣。",
      linkUrl: "https://px.a8.net/svt/ejp?a8mat=4BE70L+662RQI+36T2+TYQVL",
      imgUrl: "https://www29.a8.net/svt/bgt?aid=261002757373&wid=004&eno=01&mid=s00000014879005033000&mc=1",
      trackUrl: "https://www12.a8.net/0.gif?a8mat=4BE70L+662RQI+36T2+TYQVL",
      width: 300,
      height: 250,
      badge: "🔥 内申点アップ特集",
      ctaText: "内申対策の進め方を見る ↗"
    }
  ]
};

// インフィード広告カードのHTMLを生成
function generateInfeedCardHtml(index) {
  const ad = A8_ADS_CONFIG.items[index % A8_ADS_CONFIG.items.length];
  return `
    <div>
      <div class="ad-infeed-badge-row">
        <span class="ad-infeed-badge">${ad.badge}</span>
        <span class="ad-sponsor-label">スポンサーPR</span>
      </div>
      <div class="ad-infeed-title">${ad.title}</div>
      <div class="ad-infeed-desc">${ad.desc}</div>
      <div class="ad-infeed-body">
        <div style="display: flex; justify-content: center; align-items: center; margin: 6px 0;">
          <a href="${ad.linkUrl}" target="_blank" rel="nofollow noopener">
            <img border="0" width="${ad.width}" height="${ad.height}" alt="${ad.title}" src="${ad.imgUrl}" style="max-width: 100%; height: auto; border-radius: 10px; box-shadow: 0 3px 12px rgba(0,0,0,0.06);">
          </a>
          <img border="0" width="1" height="1" src="${ad.trackUrl}" alt="" style="display:none;">
        </div>
      </div>
    </div>
    <div style="margin-top: 10px;">
      <a href="${ad.linkUrl}" target="_blank" rel="nofollow noopener" style="display: block; width: 100%; text-align: center; background: #FFFDF9; border: 1.5px solid var(--accent); color: var(--accent); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; font-weight: 800; text-decoration: none; transition: all 0.2s;">
        ${ad.ctaText}
      </a>
      <div style="font-size: 0.68rem; color: #94A3B8; text-align: center; margin-top: 4px;">
        ※A8.net提携アフィリエイトプログラムによる学習サポート特集
      </div>
    </div>
  `;
}

// テーブル内スポンサー行のHTMLを生成
function generateInfeedTableRowHtml(index) {
  const ad = A8_ADS_CONFIG.items[1]; // 468x60
  return `
    <td colspan="8" style="padding: 18px 16px; border: 1.5px dashed var(--accent-border); background: #FFFDF9;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span class="ad-infeed-badge">${ad.badge}</span>
        <span class="ad-sponsor-label">PR・広告</span>
      </div>
      <div style="display: flex; justify-content: center; align-items: center; gap: 16px; flex-wrap: wrap; margin: 6px 0;">
        <a href="${ad.linkUrl}" target="_blank" rel="nofollow noopener">
          <img border="0" width="${ad.width}" height="${ad.height}" alt="${ad.title}" src="${ad.imgUrl}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
        </a>
        <img border="0" width="1" height="1" src="${ad.trackUrl}" alt="" style="display:none;">
      </div>
      <div style="font-size: 0.8rem; color: #64748B; text-align: center; margin-top: 4px;">
        ${ad.title} - ${ad.desc}
      </div>
    </td>
  `;
}

// ページ内の未配信AdSense枠を自動検出してA8バナーで埋めるフォールバック処理
function fillEmptyAdSlots() {
  document.querySelectorAll(".ad-banner-wrapper").forEach((wrapper, idx) => {
    // もしすでにA8バナー画像が存在しているかチェック
    const hasA8Img = wrapper.querySelector("img[src*='a8.net']");
    if (!hasA8Img) {
      const ad = A8_ADS_CONFIG.items[idx % A8_ADS_CONFIG.items.length];
      const fallbackDiv = document.createElement("div");
      fallbackDiv.style.margin = "10px 0";
      fallbackDiv.style.textAlign = "center";
      fallbackDiv.innerHTML = `
        <a href="${ad.linkUrl}" target="_blank" rel="nofollow noopener">
          <img border="0" width="${ad.width}" height="${ad.height}" alt="${ad.title}" src="${ad.imgUrl}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
        </a>
        <img border="0" width="1" height="1" src="${ad.trackUrl}" alt="" style="display:none;">
      `;
      wrapper.appendChild(fallbackDiv);
    }
  });
}

// ページ読み込み完了時に自動実行
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    fillEmptyAdSlots();
  });
}
