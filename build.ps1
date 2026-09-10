# Build script: generates the remaining demo pages from _shell.html
$ErrorActionPreference = 'Stop'
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$shell = Get-Content -LiteralPath (Join-Path $dir '_shell.html') -Raw -Encoding UTF8

function New-Page {
    param([string]$Out, [string]$Title, [string]$Desc, [string]$Body)
    $html = $shell.Replace('__TITLE__', $Title).Replace('__DESC__', $Desc).Replace('__BODY__', $Body)
    [System.IO.File]::WriteAllText((Join-Path $dir $Out), $html, (New-Object System.Text.UTF8Encoding($false)))
    Write-Output "Generated: $Out"
}

# ============ PENELITIAN ============
$penelitianBody = @'
    <!-- PAGE HEADER -->
    <section class="bg-gradient-to-r from-primary-700 to-blue-600 text-white">
        <div class="max-w-7xl mx-auto px-4 py-16">
            <nav class="text-xs text-blue-200 mb-3"><a href="index.html" class="hover:text-white">Beranda</a> / <span class="text-white">Penelitian</span></nav>
            <h1 class="font-display text-3xl md:text-4xl font-extrabold">Bidang Penelitian & Laboratorium</h1>
            <p class="mt-2 text-blue-100">Jenis laboratorium dan fasilitas pendukung penelitian di UMA</p>
        </div>
    </section>

    <!-- QUICK NAV -->
    <section class="max-w-7xl mx-auto px-4 -mt-6 z-10 relative">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-3 grid grid-cols-2 md:grid-cols-4 gap-2">
            <a href="#fisiologi" class="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-cyan-50 dark:hover:bg-slate-700 transition"><span class="w-8 h-8 rounded-lg bg-green-100 dark:bg-slate-700 text-green-600 flex items-center justify-center"><i data-lucide="leaf" class="w-4 h-4"></i></span><span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Fisiologi Tumbuhan</span></a>
            <a href="#proteksi" class="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-cyan-50 dark:hover:bg-slate-700 transition"><span class="w-8 h-8 rounded-lg bg-orange-100 dark:bg-slate-700 text-orange-600 flex items-center justify-center"><i data-lucide="shield" class="w-4 h-4"></i></span><span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Proteksi Tanaman</span></a>
            <a href="#lahan" class="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-cyan-50 dark:hover:bg-slate-700 transition"><span class="w-8 h-8 rounded-lg bg-teal-100 dark:bg-slate-700 text-teal-600 flex items-center justify-center"><i data-lucide="trees" class="w-4 h-4"></i></span><span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Lahan Percobaan</span></a>
            <a href="#rumahkasa" class="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-cyan-50 dark:hover:bg-slate-700 transition"><span class="w-8 h-8 rounded-lg bg-lime-100 dark:bg-slate-700 text-lime-700 flex items-center justify-center"><i data-lucide="home" class="w-4 h-4"></i></span><span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Rumah Kasa</span></a>
        </div>
    </section>

    <!-- FISIOLOGI -->
    <section class="max-w-7xl mx-auto px-4 py-16" id="fisiologi">
        <div class="grid md:grid-cols-3 gap-8 items-center">
            <div class="md:col-span-2">
                <span class="text-green-600 dark:text-green-400 font-semibold text-sm uppercase tracking-widest">Lab Penelitian</span>
                <h2 class="mt-3 font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Laboratorium Fisiologi Tumbuhan</h2>
                <p class="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">Mempelajari fungsi dan proses kehidupan tumbuhan, mencakup fisiologi pertumbuhan, fotosintesis, respirasi, transpirasi, dan metabolisme. Laboratorium ini mendukung praktikum maupun penelitian dosen dan mahasiswa.</p>
                <ul class="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <li class="flex gap-2"><i data-lucide="check" class="w-4 h-4 text-green-500 shrink-0 mt-0.5"></i> Analisis fotosintesis & respirasi</li>
                    <li class="flex gap-2"><i data-lucide="check" class="w-4 h-4 text-green-500 shrink-0 mt-0.5"></i> Kultur jaringan tumbuhan</li>
                    <li class="flex gap-2"><i data-lucide="check" class="w-4 h-4 text-green-500 shrink-0 mt-0.5"></i> Analisis nutrisi & tanah</li>
                    <li class="flex gap-2"><i data-lucide="check" class="w-4 h-4 text-green-500 shrink-0 mt-0.5"></i> Pengujian kadar air & klorofil</li>
                </ul>
            </div>
            <div class="relative"><div class="absolute -top-6 -right-6 w-24 h-24 bg-green-400/20 rounded-full blur-2xl"></div><div class="aspect-[4/3] rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white relative"><i data-lucide="leaf" class="w-20 h-20 opacity-90"></i></div></div>
        </div>
    </section>

    <!-- PROTEKSI -->
    <section class="bg-white dark:bg-slate-800 py-16 border-y border-slate-100 dark:border-slate-700" id="proteksi">
        <div class="max-w-7xl mx-auto px-4"><div class="grid md:grid-cols-3 gap-8 items-center">
            <div class="relative order-2 md:order-1"><div class="absolute -top-6 -left-6 w-24 h-24 bg-orange-400/20 rounded-full blur-2xl"></div><div class="aspect-[4/3] rounded-2xl bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center text-white relative"><i data-lucide="shield" class="w-20 h-20 opacity-90"></i></div></div>
            <div class="md:col-span-2 order-1 md:order-2">
                <span class="text-orange-600 dark:text-orange-400 font-semibold text-sm uppercase tracking-widest">Lab Penelitian</span>
                <h2 class="mt-3 font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Laboratorium Proteksi Tanaman</h2>
                <p class="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">Fokus pada perlindungan tanaman dari gangguan hama, penyakit, dan gulma. Mendukung praktikum entomologi, fitopatologi, serta pengendalian hayati ramah lingkungan.</p>
                <ul class="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <li class="flex gap-2"><i data-lucide="check" class="w-4 h-4 text-orange-500 shrink-0 mt-0.5"></i> Identifikasi hama & penyakit</li>
                    <li class="flex gap-2"><i data-lucide="check" class="w-4 h-4 text-orange-500 shrink-0 mt-0.5"></i> Pengendalian hayati</li>
                    <li class="flex gap-2"><i data-lucide="check" class="w-4 h-4 text-orange-500 shrink-0 mt-0.5"></i> Uji efektivitas pestisida</li>
                    <li class="flex gap-2"><i data-lucide="check" class="w-4 h-4 text-orange-500 shrink-0 mt-0.5"></i> Pengelolaan gulma</li>
                </ul>
            </div>
        </div></div>
    </section>

    <!-- LAHAN -->
    <section class="max-w-7xl mx-auto px-4 py-16" id="lahan">
        <div class="grid md:grid-cols-3 gap-8 items-center">
            <div class="md:col-span-2">
                <span class="text-teal-600 dark:text-teal-400 font-semibold text-sm uppercase tracking-widest">Area Penelitian</span>
                <h2 class="mt-3 font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Lahan Percobaan UMA</h2>
                <p class="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">Lahan terbuka untuk percobaan lapangan agroteknologi, budidaya tanaman, dan riset ekologi. Dibekali sistem irigasi serta pembagian petak percobaan yang terstruktur.</p>
                <ul class="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <li class="flex gap-2"><i data-lucide="check" class="w-4 h-4 text-teal-500 shrink-0 mt-0.5"></i> Petak percobaan terstruktur</li>
                    <li class="flex gap-2"><i data-lucide="check" class="w-4 h-4 text-teal-500 shrink-0 mt-0.5"></i> Budidaya tanaman pangan</li>
                    <li class="flex gap-2"><i data-lucide="check" class="w-4 h-4 text-teal-500 shrink-0 mt-0.5"></i> Pengujian varietas</li>
                    <li class="flex gap-2"><i data-lucide="check" class="w-4 h-4 text-teal-500 shrink-0 mt-0.5"></i> Riset agronomi lapangan</li>
                </ul>
            </div>
            <div class="relative"><div class="absolute -top-6 -right-6 w-24 h-24 bg-teal-400/20 rounded-full blur-2xl"></div><div class="aspect-[4/3] rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center text-white relative"><i data-lucide="trees" class="w-20 h-20 opacity-90"></i></div></div>
        </div>
    </section>

    <!-- RUMAH KASA -->
    <section class="bg-white dark:bg-slate-800 py-16 border-y border-slate-100 dark:border-slate-700" id="rumahkasa">
        <div class="max-w-7xl mx-auto px-4"><div class="grid md:grid-cols-3 gap-8 items-center">
            <div class="relative order-2 md:order-1"><div class="absolute -top-6 -left-6 w-24 h-24 bg-lime-400/20 rounded-full blur-2xl"></div><div class="aspect-[4/3] rounded-2xl bg-gradient-to-br from-lime-500 to-green-700 flex items-center justify-center text-white relative"><i data-lucide="home" class="w-20 h-20 opacity-90"></i></div></div>
            <div class="md:col-span-2 order-1 md:order-2">
                <span class="text-lime-600 dark:text-lime-400 font-semibold text-sm uppercase tracking-widest">Fasilitas Terlindung</span>
                <h2 class="mt-3 font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Rumah Kasa</h2>
                <p class="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">Media tanam terlindung (screen house) untuk riset terkontrol: pembibitan, uji coba media tanam, dan perkecambahan yang terlindung dari gangguan eksternal.</p>
                <ul class="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <li class="flex gap-2"><i data-lucide="check" class="w-4 h-4 text-lime-600 shrink-0 mt-0.5"></i> Kontrol lingkungan</li>
                    <li class="flex gap-2"><i data-lucide="check" class="w-4 h-4 text-lime-600 shrink-0 mt-0.5"></i> Pembibitan terlindung</li>
                    <li class="flex gap-2"><i data-lucide="check" class="w-4 h-4 text-lime-600 shrink-0 mt-0.5"></i> Uji media tanam</li>
                    <li class="flex gap-2"><i data-lucide="check" class="w-4 h-4 text-lime-600 shrink-0 mt-0.5"></i> Riset perkecambahan</li>
                </ul>
            </div>
        </div></div>
    </section>
