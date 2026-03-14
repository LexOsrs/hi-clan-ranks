export async function onRequest(context) {
  // Extract username from the URL path directly to avoid double-encoding
  const prefix = '/api/runeprofile/profiles/';
  const path = new URL(context.request.url).pathname;
  const raw = path.slice(prefix.length);
  // raw is still URL-encoded from the browser, pass it straight through
  const url = `https://api.runeprofile.com/profiles/${raw}`;

  const response = await fetch(url, {
    headers: { 'User-Agent': 'HardlyIron-ClanRanks/1.0' },
  });

  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
