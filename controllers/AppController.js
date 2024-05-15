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
