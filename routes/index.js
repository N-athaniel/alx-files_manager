// Import necessary modules and controllers
import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

// Create a new router object
const router = express.Router();

// Define a function that sets up the routes for the app
const routeController = (app) => {
  // Use the router for the app
  app.use('/', router);

  // Define route for getting the status of the app
  router.get('/status', (req, res) => {
    AppController.getStatus(req, res);
  });

  // Define route for getting the stats of the app
  router.get('/stats', (req, res) => {
    AppController.getStats(req, res);
  });

  // Define route for creating a new user
  router.post('/users', (req, res) => {
    UsersController.postNew(req, res);
  });

  // Define route for connecting a user
  router.get('/connect', (req, res) => {
    AuthController.getConnect(req, res);
  });

  // Define route for disconnecting a user
  router.get('/disconnect', (req, res) => {
    AuthController.getDisconnect(req, res);
  });

  // Define route for getting the current user
  router.get('/users/me', (req, res) => {
    UsersController.getMe(req, res);
  });

  // Define route for uploading a file
  router.post('/files', (req, res) => {
    FilesController.postUpload(req, res);
  });

  // Define route for getting a specific file
  router.get('/files/:id', (req, res) => {
    FilesController.getShow(req, res);
  });

  // Define route for getting all files
  router.get('/files', (req, res) => {
    FilesController.getIndex(req, res);
  });

  // Define route for publishing a file
  router.put('/files/:id/publish', (req, res) => {
    FilesController.putPublish(req, res);
  });

  // Define route for unpublishing a file
  router.put('/files/:id/unpublish', (req, res) => {
    FilesController.putUnpublish(req, res);
  });

  // Define route for getting the data of a file
  router.post('/files/:id/data', (req, res) => {
    FilesController.getFile(req, res);
  });
};

// Export the route controller
export default routeController;
const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController')

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
module.exports = router;
