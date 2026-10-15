export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { event_id, url, user_agent } = req.body || {};
    const PIXEL_ID = 'DB82CC3C77U3CQUIA7EG';
    const ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN;

    if (!ACCESS_TOKEN) {
      return res.status(500).json({ error: 'TikTok Access Token is missing' });
    }

    const response = await fetch(`https://business-api.tiktok.com/open_api/v1.3/pixel/track/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': ACCESS_TOKEN,
      },
      body: JSON.stringify({
        pixel_code: PIXEL_ID,
        event: 'InitiateCheckout',
        event_id: event_id,
        timestamp: Math.floor(Date.now() / 1000),
        context: {
          ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
          user_agent: user_agent || req.headers['user-agent'],
          page: { url: url }
        },
        properties: {
          content_id: 'NOVAÉ_WHATSAPP'
        }
      })
    });

    const data = await response.json();
    return res.status(200).json({ success: true, data });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
