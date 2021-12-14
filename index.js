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

app.listen(3000, () => {
    console.log("Running on localhost:3000")
})