<?php
require_once "config.php";

$page = $_GET['page'] ?? 'personal';

if ($page !== 'personal' && $page !== 'shared') {
    $page = 'personal';
}

$category = $page;

$stmt = $conn->prepare(
    "SELECT * FROM tasks WHERE category = ? ORDER BY deadline ASC"
);

$stmt->bind_param("s", $category);
$stmt->execute();

$result = $stmt->get_result();
?>

<section class="task-list">
    <h2>
        <?php echo $page === 'personal' ? 'Personal Tasks' : 'Shared Tasks'; ?>
    </h2>

    <?php if ($result->num_rows > 0): ?>
        <?php while ($task = $result->fetch_assoc()): ?>
            <article class="task">
                <h3>
                    <?php echo htmlspecialchars($task['title']); ?>
                </h3>

                <p>
                    <?php echo htmlspecialchars($task['description'] ?? ''); ?>
                </p>

                <p>
                    Deadline:
                    <?php echo htmlspecialchars($task['deadline'] ?? '-'); ?>
                </p>

                <p>
                    Status:
                    <?php echo $task['is_completed'] ? 'Selesai' : 'Belum selesai'; ?>
                    <div class="task-actions">
                        <a href="edit.php?id=<?php echo $task['id']; ?>">Edit</a>
                        <form action="delete.php" method="POST" onsubmit="return confirm('Yakin ingin menghapus tugas ini?');">
                            <input type="hidden" name="id" value="<?php echo $task['id']; ?>">
                            <button type="submit" class="delete-button">Delete</button>
                        </form>
                    </div>
                </p>
            </article>
        <?php endwhile; ?>
    <?php else: ?>
        <p>Empty task.</p>
    <?php endif; ?>

</section>

<?php
$stmt->close();
?>