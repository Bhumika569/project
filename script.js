// Store all tasks in an array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Current filter
let currentFilter = "All";

// ID of task being edited
let editingId = null;

// Get HTML elements
const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");

// Add or update a task
function addTask() {

    const taskName = taskInput.value.trim();
    const date = dueDate.value;
    const taskPriority = priority.value;

    // Check empty task
    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }

    if (editingId !== null) {

        // Update existing task
        const task = tasks.find(t => t.id === editingId);

        task.name = taskName;
        task.date = date;
        task.priority = taskPriority;

        editingId = null;
        addButton.textContent = "Add Task";

    } else {

        // Create a new task
        const newTask = {
            id: Date.now(),
            name: taskName,
            date: date,
            priority: taskPriority,
            completed: false
        };

        tasks.push(newTask);
    }

    // Save tasks
    saveTasks();

    // Clear form
    taskInput.value = "";
    dueDate.value = "";
    priority.value = "Medium";

    // Display updated tasks
    displayTasks();
}

// Save tasks in browser Local Storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks
function displayTasks() {

    taskList.innerHTML = "";

    // Filter tasks
    let filteredTasks = tasks.filter(task => {

        if (currentFilter === "Pending") {
            return !task.completed;
        }

        if (currentFilter === "Completed") {
            return task.completed;
        }

        return true;
    });

    // Sort by priority
    const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3
    };

    filteredTasks.sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    // Show empty message
    if (filteredTasks.length === 0) {
        taskList.textContent = "No tasks found!";
        taskList.className = "empty-message";
    } else {

        taskList.className = "";

        filteredTasks.forEach(task => {

            // Create task card
            const card = document.createElement("div");
            card.className = "task-card";

            // Task information
            const info = document.createElement("div");
            info.className = "task-info";

            const title = document.createElement("h3");
            title.textContent = task.name;

            if (task.completed) {
                title.classList.add("completed");
            }

            const priorityText = document.createElement("p");
            priorityText.className = "priority " +
                task.priority.toLowerCase();

            priorityText.textContent =
                "Priority: " + task.priority;

            const dateText = document.createElement("p");
            dateText.textContent =
                "Due Date: " + (task.date || "Not specified");

            info.appendChild(title);
            info.appendChild(priorityText);
            info.appendChild(dateText);

            // Task action buttons
            const actions = document.createElement("div");
            actions.className = "task-actions";

            const completeBtn = document.createElement("button");
            completeBtn.className = "complete-btn";
            completeBtn.textContent =
                task.completed ? "Undo" : "Complete";

            completeBtn.onclick = () => toggleTask(task.id);

            const editBtn = document.createElement("button");
            editBtn.className = "edit-btn";
            editBtn.textContent = "Edit";

            editBtn.onclick = () => editTask(task.id);

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.textContent = "Delete";

            deleteBtn.onclick = () => deleteTask(task.id);

            actions.appendChild(completeBtn);
            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);

            card.appendChild(info);
            card.appendChild(actions);

            taskList.appendChild(card);
        });
    }

    updateDashboard();
}

// Mark task as completed or pending
function toggleTask(id) {

    const task = tasks.find(t => t.id === id);

    if (task) {
        task.completed = !task.completed;
    }

    saveTasks();
    displayTasks();
}

// Delete a task
function deleteTask(id) {

    if (confirm("Are you sure you want to delete this task?")) {

        tasks = tasks.filter(task => task.id !== id);

        if (editingId === id) {
            cancelEdit();
        }

        saveTasks();
        displayTasks();
    }
}

// Edit a task
function editTask(id) {

    const task = tasks.find(t => t.id === id);

    if (!task) return;

    taskInput.value = task.name;
    dueDate.value = task.date;
    priority.value = task.priority;

    editingId = id;
    addButton.textContent = "Update Task";

    taskInput.focus();
}

// Cancel editing
function cancelEdit() {

    editingId = null;

    taskInput.value = "";
    dueDate.value = "";
    priority.value = "Medium";

    addButton.textContent = "Add Task";
}

// Filter tasks
function filterTasks(filter) {

    currentFilter = filter;

    displayTasks();
}

// Update dashboard numbers
function updateDashboard() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;

    document.getElementById("pendingTasks").textContent = pending;

    document.getElementById("completedTasks").textContent = completed;
}

// Display saved tasks when page opens
displayTasks();
Show quoted text