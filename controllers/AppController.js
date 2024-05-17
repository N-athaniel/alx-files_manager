// Importing the redis client from the utils directory
import redisClient from '../utils/redis';
// Importing the database client from the utils directory
import dbClient from '../utils/db';

// Defining the AppController class
class AppController {
  // Method to get the status of the redis and database clients
  static getStatus(request, response) {
    try {
      // Checking if the redis client is alive
      const redis = redisClient.isAlive();
      // Checking if the database client is alive
      const db = dbClient.isAlive();
      // Sending the status of the redis and database clients as a response
      response.status(200).send({ redis, db });
    } catch (error) {
      // Logging any error that occurs
      console.log(error);
    }
  }

  // Method to get the statistics of the users and files in the database
  static async getStats(request, response) {
    try {
      // Getting the number of users in the database
      const users = await dbClient.nbUsers();
      // Getting the number of files in the database
      const files = await dbClient.nbFiles();
      // Sending the number of users and files as a response
      response.status(200).send({ users, files });
    } catch (error) {
      // Logging any error that occurs
      console.log(error);
    }
  }
}

// Exporting the AppController class as a module
export default AppController;
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');
console.log(redisClient);

const AppController = {
  /* An object whose methods checks the status of the app databases */
  getStatus(req, res) {
    redisStatus = redisClient.isAlive();
    dbStatus = dbClient.isAlive();
    if (redisStatus && dbStatus) {
      res.json({ "redis": true, "db": true }).status(200);
  }
  },

  async getStats(req, res) {
    const nbUsers =  await dbClient.nbUsers();
    const nbFiles =  await dbClient.nbFiles();
    console.log(`{ "users": ${nbUsers}, "files": ${nbFiles}`)
  }
}

module.exports = AppController;
