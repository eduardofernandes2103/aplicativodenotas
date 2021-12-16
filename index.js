import express from 'express';
import { v4 as uuidv4 } from 'uuid'

const app = express();

app.use(express.json());

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

app.patch('/users/:cpf', (req, res) => {
    const { cpf } = req.params;

    const userIndex = USERS.findIndex(user => user.cpf === cpf);

    if(userIndex === -1){
        return res.status(404).send({message: "This User doesn't exist"})
    }

    USERS[userIndex] = { ...USERS[userIndex], ...req.body };

    res.json({
        messagem: "User is updated",
        users: [
            USERS[userIndex]
        ]
    })
});

app.delete('/users/:cpf', (req, res) => {
    const { cpf } = req.params;

    const userIndex = USERS.findIndex(user => user.cpf === cpf);

    if(userIndex === -1){
        return res.status(404).send({message: "This User doesn't exist"})
    }

    USERS.splice(userIndex,1)

    res.json({
        "messagem": "User is deleted",
        "users": []
      })
});

app.post('/users/:cpf/notes', (req, res) => {
    const { cpf } = req.params;

    const userIndex = USERS.findIndex(user => user.cpf === cpf);

    if(userIndex === -1){
        return res.status(404).send({message: "This User doesn't exist"})
    }

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

app.get('/users/:cpf/notes', (req, res) => {
    const { cpf } = req.params;

    const user = USERS.find(user => user.cpf === cpf);

    if(user === undefined) {
       return res.status(404).send({message: "This User doesn't exist"})
    }

    res.json(user.notes)
});

app.listen(3000, () => {})