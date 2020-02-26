const express = require('express');

const app = express();

app.use(express.json());

const database = {
  users: [
    {
      id: 1,
      name: 'Joe',
      email: 'joe@test.com',
      password: 'football',
      entries: 0,
      joined: new Date()
    },
    {
      id: 2,
      name: 'Joanna',
      email: 'joanna@test.com',
      password: 'password',
      entries: 0,
      joined: new Date()
    }
  ]
};

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json('success');
  } else {
    res.status(400).json('error logging in');
  }
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const id = database.users[database.users.length - 1].id + 1;
  database.users.push({
    id: id,
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  });
  res.json(database.users[database.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  const user = database.users.filter(user => user.id === Number(id));
  if (user) {
    return res.json(user);
  }
  res.status(400).json('not found');
});

app.post('/image', (req, res) => {
  const { id } = req.body;
  const user = database.users.filter(user => user.id === Number(id));
  if (user) {
    user[0].entries++;
    return res.json(user[0].entries);
  }
  res.status(400).json('not found');
});

app.listen(3000, () => {
  console.log('app running on port 3000');
});
