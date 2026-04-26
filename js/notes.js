// ============================================
// TaskNest - Notes JS
// ============================================

let noteSearchQuery = '';

// ---- Data ----
function getNotes() {
  return JSON.parse(localStorage.getItem('tasknest_notes') || '[]');
}

function saveNotes(notes) {
  localStorage.setItem('tasknest_notes', JSON.stringify(notes));
}

// ---- Add Note ----
function addNote() {
  const titleEl   = document.getElementById('noteTitle');
  const contentEl = document.getElementById('noteContent');
  const tagsEl    = document.getElementById('noteTags');

  const title   = titleEl   ? titleEl.value.trim()   : '';
  const content = contentEl ? contentEl.value.trim() : '';
  const tagsRaw = tagsEl    ? tagsEl.value.trim()    : '';

  if (!title && !content) {
    showToast('Note needs a title or content!', 'error');
    return;
  }

  const tags = tagsRaw
    ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  const note = {
    id:        Date.now(),
    title:     title || 'Untitled',
    content:   content,
    tags:      tags,
    pinned:    false,
    color:     getRandomNoteColor(),
    createdAt: new Date().toISOString(),
  };

  const notes = getNotes();
  notes.unshift(note);
  saveNotes(notes);

  if (titleEl)   titleEl.value   = '';
  if (contentEl) contentEl.value = '';
  if (tagsEl)    tagsEl.value    = '';

  renderNotes();
  showToast('Note saved! 📝', 'success');
}

// ---- Toggle Pin ----
function togglePinNote(id) {
  const notes = getNotes();
  const note  = notes.find(n => n.id === id);
  if (!note) return;

  note.pinned = !note.pinned;
  saveNotes(notes);
  renderNotes();
  showToast(note.pinned ? 'Note pinned! 📌' : 'Note unpinned.', 'info');
}

// ---- Delete Note ----
function deleteNote(id) {
  const notes = getNotes().filter(n => n.id !== id);
  saveNotes(notes);
  renderNotes();
  showToast('Note deleted.', 'info');
}

// ---- Edit Note ----
function editNote(id) {
  const notes = getNotes();
  const note  = notes.find(n => n.id === id);
  if (!note) return;

  const overlay = document.getElementById('editNoteModal');
  if (!overlay) return;

  document.getElementById('editNoteTitle').value   = note.title;
  document.getElementById('editNoteContent').value = note.content;
  document.getElementById('editNoteTags').value    = note.tags.join(', ');
  document.getElementById('editNoteSaveBtn').onclick = () => saveEditNote(id);

  overlay.classList.add('open');
}

function saveEditNote(id) {
  const notes = getNotes();
  const note  = notes.find(n => n.id === id);
  if (!note) return;

  note.title   = document.getElementById('editNoteTitle').value.trim() || 'Untitled';
  note.content = document.getElementById('editNoteContent').value.trim();
  const tagsRaw = document.getElementById('editNoteTags').value.trim();
  note.tags    = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

  saveNotes(notes);
  closeModal();
  renderNotes();
  showToast('Note updated! ✏️', 'success');
}

// ---- Search ----
function searchNotes() {
  const q = document.getElementById('noteSearchInput');
  noteSearchQuery = q ? q.value.toLowerCase() : '';
  renderNotes();
}

// ---- Render ----
function renderNotes() {
  const grid = document.getElementById('notesList');
  if (!grid) return;

  let notes = getNotes();

  // Filter by search
  if (noteSearchQuery) {
    notes = notes.filter(n =>
      n.title.toLowerCase().includes(noteSearchQuery) ||
      n.content.toLowerCase().includes(noteSearchQuery) ||
      n.tags.some(t => t.toLowerCase().includes(noteSearchQuery))
    );
  }

  // Pinned first
  notes.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  if (notes.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">📓</div>
        <div class="empty-title">${noteSearchQuery ? 'No notes found' : 'No notes yet'}</div>
        <div class="empty-desc">${noteSearchQuery ? 'Try a different search term' : 'Create your first note!'}</div>
      </div>`;
    return;
  }

  grid.innerHTML = notes.map(note => `
    <div class="note-card ${note.pinned ? 'pinned' : ''}">
      ${note.pinned ? '<span class="note-pin">📌</span>' : ''}
      <div class="note-title">${escapeHtml(note.title)}</div>
      <div class="note-content">${escapeHtml(note.content) || '<em style="color:var(--text-muted)">No content</em>'}</div>
      ${note.tags.length ? `
        <div class="note-tags">
          ${note.tags.map(t => `<span class="note-tag">#${escapeHtml(t)}</span>`).join('')}
        </div>` : ''}
      <div class="note-footer">
        <span class="note-time">${formatTimeAgo(note.createdAt)}</span>
        <div class="note-actions">
          <button class="btn btn-ghost btn-icon btn-sm" onclick="togglePinNote(${note.id})" title="${note.pinned ? 'Unpin' : 'Pin'}">
            ${note.pinned ? '📍' : '📌'}
          </button>
          <button class="btn btn-ghost btn-icon btn-sm" onclick="editNote(${note.id})" title="Edit">✏️</button>
          <button class="btn btn-ghost btn-icon btn-sm" onclick="deleteNote(${note.id})" title="Delete" style="color:var(--rose)">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ---- Helpers ----
function formatTimeAgo(isoStr) {
  if (!isoStr) return '';
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30)  return `${days}d ago`;
  return new Date(isoStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getRandomNoteColor() {
  const colors = ['purple', 'cyan', 'emerald', 'amber', 'rose'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Enter key shortcut for note title
document.addEventListener('DOMContentLoaded', () => {
  const noteTitleInput = document.getElementById('noteTitle');
  if (noteTitleInput) {
    noteTitleInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const contentEl = document.getElementById('noteContent');
        if (contentEl) contentEl.focus();
      }
    });
  }
});
