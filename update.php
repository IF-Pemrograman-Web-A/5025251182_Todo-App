<?php
require_once "config.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: index.php");
    exit;
}

$id = $_POST['id'] ?? '';
$title = trim($_POST['title'] ?? '');
$description = trim($_POST['description'] ?? '');
$deadline = $_POST['deadline'] ?? '';
$category = $_POST['category'] ?? '';

if (
    !ctype_digit($id) ||
    $title === '' ||
    $description === '' ||
    !in_array($category, ['personal', 'shared'], true)
) {
    die("Data tugas tidak valid.");
}

$stmt = $conn->prepare(
    "UPDATE tasks
     SET title = ?, description = ?, deadline = NULLIF(?, ''), category = ?
     WHERE id = ?"
);

$stmt->bind_param(
    "ssssi",
    $title,
    $description,
    $deadline,
    $category,
    $id
);

if ($stmt->execute()) {
    $stmt->close();
    header("Location: index.php?page=" . urlencode($category));
    exit;
}

$stmt->close();
die("Gagal update tugas.");
?>