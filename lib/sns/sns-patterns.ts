/** SNSサイトの定義 */
interface SnsPattern {
  /** SNS名 */
  name: string;
  /** ホスト名のパターン（正規表現） */
  hostPatterns: RegExp[];
}

/** 対象SNSサイト10個の定義 */
const SNS_PATTERNS: SnsPattern[] = [
  {
    name: 'Facebook',
    hostPatterns: [/^(www\.)?facebook\.com$/],
  },
  {
    name: 'YouTube',
    hostPatterns: [/^(www\.)?youtube\.com$/],
  },
  {
    name: 'WhatsApp',
    hostPatterns: [/^web\.whatsapp\.com$/],
  },
  {
    name: 'Instagram',
    hostPatterns: [/^(www\.)?instagram\.com$/],
  },
  {
    name: 'TikTok',
    hostPatterns: [/^(www\.)?tiktok\.com$/],
  },
  {
    name: 'WeChat',
    hostPatterns: [/^web\.wechat\.com$/],
  },
  {
    name: 'Telegram',
    hostPatterns: [/^web\.telegram\.org$/, /^(www\.)?t\.me$/],
  },
  {
    name: 'X',
    hostPatterns: [/^(www\.)?x\.com$/, /^(www\.)?twitter\.com$/],
  },
  {
    name: 'Snapchat',
    hostPatterns: [/^(www\.)?snapchat\.com$/],
  },
  {
    name: 'Reddit',
    hostPatterns: [/^(www\.)?reddit\.com$/],
  },
];

export type { SnsPattern };
export { SNS_PATTERNS };
