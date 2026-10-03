// Force Vercel production redeploy from GitHub main.
(() => {
  const DRAFT_KEY = 'cent-monthly-drafts';
  const HISTORY_KEY = 'cent-monthly-history';
  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  function sync() {
    const saveButton = document.getElementById('saveTarget');
    const row = saveButton?.parentElement;
    const month = document.getElementById('month');
    if (!saveButton || !row || !month) return;

    let button = document.getElementById('deleteTargetDraft');
    const drafts = read(DRAFT_KEY, {});
    const history = read(HISTORY_KEY, []);
    const m = month.value;
    const hasDraft = !!drafts[m];
    const historyRecord = history.find(x => x.month === m);
    const status = historyRecord?.status || (hasDraft ? 'DRAFT' : 'DRAFT');
    const show = hasDraft && status === 'DRAFT';

    if (!show) {
      button?.remove();
      return;
    }

    if (button) return;

    button = document.createElement('button');
    button.type = 'button';
    button.id = 'deleteTargetDraft';
    button.className = 'btn alt';
    button.textContent = '🗑 Hapus Draft';
    button.title = 'Hapus setup target bulan yang masih berupa draft';

    button.addEventListener('click', () => {
      const currentDrafts = read(DRAFT_KEY, {});
      if (!currentDrafts[m]) {
        sync();
        return;
      }
      if (!confirm('Hapus setup target bulan ' + m + '? Data draft ini akan dihapus dan bisa dibuat ulang.')) return;
      delete currentDrafts[m];
      write(DRAFT_KEY, currentDrafts);
      window.location.reload();
    });

    row.appendChild(button);
  }

  window.addEventListener('DOMContentLoaded', () => {
    sync();
    document.getElementById('month')?.addEventListener('change', () => setTimeout(sync, 50));
    window.setInterval(sync, 500);
  });
})();
