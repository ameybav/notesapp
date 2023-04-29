const saveButton = document.querySelector('#btnSave');
const deleteButton = document.querySelector('#btnDelete');
const titleInput = document.querySelector('#title');
const descriptionInput = document.querySelector('#description');
const notesContainer = document.querySelector('#notes__container');



function addNote(title, description) {
    const body = {
        title: title,
        description: description,
        isVisible: true
    }
    fetch('https://localhost:7197/api/Notes', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }
    })
    .then(data => data.json())
    .then(response => getAllNotes());
};

function clearForm() {
    titleInput.value = '';
    descriptionInput.value = '';
    deleteButton.classList.add('hidden');
}

function displayNoteInForm(note) {
    titleInput.value = note.title;
    descriptionInput.value = note.description;
    deleteButton.classList.remove('hidden');
    deleteButton.setAttribute('data-id', note.id);
    saveButton.setAttribute('data-id', note.id);
}

function getNoteById(id) {
    fetch(`https://localhost:7197/api/Notes/${id}`)
        .then(data => data.json())
        .then(response => displayNoteInForm(response));
}

function populateForm(id) {
    getNoteById(id);

}

function updateNote(id, title, description) {
    const body = {
        title: title,
        description: description,
        isVisible: true
    }
    fetch(`https://localhost:7197/api/Notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }
    })
    .then(data => data.json())
    .then(response => {
        clearForm();
        getAllNotes();
    })
}

function displayNotes(notes) {
    let allNotes = '';

    notes.forEach(note => {
        const noteElement = `
            <div class="note" data-id="${note.id}">
                <h3>${note.title}</h3>
                <p>${note.description}</p>
            </div>
            `;
            allNotes+=noteElement
    });
    notesContainer.innerHTML = allNotes;

    document.querySelectorAll('.note').forEach(note => {
        note.addEventListener('click', function() {
            populateForm(note.dataset.id);
        });
    })
}

function getAllNotes() {
    fetch('https://localhost:7197/api/Notes', {
        method: 'GET',
    })
    .then(data => data.json())
    .then(response => displayNotes(response));

}

function clearForm() {
    titleInput.value = '';
    descriptionInput.value = '';
}
getAllNotes();

function deleteNote(id) {
    fetch(`https://localhost:7197/api/Notes/${id}`, {
        method: 'DELETE',
        headers: {
            "content-type": "application/json"
        }
    })
    .then(data => data.json())
    .then(response => {
        getAllNotes();
        clearForm();
    });
}

saveButton.addEventListener('click', function() {
    const id = saveButton.dataset.id;
    if (id) {
        updateNote(id, title.value, descriptionInput.value);
    }
    else addNote(title.value, descriptionInput.value);
    clearForm();
});

deleteButton.addEventListener('click', function() {
    const id = deleteButton.dataset.id;
    deleteNote(id);
});