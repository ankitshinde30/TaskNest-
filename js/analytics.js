/* LOAD TASKS */
function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

/* UPDATE STATS */
function updateStats() {
  const tasks = getTasks();

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  document.getElementById("totalTasks").innerText = total;
  document.getElementById("completedTasks").innerText = completed;
  document.getElementById("pendingTasks").innerText = pending;
}

/* WEEKLY DATA */
function getWeeklyData() {
  const tasks = getTasks();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let data = [0, 0, 0, 0, 0, 0, 0];

  tasks.forEach(t => {
    if (t.completed && t.deadline) {
      const day = new Date(t.deadline).getDay();
      data[day]++;
    }
  });

  return { labels: days, data };
}

/* RENDER CHART */
function renderChart() {
  const ctx = document.getElementById("chart");

  const weekly = getWeeklyData();

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: weekly.labels,
      datasets: [{
        label: "Tasks Completed",
        data: weekly.data
      }]
    }
  });
}

/* INIT */
updateStats();
renderChart();