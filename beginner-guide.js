(() => {
  const addGuide = () => {
    if (document.getElementById('beginnerGuide')) return;
    const target = document.querySelector('.section');
    if (!target) return;

    const section = document.createElement('section');
    section.className = 'section beginner-guide';
    section.id = 'beginnerGuide';
    section.innerHTML = `
      <h2>🧭 Panduan Saya Harus Paham</h2>
      <div class="notice guide-intro">
        Bagian ini bukan memaksa CEO mengikuti cara trading tertentu. Fungsinya sederhana: setiap angka di dashboard dijelaskan <b>artinya</b>, <b>hubungannya</b>, dan <b>apa yang perlu CEO cek</b> sebelum lanjut.
      </div>
      <div class="guide-grid">
        <div class="guide-step"><span>1</span><div><b>Modal Awal</b><p>Ini titik mulai bulan. Jangan dianggap profit. Contoh: 1.685,00 CENT berarti modal awal yang sedang dipantau.</p></div></div>
        <div class="guide-step"><span>2</span><div><b>Target Rupiah</b><p>Ini tujuan yang CEO tentukan sendiri untuk bulan tersebut. Bulan depan boleh berbeda dan boleh lebih besar.</p></div></div>
        <div class="guide-step"><span>3</span><div><b>Target CENT</b><p>Software menerjemahkan target Rupiah ke CENT memakai kurs dan rasio akun CENT yang sedang dipakai.</p></div></div>
        <div class="guide-step"><span>4</span><div><b>Current CENT</b><p>Ini posisi modal setelah hasil jurnal bulan berjalan diperhitungkan. Fokusnya bukan mengejar angka cantik, tetapi melihat apakah jurnal benar-benar menambah atau mengurangi modal.</p></div></div>
        <div class="guide-step"><span>5</span><div><b>Sisa Target</b><p>Ini jarak dari posisi sekarang menuju target. Kalau hasil jurnal bertambah, jaraknya mengecil. Kalau rugi, jaraknya membesar.</p></div></div>
        <div class="guide-step"><span>6</span><div><b>Jurnal Trading</b><p>Setiap entry adalah bukti aktivitas. Catat hasil realized, lot, dan catatan. Dari sinilah software membaca perkembangan bulan.</p></div></div>
      </div>
      <div class="guide-check">
        <b>Checklist CEO sebelum mulai trading</b>
        <div class="check-row"><span>□</span> Saya tahu modal awal saya berapa.</div>
        <div class="check-row"><span>□</span> Saya tahu target bulan ini berapa Rupiah.</div>
        <div class="check-row"><span>□</span> Saya tahu kurs yang saya pakai.</div>
        <div class="check-row"><span>□</span> Saya paham berapa CENT target saya.</div>
        <div class="check-row"><span>□</span> Saya baru klik <b>Closing Target / Mulai Trading</b> setelah setup saya yakin benar.</div>
      </div>
      <div class="guide-note"><b>Catatan penting:</b> software saat ini menggunakan model <b>100 CENT = USD 1</b> untuk konversi akun CENT. Ini bukan klaim bahwa semua broker menggunakan rasio yang sama. Jika spesifikasi broker CEO berbeda, rasio ini harus disesuaikan.</div>
    `;
    target.parentNode.insertBefore(section, target);
  };
  window.addEventListener('DOMContentLoaded', addGuide);
})();
