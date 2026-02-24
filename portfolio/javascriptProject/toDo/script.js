const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// Load tasks from localStorage when page loads
document.addEventListener("DOMContentLoaded", loadTasks);

addBtn.addEventListener("click", addTask);

function addTask() {
    if (input.value === "") return;

    createTask(input.value);
    saveTask(input.value);

    input.value = "";
}

function createTask(taskText) {
    const li = document.createElement("li");
    li.innerHTML = `
        ${taskText}
        <button onclick="deleteTask(this)">X</button>
    `;
    taskList.appendChild(li);
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => createTask(task));
}

function deleteTask(btn) {
    const li = btn.parentElement;
    const taskText = li.firstChild.textContent.trim();

    li.remove();
    removeFromStorage(taskText);
}

function removeFromStorage(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks = tasks.filter(t => t !== task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
