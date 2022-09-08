const express = require('express');
const router = express.Router();
const home = require('./module/home');
const todo = require('./module/todo');
const user = require('./module/user');
const {authenticator} = require('../middleware/auth');

router.use('/todos' , authenticator , todo);
router.use('/users' , user);
router.use('/' , authenticator , home);


module.exports = router;