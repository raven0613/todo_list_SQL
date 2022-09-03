const express = require('express');
const router = express.Router();
const home = require('./module/home');
const todo = require('./module/todo');
const user = require('./module/user');


router.use('/todos' , todo);
router.use('/users' , user);
router.use('/' , home);


module.exports = router;