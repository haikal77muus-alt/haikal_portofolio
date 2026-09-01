-- ====================================================================
-- DATABASE PORTOFOLIO PERKENALAN SISWA - db_haikal
-- Dibuat untuk XAMPP / phpMyAdmin (MySQL / MariaDB)
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `db_haikal` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `db_haikal`;

-- --------------------------------------------------------------------
-- 1. TABEL PROFIL SISWA (tb_siswa)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_siswa` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nama_lengkap` VARCHAR(100) NOT NULL,
    `panggilan` VARCHAR(50) NOT NULL,
    `sekolah` VARCHAR(100) NOT NULL,
    `kelas` VARCHAR(50) NOT NULL,
    `jurusan` VARCHAR(50) DEFAULT 'Rekayasa Perangkat Lunak',
    `cita_cita` VARCHAR(100) NOT NULL,
    `bio` TEXT,
    `email` VARCHAR(100),
    `whatsapp` VARCHAR(30)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data Awal Profil Siswa
INSERT INTO `tb_siswa` (`id`, `nama_lengkap`, `panggilan`, `sekolah`, `kelas`, `jurusan`, `cita_cita`, `bio`, `email`, `whatsapp`) VALUES
(1, 'Haikal', 'Haikal', 'SMK Negeri 1', 'X RPL 1', 'Rekayasa Perangkat Lunak', 'Fullstack Web Developer & Game Designer', 'Saya seorang pelajar yang menyukai dunia teknologi, pemrograman web, dan aktivitas olahraga. Selalu penasaran mencoba hal baru dan berkolaborasi bersama teman-teman.', 'haikal@example.com', '+62 812 3456 7890');

-- --------------------------------------------------------------------
-- 2. TABEL HOBI & KEGIATAN (tb_hobi)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_hobi` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `judul` VARCHAR(100) NOT NULL,
    `kategori` ENUM('tech', 'olahraga', 'gaming', 'hadroh', 'sound', 'ekskul') NOT NULL DEFAULT 'tech',
    `deskripsi` TEXT NOT NULL,
    `ikon` VARCHAR(50) NOT NULL,
    `tag` VARCHAR(100) NOT NULL,
    `gambar` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data Awal Hobi & Kegiatan Sekolah
INSERT INTO `tb_hobi` (`id`, `judul`, `kategori`, `deskripsi`, `ikon`, `tag`, `gambar`) VALUES
(1, 'Coding & Web Development', 'tech', 'Suka mengulik HTML, CSS, dan JavaScript untuk membuat tampilan website interaktif serta game sederhana.', 'fa-solid fa-code', 'HTML • CSS • JavaScript', 'assets/images/hobi_coding.jpg'),
(2, 'Bulu Tangkis & Futsal', 'olahraga', 'Rutin berolahraga bersama teman-teman sekolah saat akhir pekan untuk menjaga kebugaran tubuh.', 'fa-solid fa-table-tennis-paddle-ball', 'Olahraga • Kerjasama Tim', 'assets/images/hobi_olahraga.jpg'),
(3, 'E-Sports & Strategy Gaming', 'gaming', 'Bermain game e-sports berbasis strategi untuk melatih pemikiran kritis dan koordinasi tim.', 'fa-solid fa-gamepad', 'Gaming • TakTik • Fun', 'assets/images/hobi_gaming.jpg'),
(4, 'Seni Hadroh & Sholawat', 'hadroh', 'Aktif dalam kegiatan seni musik islami (hadroh/rebana), melatih irama pukulan, tempo lagu, serta melantunkan sholawat bersama tim.', 'fa-solid fa-drum', 'Sholawat • Rebana • Kekompakan', 'assets/images/hobi_hadroh.jpg'),
(5, 'Sound System & Audio Engineering', 'sound', 'Memiliki ketertarikan tinggi pada tata suara (sound system), merakit equalizer, mixer audio, serta mengeset speaker.', 'fa-solid fa-sliders', 'Audio & Mixer • Sound Man • Kualitas Audio', 'assets/images/hobi_sound.jpg'),
(6, 'Ekstrakurikuler IT / OSIS', 'ekskul', 'Aktif mengikuti kegiatan organisasi di sekolah untuk melatih jiwa kepemimpinan dan komunikasi.', 'fa-solid fa-users', 'Organisasi • Soft Skills', 'assets/images/hobi_ekskul.jpg');

-- --------------------------------------------------------------------
-- 3. TABEL PESAN KONTAK (tb_pesan)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_pesan` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nama` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `pesan` TEXT NOT NULL,
    `waktu_kirim` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Contoh Pesan
INSERT INTO `tb_pesan` (`id`, `nama`, `email`, `pesan`) VALUES
(1, 'Budi Santoso', 'budi@example.com', 'Halo Haikal, salam kenal! Portofolio perkenalannya keren sekali.');
