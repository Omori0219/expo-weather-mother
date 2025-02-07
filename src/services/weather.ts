import { Timestamp } from 'firebase/firestore';
import { AREAS } from '../constants/areas';
import { WeatherDocument, GeneratedMessage, WeatherDisplayData } from '../types/weather';

export class WeatherDataError extends Error {
  constructor(
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'WeatherDataError';
  }
}

export class WeatherTransformer {
  static parseGeneratedMessage(jsonString: string): GeneratedMessage {
    try {
      const parsed = JSON.parse(jsonString);
      return parsed as GeneratedMessage;
    } catch (error) {
      throw new WeatherDataError('天気メッセージの解析に失敗しました', error);
    }
  }

  static formatDate(timestamp: Timestamp): string {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  static getAreaName(areaCode: string): string {
    const area = AREAS.find(a => a.areaCode === areaCode);
    if (!area) {
      throw new WeatherDataError(`不明な地域コード: ${areaCode}`);
    }
    return area.areaName;
  }

  static toDisplayData(doc: WeatherDocument): WeatherDisplayData {
    const message = this.parseGeneratedMessage(doc.generatedMessage);
    return {
      motherMessage: message.mother_message,
      displayDate: this.formatDate(doc.createdAt),
      areaName: this.getAreaName(doc.areaCode),
    };
  }
}
