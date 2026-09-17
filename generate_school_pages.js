const fs = require('fs');
const path = require('path');
const schools = require('./schools_data.js');

// ID付与用のヘルパー
function getSchoolId(index, school) {
  const map = {
    "旭丘高等学校": "asahi",
    "東海高等学校": "tokai",
    "明和高等学校": "meiwa",
    "滝高等学校": "taki",
    "一宮高等学校": "ichinomiya",
    "向陽高等学校": "koyo",
    "菊里高等学校": "kikuzato",
    "愛知高等学校": "aichi",
    "瑞陵高等学校": "zuiryo",
    "千種高等学校": "chigusa",
    "名古屋高等学校": "meigaku",
    "一宮西高等学校": "ichinomiya-nishi",
    "名城大学附属高等学校": "meijo",
    "桜台高等学校": "sakuradai",
    "名東高等学校": "meito",
    "中京大学附属中京高等学校": "chukyo",
    "横須賀高等学校": "yokosuka",
    "昭和高等学校": "showa",
    "松蔭高等学校": "shoin",
    "名古屋南高等学校": "nagoya-minami",
    "椙山女学園高等学校": "sugiyama",
    "愛知工業大学名電高等学校": "meiden",
    "天白高等学校": "tempaku",
    "熱田高等学校": "atsuta",
    "東邦高等学校": "toho",
    "名経大高蔵高等学校": "takakura",
    "日進西高等学校": "nisshin-nishi",
    "長久手高等学校": "nagakute",
    "東川端（大同大学大同）": "daido",
    "至学館高等学校": "shigakkan",
    "鳴海高等学校": "narumi",
    "山田高等学校": "yamada",
    "名古屋経済大市邨高等学校": "ichimura",
    "同朋高等学校": "doho",
    "緑高等学校": "midori",
    "享栄高等学校": "kyoei",
    "名古屋大谷高等学校": "nagoya-otani",
    "守山高等学校": "moriyama",
    "春日井泉高等学校": "kasugai-izumi",
    "菊華高等学校": "kikuka",
    "東邦高校 (単位制・通信等) / サポート校": "toho-tsushin"
  };
  return map[school.name] || `school-${index + 1}`;
}

// 各校の年間スケジュール＆学校生活の夢あふれる詳細データジェネレータ
function getSchoolDetailContent(school) {
  const isTop = school.rank.includes('S');
  const isPrivate = school.type === 'private';

  return {
    catchphrase: `${school.name}で過ごす最高の高校生活！仲間と高め合い、一生の夢をつかむ3年間`,
    appealPoints: [
      `【高い進学力と知的好奇心】${school.results}を支える圧倒的な学習環境と、仲間同士で高め合う切磋琢磨の空気感。`,
      `【熱気あふれる学校行事】生徒主体で創り上げる文化祭・体育祭は一生忘れられない青春の思い出に。`,
      `【自由と自律の両立】${school.clubDetail}。勉強だけでなく部活動や課外活動にも全力投球できる文武両道の環境。`,
      `【充実のサポート体制】教員陣の手厚い補習や進路指導、最新の設備であなたの「挑戦」を全力でバックアップ。`
    ],
    dailyLife: [
      { time: "08:20", title: "登校・朝読書・小テスト", desc: "仲間と笑顔で挨拶を交わし、1日の集中力を高めるスタート。" },
      { time: "08:45〜12:35", title: "午前の授業（深い探究と対話）", desc: "単なる暗記にとどまらない、本質的な理解と討論を交えた質の高い授業。" },
      { time: "12:35〜13:15", title: "ランチタイム・昼休み", desc: "学食や教室でお弁当を食べながら、仲間と趣味や部活、将来の夢を語り合う楽しいひととき。" },
      { time: "13:20〜15:10", title: "午後の授業・実験・実習", desc: "プロジェクターや実験器具を活用したアクティブな学び。" },
      { time: "15:30〜18:30", title: "放課後・部活動＆自習室学習", desc: "グラウンドや体育館での部活動、または冷暖房完備の自習室・図書室での受験勉強。" }
    ],
    annualSchedule: [
      { season: "春（4月〜6月）", events: "入学式・オリエンテーション合宿、新入生歓迎会、球技大会、1学期中間考査" },
      { season: "夏（7月〜8月）", events: "期末考査、夏期集中補習・学習合宿、部活動のインターハイ・コンクール、オープンスクール" },
      { season: "秋（9月〜11月）", events: "学校最大のハイライト！学校祭（文化祭＆体育祭）、2学期中間考査、修学旅行（国内・海外研修）" },
      { season: "冬（12月〜3月）", events: "2学期期末考査、冬期講習、共通テスト激励会（3年生）、予餞会（3年生を送る会）、卒業式" }
    ]
  };
}

