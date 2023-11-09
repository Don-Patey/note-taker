const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(JSON.parse(data));
    });
});

// ID generator
const generateId = () => {
    return Math.floor((1 + Math.random()) * 10000).toString(15).substring(1);
};

// Create and push a new note into the notes array
app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        const notes = JSON.parse(data);
        const newNoteId = generateId();
        const newNote = {
            title: req.body.title,
            text: req.body.text,
            id: newNoteId,
        };
        notes.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.json(newNote);
        });
    });
});

// Delete a note
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        const notes = JSON.parse(data);
        const newNotes = notes.filter((note) => note.id !== req.params.id);
        fs.writeFile('./db/db.json', JSON.stringify(newNotes, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.json(newNotes);
        });
    });
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
