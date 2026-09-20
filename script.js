const taskForm = document.getElementById("taskForm");

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskName = document.getElementById("taskName").value;
    const taskDescription = document.getElementById("taskDescription").value;
    const newTask = {
        name: taskName,
        description: taskDescription,
        completed: false
    };
    createTask(newTask);
    taskForm.reset();
});

function createTask(task) {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    const textDiv = document.createElement("div");
    const taskTitle = document.createElement("h3");
    taskTitle.textContent = task.name;
    const taskDescription = document.createElement("p");
    taskDescription.textContent = task.description;
    textDiv.appendChild(taskTitle);
    textDiv.appendChild(taskDescription);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", function() {
        const newName = prompt(
            "Edit task name:",
            taskTitle.textContent
        );
        if (newName !== null && newName !== "") {
            taskTitle.textContent = newName;
            task.name = newName;
        }
        const newDescription = prompt(
            "Edit description:",
            taskDescription.textContent
        );
        if (newDescription !== null && newDescription !== "") {
            taskDescription.textContent = newDescription;
            task.description = newDescription;
        }
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", function() {
        taskDiv.remove();
    });

    checkbox.addEventListener("change", function() {
        if (checkbox.checked) {
            taskDiv.classList.add("completed");
            task.completed = true;
        } else {
            taskDiv.classList.remove("completed");
            task.completed = false;
        }
    });

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(textDiv);
    taskDiv.appendChild(editButton);
    taskDiv.appendChild(deleteButton);
    document.querySelector(".task-list").appendChild(taskDiv);
}

const oldTasks = document.querySelectorAll(".task");

oldTasks.forEach(function(taskDiv) {
    const checkbox = taskDiv.querySelector("input[type='checkbox']");
    checkbox.addEventListener("change", function() {
        if (checkbox.checked) {
            taskDiv.classList.add("completed");
        } else {
            taskDiv.classList.remove("completed");
        }
    });
    const editButton = taskDiv.querySelector(".edit-button");
    editButton.addEventListener("click", function() {
        const taskTitle = taskDiv.querySelector("h3");
        const taskDescription = taskDiv.querySelector("p");
        const newName = prompt(
            "Edit task name:",
            taskTitle.textContent
        );
        if (newName !== null && newName !== "") {
            taskTitle.textContent = newName;
        }
        const newDescription = prompt(
            "Edit description:",
            taskDescription.textContent
        );
        if (newDescription !== null && newDescription !== "") {
            taskDescription.textContent = newDescription;
        }
    });
    const deleteButton = taskDiv.querySelector(".delete-button");
    deleteButton.addEventListener("click", function() {
        taskDiv.remove();
    });
});

const darkModeButton = document.getElementById("darkModeButton");
darkModeButton.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});