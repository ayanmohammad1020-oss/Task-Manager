// 1. SELECT HTML ELEMENTS

// Navigation buttons
const DailyTab = document.querySelector("#daily-tab");
const MonthlyTab = document.querySelector("#monthly-tab");

// Task sections
const DailySection = document.querySelector("#daily-section");
const MonthlySection = document.querySelector("#monthly-section");

// 2. DAILY TASK SYSTEM

const DailyForm = document.querySelector("#daily-form");
const DailyInput = document.querySelector("#daily-input");
const DailyList = document.querySelector("#daily-task-list");
const DailyMessage = document.querySelector("#daily-message");
const DailySearch = document.querySelector("#daily-search");

const DailyAllBtn = document.querySelector("#daily-all-btn");
const DailyCompletedBtn = document.querySelector("#daily-completed-btn");
const DailyPendingBtn = document.querySelector("#daily-pending-btn");

const DailyTotalCount = document.querySelector("#daily-total-count");
const DailyCompletedCount = document.querySelector("#daily-completed-count");
const DailyPendingCount = document.querySelector("#daily-pending-count");

// 3. MONTHLY TASK SYSTEM

const MonthlyForm = document.querySelector("#monthly-form");
const MonthlyInput = document.querySelector("#monthly-input");
const MonthlyList = document.querySelector("#monthly-task-list");
const MonthlyMessage = document.querySelector("#monthly-message");
const MonthlySearch = document.querySelector("#monthly-search");

const MonthlyAllBtn = document.querySelector("#monthly-all-btn");
const MonthlyCompletedBtn = document.querySelector("#monthly-completed-btn");
const MonthlyPendingBtn = document.querySelector("#monthly-pending-btn");

const MonthlyTotalCount = document.querySelector("#monthly-total-count");
const MonthlyCompletedCount = document.querySelector("#monthly-completed-count");
const MonthlyPendingCount = document.querySelector("#monthly-pending-count");

// 4. DATE SYSTEM FOR DAILY TASKS

// Local date generate karna
function getCurrentDate() {

const date = new Date();

const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0");
const day = String(date.getDate()).padStart(2, "0");

return `${year}-${month}-${day}`;

}

// Last saved date
const savedDate = localStorage.getItem("dailyTaskDate");

const currentDate = getCurrentDate();

// Check whether a new day has started
if (savedDate !== currentDate) {

// Reset only daily tasks
localStorage.setItem("dailyTasks", JSON.stringify([]));

// Update saved date
localStorage.setItem("dailyTaskDate", currentDate);

}

// 5. LOAD TASKS FROM LOCAL STORAGE

// Daily tasks
let dailyTasks = JSON.parse(
localStorage.getItem("dailyTasks")
) || [];

// Monthly tasks
let monthlyTasks = JSON.parse(
localStorage.getItem("monthlyTasks")
) || [];

// Editing task references
let dailyEditingTask = null;
let monthlyEditingTask = null;

// Current filters
let dailyCurrentFilter = "all";
let monthlyCurrentFilter = "all";

// 6. SAVE TASKS

function saveDailyTasks() {

localStorage.setItem(
    "dailyTasks",
    JSON.stringify(dailyTasks)
);

}

function saveMonthlyTasks() {

localStorage.setItem(
    "monthlyTasks",
    JSON.stringify(monthlyTasks)
);

}

// 7. TASK COUNTER

function updateTaskCounter(
tasks,
totalCount,
completedCount,
pendingCount
) {

const total = tasks.length;

const completed = tasks.filter((task) => {
    return task.completed === true;
}).length;

const pending = tasks.filter((task) => {
    return task.completed === false;
}).length;

totalCount.textContent = `Total: ${total}`;

completedCount.textContent = `Completed: ${completed}`;

pendingCount.textContent = `Pending: ${pending}`;

}

// 8. GENERIC TASK RENDERING SYSTEM

function renderTask(taskData, list, onUpdate, onDelete, onEdit) {

const task = document.createElement("li");

const taskText = document.createElement("span");

taskText.textContent = taskData.text;


// Completed task styling
if (taskData.completed) {

    task.classList.add("completed");

}


// Complete / Undo button
const completeBtn = document.createElement("button");

completeBtn.textContent = taskData.completed
    ? "Undo"
    : "Complete";

completeBtn.type = "button";

completeBtn.addEventListener("click", () => {

    taskData.completed = !taskData.completed;

    onUpdate();

});


// Edit button
const editBtn = document.createElement("button");

editBtn.textContent = "Edit";

editBtn.type = "button";

editBtn.addEventListener("click", () => {

    onEdit(taskData);

});


// Delete button
const deleteBtn = document.createElement("button");

deleteBtn.textContent = "Delete";

deleteBtn.type = "button";

deleteBtn.addEventListener("click", () => {

    onDelete(taskData);

});


task.append(
    taskText,
    completeBtn,
    editBtn,
    deleteBtn
);

list.append(task);

}

// 9. DAILY TASK DISPLAY

