export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const apiKey = process.env.TRADING_ECONOMICS_API_KEY;
  if (!apiKey) return res.status(503).json({ ok: false, error: 'TRADING_ECONOMICS_API_KEY belum dipasang di Vercel.' });

  try {
    const url = new URL('https://api.tradingeconomics.com/markets/historical/xauusd:cur');
    url.searchParams.set('c', apiKey);
    url.searchParams.set('f', 'json');
    url.searchParams.set('d1', new Date(Date.now() - 86400000).toISOString().slice(0, 10));
    url.searchParams.set('d2', new Date().toISOString().slice(0, 10));

    const upstream = await fetch(url, { headers: { Accept: 'application/json' } });
    const text = await upstream.text();
    if (!upstream.ok) return res.status(upstream.status).json({ ok: false, error: 'Market API gagal merespons.', detail: text.slice(0, 500) });

    const raw = JSON.parse(text);
    const rows = Array.isArray(raw) ? raw : [];
    const latest = rows[rows.length - 1] || null;

    return res.status(200).json({
      ok: true,
      source: 'Trading Economics',
      symbol: 'XAUUSD',
      fetchedAt: new Date().toISOString(),
      latest: latest ? {
        date: latest.Date ?? null,
        open: latest.Open ?? null,
        high: latest.High ?? null,
        low: latest.Low ?? null,
        close: latest.Close ?? latest.Value ?? null,
        volume: latest.Volume ?? null
      } : null,
      history: rows.slice(-200)
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: 'Gagal mengambil market data XAUUSD.', detail: error?.message || String(error) });
  }
}
