/*********************************************************************
 * LABORATORIUM UMA — Backend API (Google Apps Script)
 * -------------------------------------------------------------------
 * Cara pakai:
 *  1. Buka spreadsheet Google Sheets (database) kamu.
 *  2. Menu: Extensions > Apps Script
 *  3. Hapus isi editor, tempel semua kode ini, simpan.
 *  4. Jalankan fungsi setupDB() sekali (untuk bikin tabel + akun demo).
 *  5. Deploy > New deployment > Web app
 *       - Execute as: Me
 *       - Who has access: Anyone
 *  6. Salin URL web app (berakhiran /exec) ke dashboard/js/api.js
 *********************************************************************/

var APP_TOKEN = 'LABUMA2026';
var SS_ID = ''; // opsional: isi ID spreadsheet jika script tidak menempel di sheet

/*** Definisi tabel (nama sheet -> headers) ***/
var SHEETS = {
  users:           ['id','username','password','name','role','fakultas','prodi','email','aktif'],
  labs:            ['id','nama','fakultas','prodi','lokasi','deskripsi'],
  equipment:       ['id','kode','nama','jumlah','kondisi','lokasi_lab','tanggal_masuk','keterangan'],
  consumables:     ['id','kode','nama','satuan','stok_masuk','stok_keluar','stok_sisa','stok_minimum','supplier','keterangan'],
  equipment_req:   ['id','no_surat','nama_alat','jumlah','spesifikasi','alasan','pengaju','tanggal','status','by_kepala','keterangan','tanggal_selesai'],
  consumable_req:  ['id','no_surat','nama_bahan','jumlah','satuan','alasan','pengaju','tanggal','status','by_kepala','keterangan','tanggal_selesai'],
  schedules:       ['id','kode','lab','fakultas','prodi','matkul','dosen','asisten','hari','jam_mulai','jam_selesai','ruang','semester'],
  borrowings:      ['id','no_surat','peminjam','role','keperluan','tanggal_pinjam','tanggal_kembali','items','tanggal_aju','status','by_laboran','by_kepala','keterangan'],
  reports:         ['id','kode','judul','fakultas','prodi','matkul','asisten','tanggal','ringkasan','hasil','file_link','status','by_laboran','by_kepala','keterangan'],
  certificates:    ['id','kode','nama','role','fakultas','prodi','semester','tanggal_terbit','status','by_kepala','published'],
  monthly_reports: ['id','kode','bulan','tahun','disusun_oleh','isi','status','approved_by','tanggal'],
  menus:           ['id','label','tipe','slug','parent_id','urutan','ikon','published','target'],
  pages:           ['id','slug','judul','kategori','isi','published','tanggal'],
  posts:           ['id','judul','kategori','ringkasan','isi','gambar','tanggal','penulis','status','by_kepala','by_admin'],
  sliders:         ['id','judul','deskripsi','gambar','link','urutan','published'],
  settings:        ['key','value']
};

/*** Spreadsheet handler ***/
function ss() {
  var key = 'SS_ID';
  var id = PropertiesService.getScriptProperties().getProperty(key);
  if (!id && SS_ID) id = SS_ID;
  if (!id) {
    // Auto-buat spreadsheet di Drive pemilik script (sekali saja)
    var book = SpreadsheetApp.create('Laboratorium UMA Database');
    id = book.getId();
    PropertiesService.getScriptProperties().setProperty(key, id);
  }
  return SpreadsheetApp.openById(id);
}

function getSheet(name) {
  var sh = ss().getSheetByName(name);
  if (!sh) throw new Error('Tabel tidak ditemukan: ' + name + '. Jalankan setupDB() sekali.');
  return sh;
}

