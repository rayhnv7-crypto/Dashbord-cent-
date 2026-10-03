(() => {
  const JOURNAL_KEY = 'cent-journal';
  const HISTORY_KEY = 'cent-monthly-history';

  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  };

  const parseNumber = (value) => {
    let s = String(value ?? '').replace(/[^0-9,.-]/g, '').trim();
    if (!s) return 0;
    if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
    else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    return Number(s) || 0;
  };

  const currentMonth = () => document.getElementById('month')?.value || new Date().toISOString().slice(0, 7);
  const isClosed = (m) => read(HISTORY_KEY, []).some(x => x.month === m && x.status === 'CLOSED');
  const normalize = (v) => String(v ?? '').trim().replace(/\s+/g, ' ');

  function findEntry(row, month) {
    const cells = [...row.cells];
    if (cells.length < 6) return null;
    const date = normalize(cells[0].textContent);
    const entry = parseNumber(cells[1].textContent);
    const lot = parseNumber(cells[2].textContent);
    const pl = parseNumber(cells[3].textContent);
    const note = normalize(cells[5].textContent);
    const journal = read(JOURNAL_KEY, []).filter(x => (x.month || String(x.date || '').slice(0, 7)) === month);

    return journal.find(x =>
      normalize(x.date) === date &&
      parseNumber(x.entry) === entry &&
      Math.abs(parseNumber(x.lot) - lot) < 0.000001 &&
      Math.abs(parseNumber(x.pl) - pl) < 0.000001 &&
      normalize(x.note) === note
    ) || null;
  }

  function renderDeleteButtons() {
    const body = document.getElementById('body');
    if (!body) return;
    const m = currentMonth();
    const locked = isClosed(m);

    [...body.rows].forEach(row => {
      if (row.classList.contains('empty')) return;
      const cells = [...row.cells];
      if (cells.length < 6) return;
      const actionCell = cells[cells.length - 1];
      if (!actionCell) return;

      // Always make the delete control visible. If a previous render created it,
      // only refresh its locked state rather than adding a duplicate button.
      let button = actionCell.querySelector('[data-delete-journal]');
      if (button) {
        button.disabled = locked;
        button.textContent = locked ? '🔒' : '🗑 Hapus';
        button.title = locked ? 'Bulan sudah ditutup' : 'Hapus entry ini';
        return;
      }

      const entry = findEntry(row, m);
      if (!entry) return;

      button = document.createElement('button');
      button.type = 'button';
      button.dataset.deleteJournal = entry.id || `${entry.date}-${entry.entry}-${entry.createdAt || ''}`;
      button.className = 'btn-icon btn-delete';
      button.textContent = locked ? '🔒' : '🗑 Hapus';
      button.title = locked ? 'Bulan sudah ditutup' : 'Hapus entry ini';
      button.disabled = locked;
      button.style.display = 'inline-block';
      button.style.visibility = 'visible';
      button.style.cursor = locked ? 'not-allowed' : 'pointer';

      button.addEventListener('click', () => {
        if (locked) return;
        const label = `Entry #${entry.entry || '?'} pada ${entry.date || m}`;
        if (!window.confirm(`Hapus ${label}? Data ini akan hilang dari jurnal dan perhitungan bulan aktif.`)) return;

        const journal = read(JOURNAL_KEY, []);
        let next;
        if (entry.id) next = journal.filter(x => x.id !== entry.id);
        else next = journal.filter(x => x !== entry);
        localStorage.setItem(JOURNAL_KEY, JSON.stringify(next));
        window.location.reload();
      });

      actionCell.appendChild(button);
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    renderDeleteButtons();
    const body = document.getElementById('body');
    if (body) new MutationObserver(() => renderDeleteButtons()).observe(body, { childList: true, subtree: true });
    document.getElementById('month')?.addEventListener('change', () => setTimeout(renderDeleteButtons, 100));
  });
})();