'@

New-Page -Out 'penelitian.html' -Title 'Penelitian - Laboratorium Universitas Medan Area' -Desc 'Bidang penelitian dan jenis laboratorium Universitas Medan Area' -Body $penelitianBody

# ============ GALERI ============
$galeriBody = @'
    <!-- PAGE HEADER -->
    <section class="bg-gradient-to-r from-primary-700 to-blue-600 text-white">
        <div class="max-w-7xl mx-auto px-4 py-16">
            <nav class="text-xs text-blue-200 mb-3"><a href="index.html" class="hover:text-white">Beranda</a> / <span class="text-white">Galeri</span></nav>
            <h1 class="font-display text-3xl md:text-4xl font-extrabold">Galeri Laboratorium</h1>
            <p class="mt-2 text-blue-100">Dokumentasi kegiatan praktikum dan penelitian di seluruh fakultas</p>
        </div>
    </section>

    <!-- FILTER -->
    <section class="max-w-7xl mx-auto px-4 py-10">
        <div class="flex flex-wrap gap-2" id="filterTabs">
            <button data-filter="all" class="filter-btn px-4 py-2 rounded-full bg-primary-700 text-white text-sm font-semibold">Semua</button>
            <button data-filter="teknik" class="filter-btn px-4 py-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-300 transition">Teknik</button>
            <button data-filter="pertanian" class="filter-btn px-4 py-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-300 transition">Pertanian</button>
            <button data-filter="psikologi" class="filter-btn px-4 py-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-300 transition">Psikologi</button>
            <button data-filter="saintek" class="filter-btn px-4 py-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-300 transition">Saintek</button>
            <button data-filter="umum" class="filter-btn px-4 py-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-300 transition">Kegiatan Umum</button>
        </div>

        <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3" id="galleryGrid">
            <div class="gallery-item" data-cat="umum"><div class="relative group overflow-hidden rounded-xl aspect-square"><img src="https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/6878142371714375724.jpg" alt="Galeri" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3"><span class="text-white text-sm font-medium">Praktikum Umum</span></div></div></div>
            <div class="gallery-item" data-cat="umum"><div class="relative group overflow-hidden rounded-xl aspect-square"><img src="https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/11989206401714745234.jpg" alt="Galeri" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3"><span class="text-white text-sm font-medium">Kegiatan Lab</span></div></div></div>
            <div class="gallery-item" data-cat="umum"><div class="relative group overflow-hidden rounded-xl aspect-square"><img src="https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/6787828731762504523.jpeg" alt="Galeri" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3"><span class="text-white text-sm font-medium">Kegiatan Lab</span></div></div></div>
            <div class="gallery-item" data-cat="pertanian"><div class="relative group overflow-hidden rounded-xl aspect-square"><img src="https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/6506652741715048206.jpeg" alt="Galeri" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3"><span class="text-white text-sm font-medium">Pertanian</span></div></div></div>
            <div class="gallery-item" data-cat="pertanian"><div class="relative group overflow-hidden rounded-xl aspect-square"><img src="https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/4433280541714615501.JPG" alt="Galeri" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3"><span class="text-white text-sm font-medium">Lahan Percobaan</span></div></div></div>
            <div class="gallery-item" data-cat="teknik"><div class="relative group overflow-hidden rounded-xl aspect-square"><img src="https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/7921851651715139853.jpeg" alt="Galeri" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3"><span class="text-white text-sm font-medium">Prodi Sipil</span></div></div></div>
            <div class="gallery-item" data-cat="teknik"><div class="relative group overflow-hidden rounded-xl aspect-square"><img src="https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/20325948681714615643.jpg" alt="Galeri" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3"><span class="text-white text-sm font-medium">Prodi Elektro</span></div></div></div>
            <div class="gallery-item" data-cat="teknik"><div class="relative group overflow-hidden rounded-xl aspect-square"><img src="https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/10114180091714702521.JPG" alt="Galeri" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3"><span class="text-white text-sm font-medium">Prodi Mesin</span></div></div></div>
            <div class="gallery-item" data-cat="teknik"><div class="relative group overflow-hidden rounded-xl aspect-square"><img src="https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/19483733241715048931.jpeg" alt="Galeri" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3"><span class="text-white text-sm font-medium">Prodi Arsitektur</span></div></div></div>
            <div class="gallery-item" data-cat="teknik"><div class="relative group overflow-hidden rounded-xl aspect-square"><img src="https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/6402071771714744786.jpg" alt="Galeri" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3"><span class="text-white text-sm font-medium">Prodi Industri</span></div></div></div>
            <div class="gallery-item" data-cat="teknik"><div class="relative group overflow-hidden rounded-xl aspect-square"><img src="https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/8682340401717386694.jpg" alt="Galeri" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3"><span class="text-white text-sm font-medium">Prodi Informatika</span></div></div></div>
            <div class="gallery-item" data-cat="umum"><div class="relative group overflow-hidden rounded-xl aspect-square"><img src="https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/5221120081715053390.jpg" alt="Galeri" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3"><span class="text-white text-sm font-medium">Kegiatan Lab</span></div></div></div>
            <div class="gallery-item" data-cat="umum"><div class="relative group overflow-hidden rounded-xl aspect-square"><img src="https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/19233998261714620755.JPG" alt="Galeri" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3"><span class="text-white text-sm font-medium">Kegiatan Lab</span></div></div></div>
            <div class="gallery-item" data-cat="psikologi"><div class="relative group overflow-hidden rounded-xl aspect-square"><img src="https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/5782036091714616846.jpg" alt="Galeri" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3"><span class="text-white text-sm font-medium">Lab Psikologi</span></div></div></div>
            <div class="gallery-item" data-cat="saintek"><div class="relative group overflow-hidden rounded-xl aspect-square"><img src="https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/20658843121714794465.jpeg" alt="Galeri" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3"><span class="text-white text-sm font-medium">Lab Biologi</span></div></div></div>
            <div class="gallery-item" data-cat="saintek"><div class="relative group overflow-hidden rounded-xl aspect-square"><img src="https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/20117448001714705970.jpeg" alt="Galeri" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3"><span class="text-white text-sm font-medium">Lab Biologi</span></div></div></div>
        </div>
    </section>
