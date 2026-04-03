const express = require('express');
const { Redis } = require('@upstash/redis');

const app = express();
const redis = Redis.fromEnv(); // env file se URL and token lega

app.use(express.json());
app.use(express.static('public'));

// Get all todos
app.get('/todos', async (req, res) => {
  const todos = await redis.get('todos') || [];
  res.json(todos);
});

// Add todo
app.post('/todos', async (req, res) => {
  const { text } = req.body;
  const todos = await redis.get('todos') || [];
  const newTodo = { id: Date.now(), text, done: false };
  todos.push(newTodo);
  await redis.set('todos', todos);
  res.json(newTodo);
});

// Delete todo
app.delete('/todos/:id', async (req, res) => {
  let todos = await redis.get('todos') || [];
  todos = todos.filter(t => t.id != req.params.id);
  await redis.set('todos', todos);
  res.json({ success: true });
});

app.listen(3000, () => console.log('Server on http://localhost:3000'));