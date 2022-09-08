const express = require('express')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const session = require('express-session')
const usePassport = require('./config/passport')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const app = express()
const PORT = process.env.PORT;
const routes = require('./routes');
const flash = require('connect-flash');



app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(flash())
usePassport(app)


app.use((req , res , next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;

  res.locals.success_msg = req.flash('success_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  next();
})

app.use(routes);

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})