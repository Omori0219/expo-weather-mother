import { AreaData } from '../types/user';

export const AREAS: AreaData[] = [
  { areaCode: '016000', areaName: '北海道（札幌）' },
  { areaCode: '040000', areaName: '宮城県' },
  { areaCode: '110000', areaName: '埼玉県' },
  { areaCode: '130000', areaName: '東京都' },
  { areaCode: '140000', areaName: '神奈川県' },
  { areaCode: '230000', areaName: '愛知県' },
  { areaCode: '270000', areaName: '大阪府' },
  { areaCode: '340000', areaName: '広島県' },
  { areaCode: '390000', areaName: '高知県' },
  { areaCode: '400000', areaName: '福岡県' },
  { areaCode: '471000', areaName: '沖縄県（那覇）' },
] as const;
