const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs').promises; // Using fs.promises for async file operations
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'notes.html'));
});

app.get('/api/notes', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const generateId = () => {
    return Math.floor((1 + Math.random()) * 10000).toString(15).substring(1);
};

app.post('/api/notes', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8');
        const notes = JSON.parse(data);
        const newNoteId = generateId();
        const newNote = {
            title: req.body.title,
            text: req.body.text,
            id: newNoteId,
        };
        notes.push(newNote);
        await fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes, null, 2));
        res.json(newNote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/notes/:id', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8');
        const notes = JSON.parse(data);
        const newNotes = notes.filter((note) => note.id !== req.params.id);
        await fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(newNotes, null, 2));
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
