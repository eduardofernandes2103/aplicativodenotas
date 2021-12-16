import express from 'express';
import { v4 as uuidv4 } from 'uuid'

const app = express();

app.use(express.json());

const verifyCpfIndex = (req, res, next) => {
    const { cpf } = req.params;

    const userIndex = USERS.findIndex(user => user.cpf === cpf);

    if(userIndex === -1){
        return res.status(404).send({message: "This User doesn't exist"})
    }

    next();
}

const USERS = []

app.post('/users', (req, res) => {
    const {name, cpf} = req.body
    const notes = []
    const id = uuidv4();
    const user = {
        id,
        name,
        cpf,
        notes
    }

    USERS.push(user)

    res.status(201).json(user)
});

app.get('/users', (req, res) => {
    res.json(USERS)
});

app.patch('/users/:cpf', verifyCpfIndex, (req, res) => {
    const { cpf } = req.params;

    const userIndex = USERS.findIndex(user => user.cpf === cpf);

    USERS[userIndex] = { ...USERS[userIndex], ...req.body };

    res.json({
        messagem: "User is updated",
        users: [
            USERS[userIndex]
        ]
    })
});

app.delete('/users/:cpf', verifyCpfIndex, (req, res) => {
    const { cpf } = req.params;

    const userIndex = USERS.findIndex(user => user.cpf === cpf);

    USERS.splice(userIndex,1)

    res.json({
        "messagem": "User is deleted",
        "users": []
      })
});

app.post('/users/:cpf/notes', verifyCpfIndex, (req, res) => {
    const { cpf } = req.params;

    const userIndex = USERS.findIndex(user => user.cpf === cpf);

    const {title, content} = req.body
    const id = uuidv4();
    const note = {
        id,
        title,
        content
    }

    USERS[userIndex].notes.push(note)
    res.json({
        message: `${title} was added into ${USERS[userIndex].name}'s notes`
    })
});

app.get('/users/:cpf/notes', verifyCpfIndex, (req, res) => {
    const { cpf } = req.params;

    const userIndex = USERS.findIndex(user => user.cpf === cpf);

    const userNotes = USERS[userIndex].notes

    res.json(userNotes)
});

app.patch('/users/:cpf/notes/:id', verifyCpfIndex, (req, res) => {
    const { cpf } = req.params;
    const { id } = req.params

    const userIndex = USERS.findIndex(user => user.cpf === cpf);
    const noteIndex = USERS[userIndex].notes.findIndex(note => note.id === id)

    if(noteIndex === -1){
        return res.status(404).send({message: "This User doesn't exist"})
    }

    USERS[userIndex].notes[noteIndex] = { ...USERS[userIndex].notes[noteIndex], ...req.body }

    res.json( USERS[userIndex].notes[noteIndex])

});

app.delete('/users/:cpf/notes/:id', verifyCpfIndex, (req, res) => {
    const { cpf } = req.params;
    const { id } = req.params

    const userIndex = USERS.findIndex(user => user.cpf === cpf);
    const noteIndex = USERS[userIndex].notes.findIndex(note => note.id === id)

    USERS[userIndex].notes.splice(noteIndex,1)

    res.json([])
});

app.listen(3000, () => {})