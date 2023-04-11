const express = require('express')

const router = express.Router()
const controllerUser = require("../controllers/user.controller.js")

router.post('/register',controllerUser.registerUser);
router.post('/login',controllerUser.loginUser);
router.get('/logout',controllerUser.logoutUser);
router.delete('/:id',controllerUser.deleteUser);
router.patch('/:id',controllerUser.deleteUser);
router.get('/all',controllerUser.getAllUser);
router.get('/dashboard',controllerUser.dashboard);

module.exports = router