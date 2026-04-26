// ============================================
// TaskNest - Tasks JS
// ============================================

let currentFilter = 'all';

// ---- Data Helpers ----
function getTasks() {
  return JSON.parse(localStorage.getItem('tasknest_tasks') || '[]');
}

function saveTasks(tasks) {
  localStorage.setItem('tasknest_tasks', JSON.stringify(tasks));
}

// ---- Add Task ----
function addTask() {
  const textEl  = document.getElementById('taskInput');
  const priEl   = document.getElementById('taskPriority');
  const dateEl  = document.getElementById('taskDeadline');
  const catEl   = document.getElementById('taskCategory');

  const text = textEl ? textEl.value.trim() : '';
  if (!text) { showToast('Please enter a task!', 'error'); return; }

  const task = {
    id:        Date.now(),
    text:      text,
    priority:  priEl ? priEl.value : 'Medium',
    deadline:  dateEl ? dateEl.value : '',
    category:  catEl ? catEl.value : 'General',
    completed: false,
    createdAt: new Date().toISOString(),
  };

  const tasks = getTasks();
  tasks.unshift(task);
  saveTasks(tasks);

  if (textEl)  textEl.value  = '';
  if (dateEl)  dateEl.value  = '';
  if (priEl)   priEl.value   = 'Medium';
  if (catEl)   catEl.value   = 'General';

  renderTasks();
  renderDashboardStats();
  renderTodayTasks();
  updateProgressRing();
  updateNavBadge();
  showToast('Task added! 🎯', 'success');
}

// ---- Toggle Complete ----
function toggleTask(id) {
  const tasks = getTasks();
  const task  = tasks.find(t => t.id === id);
  if (!task) return;

  task.completed = !task.completed;
  task.completedDate = task.completed ? new Date().toDateString() : null;

  saveTasks(tasks);
  renderTasks();
  renderDashboardStats();
  updateProgressRing();
  renderTodayTasks();
  updateNavBadge();

  if (task.completed) showToast('Task completed! ✅', 'success');
}

// ---- Delete Task ----
function deleteTask(id) {
  const tasks = getTasks().filter(t => t.id !== id);
  saveTasks(tasks);
  renderTasks();
  renderDashboardStats();
  updateProgressRing();
  renderTodayTasks();
  updateNavBadge();
  showToast('Task deleted.', 'info');
}

// ---- Edit Task ----
function editTask(id) {
  const tasks = getTasks();
  const task  = tasks.find(t => t.id === id);
  if (!task) return;

  openEditModal(task);
}

function saveEditTask(id) {
  const tasks = getTasks();
  const task  = tasks.find(t => t.id === id);
  if (!task) return;

  const textEl = document.getElementById('editTaskText');
  const priEl  = document.getElementById('editTaskPriority');
  const dateEl = document.getElementById('editTaskDeadline');
  const catEl  = document.getElementById('editTaskCategory');

  task.text     = textEl ? textEl.value.trim() : task.text;
  task.priority = priEl  ? priEl.value  : task.priority;
  task.deadline = dateEl ? dateEl.value : task.deadline;
  task.category = catEl  ? catEl.value  : task.category;

  saveTasks(tasks);
  closeModal();
  renderTasks();
  renderDashboardStats();
  renderTodayTasks();
  updateProgressRing();
  showToast('Task updated! ✏️', 'success');
}

// ---- Filter ----
function filterTasks(filter) {
  currentFilter = filter;

  document.querySelectorAll('.task-filter-pill').forEach(p => p.classList.remove('active'));
  const activePill = document.querySelector(`.task-filter-pill[data-filter="${filter}"]`);
  if (activePill) activePill.classList.add('active');

  renderTasks();
}

// ---- Render ----
function renderTasks() {
  const list = document.getElementById('taskList');
  if (!list) return;

  let tasks = getTasks();

  // Apply filter
  if (currentFilter === 'completed') tasks = tasks.filter(t => t.completed);
  if (currentFilter === 'pending')   tasks = tasks.filter(t => !t.completed);
  if (currentFilter === 'high')      tasks = tasks.filter(t => t.priority === 'High');
  if (currentFilter === 'today') {
    const today = new Date().toISOString().split('T')[0];
    tasks = tasks.filter(t => t.deadline === today);
  }

  // Sort: pending first, then by priority
  const priOrder = { High: 0, Medium: 1, Low: 2 };
  tasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return (priOrder[a.priority] || 1) - (priOrder[b.priority] || 1);
  });

  if (tasks.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <div class="empty-title">No tasks here</div>
        <div class="empty-desc">Add your first task to get started!</div>
      </div>`;
    return;
  }

  const today = new Date().toISOString().split('T')[0];

  list.innerHTML = tasks.map(task => {
    const isOverdue = task.deadline && task.deadline < today && !task.completed;
    const dateLabel = task.deadline
      ? (task.deadline === today ? '📅 Today' : formatDate(task.deadline))
      : '';

    return `
      <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
        <button class="task-check" onclick="toggleTask(${task.id})" title="Toggle complete">
          ${task.completed ? '✓' : ''}
        </button>
        <div style="flex:1;min-width:0">
          <div class="task-text">${escapeHtml(task.text)}</div>
          ${task.category ? `<div style="font-size:11px;color:var(--text-muted);margin-top:2px">${task.category}</div>` : ''}
        </div>
        <div class="task-meta">
          <span class="priority-badge ${task.priority.toLowerCase()}">${task.priority}</span>
          ${dateLabel ? `<span class="task-date ${isOverdue ? 'overdue' : ''}">${isOverdue ? '⚠️' : ''} ${dateLabel}</span>` : ''}
          <div class="task-actions">
            <button class="btn btn-ghost btn-icon btn-sm" onclick="editTask(${task.id})" title="Edit">✏️</button>
            <button class="btn btn-ghost btn-icon btn-sm" onclick="deleteTask(${task.id})" title="Delete" style="color:var(--rose)">🗑️</button>
          </div>
        </div>
      </li>`;
  }).join('');
}

// ---- Edit Modal ----
function openEditModal(task) {
  const overlay = document.getElementById('editTaskModal');
  if (!overlay) return;

  document.getElementById('editTaskText').value     = task.text;
  document.getElementById('editTaskPriority').value = task.priority;
  document.getElementById('editTaskDeadline').value = task.deadline || '';
  document.getElementById('editTaskCategory').value = task.category || 'General';
  document.getElementById('editSaveBtn').onclick    = () => saveEditTask(task.id);

  overlay.classList.add('open');
}

function closeModal() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
}

// ---- Nav Badge ----
function updateNavBadge() {
  const pending = getTasks().filter(t => !t.completed).length;
  const badge = document.getElementById('taskNavBadge');
  if (badge) badge.textContent = pending;
}

// ---- Helpers ----
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Enter key shortcut for task input
document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  if (taskInput) {
    taskInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') addTask();
    });
  }
});

