let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

/* SAVE */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ADD TASK */
function addTask() {
  const text = document.getElementById("taskInput").value;
  const priority = document.getElementById("priority").value;
  const deadline = document.getElementById("deadline").value;

  if (!text) return showToast("Please enter a task ⚠️");

  tasks.push({
  id: Date.now(),
  text,
  priority,
  deadline,
  completed: false,
  pinned: false
});

  saveTasks();
  renderTasks();
}

/* DELETE */
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

/* TOGGLE COMPLETE */
function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );

  saveTasks();
  renderTasks();
}

/* EDIT TASK */
function editTask(id) {
  const newText = prompt("Edit task:");
  if (!newText) return;

  tasks = tasks.map(t =>
    t.id === id ? { ...t, text: newText } : t
  );

  saveTasks();
  renderTasks();
}

/* FILTER */
function filterTasks(type) {
  filter = type;
  renderTasks();
}

/* RENDER */
function renderTasks() {
  const list = document.getElementById("taskList");
  const empty = document.getElementById("emptyState");

  list.innerHTML = "";

  let filtered = tasks;

  if (filter === "completed") {
    filtered = tasks.filter(t => t.completed);
  } else if (filter === "pending") {
    filtered = tasks.filter(t => !t.completed);
  }

  if (filtered.length === 0) {
    empty.innerHTML = `
  <div class="text-center p-3">
    <h6>No tasks yet 🚀</h6>
    <p>Start by adding your first task</p>
  </div>
`;
    return;
  } else {
    empty.innerText = "";
  }
  filtered.sort((a, b) => b.pinned - a.pinned);
  filtered.forEach(t => {
    const li = document.createElement("li");
    li.classList.add("fade-in");

    li.className = `task-item ${t.priority.toLowerCase()} ${t.completed ? "completed" : ""}`;

    li.innerHTML = `
      <div onclick="toggleTask(${t.id})">
        <strong>${t.text}</strong><br>
        <small>${t.deadline || ""}</small>
      </div>

      <div>
      <button onclick="togglePinTask(${t.id})">📌</button>
        <button onclick="editTask(${t.id})">✏️</button>
        <button onclick="deleteTask(${t.id})">🗑</button>
      </div>
    `;

    list.appendChild(li);
  });

  updateProgress();
  updateStats();
}

/* UPDATE PROGRESS */
function updateProgress() {
  const completed = tasks.filter(t => t.completed).length;
  const progress = tasks.length
    ? (completed / tasks.length) * 100
    : 0;

  document.getElementById("progressBar").style.width = progress + "%";
}

function togglePinTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, pinned: !t.pinned } : t
  );

  saveTasks();
  renderTasks();
}
/* INIT */
renderTasks();