'@

New-Page -Out 'galeri.html' -Title 'Galeri - Laboratorium Universitas Medan Area' -Desc 'Galeri kegiatan praktikum dan penelitian laboratorium UMA' -Body $galeriBody

# ============ BERITA ============
$beritaBody = @'
    <!-- PAGE HEADER -->
    <section class="bg-gradient-to-r from-primary-700 to-blue-600 text-white">
        <div class="max-w-7xl mx-auto px-4 py-16">
            <nav class="text-xs text-blue-200 mb-3"><a href="index.html" class="hover:text-white">Beranda</a> / <span class="text-white">Berita</span></nav>
            <h1 class="font-display text-3xl md:text-4xl font-extrabold">Berita & Pengumuman</h1>
            <p class="mt-2 text-blue-100">Informasi terbaru kegiatan laboratorium di lingkungan UMA</p>
        </div>
    </section>

    <!-- LIST BERITA -->
    <section class="max-w-7xl mx-auto px-4 py-16">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <article class="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition border border-slate-100 dark:border-slate-700">
                <div class="relative overflow-hidden h-48"><img src="https://laboratorium.uma.ac.id/admin/uploads/sertifikat%20asisten.png.png" alt="Sertifikat Asisten" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-500/90 text-white text-xs font-semibold">Informasi</span></div>
                <div class="p-5"><p class="text-xs text-slate-400 flex items-center gap-1"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> 17 Mar 2026</p><h3 class="mt-2 font-semibold text-slate-800 dark:text-white leading-snug group-hover:text-cyan-600 transition">Informasi Pengunduhan Sertifikat Asisten Laboratorium Semester Ganjil TA. 2025/2026</h3><p class="mt-2 text-sm text-slate-500">99x dibaca</p><a href="unduhan.html" class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-600">Selengkapnya <i data-lucide="arrow-right" class="w-4 h-4"></i></a></div>
            </article>
            <article class="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition border border-slate-100 dark:border-slate-700">
                <div class="relative overflow-hidden h-48"><img src="https://laboratorium.uma.ac.id/admin/uploads/P15122501%20(1).png.png" alt="Pengumuman Libur" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-xs font-semibold">Pengumuman</span></div>
                <div class="p-5"><p class="text-xs text-slate-400 flex items-center gap-1"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> 23 Dec 2025</p><h3 class="mt-2 font-semibold text-slate-800 dark:text-white leading-snug group-hover:text-cyan-600 transition">Pengumuman Libur Kegiatan Pembelajaran</h3><p class="mt-2 text-sm text-slate-500">126x dibaca</p><a href="#" class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-600">Selengkapnya <i data-lucide="arrow-right" class="w-4 h-4"></i></a></div>
            </article>
            <article class="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition border border-slate-100 dark:border-slate-700">
                <div class="relative overflow-hidden h-48"><img src="https://laboratorium.uma.ac.id/admin/uploads/kuesioner-ganjil-25-26.png.png" alt="Kuesioner" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-cyan-500/90 text-white text-xs font-semibold">Pengumuman</span></div>
                <div class="p-5"><p class="text-xs text-slate-400 flex items-center gap-1"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> 19 Dec 2025</p><h3 class="mt-2 font-semibold text-slate-800 dark:text-white leading-snug group-hover:text-cyan-600 transition">Informasi Pengisian Kuesioner Bagi Dosen dan Mahasiswa UMA Semester Ganjil TA 2025/2026</h3><p class="mt-2 text-sm text-slate-500">128x dibaca</p><a href="#" class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-600">Selengkapnya <i data-lucide="arrow-right" class="w-4 h-4"></i></a></div>
            </article>
            <article class="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition border border-slate-100 dark:border-slate-700">
                <div class="relative overflow-hidden h-48"><img src="https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/6878142371714375724.jpg" alt="Kegiatan Praktikum" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-semibold">Kegiatan</span></div>
                <div class="p-5"><p class="text-xs text-slate-400 flex items-center gap-1"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> 12 Dec 2025</p><h3 class="mt-2 font-semibold text-slate-800 dark:text-white leading-snug group-hover:text-cyan-600 transition">Kegiatan Praktikum di Lahan Percobaan UMA</h3><p class="mt-2 text-sm text-slate-500">85x dibaca</p><a href="galeri.html" class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-600">Selengkapnya <i data-lucide="arrow-right" class="w-4 h-4"></i></a></div>
            </article>
            <article class="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition border border-slate-100 dark:border-slate-700">
                <div class="relative overflow-hidden h-48"><img src="https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/6787828731762504523.jpeg" alt="Kegiatan Praktikum" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-semibold">Kegiatan</span></div>
                <div class="p-5"><p class="text-xs text-slate-400 flex items-center gap-1"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> 05 Dec 2025</p><h3 class="mt-2 font-semibold text-slate-800 dark:text-white leading-snug group-hover:text-cyan-600 transition">Kegiatan Praktikum di Lab. Proteksi Tanaman</h3><p class="mt-2 text-sm text-slate-500">72x dibaca</p><a href="galeri.html" class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-600">Selengkapnya <i data-lucide="arrow-right" class="w-4 h-4"></i></a></div>
            </article>
            <article class="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition border border-slate-100 dark:border-slate-700">
                <div class="relative overflow-hidden h-48"><img src="https://laboratorium.uma.ac.id/admin/uploads/galeri/thumbs/5782036091714616846.jpg" alt="Kegiatan Praktikum" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"><span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-semibold">Kegiatan</span></div>
                <div class="p-5"><p class="text-xs text-slate-400 flex items-center gap-1"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> 28 Nov 2025</p><h3 class="mt-2 font-semibold text-slate-800 dark:text-white leading-snug group-hover:text-cyan-600 transition">Kegiatan Praktikum di Lab. Inteligensi</h3><p class="mt-2 text-sm text-slate-500">64x dibaca</p><a href="galeri.html" class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-600">Selengkapnya <i data-lucide="arrow-right" class="w-4 h-4"></i></a></div>
            </article>
        </div>
    </section>
