// Tiny User-Agent summarizer (no dependency). Returns e.g. "iOS · Safari · Mobile".
export function parseDevice(ua: string): string {
  if (!ua) return 'Unknown';

  let os = 'Unknown';
  if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/Windows/.test(ua)) os = 'Windows';
  else if (/Mac OS X|Macintosh/.test(ua)) os = 'macOS';
  else if (/Linux/.test(ua)) os = 'Linux';

  let browser = 'Browser';
  if (/Edg\//.test(ua)) browser = 'Edge';
  else if (/OPR\/|Opera/.test(ua)) browser = 'Opera';
  else if (/Firefox\//.test(ua)) browser = 'Firefox';
  else if (/Chrome\//.test(ua)) browser = 'Chrome';
  else if (/Safari\//.test(ua)) browser = 'Safari';

  const kind = /Mobi|Android|iPhone|iPad/.test(ua) ? 'Mobile' : 'Desktop';

  return `${os} · ${browser} · ${kind}`;
}