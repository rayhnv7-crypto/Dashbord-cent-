export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const apiKey = process.env.TRADING_ECONOMICS_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      ok: false,
      error: 'TRADING_ECONOMICS_API_KEY belum dipasang di Vercel.',
      setup: 'Tambahkan environment variable TRADING_ECONOMICS_API_KEY lalu redeploy.'
    });
  }

  try {
    const url = new URL('https://api.tradingeconomics.com/calendar/country/united%20states');
    url.searchParams.set('c', apiKey);
    url.searchParams.set('f', 'json');
    url.searchParams.set('importance', '3');

    const upstream = await fetch(url, {
      headers: { Accept: 'application/json' }
    });

    const text = await upstream.text();
    if (!upstream.ok) {
      return res.status(upstream.status).json({
        ok: false,
        error: 'Trading Economics API gagal merespons.',
        detail: text.slice(0, 500)
      });
    }

    const raw = JSON.parse(text);
    const events = Array.isArray(raw) ? raw : [];

    const importantNames = [
      'CPI', 'Consumer Price Index', 'Core CPI', 'Non Farm Payrolls',
      'Nonfarm Payrolls', 'Unemployment Rate', 'Federal Funds Rate',
      'Interest Rate Decision', 'FOMC', 'PPI', 'Producer Price Index',
      'GDP', 'Core PCE', 'PCE Price Index', 'Retail Sales',
      'ISM Manufacturing PMI', 'ISM Non-Manufacturing PMI'
    ];

    const filtered = events
      .filter(e => {
        const name = String(e.Event || e.Category || '').toLowerCase();
        return importantNames.some(k => name.includes(k.toLowerCase()));
      })
      .map(e => ({
        id: e.CalendarId ?? null,
        date: e.Date ?? null,
        country: e.Country ?? 'United States',
        event: e.Event ?? e.Category ?? '',
        reference: e.Reference ?? '',
        actual: e.Actual ?? '',
        previous: e.Previous ?? '',
        forecast: e.Forecast ?? '',
        importance: Number(e.Importance ?? 3),
        source: e.Source ?? '',
        sourceUrl: e.SourceURL ?? '',
        lastUpdate: e.LastUpdate ?? null,
        currency: e.Currency ?? 'USD',
        unit: e.Unit ?? ''
      }));

    return res.status(200).json({
      ok: true,
      source: 'Trading Economics',
      fetchedAt: new Date().toISOString(),
      events: filtered
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Gagal mengambil kalender fundamental.',
      detail: error?.message || String(error)
    });
  }
}
