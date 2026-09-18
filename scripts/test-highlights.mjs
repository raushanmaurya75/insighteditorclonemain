import fs from 'fs';

async function printHlStructure() {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
  };
  const res = await fetch('https://www.instagram.com/selenagomez/', { headers });
  const html = await res.text();

  const scripts = Array.from(html.matchAll(/<script[^>]*>(.*?)<\/script>/gs)).map(m => m[1]);
  for (const s of scripts) {
    if (s.includes('Rare Beauty')) {
      try {
        const d = JSON.parse(s);
        function walk(obj) {
          if (!obj || typeof obj !== 'object') return;
          if (Array.isArray(obj)) return obj.forEach(walk);
          if (obj.title === 'Rare Beauty') {
            console.log('Rare Beauty Full Object:', JSON.stringify(obj, null, 2));
          }
          Object.values(obj).forEach(walk);
        }
        walk(d);
      } catch(e) {}
    }
  }
}

printHlStructure();
