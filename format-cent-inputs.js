(() => {
  const parseID = (value) => {
    const text = String(value ?? '').trim();
    if (!text) return 0;
    if (text.includes(',')) return Number(text.replace(/\./g, '').replace(',', '.')) || 0;
    if (/^\d{1,3}(\.\d{3})+$/.test(text)) return Number(text.replace(/\./g, '')) || 0;
    return Number(text) || 0;
  };
  const formatID = (value, decimals) => parseID(value).toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  window.addEventListener('DOMContentLoaded', () => {
    const start = document.getElementById('startCent');
    const rate = document.getElementById('rate');
    if (!start || !rate) return;

    start.type = 'text';
    rate.type = 'text';
    start.inputMode = 'decimal';
    rate.inputMode = 'numeric';
    start.placeholder = 'Contoh: 1.685,00';
    rate.placeholder = 'Contoh: 18.000';
    start.autocomplete = 'off';
    rate.autocomplete = 'off';

    [
      [start, 2, 'Contoh: 1.685,00 CENT'],
      [rate, 0, 'Contoh: 18.000']
    ].forEach(([field, decimals, helpText]) => {
      field.addEventListener('focus', () => {
        if (field.value !== '') field.value = String(parseID(field.value));
      });
      field.addEventListener('blur', () => {
        if (field.value !== '') field.value = formatID(field.value, decimals);
      });
      const parent = field.closest('.field');
      if (parent && !parent.querySelector('.input-help')) {
        const help = document.createElement('div');
        help.className = 'input-help';
        help.textContent = helpText;
        parent.appendChild(help);
      }
    });

    setTimeout(() => {
      if (document.activeElement !== start && start.value !== '') start.value = formatID(start.value, 2);
      if (document.activeElement !== rate && rate.value !== '') rate.value = formatID(rate.value, 0);
    }, 0);
  });
})();
