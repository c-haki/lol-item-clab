
import type { Item } from "./types";

// お試し用のアイテムデータ（後で公式データに差し替えます！）
import { useState, useEffect } from "react"; // useEffectを追加

function App() {
  const [items, setItems] = useState<Item[]>([]); // アイテム一覧を空で用意
  const [inventory, setInventory] = useState<(Item | null)[]>(Array(6).fill(null));

  // フィルターの型を定義
const [activeFilter, setActiveFilter] = useState<string | null>(null);

// ステータスと名前の対応表（表示用）
const filterOptions = [
  { key: "ad", label: "攻撃力" },
  { key: "cr", label: "クリティカル" },
  { key: "ap", label: "魔力" },
  { key: "hp", label: "体力" },
  { key: "mp", label: "マナ" },
  { key: "ar", label: "物理防御" },
  { key: "mr", label: "魔法防御" },
  { key: "as", label: "攻撃速度" },
  { key: "ms", label: "移動速度" },
  { key: "cl", label: "クールダウン短縮" },
  { key: "te", label: "行動妨害耐性" },
  { key: "ls", label: "ライフスティール" },
  { key: "arp", label: "物理防御貫通" },
  { key: "mrp", label: "魔法防御貫通" },
  { key: "sh", label: "スキルヘイスト" },
  { key: "mpr", label: "マナ自動回復" },
  { key: "hpr", label: "体力自動回復" }
];

  // アプリが起動した時に一度だけ「公式データ」を取りに行く
useEffect(() => {
  fetch("https://ddragon.leagueoflegends.com/cdn/16.5.1/data/ja_JP/item.json")
    .then((res) => res.json())
    .then((data) => {
      const rawItems = data.data;
      
      // 除外したいアイテム名のリスト
      const blacklist = [
        "帽子ジュース", "アトマの報い", "不死身の大王の王冠", "モルテンストーンシールド",
        "星空のマント", "天帝の剣", "ベイガーの超越のタリスマン", "ゼファー",
        "ガーゴイル ストーンプレート", "花咲く夜明けの剣", "シャッタークイーンクラウン",
        "ギャンブラーの剣", "冷酷な一撃", "肉喰らう者","アナセマ チェイン","オブシディアン エッジ","キルヒアイス シャード","コラプト ポーション",
        "砕けたアームガード","シュレリアの鎮魂歌","スターキャスター","戦慄せし街の叫び","来光の聖遺物","アップグレード エアロバック","フローズン フィスト",
        "インフィニット コンバージェンス","サーテンティ","大衆の憎悪","デイブレイク","朔望","ソードネイド","ライアンドリーの悲嘆","ショウジンの誓い","アンスボークン パラサイト","インフィニティ フォース","ラバドン デスクラウン","ドリームシャター",
        "体力ポーション","コントロール ワード","詰め替えポーション","台風の目","アタラクシア","リヴァイアサン","シージング ソロウ","イカシアの呪い","ヘブンズフォール","ワームフォールン サクリファイス","バロンズ ギフト","オブシディアン クリーバー",
        "アイアン エリクサー","ソーサリー エリクサー","ラース エリクサー","スコーチクロウの幼体","ガストウォーカーの幼体","モスストンパーの幼体",
        "ガーディアン ブレード","ガーディアン ハンマー","ガーディアン オーブ","シャッタードクイーン クラウン","ガーディアン ホーン"
            ];

      const formattedItems: Item[] = Object.keys(rawItems)
        .filter((id) => {
          const item = rawItems[id];
          
          // 基本条件：サモナーズリフトで買える 0Gより高いアイテム
          const isNormalItem = item.maps["11"] === true && item.gold.purchasable && item.gold.total > 0;
          
          // 除外条件1：アリーナ専用モードなどのアイテムを弾く
          const isNotSpecialMode = item.requiredMode !== "ARAM" && item.requiredMode !== "CHERRY"; // CHERRYはアリーナのこと
          
          // 除外条件2：ブラックリストに含まれていないか
          // includesを使って、名前の一部が一致する場合も弾くようにします
          const isNotBlacklisted = !blacklist.some(name => item.name.includes(name));

          return isNormalItem && isNotSpecialMode && isNotBlacklisted;
        })
        .map((id) => {
  const s = rawItems[id].stats;
  

  return {
    id: Number(id),
    name: rawItems[id].name,
    description: rawItems[id].plaintext,
    price: rawItems[id].gold.total,
    icon: `https://ddragon.leagueoflegends.com/cdn/16.5.1/img/item/${id}.png`,
    stats: {
      ad: s.FlatPhysicalDamageMod || 0,
      ap: s.FlatMagicDamageMod || 0,
      hp: s.FlatHPPoolMod || 0,
      mp: s.FlatMPPoolMod || 0,
      ar: s.FlatArmorMod || 0,
      mr: s.FlatSpellBlockMod || 0,
      as: s.PercentAttackSpeedMod ? s.PercentAttackSpeedMod * 100 : 0,
      ms: s.PercentMovementSpeedMod ? s.PercentMovementSpeedMod * 100 : 0,
      cr: s.FlatCritChanceMod ? s.FlatCritChanceMod * 100 : 0,
      ls: s.PercentLifeStealMod ? s.PercentLifeStealMod * 100 : 0,
      hpr: s.FlatHPRegenMod || 0,
      mpr: s.FlatMPRegenMod || 0,
      te: s.PercentTenacityMod ? s.PercentTenacityMod * 100 : 0,
      // ※スキルヘイストや貫通は DataDragon の stats に直接数値が入っていないため、
      // 基本は 0 ですが、受け皿として用意しておきます。
      sh: 0, 
      arp: 0,
      mrp: 0,
      cl: 0,
    }
  };
})
        .sort((a, b) => a.price - b.price);

      const uniqueItems = formattedItems.filter((item, index, self) =>
        index === self.findIndex((t) => t.name === item.name)
      );

      setItems(uniqueItems);
    });
    
}, []);

  // ...あとはこの「items」をループで表示するだけ

  // アイテム追加ロジック
  const addItem = (item: Item) => {
    const nextInventory = [...inventory];
    const emptyIndex = nextInventory.findIndex((slot) => slot === null);
    if (emptyIndex !== -1) {
      nextInventory[emptyIndex] = item;
      setInventory(nextInventory);
    }
  };

 // すべての合計ステータスを一括計算
const totals = inventory.reduce((acc, item) => {
  if (item) {
    Object.keys(acc).forEach(key => {
      // @ts-ignore (型の警告を一旦無視して一括加算)
      acc[key] += item.stats[key] || 0;
    });
    acc.price += item.price || 0;
  }
  return acc;
}, { 
  ad: 0, ap: 0, hp: 0, mp: 0, ar: 0, mr: 0, as: 0, ms: 0, cr: 0, 
  ls: 0, te: 0, hpr: 0, mpr: 0, sh: 0, arp: 0, mrp: 0, price: 0 
});

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center w-full">
      <h1 className="text-3xl font-bold border-b-2 border-yellow-600 pb-2 mb-8 text-center w-full max-w-2xl">
        LoL Item Calculator
      </h1>

     {/* 1. 総合ステータス */}
<div className="bg-slate-800 p-6 rounded-lg border-2 border-yellow-600 mb-8 w-full max-w-2xl shadow-lg">
  <h2 className="text-xl font-black text-center text-yellow-500 mb-4">総合ステータス</h2>
  
  {/* グリッドを 3 列に設定 */}
  <div className="grid grid-cols-3 gap-y-4 gap-x-2 text-sm">
    <div className="flex flex-col items-center">
      <span className="text-gray-400">⚔️ 攻撃力</span>
      <span className="font-black text-white text-4xl tracking-tighter">+{totals.ad}</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-purple-400">✨ 魔力</span>
      <span className="font-black text-white text-4xl tracking-tighter">+{totals.ap}</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-green-400">❤️ 体力</span>
      <span className="font-black text-white text-4xl tracking-tighter">+{totals.hp}</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-blue-400">💧 マナ</span>
      <span className="font-black text-white text-4xl tracking-tighter">+{totals.mp}</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-orange-400">🛡️ 物理防御</span>
      <span className="font-black text-white text-4xl tracking-tighter">+{totals.ar}</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-teal-400">🔮 魔法防御</span>
      <span className="font-black text-white text-4xl tracking-tighter">+{totals.mr}</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-yellow-200">🏹 攻撃速度</span>
      <span className="font-black text-white text-4xl tracking-tighter">+{totals.as}%</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-blue-200">👟 移動速度</span>
      <span className="font-black text-white text-4xl tracking-tighter">+{totals.ms}%</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-red-400">🎯 会心率</span>
      <span className="font-black text-white text-4xl tracking-tighter">+{totals.cr}%</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-red-400">🧪 ライフスティール</span>
      <span className="font-black text-white text-4xl tracking-tighter">+{totals.ls}%</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-teal-400">👢 行動妨害耐性</span>
      <span className="font-black text-white text-4xl tracking-tighter">+{totals.te}%</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-red-400">👒 魔法防御貫通</span>
      <span className="font-black text-white text-4xl tracking-tighter">+{totals.mrp}%</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-red-400">🔪 物理防御貫通</span>
      <span className="font-black text-white text-4xl tracking-tighter">+{totals.arp}%</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-red-400">⌛ スキルヘイスト</span>
      <span className="font-black text-white text-4xl tracking-tighter">+{totals.sh}%</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-red-400">💧 マナ自動回復</span>
      <span className="font-black text-white text-4xl tracking-tighter">+{totals.mpr}%</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-red-400">💛 体力自動回復</span>
      <span className="font-black text-white text-4xl tracking-tighter">+{totals.hpr}%</span>
    </div>
    
    {/* 総額は一番下にドーンと表示 */}
    <div className="col-span-3 text-center text-yellow-400 mt-4 border-t border-slate-700 pt-3 font-bold text-xl">
      💰 総額: {totals.price} G
    </div>
  </div>
</div>

      {/* 2. インベントリ (ここが 3x2 の固定ボックス) */}
      <div className="mb-12">
        <h2 className="text-lg font-bold text-gray-400 mb-3 text-center uppercase tracking-widest">Inventory</h2>
        {/* grid-cols-3 で横3列。gap-2 で枠同士の隙間を調整 */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2 border-2 border-slate-800 rounded shadow-2xl">
          {inventory.map((item, index) => (
            <div 
              key={index} 
              className="w-16 h-16 bg-black border border-slate-700 flex items-center justify-center relative overflow-hidden group"
            >
              {item ? (
                <>
                  <img src={item.icon} alt={item.name} className="w-full h-full object-cover" />
                  {/* クリックで削除できる機能（おまけ） */}
                  <div 
                    onClick={() => {
                      const next = [...inventory];
                      next[index] = null;
                      setInventory(next);
                    }}
                    className="absolute inset-0 bg-red-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer"
                  >
                    ×
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-slate-900/30"></div> // 空の枠
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. アイテム一覧 */}
      {/* 3. アイテムショップ（横幅を広げ、左右分割） */}
<div className="w-full max-w-6xl border-t border-slate-700 pt-8 flex flex-col items-center">
  <h2 className="text-xl font-bold text-yellow-600 mb-6 uppercase tracking-widest">Item Shop</h2>
  
  <div className="flex flex-row w-full gap-6">
    
    {/* 左側：絞り込みサイドバー */}
    <div className="w-48 shrink-0 flex flex-col gap-2">
      <p className="text-xs font-bold text-gray-500 mb-2 px-2 uppercase">Filter By Stats</p>
      {/* 全表示ボタン */}
      <button 
        onClick={() => setActiveFilter(null)}
        className={`text-left px-4 py-2 rounded text-sm transition-colors ${!activeFilter ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-gray-400 hover:bg-slate-700'}`}
      >
        すべて
      </button>
      {/* ステータス別ボタン */}
      {filterOptions.map((opt) => (
        <button
          key={opt.key}
          onClick={() => setActiveFilter(opt.key)}
          className={`text-left px-4 py-2 rounded text-sm transition-colors ${activeFilter === opt.key ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-gray-400 hover:bg-slate-700'}`}
        >
          {opt.label}
        </button>
      ))}
    </div>

    {/* 右側：アイテム一覧（ここを横いっぱいに広げる） */}
    <div className="flex-grow h-[600px] overflow-y-auto p-4 bg-slate-900/50 rounded-lg shadow-inner border border-slate-800">
      <div className="flex flex-wrap gap-4 justify-start">
        {items
  .filter(item => {
    if (!activeFilter) return true;
    // item.stats の中から activeFilter (例: "ad") の値を取り出し、なければ0とする
    const statValue = (item.stats as any)[activeFilter] ?? 0;
    return statValue > 0;
  })
          .map((item) => (
            <button 
              key={item.id} 
              onClick={() => addItem(item)}
              className="bg-slate-800 p-2 rounded border border-slate-700 hover:border-yellow-500 hover:bg-slate-700 transition-all w-28 flex flex-col items-center gap-1 shrink-0 group"
            >
              <img src={item.icon} alt={item.name} className="w-12 h-12 rounded shadow-md group-hover:scale-110 transition-transform" />
              <p className="text-[11px] font-bold text-yellow-600 text-center line-clamp-2 h-7 leading-tight">{item.name}</p>
              <p className="text-[15px] text-yellow-500 font-mono">{item.price} G</p>
            </button>
          ))}
      </div>
    </div>

  </div>
</div>
    </div>
  );
}
export default App;