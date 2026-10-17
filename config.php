<?php
$host = "localhost";
$username = "root";
$password = "";
$database = "5025251182_Todo-App";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Koneksi database gagal: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");
?>