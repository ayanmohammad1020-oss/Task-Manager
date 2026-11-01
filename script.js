const Form = document.querySelector('#task-form');
const Input = document.querySelector('#task-input');
const List = document.querySelector('#task-list');
const Message = document.querySelector('#message');
const Search = document.querySelector('#search-input');

const AllBtn = document.querySelector('#all-btn');
const completedBtn = document.querySelector('#completed-btn');
const PendingBtn = document.querySelector('#pending-btn');

const TotalCount = document.querySelector('#total-count');
const CompletedCount = document.querySelector('#completed-count');
const PendingCount = document.querySelector('#pending-count');

// Load saved tasks
const savedTasks = localStorage.getItem("tasks");
let tasks = JSON.parse(savedTasks) || [];

let editingTask = null;
let currentFilter = "all";

// Save tasks in LocalStorage
function saveTasks() {
localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display individual task
function renderTask(taskData) {

const task = document.createElement("li");

const taskText = document.createElement("span");
taskText.textContent = taskData.text;

if (taskData.completed) {
    task.classList.add("completed");
}

// Complete / Undo Button
const completeBtn = document.createElement("button");

completeBtn.textContent = taskData.completed
    ? "Undo"
    : "Complete";

completeBtn.addEventListener("click", () => {

    taskData.completed = !taskData.completed;

    saveTasks();
    displayTasks();
});

// Edit Button
const editBtn = document.createElement("button");
editBtn.textContent = "Edit";

editBtn.addEventListener("click", () => {

    Input.value = taskData.text;
    editingTask = taskData;

    Input.focus();

    Message.textContent = "Editing task...";
});

// Delete Button
const deleteBtn = document.createElement("button");
deleteBtn.textContent = "Delete";

deleteBtn.addEventListener("click", () => {

    tasks = tasks.filter((item) => item !== taskData);

    if (editingTask === taskData) {
        editingTask = null;
        Input.value = "";
        Message.textContent = "";
    }

    saveTasks();
    displayTasks();
});

task.append(taskText, completeBtn, editBtn, deleteBtn);

List.append(task);

}

// Combined Search + Filter Function
function displayTasks() {

const searchText = Search.value.toLowerCase();

const filteredTasks = tasks.filter((task) => {

    const matchesSearch = task.text
        .toLowerCase()
        .includes(searchText);

    const matchesFilter =
        currentFilter === "all" ||
        (currentFilter === "completed" && task.completed) ||
        (currentFilter === "pending" && !task.completed);

    return matchesSearch && matchesFilter;
});

List.innerHTML = "";

filteredTasks.forEach((taskData) => {
    renderTask(taskData);
});

function updateTaskCounter() {

    // Total tasks count
    const totalTask = tasks.length;

    // Completed tasks count
    const completedTasks = tasks.filter((task) => {
        return task.completed === true;
    });

    console.log(completedTasks.length);

    // Pending tasks count
    const pendingTasks = tasks.filter((task) => {
        return task.completed === false;
    });

    console.log(pendingTasks.length);

    // HTML update using textContent
    TotalCount.textContent = `Total: ${totalTask}`;
    CompletedCount.textContent = `Completed: ${completedTasks.length}`;
    PendingCount.textContent = `Pending: ${pendingTasks.length}`;
}

updateTaskCounter();

}

// Initial Display
displayTasks();

// Form Submit Event
Form.addEventListener("submit", (event) => {

event.preventDefault();

const taskText = Input.value.trim();

if (taskText === "") {
    Message.textContent = "Please enter a task!";
    return;
}

if (editingTask !== null) {

    editingTask.text = taskText;

    editingTask = null;

    Message.textContent = "Task updated successfully!";

} else {

    const newTask = {
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    Message.textContent = "";
}

saveTasks();
displayTasks();

Input.value = "";

});

// Search Event
Search.addEventListener("input", () => {
displayTasks();
});

// All Tasks Button
AllBtn.addEventListener("click", () => {

currentFilter = "all";

displayTasks();

});

// Completed Tasks Button
completedBtn.addEventListener("click", () => {

currentFilter = "completed";

displayTasks();

});

// Pending Tasks Button
PendingBtn.addEventListener("click", () => {

currentFilter = "pending";

displayTasks();

});
