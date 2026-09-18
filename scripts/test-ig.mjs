async function test() {
  const users = ['cristiano', 'virat.kohli', 'duellx03arenaa'];
  for (const username of users) {
    console.log(`\n=== Testing @${username} ===`);
    try {
      const res = await fetch(`https://www.instagram.com/${username}/`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      });
      console.log('Web status:', res.status, 'url:', res.url);
      const html = await res.text();
      console.log('HTML length:', html.length);
      const ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/i);
      console.log('og:description:', ogDesc ? ogDesc[1] : 'NOT FOUND');
      const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/i);
      console.log('og:title:', ogTitle ? ogTitle[1] : 'NOT FOUND');
      const ogImg = html.match(/<meta property="og:image" content="([^"]+)"/i);
      console.log('og:image:', ogImg ? ogImg[1] : 'NOT FOUND');
    } catch (e) {
      console.log('Web fetch error:', e.message);
    }

    try {
      const apiRes = await fetch(`https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
        headers: {
          'User-Agent': 'Instagram 275.0.0.27.98 Android (33/13; 420dpi; 1080x2400; samsung; SM-G991B; o1s; exynos2100; en_US; 458229237)',
          'X-IG-App-ID': '936619743392459',
        }
      });
      console.log('API status:', apiRes.status);
      const apiJson = await apiRes.text();
      console.log('API response snippet:', apiJson.slice(0, 200));
    } catch (e) {
      console.log('API fetch error:', e.message);
    }
  }
}

test();