function displayDailyTasks() {

const searchText = DailySearch.value.toLowerCase();

const filteredTasks = dailyTasks.filter((task) => {

    const matchesSearch = task.text
        .toLowerCase()
        .includes(searchText);

    const matchesFilter =
        dailyCurrentFilter === "all" ||
        (dailyCurrentFilter === "completed" && task.completed) ||
        (dailyCurrentFilter === "pending" && !task.completed);

    return matchesSearch && matchesFilter;

});


DailyList.innerHTML = "";


filteredTasks.forEach((taskData) => {

    renderTask(
        taskData,
        DailyList,

        // Update task
        () => {
            saveDailyTasks();
            displayDailyTasks();
        },

        // Delete task
        (selectedTask) => {

            dailyTasks = dailyTasks.filter((item) => {
                return item !== selectedTask;
            });

            if (dailyEditingTask === selectedTask) {

                dailyEditingTask = null;
                DailyInput.value = "";
                DailyMessage.textContent = "";

            }

            saveDailyTasks();
            displayDailyTasks();

        },

        // Edit task
        (selectedTask) => {

            DailyInput.value = selectedTask.text;

            dailyEditingTask = selectedTask;

            DailyInput.focus();

            DailyMessage.textContent = "Editing task...";

        }

    );

});


updateTaskCounter(
    dailyTasks,
    DailyTotalCount,
    DailyCompletedCount,
    DailyPendingCount
);


}

// 10. MONTHLY TASK DISPLAY

function displayMonthlyTasks() {

const searchText = MonthlySearch.value.toLowerCase();

const filteredTasks = monthlyTasks.filter((task) => {

    const matchesSearch = task.text
        .toLowerCase()
        .includes(searchText);

    const matchesFilter =
        monthlyCurrentFilter === "all" ||
        (monthlyCurrentFilter === "completed" && task.completed) ||
        (monthlyCurrentFilter === "pending" && !task.completed);

    return matchesSearch && matchesFilter;

});


MonthlyList.innerHTML = "";


filteredTasks.forEach((taskData) => {

    renderTask(
        taskData,
        MonthlyList,

        // Update task
        () => {
            saveMonthlyTasks();
            displayMonthlyTasks();
        },

        // Delete task
        (selectedTask) => {

            monthlyTasks = monthlyTasks.filter((item) => {
                return item !== selectedTask;
            });

            if (monthlyEditingTask === selectedTask) {

                monthlyEditingTask = null;
                MonthlyInput.value = "";
                MonthlyMessage.textContent = "";

            }

            saveMonthlyTasks();
            displayMonthlyTasks();

        },

        // Edit task
        (selectedTask) => {

            MonthlyInput.value = selectedTask.text;

            monthlyEditingTask = selectedTask;

            MonthlyInput.focus();

            MonthlyMessage.textContent = "Editing task...";

        }

    );

});


updateTaskCounter(
    monthlyTasks,
    MonthlyTotalCount,
    MonthlyCompletedCount,
    MonthlyPendingCount
);

}

// 11. DAILY FORM SUBMIT

DailyForm.addEventListener("submit", (event) => {

event.preventDefault();

const taskText = DailyInput.value.trim();


if (taskText === "") {

    DailyMessage.textContent = "Please enter a task!";

    return;

}


// Edit existing task
if (dailyEditingTask !== null) {

    dailyEditingTask.text = taskText;

    dailyEditingTask = null;

    DailyMessage.textContent = "Task updated successfully!";

}

// Add new task
else {

    dailyTasks.push({

        text: taskText,

        completed: false

    });

    DailyMessage.textContent = "";

}


saveDailyTasks();

displayDailyTasks();

DailyInput.value = "";

});

// 12. MONTHLY FORM SUBMIT

MonthlyForm.addEventListener("submit", (event) => {

event.preventDefault();

const taskText = MonthlyInput.value.trim();


if (taskText === "") {

    MonthlyMessage.textContent = "Please enter a task!";

    return;

}


// Edit existing task
if (monthlyEditingTask !== null) {

    monthlyEditingTask.text = taskText;

    monthlyEditingTask = null;

    MonthlyMessage.textContent = "Task updated successfully!";

}

// Add new task
else {

    monthlyTasks.push({

        text: taskText,

        completed: false

    });

    MonthlyMessage.textContent = "";

}


saveMonthlyTasks();

displayMonthlyTasks();

MonthlyInput.value = "";

});

// 13. DAILY SEARCH AND FILTER

DailySearch.addEventListener("input", () => {

displayDailyTasks();

});

DailyAllBtn.addEventListener("click", () => {

dailyCurrentFilter = "all";

displayDailyTasks();

});

DailyCompletedBtn.addEventListener("click", () => {

dailyCurrentFilter = "completed";

displayDailyTasks();

});

DailyPendingBtn.addEventListener("click", () => {

dailyCurrentFilter = "pending";

displayDailyTasks();

});

// 14. MONTHLY SEARCH AND FILTER

MonthlySearch.addEventListener("input", () => {

displayMonthlyTasks();

});

MonthlyAllBtn.addEventListener("click", () => {

monthlyCurrentFilter = "all";

displayMonthlyTasks();

});

MonthlyCompletedBtn.addEventListener("click", () => {

monthlyCurrentFilter = "completed";

displayMonthlyTasks();

});

MonthlyPendingBtn.addEventListener("click", () => {

monthlyCurrentFilter = "pending";

displayMonthlyTasks();

});

// 15. NAVIGATION / TAB SWITCHING

// Daily tab
DailyTab.addEventListener("click", () => {

DailySection.classList.add("active");

MonthlySection.classList.remove("active");


DailyTab.classList.add("active");

MonthlyTab.classList.remove("active");

});

// Monthly tab
MonthlyTab.addEventListener("click", () => {

MonthlySection.classList.add("active");

DailySection.classList.remove("active");


MonthlyTab.classList.add("active");

DailyTab.classList.remove("active");

});

// 16. INITIAL DISPLAY

// Show Daily Tasks by default
DailySection.classList.add("active");

DailyTab.classList.add("active");

// Display saved tasks
displayDailyTasks();

displayMonthlyTasks();