'@

New-Page -Out 'berita.html' -Title 'Berita - Laboratorium Universitas Medan Area' -Desc 'Berita dan pengumuman terbaru laboratorium UMA' -Body $beritaBody

# ============ UNDUHAN ============
$unduhanBody = @'
    <!-- PAGE HEADER -->
    <section class="bg-gradient-to-r from-primary-700 to-blue-600 text-white">
        <div class="max-w-7xl mx-auto px-4 py-16">
            <nav class="text-xs text-blue-200 mb-3"><a href="index.html" class="hover:text-white">Beranda</a> / <span class="text-white">Unduhan</span></nav>
            <h1 class="font-display text-3xl md:text-4xl font-extrabold">Unduhan Dokumen</h1>
            <p class="mt-2 text-blue-100">Dokumen laboratorium, pedoman, dan sertifikat asisten</p>
        </div>
    </section>

    <!-- DOKUMEN -->
    <section class="max-w-7xl mx-auto px-4 py-16">
        <div class="flex items-center gap-3 mb-8"><div class="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600"><i data-lucide="folder" class="w-5 h-5"></i></div><div><h2 class="font-display text-2xl font-bold text-slate-900 dark:text-white">Dokumen & Pedoman</h2><p class="text-sm text-slate-500">Panduan dan format dokumen yang dapat diunduh</p></div></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <a href="https://s.uma.ac.id/K8G7C" target="_blank" class="group flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition">
                <div class="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 shrink-0"><i data-lucide="file-text" class="w-6 h-6"></i></div>
                <div class="flex-1"><p class="font-semibold text-slate-800 dark:text-white">Dokumen Laboratorium</p><p class="text-sm text-slate-500">Kumpulan dokumen resmi lab UMA</p></div>
                <i data-lucide="download" class="w-5 h-5 text-slate-300 group-hover:text-cyan-500 transition shrink-0"></i>
            </a>
            <a href="https://script.google.com/a/macros/uma.ac.id/s/AKfycbwU9lJegxLxSHWxaBithwWIibNU_DZOl0jO3luTCcBpodRZT7u2Sw-rGpiUdJNojKPgUg/exec" target="_blank" class="group flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition">
                <div class="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center text-cyan-600 shrink-0"><i data-lucide="award" class="w-6 h-6"></i></div>
                <div class="flex-1"><p class="font-semibold text-slate-800 dark:text-white">Sertifikat Asisten Lab</p><p class="text-sm text-slate-500">Unduh sertifikat asisten laboratorium</p></div>
                <i data-lucide="download" class="w-5 h-5 text-slate-300 group-hover:text-cyan-500 transition shrink-0"></i>
            </a>
            <div class="group flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition cursor-default">
                <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 shrink-0"><i data-lucide="file-text" class="w-6 h-6"></i></div>
                <div class="flex-1"><p class="font-semibold text-slate-800 dark:text-white">Formulir Pendaftaran</p><p class="text-sm text-slate-500">Formulir pendaftaran penelitian / peminjaman</p></div>
                <span class="text-xs font-semibold text-slate-400">Segera</span>
            </div>
            <div class="group flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition cursor-default">
                <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 shrink-0"><i data-lucide="file-text" class="w-6 h-6"></i></div>
                <div class="flex-1"><p class="font-semibold text-slate-800 dark:text-white">Panduan Alur Pendaftaran</p><p class="text-sm text-slate-500">Alur pengajuan penelitian ke laboratorium</p></div>
                <span class="text-xs font-semibold text-slate-400">Segera</span>
            </div>
        </div>
    </section>