/*** Util ***/
function nowIso() { return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss'); }
function todayStr() { return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'); }
function yearNow() { return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy'); }

function objToRow(headers, data) {
  return headers.map(function (h) { return (data[h] !== undefined && data[h] !== null) ? String(data[h]) : ''; });
}

/*** CRUD: read ***/
function readTable(table) {
  var sh = getSheet(table);
  var last = sh.getLastRow();
  if (last < 2) return [];
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var values = sh.getRange(2, 1, last - 1, sh.getLastColumn()).getValues();
  var out = [];
  for (var i = 0; i < values.length; i++) {
    var o = {};
    for (var c = 0; c < headers.length; c++) {
      var v = values[i][c];
      if (v instanceof Date) {
        v = Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      }
      o[headers[c]] = String(v !== null && v !== undefined ? v : '');
    }
    out.push(o);
  }
  return out;
}

/*** CRUD: add ***/
function addRow(table, data) {
  if (!SHEETS[table]) throw new Error('Tabel tidak dikenal');
  var sh = getSheet(table);
  if (!data.id) data.id = genId(table);
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  sh.appendRow(objToRow(headers, data));
  return data.id;
}

/*** CRUD: update ***/
function updateRow(table, id, data) {
  var sh = getSheet(table);
  var last = sh.getLastRow();
  if (last < 2) throw new Error('Data kosong');
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var values = sh.getRange(2, 1, last - 1, sh.getLastColumn()).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      var row = headers.concat(); // salin headers utk map
      for (var c = 0; c < headers.length; c++) {
        var key = headers[c];
        if (c === 0) continue; // id tetap
        if (data[key] !== undefined && data[key] !== null) {
          sh.getRange(i + 2, c + 1).setValue(String(data[key]));
        }
      }
      return id;
    }
  }
  throw new Error('ID tidak ditemukan: ' + id);
}

/*** CRUD: delete ***/
function deleteRow(table, id) {
  var sh = getSheet(table);
  var last = sh.getLastRow();
  if (last < 2) return id;
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var values = sh.getRange(2, 1, last - 1, sh.getLastColumn()).getValues();
  for (var i = values.length - 1; i >= 0; i--) {
    if (String(values[i][0]) === String(id)) {
      sh.deleteRow(i + 2);
    }
  }
  return id;
}

/*** id auto increment (angka maks + 1) ***/
function genId(table) {
  var rows = readTable(table);
  var max = 0;
  rows.forEach(function (r) {
    var n = parseInt(r.id, 10);
    if (!isNaN(n) && n > max) max = n;
  });
  return String(max + 1);
}

/*** Nomor surat otomatis: prefix -> PA-2026-0001 ***/
function nextNo(prefix) {
  var key = 'seq_' + prefix.toLowerCase();
  var set = getSheet('settings');
  var last = set.getLastRow();
  var seq = 1;
  for (var i = 2; i <= last; i++) {
    var k = set.getRange(i, 1).getValue();
    if (String(k) === key) {
      seq = parseInt(set.getRange(i, 2).getValue(), 10) || 0;
      seq++;
      set.getRange(i, 2).setValue(seq);
      break;
    }
  }
  if (seq === 1) set.appendRow([key, 1]);
  var pad = ('0000' + seq).slice(-4);
  return prefix + '-' + yearNow() + '-' + pad;
}

/*** Setting get/set ***/
function getSetting(key) {
  var set = getSheet('settings');
  var last = set.getLastRow();
  for (var i = 2; i <= last; i++) {
    if (String(set.getRange(i, 1).getValue()) === key) return set.getRange(i, 2).getValue();
  }
  return '';
}
function setSetting(key, val) {
  var set = getSheet('settings');
  var last = set.getLastRow();
  for (var i = 2; i <= last; i++) {
    if (String(set.getRange(i, 1).getValue()) === key) {
      set.getRange(i, 2).setValue(val);
      return;
    }
  }
  set.appendRow([key, val]);
}

/*** LOGIN ***/
function doLogin(data) {
  var rows = readTable('users');
  for (var i = 0; i < rows.length; i++) {
    var u = rows[i];
    if (u.username === data.username && u.password === data.password) {
      if (u.aktif === '0') return { ok: false, message: 'Akun dinonaktifkan' };
      return { ok: true, user: { username: u.username, name: u.name, role: u.role, fakultas: u.fakultas, prodi: u.prodi, email: u.email } };
    }
  }
  return { ok: false, message: 'Username atau password salah' };
}

/*** LAPORAN BULANAN: agregasi per bulan+tahun ***/
function doMonthly(data) {
  var bulan = String(data.bulan || '').padStart(2, '0');
  var tahun = String(data.tahun || yearNow());
  var prefix = tahun + '-' + bulan;

  function inMonth(d) { return String(d || '').indexOf(prefix) === 0; }

  var borrowings = readTable('borrowings').filter(function (r) { return inMonth(r.tanggal_aju); });
  var reports = readTable('reports').filter(function (r) { return inMonth(r.tanggal); });
  var eqReq = readTable('equipment_req').filter(function (r) { return inMonth(r.tanggal); });
  var cbReq = readTable('consumable_req').filter(function (r) { return inMonth(r.tanggal); });
  var equipment = readTable('equipment');
  var consumables = readTable('consumables');

  return {
    ok: true,
    bulan: bulan,
    tahun: tahun,
    borrowings: borrowings,
    reports: reports,
    equipment_req: eqReq,
    consumable_req: cbReq,
    equipment_total: equipment.length,
    equipment_baik: equipment.filter(function (r) { return r.kondisi === 'Baik'; }).length,
    consumables_total: consumables.length,
    low_stock: consumables.filter(function (r) {
      var sisa = parseInt(r.stok_sisa, 10) || 0;
      var min = parseInt(r.stok_minimum, 10) || 0;
      return sisa <= min;
    })
  };
}

/*** RINGKASAN DASHBOARD (hitungan cepat per role) ***/
function doSummary() {
  function cnt(tab, status) {
    var rows = readTable(tab);
    if (status) return rows.filter(function (r) { return r.status === status; }).length;
    return rows.length;
  }
  return {
    ok: true,
    users: cnt('users'),
    equipment: cnt('equipment'),
    consumables: cnt('consumables'),
    low_stock: readTable('consumables').filter(function (r) {
      var sisa = parseInt(r.stok_sisa, 10) || 0;
      var min = parseInt(r.stok_minimum, 10) || 0;
      return sisa <= min;
    }).length,
    bor_pending: cnt('borrowings', 'Menunggu'),
    bor_approved: cnt('borrowings', 'Disetujui'),
    rep_pending: cnt('reports', 'Menunggu'),
    rep_approved: cnt('reports', 'Disetujui'),
    req_pending: cnt('equipment_req', 'Menunggu') + cnt('consumable_req', 'Menunggu'),
    schedules: cnt('schedules')
  };
}

/*** PILIHAN SUNGGUHAN (dropdown sumber data) ***/
function doOptions() {
  var labs = readTable('labs');
  var fakultas = [];
  labs.forEach(function (l) {
    if (l.fakultas && fakultas.indexOf(l.fakultas) === -1) fakultas.push(l.fakultas);
  });
  return { ok: true, labs: labs, fakultas: fakultas };
}

/*** ================= KONTEN PUBLIK (website) ================= ***/
function buildMenuTree(list) {
  var parents = [];
  var parentMap = {};
  list.forEach(function (m) { parentMap[m.id] = m; });
  list.forEach(function (m) {
    var pid = String(m.parent_id || '').trim();
    if (pid === '' || pid === '0' || !parentMap[pid]) {
      m.children = [];
      parents.push(m);
    }
  });
  parents.sort(function (a, b) { return (parseInt(a.urutan, 10) || 0) - (parseInt(b.urutan, 10) || 0); });
  parents.forEach(function (p) {
    var children = list.filter(function (m) { return String(m.parent_id) === String(p.id); });
    children.sort(function (a, b) { return (parseInt(a.urutan, 10) || 0) - (parseInt(b.urutan, 10) || 0); });
    p.children = children;
  });
  return parents;
}

function doSite() {
  var menus = readTable('menus').filter(function (m) { return m.published === '1'; });
  var posts = readTable('posts').filter(function (p) { return p.status === 'Terbit'; });
  posts.sort(function (a, b) { return String(b.tanggal).localeCompare(String(a.tanggal)); });
  var sliders = readTable('sliders').filter(function (s) { return s.published === '1'; });
  sliders.sort(function (a, b) { return (parseInt(a.urutan, 10) || 0) - (parseInt(b.urutan, 10) || 0); });
  var certs = readTable('certificates').filter(function (c) { return c.published === '1' && c.status === 'Disetujui'; });
  return {
    ok: true,
    menus: buildMenuTree(menus),
    posts: posts.slice(0, 9),
    sliders: sliders,
    certs: certs,
    settings: { semester: getSetting('semester') }
  };
}

function doPage(data) {
  var rows = readTable('pages');
  var p = rows.find(function (r) { return r.slug === data.slug && r.published === '1'; });
  if (!p) return { ok: false, message: 'Halaman tidak ditemukan' };
  return { ok: true, page: p };
}

function doPosts(data) {
  var rows = readTable('posts').filter(function (p) { return p.status === 'Terbit'; });
  rows.sort(function (a, b) { return String(b.tanggal).localeCompare(String(a.tanggal)); });
  if (data.category && data.category !== 'all') {
    rows = rows.filter(function (p) { return p.kategori === data.category; });
  }
  return { ok: true, posts: rows };
}

function fetchPost(data) {
  var rows = readTable('posts');
  var p = rows.find(function (r) { return String(r.id) === String(data.id); });
  if (!p) return { ok: false, message: 'Postingan tidak ditemukan' };
  return { ok: true, post: p };
}

function doCert(data) {
  var rows = readTable('certificates');
  var c = rows.find(function (r) { return r.kode === data.kode; });
  if (!c) return { ok: false, message: 'Sertifikat tidak ditemukan. Periksa kembali kode.' };
  return {
    ok: true,
    cert: {
      kode: c.kode, nama: c.nama, role: c.role, fakultas: c.fakultas, prodi: c.prodi,
      semester: c.semester, tanggal_terbit: c.tanggal_terbit, status: c.status, published: c.published
    }
  };
}

/*** ================= UPGRADE (tambah tabel tanpa menghapus data) ================= ***/
function upgradeDB() {
  var book = ss();
  // Pastikan semua sheet ada dengan header yang benar
  Object.keys(SHEETS).forEach(function (name) {
    if (!book.getSheetByName(name)) book.insertSheet(name);
    var sh = book.getSheetByName(name);
    // Set header jika sheet kosong
    if (sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, SHEETS[name].length).setValues([SHEETS[name]]);
      sh.setFrozenRows(1);
    }
  });

  function hasRows(name) { return book.getSheetByName(name).getLastRow() > 1; }

  // Seed menus (nama sesuai tabel, 'tipe': parent | page | link)
  if (!hasRows('menus')) {
    var menuSh = book.getSheetByName('menus');
    [
      ['1', 'Beranda', 'page', 'index.html', '', '1', 'home', '1', ''],
      ['2', 'Profil', 'parent', '', '', '2', 'info', '1', ''],
      ['3', 'Visi, Tugas & Fungsi', 'page', 'profil.html#visi', '2', '1', 'eye', '1', ''],
      ['4', 'Struktur Organisasi', 'page', 'profil.html#struktur', '2', '2', 'users', '1', ''],
      ['5', 'Lokasi & Peta', 'page', 'profil.html#maps', '2', '3', 'map-pin', '1', ''],
      ['6', 'Fasilitas', 'page', 'fasilitas.html', '', '3', 'microscope', '1', ''],
      ['7', 'Layanan', 'parent', '', '', '4', 'calendar', '1', ''],
      ['8', 'Jadwal Praktikum', 'page', 'layanan.html#jadwal', '7', '1', 'calendar', '1', ''],
      ['9', 'Matakuliah Praktikum', 'page', 'layanan.html#matkul', '7', '2', 'book-open', '1', ''],
      ['10', 'Pengelola Lab', 'page', 'layanan.html#pengelola', '7', '3', 'user-cog', '1', ''],
      ['11', 'Unduhan', 'page', 'unduhan.html', '7', '4', 'download', '1', ''],
      ['12', 'Penelitian', 'parent', '', '', '5', 'flask-conical', '1', ''],
      ['13', 'Lab Fisiologi Tumbuhan', 'page', 'penelitian.html#fisiologi', '12', '1', 'leaf', '1', ''],
      ['14', 'Lab Proteksi Tanaman', 'page', 'penelitian.html#proteksi', '12', '2', 'shield', '1', ''],
      ['15', 'Lahan Percobaan', 'page', 'penelitian.html#lahan', '12', '3', 'trees', '1', ''],
      ['16', 'Rumah Kasa', 'page', 'penelitian.html#rumahkasa', '12', '4', 'home', '1', ''],
      ['17', 'Galeri', 'page', 'galeri.html', '', '6', 'image', '1', ''],
      ['18', 'Berita', 'page', 'berita.html', '', '7', 'newspaper', '1', ''],
      ['19', 'Kontak', 'page', 'kontak.html', '', '8', 'phone', '1', ''],
      ['20', 'SOP Laboratorium', 'page', 'sop-laboratorium', '', '9', 'file-text', '1', '']
    ].forEach(function (r) { menuSh.appendRow(r); });
  }

  // Seed pages (halaman dinamis)
  if (!hasRows('pages')) {
    var pgSh = book.getSheetByName('pages');
    pgSh.appendRow(['1', 'sop-laboratorium', 'SOP Laboratorium', 'Layanan', JSON.stringify([
      { "t": "p", "v": "Standar Operasional Prosedur penggunaan fasilitas laboratorium Universitas Medan Area disusun untuk menjamin kelancaran, ketertiban, dan keselamatan kerja di lingkungan laboratorium." },
      { "t": "h", "v": "1. Ketentuan Umum" },
      { "t": "p", "v": "Seluruh pengguna laboratorium wajib membawa kartu identitas dan mengisi daftar hadir yang tersedia di laboratorium." },
      { "t": "h", "v": "2. Penggunaan Alat" },
      { "t": "p", "v": "Peminjaman alat dilakukan melalui unit laboratorium paling lambat satu hari sebelum digunakan. Alat wajib dikembalikan dalam keadaan bersih dan baik." },
      { "t": "h", "v": "3. Keselamatan Kerja" },
      { "t": "p", "v": "Wajib menggunakan APD (alat pelindung diri) di area kerja. Setiap kecelakaan kerja wajib dilaporkan kepada laboran segera." }
    ], null, 2), '1', '2026-09-01']);
  }

  // Seed posts (berita)
  if (!hasRows('posts')) {
    var postSh = book.getSheetByName('posts');
    function post(id, judul, kat, ringkasan, blocks, gambar, tanggal, penulis, status) {
      postSh.appendRow([String(id), judul, kat, ringkasan, JSON.stringify(blocks), gambar, tanggal, penulis, status, 'kepalalab', 'admin']);
    }
    post('1', 'Laboratorium UMA Dukung Praktikum Semester Ganjil 2025/2026', 'Berita',
      'Seluruh laboratorium di lingkungan Universitas Medan Area siap melayani kegiatan praktikum semester ganjil TA 2025/2026.',
      [{ "t": "h", "v": "Praktikum Semester Ganjil 2025/2026 Resmi Dimulai" },
       { "t": "p", "v": "Universitas Medan Area melalui unit laboratorium telah menyiapkan seluruh fasilitas praktikum..." },
       { "t": "list", "v": ["Jadwal praktikum dapat diakses melalui menu Layanan", "Asisten wajib konfirmasi kehadiran 1 hari sebelumnya", "Penggunaan APD wajib selama kegiatan berlangsung"] }],
      'https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/6878142371714375724.jpg', '2026-09-01', 'Laboran Utama', 'Terbit');
    post('2', 'Pengisian Kuesioner Dosen dan Mahasiswa', 'Pengumuman',
      'Kuesioner evaluasi kegiatan praktikum untuk dosen dan mahasiswa telah dibuka.',
      [{ "t": "h", "v": "E-Valuasi Praktikum (KUESIONER)" },
       { "t": "p", "v": "Dosen dan mahasiswa diharapkan mengisi kuesioner evaluasi pelaksanaan praktikum..." }],
      'https://laboratorium.uma.ac.id/admin/uploads/kuesioner-ganjil-25-26.png.png', '2026-08-20', 'Laboran Utama', 'Terbit');
    post('3', 'Kegiatan Praktikum di Lahan Percobaan UMA', 'Kegiatan',
      'Kegiatan praktikum lapangan Prodi Agroteknologi berlangsung di lahan percobaan UMA.',
      [{ "t": "h", "v": "Praktikum Lapangan Agroteknologi" },
       { "t": "p", "v": "Mahasiswa Prodi Agroteknologi melaksanakan praktikum budidaya tanaman di lahan percobaan..." }],
      'https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/6506652741715048206.jpeg', '2026-08-12', 'Laboran Utama', 'Terbit');
  }

  // Seed sliders (hero)
  if (!hasRows('sliders')) {
    var slSh = book.getSheetByName('sliders');
    [
      ['1', 'Pusat Riset & Praktikum UMA', 'Mendukung praktikum, penelitian, dan pengujian terstandarisasi di lingkungan Universitas Medan Area.', 'https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/6878142371714375724.jpg', 'layanan.html#jadwal', '1', '1'],
      ['2', 'Fasilitas Laboratorium Modern', 'Berbagai laboratorium di seluruh fakultas siap mendukung kegiatan akademik Anda.', 'https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/6787828731762504523.jpeg', 'fasilitas.html', '2', '1']
    ].forEach(function (r) { slSh.appendRow(r); });
  }

  // Pastikan kolom published tersedia di certificates (jika header lama)
  var certSh = book.getSheetByName('certificates');
  var certHead = certSh.getRange(1, 1, 1, certSh.getLastColumn()).getValues()[0];
  if (certHead.indexOf('published') === -1) {
    certSh.getRange(1, certSh.getLastColumn() + 1).setValue('published');
    var lastRow = certSh.getLastRow();
    for (var i = 2; i <= lastRow; i++) {
      certSh.getRange(i, certSh.getLastColumn()).setValue('1');
    }
  }

  return { ok: true, message: 'Upgrade selesai: tabel konten website dibuat + data awal diisi tanpa menghapus data lama.' };
}

