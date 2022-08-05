const express = require('express');
const router = express.Router();
const control = require('./user.controller')

//route
router.post('/login', control.login);
router.post('/register', control.register);
router.get('/getall', control.getAll);
router.get('/getcurrent', control.getCurrent);
router.get('/getbyid/:id', control.getById);
router.put('/updatebyid/:id', control.updateById);
router.delete('/deletebyid/:id', control.deleteById);


module.exports = router;