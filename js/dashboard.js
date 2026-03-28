/* SIDEBAR TOGGLE */
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}

/* THEME TOGGLE */
function toggleTheme() {
  const body = document.body;
  body.dataset.theme =
    body.dataset.theme === "dark" ? "light" : "dark";

  localStorage.setItem("theme", body.dataset.theme);
}

/* LOAD THEME */
(function () {
  const saved = localStorage.getItem("theme") || "light";
  document.body.dataset.theme = saved;
})();

/* LOAD USER */
const user = JSON.parse(localStorage.getItem("tasknest_user"));
if (user) {
  document.getElementById("welcomeText").innerText =
    `Welcome, ${user.name} 👋`;
}

/* MOCK DATA (until modules ready) */
const tasks = [
  { title: "Gym", completed: true },
  { title: "Study JS", completed: false }
];

const notes = [
  { title: "Meeting at 5PM" },
  { title: "Project ideas" }
];

/* LOAD TASKS */
const taskList = document.getElementById("taskList");
tasks.forEach(t => {
  const li = document.createElement("li");
  li.innerText = t.title + (t.completed ? " ✔" : "");
  taskList.appendChild(li);
});

/* LOAD NOTES */
const notesList = document.getElementById("notesList");
notes.forEach(n => {
  const li = document.createElement("li");
  li.innerText = n.title;
  notesList.appendChild(li);
});

/* PROGRESS */
const completed = tasks.filter(t => t.completed).length;
const progress = (completed / tasks.length) * 100;

document.getElementById("progressBar").style.width = progress + "%";

function smartSuggestions() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const pending = tasks.filter(t => !t.completed).length;
  const completed = tasks.filter(t => t.completed).length;

  if (pending >= 5) {
    showToast(`⚠️ You have ${pending} pending tasks!`);
  }

  if (completed >= 5) {
    showToast(`🔥 Great job! ${completed} tasks done!`);
  }
}