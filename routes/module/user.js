const express = require('express');
const passport = require('passport');
const router = express.Router();

const db = require('../../models')
const Todo = db.Todo
const User = db.User



//get 登入頁面
router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('login')
})



//登入功能
router.post('/login', passport.authenticate('local' , {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))



//get 註冊頁面
router.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('register')
})

//註冊功能
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      console.log('User already exists')
      return res.render('register', {
        name,
        email,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})


router.get('/logout', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login');
  }
  req.logout();
  res.redirect('/users/login');
})




module.exports = router;