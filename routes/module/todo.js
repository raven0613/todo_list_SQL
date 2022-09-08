const express = require('express');
const router = express.Router();

const db = require('../../models')
const Todo = db.Todo
const User = db.User


//進入 new page
router.get('/new', (req, res) => {
  return res.render('new');
})


//進入 detail page
router.get('/:id', (req, res) => {
  const id = req.params.id

  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

//進入 edit page
router.get('/:id/edit', (req, res) => {
  const id = req.params.id;

  return Todo.findByPk(id)
  .then(todo => {
    return res.render('edit' , {todo : todo.toJSON()});
  })
})

//put edit 結果
router.put('/:id', (req, res) => {
  const id = req.params.id
  const {name , isDone} = req.body

  return Todo.findByPk(id)
      .then(todo => {
          todo.name = name
          todo.isDone = isDone === 'on'
          return todo.save()
      })
      .then(() => res.redirect(`/todos/${id}`))
      .catch(error => console.log(error))
})

//等等做認證再找 user
//delete
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  return Todo.findByPk(id)
      .then(todo => {
          todo.daletedAt = new Date()
          return todo.save()
      })
  .then(() => res.redirect('/users/login'))
  .catch(error => console.log(error))
    

})

module.exports = router;