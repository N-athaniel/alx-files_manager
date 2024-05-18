// Import necessary modules and controllers
import express from 'express';
import AppController from '../controllers/AppController';

// Create a new router object
const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

module.exports = router;
