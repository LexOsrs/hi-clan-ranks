export async function onRequest(context) {
  const { username } = context.params;
  const url = `https://api.runeprofile.com/profiles/${encodeURIComponent(username)}`;

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
