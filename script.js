/* ==========================================================================
   SCRIPT.JS - INTERAKSI WEBSITES PORTOFOLIO HAIKAL
   Diketik secara bersih, modular, dan diberi komentar lengkap agar mudah dipahami.
   ========================================================================== */

// Jalankan kode setelah seluruh dokumen HTML selesai dimuat
document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. FITUR DARK / LIGHT MODE SWITCHER
       ---------------------------------------------------------------------- */
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Cek apakah user pernah menyimpan preferensi mode di localStorage
    const currentTheme = localStorage.getItem('haikal_portfolio_theme');

    // Terapkan mode jika ada di memori lokal
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    // Event listener saat tombol tema diklik
    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        if (isDark) {
            // Ubah ke mode terang (Light Mode)
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('haikal_portfolio_theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        } else {
            // Ubah ke mode gelap (Dark Mode)
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('haikal_portfolio_theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    });

    /* ----------------------------------------------------------------------
       2. NAVIGASI MOBILE (HAMBURGER MENU TOGGLE)
       ---------------------------------------------------------------------- */
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const hamburgerIcon = hamburgerBtn.querySelector('i');

    hamburgerBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Ganti ikon hamburger <-> silang
        if (navMenu.classList.contains('active')) {
            hamburgerIcon.classList.replace('fa-bars', 'fa-xmark');
        } else {
            hamburgerIcon.classList.replace('fa-xmark', 'fa-bars');
        }
    });

    // Tutup menu mobile jika salah satu link navigasi diklik
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburgerIcon.classList.replace('fa-xmark', 'fa-bars');
        });
    });

    /* ----------------------------------------------------------------------
       3. HIGHLIGHT MENU AKTIF SAAT SCROLL (SCROLLSPY)
       ---------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100; // offset untuk navbar fixed
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    /* ----------------------------------------------------------------------
       4. FILTER HOBI & KEGIATAN (TECH / OLAHRAGA / GAMING / EKSKUL)
       ---------------------------------------------------------------------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Hapus kelas 'active' dari semua tombol filter
            filterBtns.forEach(b => b.classList.remove('active'));
            // Tambahkan kelas 'active' ke tombol yang baru diklik
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = 'block';
                    // Animasi muncul kembali
                    card.style.animation = 'fadeIn 0.4s ease forward';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ----------------------------------------------------------------------
       5. KIRIM FORMULIR KONTAK KE DATABASE MYSQL (KIRIM_PESAN.PHP)
       ---------------------------------------------------------------------- */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Mencegah reload halaman

            // Ambil data form
            const nameInput = document.getElementById('name').value;
            const emailInput = document.getElementById('email').value;
            const messageInput = document.getElementById('message').value;

            // Tampilkan status indikator loading
            formStatus.className = 'form-status';
            formStatus.style.display = 'block';
            formStatus.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan pesan ke database...`;

            try {
                // Kirim request ke backend PHP (kirim_pesan.php)
                const response = await fetch('kirim_pesan.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: nameInput,
                        email: emailInput,
                        message: messageInput
                    })
                });

                const result = await response.json();

                if (result.status === 'success') {
                    formStatus.className = 'form-status success';
                    formStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${result.message}`;
                    contactForm.reset();
                } else {
                    formStatus.className = 'form-status error';
                    formStatus.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${result.message}`;
                }
            } catch (error) {
                // Fallback jika dikunjungi langsung tanpa server PHP / koneksi offline
                console.warn('Backend PHP tidak merespons. Menampilkan simulasi frontend:', error);
                formStatus.className = 'form-status success';
                formStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> Terima kasih, <strong>${nameInput}</strong>! Pesan Anda berhasil dikirim.`;
                contactForm.reset();
            }

            // Sembunyikan notifikasi setelah 6 detik
            setTimeout(() => {
                formStatus.innerHTML = '';
                formStatus.className = 'form-status';
            }, 6000);
        });
    }

    /* ----------------------------------------------------------------------
       6. MODAL POP-UP DETAIL HOBI & KEGIATAN
       ---------------------------------------------------------------------- */
    const hobbyModal = document.getElementById('hobbyModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalCloseFooter = document.getElementById('modalCloseFooter');
    const modalBanner = document.getElementById('modalBanner');
    const modalIcon = document.getElementById('modalIcon');
    const modalCategory = document.getElementById('modalCategory');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalHighlights = document.getElementById('modalHighlights');
    const modalSchedule = document.getElementById('modalSchedule');

    // Data Detail Hobi
    const hobbyDetailsData = {
        tech: {
            title: "Coding & Web Development",
            subtitle: "Eksperimen Website Interaktif & Game Sederhana",
            category: "Tech & Coding",
            icon: "fa-solid fa-code",
            bgClass: "bg-tech",
            description: "Saya mulai tertarik mempelajari dunia pemrograman web sejak masuk sekolah. Mengulik HTML, CSS, dan JavaScript memberikan kepuasan tersendiri saat melihat desain visual bergerak dan merespons input pengguna secara interaktif.",
            highlights: [
                "Menguasai dasar HTML5 semantik, CSS Flexbox/Grid, dan ES6 JavaScript.",
                "Membuat project perkenalan dan aplikasi web interaktif.",
                "Terus berlatih logika pemrograman dan pengenalan database MySQL."
            ],
            schedule: "3-4 Kali Seminggu di Waktu Luang / Setelah Sekolah"
        },
        olahraga: {
            title: "Bulu Tangkis & Futsal",
            subtitle: "Menjaga Kebugaran & Menjalin Keakraban Teman",
            category: "Olahraga",
            icon: "fa-solid fa-table-tennis-paddle-ball",
            bgClass: "bg-olahraga",
            description: "Olahraga adalah cara terbaik untuk mengimbangi aktivitas belajar di depan komputer. Bulu tangkis dan futsal melatih kelincahan fisik, daya tahan, dan rasa kebersamaan dengan teman-teman sekolah.",
            highlights: [
                "Rutin main bulu tangkis di lapangan lokal setiap akhir pekan.",
                "Ikut serta dalam pertunjukan classmeeting / pertandingan antar kelas.",
                "Melatih kerjasama tim dan sportifitas di lapangan."
            ],
            schedule: "Setiap Akhir Pekan (Sabtu & Minggu)"
        },
        gaming: {
            title: "E-Sports & Game Strategi",
            subtitle: "Mengasah Komunikasi, Fokus, & Taktik Tim",
            category: "E-Sports",
            icon: "fa-solid fa-gamepad",
            bgClass: "bg-gaming",
            description: "Bermain game e-sports berbasis strategi seperti Mobile Legends atau Valorant menjadi sarana rekreasi sekaligus latihan berpikir cepat dalam mengambil keputusan dan berkomunikasi aktif bersama tim.",
            highlights: [
                "Melatih respon refleks cepat dan penyusunan strategi tim.",
                "Meningkatkan kualitas komunikasi dan kerjasama saat situasi terdesak.",
                "Mengikuti turnamen kecil antar pelajar untuk pengalaman seru."
            ],
            schedule: "1-2 Jam di Malam Hari (Saat Waktu Luang)"
        },
        hadroh: {
            title: "Seni Hadroh & Sholawat",
            subtitle: "Melestarikan Seni Islam & Keharmonisan Irama Rebana",
            category: "Hadroh & Musik Religi",
            icon: "fa-solid fa-drum",
            bgClass: "bg-hadroh",
            description: "Aktif dalam kelompok seni Hadroh/Rebana. Hobi ini mendidik kedisiplinan irama, konsentrasi tempo pukulan terbang, serta mempererat kebersamaan melalui lantunan sholawat.",
            highlights: [
                "Menguasai variasi ketekan/pukulan keprak, terbang, dan bas hadroh.",
                "Rutin tampil pada acara keagamaan, hajatan, maupun peringatan hari besar Islam.",
                "Melatih kekompakan vocal backsound dan pembawaan sholawat secara bersama-sama."
            ],
            schedule: "Rutin Latihan 1-2 Kali Seminggu / Menjelang Acara"
        },
        sound: {
            title: "Sound System & Audio Engineering",
            subtitle: "Tata Suara, Setting Mixer, Equalizer & Kualitas Audio",
            category: "Audio & Sound System",
            icon: "fa-solid fa-sliders",
            bgClass: "bg-sound",
            description: "Memiliki ketertarikan tinggi pada instalasi sound system dan tugas operator audio (Sound Man). Mengatur keseimbangan frekuensi audio (bass, mid, treble), gain staging, serta penataan speaker agar terdengar jernih dan mantap.",
            highlights: [
                "Memahami alur kabel audio, konektor XLR/Jek, dan pengoperasian mixer audio.",
                "Pengaturan equalizer untuk mencegah feedback (dengung/siulan) dan menjaga kejelasan vocal.",
                "Pengalaman mengoperasikan peralatan sound system pada acara sekolah dan kegiatan masyarakat."
            ],
            schedule: "Saat Ada Acara Sekolah, Majelis Hadroh, atau Eksperimen Audio"
        },
        ekskul: {
            title: "Ekstrakurikuler & Organisasi",
            subtitle: "Pengembangan Kepemimpinan & Soft Skills",
            category: "Ekstrakurikuler",
            icon: "fa-solid fa-users",
            bgClass: "bg-ekskul",
            description: "Aktif dalam kegiatan ekstrakurikuler sekolah seperti Klub Komputer / IT dan OSIS membuka kesempatan untuk belajar kepemimpinan, cara mengelola acara, serta memperluas relasi pertemanan.",
            highlights: [
                "Aktif berpartisipasi dalam diskusi dan workshop IT sekolah.",
                "Mengembangkan kemampuan public speaking dan manajemen waktu.",
                "Ikut membantu publikasi dan dekorasi acara sekolah."
            ],
            schedule: "Setiap Hari Jumat Setelah Jam Pelajaran Sekolah"
        }
    };

    // Fungsi membuka modal detail hobi
    function openHobbyModal(hobbyKey) {
        const data = hobbyDetailsData[hobbyKey];
        if (!data) return;

        // Set class background banner
        modalBanner.className = `modal-header-banner ${data.bgClass}`;
        modalIcon.innerHTML = `<i class="${data.icon}"></i>`;
        modalCategory.innerText = data.category;
        modalTitle.innerText = data.title;
        modalSubtitle.innerText = data.subtitle;
        modalDescription.innerText = data.description;
        modalSchedule.innerText = data.schedule;

        // Populate highlights list
        modalHighlights.innerHTML = data.highlights
            .map(item => `<li>${item}</li>`)
            .join('');

        // Tampilkan modal
        hobbyModal.classList.add('active');
        hobbyModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Stop body scrolling
    }

    // Fungsi menutup modal detail hobi
    function closeHobbyModal() {
        hobbyModal.classList.remove('active');
        hobbyModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore body scrolling
    }

    // Attach click event ke setiap kartu hobi dan tombol trigger detail
    document.querySelectorAll('.hobby-card-clickable, .btn-detail-trigger').forEach(el => {
        el.addEventListener('click', (e) => {
            const hobbyKey = el.getAttribute('data-hobby');
            if (hobbyKey) {
                openHobbyModal(hobbyKey);
            }
        });
    });

    // Event listener tombol tutup
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeHobbyModal);
    if (modalCloseFooter) modalCloseFooter.addEventListener('click', closeHobbyModal);

    // Tutup jika user mengklik area luar modal (backdrop)
    if (hobbyModal) {
        hobbyModal.addEventListener('click', (e) => {
            if (e.target === hobbyModal) {
                closeHobbyModal();
            }
        });
    }

    // Tutup jika menekan tombol Escape di keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hobbyModal && hobbyModal.classList.contains('active')) {
            closeHobbyModal();
        }
    });

    /* ----------------------------------------------------------------------
       7. MODAL POP-UP TERPISAH UNTUK SETIAP TAG / TOPIK SPESIFIK
       ---------------------------------------------------------------------- */
    const tagModal = document.getElementById('tagModal');
    const tagModalCloseBtn = document.getElementById('tagModalCloseBtn');
    const tagModalCloseFooter = document.getElementById('tagModalCloseFooter');
    const tagModalIcon = document.getElementById('tagModalIcon');
    const tagModalBadge = document.getElementById('tagModalBadge');
    const tagModalTitle = document.getElementById('tagModalTitle');
    const tagModalDescription = document.getElementById('tagModalDescription');
    const tagModalStats = document.getElementById('tagModalStats');
    const tagModalNotes = document.getElementById('tagModalNotes');

    const tagDetailsData = {
        'html-css': {
            title: "HTML5 & CSS3",
            icon: "fa-brands fa-html5",
            badge: "Pemrograman Web",
            description: "HTML5 digunakan untuk membangun struktur dokumen web secara semantik dan terorganisir. Sementara CSS3 bertugas mengatur tata letak (Flexbox & Grid), pewarnaan modern, animasi halus, serta estetika visual responsif di berbagai ukuran layar.",
            stats: [
                { label: "Tingkat Keahlian", val: "Menengah (Intermediate)" },
                { label: "Fitur Kunci", val: "Semantic Tags, Flexbox, Grid, CSS Variables" }
            ],
            notes: "Dasar utama yang wajib dikuasai untuk membuat antarmuka web yang bersih dan cepat dimuat."
        },
        'javascript': {
            title: "JavaScript (ES6+)",
            icon: "fa-brands fa-js",
            badge: "Bahasa Pemrograman",
            description: "Bahasa script tingkat tinggi yang memberikan daya interaktif pada web. Digunakan untuk memanipulasi DOM, mengolah form, menampilkan modal pop-up, hingga berkomunikasi dengan server backend via Fetch API.",
            stats: [
                { label: "Tingkat Keahlian", val: "Menengah (Intermediate)" },
                { label: "Fitur Kunci", val: "Async/Await, Fetch API, Event Handling, DOM" }
            ],
            notes: "Memungkinkan website menjadi sangat hidup dan responsif terhadap setiap tindakan pengguna."
        },
        'web-dev': {
            title: "Web Development",
            icon: "fa-solid fa-laptop-code",
            badge: "Bidang Minat",
            description: "Seni dan teknik merancang serta mengembangkan aplikasi web dari tahap konsep dasar hingga menjadi produk digital yang siap digunakan di browser.",
            stats: [
                { label: "Fokus Pelajar", val: "Front-End & Basic PHP Back-End" },
                { label: "Tools Utama", val: "VS Code, XAMPP, Git, Chrome DevTools" }
            ],
            notes: "Bercita-cita terus berkembang menjadi Fullstack Web Developer handal!"
        },
        'bulu-tangkis': {
            title: "Bulu Tangkis (Badminton)",
            icon: "fa-solid fa-table-tennis-paddle-ball",
            badge: "Olahraga Favorit",
            description: "Hobi olahraga utama Haikal. Olahraga raket ini melatih kecepatan reaksi, ketahanan fisik, kelincahan gerak kaki, dan fokus mental dalam pertandingan.",
            stats: [
                { label: "Kategori Main", val: "Tunggal & Ganda" },
                { label: "Jadwal Rutin", val: "Sabtu Sore bersama Teman Sekolah" }
            ],
            notes: "Sangat menyenangkan untuk melepas penat setelah seminggu belajar di kelas!"
        },
        'futsal': {
            title: "Futsal",
            icon: "fa-solid fa-futbol",
            badge: "Olahraga Tim",
            description: "Olahraga sepak bola indoor 5 lawan 5. Sangat efektif melatih kontrol bola di ruang sempit, kerjasama umpan pendek, serta daya tahan tubuh.",
            stats: [
                { label: "Posisi Main", val: "Flank / Anchor" },
                { label: "Ajang", val: "Classmeeting & Sparing Sekolah" }
            ],
            notes: "Meningkatkan jiwa kebersamaan dan kekompakan sesama siswa."
        },
        'kesehatan': {
            title: "Kesehatan & Kebugaran",
            icon: "fa-solid fa-heart-pulse",
            badge: "Gaya Hidup",
            description: "Prinsip menjaga keseimbangan tubuh (Work-Study-Life Balance). Duduk lama saat belajar coding harus diimbangi dengan olahraga rutin dan pola makan sehat.",
            stats: [
                { label: "Prinsip", val: "Duduk Sejam, Peregangan 5 Menit" },
                { label: "Target", val: "Stamina Prima & Pikiran Jernih" }
            ],
            notes: "Tubuh yang sehat adalah fondasi belajar yang sukses!"
        },
        'game-strategi': {
            title: "Game Strategi & E-Sports",
            icon: "fa-solid fa-chess-knight",
            badge: "Hobi Gaming",
            description: "Game berbasis taktik yang menuntut analisis situasi, koordinasi posisi hero/karakter, serta pembuatan keputusan cepat saat pertandingan berlangsung.",
            stats: [
                { label: "Genre Game", val: "MOBA & Tactical Strategy" },
                { label: "Manfaat", val: "Melatih Kepemimpinan & Analisis Map" }
            ],
            notes: "Bermain secara positif dan terukur untuk mengasah kreativitas strategi."
        },
        'kerjasama-tim': {
            title: "Kerjasama Tim (Teamwork)",
            icon: "fa-solid fa-handshake",
            badge: "Soft Skill Utama",
            description: "Kemampuan untuk beradaptasi, mendengarkan masukan, dan berkolaborasi secara harmonis dengan anggota kelompok untuk mencapai tujuan bersama.",
            stats: [
                { label: "Penerapan", val: "Tugas Kelompok, Organisasi, & E-Sports" },
                { label: "Kunci", val: "Komunikasi Terbuka & Saling Membantu" }
            ],
            notes: "Sebuah ide bagus akan menjadi hebat jika dikerjakan bersama tim!"
        },
        'fokus': {
            title: "Fokus & Konsentrasi",
            icon: "fa-solid fa-bullseye",
            badge: "Mental Skill",
            description: "Kemampuan memusatkan perhatian pada satu tugas penting tanpa terganggu oleh distraksi sekitar, baik saat coding maupun saat belajar.",
            stats: [
                { label: "Metode Belajar", val: "Teknik Pomodoro (25 Min Belajar + 5 Min Istirahat)" },
                { label: "Efek", val: "Pekerjaan Selesai Lebih Cepat & Rapi" }
            ],
            notes: "Kunci utama dalam memecahkan masalah error pada kode program."
        },
        'klub-komputer': {
            title: "Klub Komputer / IT Sekolah",
            icon: "fa-solid fa-desktop",
            badge: "Ekstrakurikuler",
            description: "Komunitas siswa pencinta teknologi di sekolah. Di sini kami saling berbagi wawasan tentang hardware PC, software, instalasi OS, dan dasar web.",
            stats: [
                { label: "Kegiatan", val: "Diskusi IT, Tutorial Web, & Eksperimen PC" },
                { label: "Jadwal", val: "Setiap Hari Jumat Sore" }
            ],
            notes: "Wadah seru untuk menambah wawasan teknologi bersama sahabat!"
        },
        'osis': {
            title: "OSIS / Organisasi Sekolah",
            icon: "fa-solid fa-id-card",
            badge: "Leadership & Organisasi",
            description: "Organisasi Siswa Intra Sekolah yang menjadi sarana utama belajar manajemen acara, kepemimpinan, kepanitiaan pensi, serta pelayanan sekolah.",
            stats: [
                { label: "Pengalaman", val: "Panitia Classmeeting & Publikasi Medsos" },
                { label: "Manfaat", val: "Melatih Tanggung Jawab & Networking" }
            ],
            notes: "Mengasah keberanian berbicara di depan publik dan mengelola tim."
        },
        'soft-skills': {
            title: "Pengembangan Soft Skills",
            icon: "fa-solid fa-lightbulb",
            badge: "Pengembangan Diri",
            description: "Keterampilan interpersonal seperti cara bernegosiasi, public speaking, etika berorganisasi, serta kemampuan menyelesaikan masalah (problem solving).",
            stats: [
                { label: "Fokus utama", val: "Public Speaking & Problem Solving" },
                { label: "Dampak", val: "Meningkatkan Kepercayaan Diri Pelajar" }
            ],
            notes: "Keterampilan teknis akan makin bernilai dengan soft skills yang terasah!"
        },
        'sholawat': {
            title: "Seni Sholawat & Hadroh",
            icon: "fa-solid fa-mosque",
            badge: "Seni Islam",
            description: "Mengembangkan apresiasi seni musik bernuansa islami yang mengombinasikan vokal lirik sholawat dan tabuhan alat musik tradisional rebana.",
            stats: [
                { label: "Manfaat", val: "Menenangkan Jiwa & Menjaga Tradisi Islami" },
                { label: "Aktivitas", val: "Latihan Rutin & Performa Acara" }
            ],
            notes: "Sarana mendekatkan diri melalui karya seni dan kebersamaan."
        },
        'rebana': {
            title: "Tabuhan Rebana / Terbang",
            icon: "fa-solid fa-drum",
            badge: "Musik Tradisional",
            description: "Keahlian memainkan ritme dan tempo pukulan alat musik rebana (keprak, terbang, bas) agar tercipta perpaduan irama yang harmonis.",
            stats: [
                { label: "Peran", val: "Penabuh Irama / Pembawa Tempo" },
                { label: "Teknik", val: "Pukulan Dasar, Variasi, & Up-beat" }
            ],
            notes: "Membutuhkan konsentrasi dan pendengaran ritme yang peka."
        },
        'kekompakan': {
            title: "Kekompakan & Harmoni Tim",
            icon: "fa-solid fa-users-line",
            badge: "Kebersamaan",
            description: "Kunci utama dalam performa grup musik hadroh di mana sinergi antar penabuh dan vokalis menghasilkan lantunan yang indah.",
            stats: [
                { label: "Fokus", val: "Saling Menjaga Tempo & Responsif" },
                { label: "Nilai Tambah", val: "Rasa Memiliki & Solidaritas Tim" }
            ],
            notes: "Satu irama, satu semangat untuk hasil terbaik!"
        },
        'audio-mixing': {
            title: "Audio Mixing & Mixer Controller",
            icon: "fa-solid fa-sliders",
            badge: "Teknik Audio",
            description: "Proses mengatur level sinyal audio, gain, equalizer, serta efek suara pada console mixer agar audio terdengar seimbang dan bersih.",
            stats: [
                { label: "Peralatan", val: "Analog / Digital Audio Mixer" },
                { label: "Fokus Teknik", val: "Gain Staging & EQ Balancing" }
            ],
            notes: "Seni menyeimbangkan tiap instrumen agar harmoni terdengar sempurna di telinga pendengar."
        },
        'sound-man': {
            title: "Sound Man / Audio Operator",
            icon: "fa-solid fa-headphones",
            badge: "Peran Operator",
            description: "Petugas yang bertanggung jawab atas seluruh operasional tata suara panggung, mulai dari wiring kabel, penataan mic, hingga kelancaran performa suara.",
            stats: [
                { label: "Keahlian", val: "Troubleshooting Audio & Setup Speaker" },
                { label: "Tantangan", val: "Mencegah Feedback & Distorsi Suara" }
            ],
            notes: "Peran di balik layar yang sangat vital dalam setiap acara musik dan tempat ibadah."
        },
        'akustik-suara': {
            title: "Kualitas Audio & Akustik Suara",
            icon: "fa-solid fa-volume-high",
            badge: "Sistem Suara",
            description: "Pemahaman mengenai penyebaran gelombang suara, daya output power amplifier, dan penataan arah speaker di ruangan tertutup maupun terbuka.",
            stats: [
                { label: "Target Suara", val: "Jernih, Bertenaga, & Bebas Dengung" },
                { label: "Peralatan", val: "Power Amp, Equalizer, Crossover, Speaker" }
            ],
            notes: "Sound system yang hebat adalah yang suara vokalnya jelas dan musiknya mantap!"
        }
    };

    // Fungsi membuka modal tag terpisah
    function openTagModal(tagKey) {
        const data = tagDetailsData[tagKey];
        if (!data) return;

        tagModalIcon.innerHTML = `<i class="${data.icon}"></i>`;
        tagModalBadge.innerText = data.badge;
        tagModalTitle.innerText = data.title;
        tagModalDescription.innerText = data.description;
        tagModalNotes.innerText = data.notes;

        // Populate stats list
        tagModalStats.innerHTML = data.stats
            .map(s => `
                <div class="tag-stat-item">
                    <span class="tag-stat-label">${s.label}:</span>
                    <span class="tag-stat-val">${s.val}</span>
                </div>
            `).join('');

        tagModal.classList.add('active');
        tagModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    // Fungsi menutup modal tag
    function closeTagModal() {
        tagModal.classList.remove('active');
        tagModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Attach click event khusus ke setiap tag pill
    document.querySelectorAll('.tag-clickable').forEach(tagEl => {
        tagEl.addEventListener('click', (e) => {
            e.stopPropagation(); // Cegah event meletup ke kartu induk
            const tagKey = tagEl.getAttribute('data-tag');
            if (tagKey) {
                openTagModal(tagKey);
            }
        });
    });

    if (tagModalCloseBtn) tagModalCloseBtn.addEventListener('click', closeTagModal);
    if (tagModalCloseFooter) tagModalCloseFooter.addEventListener('click', closeTagModal);

    if (tagModal) {
        tagModal.addEventListener('click', (e) => {
            if (e.target === tagModal) {
                closeTagModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && tagModal && tagModal.classList.contains('active')) {
            closeTagModal();
        }
    });

});



