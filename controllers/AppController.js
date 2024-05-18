import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const AppController = {
  // Method to get the status of the redis and database clients
  getStatus(request, response) {
    try {
      const redisAlive = redisClient.isAlive();
      const dbAlive = dbClient.isAlive();
      if (redisAlive && dbAlive) {
        response.json({ "redis": true, "db": true }).status(200);
      }
    } 
    catch (error) {
      console.log(error);
    }
  },

  // Method to get the statistics of the users and files in the database
  async getStats(req, res) {
    const nbUsers =  await dbClient.nbUsers();
    const nbFiles =  await dbClient.nbFiles();
    res.json({ "users": nbUsers, "files": nbFiles}).status(200);
  }
}

module.exports = AppController;
