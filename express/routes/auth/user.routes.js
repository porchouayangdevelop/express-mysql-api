const router = require('express').Router();
const {
    register,
    login,
    getUser,
    getUsers,
    updateUser,
    deleteUser
} = require('../../controllers/auth/user.controller');


router.post('/register', register);
router.post('/login', login);
router.get('/', getUsers);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);


module.exports = router;