const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs').promises; // Use promises version for async file operations
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', async (req, res) => {
    try {
        const data = await fs.readFile('./db/db.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const generateId = () => {
    return Math.floor((1 + Math.random()) * 10000).toString(16).substring(1);
};

app.post('/api/notes', async (req, res) => {
    try {
        const data = await fs.readFile('./db/db.json', 'utf8');
        let allNotes = JSON.parse(data);
        let newNoteId = generateId();
        let newNote = {
            title: req.body.title,
            text: req.body.text,
            id: newNoteId,
        };
        allNotes.push(newNote);
        await fs.writeFile('./db/db.json', JSON.stringify(allNotes), 'utf8');
        res.json(allNotes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/notes/:id', async (req, res) => {
    try {
        const data = await fs.readFile('./db/db.json', 'utf8');
        const notes = JSON.parse(data);
        const newNotes = notes.filter((note) => note.id !== req.params.id);
        await fs.writeFile('./db/db.json', JSON.stringify(newNotes, null, 2), 'utf8');
        res.json(newNotes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
