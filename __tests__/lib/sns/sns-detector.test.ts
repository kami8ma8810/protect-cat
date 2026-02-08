import { describe, it, expect } from 'vitest';
import { isSnsUrl, getSnsName } from '@/lib/sns/sns-detector';

describe('sns-detector', () => {
  describe('isSnsUrl', () => {
    const snsUrls = [
      { url: 'https://www.facebook.com/feed', name: 'Facebook' },
      { url: 'https://facebook.com/', name: 'Facebook (no www)' },
      { url: 'https://www.youtube.com/watch?v=123', name: 'YouTube' },
      { url: 'https://youtube.com/', name: 'YouTube (no www)' },
      { url: 'https://web.whatsapp.com/', name: 'WhatsApp' },
      { url: 'https://www.instagram.com/explore', name: 'Instagram' },
      { url: 'https://instagram.com/p/123', name: 'Instagram (no www)' },
      { url: 'https://www.tiktok.com/@user', name: 'TikTok' },
      { url: 'https://web.wechat.com/', name: 'WeChat' },
      { url: 'https://web.telegram.org/z/', name: 'Telegram' },
      { url: 'https://t.me/channel', name: 'Telegram (t.me)' },
      { url: 'https://x.com/user/status/123', name: 'X' },
      { url: 'https://www.x.com/home', name: 'X (www)' },
      { url: 'https://twitter.com/user', name: 'Twitter' },
      { url: 'https://www.twitter.com/home', name: 'Twitter (www)' },
      { url: 'https://www.snapchat.com/', name: 'Snapchat' },
      { url: 'https://www.reddit.com/r/programming', name: 'Reddit' },
      { url: 'https://reddit.com/', name: 'Reddit (no www)' },
    ];

    it.each(snsUrls)('$name ($url) をSNSとして検出する', ({ url }) => {
      expect(isSnsUrl(url)).toBe(true);
    });

    const nonSnsUrls = [
      'https://www.google.com/',
      'https://github.com/',
      'https://stackoverflow.com/',
      'https://example.com/',
      'https://www.amazon.co.jp/',
      'https://docs.google.com/document',
    ];

    it.each(nonSnsUrls)('%s をSNSとして検出しない', (url) => {
      expect(isSnsUrl(url)).toBe(false);
    });

    it('不正なURLの場合falseを返す', () => {
      expect(isSnsUrl('')).toBe(false);
      expect(isSnsUrl('not-a-url')).toBe(false);
    });
  });

  describe('getSnsName', () => {
    it('FacebookのURLからSNS名を返す', () => {
      expect(getSnsName('https://www.facebook.com/')).toBe('Facebook');
    });

    it('YouTubeのURLからSNS名を返す', () => {
      expect(getSnsName('https://www.youtube.com/')).toBe('YouTube');
    });

    it('WhatsAppのURLからSNS名を返す', () => {
      expect(getSnsName('https://web.whatsapp.com/')).toBe('WhatsApp');
    });

    it('InstagramのURLからSNS名を返す', () => {
      expect(getSnsName('https://www.instagram.com/')).toBe('Instagram');
    });

    it('TikTokのURLからSNS名を返す', () => {
      expect(getSnsName('https://www.tiktok.com/')).toBe('TikTok');
    });

    it('WeChatのURLからSNS名を返す', () => {
      expect(getSnsName('https://web.wechat.com/')).toBe('WeChat');
    });

    it('TelegramのURLからSNS名を返す', () => {
      expect(getSnsName('https://web.telegram.org/')).toBe('Telegram');
    });

    it('t.meのURLからTelegramを返す', () => {
      expect(getSnsName('https://t.me/channel')).toBe('Telegram');
    });

    it('X (Twitter)のURLからSNS名を返す', () => {
      expect(getSnsName('https://x.com/home')).toBe('X');
    });

    it('twitter.comのURLからXを返す', () => {
      expect(getSnsName('https://twitter.com/home')).toBe('X');
    });

    it('SnapchatのURLからSNS名を返す', () => {
      expect(getSnsName('https://www.snapchat.com/')).toBe('Snapchat');
    });

    it('RedditのURLからSNS名を返す', () => {
      expect(getSnsName('https://www.reddit.com/')).toBe('Reddit');
    });

    it('SNS以外のURLはnullを返す', () => {
      expect(getSnsName('https://www.google.com/')).toBeNull();
    });
  });
});
