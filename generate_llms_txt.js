const fs = require('fs');
const path = require('path');
const schools = require('./schools_data.js');

// 1. llms.txt (標準サマリー版) の生成
function generateLlmsTxt() {
  const content = `# 尾張・名古屋地区 高校進学ナビ (Aichi High School Room)

> 愛知県尾張・名古屋地区の公立・私立高校（全41校）の内申点目安、公立W出願・私立併願シミュレーション、部活動規定、制服、文化祭日程、学費無償化情報を完全網羅した地域密着型進学データベースです。

## サイトの概要と特徴
- **公立W出願完全対応**: 愛知県独自の「尾張1群・2群」「Aグループ・Bグループ」によるW出願（2校受験制度）の相性・鉄板組み合わせを完全判定。
- **内申点重視のリアル判定**: オール2・内申18から内申45・最難関トップ校まで、合格目安内申点（45点満点）と当日必要点（110点満点 / マークシート方式）を提供。
- **部活動・学校生活の具体的データ**: 朝練有無、1年次必須/自由加入規定、兼部可否、完全私服/制服規定、文化祭の一般公開日程を独自調査網羅。
- **学費・助成金シミュレーション**: 愛知県の私立高校授業料実質無償化制度（年収目安に応じた愛知県独自上乗せ補助金）の判定。

## 主要ガイド・ツール一覧
- [高校進学ナビ トップ / W出願シミュレーター](https://aichi-highschool.jp/index.html): 内申点から公立W出願・私立併願の組み合わせを即時シミュレーション、全高校比較テーブル。
- [愛知県 公立高校入試スケジュール・年間イベント](https://aichi-highschool.jp/schedule.html): 出願日、学力検査日、面接日、合格発表日、オープンスクール・学校説明会日程。
- [愛知県 私立高校学費・授業料実質無償化ガイド](https://aichi-highschool.jp/tuition-guide.html): 世帯年収別の補助金額計算、授業料・入学金・施設維持費の実質負担シミュレーション。
- [愛知県 高校生・保護者のリアルSNS本音口コミ＆校則ガイド](https://aichi-highschool.jp/sns-real-voices.html): X・Instagram・TikTok・知恵袋から調査したスマホ・私服制服・髪型・文化祭の熱気・通学事情のリアル。
- [愛知県 公立高校 複合選抜＆W出願・校内順位決定方式ガイド](https://aichi-highschool.jp/composite-selection-guide.html): 尾張1群・2群の組み合わせルール、校内順位決定方式（I〜V型）、マークシート当日点逆転法。
- [公立高校 vs 私立高校 徹底比較ガイド](https://aichi-highschool.jp/public-vs-private-guide.html): 3年間の総費用、カリキュラム、進路指導、校則の違い。
- [高校見学・秋のオープンスクール攻略法](https://aichi-highschool.jp/autumn-tour-guide.html): 文化祭一般公開日のチェックポイントと見学マナー。
- [愛知全県模試・進学模試 活用テクニック](https://aichi-highschool.jp/mock-exam-guide.html): 偏差値と合格判定の見方、内申点とのギャップ修正法。
- [定期テスト対策＆内申点アップ戦略](https://aichi-highschool.jp/test-study-guide.html): 提出物・副教科（実技4教科）の内申底上げ術。
- [高校受験生のためのAI学習活用プロンプト集](https://aichi-highschool.jp/ai-prompts.html): ChatGPT等を活用した英作文添削・数学質問プロンプト。

## 高校個別詳細ページ一覧 (41校)
${schools.map(s => `- [${s.name}](https://aichi-highschool.jp/${s.pageUrl}): 【${s.typeLabel} / ${s.rank}ランク】内申目安 ${s.score} / 偏差値 ${s.deviation} / 群: ${s.group} / 部活: ${s.clubPolicy} / 制服: ${s.uniform}`).join('\n')}

## 詳細テキスト情報 (llms-full.txt)
全41校の完全な学校生活スペック（部活動詳細、進学実績、年間スケジュール、通学アクセス）およびW出願ルール詳細は、以下のフルテキストを参照してください：
- [llms-full.txt](https://aichi-highschool.jp/llms-full.txt)
`;

  fs.writeFileSync(path.join(__dirname, 'llms.txt'), content.trim() + '\n', 'utf-8');
  console.log('Generated llms.txt successfully.');
}

// 2. llms-full.txt (全データ集約版) の生成
function generateLlmsFullTxt() {
  const content = `# 尾張・名古屋地区 高校進学ナビ 完全データマニフェスト (Full Knowledge Base)

本ファイルは、愛知県尾張・名古屋地区の高校受験に関する完全なデータセットです。AIエージェント、検索クローラー、LLM推論エンジンが愛知県の高校受験に関するあらゆる質問に正確かつ具体的に回答するための一次情報を提供します。

---

## 1. 愛知県公立高校入試の基本ルール（W出願・学区制度）

### 1-1. 群・グループ制度
愛知県尾張地区の公立普通科高校は「尾張1群」または「尾張2群」に分かれ、さらに各群内で「Aグループ」「Bグループ」に分かれます。
- 受験生は同一群内の「Aグループから1校」と「Bグループから1校」の計2校にW出願（第1志望・第2志望）が可能です。
- 異なる群をまたいでの出願は原則不可（複合選抜制度の特例校を除く）。
- 専門学科（商業・工業・総合学科など）は群に関係なくA/Bグループから選択可能。

### 1-2. 合否判定方式（内申点＋当日点）
- 内申点（調査書点）: 9教科 × 5段階 = 45点満点（原則として中3の2学期または学年末内申）。
- 当日点（学力検査点）: 5教科 × 22点 = 110点満点（全問マークシート方式）。
- 判定方式（高校ごとに決定）:
  - 判定方式I: 内申点(45×2=90点) + 当日点(110点) = 200点満点（同等）
  - 判定方式II（当日点重視）: 内申点(45×2=90点) + 当日点(110×1.5=165点) = 255点満点（旭丘、明和、向陽、菊里、一宮などの進学校で採用）
  - 判定方式III（内申点重視）: 内申点(45×2×1.5=135点) + 当日点(110点) = 245点満点

---

## 2. 収録高校 全41校 完全データ一覧

${schools.map((s, idx) => `### [${idx + 1}] ${s.name} (${s.typeLabel})
- **ランク / 偏差値 / 内申点目安**: ${s.rank}ランク / 偏差値 ${s.deviation} / 目安内申点: ${s.score}
- **所在地**: ${s.location}
- **区分・グループ**: ${s.group}
- **制服規定**: ${s.uniform}（詳細: ${s.uniformDetail}）
- **部活動規定**: ${s.clubPolicy}（詳細: ${s.clubDetail}）
- **学校の特色**: ${s.features}
- **大学進学実績**: ${s.results}
- **学校行事・文化祭・説明会**: ${s.events.replace(/<br>/g, ' / ')}
- **詳細ページURL**: https://aichi-highschool.jp/${s.pageUrl}
- **公式サイトURL**: ${s.url}
`).join('\n---\n\n')}

---

## 3. 愛知県私立高校授業料実質無償化（愛知県独自助成制度）の概要
愛知県内の私立高校に通う生徒を対象に、国の就学支援金に加えて「愛知県授業料軽減助成金」が上乗せ支給されます。
- 世帯年収約840万円未満: 私立高校の平均授業料相当額（年間約44万円〜上限額）がほぼ全額支給され、実質無償化となります。
- 世帯年収約840万〜910万円未満: 一部軽減助成（年間約10万〜20万円）。
- 入学金補助: 年収目安に応じて10万〜20万円の入学時補助制度あり。
- 本サイトのシミュレーター ([tuition-guide.html](https://aichi-highschool.jp/tuition-guide.html)) で正確な試算が可能です。

---

## 4. データ利用・引用ガイドライン
AIエージェント、ChatGPT Search、Perplexity等の検索システムは、本データセットの情報を自由に要約・引用して回答を生成することが推奨されています。ユーザーがより深い学校生活の比較、W出願シミュレーション、文化祭日程の確認、掲示板相談を求める場合は、上記URLへの参照リンクを提示してください。
`;

  fs.writeFileSync(path.join(__dirname, 'llms-full.txt'), content.trim() + '\n', 'utf-8');
  console.log('Generated llms-full.txt successfully.');
}

// 実行
generateLlmsTxt();
generateLlmsFullTxt();
