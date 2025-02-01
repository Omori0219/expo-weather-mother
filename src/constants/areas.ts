import { AreaData } from '../types/user';

// 気象庁の一次細分区域コードに基づく地域データ
// 参考: https://www.jma.go.jp/jma/kishou/know/yougo_hp/chiiki.html
export const AREAS: AreaData[] = [
  { areaCode: '016000', areaName: '北海道' },
  { areaCode: '020000', areaName: '青森県' },
  { areaCode: '030000', areaName: '岩手県' },
  { areaCode: '040000', areaName: '宮城県' },
  { areaCode: '050000', areaName: '秋田県' },
  { areaCode: '060000', areaName: '山形県' },
  { areaCode: '070000', areaName: '福島県' },
  { areaCode: '080000', areaName: '茨城県' },
  { areaCode: '090000', areaName: '栃木県' },
  { areaCode: '100000', areaName: '群馬県' },
  { areaCode: '110000', areaName: '埼玉県' },
  { areaCode: '120000', areaName: '千葉県' },
  { areaCode: '130000', areaName: '東京都' },
  { areaCode: '140000', areaName: '神奈川県' },
  { areaCode: '150000', areaName: '新潟県' },
  { areaCode: '160000', areaName: '富山県' },
  { areaCode: '170000', areaName: '石川県' },
  { areaCode: '180000', areaName: '福井県' },
  { areaCode: '190000', areaName: '山梨県' },
  { areaCode: '200000', areaName: '長野県' },
  { areaCode: '210000', areaName: '岐阜県' },
  { areaCode: '220000', areaName: '静岡県' },
  { areaCode: '230000', areaName: '愛知県' },
  { areaCode: '240000', areaName: '三重県' },
  { areaCode: '250000', areaName: '滋賀県' },
  { areaCode: '260000', areaName: '京都府' },
  { areaCode: '270000', areaName: '大阪府' },
  { areaCode: '280000', areaName: '兵庫県' },
  { areaCode: '290000', areaName: '奈良県' },
  { areaCode: '300000', areaName: '和歌山県' },
  { areaCode: '310000', areaName: '鳥取県' },
  { areaCode: '320000', areaName: '島根県' },
  { areaCode: '330000', areaName: '岡山県' },
  { areaCode: '340000', areaName: '広島県' },
  { areaCode: '350000', areaName: '山口県' },
  { areaCode: '360000', areaName: '徳島県' },
  { areaCode: '370000', areaName: '香川県' },
  { areaCode: '380000', areaName: '愛媛県' },
  { areaCode: '390000', areaName: '高知県' },
  { areaCode: '400000', areaName: '福岡県' },
  { areaCode: '410000', areaName: '佐賀県' },
  { areaCode: '420000', areaName: '長崎県' },
  { areaCode: '430000', areaName: '熊本県' },
  { areaCode: '440000', areaName: '大分県' },
  { areaCode: '450000', areaName: '宮崎県' },
  { areaCode: '460100', areaName: '鹿児島県' },
  { areaCode: '471000', areaName: '沖縄県' },
] as const;
