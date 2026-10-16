const fs = require('fs');
const path = require('path');
const schools = require('./schools_data.js');

const apiDir = path.join(__dirname, 'api');
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

// 1. schools.json (学校一覧 API)
const schoolsApiData = {
  meta: {
    title: "愛知県尾張・名古屋地区 高校進学データベース API",
    version: "2026-2027",
    updated_at: new Date().toISOString().split('T')[0],
    total_count: schools.length,
    site_url: "https://aichi-highschool.jp/",
    license: "Open Data / Attribution Required"
  },
  schools: schools.map(s => ({
    id: s.id,
    name: s.name,
    type: s.type,
    type_label: s.typeLabel,
    rank: s.rank,
    score_range: s.score,
    deviation: parseInt(s.deviation, 10),
    location: s.location,
    group: s.group,
    uniform: {
      category: s.uniform,
      detail: s.uniformDetail
    },
    club_policy: {
      category: s.clubPolicy,
      detail: s.clubDetail
    },
    features: s.features,
    results: s.results,
    events: s.events.replace(/<br>/g, ' / '),
    page_url: `https://aichi-highschool.jp/${s.pageUrl}`,
    official_url: s.url
  }))
};

fs.writeFileSync(path.join(apiDir, 'schools.json'), JSON.stringify(schoolsApiData, null, 2), 'utf-8');
console.log('Generated api/schools.json successfully.');

// 2. w-application-rules.json (W出願・群グループ判定ルール)
const rulesApiData = {
  meta: {
    title: "愛知県公立高校 尾張地区 W出願（複合選抜）判定ルール",
    updated_at: new Date().toISOString().split('T')[0]
  },
  system_overview: {
    description: "同一群内（尾張1群または尾張2群）において、Aグループから1校、Bグループから1校の最大2校をW出願可能。",
    scoring_system: {
      naishin_max: 45, // 9教科 × 5
      exam_score_max: 110, // 5教科 × 22点 (全問マークシート)
      type_1: "内申点(45×2=90点) + 当日点(110点) = 200点満点",
      type_2: "内申点(45×2=90点) + 当日点(110×1.5=165点) = 255点満点 (当日点重視)",
      type_3: "内申点(45×2×1.5=135点) + 当日点(110点) = 245点満点 (内申点重視)"
    }
  },
  typical_combinations: [
    {
      target_level: "最難関トップ校 (内申43〜45)",
      group: "尾張1群",
      choice_1: { name: "旭丘高等学校", group: "A" },
      choice_2: { name: "菊里高等学校", group: "B" },
      note: "尾張1群の王道トップ併願パターン"
    },
    {
      target_level: "最難関トップ校 (内申43〜45)",
      group: "尾張2群",
      choice_1: { name: "明和高等学校", group: "A" },
      choice_2: { name: "向陽高等学校", group: "B" },
      note: "尾張2群の王道トップ併願パターン"
    },
    {
      target_level: "上位進学校 (内申38〜42)",
      group: "尾張2群",
      choice_1: { name: "瑞陵高等学校", group: "A" },
      choice_2: { name: "桜台高等学校", group: "B" },
      note: "人気上位進学校の鉄板組み合わせ"
    },
    {
      target_level: "上位進学校 (内申38〜42)",
      group: "尾張1群",
      choice_1: { name: "一宮高等学校", group: "A" },
      choice_2: { name: "一宮西高等学校", group: "B" },
      note: "尾張北部・一宮エリアの王道W出願"
    },
    {
      target_level: "中堅人気校 (内申32〜36)",
      group: "尾張2群",
      choice_1: { name: "名東高等学校", group: "A" },
      choice_2: { name: "昭和高等学校", group: "B" },
      note: "名古屋市内文武両道校の定番パターン"
    }
  ]
};

fs.writeFileSync(path.join(apiDir, 'w-application-rules.json'), JSON.stringify(rulesApiData, null, 2), 'utf-8');
console.log('Generated api/w-application-rules.json successfully.');
