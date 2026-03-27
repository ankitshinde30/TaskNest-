let currentDate = new Date();

/* RENDER CALENDAR */
function renderCalendar() {
  const calendar = document.getElementById("calendar");
  const monthYear = document.getElementById("monthYear");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendar.innerHTML = "";
  monthYear.innerText = `${currentDate.toLocaleString("default", { month: "long" })} ${year}`;

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  /* EMPTY SPACES */
  for (let i = 0; i < firstDay; i++) {
    calendar.innerHTML += `<div></div>`;
  }

  /* DAYS */
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const hasTask = tasks.some(t => t.deadline === dateStr);

    const isToday =
      new Date().toDateString() === new Date(year, month, day).toDateString();

    calendar.innerHTML += `
      <div class="day ${isToday ? "today" : ""} ${hasTask ? "has-task" : ""}"
        onclick="showTasksByDate('${dateStr}')">
        ${day}
      </div>
    `;
  }
}

/* CHANGE MONTH */
function changeMonth(offset) {
  currentDate.setMonth(currentDate.getMonth() + offset);
  renderCalendar();
}

/* SHOW TASKS BY DATE */
function showTasksByDate(date) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const filtered = tasks.filter(t => t.deadline === date);

  alert(
    filtered.length
      ? filtered.map(t => t.text).join("\n")
      : "No tasks for this date"
  );
}

/* TODAY TASKS */
function loadTodayTasks() {
  const today = new Date().toISOString().split("T")[0];
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const todayList = document.getElementById("todayTasks");
  todayList.innerHTML = "";

  const todayTasks = tasks.filter(t => t.deadline === today);

  if (!todayTasks.length) {
    todayList.innerHTML = "<li>No tasks today 🎉</li>";
    return;
  }

  todayTasks.forEach(t => {
    const li = document.createElement("li");
    li.innerText = t.text;
    todayList.appendChild(li);
  });
}

/* REMINDERS */
function checkReminders() {
  const today = new Date().toISOString().split("T")[0];
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const dueTasks = tasks.filter(t => t.deadline === today && !t.completed);

  if (dueTasks.length) {
    setTimeout(() => {
      alert(`⏰ You have ${dueTasks.length} task(s) due today!`);
    }, 1000);
  }
}

/* INIT */
renderCalendar();
loadTodayTasks();
checkReminders();