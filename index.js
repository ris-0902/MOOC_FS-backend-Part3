const express = require('express')
const app = express()
const cors = require(cors)
app.use(cors())
app.use(express.json())

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

const requestLogger = (req, res, next) => {
    console.log('Method: ', req.method);
    console.log('Path:   ', req.path);
    console.log('Body:   ', req.body);
    next()
}
app.use(requestLogger)

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>')
})
app.get('/api/notes', (req, res) => {
    res.json(notes)
})
app.get('/api/notes/:id', (req, res) => {
    const id = req.params.id
    const note = notes.find(n => n.id.toString() === id.toString())
    if (note) res.json(note)
    else res.status(404).end()
})

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id
    notes = notes.filter(n => n.id != id)
    res.status(204).end()
})

app.post('/api/notes', (req, res) => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    const body = req.body

    if (!body.content) {
        return res.status(400).json({
            error: "Missing content"
        })
    }
    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: maxId + 1
    }
    note.id = maxId + 1
    notes = notes.concat(note)
    res.json(note)
})
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
})