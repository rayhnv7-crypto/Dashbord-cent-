(() => {
  const JOURNAL_KEY = 'cent-journal';
  const HISTORY_KEY = 'cent-monthly-history';

  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  };

  const currentMonth = () => document.getElementById('month')?.value || new Date().toISOString().slice(0, 7);
  const isClosed = (month) => read(HISTORY_KEY, []).some(x => x.month === month && x.status === 'CLOSED');

  const normalize = (value) => String(value ?? '').trim().replace(/\s+/g, ' ');
  const numberFromDisplay = (value) => {
    let s = String(value ?? '').replace(/[^0-9,.-]/g, '').trim();
    if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
    else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    return Number(s) || 0;
  };

  function findEntry(row, month) {
    const cells = [...row.cells];
    if (cells.length < 6) return null;
    const date = normalize(cells[0].textContent);
    const entry = numberFromDisplay(cells[1].textContent);
    const lot = numberFromDisplay(cells[2].textContent);
    const pl = numberFromDisplay(cells[3].textContent);
    const note = normalize(cells[5].textContent);
    const journal = read(JOURNAL_KEY, []).filter(x => (x.month || String(x.date || '').slice(0, 7)) === month);

    return journal.find(x =>
      normalize(x.date) === date &&
      numberFromDisplay(x.entry) === entry &&
      Math.abs(numberFromDisplay(x.lot) - lot) < 0.000001 &&
      Math.abs(numberFromDisplay(x.pl) - pl) < 0.000001 &&
      normalize(x.note) === note
    ) || null;
  }

  function renderActions() {
    const body = document.getElementById('body');
    if (!body) return;
    const month = currentMonth();
    const locked = isClosed(month);

    [...body.rows].forEach(row => {
      if (row.classList.contains('empty')) return;
      let cell = row.cells[row.cells.length - 1];
      if (!cell) return;

      cell.classList.add('actions');
      if (cell.querySelector('[data-delete-journal]')) return;

      const entry = findEntry(row, month);
      if (!entry) return;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn-icon btn-delete';
      button.dataset.deleteJournal = entry.id || '';
      button.textContent = locked ? '🔒' : '🗑 Hapus';
      button.title = locked ? 'Jurnal bulan yang sudah ditutup terkunci' : 'Hapus entry ini';
      button.disabled = locked;
      button.addEventListener('click', () => {
        if (locked) return;
        const label = `Entry #${entry.entry || '?'} pada ${entry.date || month}`;
        if (!window.confirm(`Hapus ${label}? Data ini akan hilang dari jurnal dan perhitungan bulan aktif.`)) return;

        const journal = read(JOURNAL_KEY, []);
        const before = journal.length;
        const next = journal.filter(x => x.id !== entry.id);
        if (next.length === before) {
          // Legacy fallback when an old record has no id.
          const index = journal.indexOf(entry);
          if (index >= 0) journal.splice(index, 1);
        }
        localStorage.setItem(JOURNAL_KEY, JSON.stringify(next));
        window.location.reload();
      });
      cell.appendChild(button);
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    renderActions();
    const body = document.getElementById('body');
    if (body) new MutationObserver(renderActions).observe(body, { childList: true, subtree: true });
    document.getElementById('month')?.addEventListener('change', () => setTimeout(renderActions, 50));
  });
})();
