const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const taskFilePath = path.join(__dirname, 'task.json');
let initialTasks = [];
try {
  const fileContent = fs.readFileSync(taskFilePath, 'utf-8');
  if (fileContent.trim()) {
    initialTasks = JSON.parse(fileContent).tasks || [];
  }
} catch (err) {
  console.warn('Could not read or parse task.json, starting with empty tasks:', err.message);
  initialTasks = [];
}
let tasks = [...initialTasks];
let nextId = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isValidTaskPayload = (payload) =>
  payload &&
  typeof payload.title === 'string' &&
  typeof payload.description === 'string' &&
  typeof payload.completed === 'boolean';

const findTaskById = (id) => tasks.find((task) => task.id === id);

app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = findTaskById(id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(200).json(task);
});

app.post('/tasks', (req, res) => {
  if (!isValidTaskPayload(req.body)) {
    return res.status(400).json({ error: 'Invalid task data' });
  }

  const newTask = {
    id: nextId++,
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = findTaskById(id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (req.body.title !== undefined) {
    if (typeof req.body.title !== 'string') {
      return res.status(400).json({ error: 'Invalid task data' });
    }
    task.title = req.body.title;
  }
  if (req.body.description !== undefined) {
    if (typeof req.body.description !== 'string') {
      return res.status(400).json({ error: 'Invalid task data' });
    }
    task.description = req.body.description;
  }
  if (req.body.completed !== undefined) {
    if (typeof req.body.completed !== 'boolean') {
      return res.status(400).json({ error: 'Invalid task data' });
    }
    task.completed = req.body.completed;
  }

  res.status(200).json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(index, 1);
  res.status(200).json({ message: 'Task deleted' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

if (require.main === module) {
  app.listen(port, (err) => {
    if (err) {
      return console.error('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
  });
}

module.exports = app;