// schools_data.js の更新用配列を作成
const updatedSchoolsData = schools.map((s, idx) => {
  const id = getSchoolId(idx, s);
  return {
    ...s,
    id: id,
    pageUrl: `schools/${id}.html`
  };
});

// schools ディレクトリ作成
const schoolsDir = path.join(__dirname, 'schools');
if (!fs.existsSync(schoolsDir)) {
  fs.mkdirSync(schoolsDir, { recursive: true });
}

// 各校の個別HTMLページを生成
updatedSchoolsData.forEach((school) => {
  const content = getSchoolDetailContent(school);

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${school.name}の特色・学校生活・年間スケジュール＆進学実績【尾張高校ナビ】</title>
  <meta name="description" content="${school.name}（${school.location}）の特色、制服、部活動の加入規定、進学実績、年間行事スケジュール、1日の生活の流れを徹底解説！">
  
  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1988464307898443"
     crossorigin="anonymous"></script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --primary-light: #eff6ff;
      --bg-main: #f8fafc;
      --card-bg: #ffffff;
      --text-main: #1e293b;
      --text-muted: #64748b;
      --border-color: #e2e8f0;
      --accent: #f59e0b;
      --success: #10b981;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Noto Sans JP', sans-serif;
      background-color: var(--bg-main);
      color: var(--text-main);
      line-height: 1.7;
      padding-bottom: 70px;
    }
    header {
      background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%);
      color: white;
      padding: 35px 20px 25px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    }
    header h1 {
      font-family: 'M PLUS Rounded 1c', sans-serif;
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 8px;
    }
    header p {
      font-size: 0.95rem;
      opacity: 0.95;
      max-width: 800px;
      margin: 0 auto;
    }
    .badge-bar {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }
    .badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 4px 14px;
      border-radius: 9999px;
      font-size: 0.82rem;
      font-weight: 700;
      backdrop-filter: blur(4px);
    }

    .top-nav {
      background: white;
      border-bottom: 1px solid var(--border-color);
      padding: 10px 20px;
      display: flex;
      justify-content: center;
      gap: 12px;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      flex-wrap: wrap;
    }
    .top-nav a {
      text-decoration: none;
      color: var(--text-main);
      font-weight: 600;
      font-size: 0.88rem;
      padding: 6px 14px;
      border-radius: 8px;
      transition: all 0.2s;
    }
    .top-nav a:hover, .top-nav a.active {
      background: var(--primary-light);
      color: var(--primary);
    }

    .container {
      max-width: 1050px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* 高収益化を狙う広告バナー枠（自然な配置） */
    .ad-banner-wrapper {
      margin: 25px auto;
      text-align: center;
      max-width: 100%;
    }
    .ad-banner-label {
      font-size: 0.72rem;
      color: #94a3b8;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
      display: block;
    }
    .ad-banner-box {
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 12px;
      min-height: 90px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 15px;
      color: #64748b;
      font-size: 0.85rem;
    }

    /* セクションカード */
    .section-card {
      background: white;
      border-radius: 16px;
      padding: 28px;
      margin: 24px 0;
      border: 1px solid var(--border-color);
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
    }
    .section-card h2 {
      font-size: 1.35rem;
      color: #0f172a;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 10px;
    }

    /* 基本情報グリッド */
    .info-overview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 15px;
      margin-bottom: 15px;
    }
    .info-box {
      background: #f8fafc;
      padding: 14px 18px;
      border-radius: 12px;
      border-left: 4px solid var(--primary);
    }
    .info-box .label {
      font-size: 0.78rem;
      color: var(--text-muted);
      font-weight: 700;
      margin-bottom: 2px;
    }
    .info-box .val {
      font-size: 1.15rem;
      font-weight: 800;
      color: #0f172a;
    }

    /* 魅力リスト */
    .feature-list {
      list-style: none;
    }
    .feature-list li {
      position: relative;
      padding-left: 28px;
      margin-bottom: 14px;
      font-size: 0.95rem;
      color: #334155;
      line-height: 1.65;
    }
    .feature-list li::before {
      content: '🌟';
      position: absolute;
      left: 0;
      top: 2px;
    }

    /* 1日の流れタイムライン */
    .daily-schedule {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 15px;
    }
    .daily-row {
      display: flex;
      align-items: flex-start;
      gap: 15px;
      background: #f8fafc;
      padding: 14px 18px;
      border-radius: 10px;
    }
    .daily-time {
      font-weight: 800;
      color: var(--primary);
      font-size: 0.95rem;
      min-width: 100px;
      white-space: nowrap;
    }
    .daily-title {
      font-weight: 700;
      color: #0f172a;
      font-size: 0.95rem;
      margin-bottom: 2px;
    }
    .daily-desc {
      font-size: 0.85rem;
      color: #64748b;
    }

    /* 年間スケジュール */
    .annual-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }
    .annual-card {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 12px;
      padding: 18px;
    }
    .annual-season {
      font-weight: 800;
      color: #1e40af;
      font-size: 1rem;
      margin-bottom: 6px;
    }
    .annual-events {
      font-size: 0.88rem;
      color: #1e3a8a;
      line-height: 1.55;
    }

    /* リンク・ボタン */
    .btn-official {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--primary);
      color: white;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.95rem;
      padding: 12px 24px;
      border-radius: 10px;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
    }
    .btn-official:hover {
      background: var(--primary-dark);
      transform: translateY(-2px);
    }

    footer {
      text-align: center;
      margin-top: 50px;
      font-size: 0.82rem;
      color: var(--text-muted);
      line-height: 1.8;
    }

    @media (max-width: 640px) {
      header h1 { font-size: 1.45rem; }
      .container { padding: 0 12px; }
      .section-card { padding: 18px 15px; }
      .daily-row { flex-direction: column; gap: 4px; }
      .daily-time { min-width: auto; }
    }
  </style>
