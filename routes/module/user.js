const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcryptjs')

const db = require('../../models')
const User = db.User



//get 登入頁面
router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    req.flash('warning_msg' , '您已經是登入狀態')
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
    req.flash('warning_msg' , '請先登出再註冊')
    return res.redirect('/');
  }
  res.render('register')
})

//註冊功能
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = [];

  //沒有填寫所有資料
  if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
    errors.push({ message : '所有欄位都是必填' })
  }
  //密碼輸入不一致
  if (password !== confirmPassword) {
    errors.push({ message : '密碼與確認密碼不相符' })
  }

  // 檢查使用者是否已經註冊
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      errors.push({ message : '這個 email 已經註冊過了' })
      return res.render('register', {
        name,
        email,
        errors
      })
    }
    //如果 errors 有東西
    else if (errors.length) {
      return res.render('register' , {
        errors , name , email
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
      .then(() => {
        req.flash('success_msg' , '註冊成功，請重新登入')
        return res.redirect('/users/login')
      })
      .catch(err => console.log(err))
  })
})


router.get('/logout', (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('warning_msg' , '請先登入您的帳號')
    return res.redirect('/users/login');
  }
  req.logout();
  res.redirect('/users/login');
})




module.exports = router;