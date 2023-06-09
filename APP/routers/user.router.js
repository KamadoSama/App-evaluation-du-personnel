const express = require('express')
const authentificate = require("../middleware/authentification.js")
const router = express.Router()
const controllerUser = require("../controllers/user.controller.js")

router.post('/register',controllerUser.registerUser);
router.post('/login',controllerUser.loginUser);
router.post('/logout',controllerUser.logoutUser);
router.post('/delete',controllerUser.deleteUser);
router.patch('/:id',controllerUser.deleteUser);
router.get('/listEmploye',authentificate.isAuthenticated,controllerUser.getAllUser);
router.get('/listEmployeAdmin',controllerUser.getAllUserForAdmin);

module.exports = router