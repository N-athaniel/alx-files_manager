// Import necessary modules and controllers
import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';

// Create a new router object
const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.get('/users/me', UsersController.getMe);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);

module.exports = router;
