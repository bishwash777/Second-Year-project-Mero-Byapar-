const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getLogProof
} = require('../controller/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', getAllUsers);
router.get('/user/:id', getUserById);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);
router.get('/logproof', getLogProof);

module.exports = router;