'@

New-Page -Out 'unduhan.html' -Title 'Unduhan - Laboratorium Universitas Medan Area' -Desc 'Unduhan dokumen, pedoman, dan sertifikat laboratorium UMA' -Body $unduhanBody

# ============ KONTAK ============
$kontakBody = @'
    <!-- PAGE HEADER -->
    <section class="bg-gradient-to-r from-primary-700 to-blue-600 text-white">
        <div class="max-w-7xl mx-auto px-4 py-16">
            <nav class="text-xs text-blue-200 mb-3"><a href="index.html" class="hover:text-white">Beranda</a> / <span class="text-white">Kontak</span></nav>
            <h1 class="font-display text-3xl md:text-4xl font-extrabold">Hubungi Kami</h1>
            <p class="mt-2 text-blue-100">Silakan hubungi laboratorium untuk informasi lebih lanjut</p>
        </div>
    </section>

    <!-- INFO + FORM -->
    <section class="max-w-7xl mx-auto px-4 py-16">
        <div class="grid lg:grid-cols-2 gap-10">
            <div>
                <h2 class="font-display text-2xl font-bold text-slate-900 dark:text-white">Informasi Kontak</h2>
                <p class="mt-2 text-slate-500 dark:text-slate-400">Tim kami siap membantu kebutuhan praktikum, penelitian, dan layanan pengujian Anda.</p>
                <div class="mt-8 space-y-5">
                    <div class="flex gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm"><div class="w-11 h-11 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center text-cyan-600 shrink-0"><i data-lucide="map-pin" class="w-5 h-5"></i></div><div><p class="font-semibold text-slate-800 dark:text-white">Alamat</p><p class="text-sm text-slate-500 mt-0.5">Jalan Kolam Nomor 1 Medan Estate / Jalan Gedung PBSI, Medan 20223</p></div></div>
                    <div class="flex gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm"><div class="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 shrink-0"><i data-lucide="phone" class="w-5 h-5"></i></div><div><p class="font-semibold text-slate-800 dark:text-white">Telepon</p><p class="text-sm text-slate-500 mt-0.5">(061) 7360168, 7366878, 7364348<br>Call Center: 0822-6777-1313, 0813-7095-7775</p></div></div>
                    <div class="flex gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm"><div class="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 shrink-0"><i data-lucide="mail" class="w-5 h-5"></i></div><div><p class="font-semibold text-slate-800 dark:text-white">Email</p><p class="text-sm text-slate-500 mt-0.5">lab@uma.ac.id</p></div></div>
                    <div class="flex gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm"><div class="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 shrink-0"><i data-lucide="clock" class="w-5 h-5"></i></div><div><p class="font-semibold text-slate-800 dark:text-white">Jam Layanan</p><p class="text-sm text-slate-500 mt-0.5">Senin - Jumat, 08.00 - 16.00 WIB</p></div></div>
                </div>
            </div>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-8">
                <h2 class="font-display text-xl font-bold text-slate-900 dark:text-white">Kirim Pesan</h2>
                <form class="mt-6 space-y-5" onsubmit="alert('Demo prototype: pesan tidak benar-benar terkirim. Silakan hubungi via telepon/email.'); return false;">
                    <div><label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Nama Lengkap</label><input type="text" required placeholder="Nama Anda" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"></div>
                    <div><label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Email</label><input type="email" required placeholder="email@contoh.com" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"></div>
                    <div><label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Subjek</label><select class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"><option>Informasi Praktikum</option><option>Peminjaman Laboratorium</option><option>Pengujian (ISO 17025)</option><option>Kerja Sama Penelitian</option><option>Lainnya</option></select></div>
                    <div><label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Pesan</label><textarea rows="4" required placeholder="Tulis pesan Anda..." class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"></textarea></div>
                    <button type="submit" class="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-700 text-white font-semibold hover:bg-primary-800 transition"><i data-lucide="send" class="w-4 h-4"></i> Kirim Pesan</button>
                </form>
            </div>
        </div>
    </section>

    <!-- MAP -->
    <section class="max-w-7xl mx-auto px-4 pb-16">
        <div class="rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 aspect-[16/6]">
            <iframe title="Lokasi UMA" src="https://www.google.com/maps?q=Universitas%20Medan%20Area%20Medan&output=embed" class="w-full h-full" loading="lazy"></iframe>
        </div>
    </section>
'@

New-Page -Out 'kontak.html' -Title 'Kontak - Laboratorium Universitas Medan Area' -Desc 'Hubungi Laboratorium Universitas Medan Area' -Body $kontakBody

Write-Output "Done building pages."