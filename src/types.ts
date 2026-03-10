export interface Item{
    id: number;         //アイテムの番号
    name: string;       //アイテムの名前
    description: string; //アイテムの説明
    price: number;      //アイテムの値段

    stats:{
        ad?: number;     //攻撃力
        ap?: number;     //魔力
        hp?: number;     //体力
        mp?: number;     //マナ
        ar?: number;  //物理防御
        mr?: number;     //魔法防御
        as?: number;     //攻撃速度
        ms?: number;     //移動速度
        cl?: number;     //クールダウン短縮
        cr?: number;     //クリティカル率
        te?: number;     //行動妨害耐性
        ls?: number;     //ライフスティール
        arp?: number;    //物理防御貫通
        mrp?: number;    //魔法防御貫通
        sh?: number;     //スキルヘイスト
        mpr?: number;    //マナ自動回復
        hpr?: number;    //体力自動回復
    };

    icon: string;      //アイテムのアイコンURL
}