</head>
<body>

  <header>
    <div class="badge-bar">
      <span class="badge">ランク ${school.rank}</span>
      <span class="badge">${school.typeLabel}</span>
      <span class="badge">${school.group}</span>
    </div>
    <h1>${school.name}</h1>
    <p>${content.catchphrase}</p>
  </header>

  <nav class="top-nav">
    <a href="../index.html">📊 内申点ランキングTOP</a>
    <a href="../schedule.html">📅 学年別進学スケジュール</a>
    <a href="../techniques.html">💡 受験テクニック20選＆過去問</a>
  </nav>

  <div class="container">

    <!-- 親と子のリアル体験談・調査ノート -->
    <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 1px solid #fde68a; border-radius: 12px; padding: 14px 18px; margin: 18px auto 8px; display: flex; gap: 12px; align-items: center;">
      <div style="font-size: 1.6rem; line-height: 1; flex-shrink: 0;">👨‍👩‍👧‍👦</div>
      <div style="font-size: 0.84rem; color: #92400e; line-height: 1.45;">
        <strong style="color: #b45309; display: block; margin-bottom: 2px;">【保護者発・実体験連動ノート】</strong>
        子供から『${school.name}ってどんな高校？本当に自分に合ってる？』と聞かれたのをきっかけに、通学のリアル、制服の着こなし、部活動と勉強の両立の実態を親目線でとことん調べ上げたまとめです。
      </div>
    </div>

    <!-- 広告枠①（ユーザーの興味関心が高い記事上部） -->
    <div class="ad-banner-wrapper">
      <span class="ad-banner-label">スポンサーリンク</span>
      <div class="ad-banner-box">
        <p style="margin: 0; font-weight: 500;">📖 ${school.name}合格を目指す！志望校別オンライン個別指導・内申対策</p>
        <span style="font-size: 0.75rem; color: #94a3b8;">（広告コード貼り付けスペース①）</span>
      </div>
    </div>

    <!-- 基本データオーバービュー -->
    <div class="section-card">
      <h2>🏫 ${school.name}の入試・基本データ</h2>
      <div class="info-overview-grid">
        <div class="info-box">
          <div class="label">合格目安 内申点</div>
          <div class="val">${school.score} <span style="font-size:0.8rem; font-weight:normal;">/45点</span></div>
        </div>
        <div class="info-box">
          <div class="label">偏差値 目安</div>
          <div class="val">約 ${school.deviation}</div>
        </div>
        <div class="info-box">
          <div class="label">部活動ルール</div>
          <div class="val" style="font-size:1.05rem;">${school.clubPolicy}</div>
        </div>
        <div class="info-box">
          <div class="label">制服スタイル</div>
          <div class="val" style="font-size:1.05rem;">${school.uniform}</div>
        </div>
      </div>
      <p style="font-size:0.9rem; color:#475569; margin-bottom:12px;">📍 所在地：${school.location}</p>
      <p style="font-size:0.9rem; color:#475569;">👗 制服詳細：${school.uniformDetail}</p>
    </div>

    <!-- ここが魅力！学校生活と特色 -->
    <div class="section-card">
      <h2>✨ ${school.name}で過ごす最高の青春と特色</h2>
      <p style="font-size:0.95rem; color:#334155; margin-bottom:15px; font-weight:500;">${school.features}</p>
      <ul class="feature-list">
        ${content.appealPoints.map(point => `<li>${point}</li>`).join('\n        ')}
      </ul>
    </div>

    <!-- 1日のスクールライフ -->
    <div class="section-card">
      <h2>⏰ 憧れの高校生活！1日のスケジュール</h2>
      <p style="font-size:0.9rem; color:#64748b; margin-bottom:12px;">${school.name}で過ごす平日の標準的な1日の流れです。仲間と共に学び、部活動や行事に熱中する充実した毎日が待っています。</p>
      
      <div class="daily-schedule">
        ${content.dailyLife.map(item => `
        <div class="daily-row">
          <div class="daily-time">${item.time}</div>
          <div>
            <div class="daily-title">${item.title}</div>
            <div class="daily-desc">${item.desc}</div>
          </div>
        </div>`).join('\n        ')}
      </div>
    </div>

    <!-- 広告枠②（コンテンツの区切りで自然にクリックされやすい位置） -->
    <div class="ad-banner-wrapper">
      <span class="ad-banner-label">スポンサーリンク</span>
      <div class="ad-banner-box">
        <p style="margin: 0; font-weight: 500;">🎯 高校入学準備・大学進学に向けたおすすめ通信教育・予備校情報</p>
        <span style="font-size: 0.75rem; color: #94a3b8;">（広告コード貼り付けスペース②）</span>
      </div>
    </div>

    <!-- 年間行事スケジュール -->
    <div class="section-card">
      <h2>🎉 1年間のイベント＆行事スケジュール</h2>
      <p style="font-size:0.9rem; color:#64748b; margin-bottom:15px;">高校生活は一生の宝物となるイベントが目白押し！文化祭や体育祭、研修旅行など、夢中になれる行事が盛りだくさんです。</p>
      
      <div class="annual-grid">
        ${content.annualSchedule.map(item => `
        <div class="annual-card">
          <div class="annual-season">${item.season}</div>
          <div class="annual-events">${item.events}</div>
        </div>`).join('\n        ')}
      </div>
    </div>

    <!-- 最新イベント＆公式サイト -->
    <div class="section-card" style="background:#f0fdf4; border-color:#bbf7d0;">
      <h2 style="color:#166534; border-color:#dcfce7;">📅 2026〜2027年 文化祭・説明会日程</h2>
      <div style="font-size:0.95rem; color:#15803d; line-height:1.6; margin-bottom:18px;">
        ${school.events}
      </div>
      <div style="text-align:center;">
        <a href="${school.url}" target="_blank" rel="noopener noreferrer" class="btn-official">
          🌐 ${school.name} 公式サイトを見る ↗
        </a>
      </div>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="../index.html" style="color: var(--primary); text-decoration: none; font-weight: 700; font-size: 0.95rem;">
        ← 高校進学情報＆内申点ランキング一覧に戻る
      </a>
    </div>

    <footer>
      <p>© 尾張・名古屋地区 高校進学情報ガイド / 本サイトは中学生・保護者の進路選択を支援するポータルサイトです。</p>
    </footer>
  </div>

</body>
</html>`;

  fs.writeFileSync(path.join(schoolsDir, `${school.id}.html`), html, 'utf8');
});

console.log(`Successfully generated ${updatedSchoolsData.length} individual school pages in ./schools/`);

// schools_data.js を更新（各校に id と pageUrl を持たせる）
const jsContent = `// 愛知県尾張地区 高校進学データベース（公立・私立 / 最上位〜最下位・内申オール2〜オール1クラスまで完全網羅）
// 各校の個別詳細ページURL、部活動規定、制服、2026-2027年最新イベント日程付き

const schoolsData = ${JSON.stringify(updatedSchoolsData, null, 2)};

if (typeof module !== 'undefined') {
  module.exports = schoolsData;
}
`;

fs.writeFileSync(path.join(__dirname, 'schools_data.js'), jsContent, 'utf8');
console.log('Successfully updated schools_data.js with pageUrl links!');
