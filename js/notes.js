let notes = JSON.parse(localStorage.getItem("notes")) || [];
let searchQuery = "";

/* SAVE */
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

/* ADD NOTE */
function addNote() {
  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;
  const tags = document.getElementById("noteTags").value.split(",");

  if (!title || !content) return alert("Fill all fields");

  notes.push({
    id: Date.now(),
    title,
    content,
    tags,
    pinned: false
  });

  saveNotes();
  renderNotes();
}

/* DELETE */
function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  saveNotes();
  renderNotes();
}

/* PIN */
function togglePin(id) {
  notes = notes.map(n =>
    n.id === id ? { ...n, pinned: !n.pinned } : n
  );

  saveNotes();
  renderNotes();
}

/* EDIT */
function editNote(id) {
  const note = notes.find(n => n.id === id);

  document.getElementById("noteTitle").value = note.title;
  document.getElementById("noteContent").value = note.content;
  document.getElementById("noteTags").value = note.tags.join(",");

  deleteNote(id);
}

/* SEARCH */
function searchNotes() {
  searchQuery = document.getElementById("searchNote").value.toLowerCase();
  renderNotes();
}

/* CONVERT TO TASK */
function convertToTask(note) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.push({
    id: Date.now(),
    text: note.title,
    priority: "Medium",
    deadline: "",
    completed: false
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));

  alert("Converted to Task ✅");
}

/* RENDER */
function renderNotes() {
  const container = document.getElementById("notesList");
  const empty = document.getElementById("notesEmpty");

  container.innerHTML = "";

  let filtered = notes.filter(n =>
    n.title.toLowerCase().includes(searchQuery) ||
    n.content.toLowerCase().includes(searchQuery)
  );

  /* PINNED FIRST */
  filtered.sort((a, b) => b.pinned - a.pinned);

  if (filtered.length === 0) {
    empty.innerText = "No notes yet 📝";
    return;
  } else {
    empty.innerText = "";
  }

  filtered.forEach(n => {
    const div = document.createElement("div");

    div.className = `note-card ${n.pinned ? "pinned" : ""}`;

    div.innerHTML = `
      <h6>${n.title}</h6>
      <p>${n.content}</p>

      <div>
        ${n.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
      </div>

      <div class="mt-2">
        <button onclick="togglePin(${n.id})">📌</button>
        <button onclick="editNote(${n.id})">✏️</button>
        <button onclick="deleteNote(${n.id})">🗑</button>
        <button onclick='convertToTask(${JSON.stringify(n)})'>➡️ Task</button>
      </div>
    `;

    container.appendChild(div);
  });
}

/* AUTO SAVE (while typing) */
["noteTitle", "noteContent", "noteTags"].forEach(id => {
  document.getElementById(id).addEventListener("input", () => {
    localStorage.setItem("draft_note", JSON.stringify({
      title: noteTitle.value,
      content: noteContent.value,
      tags: noteTags.value
    }));
  });
});

/* LOAD DRAFT */
(function () {
  const draft = JSON.parse(localStorage.getItem("draft_note"));
  if (draft) {
    noteTitle.value = draft.title;
    noteContent.value = draft.content;
    noteTags.value = draft.tags;
  }
})();

/* INIT */
renderNotes();