/* GLOBAL SEARCH */
function globalSearch() {
  const query = document.getElementById("globalSearch").value.toLowerCase();

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const notes = JSON.parse(localStorage.getItem("notes")) || [];

  const resultsDiv = document.getElementById("searchResults");

  if (!query) {
    resultsDiv.innerHTML = "";
    return;
  }

  let results = [];

  /* SEARCH TASKS */
  tasks.forEach(t => {
    if (t.text.toLowerCase().includes(query)) {
      results.push({
        type: "Task",
        title: t.text
      });
    }
  });

  /* SEARCH NOTES */
  notes.forEach(n => {
    if (
      n.title.toLowerCase().includes(query) ||
      n.content.toLowerCase().includes(query)
    ) {
      results.push({
        type: "Note",
        title: n.title
      });
    }
  });

  /* RENDER */
  resultsDiv.innerHTML = results.length
    ? results.map(r => `
        <div class="search-item">
          <strong>[${r.type}]</strong> ${highlight(r.title, query)}
        </div>
      `).join("")
    : `<p>No results found</p>`;
}

/* HIGHLIGHT MATCH */
function highlight(text, query) {
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, `<mark>$1</mark>`);
}

/* TAG FILTER */
function filterByTag(tag) {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const resultsDiv = document.getElementById("searchResults");

  const filtered = notes.filter(n =>
    n.tags.map(t => t.trim().toLowerCase()).includes(tag.toLowerCase())
  );

  resultsDiv.innerHTML = filtered.length
    ? filtered.map(n => `
        <div class="search-item">
          <strong>[Note]</strong> ${n.title}
        </div>
      `).join("")
    : `<p>No notes with tag "${tag}"</p>`;
}

/* GENERATE TAG BUTTONS */
function loadTags() {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const container = document.getElementById("searchResults");

  let allTags = [];

  notes.forEach(n => {
    allTags.push(...n.tags);
  });

  const uniqueTags = [...new Set(allTags)];

  const tagHTML = uniqueTags.map(tag => `
    <span class="tag-filter" onclick="filterByTag('${tag}')">
      #${tag}
    </span>
  `).join("");

  container.innerHTML = `
    <h6>Filter by Tags:</h6>
    ${tagHTML}
  `;
}

/* LOAD TAGS INIT */
loadTags();