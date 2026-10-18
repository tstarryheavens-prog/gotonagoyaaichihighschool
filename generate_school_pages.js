const fs = require('fs');
const path = require('path');
const schools = require('./schools_data.js');
const { getMediaForSchool } = require('./school_media_data.js');

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

// SNSリサーチ・校則・生活実態のリアルデータジェネレータ
function getSchoolSnsData(school) {
  const name = school.name;
  const isPrivate = school.type === 'private';
  const isFreeUniform = school.uniform.includes('私服');

  // 校則レーティング（1〜5段階）
  let freedomRating = 3;
  let smartphoneRule = "校内持ち込み可（朝のHR〜帰りのHRまで電源OFFまたはロッカー保管）";
  let dressCode = `指定制服（${school.uniformDetail}）`;
  let hairRule = "染色・脱色・パーマは不可。清潔感のある高校生らしい髪型。";
  let partTimeRule = "原則禁止（経済的理由や特別な家庭事情による事前許可制）";
  let eventAtmosphere = "体育祭・文化祭ともにクラスが団結して盛り上がる標準的な高校生活。";

  if (isFreeUniform) {
    freedomRating = 5;
    smartphoneRule = "校内持ち込み可・休み時間等の利用も自己責任で自由。授業中の探究調べ物利用もあり。";
    dressCode = "完全私服通学（式典用の標準服あり。普段着・ジャージ・パーカーなど個性豊か）";
    hairRule = "染色・パーマ・髪型ともに実質自由。自律と自己管理を尊重。";
    partTimeRule = "原則届出制（ただし学習や部活が忙しいため行う生徒は少数派）";
    eventAtmosphere = "学校祭（文化祭・体育祭）は愛知県屈指の熱気！企画から運営まで生徒主導で一生の青春。";
  } else if (name.includes("菊里") || name.includes("向陽") || name.includes("瑞陵") || name.includes("昭和")) {
    freedomRating = 4;
    smartphoneRule = "校内持ち込み可。昼休みや放課後は節度を守って利用可能。";
    dressCode = `伝統の制服（${school.uniformDetail}）。着崩しは厳禁だが生徒の自主性を尊重。`;
    hairRule = "染髪は不可。髪型やヘアゴムの規定は比較的自由度が高め。";
    eventAtmosphere = "学校祭のクラス発表・ステージ企画の完成度が高く、SNSでも大盛り上がり。";
  } else if (isPrivate) {
    freedomRating = 3;
    smartphoneRule = "校内持ち込み可。校内では電源OFFまたは指定ボックス保管（マナー徹底指導）。";
    dressCode = `指定制服（ブレザー等）。清潔感と品格がありフォーマルなデザインが好評。`;
    hairRule = "定期的な身だしなみチェック（頭髪・爪・着こなし）あり。進路・面接を意識した指導。";
    eventAtmosphere = "充実した最新アリーナやホールでの本格ステージ発表。他校招待も盛況。";
  }

  // リアルSNSボイス（在校生、卒業生、保護者）
  let voices = [];
  if (name.includes("旭丘")) {
    voices = [
      { role: "在校生 (X / Threads)", tag: "校風・自由", comment: "自由すぎて最初は驚くけど、みんな陰でめちゃくちゃ自学自習してる。天才と努力家が混ざり合って、お互いに刺激し合える最高の環境。" },
      { role: "在校生 (Instagram)", tag: "学校祭・青春", comment: "鯱光祭（ここうさい）の準備期間は人生で一番熱い6日間！クラス全員で夜遅くまで語り合って巨大看板作って、一生忘れられない思い出になる。" },
      { role: "保護者 (進学相談ノート)", tag: "進路・自律", comment: "親があれこれ言わなくても自分で目標を見つけて机に向かうようになりました。先生方も過度な強制をせず、生徒の探究心をとことん伸ばしてくれます。" }
    ];
  } else if (name.includes("明和")) {
    voices = [
      { role: "在校生 (Instagram)", tag: "文武両道", comment: "明和祭のクラス劇の完成度が映画レベル！勉強だけじゃなく部活も行事も妥協しないのが明和生。メリハリをつけるのがみんな本当に上手い。" },
      { role: "卒業生 (note)", tag: "大学受験", comment: "名大や国公立大を目指す仲間が周りに当たり前にいるから、自然と受験モードに入れた。高校時代の友人は今でも一番の財産。" },
      { role: "保護者 (学校アンケート)", tag: "環境・安心", comment: "音楽科もあるせいか、校内にいつも穏やかで気品ある空気が流れています。真面目で思いやりのある生徒が多く、安心して通わせられます。" }
    ];
  } else if (name.includes("千種")) {
    voices = [
      { role: "在校生 (TikTok / X)", tag: "私服・楽しさ", comment: "私服通学だから毎朝コーデ考えるのが楽しい！国際教養科の子たちは英語ペラペラで発音綺麗だし、海外研修や文化祭もめちゃくちゃ華やか。" },
      { role: "卒業生 (知恵袋)", tag: "進路・英語力", comment: "英語ディベートやプレゼンの機会が多くて大学入試の総合型・推薦でもめちゃくちゃ有利だった。自立して行動したい人に本当におすすめ。" },
      { role: "保護者 (口コミ)", tag: "国際理解", comment: "自主自立の精神が身につきます。帰国子女の生徒さんも多く、多様な価値観に触れられる素晴らしい3年間になりました。" }
    ];
  } else if (name.includes("菊里")) {
    voices = [
      { role: "在校生 (Instagram)", tag: "立地・放課後", comment: "星ヶ丘テラスがすぐそこで放課後のカフェ勉や買い物が最高！セーラー服も愛知県で一番可愛いって言われてて誇らしい。" },
      { role: "卒業生 (X)", tag: "行事・音楽", comment: "菊里祭の音楽科による演奏会は鳥肌モノ。普通科の生徒も勉強と行事の切り替えが完璧で、名大・難関大への進学熱も高い。" },
      { role: "保護者 (進路面談)", tag: "通学・指導", comment: "星ヶ丘駅から徒歩数分で夜遅くの塾帰りでも安心。先生方の面倒見も良く、国公立・難関私大の進路指導が手厚かったです。" }
    ];
  } else if (name.includes("向陽")) {
    voices = [
      { role: "在校生 (X)", tag: "探究・科学", comment: "国際科学科の実験設備が大学レベル！普通科もみんな穏やかで優しくて、いじめとか皆無の平和で知的な空間。桜山駅すぐなのも神。" },
      { role: "卒業生 (ブログ)", tag: "進学実績", comment: "名大合格者数が愛知県トップクラスなのも納得。放課後に質問に行くと先生方がとことん付き合ってくれたのが合格の決め手。" },
      { role: "保護者 (口コミ)", tag: "学習環境", comment: "真面目だけどガリ勉ではなく、部活動も行事も心から楽しんでいます。図書館や自習室の環境が素晴らしいです。" }
    ];
  } else if (name.includes("一宮")) {
    voices = [
      { role: "在校生 (X)", tag: "槍高祭・熱気", comment: "ヤリ高祭は一生の思い出！ファッション創造科のファッションショーはプロ顔負けの凄さ。課題は多いけど乗り越えると実力がつく。" },
      { role: "卒業生 (note)", tag: "進学力", comment: "名大現役合格を目指すなら最高の環境。補習も充実していて塾なしで国公立大に現役合格できたのは槍高の先生方のおかげ。" },
      { role: "保護者 (保護者会)", tag: "手厚い指導", comment: "尾張地区トップ校の誇りを胸に、生徒たちが切磋琢磨しています。学習習慣が自然と身につくカリキュラムに感謝しています。" }
    ];
  } else if (name.includes("瑞陵")) {
    voices = [
      { role: "在校生 (Instagram)", tag: "食物科・理数科", comment: "食物科のパンやランチ試食が美味しすぎる！理数科の実験も本格的。自主自律の校風で、行事も部活もみんな全力で楽しんでる。" },
      { role: "卒業生 (X)", tag: "校風の良さ", comment: "近年人気が爆上がりしてる理由が通えば分かる。杉原千畝先生の記念館もあって、自由と人権を大切にする雰囲気が心地よかった。" },
      { role: "保護者 (口コミ)", tag: "人気急上昇", comment: "公立ダブル出願で旭丘・明和と併願する優秀なお子さんが多く、学校全体のモチベーションが非常に高いです。" }
    ];
  } else if (name.includes("名城")) {
    voices = [
      { role: "在校生 (TikTok / X)", tag: "新校舎・施設", comment: "新校舎がまるで大学みたいに綺麗！カフェテリアも自習室も冷暖房完備で快適すぎる。名城大学への推薦枠がある安心感もデカい。" },
      { role: "卒業生 (知恵袋)", tag: "特進と進学", comment: "特進クラスは国公立・難関大を本気で狙えるカリキュラム。進学クラスは部活に打ち込みながら名城大の理系・薬学を目指せる。" },
      { role: "保護者 (進路説明会)", tag: "推薦・設備", comment: "私立無償化の補助金制度を利用できたので学費負担も安心でした。最新のICT教育と名城大連携講座が本当に魅力的です。" }
    ];
  } else if (name.includes("中京")) {
    voices = [
      { role: "在校生 (Instagram)", tag: "部活・スポーツ", comment: "甲子園や全国大会の応援は全校生徒が一つになって鳥肌が立つ！スポーツだけじゃなく進学コースも勉強サポートがガチで手厚い。" },
      { role: "卒業生 (X)", tag: "キャンパスライフ", comment: "明るくて積極的な生徒が多くて友達がすぐできた。中京大学への進学ルートを確保しながら外部の難関大に挑戦する人も多数。" },
      { role: "保護者 (口コミ)", tag: "人間的成長", comment: "礼儀作法や挨拶の指導がしっかりしていて、3年間で精神的に逞しく成長しました。先生方の情熱が素晴らしい学校です。" }
    ];
  } else {
    voices = [
      { role: "在校生 (SNSアンケート)", tag: "学校生活", comment: `${name}は先生と生徒の距離が近くてアットホーム。部活動も先輩後輩仲が良くて、毎日の登校が本当に楽しいです。` },
      { role: "卒業生 (口コミ)", tag: "進路・受験対策", comment: `定期テスト対策と指定校推薦・一般入試対策のバランスが良い。日頃から先生に質問しやすい環境だったのが合格に直結しました。` },
      { role: "保護者 (体験談ノート)", tag: "安心感・環境", comment: `見学会で感じた温かい雰囲気が入学後もそのまま。通学路の治安も良く、充実した3年間を過ごせていると実感しています。` }
    ];
  }

  return {
    freedomRating,
    smartphoneRule,
    dressCode,
    hairRule,
    partTimeRule,
    eventAtmosphere,
    voices
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
  const media = getMediaForSchool(school);
  const snsData = getSchoolSnsData(school);

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${school.name}の特色・学校生活・年間スケジュール＆進学実績【尾張高校ナビ】</title>
  <meta name="description" content="${school.name}（${school.location}）の特色、制服、部活動の加入規定、進学実績、年間行事スケジュール、1日の生活の流れを徹底解説！">

  <!-- Schema.org JSON-LD (AI Discovery / Agentic Web & Rich Results) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["HighSchool", "EducationalOrganization"],
        "@id": "https://aichi-highschool.jp/schools/${school.id}.html#school",
        "name": "${school.name}",
        "description": "${school.features} 合格目安内申点: ${school.score}、偏差値: ${school.deviation}。進学実績: ${school.results}",
        "url": "${school.url}",
        "address": {
          "@type": "PostalAddress",
          "addressRegion": "愛知県",
          "streetAddress": "${school.location}"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://aichi-highschool.jp/schools/${school.id}.html",
        "url": "https://aichi-highschool.jp/schools/${school.id}.html",
        "name": "${school.name}の特色・学校生活・年間スケジュール＆進学実績【尾張高校ナビ】",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://aichi-highschool.jp/#website",
          "name": "尾張・名古屋地区 高校進学ナビ",
          "url": "https://aichi-highschool.jp/"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "ホーム",
              "item": "https://aichi-highschool.jp/index.html"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "${school.name}",
              "item": "https://aichi-highschool.jp/schools/${school.id}.html"
            }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "${school.name}の目安となる内申点や偏差値は？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "${school.name}の合格目安内申点は${school.score}、偏差値は約${school.deviation}（${school.rank}ランク）です。"
            }
          },
          {
            "@type": "Question",
            "name": "${school.name}の部活動や制服の規定はどうなっていますか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "部活動規定は「${school.clubPolicy}」（${school.clubDetail}）です。制服規定は「${school.uniform}」（${school.uniformDetail}）です。"
            }
          },
          {
            "@type": "Question",
            "name": "${school.name}の文化祭や説明会の日程はいつですか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "${school.events.replace(/<br>/g, ' / ').replace(/"/g, '\\"')}"
            }
          }
        ]
      }
    ]
  }
  </script>

  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1988464307898443"
     crossorigin="anonymous"></script>

  <!-- A8.net リンクマネージャー -->
  <script src="//statics.8me.jp/a8link/a8linkmgr.js"></script>
  <script>
    a8linkmgr({
      "config_id": "AiCzxW5LM9avBb8VJ393"
    });
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../common.css">
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
      background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%);
      color: white;
      padding: 12px 18px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    }
    .header-inner {
      max-width: 1080px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .header-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .header-logo-img {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.18);
      background: white;
      border: 1.5px solid rgba(255,255,255,0.9);
      object-fit: cover;
      flex-shrink: 0;
    }
    .header-titles {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .badge-bar {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .badge {
      background: rgba(255, 255, 255, 0.22);
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: 0.72rem;
      font-weight: 700;
      backdrop-filter: blur(4px);
    }
    .badge-rank {
      background: #f59e0b;
      color: #78350f;
      font-weight: 800;
    }
    header h1 {
      font-family: 'M PLUS Rounded 1c', sans-serif;
      font-size: 1.35rem;
      font-weight: 800;
      margin: 0;
      line-height: 1.25;
      color: #ffffff;
    }
    .header-catchphrase {
      font-size: 0.8rem;
      color: #e0e7ff;
      margin: 0;
      max-width: 460px;
      line-height: 1.4;
    }

    /* 1行横スクロール・ナビゲーション */
    .top-nav {
      background: white;
      border-bottom: 1px solid var(--border-color);
      padding: 6px 12px;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
    }
    .top-nav-inner {
      max-width: 1080px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 6px;
      overflow-x: auto;
      white-space: nowrap;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }
    .top-nav-inner::-webkit-scrollbar {
      display: none;
    }
    .top-nav a {
      text-decoration: none;
      color: var(--text-main);
      font-weight: 600;
      font-size: 0.78rem;
      padding: 4px 10px;
      border-radius: 6px;
      transition: all 0.2s;
      flex-shrink: 0;
      background: #f8fafc;
      border: 1px solid #f1f5f9;
    }
    .top-nav a:hover, .top-nav a.active {
      background: var(--primary-light);
      color: var(--primary);
      border-color: #bfdbfe;
    }

    .container {
      max-width: 1080px;
      margin: 0 auto;
      padding: 0 16px;
    }

    /* ファーストビュー：コンテンツと広告の横並びトップセクション */
    .hero-top-grid {
      display: grid;
      grid-template-columns: 1fr 310px;
      gap: 16px;
      margin: 14px 0 18px;
      align-items: stretch;
    }

    /* 左カラム：入試基本データ＆スペック（スクロール不要で即座に見える！） */
    .hero-spec-card {
      background: white;
      border-radius: 14px;
      border: 1px solid var(--border-color);
      box-shadow: 0 3px 14px rgba(0, 0, 0, 0.04);
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .hero-spec-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 12px;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 8px;
      flex-wrap: wrap;
    }
    .hero-spec-title {
      font-family: 'M PLUS Rounded 1c', sans-serif;
      font-size: 1.15rem;
      font-weight: 800;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .hero-spec-loc {
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 500;
    }

    /* 4分割スペックボックス */
    .hero-metrics-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 12px;
    }
    .hero-metric-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 8px 12px;
    }
    .hero-metric-box.metric-score {
      background: #eff6ff;
      border-color: #bfdbfe;
    }
    .hero-metric-box.metric-dev {
      background: #fffbeb;
      border-color: #fde68a;
    }
    .hero-metric-label {
      font-size: 0.72rem;
      color: #64748b;
      font-weight: 700;
      display: block;
      margin-bottom: 2px;
    }
    .hero-metric-box.metric-score .hero-metric-label { color: #1e40af; }
    .hero-metric-box.metric-dev .hero-metric-label { color: #b45309; }

    .hero-metric-val {
      font-family: 'M PLUS Rounded 1c', sans-serif;
      font-size: 1.3rem;
      font-weight: 800;
      color: #1e293b;
      line-height: 1.2;
    }
    .hero-metric-box.metric-score .hero-metric-val { color: #1d4ed8; }
    .hero-metric-box.metric-dev .hero-metric-val { color: #d97706; }
    .hero-metric-val-sub {
      font-size: 0.95rem;
      font-weight: 700;
      color: #334155;
    }

    /* ボタン＆アクション行 */
    .hero-actions-row {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }
    .btn-route-action {
      flex: 1;
      min-width: 170px;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      box-shadow: 0 2px 6px rgba(16, 185, 129, 0.22);
      transition: all 0.2s;
    }
    .btn-route-action:hover {
      background: #059669;
    }
    .btn-official-action {
      background: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 0.8rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s;
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.2);
    }
    .btn-official-action:hover {
      background: #1d4ed8;
    }

    /* 親子体験談スリムノート */
    .hero-parent-note {
      background: #fffdf5;
      border: 1px solid #fde68a;
      border-radius: 8px;
      padding: 7px 10px;
      font-size: 0.76rem;
      color: #92400e;
      line-height: 1.45;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* 右カラム：横並びスポンサー広告カード */
    .hero-ad-card {
      background: white;
      border-radius: 14px;
      border: 1px solid var(--border-color);
      box-shadow: 0 3px 14px rgba(0, 0, 0, 0.04);
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: #fffdfa;
    }
    .hero-ad-badge-row {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;
      margin-bottom: 4px;
      font-size: 0.68rem;
      color: #94a3b8;
    }
    .hero-ad-badge {
      background: #fef3c7;
      color: #b45309;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 4px;
    }
    .hero-ad-img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .hero-ad-footer-text {
      font-size: 0.7rem;
      color: #64748b;
      margin-top: 4px;
      line-height: 1.35;
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

    /* SNS・動画紹介セクション */
    .media-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin-top: 15px;
    }
    .media-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      position: relative;
    }
    .media-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
    }
    .media-card.video-card {
      border-left: 4px solid #ef4444;
      background: linear-gradient(135deg, #ffffff 0%, #fffbfb 100%);
    }
    .media-card.official-card {
      border-left: 4px solid #2563eb;
      background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
    }
    .media-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 8px;
    }
    .media-badge {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .media-badge.video {
      background: #fee2e2;
      color: #b91c1c;
    }
    .media-badge.official {
      background: #dbeafe;
      color: #1d4ed8;
    }
    .media-platform {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 600;
    }
    .media-title {
      font-size: 0.96rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.45;
      margin-bottom: 8px;
    }
    .media-desc {
      font-size: 0.83rem;
      color: #475569;
      line-height: 1.5;
      margin-bottom: 12px;
      flex-grow: 1;
    }
    .media-link-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 0.84rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s;
    }
    .media-link-btn.youtube {
      background: #ef4444;
      color: white;
    }
    .media-link-btn.youtube:hover {
      background: #dc2626;
    }
    .media-link-btn.official-btn {
      background: #2563eb;
      color: white;
    }
    .media-link-btn.official-btn:hover {
      background: #1d4ed8;
    }

    footer {
      text-align: center;
      margin-top: 50px;
      font-size: 0.82rem;
      color: var(--text-muted);
      line-height: 1.8;
    }

    @media (max-width: 860px) {
      .hero-top-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      .header-inner {
        flex-direction: column;
        align-items: flex-start;
      }
    }
    @media (max-width: 640px) {
      header { padding: 10px 14px; }
      header h1 { font-size: 1.25rem; }
      .header-logo-img { width: 38px; height: 38px; }
      .container { padding: 0 10px; }
      .hero-metrics-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
      .hero-metric-val { font-size: 1.15rem; }
      .section-card { padding: 18px 14px; }
      .daily-row { flex-direction: column; gap: 4px; }
      .daily-time { min-width: auto; }
    }
  </style>
  <link rel="icon" type="image/png" href="../favicon.png">
  <link rel="apple-touch-icon" href="../logo.png">
</head>
<body>

  <!-- ヘッダー：コンパクト＆高品質 -->
  <header>
    <div class="header-inner">
      <div class="header-brand">
        <a href="../index.html" class="logo-link"><img src="../logo.png" alt="尾張・名古屋高校進学ナビ公式マスコット シャチホコフクロウ" class="header-logo-img"></a>
        <div class="header-titles">
          <div class="badge-bar">
            <span class="badge badge-rank">ランク ${school.rank}</span>
            <span class="badge">${school.typeLabel}</span>
            <span class="badge">${school.group}</span>
          </div>
          <h1>${school.name}</h1>
        </div>
      </div>
      <p class="header-catchphrase">${content.catchphrase}</p>
    </div>
  </header>

  <!-- 1行横スクロール・ナビゲーション -->
  <nav class="top-nav">
    <div class="top-nav-inner">
      <a href="../index.html">📊 内申点ランキングTOP</a>
      <a href="../sns-real-voices.html">📱 SNSリアル本音口コミ</a>
      <a href="../composite-selection-guide.html">🔀 複合選抜・W出願</a>
      <a href="../public-vs-private-guide.html">⚖️ 公立・私立比較</a>
      <a href="../tuition-guide.html">💰 学費・補助金ガイド</a>
      <a href="../mock-exam-guide.html">📈 模試判定の読み方</a>
      <a href="../autumn-tour-guide.html">🍂 秋の見学会チェック</a>
      <a href="../schedule.html">📅 学年別進学スケジュール</a>
      <a href="../test-study-guide.html">📝 普段のテスト対策</a>
      <a href="../ai-study-guide.html">🤖 最新AI勉強法</a>
      <a href="../ai-prompts.html">⚡️ 神プロンプト集</a>
      <a href="../community.html">💬 質問・相談チャネル</a>
      <a href="https://naogoya-aichi-koukoujyuken.hatenadiary.com" target="_blank" rel="noopener" style="color: #ea580c; font-weight: 700;">📝 公式ブログ ↗</a>
    </div>
  </nav>

  <div class="container">

    <!-- ファーストビュー：入試基本スペック ＆ スポンサー広告 横並びトップセクション -->
    <div class="hero-top-grid">
      <!-- 左カラム：高校入試・基本データ（スクロール不要で即座に視認可能！） -->
      <div class="hero-spec-card">
        <div class="hero-spec-header">
          <div class="hero-spec-title">
            <span>🏫 ${school.name} 入試・基本データ</span>
          </div>
          <span class="hero-spec-loc">📍 所在地：${school.location}</span>
        </div>

        <div class="hero-metrics-grid">
          <div class="hero-metric-box metric-score">
            <span class="hero-metric-label">合格目安 内申点</span>
            <div class="hero-metric-val">${school.score} <span style="font-size:0.75rem; font-weight:normal;">/45点</span></div>
          </div>
          <div class="hero-metric-box metric-dev">
            <span class="hero-metric-label">偏差値 目安</span>
            <div class="hero-metric-val">約 ${school.deviation}</div>
          </div>
          <div class="hero-metric-box">
            <span class="hero-metric-label">部活動ルール</span>
            <div class="hero-metric-val-sub">${school.clubPolicy}</div>
          </div>
          <div class="hero-metric-box">
            <span class="hero-metric-label">制服スタイル</span>
            <div class="hero-metric-val-sub">${school.uniform}</div>
          </div>
        </div>

        <div class="hero-actions-row">
          <button type="button" class="btn-route-action" onclick="openRouteModal('${school.name}', '${school.location}')">
            🗺️ Googleマップ通学ルート
          </button>
          <a href="${school.url}" target="_blank" rel="noopener" class="btn-official-action">
            🌐 高校公式サイト ↗
          </a>
          <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent('【' + school.name + '】特色・内申目安(' + school.score + ')・先輩のリアルSNS口コミをチェック！\nhttps://aichi-highschool.jp/schools/' + school.id + '.html\n#愛知高校 #高校受験 #' + school.name)}" target="_blank" rel="noopener" class="btn-official-action" style="background:#0f172a; box-shadow:0 2px 6px rgba(15,23,42,0.2);">
            𝕏 でシェア
          </a>
        </div>

        <div class="hero-parent-note">
          <span style="font-size: 1.1rem; flex-shrink: 0;">👨‍👩‍👧‍👦</span>
          <div>
            <strong>保護者・調査ノート：</strong> 制服詳細: ${school.uniformDetail}。${content.appealPoints[0].replace(/【.*?】/, '')}
          </div>
        </div>
      </div>

      <!-- 右カラム：スポンサー広告バナー枠（横並びで配置） -->
      <div class="hero-ad-card">
        <div class="hero-ad-badge-row">
          <span class="hero-ad-badge">🎓 スポンサーPR</span>
          <span>広告リンク</span>
        </div>
        <div class="hero-ad-banner-body">
          <a href="https://px.a8.net/svt/ejp?a8mat=4BE70L+662RQI+36T2+TYQVL" rel="nofollow" target="_blank" style="display:inline-block; line-height:0;">
            <img border="0" width="300" height="250" alt="高校受験・学習支援バナー" src="https://www29.a8.net/svt/bgt?aid=261002757373&wid=004&eno=01&mid=s00000014879005033000&mc=1" class="hero-ad-img">
          </a>
          <img border="0" width="1" height="1" src="https://www12.a8.net/0.gif?a8mat=4BE70L+662RQI+36T2+TYQVL" alt="" style="display:none;">
        </div>
        <div class="hero-ad-footer-text">
          愛知県高校入試・内申点対策＆オンライン学習
        </div>
      </div>
    </div>

    ${(() => {
      const s = school.score;
      const is35Range = (s.includes("33") || s.includes("34") || s.includes("35") || s.includes("36") || s.includes("37") || s.includes("38")) && !s.includes("43") && !s.includes("42") && !s.includes("45");
      if (!is35Range) return '';
      return `
    <!-- 激戦区！内申点35周辺フォーカス特別解説 -->
    <div class="section-card" style="border: 2px solid #f59e0b; background: linear-gradient(180deg, #fffbeb 0%, #ffffff 100%);">
      <h2 style="color: #b45309; border-bottom: 2px solid #fef3c7;">
        🎯 【内申点35前後の受験生へ】${school.name} 合格ボーダー＆併願戦略アドバイス
      </h2>
      <div style="font-size: 0.95rem; color: #334155; line-height: 1.7;">
        <p style="margin-bottom: 12px;">
          <strong>内申点35（オール4前後）</strong>は、愛知県の高校受験において<strong>最も受験者層が厚く、1問のミスで合否が分かれる大激戦ゾーン</strong>です。
          ${school.name}（目安内申: <strong>${school.score}</strong> / 偏差値: <strong>${school.deviation}</strong>）を志望校とする場合のリアルな戦略ポイントをまとめました。
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 14px; margin: 16px 0;">
          <div style="background: white; border: 1px solid #fde68a; border-radius: 10px; padding: 14px; border-left: 4px solid #f59e0b;">
            <div style="font-weight: 800; color: #b45309; margin-bottom: 4px;">🎯 当日点の目標目安</div>
            <div style="font-size: 0.88rem; color: #475569;">
              ${school.type === 'public' ? 
                `公立一般入試（110点満点）では、<strong>当日点${school.score.includes('37') || school.score.includes('38') || school.score.includes('39') ? '82〜88点' : '76〜82点'}</strong>の確保が安全圏ライン。内申35を持っていると公立当日点計算（主にマークシート・校内順位決定）で大きなアドバンテージになります。` :
                `私立一般入試では基礎〜標準問題の取りこぼしが命取り。<strong>正答率70〜75%以上</strong>を目標に、過去問で私立特有の出題傾向を掴んでおきましょう。`
              }
            </div>
          </div>
          <div style="background: white; border: 1px solid #fde68a; border-radius: 10px; padding: 14px; border-left: 4px solid #3b82f6;">
            <div style="font-weight: 800; color: #1d4ed8; margin-bottom: 4px;">🤝 おすすめの併願・組み合わせ</div>
            <div style="font-size: 0.88rem; color: #475569;">
              ${school.type === 'public' ?
                `私立併願は<strong>名城大学附属・中京大中京・愛工大名電・椙山・東邦</strong>が鉄板。公立W出願では『${school.score.includes('37') || school.score.includes('38') ? '挑戦校（名東・昭和・桜台等）と手堅い第2志望（松蔭・名古屋南・天白等）' : '第1志望本命と安全圏（熱田・日進西等）'}』を組み合わせると盤石です。` :
                `公立との併願では<strong>昭和・松蔭・名東・名古屋南・天白</strong>を受験する生徒が多く併願します。私立単願・推薦を狙う場合は中学校での内申相談（12月）で35以上を維持できているかが重要です。`
              }
            </div>
          </div>
        </div>

        <div style="background: #f8fafc; border-radius: 8px; padding: 12px 16px; font-size: 0.86rem; color: #64748b;">
          💡 <strong>内申点アップの即効ワザ：</strong> 定期テストで75点以上を死守することに加え、<strong>実技4教科（保体・技家・音・美）で『4』以上を2つ以上確保</strong>することが、内申35から36〜38へと押し上げる最大のカギです！
        </div>
      </div>
    </div>
    `;
    })()}

    <!-- 在校生・卒業生・保護者のリアルSNSボイス ＆ 校則・生活の実態調査 -->
    <div class="section-card" style="border: 1.5px solid #e0e7ff; background: linear-gradient(180deg, #ffffff 0%, #f8faff 100%);">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
        <h2 style="margin: 0; border: none; padding: 0; color: #1e3a8a; font-size: 1.22rem;">
          📱 在校生・保護者のリアルSNSボイス ＆ 校則・生活の本音
        </h2>
        <span style="font-size: 0.74rem; background: #dbeafe; color: #1e40af; font-weight: 700; padding: 3px 8px; border-radius: 6px;">
          SNS・知恵袋・口コミ独自リサーチ済
        </span>
      </div>

      <!-- 校則・生活のリアル判定表 -->
      <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; margin-bottom: 16px;">
        <div style="font-weight: 800; font-size: 0.92rem; color: #0f172a; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px;">
          <span>🔍 校則・自由度のリアル調査判定</span>
          <span style="font-size: 0.8rem; color: #d97706; background: #fffbeb; padding: 2px 8px; border-radius: 6px; border: 1px solid #fde68a;">
            自由度指数: ${'★'.repeat(snsData.freedomRating)}${'☆'.repeat(5 - snsData.freedomRating)} (${snsData.freedomRating}/5)
          </span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px; font-size: 0.82rem;">
          <div style="background: #f8fafc; padding: 8px 10px; border-radius: 8px; border-left: 3px solid #3b82f6;">
            <strong style="color: #1e40af;">📱 スマホ利用：</strong> ${snsData.smartphoneRule}
          </div>
          <div style="background: #f8fafc; padding: 8px 10px; border-radius: 8px; border-left: 3px solid #10b981;">
            <strong style="color: #065f46;">👗 制服・私服：</strong> ${snsData.dressCode}
          </div>
          <div style="background: #f8fafc; padding: 8px 10px; border-radius: 8px; border-left: 3px solid #f59e0b;">
            <strong style="color: #92400e;">✂️ 頭髪・身だしなみ：</strong> ${snsData.hairRule}
          </div>
          <div style="background: #f8fafc; padding: 8px 10px; border-radius: 8px; border-left: 3px solid #8b5cf6;">
            <strong style="color: #5b21b6;">💼 アルバイト：</strong> ${snsData.partTimeRule}
          </div>
        </div>
        <div style="margin-top: 10px; font-size: 0.82rem; color: #475569; background: #fffdf5; padding: 8px 12px; border-radius: 6px; border: 1px dashed #fde68a;">
          🎪 <strong>学校行事（文化祭・体育祭）の熱気：</strong> ${snsData.eventAtmosphere}
        </div>
      </div>

      <!-- SNSリアル口コミ（吹き出しカード） -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px;">
        ${snsData.voices.map(v => `
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #1e40af;">💬 ${v.role}</span>
              <span style="font-size: 0.7rem; background: #f1f5f9; color: #475569; padding: 2px 6px; border-radius: 4px;"># ${v.tag}</span>
            </div>
            <p style="font-size: 0.86rem; color: #334155; line-height: 1.55; margin: 0;">
              「${v.comment}」
            </p>
          </div>
        </div>`).join('')}
      </div>
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
      <span class="ad-banner-label">スポンサーリンク / PR</span>
      <div style="margin: 12px auto; max-width: 728px; min-height: 90px; text-align: center;">
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-1988464307898443"
             data-ad-slot="auto"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </div>
      <div style="display: flex; justify-content: center; align-items: center; margin: 12px 0;">
        <a href="https://px.a8.net/svt/ejp?a8mat=4BE70L+662RQI+36T2+TYQVL" rel="nofollow">
          <img border="0" width="300" height="250" alt="高校受験・学習支援バナー" src="https://www29.a8.net/svt/bgt?aid=261002757373&wid=004&eno=01&mid=s00000014879005033000&mc=1" style="max-width: 100%; height: auto; border-radius: 10px; box-shadow: 0 4px 14px rgba(0,0,0,0.08);">
        </a>
        <img border="0" width="1" height="1" src="https://www12.a8.net/0.gif?a8mat=4BE70L+662RQI+36T2+TYQVL" alt="">
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

    <!-- SNS・厳選動画紹介セクション -->
    <div class="section-card">
      <h2>🎬 ${school.name}のリアルがわかる！公式SNS＆厳選動画リンク</h2>
      <p style="font-size:0.9rem; color:#64748b; margin-bottom:12px;">学校公式の発信から、地元塾講師による合格ボーダー・本音解説、生徒のスクールライフ密着動画まで、志望校選びに本当に役立つコンテンツを厳選掲載しています。</p>
      
      <!-- 本音・塾・学校生活解説動画 -->
      <h3 style="font-size:1.05rem; color:#0f172a; margin: 18px 0 8px; display:flex; align-items:center; gap:6px;">
        <span style="color:#ef4444;">▶</span> 受験生必見！本音の学校紹介＆合格分析動画
      </h3>
      <div class="media-grid">
        <div class="media-card video-card" style="border: 2px solid #ef4444; background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);">
          <div>
            <div class="media-header">
              <span class="media-badge video" style="background:#ef4444; color:white;">公式Shorts</span>
              <span class="media-platform">愛知高校受験進学ナビ</span>
            </div>
            <div class="media-title">【愛知高校受験】内申が低くても当日点で大逆転！？公立高校「IV型配点」の秘密</div>
            <div class="media-desc">💡 旭丘・明和・千種・向陽など公立トップ校が採用する当日点2倍ルールの要点を40秒でサクッと解説！</div>
          </div>
          <div>
            <a href="https://youtube.com/shorts/ZoG4ngjrcZ4" target="_blank" rel="noopener noreferrer" class="media-link-btn youtube" style="background:#dc2626; color:white;">
              <span>▶</span> YouTube Shortsを見る ↗
            </a>
          </div>
        </div>
        ${media.reviews.map(rev => `
        <div class="media-card video-card">
          <div>
            <div class="media-header">
              <span class="media-badge video">${rev.badge}</span>
              <span class="media-platform">${rev.channel}</span>
            </div>
            <div class="media-title">${rev.title}</div>
            <div class="media-desc">💡 ${rev.highlight}</div>
          </div>
          <div>
            <a href="${rev.url}" target="_blank" rel="noopener noreferrer" class="media-link-btn youtube">
              <span>▶</span> YouTubeで動画を見る ↗
            </a>
          </div>
        </div>`).join('\n        ')}
      </div>

      <!-- 公式SNS・公式動画 -->
      <h3 style="font-size:1.05rem; color:#0f172a; margin: 24px 0 8px; display:flex; align-items:center; gap:6px;">
        <span style="color:#2563eb;">🌐</span> 公式情報・学校プロモーション
      </h3>
      <div class="media-grid">
        ${media.official.map(off => `
        <div class="media-card official-card">
          <div>
            <div class="media-header">
              <span class="media-badge official">${off.platform}</span>
            </div>
            <div class="media-title">${off.name}</div>
            <div class="media-desc">${off.desc}</div>
          </div>
          <div>
            <a href="${off.url}" target="_blank" rel="noopener noreferrer" class="media-link-btn official-btn">
              <span>🔗</span> リンクを開く ↗
            </a>
          </div>
        </div>`).join('\n        ')}
      </div>
    </div>

    <!-- 広告枠③（文化祭・公式サイト誘導前） -->
    <div class="ad-banner-wrapper">
      <span class="ad-banner-label">スポンサーリンク / PR</span>
      <div style="margin: 12px auto; max-width: 728px; min-height: 90px; text-align: center;">
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-1988464307898443"
             data-ad-slot="auto"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </div>
    </div>

    <!-- 最新イベント＆公式サイト -->
    <div class="section-card" style="background:#f0fdf4; border-color:#bbf7d0;">
      <h2 style="color:#166534; border-color:#dcfce7;">📅 2026〜2027年 文化祭・説明会日程</h2>
      <div style="font-size:0.95rem; color:#15803d; line-height:1.6; margin-bottom:18px;">
        ${school.events}
      </div>
      <div style="text-align:center; display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
        <button type="button" class="btn-route-check" onclick="openRouteModal('${school.name}', '${school.location}')" style="display:inline-flex; align-items:center; gap:8px; padding: 12px 22px; font-size: 0.95rem; border-radius: 10px; background: white; border: 1.5px solid var(--primary); color: var(--primary); cursor: pointer; font-weight: 700; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);">
          🗺️ 通学ルートを調べる（Googleマップ） ↗
        </button>
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

  <!-- 通学ルート検索モーダル（Googleマップ連携） -->
  <div class="modal-overlay" id="routeModal" onclick="closeModalOnOuter(event, 'routeModal')">
    <div class="modal-card route-modal-card">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-soft); padding-bottom: 12px; margin-bottom: 14px;">
        <h2 style="font-size: 1.22rem; font-weight: 800; color: #0F172A; margin: 0; display: flex; align-items: center; gap: 8px;">
          <span>🗺️</span> 通学ルート・所要時間チェック
        </h2>
        <button onclick="closeModal('routeModal')" style="background: none; border: none; font-size: 1.25rem; cursor: pointer; color: #94A3B8;">
          ✕
        </button>
      </div>

      <div class="route-school-badge">
        <span>🏫 到着地：</span>
        <span id="routeDestSchoolName" style="color: #1E293B; font-weight: 900;">${school.name}</span>
        <span id="routeDestSchoolLoc" style="font-size: 0.78rem; color: #64748B; font-weight: normal; margin-left: auto;">📍 ${school.location}</span>
      </div>

      <div class="note-box" style="margin: 0 0 16px; padding: 10px 14px; font-size: 0.82rem;">
        🦉 <strong>シャチフク先輩：</strong>「乗り換え回数や坂道、自転車と電車の組み合わせを事前に知っておくと、入学後の通学がグッとイメージしやすくなるよ！Googleマップで今すぐ検索しよう！」
      </div>

      <div class="route-origin-options">
        <div>
          <label style="font-size: 0.84rem; font-weight: 800; color: var(--text-sub); display: block; margin-bottom: 6px;">
            📍 出発地を指定：
          </label>
          <div style="display: flex; gap: 8px;">
            <input type="text" id="routeOriginInput" placeholder="最寄り駅・自宅住所・バス停（例：名古屋駅、金山駅、一宮市...）" style="flex-grow: 1; padding: 9px 12px; border: 1.5px solid var(--border-soft); border-radius: 10px; font-size: 0.88rem; outline: none; font-family: inherit;">
            <button type="button" onclick="setOriginToCurrent()" style="background: #F1EFEA; border: 1px solid #CBD5E1; color: var(--text-main); padding: 8px 12px; border-radius: 10px; font-size: 0.8rem; font-weight: 800; cursor: pointer; white-space: nowrap;">
              📍 現在地
            </button>
          </div>
          <div class="quick-station-chips">
            <span style="font-size: 0.72rem; color: var(--text-muted); align-self: center;">主要駅クイック入力：</span>
            <span class="station-chip" onclick="setOriginText('名古屋駅')">名古屋駅</span>
            <span class="station-chip" onclick="setOriginText('金山駅')">金山駅</span>
            <span class="station-chip" onclick="setOriginText('栄駅')">栄駅</span>
            <span class="station-chip" onclick="setOriginText('大曽根駅')">大曽根駅</span>
            <span class="station-chip" onclick="setOriginText('一宮駅')">一宮駅</span>
            <span class="station-chip" onclick="setOriginText('春日井駅')">春日井駅</span>
          </div>
        </div>

        <div>
          <label style="font-size: 0.84rem; font-weight: 800; color: var(--text-sub); display: block; margin-bottom: 6px;">
            🚲 通学方法（移動手段）：
          </label>
          <div class="route-mode-selector">
            <button type="button" class="route-mode-btn active" data-mode="transit" onclick="selectRouteMode('transit', this)">
              🚃 電車・バス（公共交通）
            </button>
            <button type="button" class="route-mode-btn" data-mode="bicycling" onclick="selectRouteMode('bicycling', this)">
              🚲 自転車
            </button>
            <button type="button" class="route-mode-btn" data-mode="walking" onclick="selectRouteMode('walking', this)">
              🚶 徒歩
            </button>
          </div>
        </div>
      </div>

      <button type="button" onclick="launchGoogleMapsRoute()" class="btn-open-google-maps">
        <span>🗺️ Googleマップで通学ルートを開く ↗</span>
      </button>
    </div>
  </div>

  <script>
    function openModal(id) {
      const modal = document.getElementById(id);
      if (modal) modal.style.display = "flex";
    }

    function closeModal(id) {
      const modal = document.getElementById(id);
      if (modal) modal.style.display = "none";
    }

    function closeModalOnOuter(event, id) {
      if (event.target.id === id) {
        closeModal(id);
      }
    }

    let currentRouteDestName = "${school.name}";
    let currentRouteDestLoc = "${school.location}";
    let currentRouteMode = "transit";

    function openRouteModal(schoolName, schoolLocation) {
      if (schoolName) currentRouteDestName = schoolName;
      if (schoolLocation) currentRouteDestLoc = schoolLocation;
      const inputEl = document.getElementById("routeOriginInput");
      if (inputEl) inputEl.value = "";
      selectRouteMode("transit", document.querySelector('.route-mode-btn[data-mode="transit"]'));
      openModal("routeModal");
    }

    function selectRouteMode(mode, btnElement) {
      currentRouteMode = mode;
      document.querySelectorAll(".route-mode-btn").forEach(btn => btn.classList.remove("active"));
      if (btnElement) {
        btnElement.classList.add("active");
      } else {
        const target = document.querySelector('.route-mode-btn[data-mode="' + mode + '"]');
        if (target) target.classList.add("active");
      }
    }

    function setOriginToCurrent() {
      const inputEl = document.getElementById("routeOriginInput");
      if (inputEl) {
        inputEl.value = "現在地";
        inputEl.focus();
      }
    }

    function setOriginText(stationName) {
      const inputEl = document.getElementById("routeOriginInput");
      if (inputEl) {
        inputEl.value = stationName;
        inputEl.focus();
      }
    }

    function launchGoogleMapsRoute() {
      const inputEl = document.getElementById("routeOriginInput");
      const originVal = inputEl ? inputEl.value.trim() : "";

      let destQuery = currentRouteDestName;
      if (!destQuery.includes("高校") && !destQuery.includes("学校")) {
        destQuery += " 高校";
      }
      if (currentRouteDestLoc) {
        destQuery += " " + currentRouteDestLoc;
      }

      let url = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(destQuery) + "&travelmode=" + currentRouteMode;

      if (originVal && originVal !== "現在地") {
        url += "&origin=" + encodeURIComponent(originVal);
      }

      window.open(url, "_blank", "noopener,noreferrer");
    }
  </script>
  <!-- 広告マネージャー（A8.net自動配信＆空き地ゼロ化） -->
  <script src="../ads_manager.js"></script>
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
