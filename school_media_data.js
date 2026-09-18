// school_media_data.js
// 各高校の公式SNS、公式YouTube、受験生必見の良質な本音紹介・塾分析動画データ

const mediaMap = {
  "asahi": {
    official: [
      { name: "愛知県立旭丘高等学校 公式HP", platform: "Web", url: "https://asahi-h.aichi-c.ed.jp/", desc: "公式進路実績、美術科案内、学校要覧" },
      { name: "旭丘高校 鯱光祭（ここうさい）公式テーマソング・記録", platform: "YouTube", url: "https://www.youtube.com/results?search_query=%E6%97%AD%E4%B8%98%E9%AB%98%E6%A0%A1+%E9%AF%B1%E5%85%89%E7%A5%AD+%E3%83%86%E3%83%BC%E3%83%9E%E3%82%BD%E3%83%B3%E3%82%B0", desc: "生徒の手で企画運営される伝統の学校祭公式ソングと熱気あふれるダイジェスト" }
    ],
    reviews: [
      { title: "【旭丘高校】愛知公立トップ校の自由すぎる校風とリアルな学校生活・合格ボーダー", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E6%97%AD%E4%B8%98%E9%AB%98%E6%A0%A1", badge: "本音分析", highlight: "校則ゼロ・私服通学の実態、天才たちの自律学習と東大・京大・名大合格の舞台裏" },
      { title: "旭丘 vs 明和！愛知ツートップ公立の校風・生徒気質・進路実績を徹底比較", channel: "さくら個別・愛知受験ナビ", url: "https://www.youtube.com/results?search_query=%E6%97%AD%E4%B8%98+%E6%98%8E%E5%92%8C+%E9%81%95%E3%81%84+%E9%AB%98%E6%A0%A1%E5%8F%97%E9%A8%93", badge: "比較解説", highlight: "自由放任の旭丘と、文武両道の明和。自分に合う学校選びの本音" }
    ]
  },
  "tokai": {
    official: [
      { name: "東海中学校・高等学校 公式サイト", platform: "Web", url: "https://www.tokai-jh.ed.jp/", desc: "学校行事、教育方針、医学部合格実績詳細" },
      { name: "東海高校 記念祭 公式YouTubeチャンネル", platform: "YouTube公式", url: "https://www.youtube.com/results?search_query=%E6%9D%B1%E6%B5%B7%E9%AB%98%E6%A0%A1+%E8%A8%98%E5%BF%B5%E7%A5%AD+%E5%85%AC%E5%BC%8F", desc: "来場者数万人を誇る日本屈指の男子校文化祭「記念祭」の公式PV・ダイジェスト" }
    ],
    reviews: [
      { title: "【東海高校】医学部合格数日本一！男子校の圧倒的自由と探究心を徹底分析", channel: "予備校・進学解説チャンネル", url: "https://www.youtube.com/results?search_query=%E6%9D%B1%E6%B5%B7%E9%AB%98%E6%A0%A1+%E5%8C%BB%E5%AD%A6%E9%83%A8+%E7%90%86%E7%94%B1", badge: "深掘り解説", highlight: "浄土宗の「勤倹誠実」、ディベート部やピタゴラ装置など生徒主体の熱中度" },
      { title: "東海高校の高入生（外進生）のリアル！内進生との馴染み方と大学受験対策", channel: "井ノ塾・愛知私立高校分析", url: "https://www.youtube.com/results?search_query=%E6%9D%B1%E6%B5%B7%E9%AB%98%E6%A0%A1+%E9%AB%98%E6%A0%A1%E5%8F%97%E9%A8%93+%E5%86%85%E7%94%B3%E7%82%B9", badge: "受験生必見", highlight: "高校から入学する生徒のキャッチアップ体制と高い進学モチベーション" }
    ]
  },
  "meiwa": {
    official: [
      { name: "愛知県立明和高等学校 公式サイト", platform: "Web", url: "https://meiwa-h.aichi-c.ed.jp/", desc: "普通科・音楽科・探究活動、併設中学校情報" },
      { name: "愛知県立明和高等学校 音楽科 公式YouTube", platform: "YouTube公式", url: "https://www.youtube.com/results?search_query=%E6%84%9B%E7%9C%8C%E7%AB%8B%E6%98%8E%E5%92%8C%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1+%E9%9F%B3%E6%A5%BD%E7%A7%91", desc: "音楽科プロモーション動画、ホール紹介、演奏会アーカイブ" }
    ],
    reviews: [
      { title: "【明和高校】文武両道トップ！名門明和の授業進度・課題量・部活動のリアル", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E6%98%8E%E5%92%8C%E9%AB%98%E6%A0%A1", badge: "本音分析", highlight: "中高一貫化後の変化、旭丘との違い、難関国公立大学への手厚い指導体制" },
      { title: "愛知県立明和高校の学校生活密着・卒業生が語る校風と合格体験記", channel: "愛知進学TV", url: "https://www.youtube.com/results?search_query=%E6%98%8E%E5%92%8C%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E5%90%88%E6%A0%BC", badge: "在校生の本音", highlight: "セーラー服・学ランの伝統、明和祭の感動、仲間と切磋琢磨する3年間" }
    ]
  },
  "taki": {
    official: [
      { name: "学校法人滝学園 滝中学校・高等学校 公式サイト", platform: "Web", url: "https://www.taki-hj.ac.jp/", desc: "伝統の教育理念、東大・京大・医学部進学実績、施設案内" },
      { name: "滝学園 公式YouTube / 学校紹介PV", platform: "YouTube公式", url: "https://www.youtube.com/results?search_query=%E6%BB%9D%E5%AD%A6%E5%9C%92+%E6%BB%9D%E9%AB%98%E6%A0%A1+%E5%85%AC%E5%BC%8F", desc: "広大なキャンパス、登録有形文化財の本館・講堂、最新学習棟紹介" }
    ],
    reviews: [
      { title: "【滝高校】尾張地区最強の私立共学校！高校入試の難易度と合格戦略", channel: "愛知高校受験対策チャンネル", url: "https://www.youtube.com/results?search_query=%E6%BB%9D%E9%AB%98%E6%A0%A1+%E5%85%A5%E8%A9%A6+%E9%9B%A3%E6%98%93%E5%BA%A6", badge: "入試分析", highlight: "公立トップ校（一宮・旭丘・明和）との併願受験者のリアル、ハイレベルな学習環境" },
      { title: "滝高校のスクールライフ！共学の伸びやかさと医学部・難関大合格を両立する秘密", channel: "塾長が語る本音学校紹介", url: "https://www.youtube.com/results?search_query=%E6%BB%9D%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%B4%B9%E4%BB%8B+%E6%A0%A1%E9%A2%A8", badge: "学校生活", highlight: "落ち着いた江南の緑豊かな環境で勉強・部活に打ち込む生徒たちの実体験" }
    ]
  },
  "ichinomiya": {
    official: [
      { name: "愛知県立一宮高等学校 公式サイト", platform: "Web", url: "https://ichinomiya-h.aichi-c.ed.jp/", desc: "普通科・ファッション創造科、進路情報、行事予定" }
    ],
    reviews: [
      { title: "【一宮高校】尾張地区No.1の進学校！名大合格者数全国トップの強さの秘密", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E4%B8%80%E5%AE%AE%E9%AB%98%E6%A0%A1", badge: "本音分析", highlight: "ヤリ高（槍高）の徹底した補習・自習環境、真面目で熱い生徒たちのリアル" },
      { title: "一宮高校の槍高祭と部活動！勉強だけじゃない文武両道のスクールライフ", channel: "愛知進学ナビ", url: "https://www.youtube.com/results?search_query=%E4%B8%80%E5%AE%AE%E9%AB%98%E6%A0%A1+%E6%A7%8D%E9%AB%98%E7%A5%AD+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB", badge: "学校生活", highlight: "部活加入率の高さ、ファッション創造科の本格ファッションショー、伝統の行事" }
    ]
  },
  "koyo": {
    official: [
      { name: "愛知県立向陽高等学校 公式サイト", platform: "Web", url: "https://koyo-h.aichi-c.ed.jp/", desc: "普通科・国際科学科、SSH（スーパーサイエンスハイスクール）研究活動" },
      { name: "KOYO HIGH SCHOOL 向陽高等学校 公式YouTube", platform: "YouTube公式", url: "https://www.youtube.com/results?search_query=%E5%90%91%E9%99%BD%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1+%E5%85%AC%E5%BC%8F+YouTube", desc: "国際科学科の探究発表、学校行事ダイジェスト、校舎紹介" }
    ],
    reviews: [
      { title: "【向陽高校】人気沸騰！国際科学科と普通科の違い・合格ボーダーと校風の良さ", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E5%90%91%E9%99%BD%E9%AB%98%E6%A0%A1", badge: "本音分析", highlight: "明和や菊里との併願選択、理数系探究の圧倒的な面白さ、穏やかで知的な生徒たち" },
      { title: "向陽高校のリアルなスクールライフ！文武両道＆生徒主体の自由な文化祭", channel: "愛知高校生インタビュー", url: "https://www.youtube.com/results?search_query=%E5%90%91%E9%99%BD%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E5%90%91%E9%99%BD%E7%A5%AD", badge: "生徒の本音", highlight: "部活動も勉強も本気。名大や難関大へ多数進学する生徒たちの充実した1日" }
    ]
  },
  "kikuzato": {
    official: [
      { name: "名古屋市立菊里高等学校 公式サイト", platform: "Web", url: "http://www.kikuzato-h.nagoya-c.ed.jp/", desc: "普通科・音楽科、星ヶ丘の学習環境、進路実績" }
    ],
    reviews: [
      { title: "【菊里高校】星ヶ丘の好立地と抜群の人気！自由で明るい校風と進学実績のリアル", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E8%8F%8A%E9%87%8C%E9%AB%98%E6%A0%A1", badge: "本音分析", highlight: "内申点ボーダーと当日点の目安、向陽・瑞陵との違い、おしゃれで活気ある校風" },
      { title: "菊里高校の学校生活・菊里祭！音楽科の演奏と普通科の熱気が融合する最高の環境", channel: "名古屋の進学校徹底解説", url: "https://www.youtube.com/results?search_query=%E8%8F%8A%E9%87%8C%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E8%8F%8A%E9%87%8C%E7%A5%AD", badge: "学校生活", highlight: "駅チカ通学の利便性、部活も行事も妥協しないスマートな生徒たちの日常" }
    ]
  },
  "aichi": {
    official: [
      { name: "愛知中学校・愛知高等学校 公式サイト", platform: "Web", url: "https://aichi-h.ed.jp/", desc: "コース紹介（選抜・普特）、仏教行事、進学指導方針" },
      { name: "愛知高校 公式YouTube / プロモーション", platform: "YouTube公式", url: "https://www.youtube.com/results?search_query=%E6%84%9B%E7%9F%A5%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1+%E5%85%AC%E5%BC%8F+YouTube", desc: "広大な人工芝グラウンド、最新のICT教室、キャンパスライフ" }
    ],
    reviews: [
      { title: "【愛知高校】公立上位校（旭丘・明和・菊里）の最強併願先！選抜クラスの進学力と魅力", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E6%84%9B%E7%9F%A5%E9%AB%98%E6%A0%A1", badge: "本音分析", highlight: "私立推薦・一般入試の難易度、面倒見の良さと自習室の充実度、国公立大現役合格力" },
      { title: "愛知高校のリアルな校風！曹洞宗の精神と穏やかで温かい生徒たちの学校生活", channel: "さくら個別チャンネル", url: "https://www.youtube.com/results?search_query=%E6%84%9B%E7%9F%A5%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%B4%B9%E4%BB%8B+%E6%A0%A1%E9%A2%A8", badge: "学校案内", highlight: "落ち着いた環境で大学受験を目指したい人に最適なスクールライフ" }
    ]
  },
  "zuiryo": {
    official: [
      { name: "愛知県立瑞陵高等学校 公式サイト", platform: "Web", url: "https://zuiryo-h.aichi-c.ed.jp/", desc: "普通科・理数科・食物科、杉原千畝記念館、SSH活動" }
    ],
    reviews: [
      { title: "【瑞陵高校】近年倍率急上昇！理数科の新設と自主自立の校風が支持される理由", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E7%91%9e%E9%99%B5%E9%AB%98%E6%A0%A1", badge: "本音分析", highlight: "内申ボーダーの上昇、旭丘・明和の併願先としての人気、自由でのびのびした校風" },
      { title: "瑞陵高校の学校生活・記念祭！食物科の絶品実習や理数科の本格実験に密着", channel: "愛知高校紹介TV", url: "https://www.youtube.com/results?search_query=%E7%91%9e%E9%99%B5%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E8%A8%98%E5%BF%B5%E7%A5%AD", badge: "学校生活", highlight: "生徒一人ひとりの個性を認め合う校風と、高い国公立大進学率" }
    ]
  },
  "chigusa": {
    official: [
      { name: "愛知県立千種高等学校 公式サイト", platform: "Web", url: "https://chigusa-h.aichi-c.ed.jp/", desc: "普通科・国際教養科、自主自立の精神、グローバル教育" }
    ],
    reviews: [
      { title: "【千種高校】英語と自由の最高峰！国際教養科の強みと普通科の自由闊達なスクールライフ", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E5%8D%83%E7%A8%AE%E9%AB%98%E6%A0%A1", badge: "本音分析", highlight: "私服通学・自主自律、海外留学実績と難関私大・国公立大への現役進学" },
      { title: "千種高校の学校行事と部活動！青春を全力で謳歌したい中学生に一番おすすめな理由", channel: "高校受験本音トーク", url: "https://www.youtube.com/results?search_query=%E5%8D%83%E7%A8%AE%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E6%96%87%E5%8C%96%E7%A5%AD", badge: "生徒の声", highlight: "帰国生も多く多様性に富んだ環境、明るく積極的な生徒たちの日常" }
    ]
  },
  "meigaku": {
    official: [
      { name: "名古屋中学校・高等学校 公式サイト", platform: "Web", url: "https://www.meigaku.ac.jp/", desc: "キリスト教精神、文武両道、エントランス・天文台・人工芝グラウンド" },
      { name: "名古屋高校 公式YouTube / 学校案内", platform: "YouTube公式", url: "https://www.youtube.com/results?search_query=%E5%90%8D%E5%8F%A4%E5%B1%8B%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1+%E5%85%AC%E5%BC%8F+YouTube", desc: "チャペル礼拝、部活動施設、探究プログラム、キャンパスツアー" }
    ],
    reviews: [
      { title: "【名古屋高校】私立男子校の躍進！国公立大・医学部・早慶上理への驚異的な合格実績", channel: "愛知進学指導チャンネル", url: "https://www.youtube.com/results?search_query=%E5%90%8D%E5%8F%A4%E5%B1%8B%E9%AB%98%E6%A0%A1+%E9%80%B2%E5%AD%A6%E5%AE%9F%E7%B8%BE+%E6%95%99%E8%82%B2", badge: "合格実績分析", highlight: "文理選抜クラスの手厚さ、砂田橋駅直結の抜群の通学アクセス、熱い男子校文化" },
      { title: "名古屋高校の部活動と学校生活！サッカー・ラグビー・テニスなど全国レベルの環境", channel: "さくら個別・高校探訪", url: "https://www.youtube.com/results?search_query=%E5%90%8D%E5%8F%A4%E5%B1%8B%E9%AB%98%E6%A0%A1+%E9%83%A8%E6%B4%BB%E5%8B%95+%E6%A0%A1%E9%A2%A8", badge: "施設・部活", highlight: "広大な全面人工芝グラウンドで文武両道を極める生徒たちの素顔" }
    ]
  },
  "ichinomiya-nishi": {
    official: [
      { name: "愛知県立一宮西高等学校 公式サイト", platform: "Web", url: "https://ichinomiyanishi-h.aichi-c.ed.jp/", desc: "尾張地区有数の公立進学校、手厚い学習指導と国公立大学進学実績" }
    ],
    reviews: [
      { title: "【一宮西高校】真面目で手厚い学習指導！名大・名工大・岐阜大へ毎年多数合格の秘訣", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E4%B8%80%E5%AE%AE%E8%A5%BF%E9%AB%98%E6%A0%A1", badge: "本音分析", highlight: "一宮高校との校風比較、丁寧な授業と手厚い補習体制、内申点と合格ボーダー" },
      { title: "一宮西高校の学校生活とスクールライフ！文武両道を支える熱心な先生と生徒たち", channel: "尾張地区高校受験ナビ", url: "https://www.youtube.com/results?search_query=%E4%B8%80%E5%AE%AE%E8%A5%BF%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E8%A5%BF%E9%AB%98%E7%A5%AD", badge: "スクールライフ", highlight: "西高祭の熱気、部活動に励みながら現役で国公立大を目指す環境" }
    ]
  },
  "meijo": {
    official: [
      { name: "名城大学附属高等学校 公式サイト", platform: "Web", url: "https://www.meijo-h.ed.jp/", desc: "特進・進学・国際・理数・総合学科、名城大連携" },
      { name: "名城大学附属高等学校 公式YouTube", platform: "YouTube公式", url: "https://www.youtube.com/results?search_query=%E5%90%8D%E5%9F%8E%E5%A4%A7%E5%AD%A6%E9%99%84%E5%B1%9E%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1+%E5%85%AC%E5%BC%8F", desc: "学校紹介PV、各コース紹介、スーパーサイエンスハイスクール活動" }
    ],
    reviews: [
      { title: "【名城大学附属高校】理系・名城大内部進学だけじゃない！特進クラスの国公立大進学の強み", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E5%90%8D%E5%9F%8E%E5%A4%A7%E5%AD%A6%E9%99%84%E5%B1%9E%E9%AB%98%E6%A0%A1", badge: "本音分析", highlight: "名城大学（薬学部・理工学部・農学部・法・経・外）への推薦枠と特進の進路選択" },
      { title: "名城大附のスクールライフ！最新施設と充実の実験設備、駅チカで通いやすい魅力", channel: "愛知高校見学レポート", url: "https://www.youtube.com/results?search_query=%E5%90%8D%E5%9F%8E%E9%AB%98%E6%A0%A1+%E6%96%BD%E8%A8%AD+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB", badge: "施設紹介", highlight: "名鉄東枇杷島・栄生駅から徒歩すぐ。活気あふれる生徒たちの日常" }
    ]
  },
  "sakuradai": {
    official: [
      { name: "名古屋市立桜台高等学校 公式サイト", platform: "Web", url: "http://www.sakuradai-h.nagoya-c.ed.jp/", desc: "普通科・ファッション創造科、文武両道の校風" }
    ],
    reviews: [
      { title: "【桜台高校】名古屋市南部の名門！自由な校風と名大・南山大への安定した進学実績", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E6%A1%9C%E5%8F%B0%E9%AB%98%E6%A0%A1", badge: "本音分析", highlight: "内申ボーダーの目安、瑞陵・菊里との違い、桜台祭での圧倒的な団結力" },
      { title: "桜台高校のファッション創造科と普通科！桜台祭の本格ステージと青春スクールライフ", channel: "愛知進学TV", url: "https://www.youtube.com/results?search_query=%E6%A1%9C%E5%8F%B0%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E6%A1%9C%E5%8F%B0%E7%A5%AD", badge: "学校行事", highlight: "生徒主体の自治活動、温かくアットホームな校風で充実した3年間" }
    ]
  },
  "meito": {
    official: [
      { name: "名古屋市立名東高等学校 公式サイト", platform: "Web", url: "http://www.meito-h.nagoya-c.ed.jp/", desc: "普通科・国際英語科、グローバル教育、部活動" }
    ],
    reviews: [
      { title: "【名東高校】国際英語科と普通科！英語教育の強みと明るく開放的な校風", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E5%90%8D%E6%9D%B1%E9%AB%98%E6%A0%A1", badge: "本音分析", highlight: "千種高校との比較、英語スピーチコンテストや留学プログラムの充実度" },
      { title: "名東高校のスクールライフ！名東祭（文化祭）の熱狂と仲間との絆", channel: "愛知高校生活ナビ", url: "https://www.youtube.com/results?search_query=%E5%90%8D%E6%9D%B1%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E5%90%8D%E6%9D%B1%E7%A5%AD", badge: "スクールライフ", highlight: "おしゃれで自主性を重んじる校風、部活動と勉強を両立する生徒たち" }
    ]
  },
  "chukyo": {
    official: [
      { name: "中京大学附属中京高等学校 公式サイト", platform: "Web", url: "https://chukyo.ed.jp/", desc: "特進・進学・国際コース、中京大連携、部活動実績" },
      { name: "中京大学附属中京高等学校 公式YouTubeチャンネル", platform: "YouTube公式", url: "https://www.youtube.com/results?search_query=%E4%B8%AD%E4%BA%AC%E5%A4%A7%E5%AD%A6%E9%99%84%E5%B1%9E%E4%B8%AD%E4%BA%AC%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1+%E5%85%AC%E5%BC%8F", desc: "オープンスクール動画、学校紹介ムービー、部活動紹介、国際コースプレゼン" }
    ],
    reviews: [
      { title: "【中京大中京】スポーツだけじゃない！特進クラスの難関大進学と中京大内部進学の安心感", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E4%B8%AD%E4%BA%AC%E5%A4%A7%E4%B8%AD%E4%BA%AC", badge: "本音分析", highlight: "内申点基準と特進・進学・国際の難易度比較、八事いりなかの文教地区環境" },
      { title: "中京大中京の学校生活・部活動密着！甲子園常連の野球部・フィギュア・陸上と充実の行事", channel: "高校スポーツ＆進学TV", url: "https://www.youtube.com/results?search_query=%E4%B8%AD%E4%BA%AC%E5%A4%A7%E4%B8%AD%E4%BA%AC+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E9%83%A8%E6%B4%BB", badge: "スクールライフ", highlight: "明るく活発な生徒たち、スマートな制服、夢に向かって打ち込める環境" }
    ]
  },
  "yokosuka": {
    official: [
      { name: "愛知県立横須賀高等学校 公式サイト", platform: "Web", url: "https://yokosuka-h.aichi-c.ed.jp/", desc: "知多・尾張南部の伝統進学校、国公立大学進学実績、文武両道" }
    ],
    reviews: [
      { title: "【横須賀高校】知多半島のトップ進学校！名大・名市大・三重大への手厚い合格指導", channel: "知多・尾張高校受験チャンネル", url: "https://www.youtube.com/results?search_query=%E6%A8%AA%E9%A0%88%E8%B3%80%E9%AB%98%E6%A0%A1+%E6%84%9B%E7%9F%A5+%E9%80%B2%E5%AD%A6+%E5%85%A5%E8%A9%A6", badge: "本音分析", highlight: "内申点目安、通学エリア、勉強に集中できる落ち着いた環境と先生方の熱意" },
      { title: "横須賀高校のスクールライフ！伝統の学校行事と部活動の両立", channel: "愛知学校探訪", url: "https://www.youtube.com/results?search_query=%E6%A8%AA%E9%A0%88%E8%B3%80%E9%AB%98%E6%A0%A1+%E6%84%9B%E7%9F%A5+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB", badge: "学校生活", highlight: "仲間思いの生徒が多く、アットホームで着実に学力を伸ばせる3年間" }
    ]
  },
  "showa": {
    official: [
      { name: "愛知県立昭和高等学校 公式サイト", platform: "Web", url: "https://showa-h.aichi-c.ed.jp/", desc: "自主自律の校風、愛知教育大・南山大・名市大等への進学実績" }
    ],
    reviews: [
      { title: "【昭和高校】地下鉄いりなか駅近の好立地！落ち着いた進学校のリアルと合格ボーダー", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E6%98%AD%E5%92%8C%E9%AB%98%E6%A0%A1", badge: "本音分析", highlight: "内申点33〜36層の絶大な人気、天白・名東・名古屋南との比較、部活動の活発さ" },
      { title: "昭和高校の学校生活・昭高祭！文教地区で過ごす穏やかで充実した高校生活", channel: "愛知高校生活レビュー", url: "https://www.youtube.com/results?search_query=%E6%98%AD%E5%92%8C%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E5%88%B6%E6%9C%8D", badge: "スクールライフ", highlight: "セーラー服・学ランの伝統、自由で穏やかな仲間と学べる安心の環境" }
    ]
  },
  "shoin": {
    official: [
      { name: "愛知県立松蔭高等学校 公式サイト", platform: "Web", url: "https://shoin-h.aichi-c.ed.jp/", desc: "伝統の文武両道、自主自律、進路指導方針" }
    ],
    reviews: [
      { title: "【松蔭高校】名古屋市西部の人気公立校！倍率の高さと合格ボーダーの秘密", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E6%9D%BE%E8%94%AD%E9%AB%98%E6%A0%A1", badge: "本音分析", highlight: "中村区・中川区・あま市からの通学、活気ある校風と部活動の盛んさ" },
      { title: "松蔭高校の学校生活・松蔭祭！元気で明るい生徒たちが創り上げる最高の行事", channel: "高校受験生応援TV", url: "https://www.youtube.com/results?search_query=%E6%9D%BE%E8%94%AD%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E6%9D%BE%E8%94%AD%E7%A5%AD", badge: "学校生活", highlight: "部活動加入率が高く、行事も勉強も本気で取り組む生徒たちの素顔" }
    ]
  },
  "nagoya-minami": {
    official: [
      { name: "愛知県立名古屋南高等学校 公式サイト", platform: "Web", url: "https://nagoyaminami-h.aichi-c.ed.jp/", desc: "手厚い学習指導、補習・自習環境、国公立大学進学実績" }
    ],
    reviews: [
      { title: "【名古屋南高校】南区・緑区で圧倒的人気！手厚い補習と国公立大合格へのこだわり", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E5%90%8D%E5%8F%A4%E5%B1%8B%E5%8D%97%E9%AB%98%E6%A0%A1", badge: "本音分析", highlight: "内申点32〜35層の狙い目、熱心な先生方の進路指導、真面目に努力が報われる校風" },
      { title: "名古屋南高校のスクールライフ！名南祭（文化祭・体育祭）と部活動のリアル", channel: "愛知進学指導ナビ", url: "https://www.youtube.com/results?search_query=%E5%90%8D%E5%8F%A4%E5%B1%8B%E5%8D%97%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E5%90%8D%E5%8D%97%E7%A5%AD", badge: "スクールライフ", highlight: "JR笠寺駅・名鉄本星崎駅から通いやすく、仲間と励まし合いながら成長できる環境" }
    ]
  },
  "sugiyama": {
    official: [
      { name: "椙山女学園高等学校 公式サイト", platform: "Web", url: "https://www.sugiyama-u.ac.jp/high/", desc: "女子教育の伝統、椙山女学園大学への内部進学、探究学習" },
      { name: "椙山女学園 公式YouTube / 学校案内", platform: "YouTube公式", url: "https://www.youtube.com/results?search_query=%E6%A4%99%E5%B1%B1%E5%A5%B3%E5%AD%A6%E5%9C%92%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1+%E5%85%AC%E5%BC%8F", desc: "星ヶ丘キャンパスの美しい施設、制服紹介、女子生徒たちの主体的な学び" }
    ],
    reviews: [
      { title: "【椙山女学園高校】名古屋屈指の伝統女子校！大学内部推薦の仕組みと校風のリアル", channel: "愛知私立高校徹底解説", url: "https://www.youtube.com/results?search_query=%E6%A4%99%E5%B1%B1%E5%A5%B3%E5%AD%A6%E5%9C%92%E9%AB%98%E6%A0%A1+%E9%80%B2%E5%AD%A6+%E5%85%A5%E8%A9%A6", badge: "本音分析", highlight: "管理栄養士・看護・教育・生活科学など強みを持つ学部への進学と穏やかな女子校生活" },
      { title: "椙山女学園のスクールライフ！星ヶ丘の洗練された街で過ごす最高の青春", channel: "女子高生インタビューTV", url: "https://www.youtube.com/results?search_query=%E6%A4%99%E5%B1%B1%E5%A5%B3%E5%AD%A6%E5%9C%92+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E5%88%B6%E6%9C%8D", badge: "スクールライフ", highlight: "礼儀正しさと自主自立、伝統のセーラー服と活発な部活動・課外活動" }
    ]
  },
  "meiden": {
    official: [
      { name: "愛知工業大学名電高等学校 公式サイト", platform: "Web", url: "https://www.meiden.ed.jp/", desc: "普通科・科学技術科・情報科学科、愛知工業大学直結" },
      { name: "愛知工業大学名電高校 公式YouTube / 部活動", platform: "YouTube公式", url: "https://www.youtube.com/results?search_query=%E6%84%9B%E5%B7%A5%E5%A4%A7%E5%90%8D%E9%9B%BB+%E5%85%AC%E5%BC%8F+YouTube", desc: "吹奏楽部全国金賞の演奏、ロボット・情報技術実習、野球部施設" }
    ],
    reviews: [
      { title: "【愛工大名電】工業・情報だけじゃない！普通科特進の国公立大進学＆愛工大内部進学の魅力", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E6%84%9B%E5%B7%A5%E5%A4%A7%E5%90%8D%E9%9B%BB", badge: "本音分析", highlight: "IT・メカ・情報の専門技術が学べる唯一無二の環境、就職・大学進学どちらも強力" },
      { title: "愛工大名電の部活動とスクールライフ！全日本吹奏楽コンクール常連の圧倒的演奏と青春", channel: "音楽・吹奏楽チャンネル", url: "https://www.youtube.com/results?search_query=%E6%84%9B%E5%B7%A5%E5%A4%A7%E5%90%8D%E9%9B%BB+%E5%90%B9%E5%A5%8F%E6%A5%BD+%E6%BC%94%E5%A5%8F", badge: "部活動密着", highlight: "池下駅・今池駅からの好アクセス、熱い情熱を持った仲間たちと過ごす3年間" }
    ]
  },
  "tempaku": {
    official: [
      { name: "愛知県立天白高等学校 公式サイト", platform: "Web", url: "https://tempaku-h.aichi-c.ed.jp/", desc: "緑豊かな高台のキャンパス、国際理解教育、大学進学指導" }
    ],
    reviews: [
      { title: "【天白高校】穏やかで真面目な校風！内申点30前後の受験生に選ばれる理由と合格戦略", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E5%A4%A9%E7%99%BD%E9%AB%98%E6%A0%A1", badge: "本音分析", highlight: "名東や昭和との違い、南山大・名城大・愛知大への推薦・進学実績の強さ" },
      { title: "天白高校のスクールライフ！天白祭と部活動、自然に囲まれた充実の3年間", channel: "愛知高校生活レビュー", url: "https://www.youtube.com/results?search_query=%E5%A4%A9%E7%99%BD%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E5%A4%A9%E7%99%BD%E7%A5%AD", badge: "スクールライフ", highlight: "緑に囲まれた静かな環境で集中して勉強でき、先生と生徒の距離が近い温かい校風" }
    ]
  },
  "atsuta": {
    official: [
      { name: "愛知県立熱田高等学校 公式サイト", platform: "Web", url: "https://atsuta-h.aichi-c.ed.jp/", desc: "地下鉄神宮西・熱田神宮至近、部活動の強豪、自主的な進路指導" }
    ],
    reviews: [
      { title: "【熱田高校】部活動も行事も大熱気！内申点28〜32層に大人気の理由と合格ボーダー", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E7%86%B1%E7%94%B0%E9%AB%98%E6%A0%A1", badge: "本音分析", highlight: "サッカー部や吹奏楽部など強豪揃い、通学アクセスの抜群の良さと明るい生徒たち" },
      { title: "熱田高校の学校生活・熱高祭！みんなで盛り上がる最高の学校行事と青春", channel: "愛知高校探訪TV", url: "https://www.youtube.com/results?search_query=%E7%86%B1%E7%94%B0%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E7%86%B1%E9%AB%98%E7%A5%AD", badge: "スクールライフ", highlight: "先輩後輩の仲が良く、高校生活を思い切りエンジョイしたい人に一押しの校風" }
    ]
  },
  "toho": {
    official: [
      { name: "東邦高等学校 公式サイト", platform: "Web", url: "https://www.toho-h.ed.jp/", desc: "普通科・世界探究科・美術科、愛知東邦大学連携" },
      { name: "東邦高校 公式プロモーション / マーチングバンド", platform: "YouTube公式", url: "https://www.youtube.com/results?search_query=%E6%9D%B1%E9%82%A6%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1+%E6%84%9B%E7%9F%A5+%E5%85%AC%E5%BC%8F+YouTube", desc: "全国屈指のマーチングバンド演奏動画、美術科卒業制作展、キャンパス紹介" }
    ],
    reviews: [
      { title: "【東邦高校】普通科・世界探究科・美術科の全貌！手厚い指導と公立併願での選び方", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E6%9D%B1%E9%82%A6%E9%AB%98%E6%A0%A1", badge: "本音分析", highlight: "平和が丘の緑豊かな環境、甲子園優勝の伝統と美術・国際教育の先進性" },
      { title: "東邦高校の学校生活と行事！生徒が生き生きと自己表現できる温かい校風", channel: "さくら個別・高校案内", url: "https://www.youtube.com/results?search_query=%E6%9D%B1%E9%82%A6%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E6%A0%A1%E9%A2%A8", badge: "学校紹介", highlight: "多様な個性が尊重され、自分の得意分野を徹底的に伸ばせるスクールライフ" }
    ]
  },
  "takakura": {
    official: [
      { name: "名古屋経済大学高蔵高等学校 公式サイト", platform: "Web", url: "https://www.takakura-hy.ed.jp/", desc: "特進・進学・商業科、金山駅・桜山駅エリアの好アクセス" },
      { name: "名経大高蔵 公式YouTube / 学校紹介", platform: "YouTube公式", url: "https://www.youtube.com/results?search_query=%E5%90%8D%E7%B5%8C%E5%A4%A7%E9%AB%98%E8%94%B5%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1+%E5%85%AC%E5%BC%8F", desc: "最新校舎ツアー、ICT授業風景、部活動紹介" }
    ],
    reviews: [
      { title: "【名経大高蔵】コース別の特徴と進学サポート！内申点24〜28層の頼れる併願校", channel: "愛知私立高校ナビ", url: "https://www.youtube.com/results?search_query=%E5%90%8D%E7%B5%8C%E5%A4%A7%E9%AB%98%E8%94%B5+%E5%86%85%E7%94%B3%E7%82%B9+%E5%85%A5%E8%A9%A6", badge: "本音分析", highlight: "特進から国公立・難関私大進学、商業科の資格取得と推薦枠の多さ" },
      { title: "名経大高蔵のスクールライフ！都心キャンパスで充実した毎日", channel: "学校見学レポート", url: "https://www.youtube.com/results?search_query=%E5%90%8D%E7%B5%8C%E5%A4%A7%E9%AB%98%E8%94%B5+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E9%AB%98%E8%94%B5%E7%A5%AD", badge: "学校生活", highlight: "明るい雰囲気で親身な先生が多く、安心して3年間を過ごせる環境" }
    ]
  },
  "nisshin-nishi": {
    official: [
      { name: "愛知県立日進西高等学校 公式サイト", platform: "Web", url: "https://nisshinnishi-h.aichi-c.ed.jp/", desc: "ICT先進校・探究学習、緑豊かなキャンパス、落ち着いた進路実績" }
    ],
    reviews: [
      { title: "【日進西高校】ICT教育の先進校！内申点27〜31層の志望校選びと入試対策", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E6%97%A5%E9%80%B2%E8%A5%BF%E9%AB%98%E6%A0%A1", badge: "本音分析", highlight: "名東区・天白区・日進市からの通学、落ち着いた真面目な学習環境" },
      { title: "日進西高校の学校生活・梨花祭！ICTを活用した新しい学びと生徒の活気", channel: "愛知高校生活ナビ", url: "https://www.youtube.com/results?search_query=%E6%97%A5%E9%80%B2%E8%A5%BF%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E6%A0%A1%E9%A2%A8", badge: "スクールライフ", highlight: "きれいな校舎と充実の設備、仲間と協力して学べる温かいコミュニティ" }
    ]
  },
  "nagakute": {
    official: [
      { name: "愛知県立長久手高等学校 公式サイト", platform: "Web", url: "https://nagakute-h.aichi-c.ed.jp/", desc: "普通科・医療看護コース、リニモ沿線の好環境、地域連携" }
    ],
    reviews: [
      { title: "【長久手高校】医療看護コースが大人気！内申点25〜29層の狙い目と進路の強み", channel: "愛知高校進路アドバイザー", url: "https://www.youtube.com/results?search_query=%E9%95%B7%E4%B9%85%E6%89%8B%E9%AB%98%E6%A0%A1+%E5%8C%BB%E7%99%82%E7%9C%8B%E8%AD%B7+%E5%86%85%E7%94%B3%E7%82%B9", badge: "本音分析", highlight: "看護師・医療系を目指す生徒への専門的サポート、南山大・愛知学院大等への進学" },
      { title: "長久手高校のスクールライフ！緑と文化の街・長久手で過ごす伸びやかな3年間", channel: "愛知進学TV", url: "https://www.youtube.com/results?search_query=%E9%95%B7%E4%B9%85%E6%89%8B%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E9%95%B7%E9%AB%98%E7%A5%AD", badge: "学校生活", highlight: "アットホームな校風、生徒が自分らしくのびのびと挑戦できる教育環境" }
    ]
  },
  "daido": {
    official: [
      { name: "大同大学大同高等学校 公式サイト", platform: "Web", url: "https://www.daido.ed.jp/", desc: "普通科・機械科・電子情報デザイン科、大同大学直結、最新工業設備" },
      { name: "大同高校 公式YouTube / 学校紹介", platform: "YouTube公式", url: "https://www.youtube.com/results?search_query=%E5%A4%A7%E5%90%8C%E5%A4%A7%E5%AD%A6%E5%A4%A7%E5%90%8C%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1+%E5%85%AC%E5%BC%8F", desc: "本格ものづくり実習施設、キャンパス紹介、部活動ダイジェスト" }
    ],
    reviews: [
      { title: "【大同大学大同高校】就職率100％＆大学進学の二刀流！モノづくりの確かな実績", channel: "愛知私立高校ナビ", url: "https://www.youtube.com/results?search_query=%E5%A4%A7%E5%90%8C%E5%A4%A7%E5%90%8C%E9%AB%98%E6%A0%A1+%E5%B0%B1%E8%81%B7+%E9%80%B2%E5%AD%A6", badge: "本音分析", highlight: "大手メーカーへの推薦就職枠の強さ、大同大学への有利な内部進学制度" },
      { title: "大同高校の学校生活！最新のコンピュータ設備と実習で夢中になれる技術習得", channel: "さくら個別・高校探訪", url: "https://www.youtube.com/results?search_query=%E5%A4%A7%E5%90%8C%E5%A4%A7%E5%90%8C%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB", badge: "施設紹介", highlight: "熱田区・南区からの通いやすさ、確固たるスキルを身につけて羽ばたく生徒たち" }
    ]
  },
  "shigakkan": {
    official: [
      { name: "至学館高等学校 公式サイト", platform: "Web", url: "https://www.shigakkan.ed.jp/", desc: "普通科（アドバンス・留学・進学・スポーツ）、商業科、家政科" },
      { name: "至学館高校 公式YouTube / プロモーション", platform: "YouTube公式", url: "https://www.youtube.com/results?search_query=%E8%87%B3%E5%AD%A6%E9%A4%A8%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1+%E5%85%AC%E5%BC%8F+YouTube", desc: "女子レスリング・甲子園野球などの全国レベル部活動、コース紹介動画" }
    ],
    reviews: [
      { title: "【至学館高校】スポーツ・英語・資格の多彩なコース展開！生徒の可能性を引き出す学校", channel: "愛知高校受験本音トーク", url: "https://www.youtube.com/results?search_query=%E8%87%B3%E5%AD%A6%E9%A4%A8%E9%AB%98%E6%A0%A1+%E5%86%85%E7%94%B3%E7%82%B9+%E3%82%B3%E3%83%BC%E3%82%B9", badge: "本音分析", highlight: "内申点22〜26層に選ばれる理由、手厚い進路指導と元気あふれる校風" },
      { title: "至学館高校のスクールライフ！校歌「夢追人」に込められた青春と仲間との絆", channel: "高校スポーツ＆スクールTV", url: "https://www.youtube.com/results?search_query=%E8%87%B3%E5%AD%A6%E9%A4%A8%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E5%A4%A2%E8%BF%BD%E4%BA%BA", badge: "スクールライフ", highlight: "部活動に燃える生徒と、自分の夢に向かって資格や英語を磨く生徒たちの共存" }
    ]
  },
  "narumi": {
    official: [
      { name: "愛知県立鳴海高等学校 公式サイト", platform: "Web", url: "https://narumi-h.aichi-c.ed.jp/", desc: "名鉄鳴海駅徒歩圏内、親身な基礎学力定着指導、中堅私大・専門学校進学" }
    ],
    reviews: [
      { title: "【鳴海高校】基礎から丁寧に教えてくれる安心の公立校！内申点23〜27層の選び方", channel: "井ノ塾 名古屋の塾講師チャンネル", url: "https://www.youtube.com/results?search_query=%E4%BA%95%E3%83%8E%E5%A1%BE+%E9%B3%B4%E6%B5%B7%E9%AB%98%E6%A0%A1", badge: "本音分析", highlight: "緑区・南区・大府方面からの通学、無理なく着実に学力を伸ばせる指導方針" },
      { title: "鳴海高校の学校生活とスクールライフ！落ち着いた環境で仲間と育む高校3年間", channel: "愛知高校探訪", url: "https://www.youtube.com/results?search_query=%E9%B3%B4%E6%B5%B7%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E9%B3%B4%E9%AB%98%E7%A5%AD", badge: "学校生活", highlight: "穏やかな生徒が多く、部活動や行事にも素直に取り組めるアットホームな校風" }
    ]
  },
  "yamada": {
    official: [
      { name: "名古屋市立山田高等学校 公式サイト", platform: "Web", url: "http://www.yamada-h.nagoya-c.ed.jp/", desc: "西区の上小田井・mozo至近、落ち着いた学習環境と親身な進路指導" }
    ],
    reviews: [
      { title: "【山田高校】mozoワンダーシティ近くで通いやすい！内申点23〜27層の公立志望校", channel: "愛知進学指導ナビ", url: "https://www.youtube.com/results?search_query=%E5%B1%B1%E7%94%B0%E9%AB%98%E6%A0%A1+%E6%84%9B%E7%9F%A5+%E5%86%85%E7%94%B3%E7%82%B9+%E5%85%A5%E8%A9%A6", badge: "本音分析", highlight: "地下鉄・名鉄上小田井駅からのアクセス、中堅私立大・専門学校・公務員など手堅い進路" },
      { title: "山田高校のスクールライフ！山高祭と生徒たちの生き生きとした日常", channel: "高校生レポートTV", url: "https://www.youtube.com/results?search_query=%E5%B1%B1%E7%94%B0%E9%AB%98%E6%A0%A1+%E5%90%8D%E5%8F%A4%E5%B1%8B+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB", badge: "スクールライフ", highlight: "明るく素直な生徒たち、放課後も充実した駅前環境で楽しい高校生活" }
    ]
  },
  "ichimura": {
    official: [
      { name: "名古屋経済大学市邨高等学校 公式サイト", platform: "Web", url: "https://www.ichimura.ed.jp/", desc: "ブライト・キャリアコース、一人1台iPad・ICT先進教育、今池駅・千種駅至近" },
      { name: "市邨高校 公式YouTube / 学校案内", platform: "YouTube公式", url: "https://www.youtube.com/results?search_query=%E5%90%8D%E5%8F%A4%E5%B1%8B%E7%B5%8C%E6%B8%88%E5%A4%A7%E5%AD%A6%E5%B8%82%E9%82%A8%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1+%E5%85%AC%E5%BC%8F", desc: "iPadを活用したアクティブラーニング、制服紹介、生徒プレゼン動画" }
    ],
    reviews: [
      { title: "【市邨高校】日本最先端のApple Distinguished School！ICT教育と確かな進学力", channel: "さくら個別・最新学校紹介", url: "https://www.youtube.com/results?search_query=%E5%B8%82%E9%82%A8%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%B4%B9%E4%BB%8B+ICT", badge: "先進教育分析", highlight: "タブレットを使いこなす授業風景、プレゼン力・探究力を伸ばす教育スタイル" },
      { title: "市邨高校の学校生活・市邨祭！都心キャンパスで自分らしく輝く生徒たち", channel: "愛知高校生インタビュー", url: "https://www.youtube.com/results?search_query=%E5%B8%82%E9%82%A8%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E5%B8%82%E9%82%A8%E7%A5%AD", badge: "スクールライフ", highlight: "親身で相談しやすい先生方、おしゃれな制服と温かい人間関係" }
    ]
  },
  "doho": {
    official: [
      { name: "同朋高等学校 公式サイト", platform: "Web", url: "https://www.doho-h.ed.jp/", desc: "普通科・音楽科・美術科、同朋大学・名古屋音楽大・名古屋造形大連携" },
      { name: "同朋高校 公式YouTube / アート・音楽", platform: "YouTube公式", url: "https://www.youtube.com/results?search_query=%E5%90%8C%E6%9C%8B%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1+%E5%85%AC%E5%BC%8F+YouTube", desc: "音楽科ホール演奏、美術科作品展示、学校紹介PV" }
    ],
    reviews: [
      { title: "【同朋高校】美術科・音楽科・普通科！芸術に強い私立校の魅力と進路実績", channel: "愛知私立高校徹底ガイド", url: "https://www.youtube.com/results?search_query=%E5%90%8C%E6%9C%8B%E9%AB%98%E6%A0%A1+%E7%BE%8E%E8%A1%93%E7%A7%91+%E9%9F%B3%E6%A5%BD%E7%A7%91+%E8%A9%95%E5%88%A4", badge: "本音分析", highlight: "芸術系大学への圧倒的な合格率、一人ひとりの感性を大切にする温かい教育方針" },
      { title: "同朋高校のスクールライフ！生徒の個性が花開く同朋祭とアットホームな日常", channel: "学校見学レポートTV", url: "https://www.youtube.com/results?search_query=%E5%90%8C%E6%9C%8B%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E5%90%8C%E6%9C%8B%E7%A5%AD", badge: "スクールライフ", highlight: "中村公園駅近く、好きなことに全力で没頭できる安心の居場所" }
    ]
  },
  "midori": {
    official: [
      { name: "愛知県立緑高等学校 公式サイト", platform: "Web", url: "https://midori-h.aichi-c.ed.jp/", desc: "緑豊かな自然環境、落ち着いた学習指導、部活動" }
    ],
    reviews: [
      { title: "【緑高校】自然に囲まれたアットホームな公立校！内申点21〜25層の進路選択", channel: "愛知高校受験相談室", url: "https://www.youtube.com/results?search_query=%E7%B7%91%E9%AB%98%E6%A0%A1+%E6%84%9B%E7%9F%A5+%E5%86%85%E7%94%B3%E7%82%B9+%E5%85%A5%E8%A9%A6", badge: "本音分析", highlight: "緑区・天白区・豊明方面からの通学、落ち着いた真面目な生徒が集まる環境" },
      { title: "緑高校のスクールライフ！緑高祭とアットホームな仲間たちの素顔", channel: "愛知進学TV", url: "https://www.youtube.com/results?search_query=%E7%B7%91%E9%AB%98%E6%A0%A1+%E6%84%9B%E7%9F%A5+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB", badge: "スクールライフ", highlight: "先生との距離が近く、無理のないペースで高校生活を楽しめる安心感" }
    ]
  },
  "kyoei": {
    official: [
      { name: "享栄高等学校 公式サイト", platform: "Web", url: "https://www.kyoei.ed.jp/", desc: "普通科（栄徳連携等）・商業科・機械科、甲子園名門野球部、瑞穂区汐路町" },
      { name: "享栄高校 公式YouTube / 部活動", platform: "YouTube公式", url: "https://www.youtube.com/results?search_query=%E4%BA%AB%E6%A0%84%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1+%E5%85%AC%E5%BC%8F", desc: "硬式野球部・アーチェリー部などの強豪部活動、資格取得サポート" }
    ],
    reviews: [
      { title: "【享栄高校】伝統の部活動と手厚い就職・進学サポート！内申点19〜23層の安心感", channel: "愛知私立高校進路解説", url: "https://www.youtube.com/results?search_query=%E4%BA%AB%E6%A0%84%E9%AB%98%E6%A0%A1+%E5%B0%B1%E8%81%B7+%E9%80%B2%E5%AD%A6+%E5%86%85%E7%94%B3%E7%82%B9", badge: "本音分析", highlight: "地元大手企業への高い就職実績、文教地区・瑞穂区での落ち着いた通学環境" },
      { title: "享栄高校の学校生活！礼儀正しさとスポーツマンシップで育つ生徒たち", channel: "高校スポーツTV", url: "https://www.youtube.com/results?search_query=%E4%BA%AB%E6%A0%84%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E9%83%A8%E6%B4%BB", badge: "スクールライフ", highlight: "面倒見が良く、生徒一人ひとりの進路を最後まで全力で応援してくれる先生方" }
    ]
  },
  "nagoya-otani": {
    official: [
      { name: "名古屋大谷高等学校 公式サイト", platform: "Web", url: "https://www.nagoya-otani.ed.jp/", desc: "特別進学・文理進学・福祉・商業、瑞穂区、真宗大谷派の温かい教育" },
      { name: "名古屋大谷高校 公式YouTube / 学校案内", platform: "YouTube公式", url: "https://www.youtube.com/results?search_query=%E5%90%8D%E5%8F%A4%E5%B1%8B%E5%A4%A7%E8%B0%B7%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1+%E5%85%AC%E5%BC%8F", desc: "学校紹介ムービー、福祉実習風景、コース別紹介" }
    ],
    reviews: [
      { title: "【名古屋大谷高校】福祉・商業・普通科！手厚い資格取得と親身な進路指導", channel: "愛知進学ガイド", url: "https://www.youtube.com/results?search_query=%E5%90%8D%E5%8F%A4%E5%B1%8B%E5%A4%A7%E8%B0%B7%E9%AB%98%E6%A0%A1+%E8%A9%95%E5%88%A4+%E5%86%85%E7%94%B3%E7%82%B9", badge: "本音分析", highlight: "内申点19〜23層の確実な進路選択、介護福祉士国家資格の取得ルートと指定校推薦" },
      { title: "名古屋大谷高校のスクールライフ！生徒一人ひとりに寄り添う温かい校風", channel: "学校探訪レポート", url: "https://www.youtube.com/results?search_query=%E5%90%8D%E5%8F%A4%E5%B1%8B%E5%A4%A7%E8%B0%B7+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E5%A4%A7%E8%B0%B7%E7%A5%AD", badge: "スクールライフ", highlight: "瑞穂運動場西駅から徒歩圏内、仲間思いの生徒たちが安心して通える環境" }
    ]
  },
  "moriyama": {
    official: [
      { name: "愛知県立守山高等学校 公式サイト", platform: "Web", url: "https://moriyama-h.aichi-c.ed.jp/", desc: "少人数習熟度別授業、丁寧な基礎学力指導、キャリア教育" }
    ],
    reviews: [
      { title: "【守山高校】基礎からやり直せる少人数指導！内申点オール2からの再スタート", channel: "愛知公立高校受験ナビ", url: "https://www.youtube.com/results?search_query=%E5%AE%88%E5%B1%B1%E9%AB%98%E6%A0%A1+%E6%84%9B%E7%9F%A5+%E5%86%85%E7%94%B3%E7%82%B9+%E5%85%A5%E8%A9%A6", badge: "本音分析", highlight: "小・中学校の学び直し対応、先生の手厚い個別フォロー、就職・専門学校への確実な進路" },
      { title: "守山高校のスクールライフ！温かいサポートの中で自信を取り戻す3年間", channel: "高校生活応援チャンネル", url: "https://www.youtube.com/results?search_query=%E5%AE%88%E5%B1%B1%E9%AB%98%E6%A0%A1+%E6%84%9B%E7%9F%A5+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB", badge: "スクールライフ", highlight: "落ち着いた環境で自分のペースを保ち、着実に前進できる教育環境" }
    ]
  },
  "kasugai-izumi": {
    official: [
      { name: "愛知県立春日井泉高等学校 公式サイト", platform: "Web", url: "https://kasugaiizumi-h.aichi-c.ed.jp/", desc: "生活文化科・地域ビジネス科・ITビジネス科、資格取得・実務直結" }
    ],
    reviews: [
      { title: "【春日井泉高校】家庭科・IT・ビジネスの実学専門校！確かな資格と就職の強さ", channel: "愛知専門学科ナビ", url: "https://www.youtube.com/results?search_query=%E6%98%A5%E6%97%A5%E4%BA%95%E6%B3%89%E9%AB%98%E6%A0%A1+%E8%B3%87%E6%A0%BC+%E5%B0%B1%E8%81%B7", badge: "本音分析", highlight: "調理・製菓・服飾・IT情報処理など実践スキルを学べる強み、地元企業からの厚い信頼" },
      { title: "春日井泉高校の泉高祭と実習！生徒の手作りスイーツや作品発表が大盛況", channel: "専門高校レポートTV", url: "https://www.youtube.com/results?search_query=%E6%98%A5%E6%97%A5%E4%BA%95%E6%B3%89%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E6%B3%89%E9%AB%98%E7%A5%AD", badge: "学校生活", highlight: "自分の「好き」を仕事に直結させる学び、仲間と協力して創り上げる喜び" }
    ]
  },
  "kikuka": {
    official: [
      { name: "菊華高等学校 公式サイト", platform: "Web", url: "https://www.kikuka.ed.jp/", desc: "普通科（スポーツ・総合進学）、情報ビジネス、福祉、保育、守山区小幡" },
      { name: "菊華高校 公式YouTube / コース紹介", platform: "YouTube公式", url: "https://www.youtube.com/results?search_query=%E8%8F%8A%E8%8F%AF%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1+%E5%85%AC%E5%BC%8F", desc: "保育実習・ITビジネス施設紹介、学校行事ダイジェスト" }
    ],
    reviews: [
      { title: "【菊華高校】保育・福祉・情報ITを実践で学ぶ！基礎から伸ばす安心の私立校", channel: "愛知進学アドバイザー", url: "https://www.youtube.com/results?search_query=%E8%8F%8A%E8%8F%AF%E9%AB%98%E6%A0%A1+%E5%86%85%E7%94%B3%E7%82%B9+%E8%A9%95%E5%88%A4", badge: "本音分析", highlight: "内申点18〜22層の心強い味方、保育士・幼稚園教諭や介護福祉への直結ルート" },
      { title: "菊華高校のスクールライフ！名鉄瀬戸線小幡駅すぐの好立地と温かいサポート", channel: "学校探訪チャンネル", url: "https://www.youtube.com/results?search_query=%E8%8F%8A%E8%8F%AF%E9%AB%98%E6%A0%A1+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E8%8F%8A%E8%8F%AF%E7%A5%AD", badge: "スクールライフ", highlight: "生徒一人ひとりに寄り添い、長所を見つけて褒めて伸ばす教育方針" }
    ]
  },
  "toho-tsushin": {
    official: [
      { name: "東邦高校 (単位制・通信等) / サポート校 公式案内", platform: "Web", url: "https://www.toho-h.ed.jp/", desc: "柔軟な登校スタイル、個別学習支援、通信制高校からの大学進学" },
      { name: "通信制高校・サポート校のリアル解説動画", platform: "YouTube", url: "https://www.youtube.com/results?search_query=%E6%9D%B1%E9%82%A6%E9%AB%98%E6%A0%A1+%E9%80%9A%E4%BF%A1%E5%88%B6+%E3%82%B5%E3%83%9D%E3%83%BC%E3%83%88%E6%A0%A1", desc: "無理のない登校日数、自分のペースで高校卒業を目指す学習環境" }
    ],
    reviews: [
      { title: "【通信制・サポート校】不登校や内申オール1からの進学！自分らしく卒業できる選び方", channel: "不登校・通信制進路相談チャンネル", url: "https://www.youtube.com/results?search_query=%E6%84%9B%E7%9F%A5%E7%9C%8C+%E9%80%9A%E4%BF%A1%E5%88%B6%E9%AB%98%E6%A0%A1+%E9%81%B8%E3%81%B3%E6%96%B9", badge: "進路相談", highlight: "プレッシャーなく通える環境、オンライン学習と個別登校の組み合わせ、大学進学への道" },
      { title: "通信制高校での充実スクールライフ！自分の好きな時間・趣味と両立する新しい学び方", channel: "新しい学び方ナビ", url: "https://www.youtube.com/results?search_query=%E9%80%9A%E4%BF%A1%E5%88%B6%E9%AB%98%E6%A0%A1+%E3%82%B9%E3%82%AF%E3%83%BC%E3%83%AB%E3%83%A9%E3%82%A4%E3%83%97", badge: "体験談", highlight: "人間関係のストレスゼロ、自分の夢やアルバイト・資格取得に時間を使える最高の選択肢" }
    ]
  }
};

function getMediaForSchool(school) {
  if (mediaMap[school.id]) {
    return mediaMap[school.id];
  }
  const encodedName = encodeURIComponent(school.name);
  return {
    official: [
      { 
        name: `${school.name} 公式サイト`, 
        platform: "Web公式サイト", 
        url: school.url, 
        desc: "学校案内、学科・コース紹介、最新の進路実績、公式行事予定" 
      },
      { 
        name: `${school.name} YouTube公式・学校紹介動画`, 
        platform: "YouTube公式/検索", 
        url: `https://www.youtube.com/results?search_query=${encodedName}+%E5%85%AC%E5%BC%8F+%E5%AD%A6%E6%A0%A1%E7%B4%B9%E4%BB%8B`, 
        desc: "オープンスクール・部活動・施設見学などの公式プロモーション動画" 
      }
    ],
    reviews: [
      { 
        title: `【${school.name}】学校生活のリアル・内申点ボーダーと入試難易度を解説`, 
        channel: "愛知高校受験ナビ / 塾講師による本音分析", 
        url: `https://www.youtube.com/results?search_query=${encodedName}+%E9%AB%98%E6%A0%A1%E5%8F%97%E9%A8%93+%E5%86%85%E7%94%B3%E7%82%B9`, 
        badge: "入試・内申分析", 
        highlight: `合格目安内申点（${school.score}点）と当日点対策、部活動（${school.clubPolicy}）と学業の両立環境` 
      },
      { 
        title: `${school.name}の校風・スクールライフ・在校生＆卒業生の生の声`, 
        channel: "愛知高校生インタビュー / 学校紹介", 
        url: `https://www.youtube.com/results?search_query=${encodedName}+%E5%AD%A6%E6%A0%A1%E7%94%9F%E6%B4%BB+%E5%88%B6%E6%9C%8D+%E6%A0%A1%E9%A2%A8`, 
        badge: "スクールライフ", 
        highlight: `制服（${school.uniform}）の着こなし、学校行事の熱気、進路サポートの手厚さ` 
      }
    ]
  };
}

module.exports = {
  mediaMap,
  getMediaForSchool
};
