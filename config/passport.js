if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User


module.exports = app => {

  //初始化
  app.use(passport.initialize())
  app.use(passport.session())


  //登入策略
  passport.use(new LocalStrategy({ usernameField: 'email' , passReqToCallback : true }, (req , email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          req.flash('warning_msg' , 'email 或 密碼不正確');
          return done(null, false, { message: 'That email is not registered!' })
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            req.flash('warning_msg' , 'email 或 密碼不正確');
            return done(null, false, { message: 'Email or Password incorrect.' })
          }
          req.flash('success_msg' , '登入成功');
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  }))

    //facebook登入
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email' , 'displayName'],
    passReqToCallback : true
  } , (req , accessToken, refreshToken, profile, done) => {
    const {name , email} = profile._json;
    const randomPassword = Math.random().toString(36).slice(-8)

    User.findOne({where : { email }})
    .then(user => {
      if (!user) {
        return bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(randomPassword , salt))
        .then(hash => {
          return User.create({ name , email , password : hash })
        })
        .then(user => {
          req.flash('success_msg' , '登入成功');
          done(null , user)
        })
        .catch(err => done(err , false))
      }
      req.flash('success_msg' , '登入成功');
      return done(null , user)
    })
    .catch(err => done(err , false))

  }))

  //序列與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then((user) => {
        user = user.toJSON()
        done(null, user)
      }).catch(err => done(err, null))
  })
}