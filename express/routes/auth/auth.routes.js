const router = require('express').Router();

const authController = require('../../controllers/auth/auth.controller');

router.route('/')
    .post(authController.created)
    .get(authController.getAlls);
router.route('/:id')
    .get(authController.getOne)
    .put(authController.update)
    .delete(authController.delete);
module.exports = router;