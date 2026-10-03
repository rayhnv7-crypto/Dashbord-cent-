(() => {
  function fmt(value, digits = 2) {
    return Number(value || 0).toLocaleString('id-ID', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    });
  }

  function idr(value, digits = 2) {
    return 'Rp ' + fmt(value, digits);
  }

  function refreshFormula() {
    const get = id => document.getElementById(id);
    const start = Number(get('startCent')?.value || 0);
    const rate = Number(get('rate')?.value || 0);
    const targetRpText = get('targetRp')?.value || '0';
    const targetRp = Number(String(targetRpText).replace(/\./g, '').replace(/[^0-9-]/g, '')) || 0;
    const current = Number(get('current')?.value || 0);
    const target = Number(get('target')?.value || 0);
    const realized = current - start;

    const startUsd = start / 100;
    const startRp = startUsd * rate;
    const currentUsd = current / 100;
    const currentRp = currentUsd * rate;
    const profitRp = (realized / 100) * rate;

    const f1 = get('f1');
    const f2 = get('f2');
    const f3 = get('f3');
    const f4 = get('f4');
    if (!f1 || !f2 || !f3 || !f4) return;

    f1.textContent = targetRp > 0 && rate > 0
      ? idr(targetRp, 0) + ' ÷ ' + idr(rate, 0) + ' × 100 = ' + fmt(target) + ' CENT'
      : 'Target Rupiah ÷ Kurs USD/IDR × 100 = Target CENT';

    f2.textContent = start > 0
      ? fmt(start) + ' CENT ÷ 100 = $' + fmt(startUsd, 2) + ' → ' + idr(startRp, 2)
      : 'Modal awal CENT ÷ 100 = USD → USD × Kurs = Rupiah';

    f3.textContent = current > 0 && rate > 0
      ? fmt(current) + ' CENT ÷ 100 = $' + fmt(currentUsd, 2) + ' → ' + idr(currentRp, 2)
      : 'Current CENT ÷ 100 = USD → USD × Kurs = Rupiah';

    f4.textContent = realized !== 0 && rate > 0
      ? '(' + fmt(current) + ' − ' + fmt(start) + ') CENT = ' + (realized >= 0 ? '+' : '') + fmt(realized) + ' CENT → ' + (profitRp >= 0 ? '+' : '') + idr(profitRp, 2)
      : 'Profit / Rugi = Current CENT − Modal Awal CENT';
  }

  window.addEventListener('DOMContentLoaded', () => {
    refreshFormula();
    ['startCent', 'targetRp', 'rate'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', refreshFormula);
      document.getElementById(id)?.addEventListener('change', refreshFormula);
    });
    const current = document.getElementById('current');
    if (current) new MutationObserver(refreshFormula).observe(current, { attributes: true, attributeFilter: ['value'] });
    setInterval(refreshFormula, 500);
  });
})();
