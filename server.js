const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
const port = 3000;

app.use(cors());
// app.use(bodyParser());

let messages = [{ user: 'Tom', text: 'hello world from the backend' }, { user: 'Jerry', text: 'hello world from Node' }];
let users = [{ username: 'Tom', password: '123', id: 0 }, { username: 'Jerry', password: '123', id: 1 }];


app.get('/messages', (req, res) => {
    res.send(messages);
});
app.get('/messages/:id', (req, res) => {
    console.log('este es id en el backend', req.params.id);
    res.send(messages[req.params.id]);
});

app.post('/messages', (req, res) => {
    const token = req.header('Authorization');
    let theCurrentUserId = jwt.decode(token, '123');
    let theName = users[theCurrentUserId].username;
    let msg = req.body.text;
    let msgWithUser = { user: theName, text: msg };
    messages.push(msgWithUser);
    console.log('messages', messages);
    res.send(msgWithUser);
});

app.post('/register', (req, res) => {
    let registerData = req.body;
    let nextId = users.push(registerData);
    let id = nextId - 1;
    let token = jwt.sign(id, '123');
    res.send(token);
});

app.post('/login', (req, res) => {
    let loginData = req.body;
    let username = loginData.username;
    let userId = users.indexOf(users.find(ele => ele.username === username));
    if (userId == -1) {
        return res.status(401).send({ message: "Username or passwor invalid, please try again" });

    }
    if (users[userId].password != loginData.password) {
        return res.status(401).send({ message: "Username or passwor invalid, please try again" });

    }

    let token = jwt.sign(userId, '123');
    res.send(token);
});

app.listen(port, () => console.log('up and running!'));

