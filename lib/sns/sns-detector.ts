import { SNS_PATTERNS } from './sns-patterns';

/**
 * URLからホスト名を安全に取得する
 */
function getHostname(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

/**
 * 指定URLがSNSサイトかどうか判定する
 */
function isSnsUrl(url: string): boolean {
  const hostname = getHostname(url);
  if (hostname === null) return false;

  return SNS_PATTERNS.some((sns) =>
    sns.hostPatterns.some((pattern) => pattern.test(hostname))
  );
}

/**
 * 指定URLのSNS名を返す。SNSでなければnullを返す
 */
function getSnsName(url: string): string | null {
  const hostname = getHostname(url);
  if (hostname === null) return null;

  const matched = SNS_PATTERNS.find((sns) =>
    sns.hostPatterns.some((pattern) => pattern.test(hostname))
  );

  return matched?.name ?? null;
}

export { isSnsUrl, getSnsName };
