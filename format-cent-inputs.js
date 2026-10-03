(() => {
  const formatID = (value, decimals = 2) => {
    const raw = String(value ?? '').replace(/[^0-9,-]/g, '').replace(',', '.');
    const n = Number(raw);
    if (!Number.isFinite(n)) return '';
    return n.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const parseID = (value) => {
    const text = String(value ?? '').trim();
    if (!text) return 0;
    // Indonesian input: 1.685,00 -> 1685; 18.000 -> 18000.
    if (text.includes(',')) return Number(text.replace(/\./g, '').replace(',', '.')) || 0;
    if (/^\d{1,3}(\.\d{3})+$/.test(text)) return Number(text.replace(/\./g, '')) || 0;
    return Number(text) || 0;
  };

  const setup = () => {
    const start = document.getElementById('startCent');
    const rate = document.getElementById('rate');
    if (!start || !rate) return;

    // These two fields are display fields, but before the existing app logic
    // runs we temporarily expose a plain numeric value so calculations stay unchanged.
    start.type = 'text';
    rate.type = 'text';
    start.inputMode = 'decimal';
    rate.inputMode = 'numeric';
    start.placeholder = 'Contoh: 1.685,00';
    rate.placeholder = 'Contoh: 18.000';
    start.autocomplete = 'off';
    rate.autocomplete = 'off';

    const formatField = (field, decimals) => {
      const parsed = parseID(field.value);
      if (field.value !== '') field.value = formatID(parsed, decimals);
    };

    formatField(start, 2);
    formatField(rate, 0);

    const normalizeBeforeApp = (field, decimals) => {
      field.addEventListener('input', () => {
        const parsed = parseID(field.value);
        field.value = parsed ? String(parsed) : '';
        setTimeout(() => {
          if (document.activeElement === field && field.value !== '') {
            field.value = formatID(parsed, decimals);
          }
        }, 0);
      }, true);

      field.addEventListener('blur', () => formatField(field, decimals));
    };

    normalizeBeforeApp(start, 2);
    normalizeBeforeApp(rate, 0);

    const startLabel = start.closest('.field')?.querySelector('label');
    if (startLabel && !startLabel.nextElementSibling?.classList.contains('input-help')) {
      const help = document.createElement('div');
      help.className = 'input-help';
      help.textContent = 'Tulis dengan format Indonesia. Contoh: 1.685,00 CENT';
      startLabel.parentElement.appendChild(help);
    }

    const rateLabel = rate.closest('.field')?.querySelector('label');
    if (rateLabel && !rateLabel.nextElementSibling?.classList.contains('input-help')) {
      const help = document.createElement('div');
      help.className = 'input-help';
      help.textContent = 'Contoh: 18.000, bukan 18000';
      rateLabel.parentElement.appendChild(help);
    }
  };

  window.addEventListener('DOMContentLoaded', setup);
})();
