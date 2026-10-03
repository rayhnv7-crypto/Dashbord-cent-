(() => {
  const readDrafts = () => {
    try { return JSON.parse(localStorage.getItem('cent-monthly-drafts') || '{}'); }
    catch { return {}; }
  };
  const writeDrafts = (drafts) => localStorage.setItem('cent-monthly-drafts', JSON.stringify(drafts));

  function installDeleteDraft() {
    const saveButton = document.getElementById('saveTarget');
    const row = saveButton?.parentElement;
    const month = document.getElementById('month');
    if (!saveButton || !row || !month || document.getElementById('deleteTargetDraft')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'deleteTargetDraft';
    button.className = 'btn alt';
    button.textContent = '🗑 Hapus Draft';
    button.title = 'Hapus setup target bulan yang masih berupa draft';

    button.addEventListener('click', () => {
      const m = month.value;
      const drafts = readDrafts();
      if (!drafts[m]) {
        alert('Belum ada draft target untuk bulan ' + m + '.');
        return;
      }
      if (!confirm('Hapus setup target bulan ' + m + '? Data draft ini akan dihapus dan bisa dibuat ulang.')) return;
      delete drafts[m];
      writeDrafts(drafts);
      window.location.reload();
    });

    row.appendChild(button);
  }

  window.addEventListener('DOMContentLoaded', installDeleteDraft);
})();
