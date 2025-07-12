document.addEventListener("DOMContentLoaded", () => {
  const taskList = document.getElementById("taskList");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskInput = document.getElementById("taskInput");
  const deadlineInput = document.getElementById("deadlineInput");
  const toggleTaskBtn = document.getElementById("toggleTaskBtn");
  const taskPanel = document.getElementById("taskPanel");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = `task-item ${task.completed ? "done" : ""} ${task.priority ? "priority" : ""}`;
      li.innerHTML = `
        <input type="checkbox" ${task.completed ? "checked" : ""} data-index="${index}" class="task-check">
        <span>${task.text}</span>
        <small class="deadline">${task.deadline || ""}</small>
        <button data-index="${index}" class="priorityBtn">✔️</button>
        <button data-index="${index}" class="deleteBtn">🗑️</button>
      `;
      taskList.appendChild(li);
    });
  }

  addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    const deadline = deadlineInput.value;

    if (!text) return alert("❗ Vui lòng nhập tên công việc!");

    tasks.push({ text, completed: false, priority: false, deadline });
    saveTasks();
    renderTasks();

    taskInput.value = "";
    deadlineInput.value = "";
  });

  taskList.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    if (!index) return;

    if (e.target.classList.contains("task-check")) {
      tasks[index].completed = e.target.checked;
    } else if (e.target.classList.contains("deleteBtn")) {
      tasks.splice(index, 1);
    } else if (e.target.classList.contains("priorityBtn")) {
      tasks[index].priority = !tasks[index].priority;
    }
    saveTasks();
    renderTasks();
  });

  toggleTaskBtn.addEventListener("click", () => {
    taskPanel.style.display = taskPanel.style.display === "none" || taskPanel.style.display === ""
      ? "block"
      : "none";
  });

  renderTasks();
});

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleTaskPanel");
  const taskPanel = document.getElementById("taskPanel");

  toggleBtn.addEventListener("click", () => {
    const isHidden = taskPanel.style.display === "none" || taskPanel.style.display === "";
    taskPanel.style.display = isHidden ? "block" : "none";
  });
});
