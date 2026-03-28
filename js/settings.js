/* THEME TOGGLE */
function toggleTheme() {
  const body = document.body;

  body.dataset.theme =
    body.dataset.theme === "dark" ? "light" : "dark";

  localStorage.setItem("theme", body.dataset.theme);
}

/* LOAD THEME */
(function () {
  const saved = localStorage.getItem("theme");
  if (saved) document.body.dataset.theme = saved;
})();

/* CLEAR DATA */
function clearData() {
  if (confirm("Are you sure? This will delete all data!")) {
    localStorage.clear();
    alert("All data cleared!");
    location.reload();
  }
}

/* EXPORT DATA */
function exportData() {
  const data = {
    tasks: JSON.parse(localStorage.getItem("tasks")) || [],
    notes: JSON.parse(localStorage.getItem("notes")) || []
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "tasknest-data.json";
  a.click();
}

/* LOGOUT */
function logout() {
  localStorage.removeItem("tasknest_user");
  alert("Logged out!");
  window.location.href = "login.html";
}