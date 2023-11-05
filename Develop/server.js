const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3000;

//this is the middleware  
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
//this is the listener

//this is the route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'notes.html'))
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data))
    })
});
//this is the post route


// id generator
let generateId = () => {   
    return Math.floor((1 + Math.random()) * 10000).toString(15).substring(1);}


//creating notes & pushing new note into all notes array    
app.post('/api/notes', (req, res) => {
    fs.readFile('/db/db.json', (err, data) => {
        if (err) {
            res.status(500).json({ error: err })
        } else {
            let notes = JSON.parse(data)
            let newNoteid = generateId()
            let newNote = {
                title:req.body.title,
                text: req.body.text,
                id.newNoteid
            }
            notes.push(newNote)
            fs.writeFile('/db/db.json', JSON.stringify(notes), null, 2, (err) => {
                if (err) {
                    res.status(500).json({ error: err })
                } else {
                    res.json(newNote)
                }
            })
        }
    })})

//this is the delete route
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('/db/db.json', (err, data) => {
        if (err) {
            res.status(500).json({ error: err })
        } else {
            let notes = JSON.parse(data)
            let newNotes = notes.filter(note => note.id !== req.params.id)
            fs.writeFile('/db/db.json', JSON.stringify(newNotes), null, 2, (err) => {
                if (err) {
                    res.status(500).json({ error: err })
                } else {
                    res.json(newNotes)
                }
            })
        }
    })
})

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));