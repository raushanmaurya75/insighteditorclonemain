import fs from 'fs';

async function testHTML() {
  const username = 'cristiano';
  const res = await fetch(`https://www.instagram.com/${username}/`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-User': '?1',
      'Sec-Fetch-Dest': 'document',
    }
  });
  const html = await res.text();
  console.log('HTML length:', html.length);
  
  // Check for scripts
  const scripts = Array.from(html.matchAll(/<script[^>]*>(.*?)<\/script>/gs)).map(m => m[1]);
  console.log('Found scripts count:', scripts.length);
  for (let i = 0; i < scripts.length; i++) {
    const s = scripts[i];
    if (s.includes('follower') || s.includes('Cristiano') || s.includes('full_name') || s.includes('profile_pic')) {
      console.log(`Script ${i} length: ${s.length}, snippet:`, s.slice(0, 300));
    }
  }

  // Check meta tags
  const metas = Array.from(html.matchAll(/<meta[^>]+>/g)).map(m => m[0]);
  console.log('Metas:', metas);
}

testHTML();
