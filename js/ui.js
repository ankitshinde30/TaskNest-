function showToast(message) {
  const container = document.getElementById("toastContainer");

  const toast = document.createElement("div");
  toast.className = "toast show mb-2";
  toast.innerHTML = `<div class="toast-body">${message}</div>`;

  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}