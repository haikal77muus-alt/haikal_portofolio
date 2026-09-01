<?php
/* ==========================================================================
   KIRIM_PESAN.PHP - SKRIP MENERIMA PESAN KONTAK DAN MENYIMPAN KE MYSQL
   ========================================================================== */

header('Content-Type: application/json; charset=utf-8');
require_once 'koneksi.php';

// Hanya terima method POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "status" => "error",
        "message" => "Metode pengiriman tidak diizinkan."
    ]);
    exit;
}

// Ambil input data dari $_POST atau JSON body
$rawInput = file_get_contents("php://input");
$jsonData = json_decode($rawInput, true);

if ($jsonData) {
    $nama  = trim($jsonData['name'] ?? '');
    $email = trim($jsonData['email'] ?? '');
    $pesan = trim($jsonData['message'] ?? '');
} else {
    $nama  = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $pesan = trim($_POST['message'] ?? '');
}

// Validasi input
if (empty($nama) || empty($email) || empty($pesan)) {
    echo json_encode([
        "status" => "error",
        "message" => "Harap lengkapi semua kolom (Nama, Email, dan Pesan)."
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "status" => "error",
        "message" => "Format alamat email tidak valid."
    ]);
    exit;
}

// Gunakan Prepared Statement untuk keamanan SQL Injection
$query = "INSERT INTO tb_pesan (nama, email, pesan) VALUES (?, ?, ?)";
$stmt = mysqli_prepare($koneksi, $query);

if ($stmt) {
    mysqli_stmt_bind_param($stmt, "sss", $nama, $email, $pesan);
    
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode([
            "status" => "success",
            "message" => "Terima kasih, " . htmlspecialchars($nama) . "! Pesan Anda berhasil tersimpan di database."
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Gagal menyimpan pesan ke database. Silakan coba lagi."
        ]);
    }
    mysqli_stmt_close($stmt);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Gagal menyiapkan perintah database."
    ]);
}

mysqli_close($koneksi);
?>
