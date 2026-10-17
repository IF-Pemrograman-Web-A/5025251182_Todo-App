<?php
require_once "config.php";

$page = $_GET['page'] ?? 'personal';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $deadline = $_POST['deadline'] ?? '';
    $category = $_POST['category'] ?? 'personal';

    if ($title !== '' && $description !== '') {
        $stmt = $conn->prepare(
            "INSERT INTO tasks (title, description, deadline, category)
             VALUES (?, ?, NULLIF(?, ''), ?)"
        );

        $stmt->bind_param(
            "ssss",
            $title,
            $description,
            $deadline,
            $category
        );

        $stmt->execute();
        $stmt->close();

        header("Location: index.php?page=" . urlencode($category));
        exit;
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Study Planner</title>

    <link rel="stylesheet" href="style.css">
</head>

<body>
    <header>
        <h1>Study Planner</h1>
        <p>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>

        <button type="button" id="darkModeButton">
            Dark Mode
        </button>
    </header>

    <?php include "menu-bar.php"; ?>
    
    <main>
    <?php include "content.php"; ?>

        <aside class="task-detail" aria-labelledby="detailTitle">
            <h2 id="detailTitle">Task Detail</h2>
            <label for="detailName">Task Name</label>
            <input
                type="text"
                id="detailName"
                readonly
            >
            <label for="detailDescription">Description</label>
            <textarea
                id="detailDescription"
                rows="5"
                readonly
            ></textarea>
            <label for="detailDeadline">Deadline</label>
            <input
                type="date"
                id="detailDeadline"
                readonly
            >
        </aside>
    </main>

    <section class="new-task" aria-labelledby="newTaskTitle">
        <h2 id="newTaskTitle">Create New Task</h2>
        
        <form action="index.php" method="POST" id="taskForm">
            <label for="taskName">
                Task Name
            </label>
            <input
                type="text"
                id="taskName"
                name="title"
                placeholder="Enter your task"
                required
            >

            <label for="taskDescription">
                Description
            </label>
            <textarea
                id="taskDescription"
                name="description"
                rows="4"
                placeholder="Enter task description"
                required
            ></textarea>

            <label for="taskDeadline">
                Deadline
            </label>
            <input
                type="date"
                id="taskDeadline"
                name="deadline"
            >

            <label for="taskCategory">
                Category
            </label>
            <select id="taskCategory" name="category" required>
                <option value="personal">Personal</option>
                <option value="shared">Shared</option>
            </select>

            <label for="taskImage">
                Task Image
            </label>
            <input
                type="file"
                id="taskImage"
                accept="image/*"
                capture="environment"
            >

            <label for="notificationTime">
                Notification Time
            </label>
            <input
                type="datetime-local"
                id="notificationTime"
            >

            <button type="submit">
                Add Task
            </button>
        </form>
    </section>

    <footer>
        <p>2026 Study Planner</p>
    </footer>

<script>
    document.getElementById("darkModeButton").addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
    });
</script>
</body>
</html>