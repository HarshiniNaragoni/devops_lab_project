const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// In-memory store (resets when the app restarts)
let students = [];
let nextId = 1;

function resetStore() {
  students = [];
  nextId = 1;
}

function validate(body) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const course = typeof body.course === 'string' ? body.course.trim() : '';
  const year = Number(body.year);

  if (!name || !email || !course || body.year === undefined || body.year === '') {
    return { error: 'name, email, course and year are required' };
  }
  if (!Number.isInteger(year) || year < 1 || year > 6) {
    return { error: 'year must be a whole number between 1 and 6' };
  }
  return { value: { name, email, course, year } };
}

app.get('/health', (req, res) => {
  res.json({ status: 'UP', app: 'Campus Records Hub' });
});

app.get('/api/students', (req, res) => {
  res.json(students);
});

app.get('/api/students/:id', (req, res) => {
  const student = students.find((s) => s.id === Number(req.params.id));
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

app.post('/api/students', (req, res) => {
  const { error, value } = validate(req.body || {});
  if (error) return res.status(400).json({ error });
  const student = { id: nextId++, ...value };
  students.push(student);
  res.status(201).json(student);
});

app.put('/api/students/:id', (req, res) => {
  const index = students.findIndex((s) => s.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Student not found' });
  const { error, value } = validate(req.body || {});
  if (error) return res.status(400).json({ error });
  students[index] = { id: students[index].id, ...value };
  res.json(students[index]);
});

app.delete('/api/students/:id', (req, res) => {
  const index = students.findIndex((s) => s.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Student not found' });
  students.splice(index, 1);
  res.status(204).send();
});

module.exports = { app, resetStore };
