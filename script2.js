
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const filterButtons = document.querySelector(".filters");

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save tasks in localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks
function displayTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(function(task) {
        if (currentFilter === "active") {
            return task.completed === false;
        }

        if (currentFilter === "completed") {
            return task.completed === true;
        }

        return true;
    });

    filteredTasks.forEach(function(task) {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.dataset.id = task.id;
        checkbox.dataset.action = "toggle";

        const span = document.createElement("span");
        span.textContent = task.text;

        if (task.completed) {
            span.classList.add("completed");
        }

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit";
        editBtn.dataset.id = task.id;
        editBtn.dataset.action = "edit";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete";
        deleteBtn.dataset.id = task.id;
        deleteBtn.dataset.action = "delete";

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });

    const remainingTasks = tasks.filter(function(task) {
        return task.completed === false;
    }).length;

    taskCount.textContent = remainingTasks + " task(s) remaining";
}

// Add new task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now().toString(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    taskInput.value = "";

    saveTasks();
    displayTasks();
}

// Add button
addBtn.addEventListener("click", addTask);

// Enter key
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Edit and Delete using event delegation
taskList.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const id = button.dataset.id;
    const action = button.dataset.action;

    const task = tasks.find(function(item) {
        return item.id === id;
    });

    if (!task) {
        return;
    }

    if (action === "edit") {
        const newText = prompt("Enter updated task:", task.text);

        if (newText === null) {
            return;
        }

        if (newText.trim() === "") {
            alert("Task cannot be empty!");
            return;
        }

        task.text = newText.trim();
    }

    if (action === "delete") {
        tasks = tasks.filter(function(item) {
            return item.id !== id;
        });
    }

    saveTasks();
    displayTasks();
});

// Complete task
taskList.addEventListener("change", function(event) {
    if (event.target.dataset.action !== "toggle") {
        return;
    }

    const id = event.target.dataset.id;

    const task = tasks.find(function(item) {
        return item.id === id;
    });

    if (task) {
        task.completed = event.target.checked;
        saveTasks();
        displayTasks();
    }
});

// Filter tasks
filterButtons.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-filter]");

    if (!button) {
        return;
    }

    currentFilter = button.dataset.filter;

    const buttons = filterButtons.querySelectorAll("button");

    buttons.forEach(function(btn) {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    displayTasks();
});

// Initial display
displayTasks();