/*** ================= SETUP ================= ***/
function setupDB() {
  var book = ss();
  Object.keys(SHEETS).forEach(function (name) {
    if (!book.getSheetByName(name)) book.insertSheet(name);
    var sh = book.getSheetByName(name);
    sh.clear();
    sh.getRange(1, 1, 1, SHEETS[name].length).setValues([SHEETS[name]]);
    sh.setFrozenRows(1);
  });

  // Seed: settings
  var set = book.getSheetByName('settings');
  [['seq_pa', 0], ['seq_pb', 0], ['seq_sp', 0], ['seq_lp', 0], ['seq_cert', 0], ['seq_ml', 0], ['semester', 'Ganjil 2025/2026']].forEach(function (kv) {
    set.appendRow(kv);
  });

  // Seed: demo users
  var users = [
    ['1', 'admin', 'admin123', 'Administrator Lab', 'admin', 'Pusat', '-', 'admin@uma.ac.id', '1'],
    ['2', 'laboran', 'laboran123', 'Laboran Utama', 'laboran', 'Pusat', '-', 'laboran@uma.ac.id', '1'],
    ['3', 'kepalalab', 'kepalalab123', 'Kepala Laboratorium', 'kepalalab', 'Pusat', '-', 'kepalalab@uma.ac.id', '1'],
    ['4', 'asisten', 'asisten123', 'Asisten Lab Biologi', 'asisten', 'Saintek', 'Biologi', 'asisten@uma.ac.id', '1']
  ];
  var userSh = book.getSheetByName('users');
  users.forEach(function (r) { userSh.appendRow(r); });

  // Seed: labs
  var labs = [
    ['1', 'Lab Fisiologi Tumbuhan', 'Pertanian', 'Agroteknologi', 'Gedung PBSI', 'Lab utama prodi agroteknologi'],
    ['2', 'Lab Proteksi Tanaman', 'Pertanian', 'Agroteknologi', 'Gedung PBSI', 'Perlindungan tanaman'],
    ['3', 'Lab Biologi Dasar', 'Saintek', 'Biologi', 'Kampus Medan Estate', 'Praktikum biologi umum'],
    ['4', 'Lab Komputer', 'Teknik', 'Informatika', 'Kampus Medan Estate', 'Lab komputer & jaringan'],
    ['5', 'Lahan Percobaan', 'Pertanian', 'Agroteknologi', 'Kampus Medan Estate', 'Lahan terbuka percobaan'],
    ['6', 'Lab Psikologi', 'Psikologi', 'Psikologi', 'Kampus Medan Estate', 'Lab observasi & eksperimen']
  ];
  var labSh = book.getSheetByName('labs');
  labs.forEach(function (r) { labSh.appendRow(r); });

  // Seed: equipment
  var eq = [
    ['1', 'EQ-001', 'Mikroskop Binokuler', '12', 'Baik', 'Lab Biologi Dasar', '2025-01-10', 'Kondisi siap pakai'],
    ['2', 'EQ-002', 'Autoclave', '2', 'Baik', 'Lab Biologi Dasar', '2025-02-01', 'Sterilisasi alat'],
    ['3', 'EQ-003', 'pH Meter', '5', 'Perbaikan', 'Lab Fisiologi Tumbuhan', '2025-03-15', '3 unit perlu kalibrasi'],
    ['4', 'EQ-004', 'Timbangan Analitik', '4', 'Baik', 'Lahan Percobaan', '2025-01-20', 'Akurasi 0.0001 g'],
    ['5', 'EQ-005', 'Spektrofotometer', '1', 'Baik', 'Lab Fisiologi Tumbuhan', '2025-04-02', 'Pengukuran absorbansi'],
    ['6', 'EQ-006', 'CPU + Monitor', '30', 'Baik', 'Lab Komputer', '2025-06-01', 'Spesifikasi i5/8GB']
  ];
  var eqSh = book.getSheetByName('equipment');
  eq.forEach(function (r) { eqSh.appendRow(r); });

  // Seed: consumables
  var cb = [
    ['1', 'CB-001', 'Kaca Preparat', 'pak', '100', '40', '60', '30', 'PT Lab Jaya', ''],
    ['2', 'CB-002', 'Reagen HCL 0.1N', 'botol', '50', '35', '15', '10', 'PT Kimia Medan', ''],
    ['3', 'CB-003', 'Sarung Tangan Latex', 'box', '20', '5', '15', '5', 'PT Lab Jaya', ''],
    ['4', 'CB-004', 'Kertas Saring', 'rim', '10', '2', '8', '4', 'PT Kimia Medan', ''],
    ['5', 'CB-005', 'Alkohol 70%', 'liter', '60', '40', '20', '15', 'PT Kimia Medan', ''],
    ['6', 'CB-006', 'Aquades', 'liter', '200', '150', '50', '25', 'PT Kimia Medan', '']
  ];
  var cbSh = book.getSheetByName('consumables');
  cb.forEach(function (r) { cbSh.appendRow(r); });

  // Seed: schedules
  var sch = [
    ['1', 'SD-001', 'Lab Biologi Dasar', 'Saintek', 'Biologi', 'Biologi Umum', 'Dr. Andi', 'asisten', 'Senin', '08:00', '10:00', 'Lab 1', 'Ganjil 2025/2026'],
    ['2', 'SD-002', 'Lab Fisiologi Tumbuhan', 'Pertanian', 'Agroteknologi', 'Fisiologi Tumbuhan', 'Dr. Budi', 'asisten', 'Selasa', '10:00', '12:00', 'Lab 2', 'Ganjil 2025/2026'],
    ['3', 'SD-003', 'Lab Proteksi Tanaman', 'Pertanian', 'Agroteknologi', 'Proteksi Tanaman', 'Prof. Citra', 'asisten', 'Rabu', '13:00', '15:00', 'Lab 3', 'Ganjil 2025/2026']
  ];
  var schSh = book.getSheetByName('schedules');
  sch.forEach(function (r) { schSh.appendRow(r); });

// Seed: certificates
  var certSh = book.getSheetByName('certificates');
  certSh.appendRow(['1', 'CRT-2026-0001', 'Asisten Lab Biologi', 'asisten', 'Saintek', 'Biologi', 'Ganjil 2025/2026', '2026-01-15', 'Disetujui', 'kepalalab', '1']);

  var url = book.getUrl();
  return { ok: true, message: 'Database berhasil disetup + data demo diisi.', url: url };
}

