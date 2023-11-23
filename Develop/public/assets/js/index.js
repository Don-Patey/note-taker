const noteTitle = document.querySelector('.note-title');
const noteText = document.querySelector('.note-textarea');
const saveNoteBtn = document.querySelector('.save-note');
const newNoteBtn = document.querySelector('.new-note');
const noteList = document.querySelectorAll('.list-container .list-group');

const activeNote = {};

const show = (elem) => {
    elem.style.display = 'inline';
};

const hide = (elem) => {
    elem.style.display = 'none';
};

const createLi = (title) => {
    const li = document.createElement('li');
    li.textContent = title;
    return li;
};

const createNoNotesEL = () => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'text-center');
    li.textContent = 'No saved Notes';
    return li;
};

const getNotes = () => {
    fetch('/api/notes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((response) => response.json())
    .then((data) => {
        renderNoteList(data);
    });
};

const deleteNote = (id) => {
    return fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(() => {
        getNotes();
        renderActiveNote();
    });
};

const saveNote = () => {
    const newNote = {
        title: noteTitle.value,
        text: noteText.value,
    };
    return fetch('/api/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
    })
    .then(() => {
        getNotes();
        renderActiveNote();
    });
};

const renderActiveNote = () => {
    hide(saveNoteBtn);
    show(newNoteBtn);

    if (activeNote.id) {
        noteTitle.setAttribute('readonly', true);
        noteText.setAttribute('readonly', true);
        noteTitle.value = activeNote.title;
        noteText.value = activeNote.text;
    } else {
        noteTitle.removeAttribute('readonly');
        noteText.removeAttribute('readonly');
        noteTitle.value = '';
        noteText.value = '';
    }
};

const handleNoteSave = () => {
    saveNote();
};

const handleNoteDelete = (e) => {
    e.stopPropagation();

    const note = e.target;
    const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

    if (activeNote.id === noteId) {
        activeNote = {};
    }

    deleteNote(noteId);
};

const handleNoteView = (e) => {
    e.preventDefault();
    const clickedElement = e.target.closest('li');
    if (clickedElement) {
        console.log(clickedElement);
        console.log(clickedElement.dataset.note);
        activeNote = JSON.parse(clickedElement.dataset.note);
        renderActiveNote();

}};
  
   
const handleNewNoteView = () => {
    activeNote = {};
    renderActiveNote();
};

const handleRenderSaveBtn = () => {
    if (!noteTitle.value.trim() || !noteText.value.trim()) {
        hide(saveNoteBtn);
    } else {
        show(saveNoteBtn);
    }
};

const renderNoteList = async (notes) => {
    if (window.location.pathname === '/notes') {
        noteList.forEach((el) => (el.innerHTML = ''));
    }

    let noteListItems = [];

    if (notes.length === 0) {
        noteListItems.push(createNoNotesEL());
    }

    notes.forEach((note) => {
        const li = createLi(note.title);
        li.dataset.note = JSON.stringify(note);
        noteListItems.push(li);
    });

    if (window.location.pathname === '/notes') {
        noteListItems.forEach((note) => noteList[0].append(note));
    }
};

const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
    saveNoteBtn.addEventListener('click', handleNoteSave);
    newNoteBtn.addEventListener('click', handleNewNoteView);
    noteTitle.addEventListener('keyup', handleRenderSaveBtn);
    noteText.addEventListener('keyup', handleRenderSaveBtn);
    getAndRenderNotes();
}
