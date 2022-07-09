const express = require('express');
const userControllers = require('../controllers/userControllers');
const router = express.Router();

// POST request SignUp user & Create cookie
router.post('/signup', userControllers.signupUser);
// GET ALL Users
router.get('/all', userControllers.getAllUsers);
// GET user By Id
router.get('/:id', userControllers.getUserById);

//PATCH update user
router.patch('/update', userControllers.updateUserbyId);

// delete request Delete by Id
router.delete('/', userControllers.deleteUserById);
module.exports = router;
