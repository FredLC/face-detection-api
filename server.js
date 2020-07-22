const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const postgres = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'root',
    database: 'smart-brain',
  },
});

postgres
  .select('*')
  .from('users')
  .then((data) => {
    console.log(data);
  });

const app = express();

app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: 1,
      name: 'Joe',
      email: 'joe@test.com',
      password: 'football',
      entries: 0,
      joined: new Date(),
    },
    {
      id: 2,
      name: 'Joanna',
      email: 'joanna@test.com',
      password: 'password',
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  bcrypt.compare(
    'joemarambi',
    '$2a$10$1JQbsTRkVQQWLupEtVR6YObMn8DTuVb5gWrQ3XHJGsg4WvicuT3Li',
    function (err, res) {
      console.log('first guess', res);
    }
  );
  bcrypt.compare(
    'veggies',
    '$2a$10$1JQbsTRkVQQWLupEtVR6YObMn8DTuVb5gWrQ3XHJGsg4WvicuT3Li',
    function (err, res) {
      console.log('second guess', res);
    }
  );
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('error logging in');
  }
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const id = database.users[database.users.length - 1].id + 1;

  bcrypt.hash(password, null, null, function (err, hash) {
    if (err) {
      console.log(err);
    }
    console.log(hash);
  });

  database.users.push({
    id: id,
    name: name,
    email: email,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  const user = database.users.filter((user) => user.id === Number(id));
  if (user) {
    return res.json(user);
  }
  res.status(400).json('not found');
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  const user = database.users.filter((user) => user.id === Number(id));
  if (user) {
    user[0].entries++;
    return res.json(user[0].entries);
  }
  res.status(400).json('not found');
});

app.listen(3001, () => {
  console.log('app running on port 3001');
});
