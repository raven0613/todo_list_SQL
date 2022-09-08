const express = require('express');
const router = express.Router();

const db = require('../../models')
const Todo = db.Todo
const User = db.User


//進入 new page
router.get('/new', (req, res) => {
  return res.render('new');
})

//post new
router.post('/' , (req , res) => {
  const UserId = req.user.id;
  const {name , isDone} = req.body;

  return Todo.create({
    name , isDone , UserId
  })
  .then(() => res.redirect(`/`))
  .catch(error => console.log(error))
})


//進入 detail page
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const UserId = req.user.id;

  return Todo.findOne({ where : { id , UserId }})
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})



//進入 edit page
router.get('/:id/edit', (req, res) => {
  const id = req.params.id;
  const UserId = req.user.id;

  return Todo.findOne({ where : { id , UserId }})
  .then(todo => {
    return res.render('edit' , {todo : todo.toJSON()});
  })
})

//put edit 結果
router.put('/:id', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id;
  const {name , isDone} = req.body

  return Todo.findOne({ where : { id , UserId }})
      .then(todo => {
          todo.name = name
          todo.isDone = isDone === 'on'
          return todo.save()
      })
      .then(() => res.redirect(`/`))
      .catch(error => console.log(error))
})


//delete
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const UserId = req.user.id;

  return Todo.findOne({ where : { id , UserId }})
      .then(todo => {
          return todo.destroy();
      })
  .then(() => res.redirect('/'))
  .catch(error => console.log(error))
    

})

module.exports = router;