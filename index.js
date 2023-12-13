const express = require('express') 
const cors = require('cors')
const app = express()
const port = 3000

// cors - allow connection from different domains and ports
app.use(cors())

// convert json string to json object (from request)
app.use(express.json())

const mongoose = require('mongoose')
const mongoDB = 'mongodb+srv://Jiku:R1i2k3u4.@fullstack-exercises.rmrk5sk.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log("Database test connected")
})

// scheema
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true } 
  })
  
  // model
  const Todo = mongoose.model('Todo', todoSchema, 'todos')
  
  app.post('/todos', async (request, response) => {
    const { text } = request.body
    const todo = new Todo({
      text: text
    })
    const savedTodo = await todo.save()
    response.json(savedTodo)  
  })
// todos-route

app.get('/todos', async (request, response) => {
    const todos = await Todo.find({})
    response.json(todos)
  })

  app.get('/todos/:id', async (request, response) => {
    const todo = await Todo.findById(request.params.id)
    if (todo) response.json(todo)
    else response.status(404).end()
  })

  app.delete('/todos/:id', async (request, response) => {
    const deletedTodo = await Todo.findByIdAndDelete(request.params.id)
    if (deletedTodo) response.json(deletedTodo)
    else response.status(404).end()
  })

  app.put('/todos/:id', async (request, response) => {
    const { id } = request.params;
    const { text } = request.body;
    const updatedTodo = await Todo.findByIdAndUpdate(id, { text }, { new: true });
    if (updatedTodo)response.json(updatedTodo);
    else response.status(404).end();
  });

// app listen port 3000
app.listen(port, () => {
  console.log('Example app listening on port 3000')
})