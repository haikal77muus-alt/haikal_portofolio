<?php
/* ==========================================================================
   KONEKSI.PHP - FILE KONEKSI DATABASE MYSQL (XAMPP)
   ========================================================================== */

$host     = "localhost";
$username = "root";
$password = "";
$database = "db_haikal";

// Membuat koneksi ke database MySQL
$koneksi = mysqli_connect($host, $username, $password, $database);

// Periksa koneksi
if (!$koneksi) {
    // Jika koneksi gagal, hentikan dan tampilkan pesan error yang ramah
    die(json_encode([
        "status" => "error",
        "message" => "Gagal terhubung ke database. Pastikan MySQL di XAMPP sudah aktif dan database 'db_haikal' sudah di-import."
    ]));
}

// Set karakter encoding ke utf8mb4
mysqli_set_charset($koneksi, "utf8mb4");
?>
