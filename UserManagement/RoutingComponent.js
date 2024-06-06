const express = require("express");
const router = express.Router();
const { UserController } = require('./UserController');
user_cont = new UserController();

router.post('/user/create', user_cont.addNewUser);
router.get('/user/login/:user?/:password?', user_cont.verifyUserLogin);
router.put('/user/change_password', user_cont.changePassword);
router.put('/user/change_access', user_cont.changeAccess);
router.delete('/user/delete', user_cont.deleteUser);

module.exports = router;

