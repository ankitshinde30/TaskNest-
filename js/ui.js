// ============================================
// TaskNest - UI Utilities JS
// ============================================

// ---- Toasts ----
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const id    = 'toast-' + Date.now();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.id = id;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
    <span class="toast-text">${message}</span>
    <button class="toast-close" onclick="dismissToast('${id}')">✕</button>
  `;

  container.appendChild(toast);

  setTimeout(() => dismissToast(id), 3500);
}

function dismissToast(id) {
  const toast = document.getElementById(id);
  if (!toast) return;
  toast.classList.add('removing');
  setTimeout(() => toast.remove(), 300);
}

// ---- Modals ----
window.closeModal = function () {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
};

// Close modal on overlay click
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function (e) {
      if (e.target === this) closeModal();
    });
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
});

// ---- Keyboard Shortcuts ----
document.addEventListener('keydown', function (e) {
  // Only when not in input
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

  if (e.key === '1') showPage('dashboard');
  if (e.key === '2') showPage('tasks');
  if (e.key === '3') showPage('notes');
  if (e.key === '4') showPage('calendar');
  if (e.key === '5') showPage('analytics');
  if (e.key === '6') showPage('settings');
});

// ---- Confirm Dialog ----
function confirmAction(message, callback) {
  if (window.confirm(message)) callback();
}

// ---- Format Date ----
window.formatDate = function (dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ---- Escape HTML ----
window.escapeHtml = function (str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};