// ============================================
// TaskNest - Global Search JS
// ============================================

function globalSearch() {
  const input    = document.getElementById('globalSearchInput');
  const dropdown = document.getElementById('searchDropdown');
  if (!input || !dropdown) return;

  const query = input.value.trim().toLowerCase();

  if (!query) {
    dropdown.classList.remove('show');
    dropdown.innerHTML = '';
    return;
  }

  const tasks = getTasks().filter(t =>
    t.text.toLowerCase().includes(query)
  );

  const notes = getNotes().filter(n =>
    n.title.toLowerCase().includes(query) ||
    n.content.toLowerCase().includes(query) ||
    n.tags.some(t => t.toLowerCase().includes(query))
  );

  const results = [
    ...tasks.map(t => ({ type: 'task', label: t.text, sub: t.priority + ' priority', page: 'tasks' })),
    ...notes.map(n => ({ type: 'note', label: n.title, sub: n.content.slice(0, 60), page: 'notes' })),
  ];

  if (results.length === 0) {
    dropdown.innerHTML = `
      <div style="padding:16px;text-align:center;color:var(--text-muted);font-size:13px">
        No results for "<strong>${escapeHtml(query)}</strong>"
      </div>`;
  } else {
    dropdown.innerHTML = results.slice(0, 8).map(r => `
      <div class="search-result-item" onclick="goToSearchResult('${r.page}'); document.getElementById('searchDropdown').classList.remove('show');">
        <span class="search-result-type ${r.type}">${r.type}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:500;color:var(--text-primary)">${highlightMatch(escapeHtml(r.label), query)}</div>
          ${r.sub ? `<div style="font-size:11px;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(r.sub)}</div>` : ''}
        </div>
      </div>
    `).join('');
  }

  dropdown.classList.add('show');
}

function goToSearchResult(page) {
  showPage(page);
  const input = document.getElementById('globalSearchInput');
  if (input) input.value = '';
}

function highlightMatch(text, query) {
  const idx = text.toLowerCase().indexOf(query);
  if (idx === -1) return text;
  return text.slice(0, idx)
    + `<mark style="background:rgba(124,58,237,0.3);color:var(--accent-light);border-radius:3px;padding:0 2px">${text.slice(idx, idx + query.length)}</mark>`
    + text.slice(idx + query.length);
}

// Keyboard shortcut: Ctrl+K or Cmd+K to focus search
document.addEventListener('keydown', function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const input = document.getElementById('globalSearchInput');
    if (input) input.focus();
  }
  if (e.key === 'Escape') {
    const dropdown = document.getElementById('searchDropdown');
    if (dropdown) dropdown.classList.remove('show');
    const input = document.getElementById('globalSearchInput');
    if (input) input.blur();
  }
});
