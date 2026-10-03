(() => {
  const JOURNAL_KEY = 'cent-journal';
  const HISTORY_KEY = 'cent-monthly-history';
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } };
  const parseNumber = (value) => {
    let s = String(value ?? '').replace(/[^0-9,.-]/g, '').trim();
    if (!s) return 0;
    if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
    else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    return Number(s) || 0;
  };
  const currentMonth = () => document.getElementById('month')?.value || new Date().toISOString().slice(0, 7);
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

    [...body.rows].forEach(row => {
      if (row.classList.contains('empty')) return;
      const cells = [...row.cells];
      if (cells.length < 6) return;
      const actionCell = cells[cells.length - 1];
      if (!actionCell) return;

      let button = actionCell.querySelector('[data-delete-journal]');
      if (button) return;

      const entry = findEntry(row, m);
      if (!entry) return;

      button = document.createElement('button');
      button.type = 'button';
      button.dataset.deleteJournal = entry.id || `${entry.date}-${entry.entry}-${entry.createdAt || ''}`;
      button.className = 'btn-icon btn-delete';
      button.textContent = '🗑 Hapus';
      button.title = 'Hapus entry ini';
      button.style.display = 'inline-block';
      button.style.visibility = 'visible';
      button.style.cursor = 'pointer';

      button.addEventListener('click', () => {
        const label = `Entry #${entry.entry || '?'} pada ${entry.date || m}`;
        if (!window.confirm(`Hapus ${label}? Data ini akan hilang dari jurnal dan perhitungan bulan aktif.`)) return;
        const journal = read(JOURNAL_KEY, []);
        const next = entry.id ? journal.filter(x => x.id !== entry.id) : journal.filter(x => x !== entry);
        localStorage.setItem(JOURNAL_KEY, JSON.stringify(next));
        window.location.reload();
      });
      actionCell.appendChild(button);
    });

    const note = document.getElementById('lockedNote');
    if (note) note.textContent = 'Target bulan yang sudah ditutup tetap terkunci. Jika ada jurnal yang salah input, entry tersebut tetap dapat dihapus lewat tombol 🗑 Hapus di tabel jurnal.';
  }

  window.addEventListener('DOMContentLoaded', () => {
    renderDeleteButtons();
    const body = document.getElementById('body');
    if (body) new MutationObserver(renderDeleteButtons).observe(body, { childList: true, subtree: true });
    document.getElementById('month')?.addEventListener('change', () => setTimeout(renderDeleteButtons, 100));
  });
})();