/*** ================= ROUTER doPost ================= ***/
function doPost(e) {
  return handle(e);
}

function doGet(e) {
  return ContentService.createTextOutput(
    'LABORATORIUM UMA API OK. Deploy sebagai Web App & tekan URL ini untuk verifikasi.'
  ).setMimeType(ContentService.MimeType.TEXT);
}

function handle(e) {
  var raw = '';
  try {
    if (e.postData && e.postData.contents) raw = e.postData.contents;
    var data = raw ? JSON.parse(raw) : {};
  } catch (err) {
    return json({ ok: false, message: 'Body tidak valid: ' + err.message });
  }

  // Token check (kecuali action verification)
  if (data.action !== 'setup' && data.token !== APP_TOKEN) {
    return json({ ok: false, message: 'Token tidak valid' });
  }

try {
    switch (data.action) {
      case 'setup': return json(setupDB());
      case 'upgrade': return json(upgradeDB());
      case 'login': return json(doLogin(data));
      case 'get': return json({ ok: true, data: readTable(data.table) });
      case 'summary': return json(doSummary());
      case 'options': return json(doOptions());
      case 'monthly': return json(doMonthly(data));
      case 'site': return json(doSite());
      case 'page': return json(doPage(data));
      case 'posts': return json(doPosts(data));
      case 'post': return json(fetchPost(data));
      case 'cert': return json(doCert(data));
      case 'add':
        var aid = addRow(data.table, data.data || {});
        return json({ ok: true, id: aid });
      case 'update':
        updateRow(data.table, data.id, data.data || {});
        return json({ ok: true, id: data.id });
      case 'delete':
        deleteRow(data.table, data.id);
        return json({ ok: true, id: data.id });
      case 'nextno':
        return json({ ok: true, no: nextNo(data.prefix) });
      case 'setting':
        if (data.set !== undefined) { setSetting(data.key, data.set); return json({ ok: true }); }
        return json({ ok: true, value: getSetting(data.key) });
      default:
        return json({ ok: false, message: 'Action tidak dikenal: ' + (data.action || '') });
    }
  } catch (err) {
    return json({ ok: false, message: err.message });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
/* deployed via clasp */
