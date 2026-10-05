const taskForm = document.getElementById("taskForm");
const taskContainer = document.getElementById("taskContainer");
const DB_NAME = "StudyPlannerDB";
const DB_VERSION = 1;

let db;
function openDatabase() {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = function(event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains("tasks")) {
            db.createObjectStore("tasks", {
                keyPath: "id",
                autoIncrement: true
            });
        }
    };
    request.onsuccess = function(event) {
        db = event.target.result;
        addDefaultTasks();
    };
    request.onerror = function() {
        console.log("Database gagal dibuka");
    };
}

function addDefaultTasks() {
    const transaction = db.transaction(
        ["tasks"],
        "readonly"
    );
    const store = transaction.objectStore("tasks");
    const request = store.count();
    request.onsuccess = function() {
        if (request.result === 0) {
            const defaultTasks = [
                {
                    name: "Tugas Teori Graf",
                    description: "Tugas Mingguan 1 dan 2",
                    deadline: "",
                    notificationTime: "",
                    image: null,
                    completed: false
                },
                {
                    name: "Tugas KPPL",
                    description: "Resume IBM",
                    deadline: "",
                    notificationTime: "",
                    image: null,
                    completed: false
                },
                {
                    name: "Schematics",
                    description: "Crosscheck kontak sekolah",
                    deadline: "",
                    notificationTime: "",
                    image: null,
                    completed: false
                },
                {
                    name: "Tugas Matematika Diskrit",
                    description: "Predicate and Quantifier",
                    deadline: "",
                    notificationTime: "",
                    image: null,
                    completed: false
                }
            ];
            defaultTasks.forEach(function(task) {
                addTask(task);
            });
        } else {
            loadTasks();
        }
    };
}

function addTask(task) {
    const transaction = db.transaction(
        ["tasks"],
        "readwrite"
    );
    const store = transaction.objectStore("tasks");
    store.add(task);
    transaction.oncomplete = function() {
        loadTasks();
    };
}

function loadTasks() {
    const transaction = db.transaction(
        ["tasks"],
        "readonly"
    );
    const store = transaction.objectStore("tasks");
    const request = store.getAll();
    request.onsuccess = function() {
        taskContainer.innerHTML = "";
        const tasks = request.result;
        tasks.forEach(function(task) {
            createTask(task);
        });
        checkNotification(tasks);
    };
}

function createTask(task) {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute(
        "aria-label",
        "Mark task as completed"
    );

    const textDiv = document.createElement("div");
    const taskTitle = document.createElement("h3");
    taskTitle.textContent = task.name;

    const taskDescription = document.createElement("p");
    taskDescription.textContent = task.description;
    textDiv.appendChild(taskTitle);
    textDiv.appendChild(taskDescription);
    if (task.deadline !== "") {
        const deadline = document.createElement("p");
        deadline.textContent =
            "Deadline: " + task.deadline;
        textDiv.appendChild(deadline);
    }

    if (task.image !== null) {
        const image = document.createElement("img");
        image.src = task.image;
        image.alt = "Image for " + task.name;
        image.classList.add("task-image");
        textDiv.appendChild(image);
    }

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.classList.add("edit-button");
    editButton.setAttribute(
        "aria-label",
        "Edit " + task.name
    );

    editButton.addEventListener(
        "click",
        function() {
            const newName = prompt(
                "Edit task name:",
                task.name
            );

            if (
                newName !== null &&
                newName !== ""
            ) {
                task.name = newName;
            }

            const newDescription = prompt(
                "Edit description:",
                task.description
            );

            if (
                newDescription !== null &&
                newDescription !== ""
            ) {
                task.description = newDescription;
            }

            updateTask(task);
        }
    );

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.setAttribute(
        "aria-label",
        "Delete " + task.name
    );
    deleteButton.addEventListener(
        "click",
        function() {
            deleteTask(task.id);
        }
    );

    checkbox.addEventListener(
        "change",
        function() {
            if (checkbox.checked) {
                task.completed = true;
                taskDiv.classList.add("completed");
            } else {
                task.completed = false;
                taskDiv.classList.remove("completed");
            }

            updateTask(task);
        }
    );

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(textDiv);
    taskDiv.appendChild(editButton);
    taskDiv.appendChild(deleteButton);

    if (task.completed) {
        taskDiv.classList.add("completed");
    }

    taskContainer.appendChild(taskDiv);
}

function updateTask(task) {
    const transaction = db.transaction(
        ["tasks"],
        "readwrite"
    );
    const store = transaction.objectStore("tasks");
    store.put(task);
    transaction.oncomplete = function() {
        loadTasks();
    };
}

function deleteTask(id) {
    const transaction = db.transaction(
        ["tasks"],
        "readwrite"
    );
    const store = transaction.objectStore("tasks");
    store.delete(id);
    transaction.oncomplete = function() {
        loadTasks();
    };
}

function showTaskDetail(task) {
    document.getElementById("detailName").value =
        task.name;
    document.getElementById("detailDescription").value =
        task.description;
    document.getElementById("detailDeadline").value =
        task.deadline;
}

taskForm.addEventListener(
    "submit",
    function(event) {
        event.preventDefault();

        const taskName =
            document.getElementById("taskName").value;
        const taskDescription =
            document.getElementById("taskDescription").value;
        const taskDeadline =
            document.getElementById("taskDeadline").value;
        const notificationTime =
            document.getElementById("notificationTime").value;
        const imageInput =
            document.getElementById("taskImage");
        const task = {
            name: taskName,
            description: taskDescription,
            deadline: taskDeadline,
            notificationTime: notificationTime,
            image: null,
            completed: false,
            notificationSent: false
        };

        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];
            const reader = new FileReader();

            reader.onload = function() {
                task.image = reader.result;
                addTask(task);
                taskForm.reset();
            };

            reader.readAsDataURL(file);
        } else {
            addTask(task);
            taskForm.reset();
        }

        if (
            notificationTime !== "" &&
            "Notification" in window
        ) {
            Notification.requestPermission();
        }
    }
);

const darkModeButton =
    document.getElementById("darkModeButton");

darkModeButton.addEventListener(
    "click",
    function() {
        document.body.classList.toggle(
            "dark-mode"
        );
        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {
            localStorage.setItem(
                "theme",
                "dark"
            );
            darkModeButton.textContent =
                "Light Mode";
        } else {
            localStorage.setItem(
                "theme",
                "light"
            );
            darkModeButton.textContent =
                "Dark Mode";
        }
    }
);

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.classList.add(
        "dark-mode"
    );
    darkModeButton.textContent = "Light Mode";
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .then(function() {
            console.log(
                "Service Worker berhasil dijalankan"
            );
        })
        .catch(function() {
            console.log(
                "Service Worker gagal dijalankan"
            );
        });
}

function checkNotification(tasks) {
    const now = new Date();
    tasks.forEach(function(task) {
        if (!task.notificationTime || task.notificationSent) {
            return;
        }

        const notificationDate = new Date(task.notificationTime);
        const difference = now - notificationDate;

        if (difference >= 0 && difference < 60000) {
            showNotification(task);
            task.notificationSent = true;
            updateTask(task);
        }
    });
}

function showNotification(task) {
    if (!("Notification" in window) || Notification.permission !== "granted") {
        return;
    }
    navigator.serviceWorker.ready
        .then(function(registration) {
            registration.active.postMessage({
                type: "show-notification",
                title: "Study Planner",
                body:
                    "Waktunya mengerjakan: " + task.name
            });
        });
}

setInterval(
    function() {
        if (db) {
            loadTasks();
        }
    },
    10000
);

openDatabase();