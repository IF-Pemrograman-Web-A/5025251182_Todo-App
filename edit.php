<?php
require_once "config.php";

$id = $_GET['id'] ?? '';

if ($id === '' || !ctype_digit($id)) {
    die("ID tugas tidak valid.");
}

$stmt = $conn->prepare("SELECT * FROM tasks WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();
$task = $result->fetch_assoc();
$stmt->close();

if (!$task) {
    die("Tugas tidak ditemukan.");
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Task</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="edit-container">
    <h2>Edit Task</h2>

    <form action="update.php" method="POST">
        <input type="hidden" name="id"
               value="<?php echo $task['id']; ?>">

        <label for="title">Task Name</label>
        <input type="text" id="title" name="title"
               value="<?php echo htmlspecialchars($task['title']); ?>"
               required>

        <label for="description">Description</label>
        <textarea id="description" name="description"
                  required><?php echo htmlspecialchars($task['description']); ?></textarea>

        <label for="deadline">Deadline</label>
        <input type="date" id="deadline" name="deadline"
               value="<?php echo htmlspecialchars($task['deadline'] ?? ''); ?>">

        <label for="category">Category</label>
        <select id="category" name="category" required>
            <option value="personal"
                <?php echo $task['category'] === 'personal' ? 'selected' : ''; ?>>
                Personal
            </option>
            <option value="shared"
                <?php echo $task['category'] === 'shared' ? 'selected' : ''; ?>>
                Shared
            </option>
        </select>

        <button type="submit">Save Changes</button>
    </form>

    <p><a href="index.php?page=<?php echo urlencode($task['category']); ?>">Cancel</a></p>
    
    </div>
</body>
</html>